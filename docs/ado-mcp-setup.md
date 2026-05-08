# Azure DevOps MCP Setup Guide

> **Read this file before using `ado-sync-agent`.**
> This guide explains how to install, configure, authenticate, and verify
> the Azure DevOps (ADO) MCP server with GitHub Copilot in VS Code so that
> `ado-sync-agent` can create and update work items in Azure DevOps Boards.
>
> **Skip this guide entirely** if you are not syncing work items to Azure
> DevOps Boards. Every other agent in the workshop runs without ADO.

---

## What is the ADO MCP Server?

The Azure DevOps MCP (Model Context Protocol) server exposes ADO Boards
operations — create work item, link parent, update field, query iteration —
to AI agents as callable tools. When configured in VS Code, `ado-sync-agent`
uses these tools to push the local Epic → Feature → Story → Task hierarchy
into your ADO project.

The package used by this workshop is the official Microsoft package:
[`@azure-devops/mcp`](https://www.npmjs.com/package/@azure-devops/mcp).

---

## Prerequisites

| Requirement | Version / Notes |
|-------------|-----------------|
| Node.js | 18 or later (so `npx` can run the package) |
| VS Code | Latest |
| GitHub Copilot extension | Latest, signed in |
| Azure CLI **or** PAT | One of these is required for auth (see below) |
| ADO organisation + project | You must have permission to create work items |
| ADO iterations | Sprint 1, Sprint 2, Sprint 3 created under the project |

---

## Three Pieces You Must Configure

| File / Step | Purpose | Required? |
|---|---|---|
| `.vscode/mcp.json` | Registers and launches the MCP server in VS Code | **Yes** |
| `az login` (or PAT env var) | Authenticates the MCP server to ADO | **Yes** |
| `docs/ado-sync-config.json` | Tells `ado-sync-agent` which project / area / iteration to write to | **Yes** |

Configuring only `docs/ado-sync-config.json` is **not** enough — that file
only routes the work items, it does not start or authenticate the server.

---

## Step 1 — Configure the MCP server

Open `.vscode/mcp.json` in the workspace root. It ships with a placeholder:

```json
{
  "servers": {
    "azure-devops": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@azure-devops/mcp", "ENTER-ADO-ORGNAME-HERE"]
    }
  }
}
```

Replace `ENTER-ADO-ORGNAME-HERE` with your **organisation slug only** —
not the full URL.

| Org URL | Slug to use |
|---|---|
| `https://dev.azure.com/contoso` | `contoso` |
| `https://dev.azure.com/fabrikam-eng` | `fabrikam-eng` |

Example after editing:

```json
"args": ["-y", "@azure-devops/mcp", "contoso"]
```

> The `-y` flag tells `npx` to install the package on first run without
> prompting. The first launch may take 30–60 seconds while the package
> downloads.

---

## Step 2 — Authenticate

The `@azure-devops/mcp` package supports two auth methods. Pick **one**.

### Option A — Azure CLI (recommended)

Install the Azure CLI if you don't have it, then log in once:

```powershell
az login
```

Verify your account can reach ADO:

```powershell
az account get-access-token --resource 499b84ac-1321-427f-aa17-267ca6975798
```

The MCP server picks up your CLI session automatically. Re-run `az login`
when the session expires (typically 24 hours).

### Option B — Personal Access Token (PAT)

Generate a PAT in ADO:

1. ADO → User settings (top right) → **Personal access tokens**
2. **+ New Token**
3. Scopes: **Work Items (Read & Write)** — minimum required
4. Expiry: set beyond your workshop date

Set the token as an environment variable **before launching VS Code**:

```powershell
# PowerShell — current session only
$env:AZURE_DEVOPS_EXT_PAT = "<paste-pat-here>"

# PowerShell — persist for your user
[Environment]::SetEnvironmentVariable("AZURE_DEVOPS_EXT_PAT", "<paste-pat-here>", "User")
```

```bash
# bash / zsh
export AZURE_DEVOPS_EXT_PAT="<paste-pat-here>"
```

Then launch VS Code from the same shell so the env var is inherited.

> Never commit a PAT to the repository. Treat it like a password.

---

## Step 3 — Configure the sync target

Edit `docs/ado-sync-config.json` so `ado-sync-agent` knows where to write:

```json
{
  "organization": "https://dev.azure.com/contoso",
  "project": "Healthcare-Booking",
  "areaPath": "Healthcare-Booking",
  "iterationRootPath": "Healthcare-Booking\\Sprint"
}
```

Field reference:

| Field | Value |
|---|---|
| `organization` | Full ADO organisation URL |
| `project` | Project name (case-sensitive, exact match) |
| `areaPath` | Area path for new work items. Use the project name if no sub-area exists |
| `iterationRootPath` | Prefix for iteration paths. The agent appends ` 1`, ` 2`, ` 3` etc. — so `Healthcare-Booking\Sprint` resolves to `Healthcare-Booking\Sprint 1` |

The org slug in `.vscode/mcp.json` (e.g. `contoso`) and the URL in
`ado-sync-config.json` (e.g. `https://dev.azure.com/contoso`) **must point
to the same organisation**, otherwise the agent will write to a project the
MCP server isn't connected to.

---

## Step 4 — Start the server in VS Code

1. Open the workspace in VS Code.
2. Open the **Command Palette** → `MCP: List Servers`.
3. Select **azure-devops** → **Start Server**.
4. Open the **Output** panel → choose the **MCP — azure-devops** channel
   and confirm there are no startup errors.

---

## Step 5 — Verify the server is connected

In Copilot Chat (Ask mode), run:

> List my Azure DevOps projects

If the response includes your project, all three pieces are wired up
correctly. You can also confirm the `azure-devops` tool group appears in
the Copilot Chat tools picker (the wrench icon in the chat input).

---

## Available Tool Categories

When the ADO MCP server is running, these tool groups are exposed to the
agent. Exact names may differ slightly between package versions.

| Category | Used by `ado-sync-agent` for |
|---|---|
| `core_*` | Listing projects, teams, identities |
| `wit_*` | Creating, updating, linking, and reading Work Items |
| `work_*` | Listing iterations, assigning iteration paths |
| `repo_*` | (Not used by sync — repo operations) |

`ado-sync-agent` primarily uses `wit_create_work_item`,
`wit_update_work_item`, `wit_work_items_link`, and `work_list_team_iterations`.

---

## Two-Pass Sync Behaviour

`ado-sync-agent` runs in two optional passes against the same ADO project.
Both are idempotent via `docs/ado-sync-state.json` — re-running never
creates duplicates.

| Pass | When | What it does |
|---|---|---|
| 1st | After `task-agent` | Creates Epic → Feature → Story → Task hierarchy with parent-child links. Leaves Remaining Work and Iteration Path blank. |
| 2nd | After `sprint-planning-agent` | Updates Remaining Work (from estimates) and Iteration Path (from sprint plan) on already-synced items. Creates and links any new local items added since pass 1. |

To re-sync from scratch, delete `docs/ado-sync-state.json` and any matching
work items in ADO before re-running.

---

## Troubleshooting

### MCP server fails to start

Run the package manually to surface npm or auth errors:

```powershell
npx -y @azure-devops/mcp contoso
```

Common causes: Node.js < 18; offline / proxy blocks npm; org slug typo.

### `List my projects` returns 401 / 403

- PAT expired or missing **Work Items (Read & Write)** scope
- `az login` session expired — run `az login` again
- The signed-in account does not have access to the ADO organisation

### `azure-devops` tool group missing in Copilot Chat

1. Check `.vscode/mcp.json` is valid JSON
2. Command Palette → `Developer: Reload Window`
3. Command Palette → `MCP: List Servers` → confirm `azure-devops` shows **Started**
4. Check the Output panel → `MCP — azure-devops` for stderr

### Agent writes to the wrong project

The org slug in `.vscode/mcp.json` must match the org URL in
`docs/ado-sync-config.json`. The MCP server only sees the org passed as its
CLI argument.

### Iteration path not found during 2nd pass

Sprints must exist in ADO before sync. Create iterations under
**Project Settings → Project configuration → Iterations** so paths like
`Healthcare-Booking\Sprint 1`, `Healthcare-Booking\Sprint 2`,
`Healthcare-Booking\Sprint 3` resolve.

### Re-running `ado-sync-agent` creates duplicates

Either `docs/ado-sync-state.json` was deleted while the work items still
exist in ADO, or the local work item file was renamed. Delete the
duplicates in ADO, restore or rebuild `ado-sync-state.json`, and re-run.

### PAT not picked up

- Confirm `$env:AZURE_DEVOPS_EXT_PAT` is set in the **same shell** that
  launched VS Code
- VS Code launched from Start Menu inherits the **User**-scoped env var
  only — set it with `[Environment]::SetEnvironmentVariable(..., "User")`
  and restart VS Code

---

## Security Notes

- Never commit `AZURE_DEVOPS_EXT_PAT` or any PAT value to the repo
- Prefer `az login` over PATs for facilitator machines
- Set PAT expiry to the minimum needed (workshop date + a few days)
- Revoke the PAT in ADO once the workshop is complete

---

## Quick Reference

```
1. Edit  .vscode/mcp.json          → replace ENTER-ADO-ORGNAME-HERE
2. Run   az login                  → (or set AZURE_DEVOPS_EXT_PAT)
3. Edit  docs/ado-sync-config.json → org URL, project, area, iteration root
4. VS Code → MCP: List Servers     → start azure-devops
5. Copilot Chat → "List my Azure DevOps projects" → verify
6. Run   ado-sync-agent            → 1st pass (after task-agent)
7. Run   ado-sync-agent            → 2nd pass (after sprint-planning-agent)
```
