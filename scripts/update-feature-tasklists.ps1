# Update Feature tasklists with child Stories
$ErrorActionPreference = "Stop"
$ORG = "octodemo"
$REPO = "Inventory-Management-app"

$storyState = Get-Content "docs/.temp-story-state.json" -Raw | ConvertFrom-Json

# Group stories by feature
$storiesByFeature = @{}
foreach ($storyId in $storyState.stories.PSObject.Properties.Name) {
    $story = $storyState.stories.$storyId
    $featureId = $story.feature
    if (-not $storiesByFeature.ContainsKey($featureId)) {
        $storiesByFeature[$featureId] = @()
    }
    $storiesByFeature[$featureId] += $story
}

# Load feature state to get feature numbers
$featureState = Get-Content "docs/.temp-feature-state.json" -Raw | ConvertFrom-Json
$featureMap = @{}
foreach ($fid in $featureState.features.PSObject.Properties.Name) {
    $featureMap[$fid] = $featureState.features.$fid.issueNumber
}

foreach ($featureId in $storiesByFeature.Keys) {
    $featureNumber = $featureMap[$featureId]
    $stories = $storiesByFeature[$featureId]
    
    if (-not $featureNumber) { continue }
    
    Write-Host "Updating Feature #$featureNumber with $($stories.Count) stories..." -ForegroundColor Cyan
    
    $currentBody = gh issue view $featureNumber --repo "$ORG/$REPO" --json body --jq .body
    $tasklistLines = $stories | ForEach-Object { "- [ ] #$($_.issueNumber) $($_.title)" }
    $tasklist = $tasklistLines -join "`n"
    $newBody = $currentBody -replace '(?s)(## Child Stories\s*)<!--.*?-->', "`$1$tasklist"
    
    $tempFile = New-TemporaryFile
    $newBody | Out-File $tempFile.FullName -Encoding UTF8 -NoNewline
    gh issue edit $featureNumber --repo "$ORG/$REPO" --body-file $tempFile.FullName
    Remove-Item $tempFile
    
    Write-Host "  ✓ Updated Feature #$featureNumber" -ForegroundColor Green
}

Write-Host "`n✓ All Feature tasklists updated" -ForegroundColor Green
