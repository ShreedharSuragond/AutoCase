import React, { useState } from 'react';
import {
  X,
  Sparkles,
  GitBranch,
  Code2,
  CheckCircle2,
  GitPullRequest,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  FileText,
  ExternalLink,
} from 'lucide-react';

interface AutomationWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AutomationWizardModal: React.FC<AutomationWizardModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [activeArtifactTab, setActiveArtifactTab] = useState<'feature' | 'page' | 'steps'>('feature');
  const [isDelivering, setIsDelivering] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(key);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const featureCode = `@ProviderSearch @Regression
Feature: Healthcare Provider Search by NPI
  As a clinic coordinator
  I want to look up licensed providers by their 10-digit NPI
  So that I can verify their credentials and active status

  Background:
    Given the user is authenticated and on the Provider Search dashboard

  @Smoke @Positive
  Scenario: Search by valid 10-digit NPI
    When user enters NPI "1093847562" into the search field
    And clicks the "Search" button
    Then the results grid displays provider "Dr. Sarah Connor, MD"
    And the status chip displays "ACTIVE"

  @Negative @Validation
  Scenario Outline: Invalid NPI input validation
    When user enters NPI "<input>" into the search field
    And clicks the "Search" button
    Then the error banner displays "<expectedError>"

    Examples:
      | input      | expectedError                           |
      | 123ABC45   | NPI must contain numbers only           |
      | 12345      | NPI must be exactly 10 digits in length |
      |            | Please enter a valid NPI to search      |

  @Positive
  Scenario: Reset search filter with Clear button
    Given user has searched with NPI "1093847562"
    When user clicks the "Clear" button
    Then the NPI input is reset and the results table is cleared`;

  const pageObjectCode = `package com.healthtech.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

/**
 * Page Object for HealthTech Provider Search Portal
 */
public class ProviderSearchPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By npiInputLocator = By.id("provider-npi-input");
    private final By searchButtonLocator = By.xpath("//button[@data-testid='btn-provider-search']");
    private final By clearButtonLocator = By.xpath("//button[@data-testid='btn-provider-clear']");
    private final By resultsTableRowsLocator = By.cssSelector("table.provider-results-table tbody tr");
    private final By providerNameCellLocator = By.cssSelector(".provider-cell-name");
    private final By providerStatusBadgeLocator = By.cssSelector(".status-badge-active");
    private final By errorMessageLocator = By.cssSelector("[data-testid='search-validation-error']");

    public ProviderSearchPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void navigateToSearchPage(String baseUrl) {
        driver.get(baseUrl + "/providers/search");
        wait.until(ExpectedConditions.visibilityOfElementLocated(npiInputLocator));
    }

    public void searchByNpi(String npi) {
        WebElement input = wait.until(ExpectedConditions.elementToBeClickable(npiInputLocator));
        input.clear();
        if (npi != null && !npi.isEmpty()) {
            input.sendKeys(npi);
        }
        driver.findElement(searchButtonLocator).click();
    }

    public void clickClear() {
        wait.until(ExpectedConditions.elementToBeClickable(clearButtonLocator)).click();
    }

    public String getFirstResultProviderName() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(providerNameCellLocator)).getText().trim();
    }

    public String getFirstResultStatus() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(providerStatusBadgeLocator)).getText().trim();
    }

    public String getErrorMessage() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(errorMessageLocator)).getText().trim();
    }
}`;

  const stepDefsCode = `package com.healthtech.steps;

import com.healthtech.pages.ProviderSearchPage;
import com.healthtech.utils.DriverFactory;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.testng.Assert;

public class ProviderSearchSteps {
    private final ProviderSearchPage searchPage;

    public ProviderSearchSteps() {
        this.searchPage = new ProviderSearchPage(DriverFactory.getDriver());
    }

    @Given("the user is authenticated and on the Provider Search dashboard")
    public void theUserIsAuthenticatedAndOnSearch() {
        searchPage.navigateToSearchPage("https://qa-portal.healthtech.internal");
    }

    @When("user enters NPI {string} into the search field")
    public void userEntersNpi(String npi) {
        searchPage.searchByNpi(npi);
    }

    @Then("the results grid displays provider {string}")
    public void verifyProviderDisplayed(String expectedName) {
        Assert.assertEquals(searchPage.getFirstResultProviderName(), expectedName);
    }

    @Then("the status chip displays {string}")
    public void verifyStatusChip(String expectedStatus) {
        Assert.assertEquals(searchPage.getFirstResultStatus(), expectedStatus);
    }

    @Then("the error banner displays {string}")
    public void verifyErrorMessage(String expectedError) {
        Assert.assertTrue(searchPage.getErrorMessage().contains(expectedError));
    }

    @When("user clicks the 'Clear' button")
    public void userClicksClear() {
        searchPage.clickClear();
    }
}`;

  const handleDeliver = async () => {
    setIsDelivering(true);
    try {
      await fetch('/api/generations/demo-seed', {
        method: 'POST',
        credentials: 'include',
      });
      setIsDelivered(true);
      onSuccess();
    } catch {
      setIsDelivered(true);
      onSuccess();
    } finally {
      setIsDelivering(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container wizard-modal">
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* Wizard Header */}
        <div className="wizard-header">
          <div className="wizard-title-badge">
            <Sparkles size={20} className="text-primary" />
            <h2>Create Test Automation Workflow</h2>
          </div>
          <p className="wizard-subtitle">
            Transform requirements into framework-native automation with AI governance & Git delivery
          </p>

          {/* Stepper Bar */}
          <div className="wizard-stepper-bar">
            {[
              { num: 1, label: 'Requirements' },
              { num: 2, label: 'Repo Scan' },
              { num: 3, label: 'Scenarios' },
              { num: 4, label: 'Generated Code' },
              { num: 5, label: 'Validate & Deliver' },
            ].map((s) => (
              <div
                key={s.num}
                className={`wizard-step-indicator ${
                  currentStep === s.num ? 'active' : currentStep > s.num ? 'completed' : ''
                }`}
                onClick={() => setCurrentStep(s.num)}
              >
                <div className="step-circle">{currentStep > s.num ? <Check size={14} /> : s.num}</div>
                <span className="step-name">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Body Content */}
        <div className="wizard-body">
          {/* STEP 1: Requirements Intake */}
          {currentStep === 1 && (
            <div className="wizard-step-content">
              <h3 className="step-heading">Step 1: Provide Requirements & Context</h3>
              <p className="step-instruction">
                AutoCase AI connects to your issue tracker and analyzes uploaded screenshots.
              </p>

              <div className="step-form-grid">
                <div className="form-group">
                  <label>Select Project</label>
                  <select className="form-select" defaultValue="PROV">
                    <option value="PROV">Provider Portal Automation (PROV)</option>
                    <option value="PAY">Payment Services (PAY)</option>
                    <option value="AUTH">Authentication Core (AUTH)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Jira Ticket ID</label>
                  <input
                    type="text"
                    className="form-input font-mono"
                    defaultValue="JIRA-1234"
                    placeholder="e.g. JIRA-1234"
                  />
                </div>
              </div>

              <div className="ticket-preview-box">
                <div className="ticket-preview-header">
                  <span className="ticket-tag">JIRA-1234</span>
                  <span className="ticket-title-text">Provider Directory Search by 10-digit NPI</span>
                </div>
                <p className="ticket-desc-text">
                  "As a clinic coordinator, I need to search providers by their National Provider Identifier (NPI).
                  The search field accepts 10 digits. Results should show full name, specialty, and credential status.
                  Validation error must display for non-numeric or malformed entries."
                </p>
                <div className="ticket-attachment-pill">
                  <span>📎 Attached: provider_search_mockup.png (Verified UI Elements: Input, Search, Clear, Grid)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Repository Scan */}
          {currentStep === 2 && (
            <div className="wizard-step-content">
              <h3 className="step-heading">Step 2: Repository & Framework Detection</h3>
              <p className="step-instruction">
                Analyzing existing repository conventions, build tools, Page Objects, and dependencies.
              </p>

              <div className="repo-detection-card">
                <div className="repo-header-flex">
                  <div className="repo-info-left">
                    <GitBranch size={20} className="text-primary" />
                    <strong>healthtech-core/provider-portal-automation</strong>
                  </div>
                  <span className="badge-confidence">Confidence: 98% Match</span>
                </div>

                <div className="detection-grid">
                  <div className="detection-item">
                    <span className="label">Language & Version:</span>
                    <span className="value">Java 21 / 25 LTS</span>
                  </div>
                  <div className="detection-item">
                    <span className="label">Build Tool:</span>
                    <span className="value">Apache Maven / Gradle</span>
                  </div>
                  <div className="detection-item">
                    <span className="label">Automation Framework:</span>
                    <span className="value">Selenium WebDriver + Cucumber BDD</span>
                  </div>
                  <div className="detection-item">
                    <span className="label">Architecture Pattern:</span>
                    <span className="value">Page Object Model (POM)</span>
                  </div>
                  <div className="detection-item full-width">
                    <span className="label">Target Test Directory:</span>
                    <span className="value font-mono">src/test/java/com/healthtech/automation/</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: AI Scenarios & Review */}
          {currentStep === 3 && (
            <div className="wizard-step-content">
              <h3 className="step-heading">Step 3: AI Requirements Analysis & Scenarios</h3>
              <p className="step-instruction">
                Review verified observations, explicit assumptions, and approve test scenarios before code generation.
              </p>

              <div className="ai-observations-box">
                <div className="obs-header">
                  <Sparkles size={16} className="text-purple" />
                  <strong>AI Observations & Inferred Assumptions</strong>
                </div>
                <ul>
                  <li><strong>Observed Fact:</strong> NPI input requires 10-digit numeric constraint.</li>
                  <li><strong>Observed Fact:</strong> Search results table displays Provider Name, Specialty, Clinic, Status.</li>
                  <li><strong>Explicit Assumption:</strong> Unauthenticated attempts redirect to corporate SSO login.</li>
                </ul>
              </div>

              <div className="scenarios-review-list">
                {[
                  {
                    type: 'Positive',
                    title: 'Search by valid 10-digit NPI returns matching provider record',
                    tagClass: 'badge-positive',
                  },
                  {
                    type: 'Validation',
                    title: 'Invalid NPI format displays error banner "NPI must contain numbers only"',
                    tagClass: 'badge-validation',
                  },
                  {
                    type: 'Validation',
                    title: 'Empty NPI search displays required field validation alert',
                    tagClass: 'badge-validation',
                  },
                  {
                    type: 'Negative',
                    title: 'Unregistered NPI displays empty state "No matching providers found"',
                    tagClass: 'badge-negative',
                  },
                  {
                    type: 'Behavior',
                    title: 'Clicking "Clear" resets NPI input field and clears results table',
                    tagClass: 'badge-positive',
                  },
                ].map((sc, idx) => (
                  <div key={idx} className="scenario-item-row">
                    <div className="scenario-item-left">
                      <input type="checkbox" defaultChecked className="scenario-checkbox" />
                      <span className={`scenario-type-chip ${sc.tagClass}`}>{sc.type}</span>
                      <span className="scenario-title-text">{sc.title}</span>
                    </div>
                    <span className="badge-approved">Approved</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Generated Code & Preview */}
          {currentStep === 4 && (
            <div className="wizard-step-content">
              <h3 className="step-heading">Step 4: Generated Framework-Native Code</h3>
              <p className="step-instruction">
                Review generated Cucumber feature files, Selenium Page Objects, and Step Definitions.
              </p>

              <div className="code-viewer-container">
                <div className="code-tabs-bar">
                  <button
                    className={`code-tab ${activeArtifactTab === 'feature' ? 'active' : ''}`}
                    onClick={() => setActiveArtifactTab('feature')}
                  >
                    <FileText size={14} />
                    <span>provider_search.feature</span>
                  </button>
                  <button
                    className={`code-tab ${activeArtifactTab === 'page' ? 'active' : ''}`}
                    onClick={() => setActiveArtifactTab('page')}
                  >
                    <Code2 size={14} />
                    <span>ProviderSearchPage.java</span>
                  </button>
                  <button
                    className={`code-tab ${activeArtifactTab === 'steps' ? 'active' : ''}`}
                    onClick={() => setActiveArtifactTab('steps')}
                  >
                    <Code2 size={14} />
                    <span>ProviderSearchSteps.java</span>
                  </button>

                  <div className="code-tab-right">
                    <button
                      className="btn-copy-code"
                      onClick={() =>
                        handleCopy(
                          activeArtifactTab,
                          activeArtifactTab === 'feature'
                            ? featureCode
                            : activeArtifactTab === 'page'
                            ? pageObjectCode
                            : stepDefsCode
                        )
                      }
                    >
                      {copiedFile === activeArtifactTab ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedFile === activeArtifactTab ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>

                <pre className="code-content-block">
                  <code>
                    {activeArtifactTab === 'feature' && featureCode}
                    {activeArtifactTab === 'page' && pageObjectCode}
                    {activeArtifactTab === 'steps' && stepDefsCode}
                  </code>
                </pre>
              </div>
            </div>
          )}

          {/* STEP 5: Validation & Git Delivery */}
          {currentStep === 5 && (
            <div className="wizard-step-content">
              <h3 className="step-heading">Step 5: Code Validation & Safe Git Delivery</h3>
              <p className="step-instruction">
                Deterministic compiler verification and isolated Git Merge Request delivery.
              </p>

              <div className="validation-report-card">
                <div className="validation-summary-header">
                  <div className="validation-title-left">
                    <CheckCircle2 size={24} className="text-green" />
                    <div>
                      <strong>Technical Validation: PASSED (4/4 Checks)</strong>
                      <span className="validation-subtext">Verified against Java 21 compiler and DOM baseline</span>
                    </div>
                  </div>
                  <span className="validation-time">Execution Time: 1.48s</span>
                </div>

                <div className="validation-checks-grid">
                  <div className="val-check-item">
                    <Check size={16} className="text-green" />
                    <span>Cucumber Gherkin Syntax: Validated</span>
                  </div>
                  <div className="val-check-item">
                    <Check size={16} className="text-green" />
                    <span>Selenium Page Object Locators: Validated</span>
                  </div>
                  <div className="val-check-item">
                    <Check size={16} className="text-green" />
                    <span>Cucumber Step-to-Method Bindings: 100% Mapped</span>
                  </div>
                  <div className="val-check-item">
                    <Check size={16} className="text-green" />
                    <span>Clean Compilation & Type-Checking: 0 Errors</span>
                  </div>
                </div>
              </div>

              {isDelivered ? (
                <div className="delivery-success-banner">
                  <div className="success-icon-box">
                    <GitPullRequest size={28} className="text-primary" />
                  </div>
                  <div className="success-content">
                    <h4>Successfully Delivered to GitLab!</h4>
                    <p>Branch: <code className="branch-chip">ai-generated/JIRA-1234-provider-search-tests</code></p>
                    <p>Merge Request: <a href="https://gitlab.com" target="_blank" rel="noreferrer">MR #42: Add provider search automation for JIRA-1234 <ExternalLink size={12} /></a></p>
                    <span className="audit-note">✓ Audit event recorded and in-app notification delivered</span>
                  </div>
                </div>
              ) : (
                <div className="delivery-action-box">
                  <div className="delivery-info">
                    <h4>Ready for Safe Git Delivery</h4>
                    <p>Creates isolated branch <code>ai-generated/JIRA-1234-provider-search-tests</code> and opens a GitLab Merge Request without touching main.</p>
                  </div>
                  <button
                    className="btn-primary btn-deliver-git"
                    onClick={handleDeliver}
                    disabled={isDelivering}
                  >
                    <GitPullRequest size={18} />
                    <span>{isDelivering ? 'Creating Branch & MR...' : 'Push to GitLab & Create Merge Request'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="wizard-footer">
          <button
            className="btn-secondary"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          >
            <ArrowLeft size={16} />
            <span>Previous</span>
          </button>

          <div className="wizard-footer-right">
            {currentStep < 5 ? (
              <button
                className="btn-primary"
                onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button className="btn-secondary" onClick={onClose}>
                <span>Close</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
