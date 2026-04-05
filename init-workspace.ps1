# Workshop Workspace Initialisation Script
# Run this once before the workshop starts.
# Usage: .\init-workspace.ps1

Write-Host "Initialising workshop workspace..."

$folders = @(
    "docs\work-items\epics",
    "docs\work-items\features",
    "docs\work-items\stories",
    "docs\design",
    "docs\reports",
    "issues"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
}

Write-Host "Workspace folders created:"
foreach ($folder in $folders) {
    Write-Host "  $folder"
}

Write-Host ""
Write-Host "Next step: Update docs\ado-sync-config.json with your ADO settings."
Write-Host "Then open VS Code and invoke @brd-agent to begin."
