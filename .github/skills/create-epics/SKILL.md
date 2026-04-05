---
name: create-epics
description: Creates Epic work items from the design document and BRD. Use when
  asked to create epics or begin the work breakdown process.
---

# Skill — Create Epics

## What You Do
Read the design document and BRD and produce a set of Epic files that
represent the major functional areas of the solution. Epics are the
highest level of the work breakdown hierarchy:

```
Epic → Feature → User Story → Task
```

Each Epic represents a major functional area that delivers measurable
business value. Epics are not technical layers — they are business
capabilities.

## Steps
1. Read `docs/design/design-doc.md` in full — identify the major
   functional areas of the solution from the architecture, domain
   model, and component structure.
2. Read `docs/requirements/BRD.md` — map each functional area back
   to one or more functional requirements (FR-XXX).
3. Group related functional requirements into logical epics.
   Aim for 3-7 epics per solution. Too few means epics are too broad;
   too many means they are too granular.
4. For each epic, produce one markdown file in the format below.
5. **Save files to `docs/work-items/epics/`:**
   - Name each file: `epic-{NN}-{kebab-case-title}.md`
     (e.g. `epic-01-room-management.md`)
   - If the folder does not exist, create it.
   - If files already exist from a previous run, overwrite them.

## Epic File Format

```markdown
---
id: epic-{NN}
title: {Epic Title}
type: epic
status: planned
source: {comma-separated FR IDs this epic addresses, e.g. FR-001, FR-002}
features: []
---

# Epic {NN}: {Epic Title}

## Description
One paragraph describing the business capability this epic delivers.
Use domain language from the BRD — do not introduce new terminology.

## Business Objective
One sentence stating the measurable outcome this epic achieves for
the business or the user.

## Scope
What is included in this epic and what is explicitly excluded.
Reference the BRD Out of Scope section where relevant.

## Acceptance Criteria
- [ ] {Criterion 1 — business-level, not technical}
- [ ] {Criterion 2}
- [ ] {Criterion 3}

## Definition of Done
- All features under this epic are complete and accepted
- All acceptance criteria above are verified
- No known defects in the functional area covered by this epic
```

## How to Identify Epics

**Start with the domain model:**
Each major domain entity from the BRD with its own lifecycle typically
warrants its own epic. For example:
- An `Appointment` entity with states (Scheduled → Confirmed → Completed)
  suggests an "Appointment Management" epic.
- A `Room` entity with availability rules suggests a "Room Management" epic.

**Group by business capability, not technical layer:**
- WRONG: "Database Layer", "API Development", "Frontend Development"
- RIGHT: "Room Management", "Booking Management", "Reporting & Analytics"

**Check against BRD functional requirements:**
Every FR-XXX must belong to exactly one epic.
If an FR does not fit any epic, either create a new epic or expand
the scope of an existing one.

**Common epic patterns by domain:**
- Entity management (create, read, update, delete + lifecycle)
- User access and authentication
- Search and discovery
- Notifications and communications
- Reporting and analytics
- Administration and configuration

## Naming Conventions
- Epic titles use Title Case.
- Epic IDs are zero-padded two-digit numbers: `epic-01`, `epic-02`.
- File names are kebab-case: `epic-01-room-management.md`.
- Use domain entity names in epic titles where they are the primary
  subject. (e.g. "Appointment Management" not "Booking System")

## What NOT to Include
- Do NOT add effort estimates — estimation is handled by estimate-agent.
- Do NOT define tasks or implementation details — those belong in task files.
- Do NOT reference specific technologies, frameworks, or libraries.
- Do NOT create epics for work not present in the BRD.
- Do NOT leave any BRD functional requirement unassigned to an epic.

## Validation Checklist
Before saving, verify:
- [ ] Every BRD functional requirement (FR-XXX) is covered by exactly one epic
- [ ] No epic covers work that is Out of Scope in the BRD
- [ ] Epic titles use domain language from the BRD
- [ ] Each epic has at least 2 acceptance criteria
- [ ] No effort estimates appear anywhere in the files
- [ ] File naming convention is correct

## Example

For a BRD describing a clinic booking system with entities
`Patient`, `Practitioner`, `Appointment`, `Referral`:

**Epics produced:**
```
epic-01-patient-management.md       (FR-001, FR-002)
epic-02-practitioner-management.md  (FR-003, FR-004)
epic-03-appointment-booking.md      (FR-005, FR-006, FR-007)
epic-04-referral-management.md      (FR-008, FR-009)
```

**Example file — `epic-03-appointment-booking.md`:**
```markdown
---
id: epic-03
title: Appointment Booking
type: epic
status: planned
source: FR-005, FR-006, FR-007
features: []
---

# Epic 03: Appointment Booking

## Description
Enables patients to search for available appointment slots with
practitioners, book appointments, and manage their booking lifecycle
from Scheduled through to Completed or Cancelled.

## Business Objective
Reduce appointment scheduling time by providing a self-service
booking experience for patients.

## Scope
Included: Appointment creation, lifecycle management (Scheduled →
Confirmed → Completed | Cancelled), patient cancellation.
Excluded: Payment processing, insurance claims (per BRD Out of Scope).

## Acceptance Criteria
- [ ] A patient can book an available appointment slot with a practitioner
- [ ] An appointment follows the lifecycle: Scheduled → Confirmed → Completed
- [ ] A patient can cancel a Scheduled appointment

## Definition of Done
- All features under this epic are complete and accepted
- All acceptance criteria above are verified
- No known defects in the appointment booking functional area
```
