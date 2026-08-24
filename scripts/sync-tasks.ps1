# Sync Tasks to GitHub Issues (Batch Processing)
$ErrorActionPreference = "Stop"
$ORG = "octodemo"
$REPO = "Inventory-Management-app"

# Load story state
$storyState = Get-Content "docs/.temp-story-state.json" -Raw | ConvertFrom-Json
$storyMap = @{}
foreach ($sid in $storyState.stories.PSObject.Properties.Name) {
    $storyMap[$sid] = $storyState.stories.$sid.issueNumber
}

# Read all task files in sorted order
$taskFiles = Get-ChildItem "issues/*.md" | Where-Object { $_.Name -ne '.gitkeep' } | Sort-Object Name
$state = @{ tasks = @{}; failures = @() }

$totalTasks = $taskFiles.Count
$createdCount = 0
$batchSize = 10

Write-Host "Creating $totalTasks tasks..." -ForegroundColor Yellow

for ($i = 0; $i -lt $taskFiles.Count; $i++) {
    $file = $taskFiles[$i]
    $content = Get-Content $file.FullName -Raw
    
    if ($content -match '(?s)^---\s*\n(.*?)\n---\s*\n(.*)$') {
        $frontmatter = $matches[1]
        $body = $matches[2].Trim()
        
        # Extract fields using regex
        if ($frontmatter -match 'id:\s*(.+)') { $id = $matches[1].Trim() }
        if ($frontmatter -match 'title:\s*(.+)') { $title = $matches[1].Trim() }
        if ($frontmatter -match 'taskType:\s*(.+)') { $taskType = $matches[1].Trim() }
        if ($frontmatter -match 'userStory:\s*(.+)') { $userStory = $matches[1].Trim() }
        
        # Extract dependencies (multiline array)
        $dependencies = @()
        if ($frontmatter -match '(?s)dependencies:\s*\[(.*?)\]') {
            $depStr = $matches[1]
            $dependencies = $depStr -split ',' | ForEach-Object { $_.Trim().Trim('"').Trim("'") } | Where-Object { $_ -ne '' }
        }
        
        $parentStoryNumber = $storyMap[$userStory]
        
        if (-not $parentStoryNumber) {
            $state.failures += @{
                localId = $id
                type = "Task"
                error = "Parent Story '$userStory' not found"
                timestamp = (Get-Date).ToString('o')
            }
            Write-Warning "Skipping $id - Parent Story not found"
            continue
        }
        
        # Build dependencies section
        $depsSection = ""
        if ($dependencies.Count -gt 0) {
            $depLines = @()
            foreach ($dep in $dependencies) {
                if ($state.tasks.ContainsKey($dep)) {
                    $depNumber = $state.tasks[$dep].issueNumber
                    $depLines += "- #$depNumber $dep"
                }
            }
            if ($depLines.Count -gt 0) {
                $depsSection = "`n`n**Depends on:**`n" + ($depLines -join "`n")
            }
        }
        
        $issueBody = @"
$body

---

**Task Type:** $taskType
**User Story:** #$parentStoryNumber$depsSection
"@
        
        # Map task type to label
        $taskTypeLabel = switch ($taskType) {
            "DATABASE" { "database" }
            "BACKEND" { "backend" }
            "FRONTEND" { "frontend" }
            "UNIT-TEST" { "unit-test" }
            "E2E-TEST" { "e2e-test" }
            default { "task" }
        }
        
        Write-Host "[$($i+1)/$totalTasks] Creating: $title" -ForegroundColor Cyan
        
        try {
            $issueUrl = gh issue create `
                --repo "$ORG/$REPO" `
                --title $title `
                --label "task,$taskTypeLabel" `
                --body $issueBody
            
            if ($issueUrl -match '/issues/(\d+)$') {
                $issueNumber = [int]$matches[1]
                $state.tasks[$id] = @{
                    issueNumber = $issueNumber
                    issueUrl = $issueUrl
                    userStory = $userStory
                    title = $title
                }
                $createdCount++
                Write-Host "  ✓ Created #$issueNumber" -ForegroundColor Green
            }
        }
        catch {
            $state.failures += @{
                localId = $id
                type = "Task"
                error = $_.Exception.Message
                timestamp = (Get-Date).ToString('o')
            }
            Write-Warning "Failed to create $id : $_"
        }
    }
    
    # Progress update every batch
    if (($i + 1) % $batchSize -eq 0) {
        Write-Host "  Progress: $($i+1)/$totalTasks tasks processed..." -ForegroundColor Gray
    }
}

$state | ConvertTo-Json -Depth 10 | Out-File "docs/.temp-task-state.json" -Encoding UTF8
Write-Host "`n✓ Created $createdCount tasks" -ForegroundColor Green
Write-Host "✓ Failures: $($state.failures.Count)" -ForegroundColor $(if ($state.failures.Count -gt 0) { "Yellow" } else { "Green" })
