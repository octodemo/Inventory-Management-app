# Update Epic tasklists with child Features
$ErrorActionPreference = "Stop"
$ORG = "octodemo"
$REPO = "Inventory-Management-app"

# Load feature state
$featureState = Get-Content "docs/.temp-feature-state.json" -Raw | ConvertFrom-Json

# Group features by epic
$featuresByEpic = @{}
foreach ($featureId in $featureState.features.PSObject.Properties.Name) {
    $feature = $featureState.features.$featureId
    $epicId = $feature.epic
    if (-not $featuresByEpic.ContainsKey($epicId)) {
        $featuresByEpic[$epicId] = @()
    }
    $featuresByEpic[$epicId] += $feature
}

# Epic mapping
$epicMap = @{
    "epic-01" = 3; "epic-02" = 4; "epic-03" = 5; "epic-04" = 6
    "epic-05" = 7; "epic-06" = 8; "epic-07" = 9
}

# Update each epic
foreach ($epicId in $epicMap.Keys) {
    $epicNumber = $epicMap[$epicId]
    $features = $featuresByEpic[$epicId]
    
    if (-not $features) { continue }
    
    Write-Host "Updating Epic #$epicNumber with $($features.Count) features..." -ForegroundColor Cyan
    
    # Get current epic body
    $currentBody = gh issue view $epicNumber --repo "$ORG/$REPO" --json body --jq .body
    
    # Replace the Child Features section
    $tasklistLines = $features | ForEach-Object { "- [ ] #$($_.issueNumber) $($_.title)" }
    $tasklist = $tasklistLines -join "`n"
    
    $newBody = $currentBody -replace '(?s)(## Child Features\s*)<!--.*?-->', "`$1$tasklist"
    
    # Update the issue
    $tempFile = New-TemporaryFile
    $newBody | Out-File $tempFile.FullName -Encoding UTF8 -NoNewline
    gh issue edit $epicNumber --repo "$ORG/$REPO" --body-file $tempFile.FullName
    Remove-Item $tempFile
    
    Write-Host "  ✓ Updated Epic #$epicNumber" -ForegroundColor Green
}

Write-Host "`n✓ All Epic tasklists updated" -ForegroundColor Green
