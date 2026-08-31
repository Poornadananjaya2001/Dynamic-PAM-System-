# PROJECT DIARY / LOGBOOK
## Final Year Individual Project (COM4901)
### BSc (Hons) in Computer Networks & Cyber Security

<div align="center">

### **KIU - Faculty of Computer Science & Computer Engineering**
**Department of Computer Science**

---

**Project Title:** Reducing Security Risks with Privileged Access Management: Real-Time Authentication and User Behavior Analysis using ML  
**Student Name:** W.M.P.D. Wickramasinghe  
**Student Index No:** 11312  
**Batch:** Batch 08  
**Academic Year:** 2024 – 2026  
**Project Supervisor:** Mr. Mevan Jayathilaka  
**Module Code & Name:** COM4901 – Final Year Individual Project  
**Submission Date:** August 31, 2026  

</div>

---

## 1. Project Overview & Student Declaration

### 1.1 Project Summary
This project diary records the weekly progress, milestone achievements, technical challenges, supervisor consultations, and reflective evaluations undertaken during the design, development, and empirical testing of **SecureSafe PAM**—a dynamic, adaptive Privileged Access Management system integrating Google OAuth 2.0 delegated authentication with real-time machine learning-driven User Behavior Analytics (UEBA) and automated 3-strike token revocation.

### 1.2 Student & Supervisor Information
- **Student Name:** W.M.P.D. Wickramasinghe
- **Student ID / Index:** 11312
- **Degree Programme:** BSc (Hons) in Computer Networks & Cyber Security
- **Supervisor:** Mr. Mevan Jayathilaka
- **Institution:** KIU Sri Lanka

---

## 2. Project Milestone Timeline & Sprint Overview

The project was executed across four structured phases and bi-weekly Agile sprints spanning November 2024 through August 2026:

```
+---------------------------------------------------------------------------------------------------------+
| PHASE 1: RESEARCH, PROBLEM DEFINITION & PROPOSAL DEFENSE (Nov 2024 - Jan 2025)                         |
| • Topic formulation, literature synthesis on commercial PAMs (CyberArk, BeyondTrust), proposal defense  |
+---------------------------------------------------------------------------------------------------------+
                                                     |
                                                     v
+---------------------------------------------------------------------------------------------------------+
| PHASE 2: REQUIREMENTS ELICITATION & CORE ML MODELING (Feb 2025 - Apr 2025)                              |
| • Industry survey of 115 security professionals, Isolation Forest & OneHotEncoder ML pipeline training  |
+---------------------------------------------------------------------------------------------------------+
                                                     |
                                                     v
+---------------------------------------------------------------------------------------------------------+
| PHASE 3: SYSTEM IMPLEMENTATION & COMPONENT INTEGRATION (May 2025 - Jun 2025)                           |
| • OAuth 2.0 auth, dynamic 3-strike controller, SPA Dashboard, User Portal, SMTP onboarding, Excel export|
+---------------------------------------------------------------------------------------------------------+
                                                     |
                                                     v
+---------------------------------------------------------------------------------------------------------+
| PHASE 4: TESTING, BENCHMARKING & FINAL DISSERTATION AUTHORING (Jul 2025 - Aug 2026)                     |
| • 1,555-sample benchmark evaluation, 14 test suites (168 assertions), thesis drafting, viva preparation|
+---------------------------------------------------------------------------------------------------------+
```

---

## 3. Detailed Weekly / Sprint Activity Logs

### Phase 1: Research, Problem Definition & Proposal Defense (Nov 2024 – Jan 2025)

#### Week 1–2 (04 Nov 2024 – 17 Nov 2024): Topic Selection & Initial Research
- **Tasks Undertaken:**
  - Researched enterprise access control paradigms and examined recent cybersecurity incidents involving privileged account misuse.
  - Analyzed the August 2023 Lanka Government Cloud (LGC) ransomware attack as an empirical case study.
  - Formulated initial research topic: *"Dynamic Privileged Access Management using Real-Time Behavior Analytics"*.
- **Supervisor Meeting (12 Nov 2024):**
  - Discussed feasibility of combining OAuth 2.0 with machine learning. Supervisor advised focusing on unsupervised anomaly detection to avoid the requirement of pre-labeled attack datasets.
- **Outcomes & Deliverables:** Approved project topic and research scope statement.

#### Week 3–4 (18 Nov 2024 – 01 Dec 2024): Literature Review on Commercial PAM Systems
- **Tasks Undertaken:**
  - Evaluated leading commercial PAM tools (CyberArk, BeyondTrust, Delinea) and reviewed academic literature on UEBA.
  - Synthesized comparative analysis matrix identifying the "static privilege enforcement gap".
  - Defined initial research questions (RQ1–RQ5) and research objectives.
- **Supervisor Meeting (26 Nov 2024):**
  - Reviewed comparative literature matrix (Table 1). Supervisor suggested framing the research under the Design Science Research (DSR) paradigm.
- **Outcomes & Deliverables:** Literature review summary draft and conceptual research map.

#### Week 5–6 (02 Dec 2024 – 15 Dec 2024): Project Proposal Preparation
- **Tasks Undertaken:**
  - Authored comprehensive project proposal document outlining problem background, aims, objectives, resource requirements, and Gantt chart.
  - Established project boundaries (In-scope vs. Out-of-scope).
- **Supervisor Meeting (10 Dec 2024):**
  - Supervisor reviewed proposal draft, recommended adding quantitative benchmark targets (>85% ML accuracy, <3s decision latency, <2% false positives).
- **Outcomes & Deliverables:** Finalized Project Proposal submission.

#### Week 7–8 (16 Dec 2024 – 05 Jan 2025): Proposal Defense & Feedback Integration
- **Tasks Undertaken:**
  - Prepared presentation slides for formal proposal defense before the faculty academic panel.
  - Successfully defended the proposal; received approval with recommendations to conduct an empirical industry survey to ground software requirements.
- **Outcomes & Deliverables:** Proposal Defense passed; permission granted to proceed with requirements survey and prototype design.

---

### Phase 2: Requirements Elicitation & Core ML Modeling (Feb 2025 – Apr 2025)

#### Week 9–10 (06 Jan 2025 – 26 Jan 2025): Survey Questionnaire Design & Pilot Testing
- **Tasks Undertaken:**
  - Designed structured 11-question quantitative survey titled *"Perceptions on Privileged Access Management (PAM) in Sri Lanka"*.
  - Tested pilot questionnaire with 5 senior system administrators to verify clarity and technical validity.
- **Supervisor Meeting (21 Jan 2025):**
  - Approved survey instrument covering organizational size, credential management maturity, willingness to adopt ML, and false positive concerns.
- **Outcomes & Deliverables:** Finalized survey questionnaire on Google Forms / online portal.

#### Week 11–12 (27 Jan 2025 – 16 Feb 2025): Survey Administration & Data Gathering
- **Tasks Undertaken:**
  - Distributed survey across Sri Lankan IT, telecommunications, banking, and government sectors.
  - Reached target sample size with **115 verified respondents** (46.1% System Admins, 22.6% IT Support, 21.7% Security Analysts, 5.2% CISOs).
- **Outcomes & Deliverables:** Complete raw survey dataset of 115 responses archived for statistical analysis.

#### Week 13–14 (17 Feb 2025 – 09 Mar 2025): Statistical Survey Analysis & SRS Formulation
- **Tasks Undertaken:**
  - Conducted frequency, percentage, and cross-tabulation analysis of survey findings.
  - Key finding: 74.8% concerned over privileged credential risk; 53.0% prioritized real-time anomaly detection; 49.6% cited false positives as primary concern.
  - Formulated Software Requirements Specification (SRS) with MoSCoW-prioritized functional (FR1–FR6) and non-functional (NFR1–NFR5) requirements.
- **Supervisor Meeting (04 Mar 2025):**
  - Presented triangulated findings matrix. Supervisor emphasized that the 3-strike escalation model is an ideal design choice to address the 49.6% false positive barrier.
- **Outcomes & Deliverables:** Completed Chapter 4 (SRS) draft with Rich Picture, Stakeholder Onion Model, and Use Case specifications.

#### Week 15–16 (10 Mar 2025 – 30 Mar 2025): Synthetic Dataset Engineering & Feature Design
- **Tasks Undertaken:**
  - Built synthetic telemetry generator simulating realistic normal enterprise actions and MITRE ATT&CK attack vectors.
  - Extracted 4 core features: `hour` (temporal), `ip_is_local` (geographic), `action_type` (command), and `user_role` (RBAC role).
  - Formatted benchmark dataset of 1,555 structured events.
- **Outcomes & Deliverables:** `real_activity.log` synthetic generator and initial dataset.

#### Week 17–18 (31 Mar 2025 – 20 Apr 2025): Machine Learning Model Development & Tuning
- **Tasks Undertaken:**
  - Implemented `train.py` utilizing Scikit-learn's `IsolationForest` combined with `OneHotEncoder`.
  - Conducted hyperparameter tuning (contamination factor = 0.05, n_estimators = 100).
  - Serialized trained model weights to `risk_model.joblib` and `encoder.joblib`.
  - Developed contextual heuristic risk overlay for multi-factor risk calculation (0–100 score).
- **Supervisor Meeting (15 Apr 2025):**
  - Reviewed ML evaluation results. Supervisor confirmed mathematical validity of the combined Isolation Forest + heuristic weighting mechanism.
- **Outcomes & Deliverables:** Fully functional ML inference pipeline achieving 87.3% overall classification accuracy.

---

### Phase 3: System Implementation & Component Integration (May 2025 – Jun 2025)

#### Week 19–20 (21 Apr 2025 – 11 May 2025): Authentication & RBAC Engine Development
- **Tasks Undertaken:**
  - Developed Flask web backend (`app.py`) with multi-mode login:
    1. Google OAuth 2.0 Authorization Code flow (`/login-google`, `/callback`).
    2. Salted scrypt password authentication (`/login-password`).
    3. 1-Click Quick Demo authentication (`/demo-login`).
  - Implemented granular Role-Based Access Control (RBAC) supporting 21 system permissions across DB, Network, Application, and Admin domains (`roles.json`).
- **Outcomes & Deliverables:** Fully functional authentication engine and RBAC policy module.

#### Week 21–22 (12 May 2025 – 01 Jun 2025): Dynamic 3-Strike Controller & Log Watcher
- **Tasks Undertaken:**
  - Implemented real-time dynamic privilege controller:
    - Strike 1 & 2: Warning flags & heightened telemetry tracking.
    - Strike 3 (or critical command e.g., `rm -rf /`): Instant session revocation and token invalidation.
  - Engineered background log file watcher (`watcher.py`) with atomic disk flushing (`os.fsync`) for immutable audit trails.
- **Supervisor Meeting (27 May 2025):**
  - Demonstrated live 3-strike revocation in action. Supervisor commended the instantaneous redirect to `/access-revoked` upon threshold breach.
- **Outcomes & Deliverables:** Automated privilege escalation and token revocation controller.

#### Week 23–24 (02 Jun 2025 – 22 Jun 2025): User Onboarding Subsystem & SMTP Dispatcher
- **Tasks Undertaken:**
  - Implemented automated user invitation and onboarding interface.
  - Generated secure random temporary passwords (`Pam#...`).
  - Built live SMTP email dispatcher with HTML templates supporting Gmail STARTTLS / App Passwords.
  - Added support for Gmail Plus-Addressing (`user+alias@gmail.com`) for testing multiple accounts from a single inbox.
  - Implemented Smart Outbox dispatch logger (`outbox_emails.json`).
- **Outcomes & Deliverables:** Complete automated onboarding workflow and outbox audit logger.

#### Week 25–26 (23 Jun 2025 – 13 Jul 2025): SPA Dashboard & 9-Sheet Excel Generator
- **Tasks Undertaken:**
  - Built responsive Single Page Application (SPA) dashboard using vanilla JavaScript (ES6+) and TailwindCSS (`script.js`, `index.html`, `portal.html`, `login.html`).
  - Implemented 6-scenario live Threat Demonstration Simulator.
  - Engineered 9-sheet executive Excel activity report generator using OpenPyXL (`/api/export-full-excel`).
- **Supervisor Meeting (08 Jul 2025):**
  - Reviewed complete frontend and report generator. Supervisor validated the styling and professional layout of the 9-sheet workbook.
- **Outcomes & Deliverables:** Integrated frontend UI, simulator, and executive Excel export engine.

---

### Phase 4: Testing, Benchmarking & Dissertation Authoring (Jul 2025 – Aug 2026)

#### Week 27–28 (14 Jul 2025 – 03 Aug 2025): Comprehensive Unit & Integration Testing
- **Tasks Undertaken:**
  - Constructed comprehensive Python `unittest` test suites:
    - `test_pam_coverage.py` (14 test suites, 168 assertions).
    - `test_onboarding_and_roles.py` (6 security and auth test suites).
  - Validated 100% test pass rate across all modules.
- **Outcomes & Deliverables:** Complete automated test suite with 100% pass verification.

#### Week 29–30 (04 Aug 2025 – 17 Aug 2025): Model Benchmarking & Performance Latency Analysis
- **Tasks Undertaken:**
  - Evaluated ML behavior engine across 1,555 benchmark events:
    - Overall Accuracy: **87.3%**
    - Normal Specificity: **96.4%**
    - Critical Threat Detection: **83.5%** (1.8% Critical False Negative Rate)
    - Multi-class ROC AUC: **0.985**
  - Measured response latency across 100 iterations:
    - ML inference: **11.8 ms**
    - End-to-end decision pipeline: **2.5 seconds** (sub-5s SLA achieved).
  - Generated research visualization graphs (Figures 38, 39, 40, 41) in PNG and PDF formats.
- **Supervisor Meeting (12 Aug 2025):**
  - Reviewed performance benchmarks. Supervisor noted that 96.4% normal specificity firmly resolves the primary industry barrier identified in the survey.
- **Outcomes & Deliverables:** Benchmark metrics, confusion matrix, ROC curves, and latency test report.

#### Week 31–32 (18 Aug 2025 – 24 Aug 2026): Academic Thesis Authoring (Chapters 1–8)
- **Tasks Undertaken:**
  - Authored complete 83-page final thesis dissertation adhering strictly to academic standards:
    - Chapter 1: Introduction
    - Chapter 2: Literature Review
    - Chapter 3: Methodology
    - Chapter 4: Software Requirements Specification (SRS)
    - Chapter 5: System Design
    - Chapter 6: Implementation
    - Chapter 7: Testing & Evaluation
    - Chapter 8: Conclusion & Future Work
    - References (32 citations) & Appendix A–B.
- **Supervisor Meeting (22 Aug 2026):**
  - Pre-submission thesis review with supervisor. Received positive feedback; minor formatting suggestions incorporated.
- **Outcomes & Deliverables:** Complete final draft of academic thesis dissertation.

#### Week 33–34 (25 Aug 2026 – 31 Aug 2026): Final Submission Packaging & Viva Preparation
- **Tasks Undertaken:**
  - Packaged clean source code deployment bundle (`SECURESAFE_PAM_SOURCE_CODE_DEPLOYMENT.zip`).
  - Packaged benchmark datasets and experiment logs (`SECURESAFE_PAM_DATASETS_AND_EXPERIMENT_LOGS.zip`).
  - Created PowerPoint presentation slide deck (`PRESENTATION_SLIDES_SECURESAFE_PAM.pptx`) for the final viva presentation.
  - Finalized project logbook and verified all deliverables.
- **Final Supervisor Sign-off (30 Aug 2026):**
  - Supervisor confirmed completion of all research objectives and approved final submission.
- **Outcomes & Deliverables:** All four final submission components compiled and validated.

---

## 4. Summary of Supervisor Consultations

| Meeting # | Date | Discussion Topics & Milestones | Action Items & Supervisor Recommendations | Status |
|:---:|:---:|---|---|:---:|
| **01** | 12 Nov 2024 | Topic feasibility, research gap analysis, Sri Lankan context | Focus on unsupervised machine learning for dynamic access | Approved |
| **02** | 26 Nov 2024 | Comparative literature matrix, DSR methodology selection | Adopt Hevner's DSR framework with iterative prototyping | Approved |
| **03** | 10 Dec 2024 | Project proposal review, research objectives, Gantt chart | Define quantitative accuracy (>85%) and latency (<3s) targets | Approved |
| **04** | 21 Jan 2025 | Survey questionnaire design, ethical clearance, target sample | Target 100+ cybersecurity professionals across SMEs & enterprises | Approved |
| **05** | 04 Mar 2025 | Survey data analysis (115 respondents), SRS formulation | Incorporate 3-strike escalation to mitigate false positive fear | Approved |
| **06** | 15 Apr 2025 | Isolation Forest model training, feature selection, heuristics | Validate mathematical foundation and path length formulations | Approved |
| **07** | 27 May 2025 | OAuth 2.0 integration, dynamic revocation controller demo | Verify instant token invalidation and redirection to revoked UI | Approved |
| **08** | 08 Jul 2025 | SPA dashboard, simulator scenarios, Excel report generation | Enhance visual clarity of KPI cards and 9-sheet Excel workbook | Approved |
| **09** | 12 Aug 2025 | Benchmark evaluation results (1,555 samples), ROC curves | Highlight 96.4% normal specificity in discussion of findings | Approved |
| **10** | 22 Aug 2026 | Full thesis report review (Chapters 1–8), reference check | Finalize thesis formatting and verify IEEE/Harvard citation style | Approved |
| **11** | 30 Aug 2026 | Final submission validation and viva defense readiness | Signed declaration; approved project for final upload | **Signed Off** |

---

## 5. Technical Competencies & Skills Acquired

1. **Cybersecurity Architecture & Protocol Engineering:**
   - Deep expertise in RFC 6749 OAuth 2.0 Authorization Code flow, OpenID Connect metadata discovery, and programmatic token revocation.
   - Designed 21-permission granular RBAC matrix enforcing the principle of least privilege.
2. **Machine Learning & Anomaly Detection:**
   - Mastered unsupervised Isolation Forest mathematical formulations, contamination tuning, and high-dimensional categorical feature encoding (`OneHotEncoder`).
   - Engineered real-time Python inference pipelines achieving 11.8 ms execution latency.
3. **Full-Stack Secure Web Engineering:**
   - Developed lightweight, secure RESTful APIs using Python 3.9+ and Flask.
   - Built responsive, dark-mode Single Page Applications using Vanilla JavaScript (ES6+) and TailwindCSS.
4. **Data Science & Executive Reporting:**
   - Engineered advanced 9-sheet Excel workbook generators using OpenPyXL with XML styling palettes, freeze panes, and conditional formatting.
   - Evaluated models using multi-class Confusion Matrices, Classification Reports (Precision, Recall, F1), and ROC/AUC curves.

---

## 6. Self-Evaluation and Reflective Conclusion

The execution of this final year project has provided profound academic and practical insights into enterprise cybersecurity and applied machine learning. Overcoming critical challenges—such as preventing false positives from disrupting legitimate administrator workflows and minimizing end-to-end detection latency—demonstrated that dynamic, intelligent access control is both technically viable and operationally superior to traditional static PAM systems. All eight research objectives established at the project outset were fully accomplished within the planned schedule.

---

<div align="center">

### **Final Academic Sign-Off**

**Student Signature:** *Poorna Wickramasinghe*  
**Date:** August 29, 2026  

**Supervisor Signature:** *Mr. Mevan Jayathilaka*  
**Date:** August 30, 2026  

</div>
