#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import process from "node:process";
import publicAgentErrorCodes from "../../apps/admin/app/lib/agent/public-error-codes.json" with { type: "json" };

const MAX_INPUT_BYTES = 1_000_000;
const MAX_RESPONSE_BYTES = 1_000_000;
const CAPABILITY_RESOURCES = [
  "clients",
  "projects",
  "tasks",
  "goals",
  "deals",
  "prospects",
];
const CAPABILITY_COMMAND_SCOPES = {
  list: "read",
  create: "write",
  update: "write",
};
const CAPABILITY_DENIALS = [
  "delete",
  "finance",
  "send_outreach",
  "deploy",
  "arbitrary_network",
];
const PUBLIC_AGENT_ERROR_CODES = new Set(publicAgentErrorCodes);

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function hasExactKeys(value, keys) {
  if (!isPlainObject(value)) return false;
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return (
    actual.length === expected.length &&
    actual.every((key, index) => key === expected[index])
  );
}

function sameStringArray(value, expected) {
  return (
    Array.isArray(value) &&
    value.length === expected.length &&
    value.every((item, index) => item === expected[index])
  );
}

function isCapabilitiesResponse(value) {
  if (
    !hasExactKeys(value, [
      "contract_version",
      "resources",
      "commands",
      "denials",
    ]) ||
    value.contract_version !== "1.0" ||
    !sameStringArray(value.resources, CAPABILITY_RESOURCES) ||
    !Array.isArray(value.commands) ||
    !Array.isArray(value.denials)
  ) {
    return false;
  }

  const commandNames = new Set();
  for (const command of value.commands) {
    if (
      !hasExactKeys(command, ["name", "required_scope", "resources"]) ||
      !(command.name in CAPABILITY_COMMAND_SCOPES) ||
      command.required_scope !== CAPABILITY_COMMAND_SCOPES[command.name] ||
      !sameStringArray(command.resources, CAPABILITY_RESOURCES) ||
      commandNames.has(command.name)
    ) {
      return false;
    }
    commandNames.add(command.name);
  }

  if (value.denials.length !== CAPABILITY_DENIALS.length) return false;
  return value.denials.every(
    (denial, index) =>
      hasExactKeys(denial, ["capability", "reason"]) &&
      denial.capability === CAPABILITY_DENIALS[index] &&
      denial.reason === "not_supported",
  );
}

function isSafeOperationId(value) {
  return (
    value === undefined ||
    (typeof value === "string" && value.length > 0 && value.length <= 100)
  );
}

function hasOnlyAllowedKeys(value, allowed) {
  return (
    isPlainObject(value) && Object.keys(value).every((key) => allowed.has(key))
  );
}

function isCommandResponse(value) {
  if (
    !hasOnlyAllowedKeys(
      value,
      new Set(["ok", "data", "error", "operation_id", "idempotent_replay"]),
    ) ||
    !isSafeOperationId(value.operation_id) ||
    (value.idempotent_replay !== undefined &&
      typeof value.idempotent_replay !== "boolean")
  ) {
    return false;
  }

  if (typeof value.error === "string") {
    return (
      PUBLIC_AGENT_ERROR_CODES.has(value.error) &&
      value.data === undefined &&
      (value.ok === undefined || value.ok === false)
    );
  }

  if (value.ok !== true || !isPlainObject(value.data)) return false;
  if (
    !hasOnlyAllowedKeys(
      value.data,
      new Set(["resource", "record", "records"]),
    ) ||
    !CAPABILITY_RESOURCES.includes(value.data.resource)
  ) {
    return false;
  }
  const hasRecord = isPlainObject(value.data.record);
  const hasRecords =
    Array.isArray(value.data.records) &&
    value.data.records.every(isPlainObject);
  return hasRecord !== hasRecords;
}

function normalizedKey(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .toLowerCase();
}

function isSensitiveKey(key) {
  const normalized = normalizedKey(key);
  const segments = normalized.split("_").filter(Boolean);
  if (
    segments.some((segment) =>
      [
        "token",
        "hash",
        "digest",
        "secret",
        "password",
        "key",
        "authorization",
        "cookie",
        "credential",
      ].includes(segment),
    )
  ) {
    return true;
  }
  return [
    "env",
    "environment",
    "database_url",
    "supabase_service_role_key",
    "api_key",
    "private_key",
    "detail",
    "details",
    "stack",
    "sql",
    "query",
    "database_error",
    "db_error",
  ].includes(normalized);
}

function isSensitiveString(value) {
  return (
    /\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}/.test(value) ||
    /\$argon2(?:id|i|d)\$[^\s]+/i.test(value) ||
    /(?:^|[^A-Za-z0-9])\$?scrypt(?:\$|:)[^\s]+/i.test(value) ||
    /\bpbkdf2(?:_[a-z0-9]+)?\$[^\s]+/i.test(value) ||
    /\{(?:PBKDF2|SSHA|SHA)\}[^\s]+/i.test(value) ||
    /\$(?:1|5|6|7|y|apr1|P|H)\$[./A-Za-z0-9=$,-]+/.test(value) ||
    /\bspa_[A-Za-z0-9_-]{20,}\b/.test(value) ||
    /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9_-]{8,}\b/.test(value) ||
    /\bwhsec_[A-Za-z0-9_-]{8,}\b/.test(value) ||
    /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/.test(value) ||
    /\bsb_(?:secret|publishable)_[A-Za-z0-9_-]{16,}\b/.test(value) ||
    /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/.test(
      value,
    ) ||
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(value) ||
    /\b[a-fA-F0-9]{64,}\b/.test(value) ||
    /\b[A-Za-z0-9+/_-]{80,}={0,2}\b/.test(value) ||
    /\b[a-z][a-z0-9+.-]*:\/\/[^\s/:@]+:[^\s/@]+@/i.test(value) ||
    /\bpostgres(?:ql)?:\/\//i.test(value) ||
    /\bBearer\s+\S+/i.test(value) ||
    /\b(?:DATABASE_URL|SUPABASE_SERVICE_ROLE_KEY|TOKEN_HASH)\s*[:=]/i.test(
      value,
    ) ||
    /\b(?:api[_-]?key|secret|password)\s*[:=]\s*\S+/i.test(value) ||
    /\b(?:set-cookie|cookie)\s*:/i.test(value)
  );
}

function containsSensitiveOutput(value) {
  if (typeof value === "string") return isSensitiveString(value);
  if (Array.isArray(value)) return value.some(containsSensitiveOutput);
  if (!isPlainObject(value)) return false;
  return Object.entries(value).some(
    ([key, child]) => isSensitiveKey(key) || containsSensitiveOutput(child),
  );
}

function failUnsafeResponse() {
  process.stdout.write('{"ok":false,"error":"unsafe_agent_response"}\n');
  process.exitCode = 1;
}

function redact(value, secret) {
  let output = JSON.stringify(value);
  if (!secret) return output;
  const encodedSecret = JSON.stringify(secret).slice(1, -1);
  output = output.split(secret).join("[REDACTED]");
  if (encodedSecret !== secret) {
    output = output.split(encodedSecret).join("[REDACTED]");
  }
  return output;
}

function fail(code, detail, status = 1, secret) {
  process.stdout.write(
    `${redact({ ok: false, error: code, detail }, secret)}\n`,
  );
  process.exitCode = status;
}

async function readInput() {
  const inputFlag = process.argv.indexOf("--input");
  let source;
  if (inputFlag >= 0) {
    const path = process.argv[inputFlag + 1];
    if (!path) throw new Error("missing_input_path");
    try {
      source = await readFile(path, "utf8");
    } catch {
      throw new Error("input_read_failed");
    }
  } else {
    const chunks = [];
    let size = 0;
    for await (const chunk of process.stdin) {
      size += chunk.length;
      if (size > MAX_INPUT_BYTES) throw new Error("input_too_large");
      chunks.push(chunk);
    }
    source = Buffer.concat(chunks).toString("utf8");
  }
  if (Buffer.byteLength(source, "utf8") > MAX_INPUT_BYTES) {
    throw new Error("input_too_large");
  }
  try {
    return JSON.parse(source);
  } catch {
    throw new Error("invalid_input");
  }
}

function agentUrl(operation) {
  let url;
  try {
    url = new URL(
      process.env.STUDIO_AGENT_URL ??
        "http://localhost:3001/api/agent/commands",
    );
  } catch {
    throw new Error("invalid_agent_url");
  }
  if (operation === "capabilities") {
    if (!/\/commands\/?$/.test(url.pathname)) {
      throw new Error("invalid_agent_url");
    }
    url.pathname = url.pathname.replace(/\/commands\/?$/, "/capabilities");
  }
  const isLocalHttp =
    url.protocol === "http:" &&
    ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  if (url.protocol !== "https:" && !isLocalHttp) {
    throw new Error("unsafe_agent_url");
  }
  if (url.username || url.password) throw new Error("unsafe_agent_url");
  return url;
}

async function main() {
  const token = process.env.STUDIO_AGENT_TOKEN;
  if (!token) throw new Error("missing_agent_token");
  const operation = process.argv.slice(2).includes("capabilities")
    ? "capabilities"
    : "command";
  const body = operation === "command" ? await readInput() : undefined;
  const url = agentUrl(operation);
  let response;
  try {
    response = await fetch(url, {
      method: operation === "capabilities" ? "GET" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(operation === "command"
          ? { "Content-Type": "application/json" }
          : {}),
        Accept: "application/json",
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      redirect: "error",
    });
  } catch {
    throw new Error("agent_request_failed");
  }
  const text = await response.text();
  if (Buffer.byteLength(text, "utf8") > MAX_RESPONSE_BYTES) {
    throw new Error("agent_response_too_large");
  }
  let result;
  try {
    result = JSON.parse(text);
  } catch {
    throw new Error(`invalid_agent_response:${response.status}`);
  }
  if (containsSensitiveOutput(result)) {
    throw new Error("unsafe_agent_response");
  }
  if (response.ok) {
    const validResponse =
      operation === "capabilities"
        ? isCapabilitiesResponse(result)
        : isCommandResponse(result);
    if (!validResponse) throw new Error("unsafe_agent_response");
  } else if (!isCommandResponse(result)) {
    throw new Error("unsafe_agent_response");
  }
  process.stdout.write(`${redact(result, token)}\n`);
  if (!response.ok) process.exitCode = 1;
}

main().catch((error) => {
  const candidate = error instanceof Error ? error.message : "request_failed";
  if (candidate === "unsafe_agent_response") {
    failUnsafeResponse();
    return;
  }
  const detail =
    /^(?:missing_agent_token|missing_input_path|input_too_large|input_read_failed|invalid_input|unsafe_agent_url|invalid_agent_url|agent_request_failed|agent_response_too_large|invalid_agent_response:\d{3})$/.test(
      candidate,
    )
      ? candidate
      : "request_failed";
  fail("studio_agent_failed", detail, 1, process.env.STUDIO_AGENT_TOKEN);
});
