# SPARKathon Golden Path Demo Walkthrough

This guide details the step-by-step presentation script for the SPARKathon demo story: **Healthcare Provider Search by NPI (`JIRA-1234`)**.

---

## 1. Demo Prerequisites
Ensure all services are running:
```powershell
task dev
```
Navigate to [http://localhost:5173](http://localhost:5173).

---

## 2. Step-by-Step Presentation Script

### Step 1: Authentication & Access Control
1. **Highlight Security Gate**: Notice that unauthenticated visitors cannot see any dashboard data.
2. **Sign In**: Click the **QA Engineer** demo button (`automation.user@autocase.ai` / `AutoCase@123`).
3. **Point out Cookie Session**: The server issues an `HttpOnly` JWT cookie (`autocase_jwt`) and seamlessly mounts the protected workspace.

### Step 2: Dashboard & Database-Driven Analytics
1. **Review Quick Stats**:
   * Total Projects: `3` (retrieved from `projects` table)
   * Tests Generated: `3` (retrieved from `test_scenarios` table)
   * Successful Runs: `1` (retrieved from `validation_runs` table)
2. **Review Recent Projects & Activity**:
   * `Provider Search Automation` (Status: Completed)
   * `Payment API Tests` (Status: In Review)
   * Timeline feed showing recent audit actions.

### Step 3: Trigger Automation Creation
1. Click the **"+ Create Automation"** button in the header.
2. **Stage 1 (Requirements)**:
   * Project: `Provider Portal Automation (PROV)`
   * Jira Ticket: `JIRA-1234`
   * View the ingested requirement: *"Search providers by 10-digit NPI"*.
   * Click **Continue**.

### Step 4: Repository Detection
1. **Stage 2 (Repo Scan)**:
   * View the detected repository: `healthtech-core/provider-portal-automation`.
   * Confidence score: `98% Match`.
   * Framework: `Java 21 + Selenium + Cucumber BDD + POM`.
   * Click **Continue**.

### Step 5: AI Scenarios & Human Review
1. **Stage 3 (Scenarios)**:
   * Highlight the **AI Observations & Assumptions** box (separating observed UI facts from assumptions).
   * Review the 5 generated BDD scenarios:
     1. *Valid NPI search returns provider record* (Positive)
     2. *Invalid NPI format displays error banner* (Validation)
     3. *Empty NPI search displays alert* (Validation)
     4. *Unregistered NPI displays empty state* (Negative)
     5. *Clear button resets filter* (Positive)
   * Click **Continue**.

### Step 6: Generated Code & Split Diff Preview
1. **Stage 4 (Generated Code)**:
   * Switch between tabs:
     * `provider_search.feature` (Gherkin feature file)
     * `ProviderSearchPage.java` (Selenium Page Object)
     * `ProviderSearchSteps.java` (Cucumber Step Definitions)
   * Click **Copy Code** to demonstrate developer ergonomics.
   * Click **Continue**.

### Step 7: Validation & Safe Git Delivery
1. **Stage 5 (Validate & Deliver)**:
   * Technical checks display: `PASSED (4/4 Checks)` in `1.48s`.
   * Click **"Push to GitLab & Create Merge Request"**.
   * Observe success banner:
     * Branch created: `ai-generated/JIRA-1234-provider-search-tests`
     * GitLab Merge Request link: `MR #42`
2. Close the modal:
   * Notice that the **Notification Bell** in the top right increments.
   * Open the notification drawer to inspect the newly delivered MR notification.
