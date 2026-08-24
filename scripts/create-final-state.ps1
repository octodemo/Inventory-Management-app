# Create final github-sync-state.json (updated to build epic mapping manually)
$ErrorActionPreference = "Stop"

# Manually create epic mapping (from our earlier gh issue create commands)
$epicMap = @{
    "epic-01" = @{ issueNumber = 3; title = "Epic 01: Inventory & Item Management"; issueUrl = "https://github.com/octodemo/Inventory-Management-app/issues/3" }
    "epic-02" = @{ issueNumber = 4; title = "Epic 02: Vendor Management"; issueUrl = "https://github.com/octodemo/Inventory-Management-app/issues/4" }
    "epic-03" = @{ issueNumber = 5; title = "Epic 03: Organizational Structure Management"; issueUrl = "https://github.com/octodemo/Inventory-Management-app/issues/5" }
    "epic-04" = @{ issueNumber = 6; title = "Epic 04: Usage Tracking & Recording"; issueUrl = "https://github.com/octodemo/Inventory-Management-app/issues/6" }
    "epic-05" = @{ issueNumber = 7; title = "Epic 05: Reporting & Analytics"; issueUrl = "https://github.com/octodemo/Inventory-Management-app/issues/7" }
    "epic-06" = @{ issueNumber = 8; title = "Epic 06: Data Management & Integration"; issueUrl = "https://github.com/octodemo/Inventory-Management-app/issues/8" }
    "epic-07" = @{ issueNumber = 9; title = "Epic 07: Access Control & Authentication"; issueUrl = "https://github.com/octodemo/Inventory-Management-app/issues/9" }
}

# Load existing temporary state files
$featureState = Get-Content "docs/.temp-feature-state.json" -Raw | ConvertFrom-Json
$storyState = Get-Content "docs/.temp-story-state.json" -Raw | ConvertFrom-Json
$taskState = Get-Content "docs/.temp-task-state.json" -Raw | ConvertFrom-Json

# Consolidate into final state
$finalState = @{
    syncDate = (Get-Date).ToString('o')
    organization = "octodemo"
    repository = "Inventory-Management-app"
    projectNumber = $null
    epics = $epicMap
    features = $featureState.features
    stories = $storyState.stories
    tasks = $taskState.tasks
    failures = $taskState.failures
    summary = @{
        epicsCreated = $epicMap.Count
        featuresCreated = $featureState.features.PSObject.Properties.Name.Count
        storiesCreated = $storyState.stories.PSObject.Properties.Name.Count
        tasksCreated = $taskState.tasks.PSObject.Properties.Name.Count
        totalCreated = $epicMap.Count + 
                      $featureState.features.PSObject.Properties.Name.Count + 
                      $storyState.stories.PSObject.Properties.Name.Count + 
                      $taskState.tasks.PSObject.Properties.Name.Count
        failures = $taskState.failures.Count
    }
}

$finalState | ConvertTo-Json -Depth 10 | Out-File "docs/github-sync-state.json" -Encoding UTF8
Write-Host "`n✓ Created github-sync-state.json" -ForegroundColor Green
Write-Host "  Epics: $($finalState.summary.epicsCreated)" -ForegroundColor Cyan
Write-Host "  Features: $($finalState.summary.featuresCreated)" -ForegroundColor Cyan
Write-Host "  Stories: $($finalState.summary.storiesCreated)" -ForegroundColor Cyan
Write-Host "  Tasks: $($finalState.summary.tasksCreated)" -ForegroundColor Cyan
Write-Host "  Total: $($finalState.summary.totalCreated)" -ForegroundColor Green
Write-Host "  Failures: $($finalState.summary.failures)" -ForegroundColor $(if ($finalState.summary.failures -gt 0) { "Yellow" } else { "Green" })
