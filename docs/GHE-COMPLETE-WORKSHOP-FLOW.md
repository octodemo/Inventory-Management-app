# 90-Minute EXPRESS Agentic SDLC Workshop — GitHub Edition

**⏱️ Total Time:** 90-105 minutes  
**🎯 Goal:** Requirements → Design → Working App → Tests — All AI-Generated  
**🛠️ Tools:** VS Code + GitHub.com only (app runs locally)  
**📅 Last Updated:** August 2026

---

## 🚀 QUICK START — READ THIS FIRST!

This is a **streamlined** workshop optimized for **90-105 minutes**. Follow this guide step-by-step with your customer.

**What's been cut to save time:**
- ❌ Feature layer (go Epic → Story → Task directly)
- ❌ Effort estimation agent (show pre-generated report)
- ❌ Sprint planning agent (skip entirely)
- ❌ Unit test generation (optional)
- ❌ Detailed GitHub CLI automation (manual faster for 3-4 issues)
- ❌ PR workflow (commit direct to main)

**What you'll showcase:**
- ✅ AI-generated BRD from requirements
- ✅ AI-generated design with Mermaid diagrams (GitHub renders!)
- ✅ AI-generated work breakdown (Epic → Story → Task)
- ✅ AI-generated full-stack code (DB + API + UI)
- ✅ **Running application** in browser (customer sees it work!)
- ✅ AI-generated E2E tests (automated browser testing)
- ✅ GitHub Actions CI pipeline

---

## ✅ PRE-WORKSHOP SETUP (30 Minutes Before Customer Arrives!)

### 1. Fill `workshop-stack.md`

**Recommended stack for speed:**
```yaml
Backend: Node.js + Express + TypeScript
Frontend: React + TypeScript
Database: SQLite (no setup needed!)
Test Framework: Playwright
```

Open `workshop-stack.md` and fill **ALL** `{placeholder}` values. Use these defaults:

```
language: typescript
backend_framework: express
frontend_framework: react
database_type: sqlite
orm: prisma
test_framework: playwright
dev_server_url: http://localhost:3000
```

**✅ Checkpoint:** Run `git add workshop-stack.md && git commit -m "Configure stack"`

---

### 2. Prepare Small Requirement (Use This!)

**Copy this requirement** (keeps demo to 90 min — 3 entities, 1 user flow):

```
Simple Inventory Management System

Users need to:
- Add/view/edit Products (name, SKU, price, quantity)
- Track Stock Movements (product, quantity change, date, type: in/out)
- View current Stock Levels (product, available quantity)

Roles: Admin (full access), Viewer (read-only)

Requirements:
- Admin can add, edit, delete products
- Admin can record stock movements (receive/ship)
- Both roles can view product list and stock levels
- System tracks movement history
```

**Save this** to `requirements.txt` for easy copy-paste during the workshop.

---

### 3. GitHub Setup (Do This NOW!)

```powershell
# Create repo
gh repo create workshop-demo --public --clone
cd workshop-demo

# Copy workshop framework files
# (Assumes you have the workshop framework in a sibling folder)
# Adjust path as needed
cp -r ../agentic-sdlc-workshop-tech-agnostic/.github .
cp -r ../agentic-sdlc-workshop-tech-agnostic/docs .
cp ../agentic-sdlc-workshop-tech-agnostic/workshop-stack.md .
cp ../agentic-sdlc-workshop-tech-agnostic/package.json .
cp ../agentic-sdlc-workshop-tech-agnostic/playwright.config.ts .

# Commit framework
git add .
git commit -m "Add workshop framework"
git push

# Create labels
gh label create epic --color "8B5CF6"
gh label create user-story --color "3B82F6"
gh label create task --color "10B981"
gh label create database --color "EF4444"
gh label create backend --color "F59E0B"
gh label create frontend --color "EC4899"
gh label create e2e-test --color "06B6D4"
```

**✅ Checkpoint:** Verify repo exists at `github.com/<your-org>/workshop-demo`

---

### 4. Install Dependencies

```powershell
npm install
```

**✅ Checkpoint:** All pre-setup complete! You're ready for the customer.

---

## 📋 WORKSHOP FLOW (Follow Step-by-Step with Customer)

### **⏱️ [0-10 min] Phase 1: BRD Generation**

**Agent:** `brd-agent`

**What to do:**

1. **Open VS Code** in `workshop-demo` folder
2. **Open Copilot Chat** (Ctrl+Shift+I or Cmd+Shift+I)
3. **Select `brd-agent`** from Agent dropdown (top of chat panel)
4. **Paste the requirement text** from pre-setup (inventory system)
5. **Press Enter**

**What Copilot does:**
- Analyzes requirement text
- Generates structured BRD with functional requirements, user roles, and entities
- Creates `docs/requirements/BRD.md`

**Immediately after generation:**
```powershell
git add docs/requirements/BRD.md
git commit -m "Add BRD"
git push
```

**✅ DEMO MOMENT 1:** Open `docs/requirements/BRD.md` on GitHub in browser  
👉 Show customer the **structured requirements** with FR-001, FR-002, etc.

**Duration:** 8-10 minutes

---

### **⏱️ [10-22 min] Phase 2: Design Document**

**Agent:** `design-agent`

**What to do:**

1. **Select `design-agent`** from Agent dropdown
2. **Type:** `create design from BRD`
3. **Press Enter**

**What Copilot does:**
- Reads `docs/requirements/BRD.md`
- Reads `workshop-stack.md` (knows your tech stack!)
- Generates complete design document with:
  - Architecture diagram (Mermaid)
  - ER diagram (Mermaid)
  - API endpoints
  - Component structure
  - Seed data plan
- Creates `docs/design/design-doc.md`

**Immediately after generation:**
```powershell
git add docs/design/
git commit -m "Add design document"
git push
```

**✅ DEMO MOMENT 2:** Open `docs/design/design-doc.md` on GitHub  
👉 **WOW!** GitHub renders the **Mermaid architecture diagram** natively!  
👉 Scroll to ER diagram — also rendered!  
👉 Show API endpoints — fully specified by AI

**Duration:** 10-12 minutes

---

### **⏱️ [22-35 min] Phase 3: Work Breakdown (Simplified)**

**⚡ We skip the Feature layer to save time — go Epic → Story → Task**

#### **Step 3a: Create Epic** (3 min)

**Agent:** `epic-agent`

1. **Select `epic-agent`** from Agent dropdown
2. **Type:** `create epics from design doc`
3. **Press Enter**

**Output:** `docs/work-items/epics/epic-01-inventory-management.md`

```powershell
git add docs/work-items/epics/
git commit -m "Add epics"
```

---

#### **Step 3b: Create User Stories** (5 min)

**Agent:** `user-story-agent`

1. **Select `user-story-agent`** from Agent dropdown
2. **Type:** `create stories from epic-01`
3. **Press Enter**

**Output:** `docs/work-items/stories/story-01-manage-products.md` (and 1-2 more)

```powershell
git add docs/work-items/stories/
git commit -m "Add user stories"
```

---

#### **Step 3c: Create Tasks** (5 min)

**Agent:** `task-agent`

1. **Select `task-agent`** from Agent dropdown
2. **Type:** `create tasks for story-01`
3. **Press Enter**

**Output:** Task files in `issues/` folder:
```
issues/01-DATABASE-product-model.md
issues/02-BACKEND-product-api.md
issues/03-FRONTEND-product-list.md
issues/04-E2E-TEST-products.md
```

```powershell
git add issues/
git commit -m "Add tasks"
git push
```

**✅ Checkpoint:** Show customer the `issues/` folder with 4-6 task files  
👉 Each task has **title, acceptance criteria, FR traceability**

**Duration:** 13 minutes total

---

### **⏱️ [35-40 min] Phase 4: GitHub Issues (Manual)**

**Skip automation — create 3 issues manually on github.com (faster!)**

1. Go to `github.com/<your-org>/workshop-demo/issues`
2. Click **New Issue**
3. **Title:** `[DATABASE] Product model`
4. **Body:** Copy from `issues/01-DATABASE-product-model.md`
5. **Labels:** Add `task`, `database`
6. Click **Create issue**
7. **Repeat** for:
   - `[BACKEND] Product API` (labels: `task`, `backend`)
   - `[FRONTEND] Product list` (labels: `task`, `frontend`)

**✅ DEMO MOMENT 3:** Show the 3 GitHub Issues  
👉 "These are our implementation tasks — AI generated the breakdown!"

**Duration:** 5 minutes

---

### **⏱️ [40-45 min] Phase 5: Scaffold**

**Agent:** `scaffold-agent`

**What to do:**

1. **Select `scaffold-agent`** from Agent dropdown
2. **Type:** `generate the project scaffold`
3. **Press Enter**

**What Copilot does:**
- Reads `workshop-stack.md`
- Generates complete folder structure:
  ```
  src/
    models/         (for Prisma/TypeORM/etc.)
    routes/         (Express routes)
    services/       (business logic)
    components/     (React components)
    pages/          (React pages)
  ```
- Creates `package.json` with dependencies
- Creates Prisma schema (if using Prisma)
- Updates `playwright.config.ts` with correct paths

**Immediately after generation:**
```powershell
npm install
git add .
git commit -m "Add project scaffold"
git push
```

**Duration:** 5 minutes

---

### **⏱️ [45-70 min] Phase 6: Implementation (1 Complete Flow Only!)**

**Implement ONLY Product management:** DATABASE → BACKEND → FRONTEND  
**(Skip Stock Movements to save time — show it can be done the same way)**

---

#### **[45-50 min] DATABASE Task**

**Agent:** `implement-agent`

1. **Select `implement-agent`** from Agent dropdown
2. **Type:** `implement issues/01-DATABASE-product-model.md`
3. **Press Enter**

**Output:** 
- `src/models/Product.ts` (if TypeORM)
- OR updates to `prisma/schema.prisma` (if Prisma)

```powershell
git add src/models/ prisma/
git commit -m "[DATABASE] Product model"
```

**Duration:** 5 minutes

---

#### **[50-60 min] BACKEND Task**

**Agent:** `implement-agent`

1. **Type:** `implement issues/02-BACKEND-product-api.md`
2. **Press Enter**

**Output:**
```
src/routes/products.ts        (Express routes: GET, POST, PUT, DELETE)
src/services/productService.ts (business logic)
```

**What Copilot generates:**
- CRUD API endpoints (`/api/products`)
- Request validation
- Error handling
- Database integration

```powershell
git add src/routes/ src/services/
git commit -m "[BACKEND] Product API"
```

**Duration:** 10 minutes

---

#### **[60-70 min] FRONTEND Task**

**Agent:** `implement-agent`

1. **Type:** `implement issues/03-FRONTEND-product-list.md`
2. **Press Enter**

**Output:**
```
src/pages/Products.tsx          (main page)
src/components/ProductList.tsx   (list component)
src/components/ProductForm.tsx   (add/edit form)
```

**What Copilot generates:**
- React components with TypeScript
- State management (useState/useEffect)
- API calls to backend
- Form validation
- **data-testid attributes** (for E2E tests later!)

```powershell
git add src/pages/ src/components/
git commit -m "[FRONTEND] Product pages"
git push
```

**Duration:** 10 minutes

---

### **⏱️ [70-75 min] Phase 7: RUN THE APP! 🎉**

**🎯 THIS IS YOUR KEY DEMO MOMENT — Customer sees the working application!**

**What to do:**

```powershell
# Generate Prisma client (if using Prisma)
npx prisma generate

# Create database tables
npx prisma db push

# Seed database (optional — scaffold-agent may have created this)
npm run seed

# Start the development server
npm run dev
```

**Expected output:**
```
> workshop-demo@1.0.0 dev
> concurrently "npm run dev:server" "npm run dev:client"

Server running on http://localhost:3001
Frontend running on http://localhost:3000
```

**Open browser:**
```powershell
start http://localhost:3000   # Windows
# open http://localhost:3000  # macOS
```

**✅ DEMO MOMENT 4 — THE BIG ONE!**  
👉 **Show the running application in the browser!**  
👉 Click "Add Product" → enter data → Save  
👉 See product appear in the list  
👉 Click Edit → modify → Save  
👉 **"This entire application was generated by AI in ~25 minutes of coding time!"**

**Duration:** 5 minutes

---

### **⏱️ [75-85 min] Phase 8: E2E Testing**

**Agent:** `playwright-agent`

**⚠️ KEEP THE APP RUNNING!** (Playwright will test against `http://localhost:3000`)

**What to do:**

1. **Open a NEW terminal** (keep dev server running in the first one)
2. **In VS Code Copilot Chat**, select `playwright-agent`
3. **Type:** `create tests for issues/04-E2E-TEST-products.md`
4. **Press Enter**

**Output:** `e2e/products.spec.ts`

**What Copilot generates:**
- Test that adds a product
- Test that views product list
- Test that edits a product
- Uses `data-testid` selectors (from the design doc!)

**Run the test:**
```powershell
npx playwright test --headed
```

**✅ DEMO MOMENT 5 — AUTOMATION MAGIC!**  
👉 Watch the **browser open automatically**  
👉 Watch Playwright **click buttons, type text, verify results**  
👉 All **without any manual test scripting** — AI generated the tests!

**View HTML report:**
```powershell
npx playwright show-report docs/test-reports/
```

**Commit:**
```powershell
git add e2e/ docs/test-reports/
git commit -m "[E2E] Product tests"
git push
```

**Duration:** 10 minutes

---

### **⏱️ [85-90 min] Phase 9: GitHub Actions CI**

**Create `.github/workflows/ci.yml`:**

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx prisma generate
      - run: npx prisma db push
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: docs/test-reports/
```

```powershell
# Create the file manually or use Copilot to generate it
git add .github/workflows/ci.yml
git commit -m "Add CI workflow"
git push
```

**✅ DEMO MOMENT 6:** Open GitHub in browser  
👉 Go to **Actions** tab  
👉 Show the **running workflow** (triggered by push)  
👉 **Green checkmark** = tests passed automatically!  
👉 Click workflow → **download Playwright report artifact**

**Duration:** 5 minutes

---

## 🎉 WRAP-UP & RECAP (90 min mark)

**Show customer what we accomplished in 90 minutes:**

| **Phase** | **What AI Generated** | **Time** |
|---|---|---|
| **1. BRD** | Structured requirements with FR-001, FR-002, user roles | 10 min |
| **2. Design** | Architecture + ER diagrams (Mermaid!), API specs, component structure | 12 min |
| **3. Work Breakdown** | Epic → Stories → Tasks with acceptance criteria | 13 min |
| **4. GitHub Issues** | Created 3 issues manually (could automate) | 5 min |
| **5. Scaffold** | Complete folder structure, package.json, config files | 5 min |
| **6. Implementation** | Database model, API routes, React components (~600 LoC) | 25 min |
| **7. Running App** | Fully functional application in browser! | 5 min |
| **8. E2E Tests** | Automated browser tests with Playwright | 10 min |
| **9. CI/CD** | GitHub Actions pipeline validates every commit | 5 min |

**Total:** ~90 minutes  
**Lines of Code Generated:** ~800-1000  
**Manual Coding:** 0 lines  
**Equivalent Manual Effort:** 2-3 days

---

## ✅ SUCCESS METRICS — What Customer Saw

1. ✅ **AI-powered requirements** → structured BRD
2. ✅ **AI-powered design** → Mermaid diagrams rendered on GitHub
3. ✅ **AI-powered breakdown** → Epic/Story/Task hierarchy
4. ✅ **AI-powered code generation** → Full stack (DB + API + UI)
5. ✅ **Working application** → Running in browser with CRUD operations
6. ✅ **AI-powered tests** → E2E automation with Playwright
7. ✅ **GitHub-native platform** → Issues, native Mermaid rendering, Actions

**💡 Key Differentiators:**
- **GitHub renders Mermaid natively** → No external tools needed for diagrams
- **GitHub Issues + Labels** → Native project management, no ADO needed
- **GitHub Actions** → Built-in CI/CD, free for public repos
- **Copilot Agents** → Specialized AI for each SDLC phase
- **End-to-end in 90 minutes** → What normally takes days

---

## ⚠️ TROUBLESHOOTING

### **Agent not found in dropdown**
- Check `.github/agents/` folder exists in repo
- Reload VS Code window (Ctrl+Shift+P → "Reload Window")

### **App won't start**
- Run `npm install` first
- Check port 3000 not in use: `netstat -ano | findstr :3000` (Windows)
- Kill process if needed: `taskkill /PID <pid> /F`

### **Playwright test fails**
- Ensure app is running at `http://localhost:3000`
- Run `npx playwright install` if browsers not installed
- Check `playwright.config.ts` has correct `baseURL`

### **GitHub CLI errors**
- Verify authentication: `gh auth status`
- Re-login: `gh auth login`

### **Prisma/Database errors**
- Run `npx prisma generate` after schema changes
- Run `npx prisma db push` to create tables
- Delete `prisma/dev.db` and re-run `db push` to reset

---

## 📚 OPTIONAL: What We Skipped (Can Show if Extra Time)

If you finish early or customer asks, you can optionally demonstrate:

### **Effort Estimation** (5 min)
```
Select estimate-agent → "analyze all work"
```
Shows HTML report with effort rolled up Epic → Story → Task

### **Sprint Planning** (10 min)
```
Select sprint-planning-agent → "create sprint plan"
```
Interactive capacity planning with HTML report

### **Unit Tests** (10 min per backend task)
```
Select unit-test-agent → "generate unit tests for issues/02-BACKEND-product-api.md"
```
Generates Jest/Vitest tests for API routes

### **GitHub Project Board** (5 min)
- Create a GitHub Project
- Add Issues to the board
- Show Kanban view with task status

---

## 🎯 FACILITATOR NOTES

**Before workshop:**
- [ ] Fill `workshop-stack.md` completely
- [ ] Create GitHub repo with labels
- [ ] Test the requirement text generates good output
- [ ] Run through scaffold → implement → run app locally once
- [ ] Have browser bookmarks ready (GitHub repo, Actions tab)

**During workshop:**
- [ ] Narrate what each agent is doing while it generates
- [ ] Emphasize **zero manual coding** throughout
- [ ] Pause at DEMO MOMENTS to let customer see the output
- [ ] Keep energy high when showing running app (Phase 7!)
- [ ] If any step fails, have a backup branch with working code

**After workshop:**
- [ ] Share the repo link with customer
- [ ] Point them to docs/reports/ for HTML reports
- [ ] Explain they can clone and extend this workflow

---

**Questions or need help?**  
Refer to the full [COMPLETE-WORKSHOP-FLOW.md](./COMPLETE-WORKSHOP-FLOW.md) for detailed explanations.

