# Sync Features to GitHub Issues
# This script creates GitHub Issues for all Feature files and links them to parent Epics

$ErrorActionPreference = "Stop"
$ORG = "octodemo"
$REPO = "Inventory-Management-app"
$BRD_URL = "https://github.com/octodemo/Inventory-Management-app/blob/main/docs/requirements/BRD.md"

# Epic mapping (id -> issue number)
$epicMap = @{
    "epic-01" = 3
    "epic-02" = 4
    "epic-03" = 5
    "epic-04" = 6
    "epic-05" = 7
    "epic-06" = 8
    "epic-07" = 9
}

# Read all feature files
$featureFiles = Get-ChildItem "docs/work-items/features/*.md" | Sort-Object Name
$state = @{
    features = @{}
}

foreach ($file in $featureFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Parse YAML frontmatter
    if ($content -match '(?s)^---\s*\n(.*?)\n---\s*\n(.*)$') {
        $frontmatter = $matches[1]
        $body = $matches[2].Trim()
        
        # Extract fields
        if ($frontmatter -match 'id:\s*(.+)') { $id = $matches[1].Trim() }
        if ($frontmatter -match 'title:\s*(.+)') { $title = $matches[1].Trim() }
        if ($frontmatter -match 'epic:\s*(.+)') { $epic = $matches[1].Trim() }
        if ($frontmatter -match 'source:\s*(.+)') { $source = $matches[1].Trim() }
        
        # Get parent epic issue number
        $parentEpicNumber = $epicMap[$epic]
        
        if (-not $parentEpicNumber) {
            Write-Warning "Parent Epic '$epic' not found for Feature '$id'"
            continue
        }
        
        # Build issue body
        $issueBody = @"
$body

---

**Functional Requirements:** $source
**Epic:** #$parentEpicNumber

📄 [Business Requirements Document]($BRD_URL)

## Child Stories
<!-- Tasklist populated after Story creation -->
"@
        
        # Create GitHub issue
        Write-Host "Creating Feature: $title" -ForegroundColor Cyan
        $issueUrl = gh issue create `
            --repo "$ORG/$REPO" `
            --title $title `
            --label "feature" `
            --body $issueBody
        
        # Extract issue number from URL
        if ($issueUrl -match '/issues/(\d+)$') {
            $issueNumber = [int]$matches[1]
            Write-Host "  ✓ Created #$issueNumber" -ForegroundColor Green
            
            # Save to state
            $state.features[$id] = @{
                issueNumber = $issueNumber
                issueUrl = $issueUrl
                epic = $epic
                title = $title
            }
        }
    }
}

# Save state to JSON
$state | ConvertTo-Json -Depth 10 | Out-File "docs/.temp-feature-state.json" -Encoding UTF8
Write-Host "`n✓ Created $($state.features.Count) features" -ForegroundColor Green
Write-Host "State saved to docs/.temp-feature-state.json"
