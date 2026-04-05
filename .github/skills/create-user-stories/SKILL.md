---
name: create-user-stories
description: Creates User Story work items from Feature files, BRD, and design
  document. Use when asked to create user stories or break features into
  user-facing behaviours.
---

# Skill — Create User Stories

## What You Do
Read the Feature files, BRD, and design document and produce a set of
User Story files that break each Feature into discrete, user-facing
behaviours. User Stories sit at the third level of the work breakdown
hierarchy:

```
Epic → Feature → User Story → Task
```

A User Story describes a single behaviour a user performs and the
value it delivers. It is written from the user's perspective, not
the developer's. Each story must be independently testable and
small enough to be completed within a single sprint.

## Steps
1. Read all Feature files in `docs/requirements/work-items/features/`.
2. Read all Epic files in `docs/requirements/work-items/epics/`.
3. Read `docs/requirements/BRD.md` — extract functional requirements,
   business rules, user roles, and lifecycle states. Use these to
   ensure stories capture the correct behaviours and constraints.
4. Read `docs/design/design-doc.md` — use API contracts, user flows,
   and component structure to inform technical notes per story.
5. For each feature, identify 2-5 user stories. More than 5 stories
   per feature usually means the stories are too granular or the
   feature scope is too broad.
6. Assign a MoSCoW priority to each story based on BRD analysis:
   - **must-have**: core functional requirement — the feature does not
     work without this story
   - **should-have**: important supporting behaviour — expected by users
     but the feature partially works without it
   - **could-have**: enhancement — adds value but is acceptable to defer
7. For each story, produce one markdown file in the format below.
8. **Save files to `docs/work-items/stories/`:**
   - Name each file:
     `story-{feature-id}-{NN}-{kebab-case-title}.md`
     (e.g. `story-03-02-01-book-appointment.md`)
   - If the folder does not exist, create it.
   - If files already exist from a previous run, overwrite them.
9. **Update each parent Feature file:**
   - Open the feature file and populate the `userStories: []`
     frontmatter field with the IDs of the stories created.
     (e.g. `userStories: [story-03-02-01, story-03-02-02]`)

## User Story File Format

```markdown
---
id: story-{feature-id}-{NN}
title: {Short title describing the behaviour}
type: user-story
feature: feature-{epic-NN}-{NN}
epic: epic-{NN}
status: ready
priority: {must-have | should-have | could-have}
source: {comma-separated FR IDs}
dependencies: []
tasks: []
---

# Story {feature-id}-{NN}: {Short Title}

## User Story
As a {role from BRD},
I can {action — what the user does},
so that {outcome — the value delivered to the user or business}.

## Business Context
One or two sentences explaining why this behaviour matters.
Reference the relevant BRD functional requirement (FR-XXX).

## Acceptance Criteria
- [ ] Given {precondition}, when {action}, then {expected outcome}
- [ ] Given {precondition}, when {action}, then {expected outcome}
- [ ] Given {precondition}, when {action}, then {expected outcome}

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
Relevant technical context from the design document to guide
implementation. Include:
- Relevant API endpoints from the design doc
- Relevant domain entity states or transitions involved
- Relevant UI components from the component structure
- Any business rules from the BRD that apply to this story
Do NOT prescribe implementation — describe constraints and contracts.
```

## How to Write Good User Stories

**The statement:**
- Use the exact role name from the BRD — not generic substitutes.
  Bad:  "As a user, I can book a slot"
  Good: "As a Patient, I can select an available slot with a Practitioner"
- The action should describe what the user does, not what the system does.
  Bad:  "As a Patient, I can have an appointment created"
  Good: "As a Patient, I can confirm a booking for an available slot"
- The outcome should state the value, not repeat the action.
  Bad:  "so that I have booked an appointment"
  Good: "so that I have a confirmed time with my Practitioner"

**Acceptance criteria:**
- Use Given/When/Then format consistently.
- Each criterion must be independently testable.
- Cover the happy path first, then edge cases and error states.
- Reference lifecycle states from the BRD verbatim.
  (e.g. "Then the Appointment status is SCHEDULED")
- Include at least one criterion for an error or validation case
  where relevant.

**Priority assignment:**
- Read the BRD functional requirements section.
- Requirements marked as core or primary → must-have.
- Requirements that support or enhance core behaviours → should-have.
- Requirements prefixed with "nice to have" or described as optional
  in the BRD → could-have.
- When in doubt, default to must-have — it is safer to elevate priority
  than to defer a required behaviour.

**Technical notes:**
- Always include the relevant API endpoint from the design doc.
- Always include the relevant entity state transition if the story
  involves a lifecycle change.
- Keep technical notes brief — this is context for the developer,
  not a specification.

## Story Granularity Guidelines

**A story is too large if:**
- It covers more than one user action
- Its acceptance criteria list exceeds 6 items
- It cannot be completed by one developer in one sprint

**A story is too small if:**
- It describes a single UI element with no user value
- It cannot be demonstrated independently
- It only makes sense in the context of another story

**Split a large story by:**
- Separating the happy path from error handling
- Separating creation from editing
- Separating list view from detail view
- Separating one lifecycle state transition per story

## Naming Conventions
- Story titles are short, action-oriented phrases in sentence case.
  (e.g. "Book an appointment slot", "Cancel a scheduled appointment")
- Story IDs encode the parent feature: `story-{feature-id}-{NN}`.
- File names are kebab-case.

## What NOT to Include
- Do NOT add effort estimates — estimation is handled by estimate-agent.
- Do NOT describe implementation steps or technical decisions.
- Do NOT reference specific technologies, frameworks, or libraries.
- Do NOT write stories for behaviours not in the BRD.
- Do NOT use role names not defined in the BRD.

## Validation Checklist
Before saving, verify:
- [ ] Every feature has between 2 and 5 user stories
- [ ] Every story belongs to exactly one feature
- [ ] Every story uses a role name defined in the BRD
- [ ] Every story traces to at least one BRD FR
- [ ] Every story has at least 3 Given/When/Then criteria
- [ ] At least one criterion covers an error or validation case
- [ ] Priority is assigned to every story
- [ ] Every parent feature file has its `userStories` field updated
- [ ] No effort estimates appear anywhere in the files
- [ ] File naming convention is correct

## Example

For `feature-03-02-appointment-booking.md` (FR-006):

**Stories produced:**
```
story-03-02-01-book-appointment-slot.md       (must-have)
story-03-02-02-view-booking-confirmation.md   (must-have)
story-03-02-03-cancel-scheduled-appointment.md (should-have)
```

**Example file — `story-03-02-01-book-appointment-slot.md`:**
```markdown
---
id: story-03-02-01
title: Book an appointment slot
type: user-story
feature: feature-03-02
epic: epic-03
status: ready
priority: must-have
source: FR-006
dependencies: []
tasks: []
---

# Story 03-02-01: Book an appointment slot

## User Story
As a Patient,
I can select an available slot and confirm a booking with a Practitioner,
so that I have a scheduled Appointment at a time that suits me.

## Business Context
Core booking behaviour required by FR-006. Without this story the
Appointment Booking feature cannot function. The Appointment must be
created in SCHEDULED state upon confirmation.

## Acceptance Criteria
- [ ] Given I am viewing available slots, when I select a slot and
      confirm, then an Appointment is created with status SCHEDULED
- [ ] Given I confirm a booking, then I am shown the Appointment
      details including date, time, and Practitioner name
- [ ] Given a slot is no longer available, when I attempt to book it,
      then I see an error message and am returned to slot selection

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/appointments (creates Appointment in SCHEDULED state)
- Domain: Appointment lifecycle entry point — status must be SCHEDULED
- Component: AppointmentBookingForm (data-testid: appointment-booking-form)
- Business rule: Slot must be available at time of booking (FR-006)
```
