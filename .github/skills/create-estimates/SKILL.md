---
name: create-estimates
description: Analyses all work items and produces effort estimates rolled up through
  the work hierarchy, then generates an HTML summary report. Use when asked to
  estimate work or produce an estimation report.
---

# Skill — Create Estimates

## What You Do
Analyse every task file in `issues/` using the full context of the
work breakdown and design document, assign a t-shirt size and hour
estimate to each task, roll estimates up through the hierarchy, and
generate a stakeholder-ready HTML report.

## Estimation Approach — Two Stage

**Stage 1: T-Shirt Size**
Assign a size based on task complexity:

| Size | Hours | When to Use |
|------|-------|-------------|
| XS | 1h | Single-concern change, 1-2 acceptance criteria, no edge cases |
| S | 2h | Straightforward implementation, 3-4 acceptance criteria |
| M | 4h | Moderate complexity, 5-6 criteria, some edge cases |
| L | 8h | High complexity, 6+ criteria, multiple edge cases or integrations |
| XL | 16h | Very high complexity, cross-cutting concerns, significant unknowns |

**Stage 2: Calibrate by Task Type**
Apply these type-specific adjustments after sizing:

| Type | XS | S | M | L | XL |
|------|----|----|----|----|-----|
| DATABASE | 1h | 2h | 3h | 6h | 12h |
| BACKEND | 1h | 2h | 4h | 8h | 16h |
| UNIT-TEST | 1h | 2h | 3h | 5h | 10h |
| FRONTEND | 1h | 3h | 5h | 10h | 20h |
| E2E-TEST | 1h | 2h | 3h | 6h | 12h |

DATABASE and UNIT-TEST tasks are generally faster than BACKEND and FRONTEND
at the same complexity level. FRONTEND is slowest due to UI state,
validation feedback, and accessibility concerns. UNIT-TEST is typically
slightly faster than E2E-TEST as there is no browser or full-stack setup.

## Complexity Signals — What to Look For

**Increases complexity (size up):**
- Multiple entity relationships in one task
- Business rule enforcement (approval gates, capacity limits, uniqueness)
- Multiple lifecycle state transitions
- Error handling for multiple failure modes
- Cross-story or cross-feature dependencies
- More than 4 acceptance criteria
- Authentication and authorisation logic
- Data aggregation or reporting logic

**Decreases complexity (size down):**
- Single entity, single operation
- No business rules beyond basic validation
- Read-only operation (GET only)
- Directly mirrors a design doc pattern
- Fewer than 3 acceptance criteria
- No dependencies on other incomplete tasks

## Steps

### Step 1 — Estimate Each Task
For each task file in `issues/`:
1. Read the description and acceptance criteria count.
2. Identify complexity signals from the lists above.
3. Assign a t-shirt size with a one-sentence reasoning statement.
4. Convert to hours using the type-calibrated table above.
5. Update the task file frontmatter with:
   ```
   size: {XS | S | M | L | XL}
   estimatedEffort: {Nh}
   estimationReason: {one sentence explaining the estimate}
   ```

### Step 2 — Roll Up Estimates
After all tasks are estimated:

**Story level:**
- Sum the `estimatedEffort` of all tasks belonging to the story.
- Update the story file frontmatter:
  ```
  estimatedEffort: {total Nh}
  taskCount: {N}
  ```

**Feature level:**
- Sum the `estimatedEffort` of all stories belonging to the feature.
- Update the feature file frontmatter:
  ```
  estimatedEffort: {total Nh}
  storyCount: {N}
  ```

**Epic level:**
- Sum the `estimatedEffort` of all features belonging to the epic.
- Update the epic file frontmatter:
  ```
  estimatedEffort: {total Nh}
  featureCount: {N}
  ```

### Step 3 — Generate HTML Report
Save a complete HTML report to `docs/reports/effort-estimate-report.html`.
The report must render correctly in a browser with no external dependencies
— all styles must be inline or in a `<style>` block in the file.

## HTML Report Structure

```
Section 1: Executive Summary
Section 2: Effort by Task Type
Section 3: Effort by Epic
Section 4: Complexity Reasoning
Section 5: Full Work Item Breakdown
```

### Section 1: Executive Summary
A business-readable summary containing:
- Total number of epics, features, stories, tasks
- Total estimated effort in hours and days (assuming 8h/day)
- Effort split by task type as a percentage
- Overall complexity assessment (Low / Medium / High / Very High)
  based on total hours:
  - Low: under 40h
  - Medium: 40h–120h
  - High: 120h–240h
  - Very High: over 240h

### Section 2: Effort by Task Type
A visual breakdown showing:
- Total hours per type (DATABASE, BACKEND, FRONTEND, TEST)
- Percentage of total effort per type
- A simple horizontal bar chart using HTML/CSS only (no libraries)

### Section 3: Effort by Epic
A table showing:
- Epic title
- Number of features, stories, tasks
- Total estimated hours
- Percentage of total effort
- Complexity rating per epic

### Section 4: Complexity Reasoning
A table showing every task with:
- Task ID and title
- T-shirt size
- Estimated hours
- Reasoning statement (one sentence per task)

This section is the most important for technical credibility —
it shows the audience that estimates are reasoned, not guessed.

### Section 5: Full Work Item Breakdown
A collapsible hierarchy showing:
Epic → Feature → Story → Task with hours at each level.
Use HTML `<details>` and `<summary>` elements for collapsibility
so the report is navigable without JavaScript.

## HTML Report Style Rules
- Clean, professional appearance suitable for stakeholder review.
- Use a neutral colour palette — no bright or distracting colours.
- Highlight the executive summary section prominently at the top.
- The complexity reasoning table is the most important section —
  make it easy to read with alternating row colours.
- All styles inline or in a `<style>` block — no external CSS files.
- No JavaScript required — use HTML/CSS only for interactivity.
- Must render correctly in Chrome, Edge, and Safari.
- Font: system font stack (no external font imports).
- Page width: max 960px, centred.

## HTML Report Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Effort Estimate Report</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
         sans-serif; font-size: 14px; color: #1a1a1a;
         background: #f5f5f5; padding: 2rem; }
  .container { max-width: 960px; margin: 0 auto; }
  h1 { font-size: 1.6rem; font-weight: 600; margin-bottom: 0.25rem; }
  h2 { font-size: 1.1rem; font-weight: 600; margin: 2rem 0 1rem;
       padding-bottom: 0.4rem; border-bottom: 2px solid #e0e0e0; }
  h3 { font-size: 0.95rem; font-weight: 600; margin: 1rem 0 0.5rem; }
  .card { background: #fff; border-radius: 8px; padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .summary-grid { display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(160px,1fr));
                  gap: 1rem; margin: 1rem 0; }
  .stat { background: #f8f8f8; border-radius: 6px; padding: 1rem;
          text-align: center; }
  .stat-value { font-size: 1.8rem; font-weight: 700; color: #2c5f8a; }
  .stat-label { font-size: 0.75rem; color: #666; margin-top: 0.25rem; }
  .badge { display: inline-block; padding: 0.2rem 0.6rem;
           border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
  .badge-low { background: #e6f4ea; color: #2d6a3f; }
  .badge-medium { background: #fff8e1; color: #8a6000; }
  .badge-high { background: #fce8e0; color: #8a2000; }
  .badge-veryhigh { background: #fce0e0; color: #6a0000; }
  .bar-row { display: flex; align-items: center; gap: 0.75rem;
             margin-bottom: 0.6rem; }
  .bar-label { width: 90px; font-size: 0.8rem; text-align: right; }
  .bar-track { flex: 1; background: #f0f0f0; border-radius: 4px;
               height: 20px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 4px;
              background: #2c5f8a; }
  .bar-value { width: 60px; font-size: 0.8rem; color: #444; }
  table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  th { background: #f0f0f0; padding: 0.6rem 0.75rem;
       text-align: left; font-weight: 600; }
  td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #f0f0f0; }
  tr:nth-child(even) td { background: #fafafa; }
  details { margin-bottom: 0.5rem; }
  summary { cursor: pointer; padding: 0.5rem 0.75rem;
            background: #f8f8f8; border-radius: 4px;
            font-weight: 600; font-size: 0.85rem; }
  summary:hover { background: #f0f0f0; }
  .indent-1 { padding-left: 1.5rem; }
  .indent-2 { padding-left: 3rem; }
  .indent-3 { padding-left: 4.5rem; }
  .effort-tag { font-size: 0.75rem; color: #666;
                margin-left: 0.5rem; }
  .type-db { color: #6a3d9a; }
  .type-be { color: #1f6b8a; }
  .type-fe { color: #2d6a3f; }
  .type-test { color: #8a4000; }
  .generated { font-size: 0.75rem; color: #999;
               margin-top: 2rem; text-align: center; }
</style>
</head>
<body>
<div class="container">

  <div class="card">
    <h1>Effort Estimate Report</h1>
    <p style="color:#666; margin-top:0.25rem">
      {Project Name} · Generated {Date}
    </p>

    <h2>Executive Summary</h2>
    <div class="summary-grid">
      <div class="stat">
        <div class="stat-value">{N}</div>
        <div class="stat-label">Epics</div>
      </div>
      <div class="stat">
        <div class="stat-value">{N}</div>
        <div class="stat-label">Features</div>
      </div>
      <div class="stat">
        <div class="stat-value">{N}</div>
        <div class="stat-label">User Stories</div>
      </div>
      <div class="stat">
        <div class="stat-value">{N}</div>
        <div class="stat-label">Tasks</div>
      </div>
      <div class="stat">
        <div class="stat-value">{N}h</div>
        <div class="stat-label">Total Effort</div>
      </div>
      <div class="stat">
        <div class="stat-value">{N}d</div>
        <div class="stat-label">Total Days (8h)</div>
      </div>
    </div>
    <p>Overall complexity:
      <span class="badge badge-{low|medium|high|veryhigh}">
        {Low | Medium | High | Very High}
      </span>
    </p>
  </div>

  <div class="card">
    <h2>Effort by Task Type</h2>
    <!-- One bar row per type -->
    <div class="bar-row">
      <span class="bar-label type-db">DATABASE</span>
      <div class="bar-track">
        <div class="bar-fill" style="width:{pct}%;
             background:#6a3d9a"></div>
      </div>
      <span class="bar-value">{N}h ({pct}%)</span>
    </div>
    <div class="bar-row">
      <span class="bar-label type-be">BACKEND</span>
      <div class="bar-track">
        <div class="bar-fill" style="width:{pct}%;
             background:#1f6b8a"></div>
      </div>
      <span class="bar-value">{N}h ({pct}%)</span>
    </div>
    <div class="bar-row">
      <span class="bar-label type-fe">FRONTEND</span>
      <div class="bar-track">
        <div class="bar-fill" style="width:{pct}%;
             background:#2d6a3f"></div>
      </div>
      <span class="bar-value">{N}h ({pct}%)</span>
    </div>
    <div class="bar-row">
      <span class="bar-label type-test">TEST</span>
      <div class="bar-track">
        <div class="bar-fill" style="width:{pct}%;
             background:#8a4000"></div>
      </div>
      <span class="bar-value">{N}h ({pct}%)</span>
    </div>
  </div>

  <div class="card">
    <h2>Effort by Epic</h2>
    <table>
      <thead>
        <tr>
          <th>Epic</th>
          <th>Features</th>
          <th>Stories</th>
          <th>Tasks</th>
          <th>Hours</th>
          <th>% of Total</th>
          <th>Complexity</th>
        </tr>
      </thead>
      <tbody>
        <!-- One row per epic -->
        <tr>
          <td>{Epic title}</td>
          <td>{N}</td>
          <td>{N}</td>
          <td>{N}</td>
          <td>{N}h</td>
          <td>{pct}%</td>
          <td>
            <span class="badge badge-{level}">{Level}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="card">
    <h2>Complexity Reasoning</h2>
    <table>
      <thead>
        <tr>
          <th>Task</th>
          <th>Type</th>
          <th>Size</th>
          <th>Hours</th>
          <th>Reasoning</th>
        </tr>
      </thead>
      <tbody>
        <!-- One row per task -->
        <tr>
          <td>{Task title}</td>
          <td><span class="type-{db|be|fe|test}">{TYPE}</span></td>
          <td>{XS|S|M|L|XL}</td>
          <td>{N}h</td>
          <td>{One-sentence reasoning}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="card">
    <h2>Full Work Item Breakdown</h2>
    <!-- One details block per epic -->
    <details>
      <summary>
        {Epic title}
        <span class="effort-tag">{N}h</span>
      </summary>
      <div class="indent-1">
        <!-- One details block per feature -->
        <details>
          <summary>
            {Feature title}
            <span class="effort-tag">{N}h</span>
          </summary>
          <div class="indent-2">
            <!-- One details block per story -->
            <details>
              <summary>
                {Story title}
                <span class="effort-tag">{N}h</span>
              </summary>
              <div class="indent-3">
                <!-- One row per task -->
                <p>
                  <span class="type-{type}">[{TYPE}]</span>
                  {Task title}
                  <span class="effort-tag">{N}h</span>
                </p>
              </div>
            </details>
          </div>
        </details>
      </div>
    </details>
  </div>

  <p class="generated">
    Generated by estimate-agent · {Date}
  </p>

</div>
</body>
</html>
```

## What NOT to Do
- Do NOT assign the same estimate to every task of the same type —
  estimates must reflect actual task content.
- Do NOT leave any task without an estimationReason.
- Do NOT use external CSS libraries or JavaScript frameworks in the report.
- Do NOT round all estimates to the nearest half-day —
  be precise at the task level.
- Do NOT underestimate to make the plan look more favourable.
