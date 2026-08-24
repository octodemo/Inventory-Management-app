# Sync User Stories to GitHub Issues
$ErrorActionPreference = "Stop"
$ORG = "octodemo"
$REPO = "Inventory-Management-app"
$DESIGN_DOC_URL = "https://github.com/octodemo/Inventory-Management-app/blob/main/docs/design/design-doc.md"

# Load feature state to get feature -> issue number mapping
$featureState = Get-Content "docs/.temp-feature-state.json" -Raw | ConvertFrom-Json
$featureMap = @{}
foreach ($fid in $featureState.features.PSObject.Properties.Name) {
    $featureMap[$fid] = $featureState.features.$fid.issueNumber
}

# Read all story files
$storyFiles = Get-ChildItem "docs/work-items/stories/*.md" | Sort-Object Name
$state = @{ stories = @{} }

foreach ($file in $storyFiles) {
    $content = Get-Content $file.FullName -Raw
    
    if ($content -match '(?s)^---\s*\n(.*?)\n---\s*\n(.*)$') {
        $frontmatter = $matches[1]
        $body = $matches[2].Trim()
        
        if ($frontmatter -match 'id:\s*(.+)') { $id = $matches[1].Trim() }
        if ($frontmatter -match 'title:\s*(.+)') { $title = $matches[1].Trim() }
        if ($frontmatter -match 'feature:\s*(.+)') { $feature = $matches[1].Trim() }
        if ($frontmatter -match 'priority:\s*(.+)') { $priority = $matches[1].Trim() }
        if ($frontmatter -match 'source:\s*(.+)') { $source = $matches[1].Trim() }
        
        $parentFeatureNumber = $featureMap[$feature]
        
        if (-not $parentFeatureNumber) {
            Write-Warning "Parent Feature '$feature' not found for Story '$id'"
            continue
        }
        
        $issueBody = @"
$body

---

**Priority:** $priority
**Functional Requirements:** $source
**Feature:** #$parentFeatureNumber

📐 [Technical Design Document]($DESIGN_DOC_URL)

## Child Tasks
<!-- Tasklist populated after Task creation -->
"@
        
        Write-Host "Creating Story: $title" -ForegroundColor Cyan
        $issueUrl = gh issue create `
            --repo "$ORG/$REPO" `
            --title $title `
            --label "user-story,$priority" `
            --body $issueBody
        
        if ($issueUrl -match '/issues/(\d+)$') {
            $issueNumber = [int]$matches[1]
            Write-Host "  ✓ Created #$issueNumber" -ForegroundColor Green
            
            $state.stories[$id] = @{
                issueNumber = $issueNumber
                issueUrl = $issueUrl
                feature = $feature
                title = $title
            }
        }
    }
}

$state | ConvertTo-Json -Depth 10 | Out-File "docs/.temp-story-state.json" -Encoding UTF8
Write-Host "`n✓ Created $($state.stories.Count) stories" -ForegroundColor Green
