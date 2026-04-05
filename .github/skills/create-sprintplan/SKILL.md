---
name: create-sprint-plan
description: Creates a capacity-driven sprint plan from estimated work items and
  team capacity inputs. Use when asked to create a sprint plan or allocate stories
  to sprints.
---

# Skill — Create Sprint Plan

## What You Do
Using the effort estimates and team capacity provided, allocate user
stories to sprints in a sequence that respects priority, dependencies,
and capacity constraints. Produce a stakeholder-ready HTML report.

## Inputs Required Before Starting
- Effort estimates from all task files in `issues/`
- Story priorities and dependencies from story files in
  `docs/work-items/stories/`
- Team capacity answers from the sprint-planning-agent conversation:
  - Developers per role (DATABASE / BACKEND / FRONTEND or full-stack)
  - Hours per sprint per developer
  - Number of sprints planned

## Step 1 — Calculate Capacity

### Per-Role Capacity Per Sprint
```
Role capacity (hours) = developers in role × hours per sprint
```

### Full-Stack Capacity (if no specialised roles)
```
Total capacity (hours) = total developers × hours per sprint
Allocate proportionally:
  DATABASE share = 15% of total capacity
  BACKEND share  = 35% of total capacity
  FRONTEND share = 35% of total capacity
  TEST share     = 15% of total capacity
```

### Effective Capacity Adjustment
Apply a 20% overhead reduction for ceremonies, code review,
and unexpected interruptions:
```
Effective capacity = raw capacity × 0.80
```
Always plan against effective capacity, never raw capacity.

## Step 2 — Build the Allocation Sequence

### Priority Order
Allocate stories in this strict order:
1. All `must-have` stories — these must fit in the sprint plan.
   If they do not fit, flag overcommitment explicitly.
2. `should-have` stories — fill remaining capacity after must-haves.
3. `could-have` stories — allocate only if capacity remains.

### Dependency Order Within Priority
Within each priority tier, order stories so that:
- Stories with no dependencies come first.
- A story that depends on another story is placed in a later sprint
  than its dependency, never the same sprint.
- DATABASE-only work can start immediately in sprint 1.
- BACKEND work for a story cannot start until its DATABASE task
  is in a completed sprint.
- FRONTEND work cannot start until its BACKEND task is complete.

### Allocation Algorithm
For each sprint in sequence:
1. Identify stories whose dependencies are satisfied by previous sprints.
2. From those, take must-have stories first, ordered by epic sequence.
3. Add story effort to the sprint's running total per role.
4. Stop adding stories when any role reaches effective capacity.
5. Move remaining stories to the next sprint.
6. Repeat until all stories are allocated or sprints are exhausted.

If stories remain unallocated after all planned sprints:
- Flag them as "Beyond planned release" in the report.
- Recommend either adding capacity or reducing scope.

## Step 3 — Calculate Utilisation Per Sprint

For each sprint and each role:
```
Utilisation % = committed hours / effective capacity × 100
```

Utilisation health:
| Range | Status | Label |
|-------|--------|-------|
| 0–60% | Under-utilised | Consider adding scope |
| 61–85% | Healthy | Recommended range |
| 86–100% | Full | Acceptable, monitor risk |
| >100% | Overcommitted | Must reduce scope |

## Step 4 — Generate HTML Report
Save to `docs/reports/sprint-plan-report.html`.
All styles inline or in a `<style>` block — no external dependencies.
Must render in Chrome, Edge, and Safari without JavaScript.

## HTML Report Structure

```
Section 1: Executive Summary
Section 2: Capacity Overview
Section 3: Sprint Breakdown (one section per sprint)
Section 4: Stories Beyond Planned Release (if any)
Section 5: Recommendations
```

### Section 1: Executive Summary
- Project name and date
- Total sprints planned
- Total effort committed vs total estimated
- Must-have stories: X of Y allocated
- Should-have stories: X of Y allocated
- Could-have stories: X of Y allocated
- Overall delivery confidence:
  - Green: all must-haves fit, utilisation healthy
  - Amber: all must-haves fit, some sprints overloaded
  - Red: not all must-haves fit within planned sprints

### Section 2: Capacity Overview
A table showing per sprint per role:
- Raw capacity (hours)
- Effective capacity after 20% overhead
- Committed hours
- Utilisation %
- Health indicator (Under-utilised / Healthy / Full / Overcommitted)

### Section 3: Sprint Breakdown
For each sprint, a card showing:
- Sprint number and goal (one sentence describing the primary outcome)
- Stories allocated, grouped by epic
- Per story: title, priority badge, estimated hours
- Per role: committed vs effective capacity with a visual bar
- Dependencies satisfied this sprint (what becomes unblocked)

### Section 4: Stories Beyond Planned Release
If any stories could not be allocated:
- List them by priority (should-haves first, then could-haves)
- Show their effort hours
- Show which sprint they would fall into if the release were extended

### Section 5: Recommendations
Based on the allocation analysis, provide 2-4 specific recommendations.
Examples:
- "Sprint 2 FRONTEND is at 94% utilisation — consider moving
  {story} to Sprint 3 to reduce risk."
- "Sprint 1 DATABASE is at 40% utilisation — the team has capacity
  to pull forward {story} from Sprint 2."
- "All must-have stories fit within {N} sprints. The release is
  on track if velocity is maintained."
- "3 should-have stories could not be allocated — recommend
  discussing with stakeholders whether to extend by one sprint
  or defer to a future release."

## HTML Report Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sprint Plan Report</title>
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
  .sprint-card { border-left: 4px solid #2c5f8a; }
  .summary-grid { display: grid;
                  grid-template-columns: repeat(auto-fit,minmax(150px,1fr));
                  gap: 1rem; margin: 1rem 0; }
  .stat { background: #f8f8f8; border-radius: 6px; padding: 1rem;
          text-align: center; }
  .stat-value { font-size: 1.8rem; font-weight: 700; color: #2c5f8a; }
  .stat-label { font-size: 0.75rem; color: #666; margin-top: 0.25rem; }
  .confidence { display: inline-flex; align-items: center; gap: 0.5rem;
                padding: 0.4rem 0.8rem; border-radius: 6px;
                font-weight: 600; font-size: 0.85rem; margin-top: 0.75rem; }
  .conf-green { background: #e6f4ea; color: #2d6a3f; }
  .conf-amber { background: #fff8e1; color: #8a6000; }
  .conf-red   { background: #fce8e0; color: #8a2000; }
  .badge { display: inline-block; padding: 0.15rem 0.5rem;
           border-radius: 4px; font-size: 0.72rem; font-weight: 600; }
  .badge-must   { background: #fce8e0; color: #8a2000; }
  .badge-should { background: #fff8e1; color: #8a6000; }
  .badge-could  { background: #e6f4ea; color: #2d6a3f; }
  table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  th { background: #f0f0f0; padding: 0.6rem 0.75rem;
       text-align: left; font-weight: 600; }
  td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #f0f0f0; }
  tr:nth-child(even) td { background: #fafafa; }
  .util-bar-track { background: #f0f0f0; border-radius: 4px;
                    height: 12px; overflow: hidden; width: 120px;
                    display: inline-block; vertical-align: middle; }
  .util-bar-fill { height: 100%; border-radius: 4px; }
  .util-healthy { background: #2d6a3f; }
  .util-under   { background: #8a6000; }
  .util-full    { background: #e07000; }
  .util-over    { background: #8a2000; }
  .util-label   { font-size: 0.75rem; color: #666;
                  margin-left: 0.4rem; }
  .story-row { display: flex; justify-content: space-between;
               align-items: center; padding: 0.4rem 0;
               border-bottom: 1px solid #f5f5f5; }
  .story-row:last-child { border-bottom: none; }
  .recommendation { padding: 0.75rem 1rem; background: #f0f6ff;
                    border-left: 3px solid #2c5f8a;
                    border-radius: 0 4px 4px 0;
                    margin-bottom: 0.75rem;
                    font-size: 0.85rem; }
  .generated { font-size: 0.75rem; color: #999;
               margin-top: 2rem; text-align: center; }
</style>
</head>
<body>
<div class="container">

  <div class="card">
    <h1>Sprint Plan Report</h1>
    <p style="color:#666; margin-top:0.25rem">
      {Project Name} · {N} Sprints · Generated {Date}
    </p>

    <h2>Executive Summary</h2>
    <div class="summary-grid">
      <div class="stat">
        <div class="stat-value">{N}</div>
        <div class="stat-label">Sprints Planned</div>
      </div>
      <div class="stat">
        <div class="stat-value">{N}h</div>
        <div class="stat-label">Total Committed</div>
      </div>
      <div class="stat">
        <div class="stat-value">{N}/{N}</div>
        <div class="stat-label">Must-haves Allocated</div>
      </div>
      <div class="stat">
        <div class="stat-value">{N}/{N}</div>
        <div class="stat-label">Should-haves Allocated</div>
      </div>
    </div>
    <div class="confidence conf-{green|amber|red}">
      {Green: On track | Amber: Monitor | Red: At risk}
    </div>
  </div>

  <div class="card">
    <h2>Capacity Overview</h2>
    <table>
      <thead>
        <tr>
          <th>Sprint</th>
          <th>Role</th>
          <th>Raw Capacity</th>
          <th>Effective (80%)</th>
          <th>Committed</th>
          <th>Utilisation</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <!-- One row per sprint per role -->
        <tr>
          <td>Sprint {N}</td>
          <td>{Role}</td>
          <td>{N}h</td>
          <td>{N}h</td>
          <td>{N}h</td>
          <td>
            <div class="util-bar-track">
              <div class="util-bar-fill util-{healthy|under|full|over}"
                   style="width:{pct}%"></div>
            </div>
            <span class="util-label">{pct}%</span>
          </td>
          <td>{Healthy | Under-utilised | Full | Overcommitted}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Repeat for each sprint -->
  <div class="card sprint-card">
    <h2>Sprint {N}</h2>
    <p style="color:#666; font-size:0.85rem; margin-bottom:1rem">
      <strong>Goal:</strong> {One sentence describing the sprint outcome}
    </p>

    <h3>Stories</h3>
    <!-- Group by epic -->
    <p style="font-size:0.8rem; color:#888; margin-bottom:0.4rem">
      {Epic title}
    </p>
    <div class="story-row">
      <span>{Story title}</span>
      <span>
        <span class="badge badge-{must|should|could}">{priority}</span>
        &nbsp;{N}h
      </span>
    </div>

    <h3 style="margin-top:1rem">Capacity</h3>
    <!-- One row per role -->
    <div style="display:flex; flex-direction:column; gap:0.5rem;
                margin-top:0.5rem">
      <div style="display:flex; align-items:center; gap:0.75rem;
                  font-size:0.85rem">
        <span style="width:90px">{Role}</span>
        <div class="util-bar-track" style="width:160px">
          <div class="util-bar-fill util-{healthy|under|full|over}"
               style="width:{pct}%"></div>
        </div>
        <span class="util-label">{committed}h / {effective}h ({pct}%)</span>
      </div>
    </div>

    <p style="font-size:0.8rem; color:#888; margin-top:1rem">
      <strong>Unblocks:</strong> {Stories that become available
      in the next sprint because their dependencies are now satisfied}
    </p>
  </div>

  <!-- Section 4: only if stories are unallocated -->
  <div class="card">
    <h2>Stories Beyond Planned Release</h2>
    <table>
      <thead>
        <tr>
          <th>Story</th>
          <th>Priority</th>
          <th>Hours</th>
          <th>Would land in sprint</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{Story title}</td>
          <td><span class="badge badge-{should|could}">{priority}</span></td>
          <td>{N}h</td>
          <td>Sprint {N} (if extended)</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="card">
    <h2>Recommendations</h2>
    <!-- 2-4 recommendations -->
    <div class="recommendation">{Recommendation 1}</div>
    <div class="recommendation">{Recommendation 2}</div>
  </div>

  <p class="generated">
    Generated by sprint-planning-agent · {Date}
  </p>

</div>
</body>
</html>
```

## What NOT to Do
- Do NOT break a dependency chain to improve utilisation numbers.
- Do NOT allocate stories beyond the capacity of any role without
  flagging it as overcommitted.
- Do NOT hide unallocated stories — surface them clearly in Section 4.
- Do NOT present the sprint plan as fixed — frame it as a recommendation.
- Do NOT use external CSS libraries or JavaScript in the report.
- Do NOT omit the Recommendations section — it is the most actionable
  part of the report for the PM.
