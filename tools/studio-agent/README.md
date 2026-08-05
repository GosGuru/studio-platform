# Studio agent bridge

This local JSON client lets Codex Desktop read and update the authenticated
`studio-platform` database without signing a Codex account into the website.
It never sends outreach messages.

## Prepared, not activated

The bridge remains inactive until migration `0010_agent_operations.sql` is
reviewed against the hosted Supabase catalog and explicitly applied. No remote
database was changed while creating this integration.

After activation, create a revocable credential from the authenticated admin
token endpoint. The raw token is returned once. Keep it outside Git and never
paste it into chat, logs, screenshots, or source files.

```powershell
$env:STUDIO_AGENT_URL = "http://localhost:3001/api/agent/commands"
$env:STUDIO_AGENT_TOKEN = "spa_REDACTED"

@'
{
  "command": "list",
  "data": { "resource": "tasks", "status": "todo", "limit": 50 }
}
'@ | node tools/studio-agent/studio-agent.mjs
```

Discover the commands granted to the current credential without sending a
request body:

```powershell
node tools/studio-agent/studio-agent.mjs capabilities
```

Mutations require a globally unique idempotency key:

```powershell
@'
{
  "idempotency_key": "codex-task-2026-08-05-001",
  "command": "update",
  "data": {
    "resource": "tasks",
    "id": "00000000-0000-0000-0000-000000000000",
    "values": { "status": "done" }
  }
}
'@ | node tools/studio-agent/studio-agent.mjs
```

Supported resources are `clients`, `projects`, `tasks`, `goals`, `deals`, and
`prospects`. Supported commands are `list`, `create`, and `update`. Deletes,
credential management, deployments, finance mutations, and message sending are
not available through this bridge. Capability discovery is authenticated and
only advertises commands allowed by the credential's scopes.

The API derives the owner and actor from the revocable credential. User IDs,
roles, and actor identities sent inside command data are rejected by the strict
resource schemas. Each request is recorded in `agent_operations`; mutation
retries use the operation's idempotency key and fail closed while an operation
is still pending.

The client accepts plain HTTP only for loopback hosts. Remote API URLs must use
HTTPS. Use `--input path/to/request.json` instead of stdin when useful.
