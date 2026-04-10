---
name: create-features
description: Creates Feature work items from Epic files and the design document.
  Use when asked to create features or break down epics into deliverable slices.
---

# Skill — Create Features

## What You Do
Read the Epic files and design document and produce a set of Feature files
that break each Epic into independently deliverable slices. Features sit
at the second level of the work breakdown hierarchy:

```
Epic → Feature → User Story → Task
```

A Feature is a coherent, demonstrable piece of functionality that delivers
part of its parent Epic's business objective. A feature should be completable
within a sprint or two and should be demonstrable to a stakeholder when done.

## Steps
1. Read all Epic files in `docs/work-items/epics/`.
2. Read `docs/design/design-doc.md` — use the domain model, API contracts,
   and component structure to identify natural feature boundaries.
3. Read `docs/requirements/BRD.md` — validate every feature against
   the functional requirements it addresses.
4. For each epic, identify 2-5 features. More than 5 features per epic
   usually means the features are too granular — consider merging.
5. For each feature, produce one markdown file in the format below.
6. **Save files to `docs/work-items/features/`:**
   - Name each file: `feature-{epic-NN}-{NN}-{kebab-case-title}.md`
     (e.g. `feature-01-01-room-catalog.md`)
   - If the folder does not exist, create it.
   - If files already exist from a previous run, overwrite them.
7. **Update each parent Epic file:**
   - Open the epic file and populate the `features: []` frontmatter
     field with the IDs of the features created for that epic.
     (e.g. `features: [feature-01-01, feature-01-02]`)

## Feature File Format

```markdown
---
id: feature-{epic-NN}-{NN}
title: {Feature Title}
type: feature
epic: epic-{NN}
status: planned
source: {comma-separated FR IDs this feature addresses}
userStories: []
---

# Feature {epic-NN}-{NN}: {Feature Title}

## Description
One paragraph describing what this feature delivers and why it matters
to the user. Use domain language from the BRD.

## Parent Epic
[Epic {NN}: {Epic Title}](../epics/epic-{NN}-{kebab-title}.md)

## Scope
What is included in this feature and what is explicitly excluded.
Be specific — this prevents scope creep during implementation.

## Acceptance Criteria
- [ ] {Criterion 1 — user-visible behaviour, not technical detail}
- [ ] {Criterion 2}
- [ ] {Criterion 3}

## Definition of Done
- All user stories under this feature are complete and accepted
- All acceptance criteria above are verified
- Feature is demonstrable end to end in the running application
- No known defects in this feature area
```

## How to Identify Features

**Use the design document as a guide:**
Natural feature boundaries often align with:
- A distinct screen or page in the component structure
- A group of related API endpoints
- A domain entity's primary operations (e.g. create + list + detail)
- A lifecycle phase of a domain entity

**Feature granularity test:**
A well-scoped feature should be answerable with "yes" to all of these:
- Can it be demonstrated to a stakeholder independently?
- Can a developer describe it in one sentence?
- Does it deliver a user-visible outcome?
- Could it ship without the next feature being complete?

**Common feature patterns:**
- {Entity} Catalog / List — browse and search records
- {Entity} Detail — view a single record in full
- {Entity} Creation — create a new record with validation
- {Entity} Management — edit and delete existing records
- {Entity} Lifecycle — move a record through its defined states
- {Role} Authentication — sign in, sign out, session management
- {Role} Dashboard — overview of relevant records and actions
- Notifications — alerts and communications triggered by events
- Reporting — aggregated views and exports

## Naming Conventions
- Feature titles use Title Case.
- Feature IDs encode the parent epic: `feature-{epic-NN}-{NN}`.
- File names are kebab-case: `feature-01-02-room-availability.md`.
- Use domain entity names in feature titles.
  (e.g. "Appointment Booking" not "Create Form")

## What NOT to Include
- Do NOT add effort estimates — estimation is handled by estimate-agent.
- Do NOT define tasks or implementation steps.
- Do NOT reference specific technologies, frameworks, or libraries.
- Do NOT create features for work outside the parent epic's scope.
- Do NOT leave any epic without at least 2 features.

## Validation Checklist
Before saving, verify:
- [ ] Every epic has between 2 and 5 features
- [ ] Every feature belongs to exactly one epic
- [ ] Every feature traces to at least one BRD FR
- [ ] Every parent epic file has its `features` field updated
- [ ] Feature titles use domain language from the BRD
- [ ] Each feature has at least 2 acceptance criteria
- [ ] No effort estimates appear anywhere in the files
- [ ] File naming convention is correct

## Example

For `epic-03-appointment-booking.md` covering FR-005, FR-006, FR-007:

**Features produced:**
```
feature-03-01-appointment-search.md    (FR-005)
feature-03-02-appointment-booking.md   (FR-006)
feature-03-03-appointment-lifecycle.md (FR-007)
```

**Example file — `feature-03-02-appointment-booking.md`:**
```markdown
---
id: feature-03-02
title: Appointment Booking
type: feature
epic: epic-03
status: planned
source: FR-006
userStories: []
---

# Feature 03-02: Appointment Booking

## Description
Enables a patient to select an available slot from search results
and confirm a booking with a practitioner. The appointment is created
in Scheduled state and the patient receives confirmation.

## Parent Epic
[Epic 03: Appointment Booking](../epics/epic-03-appointment-booking.md)

## Scope
Included: Slot selection, booking confirmation, appointment creation
in Scheduled state, confirmation display.
Excluded: Payment, insurance validation, referral checking
(referral is handled in feature-03-03).

## Acceptance Criteria
- [ ] A patient can select an available slot and confirm a booking
- [ ] A confirmed booking creates an Appointment in Scheduled state
- [ ] The patient sees a confirmation with appointment details

## Definition of Done
- All user stories under this feature are complete and accepted
- All acceptance criteria above are verified
- Feature is demonstrable end to end in the running application
- No known defects in this feature area
```

**Updated parent epic frontmatter after feature creation:**
```markdown
---
id: epic-03
title: Appointment Booking
type: epic
status: planned
source: FR-005, FR-006, FR-007
features: [feature-03-01, feature-03-02, feature-03-03]
---
```
