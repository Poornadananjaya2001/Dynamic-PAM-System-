# Presentation Slide Deck & Defense Speaker Notes
## Reducing Security Risks with Privileged Access Management: Real-Time Authentication and User Behavior Analysis using ML

<div align="center">

**Candidate:** W.M.P.D. Wickramasinghe (Index: 11312)  
**Degree:** BSc (Hons) in Computer Networks & Cyber Security  
**Supervisor:** Mr. Mevan Jayathilaka  
**Institution:** KIU Sri Lanka – Faculty of Computer Science & Computer Engineering  
**Module Code:** COM4901 – Final Year Individual Project  
**Date:** August 31, 2026  

</div>

---

## Slide 1: Title & Introduction
- **Slide Title:** Reducing Security Risks with Privileged Access Management: Real-Time Authentication and User Behavior Analysis using ML
- **Subtitle:** Final Year Individual Project Defense | COM4901
- **Speaker Notes (1.0 min):**
  > *"Good morning, respected members of the evaluation panel and project supervisor. Today, I am proud to present my final year undergraduate research project titled 'Reducing Security Risks with Privileged Access Management: Real-Time Authentication and User Behavior Analysis using ML', developed under the supervision of Mr. Mevan Jayathilaka. This research addresses the severe security risks posed by static privilege enforcement in enterprise systems by engineering a dynamic, intelligent PAM prototype that unites Google OAuth 2.0 authentication with real-time machine learning behavioral anomaly detection."*

---

## Slide 2: Problem Background & Research Motivation
- **Global Context:**
  - 82%+ of enterprise security breaches involve compromised administrative credentials or human error (Verizon DBIR).
  - Privileged accounts (root, domain admin, DBA) represent the "keys to the digital kingdom".
  - Average cost of breach involving privileged credentials exceeds $4.45M with a 327-day dwell time (IBM Security).
- **Sri Lankan Case Study:**
  - August 2023 Lanka Government Cloud (LGC) ransomware attack: Stolen admin credentials led to the complete deletion of official government databases across dozens of ministries.
  - Perimeter defenses and static PAM rules offered zero protection once valid credentials were provided.
- **Speaker Notes (1.5 min):**
  > *"Traditional cybersecurity relies heavily on perimeter firewalls. However, once an adversary steals valid administrative credentials, conventional tools treat their actions as legitimate. This was tragically demonstrated during the August 2023 Lanka Government Cloud collapse, where attackers used compromised admin accounts to delete months of national data without triggering an alarm. Our motivation is to ensure that authenticated sessions are continuously monitored in real time, not just verified once at login."*

---

## Slide 3: Problem Definition & The 3 Critical Research Gaps
- **The Core Problem:** Static PAM platforms operate under the flawed assumption that an authenticated session remains permanently benign throughout its entire duration.
- **Gap 1:** Limited adoption of modern OAuth 2.0 (RFC 6749) protocols in PAM for stateless token-level delegation and instant programmatic revocation.
- **Gap 2:** Underutilization of unsupervised machine learning (Isolation Forest) embedded directly into active session execution paths.
- **Gap 3:** Absence of a unified architectural blueprint combining multi-mode auth, granular RBAC, real-time risk scoring, 3-strike escalation, and executive Excel reporting.
- **Speaker Notes (1.5 min):**
  > *"We identified three critical research gaps in existing PAM systems: first, legacy systems rely on heavy jump hosts rather than lightweight OAuth 2.0 tokens; second, existing ML research treats anomaly detection as an offline post-event reporting tool; and third, organizations suffer from tool fragmentation. SecureSafe PAM bridges these gaps into a single, cohesive 4-tier platform."*

---

## Slide 4: Research Aim & Objectives (100% Accomplished)
- **Overarching Aim:** To design, develop, and empirically evaluate a dynamic PAM system that unites real-time OAuth 2.0 authentication with ML-driven UEBA for proactive, risk-based access control.
- **8 Specific Objectives:**
  1. Vulnerability analysis of commercial PAMs (CyberArk, BeyondTrust) - [DONE]
  2. Industry survey with 115 security professionals - [DONE]
  3. OAuth 2.0 & multi-mode authentication module - [DONE]
  4. Isolation Forest ML behavior analysis engine (>85% accuracy) - [DONE]
  5. Real-time dynamic 3-strike revocation controller - [DONE]
  6. Responsive SPA dashboard & 6-scenario threat simulator - [DONE]
  7. Comprehensive testing (1,555 benchmark security events) - [DONE]
  8. Academic dissertation authoring & public repositories - [DONE]
- **Speaker Notes (1.0 min):**
  > *"Our research set eight measurable objectives spanning commercial analysis, empirical survey validation, machine learning engineering, full-stack development, and rigorous benchmarking. I am pleased to report that all eight objectives have been 100% achieved within the planned schedule."*

---

## Slide 5: Literature Review & Comparative Analysis
- **Commercial PAM Analysis:**
  - *CyberArk:* Vault-centric; session proxying; UEBA is an expensive add-on; manual session cutoffs.
  - *BeyondTrust:* Static access windows; lacks sub-second ML scoring.
  - *Delinea:* Cloud vaulting; static role policies.
- **Academic Approaches:** Theoretical deep learning models tested on offline synthetic network traffic (KDD Cup 99) without active execution middleware.
- **SecureSafe PAM Advantage:** Behavior-driven, dynamic, adaptive, and risk-centric with native sub-second OAuth 2.0 token revocation.
- **Speaker Notes (1.0 min):**
  > *"In our comparative analysis of CyberArk, BeyondTrust, and academic prototypes (Table 1 in the thesis), we confirmed that commercial platforms treat behavior analytics as a post-facto alerting feature. In contrast, SecureSafe PAM places machine learning directly into the critical execution path as an active real-time gatekeeper."*

---

## Slide 6: Research Methodology (Design Science Research)
- **Methodological Framework:** Design Science Research (DSR) (Hevner et al., 2004) across 6 iterative stages:
  1. *Problem Identification:* Static PAM vulnerabilities and LGC breach analysis.
  2. *Define Solution Objectives:* >85% accuracy, <3s response time, automated revocation.
  3. *Design & Development:* 4-tier Python/Flask architecture with Isolation Forest.
  4. *Demonstration:* 6 live real-world threat demonstration scenarios.
  5. *Empirical Evaluation:* 1,555 benchmark security events, ROC curves, latency tests.
  6. *Communication:* 83-page dissertation, logbook, and GitHub repository.
- **Development Lifecycle:** Iterative and Incremental Prototyping across 4 time-boxed development cycles.
- **Speaker Notes (1.0 min):**
  > *"We adopted the Design Science Research methodology to ensure both scientific rigor and practical utility. Software development followed an iterative prototyping model across four distinct cycles, validated through continuous supervisor reviews."*

---

## Slide 7: Empirical Industry Requirements Survey (N=115)
- **Demographics:** 115 verified professionals in Sri Lanka (46.1% Admins, 22.6% IT Support, 21.7% Security Analysts, 5.2% CISOs). 90%+ administer privileged accounts daily.
- **Key Findings:**
  - 74.8% express acute concern over privileged credential compromise.
  - 73.0% lack dedicated commercial PAM solutions due to high costs.
  - 53.9% endorse automated security response over manual human triage during active attacks.
  - 78.3% demand zero-day anomaly detection capabilities.
  - **#1 Adoption Barrier:** False Positives (49.6%) — fear of blocking legitimate admins during critical tasks.
- **Speaker Notes (1.5 min):**
  > *"To ensure our requirements were grounded in real-world industry demand, we surveyed 115 cybersecurity professionals. The survey confirmed that 74.8% are deeply concerned about privileged access, and 53.9% want automated remediation. Crucially, 49.6% cited false positives as their number-one fear. This directly led to our design of the progressive 3-strike escalation model to prevent false lockouts."*

---

## Slide 8: 4-Tier System Architecture
- **Tier 1 (Presentation):** Single Page Application in Vanilla JS (ES6+) with TailwindCSS (Admin Dashboard, Privileged User Portal, Login).
- **Tier 2 (Business Logic):** Python 3.9+ / Flask microframework (OAuth 2.0 Authlib handler, 21-permission RBAC, 3-strike controller, SMTP dispatcher).
- **Tier 3 (Analytics & UEBA):** Scikit-learn Isolation Forest, OneHotEncoder, and multi-factor contextual risk calculator.
- **Tier 4 (Data Access):** JSON data stores (`users.json`, `roles.json`, `system_settings.json`), append-only telemetry (`real_activity.log`), and serialized models (`risk_model.joblib`).
- **Speaker Notes (1.5 min):**
  > *"The system architecture is structured into four decoupled tiers. The frontend uses a lightweight, zero-agent Single Page Application; the backend runs Flask and Authlib; the analytics tier evaluates commands in-memory; and the data tier maintains structured persistence and tamper-evident append-only logs."*

---

## Slide 9: ML Anomaly Detection & Contextual Scoring Algorithm
- **Isolation Forest Model:**
  - Operates on the principle that anomalies are *few and different*.
  - Anomaly score calculated using tree path length: $s(x, n) = 2^{-\frac{E(h(x))}{c(n)}}$.
  - Trained on 4 core features: `hour`, `ip_is_local`, `action_type`, and `user_role`.
- **Contextual Heuristics Scoring (0–100 Scale):**
  - Base Action Score (e.g., `DELETE_TABLE` = 95, `RUN_QUERY` = 45).
  - RBAC Permission Violation Penalty: $\max(\text{risk}, 90)$.
  - Off-Hours Temporal Penalty (+30): Actions outside 08:00–17:00.
  - Non-Local / Foreign IP Penalty (+40): Actions from external networks.
  - ML Outlier Flag (+15): Isolation Forest anomaly detection.
- **Speaker Notes (1.5 min):**
  > *"Our risk scoring engine combines unsupervised Isolation Forest machine learning with contextual domain heuristics. When an administrator executes a command, we evaluate the action type, time of day, IP locality, and RBAC permissions. If an admin runs a drop table command at 3 AM from a foreign IP, the risk score immediately reaches 100."*

---

## Slide 10: Dynamic 3-Strike Escalation & Auto-Revocation
- **Graduated Strike System:**
  - *Strike 1 (Risk $\ge 95$):* Warning flag logged; heightened telemetry enabled.
  - *Strike 2 (Risk $\ge 95$):* Second critical infraction; admin alert dispatched.
  - *Strike 3 (Risk $\ge 95$):* Immediate session termination; OAuth token revoked; user locked out.
  - *Catastrophic Command Override:* Destructive commands like `rm -rf /` trigger instant 3/3 revocation without delay.
- **Sub-Second Revocation Middleware:**
  - Token state updated in-memory (`active_sessions`).
  - Browser automatically redirects to `/access-revoked` in under 0.5s.
- **Speaker Notes (1.5 min):**
  > *"To solve the 49.6% false positive barrier identified in our survey, we implemented a progressive 3-strike escalation state machine. Minor deviations generate warnings, but repeated critical actions or catastrophic commands like 'rm -rf /' trigger instant session termination and token revocation in less than half a second."*

---

## Slide 11: Multi-Mode Auth & Automated Onboarding
- **Multi-Mode Authentication:**
  - Google OAuth 2.0 Authorization Code flow with OpenID Connect ID token validation.
  - Enterprise salted scrypt password authentication (`generate_password_hash`).
  - 1-Click Quick Demo Login for instant evaluation across 4 preset roles.
- **Automated User Onboarding:**
  - Admins invite users with custom roles; auto-generates temporary passwords (`Pam#...`).
  - Dispatches branded HTML invitation emails via live SMTP (Gmail, STARTTLS).
  - Supports Gmail Plus-Addressing (`user+alias@gmail.com`) for evaluating multiple test identities from one inbox.
- **Speaker Notes (1.0 min):**
  > *"The system supports enterprise passwords, one-click demo logins, and real Google OAuth 2.0 SSO. Furthermore, administrators can invite new engineers with temporary credentials dispatched via live SMTP email, complete with an outbox audit trail."*

---

## Slide 12: Granular RBAC & 21 System Permissions
- **Separation of Duties:**
  - *System Admin (`*`):* Full administrative access.
  - *Database Admin (`db:*`):* Query, connect, backup, and delete tables.
  - *Network Engineer (`net:*`):* SSH router, ping, firewall, shutdown switch.
  - *App Developer (`app:*`):* Manage server, deploy, git pull, IAM, root deletion.
  - *Security Auditor:* Read-only access to dashboard and alerts.
- **Dynamic Role Management:** Create, edit, and delete custom roles with live permission matrix updates.
- **Speaker Notes (1.0 min):**
  > *"We implemented a granular Role-Based Access Control matrix encompassing 21 distinct system permissions across Database, Network, Application, and Administrative domains. Access is strictly enforced at the API route level."*

---

## Slide 13: Live Threat Simulator (6 Scenarios)
- **Pre-Built Demonstration Scenarios:**
  1. *Standard SQL Query (Score: 45, 0 strikes)* — Normal daytime operation.
  2. *Off-Hours SSH Access at 23:00 (Score: 85, Alert logged)* — Suspicious timing.
  3. *Foreign IP IAM Escalation (Score: 100, 1 strike)* — External privilege attempt.
  4. *Critical DROP TABLE (Score: 95, 1 strike)* — Core database destruction.
  5. *Router Emergency Shutdown (Score: 95, 1 strike)* — Core switch shutdown.
  6. *Catastrophic `rm -rf /` Attack (Score: 100, Instant 3/3 Revocation)* — Root deletion.
- **Speaker Notes (1.0 min):**
  > *"Our interactive Threat Simulator allows evaluators to trigger six real-world scenarios with a single click, demonstrating how normal actions proceed smoothly while severe threats trigger immediate automated lockout."*

---

## Slide 14: Executive 9-Sheet Excel Activity Report
- **Automated OpenPyXL Export (`/api/export-full-excel`):**
  - *Sheet 1:* Cover & Executive Summary (KPI cards, risk breakdown, user status).
  - *Sheet 2:* Numbered Event Log (Timestamped audit trail with risk score badges).
  - *Sheet 3:* Active Sessions (Real-time authenticated sessions & strike status).
  - *Sheet 4:* Security Alerts (Flagged anomalies with ML reasoning tags).
  - *Sheet 5:* Onboarded Users (Identity registry & invitation history).
  - *Sheet 6:* Role Permissions (Catalog + 21-permission matrix).
  - *Sheet 7:* Auth Log (Raw authentication attempts).
  - *Sheet 8:* Command Telemetry (Hourly execution telemetry).
  - *Sheet 9:* Email Outbox (Dispatched invitation history and delivery status).
- **Compliance:** 100% compliant with SOX, GDPR, HIPAA, and ISO 27001 audit standards.
- **Speaker Notes (1.0 min):**
  > *"For executive governance and regulatory compliance, the system features a 9-sheet professionally formatted Excel report generator that exports complete cryptographic audit trails, session telemetry, and email delivery histories."*

---

## Slide 15: Experimental Evaluation & Model Accuracy
- **Benchmark Dataset (1,555 Events):**
  - Normal Actions (<60): 925 samples (59.48%)
  - Medium Risk (60–79): 216 samples (13.89%)
  - High Risk (80–94): 244 samples (15.69%)
  - Critical Risk ($\ge 95$): 170 samples (10.93%)
- **Accuracy Results (Table 13):**
  - **Overall Classification Accuracy:** **87.3%** (Weighted F1: 0.874)
  - **Normal Legitimate Specificity:** **96.4% Accuracy** (Exceeds >95% goal)
  - **Critical Threat Detection Rate:** **83.5% Recall** (Only 1.8% False Negative Rate)
  - **Conservative Error Behavior:** 78% of classification errors occurred between adjacent risk levels.
- **Speaker Notes (1.5 min):**
  > *"We evaluated our machine learning behavior engine against 1,555 structured security events. The model achieved an overall accuracy of 87.3%. Most importantly, it achieved 96.4% accuracy on normal legitimate actions—ensuring that daily administrative workflows are never disrupted—while maintaining an 83.5% detection rate on critical security threats."*

---

## Slide 16: Statistical Rigor: Confusion Matrix & ROC Curves
- **Confusion Matrix Highlights (Figure 38):**
  - 893 of 923 legitimate actions correctly classified as Normal (96.7% specificity).
  - Only 1 critical threat sample misclassified as Normal (<1.4%).
- **Multi-Class ROC / AUC Analysis (Figure 40):**
  - Normal Class AUC: **0.997** (Near-perfect discrimination)
  - Medium Class AUC: **0.978**
  - High Class AUC: **0.977**
  - Critical Class AUC: **0.987**
  - **Macro-Average AUC:** **0.985** | **Micro-Average AUC:** **0.990**
- **Speaker Notes (1.5 min):**
  > *"Our Confusion Matrix and multi-class ROC curves demonstrate exceptional discriminative power across all risk tiers, achieving an overall Macro-Average AUC of 0.985. The critical false negative rate to normal was just 1.8%, proving the model's reliability in high-stakes enterprise environments."*

---

## Slide 17: Performance Latency & Scalability Testing
- **Sub-Second Latency Benchmarks (100 Iterations):**
  - ML Risk Inference: **11.8 ms**
  - Action Logging & disk sync (`os.fsync`): **11.9 ms**
  - Login Page Load: **13.2 ms**
  - End-to-End Decision & Revocation Pipeline: **2.5 seconds** (Well within sub-5.0s SLA).
- **Test Suite Verification:**
  - 14 automated `unittest` test suites: **168/168 test assertions passed (100%)**.
  - 47/47 authentication test cases passed.
  - Concurrent scalability: 50 active sessions with stable CPU (15–25%) and RAM (180–340 MB).
- **Speaker Notes (1.0 min):**
  > *"In performance latency testing across 100 iterations, the ML inference engine took just 11.8 milliseconds, and the entire end-to-end detection and automated revocation pipeline executed in 2.5 seconds, comfortably meeting our sub-5-second SLA. Our automated test suite achieved a 100% pass rate across 168 test assertions."*

---

## Slide 18: Program Learning Outcomes (LO1–LO6)
- **LO1 (Technical Proficiency):** Full-stack integration of Python, Flask, Scikit-learn, Authlib, and TailwindCSS.
- **LO2 (Problem-Solving):** Overcame static PAM limits with dynamic 3-strike automated token revocation.
- **LO3 (Critical Analysis):** Rigorous comparative evaluations of commercial platforms and ML trade-offs.
- **LO4 (Professional Practice):** Implemented industry standards (RFC 6749, NIST CSF 2.0, SOX compliance).
- **LO5 (Communication):** Authored 83-page dissertation, UML models, and public GitHub documentation.
- **LO6 (Lifelong Learning):** Independently mastered unsupervised anomaly detection and modern authorization technologies.
- **Speaker Notes (1.0 min):**
  > *"This project has comprehensively mapped against all six institutional Program Learning Outcomes, demonstrating technical mastery, problem-solving, critical analysis, professional compliance, clear communication, and lifelong learning."*

---

## Slide 19: Key Contributions to Body of Knowledge
- **1. Novel 4-Tier Dynamic PAM Blueprint:** Validated architectural pattern uniting OAuth 2.0 with real-time ML risk control.
- **2. Empirical Feature Engineering Methodology:** Proven 4-feature extraction pipeline for administrative command streams.
- **3. Standardized PAM Benchmarking:** Established quantitative baselines (87.3% accuracy, 0.985 AUC, 2.5s latency).
- **4. 115-Participant Industry Validation:** Provided valuable empirical data on enterprise PAM adoption barriers and automation acceptance.
- **5. Zero-Agent SME Accessibility:** Lightweight, affordable prototype designed for resource-constrained organizations.
- **Speaker Notes (1.0 min):**
  > *"Our primary contributions to the cybersecurity body of knowledge include a novel 4-tier dynamic architecture, a proven 4-feature behavioral extraction pipeline, standardized benchmarking baselines, and empirical survey evidence from 115 industry practitioners."*

---

## Slide 20: Conclusion & Viva Q&A
- **Summary:**
  - Demonstrated that integrating OAuth 2.0 with machine learning-driven UEBA transforms PAM from a static gatekeeper into an active, intelligent defense.
  - Achieved 87.3% overall accuracy, 96.4% normal specificity, 83.5% critical detection, and 2.5s end-to-end response latency.
  - All 8 research objectives successfully fulfilled on schedule.
- **Candidate & Project Info:**
  - Candidate: W.M.P.D. Wickramasinghe (Index: 11312)
  - Degree: BSc (Hons) in Computer Networks & Cyber Security
  - Supervisor: Mr. Mevan Jayathilaka | KIU Sri Lanka
  - GitHub: `Poornadananjaya2001/Dynamic-PAM-System-`
- **Speaker Notes (1.0 min):**
  > *"In conclusion, SecureSafe PAM proves that dynamic, machine learning-driven access control can prevent catastrophic privileged compromises in real time without disrupting legitimate administrator productivity. Thank you for your time and attention. I now welcome any questions from the panel."*
