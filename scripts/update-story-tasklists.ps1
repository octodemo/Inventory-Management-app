# Update User Story tasklists with child Tasks
$ErrorActionPreference = "Stop"
$ORG = "octodemo"
$REPO = "Inventory-Management-app"

$taskState = Get-Content "docs/.temp-task-state.json" -Raw | ConvertFrom-Json

# Group tasks by user story
$tasksByStory = @{}
foreach ($taskId in $taskState.tasks.PSObject.Properties.Name) {
    $task = $taskState.tasks.$taskId
    $storyId = $task.userStory
    if (-not $tasksByStory.ContainsKey($storyId)) {
        $tasksByStory[$storyId] = @()
    }
    $tasksByStory[$storyId] += $task
}

# Load story state to get story numbers
$storyState = Get-Content "docs/.temp-story-state.json" -Raw | ConvertFrom-Json
$storyMap = @{}
foreach ($sid in $storyState.stories.PSObject.Properties.Name) {
    $storyMap[$sid] = $storyState.stories.$sid.issueNumber
}

$updateCount = 0
foreach ($storyId in $tasksByStory.Keys) {
    $storyNumber = $storyMap[$storyId]
    $tasks = $tasksByStory[$storyId]
    
    if (-not $storyNumber) { continue }
    
    Write-Host "Updating Story #$storyNumber with $($tasks.Count) tasks..." -ForegroundColor Cyan
    
    $currentBody = gh issue view $storyNumber --repo "$ORG/$REPO" --json body --jq .body
    $tasklistLines = $tasks | ForEach-Object { "- [ ] #$($_.issueNumber) $($_.title)" }
    $tasklist = $tasklistLines -join "`n"
    $newBody = $currentBody -replace '(?s)(## Child Tasks\s*)<!--.*?-->', "`$1$tasklist"
    
    $tempFile = New-TemporaryFile
    $newBody | Out-File $tempFile.FullName -Encoding UTF8 -NoNewline
    gh issue edit $storyNumber --repo "$ORG/$REPO" --body-file $tempFile.FullName
    Remove-Item $tempFile
    
    $updateCount++
    if ($updateCount % 10 -eq 0) {
        Write-Host "  Progress: $updateCount stories updated..." -ForegroundColor Gray
    }
}

Write-Host "`n✓ Updated $updateCount User Story tasklists" -ForegroundColor Green
