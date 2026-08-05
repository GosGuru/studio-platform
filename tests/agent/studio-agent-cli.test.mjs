import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const cliUrl = new URL(
  "../../tools/studio-agent/studio-agent.mjs",
  import.meta.url,
);

function runCli(input, env, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [fileURLToPath(cliUrl), ...args], {
      env: { ...process.env, ...env },
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", reject);
    child.on("close", (code) => resolve({ code, stdout, stderr }));
    child.stdin.end(input === undefined ? "" : JSON.stringify(input));
  });
}

function capabilityResponse(
  commands = [{ name: "list", required_scope: "read" }],
) {
  const resources = [
    "clients",
    "projects",
    "tasks",
    "goals",
    "deals",
    "prospects",
  ];
  return {
    contract_version: "1.0",
    resources,
    commands: commands.map((command) => ({ ...command, resources })),
    denials: [
      "delete",
      "finance",
      "send_outreach",
      "deploy",
      "arbitrary_network",
    ].map((capability) => ({ capability, reason: "not_supported" })),
  };
}

test("local bridge forwards structured JSON and bearer token without logging it", async () => {
  let captured;
  const server = createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    captured = {
      authorization: request.headers.authorization,
      body: JSON.parse(Buffer.concat(chunks).toString("utf8")),
    };
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({
        ok: true,
        data: { resource: "tasks", records: [] },
      }),
    );
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  const token = "spa_test_secret_that_must_not_be_logged_123456";
  const result = await runCli(
    { command: "list", data: { resource: "tasks", limit: 5 } },
    {
      STUDIO_AGENT_TOKEN: token,
      STUDIO_AGENT_URL: `http://127.0.0.1:${address.port}/api/agent/commands`,
    },
  );
  server.close();
  assert.equal(result.code, 0);
  assert.equal(captured.authorization, `Bearer ${token}`);
  assert.equal(captured.body.command, "list");
  assert.doesNotMatch(result.stdout + result.stderr, new RegExp(token));
});

test("bridge discovers a strict scoped capability response with GET", async () => {
  let captured;
  const token = "spa_capability_secret_that_must_not_be_logged_123456";
  const server = createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    captured = {
      authorization: request.headers.authorization,
      method: request.method,
      path: request.url,
      body: Buffer.concat(chunks).toString("utf8"),
    };
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(capabilityResponse()));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  const result = await runCli(
    undefined,
    {
      STUDIO_AGENT_TOKEN: token,
      STUDIO_AGENT_URL: `http://127.0.0.1:${address.port}/api/agent/commands`,
    },
    ["capabilities"],
  );
  server.close();
  assert.equal(result.code, 0);
  assert.equal(captured.authorization, `Bearer ${token}`);
  assert.equal(captured.method, "GET");
  assert.equal(captured.path, "/api/agent/capabilities");
  assert.equal(captured.body, "");
  assert.match(result.stdout, /"contract_version":"1\.0"/);
  assert.doesNotMatch(result.stdout + result.stderr, new RegExp(token));
});

test("capability discovery rejects nested sensitive keys without printing them", async () => {
  const databaseUrl = "postgresql://owner:password@example.invalid/studio";
  const server = createServer((_request, response) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({
        ...capabilityResponse(),
        metadata: { env: { DATABASE_URL: databaseUrl } },
      }),
    );
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  const result = await runCli(
    undefined,
    {
      STUDIO_AGENT_TOKEN: "spa_test_secret_that_is_long_enough_123456",
      STUDIO_AGENT_URL: `http://127.0.0.1:${address.port}/api/agent/commands`,
    },
    ["capabilities"],
  );
  server.close();
  assert.equal(result.code, 1);
  assert.match(result.stdout, /unsafe_agent_response/);
  assert.doesNotMatch(
    result.stdout + result.stderr,
    /DATABASE_URL|postgresql:\/\//,
  );
});

test("bridge rejects nested sensitive command output and unrelated agent secrets", async () => {
  const unrelatedSecret = "spa_unrelated_server_secret_12345678901234567890";
  const server = createServer((_request, response) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({
        ok: true,
        data: {
          records: [
            {
              name: "Unexpected server record",
              nested: {
                SUPABASE_SERVICE_ROLE_KEY: "service-role-value",
                display_value: unrelatedSecret,
              },
            },
          ],
        },
      }),
    );
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  const result = await runCli(
    { command: "list", data: { resource: "tasks" } },
    {
      STUDIO_AGENT_TOKEN: "spa_current_client_token_12345678901234567890",
      STUDIO_AGENT_URL: `http://127.0.0.1:${address.port}/api/agent/commands`,
    },
  );
  server.close();
  assert.equal(result.code, 1);
  assert.match(result.stdout, /unsafe_agent_response/);
  assert.doesNotMatch(
    result.stdout + result.stderr,
    /SUPABASE_SERVICE_ROLE_KEY|service-role-value|spa_unrelated_server_secret/,
  );
});

test("bridge rejects hash keys and common credential values with a constant error", async () => {
  const hexSecret = "a".repeat(64);
  const stripeSecret = "sk_live_1234567890abcdefghijklmnop";
  const githubSecret = "ghp_1234567890abcdefghijklmnopqrstuv";
  const cases = [
    {
      name: "bare hash key",
      payload: {
        ok: true,
        data: {
          resource: "tasks",
          records: [{ hash: "internal-digest" }],
        },
      },
      forbidden: /hash|internal-digest/,
    },
    {
      name: "64 character hex value",
      payload: {
        ok: true,
        data: { resource: "tasks", records: [{ notes: hexSecret }] },
      },
      forbidden: new RegExp(hexSecret),
    },
    {
      name: "Stripe live secret in an error",
      payload: { error: stripeSecret },
      forbidden: /sk_live_/,
      status: 422,
    },
    {
      name: "nested unrelated GitHub secret",
      payload: {
        ok: true,
        data: {
          resource: "tasks",
          records: [{ nested: { display_value: githubSecret } }],
        },
      },
      forbidden: /ghp_1234567890/,
    },
  ];

  for (const scenario of cases) {
    const server = createServer((_request, response) => {
      response.writeHead(scenario.status ?? 200, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify(scenario.payload));
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    const result = await runCli(
      { command: "list", data: { resource: "tasks" } },
      {
        STUDIO_AGENT_TOKEN: "spa_current_client_token_12345678901234567890",
        STUDIO_AGENT_URL: `http://127.0.0.1:${address.port}/api/agent/commands`,
      },
    );
    server.close();
    assert.equal(result.code, 1, scenario.name);
    assert.equal(
      result.stdout,
      '{"ok":false,"error":"unsafe_agent_response"}\n',
      scenario.name,
    );
    assert.equal(result.stderr, "", scenario.name);
    assert.doesNotMatch(result.stdout + result.stderr, scenario.forbidden);
  }
});

test("bridge rejects nested password hash formats without printing them", async () => {
  const hashes = [
    "$2b$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    "$argon2id$v=19$m=65536,t=3,p=4$c2FsdA$aGFzaGVkLXZhbHVl",
    "$scrypt$ln=16,r=8,p=1$c2FsdA$aGFzaGVkLXZhbHVl",
    "pbkdf2_sha256$600000$salt$aGFzaGVkLXZhbHVl",
    "$6$salt$abcdefghijklmnopqrstuvxyz0123456789ABCDEFGHIJKLMN",
  ];

  for (const passwordHash of hashes) {
    const server = createServer((_request, response) => {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(
        JSON.stringify({
          ok: true,
          data: {
            resource: "clients",
            records: [
              {
                profile: {
                  arbitrary_display_value: passwordHash,
                },
              },
            ],
          },
        }),
      );
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    const result = await runCli(
      { command: "list", data: { resource: "clients" } },
      {
        STUDIO_AGENT_TOKEN: "spa_current_client_token_12345678901234567890",
        STUDIO_AGENT_URL: `http://127.0.0.1:${address.port}/api/agent/commands`,
      },
    );
    server.close();
    assert.equal(result.code, 1);
    assert.equal(
      result.stdout,
      '{"ok":false,"error":"unsafe_agent_response"}\n',
    );
    assert.equal(result.stderr, "");
    assert.equal((result.stdout + result.stderr).includes(passwordHash), false);
  }
});

test("bridge rejects unknown server error identifiers through a finite allowlist", async () => {
  for (const unknownError of [
    "PostgresConnectionTimeout",
    "SOME_UNKNOWN_IDENTIFIER",
  ]) {
    const server = createServer((_request, response) => {
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: unknownError }));
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    const result = await runCli(
      { command: "list", data: { resource: "tasks" } },
      {
        STUDIO_AGENT_TOKEN: "spa_current_client_token_12345678901234567890",
        STUDIO_AGENT_URL: `http://127.0.0.1:${address.port}/api/agent/commands`,
      },
    );
    server.close();
    assert.equal(result.code, 1);
    assert.equal(
      result.stdout,
      '{"ok":false,"error":"unsafe_agent_response"}\n',
    );
    assert.equal(result.stderr, "");
    assert.equal((result.stdout + result.stderr).includes(unknownError), false);
  }
});

test("capability discovery rejects unexpected response fields", async () => {
  const server = createServer((_request, response) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({ ...capabilityResponse(), extra: "not-allowed" }),
    );
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  const result = await runCli(
    undefined,
    {
      STUDIO_AGENT_TOKEN: "spa_test_secret_that_is_long_enough_123456",
      STUDIO_AGENT_URL: `http://127.0.0.1:${address.port}/api/agent/commands`,
    },
    ["capabilities"],
  );
  server.close();
  assert.equal(result.code, 1);
  assert.equal(result.stdout, '{"ok":false,"error":"unsafe_agent_response"}\n');
  assert.doesNotMatch(result.stdout, /not-allowed/);
});

test("capability discovery fails closed on authentication failure", async () => {
  const server = createServer((_request, response) => {
    response.writeHead(401, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "unauthorized" }));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  const result = await runCli(
    undefined,
    {
      STUDIO_AGENT_TOKEN: "spa_test_secret_that_is_long_enough_123456",
      STUDIO_AGENT_URL: `http://127.0.0.1:${address.port}/api/agent/commands`,
    },
    ["capabilities"],
  );
  server.close();
  assert.equal(result.code, 1);
  assert.match(result.stdout, /unauthorized/);
});

test("bridge refuses cleartext non-loopback destinations", async () => {
  const result = await runCli(
    { command: "list", data: { resource: "tasks" } },
    {
      STUDIO_AGENT_TOKEN: "spa_test_secret_that_is_long_enough_123456",
      STUDIO_AGENT_URL: "http://example.com/api/agent/commands",
    },
  );
  assert.equal(result.code, 1);
  assert.match(result.stdout, /unsafe_agent_url/);
});

test("bridge fails closed without a credential", async () => {
  const result = await runCli(
    { command: "list", data: { resource: "tasks" } },
    { STUDIO_AGENT_TOKEN: "" },
  );
  assert.equal(result.code, 1);
  assert.match(result.stdout, /missing_agent_token/);
});
