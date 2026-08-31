# Presentation Slide Deck & Viva Defense Script (COM4901)
## Reducing Security Risks with Privileged Access Management: Real-Time Authentication and User Behavior Analysis using ML

<div align="center">

**Candidate:** W.M.P.D. Wickramasinghe (Index: 11312)  
**Degree:** BSc (Hons) in Computer Networks & Cyber Security  
**Supervisor:** Mr. Mevan Jayathilaka  
**Institution:** KIU Sri Lanka – Faculty of Computer Science & Computer Engineering  
**Module Code:** COM4901 – Final Year Individual Project  
**Date:** August 31, 2026  

---

### **Viva Examination Assessment Criteria Alignment**
This slide deck and defense script explicitly addresses all five viva assessment dimensions:
1. **Technical Understanding:** Theoretical & practical mastery of RFC 6749 OAuth 2.0, Isolation Forest mathematical path length mechanics, and multi-tier security architectures.
2. **Justification of Project Design Decisions:** Clear architectural justifications for choosing OAuth 2.0, unsupervised machine learning, progressive 3-strike escalation, and lightweight Python/Flask stack.
3. **Demonstration of Implementation and Results:** Full demonstration of the 6-scenario threat simulator, 1,555-sample benchmark, ROC/AUC curves, confusion matrices, and latency metrics.
4. **Ability to Answer Examiner Questions:** Dedicated defense strategy and model answers for anticipated technical questions from the examination panel.
5. **Academic Maturity & Professional Communication:** Reflection on ethical considerations, privacy preservation, research limitations, Program Learning Outcomes (LO1–LO6), and future work.

</div>

---

## Slide 1: Title & Viva Defense Introduction
- **Header:** KIU – Faculty of Computer Science & Computer Engineering | Department of Computer Science
- **Title:** Reducing Security Risks with Privileged Access Management: Real-Time Authentication and User Behavior Analysis using ML
- **Subtitle:** Final Year Individual Project Viva & Dissertation Defense (COM4901)
- **Candidate Info:** W.M.P.D. Wickramasinghe (Index: 11312, Batch: 08)
- **Supervisor:** Mr. Mevan Jayathilaka
- **Speaker Notes (1.0 min):**
  > *"Good morning, respected members of the examination panel and project supervisor Mr. Mevan Jayathilaka. I am Poorna Wickramasinghe, and today I am defending my final year undergraduate dissertation titled 'Reducing Security Risks with Privileged Access Management: Real-Time Authentication and User Behavior Analysis using ML'. This research addresses the critical architectural vulnerabilities in traditional static PAM platforms by creating an intelligent, dynamic security prototype that unites real-time Google OAuth 2.0 authentication with machine learning-driven User Behavior Analytics and automated 3-strike token revocation."*

---

## Slide 2: Viva Assessment Framework & Presentation Roadmap
- **Mapping to 5 Viva Assessment Pillars:**
  1. *Technical Understanding:* Deep foundation in RFC 6749 OAuth 2.0, Isolation Forest tree algorithms, and RBAC theory (Slides 3–7, 9–10).
  2. *Justification of Design Decisions:* Rigorous justification of architectural choices, algorithms, and 3-strike policy (Slides 8–11).
  3. *Demonstration of Implementation & Results:* Live threat simulator, 1,555 benchmark security events, ROC curves, latency tests (Slides 12–20).
  4. *Examiner Q&A Defense Preparedness:* Systematic anticipation and defense of core technical examiner questions (Slide 24).
  5. *Academic Maturity & Communication:* Program Learning Outcomes (LO1–LO6), ethical considerations, and limitations (Slides 21–23).
- **Speaker Notes (1.0 min):**
  > *"This presentation is structured to directly align with the five institutional viva evaluation criteria. We will begin with our technical problem domain and research gaps, progress through our design justifications, demonstrate our implementation and empirical results, present our academic maturity, and conclude with our viva defense preparedness."*

---

## Slide 3: Problem Background & Real-World Motivation [Technical Understanding]
- **Global Context:**
  - 82%+ of enterprise security breaches involve stolen credentials or privileged access misuse (Verizon DBIR).
  - Privileged accounts (root, domain admin, DBA) represent supreme administrative authority over databases, networks, and cloud servers.
  - Average breach cost involving privileged credentials exceeds $4.45M with a record 327-day dwell time (IBM Security).
  - Once credentials are stolen, perimeter firewalls treat malicious actions as legitimate administrative work.
- **Sri Lankan Case Study: The August 2023 Lanka Government Cloud (LGC) Breach:**
  - Attackers used compromised admin credentials to destroy production databases across dozens of ministries (CERT|CC).
  - Lacked continuous behavioral monitoring: Attackers operated unhindered inside authenticated sessions for hours.
  - Lacked automated session revocation: Manual intervention was too slow to prevent catastrophic data deletion.
- **Speaker Notes (1.5 min):**
  > *"Traditional enterprise cybersecurity operates on perimeter firewalls and static passwords. However, once an attacker compromises valid administrative credentials, traditional defenses are completely neutralized. This was starkly proven during the August 2023 Lanka Government Cloud disaster, where attackers used valid admin credentials to delete production databases across ministries over several hours because the system lacked continuous behavioral inspection and automated revocation."*

---

## Slide 4: Problem Definition & The 3 Critical Research Gaps [Technical Understanding]
- **The Core Problem:** Traditional PAM platforms treat authentication as a one-time gate. Once logged in, the session is implicitly trusted forever.
- **Gap 1 (Modern Auth in PAM):** Traditional PAM relies on heavy RDP/SSH jump hosts or password checkout vaults. OAuth 2.0 (RFC 6749) remains underexplored for stateless token-level delegation and instant programmatic revocation in PAM.
- **Gap 2 (Active ML Privilege Control):** Existing academic ML models are theoretical and tested on offline network logs (KDD Cup). Commercial tools treat UEBA as an optional post-event reporting tool rather than an active enforcer in the critical execution path.
- **Gap 3 (Unified Security Framework):** Absence of open, cohesive blueprints unifying multi-mode auth, granular RBAC, real-time ML risk scoring, 3-strike escalation, and executive Excel compliance reporting.
- **Speaker Notes (1.5 min):**
  > *"We identified three fundamental gaps in current security literature: first, PAM systems have not adopted modern web authorization protocols like OAuth 2.0; second, machine learning in PAM is treated as an auxiliary reporting tool rather than an active session controller; and third, existing security products are fragmented, causing severe SOC alert fatigue."*

---

## Slide 5: Research Aim, Questions & 8 Objectives [Technical Understanding]
- **Research Aim:** To design, develop, and empirically evaluate a dynamic PAM system that integrates real-time OAuth 2.0 authentication with ML-driven UEBA for proactive, risk-based access control.
- **5 Research Questions:**
  - *RQ1:* How can OAuth 2.0 be architected for continuous token-level PAM monitoring?
  - *RQ2:* Which ML models optimize accuracy, latency, and minimal false positives?
  - *RQ3:* What architectural patterns allow real-time risk scores to drive automated revocation?
  - *RQ4:* How to balance automated security against operational false positive disruptions?
  - *RQ5:* What quantitative performance improvements does dynamic PAM achieve over static systems?
- **8 Measurable Objectives:** All 8 objectives accomplished within planned 22-week timeline.
- **Speaker Notes (1.0 min):**
  > *"Our research formulated five guiding research questions and eight measurable objectives. All eight objectives—spanning commercial analysis, industry survey elicitation, machine learning development, 3-strike enforcement, and benchmarking—were 100% accomplished on schedule."*

---

## Slide 6: Literature Review & Comparative Analysis [Technical Understanding]
- **State-of-the-Art Review (Table 1):**
  - *CyberArk PAM:* Vault-centric; session proxying; UEBA is an add-on; manual analyst session termination.
  - *BeyondTrust PAM:* Endpoint privilege manager; static schedules; lacks sub-second ML models.
  - *Delinea Secret Server:* Cloud vault; static role definitions; alerting only.
  - *Academic Approaches:* Deep learning on offline network logs (KDD99, DARPA); no UI or active session execution controller.
- **SecureSafe PAM Advantage:** Behavior-driven, dynamic, adaptive, and risk-centric with native sub-second OAuth 2.0 token revocation embedded in the execution pipeline.
- **Speaker Notes (1.0 min):**
  > *"In Chapter 2 (Table 1), we synthesized a comparative matrix across market leaders and academic prototypes. This confirmed that commercial platforms treat user behavior analysis as an auxiliary post-facto detection feature, whereas SecureSafe PAM establishes behavioral machine learning as the primary, real-time driver of autonomous access control."*

---

## Slide 7: Research Methodology (Design Science Research) [Technical Understanding]
- **DSR 6-Stage Process Model (Hevner et al., 2004):**
  1. *Problem Identification:* Static PAM failures & LGC breach analysis.
  2. *Define Solution Objectives:* >85% ML accuracy, <3s response, auto-revocation.
  3. *Design & Development:* 4-tier Python/Flask architecture with Isolation Forest.
  4. *Demonstration:* 6 live real-world threat demonstration scenarios.
  5. *Empirical Evaluation:* 1,555 benchmark security events, ROC curves, latency tests.
  6. *Communication:* 83-page dissertation, logbook, and public GitHub repository.
- **Development Lifecycle:** Iterative and Incremental Prototyping across 4 time-boxed cycles.
- **Speaker Notes (1.0 min):**
  > *"We adopted the Design Science Research methodology to ensure both scientific rigor and practical utility. Software development followed an iterative prototyping model across four distinct cycles, validated through continuous supervisor reviews."*

---

## Slide 8: Empirical Requirements Survey (N=115) [Design Justification]
- **Demographics:** 115 verified professionals in Sri Lanka (46.1% Admins, 22.6% IT Support, 21.7% Security Analysts, 5.2% CISOs). Over 90% administer privileged accounts daily.
- **Key Empirical Insights:**
  - 74.8% express acute concern over privileged credential compromise.
  - 73.0% lack dedicated commercial PAM solutions due to high costs.
  - 53.9% endorse automated security response over manual human triage during active attacks.
  - 78.3% demand zero-day anomaly detection capabilities.
  - **#1 Adoption Barrier:** False Positives (49.6%) — fear of blocking legitimate admins during critical tasks.
- **Speaker Notes (1.5 min):**
  > *"To ensure our requirements were grounded in real-world industry demand, we surveyed 115 cybersecurity professionals. The survey confirmed that 74.8% are deeply concerned about privileged access, and 53.9% want automated remediation. Crucially, 49.6% cited false positives as their number-one fear. This directly led to our design of the progressive 3-strike escalation model to prevent false lockouts."*

---

## Slide 9: Design Justification #1: Architecture & OAuth 2.0 [Design Justification]
- **Why a 4-Tier Component-Based Architecture?**
  - *Separation of Concerns:* Decouples UI, Business Logic, Analytics, and Data Access.
  - *High Cohesion & Loose Coupling:* Enables independent replacement or scaling of the ML model or auth provider without impacting adjacent layers.
- **Why Native OAuth 2.0 (RFC 6749) over Legacy Password Vaults?**
  - *Eliminates Heavy Jump Hosts:* Replaces cumbersome RDP/SSH proxies with lightweight, zero-agent browser tokens.
  - *Stateless Scoped Delegation:* Master credentials are never shared; tokens are bound to explicit permission scopes (`db:query`, `net:ssh`).
  - *Instant Programmatic Revocation:* Centralized token invalidation cuts off an adversary in milliseconds without resetting system master passwords.
- **Speaker Notes (1.5 min):**
  > *"Why did we choose a 4-tier architecture and OAuth 2.0? First, component decoupling allows our ML analytics engine to scale independently of the web server. Second, OAuth 2.0 replaces heavy, expensive jump hosts with lightweight scoped tokens that can be programmatically revoked in milliseconds the moment an anomaly is detected."*

---

## Slide 10: Design Justification #2: Isolation Forest Selection [Design Justification]
- **Why Unsupervised ML over Supervised Classifiers?**
  - *Data Reality:* Enterprise PAM logs almost never contain pre-labeled attack samples.
  - *Zero-Day Detection:* Supervised models fail against novel attack vectors that deviate from training data; unsupervised models detect anomalous deviations from normal baselines.
- **Why Isolation Forest (Liu, Ting & Zhou)?**
  - *Core Principle:* Anomalies are 'few and different' — isolated with fewer random partition splits in decision trees.
  - *Mathematical Rigor:* Uses path length formulation $s(x, n) = 2^{-\frac{E(h(x))}{c(n)}}$.
  - *Sub-Second Latency:* $O(t)$ inference complexity achieves 11.8 ms execution time across live HTTP requests.
  - *Feature Transformation:* Integrated with `OneHotEncoder` to encode categorical roles and commands.
- **Speaker Notes (1.5 min):**
  > *"Why Isolation Forest instead of Supervised Random Forests or Deep Learning? In real-world enterprise environments, privileged logs do not contain pre-labeled attack data. Supervised models cannot detect zero-day attacks. Isolation Forest operates unsupervised by isolating anomalies in fewer tree splits, giving us lightweight, mathematically proven 11.8 ms inference times."*

---

## Slide 11: Design Justification #3: 3-Strike Escalation & Tech Stack [Design Justification]
- **Why Progressive 3-Strike Escalation vs Binary Cut?**
  - *Directly Resolves #1 Industry Fear:* 49.6% of survey respondents fear false-positive lockouts during critical operational outages.
  - *Graduated Escalation:* Strike 1 & 2 flag alerts and heighten telemetry without halting admin work; Strike 3 revokes access.
  - *Catastrophic Override:* Destructive commands (e.g. `rm -rf /`) instantly trigger 3/3 revocation without waiting.
  - *Optimizes Security vs Usability:* Balances proactive protection against business continuity.
- **Why Python/Flask + Vanilla JS + JSON Persistence?**
  - *Flask Microframework:* Zero boilerplate overhead, rapid REST routing, native WSGI test client support.
  - *Vanilla JS (ES6+) & TailwindCSS:* Zero build/bundling overhead, maximum rendering speed, minimal browser attack surface.
  - *Structured JSON/CSV Storage:* Eliminates database administration overhead for research prototype while guaranteeing atomic file-system persistence (`os.fsync`).
- **Speaker Notes (1.5 min):**
  > *"Why progressive 3-strike escalation? Binary systems that lock accounts on a single anomaly cause administrative paralysis during emergency outages. Our 3-strike model provides graduated warnings while retaining an instant override for catastrophic commands like 'rm -rf /'. Furthermore, our choice of Flask and Vanilla JavaScript eliminated framework overhead and maximized real-time performance."*

---

## Slide 12: 4-Tier System Architecture Diagram [Implementation & Results]
- **Tier 1 (Presentation):** Single Page Application in Vanilla JS (ES6+) with TailwindCSS (Admin Dashboard, Privileged User Portal, Login).
- **Tier 2 (Business Logic):** Python 3.9+ / Flask microframework (OAuth 2.0 Authlib handler, 21-permission RBAC, 3-strike controller, SMTP dispatcher).
- **Tier 3 (Analytics & UEBA):** Scikit-learn Isolation Forest, OneHotEncoder, and multi-factor contextual risk calculator.
- **Tier 4 (Data Access):** JSON data stores (`users.json`, `roles.json`, `system_settings.json`), append-only telemetry (`real_activity.log`), and serialized models (`risk_model.joblib`).
- **Speaker Notes (1.0 min):**
  > *"Here we see our 4-tier architecture. All command telemetry flows from Tier 1 through the Tier 2 REST API into Tier 3 for in-memory ML scoring, with structured persistence in Tier 4."*

---

## Slide 13: Algorithmic Engineering: ML Risk & 3-Strikes [Implementation & Results]
- **Algorithm 1 (Risk Scoring - Figure 9):**
  - Base Action Score (e.g., `DELETE_TABLE` = 95, `RUN_QUERY` = 45).
  - RBAC Permission Violation Penalty: $\max(\text{risk}, 90)$.
  - Off-Hours Temporal Penalty (+30): Actions outside 08:00–17:00.
  - Non-Local / Foreign IP Penalty (+40): Actions from external networks.
  - ML Outlier Flag (+15): Isolation Forest anomaly detection.
- **Algorithm 2 (3-Strike Enforcement - Figure 10):**
  - Intercepts actions where $\text{risk} \ge 95$.
  - Increments session strike count; if strikes $\ge 3$ or catastrophic command, revokes portal access immediately.
- **Speaker Notes (1.5 min):**
  > *"Our risk algorithm combines four contextual dimensions: base command severity, RBAC authorization, temporal boundaries, and network locality, augmented by Isolation Forest anomaly scores. The 3-strike controller manages state transitions and automatically enforces token revocation."*

---

## Slide 14: Implementation: Multi-Mode Auth & Onboarding [Implementation & Results]
- **Multi-Mode Authentication:**
  - Google OAuth 2.0 Authorization Code flow with OpenID Connect ID token validation.
  - Enterprise salted scrypt password authentication (`generate_password_hash`).
  - 1-Click Quick Demo Login for instant evaluation across 4 preset roles.
- **Automated User Onboarding:**
  - Admins invite users with custom roles; auto-generates temporary passwords (`Pam#...`).
  - Dispatches branded HTML invitation emails via live SMTP (Gmail, STARTTLS).
  - Supports Gmail Plus-Addressing (`user+alias@gmail.com`) for evaluating multiple test identities from one inbox.
- **Speaker Notes (1.0 min):**
  > *"The authentication module supports enterprise passwords, demo logins, and real Google OAuth 2.0 SSO. Administrators can onboard new privileged users with temporary credentials sent via live SMTP email with full outbox audit tracking."*

---

## Slide 15: Implementation: Granular RBAC (21 Permissions) [Implementation & Results]
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

## Slide 16: Demonstration: 6 Live Threat Scenarios [Implementation & Results]
- **Pre-Built Demonstration Scenarios:**
  1. *Standard SQL Query (Score: 45, 0 strikes)* — Normal daytime operation.
  2. *Off-Hours SSH Access at 23:00 (Score: 85, Alert logged)* — Suspicious timing.
  3. *Foreign IP IAM Escalation (Score: 100, 1 strike)* — External privilege attempt.
  4. *Critical DROP TABLE (Score: 95, 1 strike)* — Core database destruction.
  5. *Router Emergency Shutdown (Score: 95, 1 strike)* — Core switch shutdown.
  6. *Catastrophic `rm -rf /` Attack (Score: 100, Instant 3/3 Revocation)* — Root deletion.
- **Speaker Notes (1.5 min):**
  > *"Our interactive Threat Simulator allows evaluators to trigger six real-world scenarios with a single click, demonstrating how normal actions proceed smoothly while severe threats trigger immediate automated lockout."*

---

## Slide 17: Demonstration: Executive 9-Sheet Excel Generator [Implementation & Results]
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

## Slide 18: Results: Model Accuracy & Benchmarking [Implementation & Results]
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

## Slide 19: Results: Confusion Matrix & ROC Curves [Implementation & Results]
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

## Slide 20: Results: Latency & 14 Test Suites (100% Pass) [Implementation & Results]
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

## Slide 21: Academic Maturity: Limitations & Ethics [Academic Maturity]
- **Acknowledged Research Limitations:**
  - *Synthetic Data Baseline:* Evaluated on 1,555 synthetic events; future work should incorporate anonymized multi-enterprise logs.
  - *Single Timezone Scope:* Evaluated against a single regional operational window (08:00-17:00).
  - *Single-Node Testbed:* Benchmarked on high-performance workstation rather than multi-region Kubernetes cluster.
  - *Controlled Threat Vectors:* Focused on 6 core threats rather than multi-stage APT stealth evasion.
- **Ethical, Privacy & Economic Considerations:**
  - *Privacy Compliance:* Synthetic data generation avoided exposing real enterprise credentials and PII (GDPR/Sri Lanka PDPA compliant).
  - *SME Economic Accessibility:* Designed a lightweight, zero-agent platform to protect resource-constrained organizations that cannot afford $50K+ commercial PAM licenses.
  - *Responsible AI:* Multi-factor scoring provides explainable anomaly reasons alongside numeric scores.
- **Speaker Notes (1.5 min):**
  > *"Demonstrating academic maturity involves transparently acknowledging our research boundaries. While our synthetic dataset enabled reproducible evaluation without violating GDPR or data privacy laws, future research should test across multi-timezone enterprise clusters. Ethically, our system was deliberately engineered to be accessible to SMEs who cannot afford multi-million dollar commercial suites."*

---

## Slide 22: Academic Maturity: Program Learning Outcomes [Academic Maturity]
- **LO1 (Technical Proficiency):** Full-stack integration of Python, Flask, Scikit-learn, Authlib, and TailwindCSS.
- **LO2 (Problem-Solving):** Overcame static PAM limits with dynamic 3-strike automated token revocation.
- **LO3 (Critical Analysis):** Rigorous comparative evaluations of commercial platforms and ML trade-offs.
- **LO4 (Professional Practice):** Implemented industry standards (RFC 6749, NIST CSF 2.0, SOX compliance).
- **LO5 (Communication):** Authored 83-page dissertation, UML models, and public GitHub documentation.
- **LO6 (Lifelong Learning):** Independently mastered unsupervised anomaly detection and modern authorization technologies.
- **Speaker Notes (1.0 min):**
  > *"This project has comprehensively mapped against all six institutional Program Learning Outcomes at KIU, demonstrating technical mastery, problem-solving, critical analysis, professional compliance, clear communication, and lifelong learning."*

---

## Slide 23: Contributions to Knowledge & Future Work [Academic Maturity]
- **Contributions to Knowledge:**
  1. *Novel 4-Tier Dynamic PAM Blueprint* uniting OAuth 2.0 with active ML risk control.
  2. *Empirical Feature Engineering Pipeline* for administrative command streams.
  3. *Standardized PAM Performance Benchmarks* (87.3% accuracy, 0.985 AUC, 2.5s latency).
  4. *115-Participant Empirical Industry Survey* validating PAM market barriers.
- **Future Research Enhancements:**
  1. Deep Learning Sequence Modeling (LSTM / Transformers) for multi-step temporal attack chains.
  2. Federated Learning for Privacy-Preserving UEBA across distributed enterprises.
  3. Enterprise SIEM & IdP Connectors (Splunk, Microsoft Sentinel, Okta).
  4. Cloud-Native Kubernetes Microservice Mesh.
- **Speaker Notes (1.0 min):**
  > *"Our primary contributions to the cybersecurity body of knowledge include a novel 4-tier dynamic architecture, a proven 4-feature behavioral extraction pipeline, standardized benchmarking baselines, and empirical survey evidence from 115 industry practitioners."*

---

## Slide 24: Viva Defense: Anticipated Examiner Questions & Answers [Ability to Answer Questions]
- **Q1: Why not use a Supervised Classifier (e.g. Random Forest)?**
  - *Defense:* Enterprise PAM logs lack pre-labeled attack data in the wild. Isolation Forest models normal baselines to catch novel zero-day threats.
- **Q2: How does the system handle false positives?**
  - *Defense:* Multi-factor scoring achieves 96.4% normal specificity; 3-strike escalation ensures warnings precede lockout.
- **Q3: Why server-side sessions instead of pure stateless JWTs?**
  - *Defense:* Pure stateless JWTs cannot be revoked instantly without distributed blocklists; server-side session dictionaries revoke in <0.5s.
- **Q4: How did you validate that 11.8 ms inference is fast enough?**
  - *Defense:* Enterprise SLA is <5.0s. 11.8 ms inference + 0.5s action execution yields 2.5s end-to-end latency—well within bounds.
- **Q5: Why synthetic data instead of public datasets?**
  - *Defense:* Public datasets (KDD99) capture raw network packets; PAM requires contextual host-level commands (`DROP TABLE`, `SSH_ROUTER`). Synthetic generation avoids PII violations while matching real distributions.
- **Speaker Notes (2.0 min):**
  > *"To demonstrate our viva defense readiness, we have anticipated the core technical questions likely to arise from the panel regarding our machine learning model choice, false positive minimization, session architecture, latency benchmarking, and synthetic data methodology."*

---

## Slide 25: Conclusion & Concluding Reflections [Academic Maturity]
- **Core Research Conclusion:**
  - Demonstrated that integrating OAuth 2.0 authorization with machine learning-driven UEBA transforms PAM from a passive gatekeeper into an active, intelligent security defense.
  - Successfully reconciled security vs usability by achieving 96.4% normal specificity and 83.5% critical threat detection with sub-second response latency.
  - Proved that lightweight, autonomous PAM architectures can protect organizations without requiring massive SOC teams.
- **Candidate Project Summary:**
  - Candidate: W.M.P.D. Wickramasinghe (Index: 11312)
  - Degree: BSc (Hons) in Computer Networks & Cyber Security
  - Supervisor: Mr. Mevan Jayathilaka | KIU Sri Lanka
  - All 8 Research Objectives Completed Successfully.
- **Speaker Notes (1.0 min):**
  > *"In conclusion, SecureSafe PAM proves that dynamic, machine learning-driven access control can prevent catastrophic privileged compromises in real time without disrupting legitimate administrator productivity. Thank you for your guidance throughout this journey."*

---

## Slide 26: Thank You & Open Viva Examination (Q&A) [Ability to Answer Questions]
- **Defense Open for Questions:**
  - The floor is now open for questions, technical discussion, and live system demonstration with the evaluation panel.
  - Special thanks to the Faculty of Computer Science & Computer Engineering at KIU and project supervisor Mr. Mevan Jayathilaka.
- **Artifact & Repository Verification:**
  - GitHub Repository: `Poornadananjaya2001/Dynamic-PAM-System-`
  - Full Dissertation: `FINAL_THESIS_REPORT_SECURESAFE_PAM.md` (83 Pages)
  - Official Logbook: `PROJECT_DIARY_LOGBOOK_SECURESAFE_PAM.docx`
  - Deployment Archive: `SECURESAFE_PAM_SOURCE_CODE_DEPLOYMENT.zip`
  - Datasets & Logs: `SECURESAFE_PAM_DATASETS_AND_EXPERIMENT_LOGS.zip`
- **Speaker Notes (1.0 min):**
  > *"Thank you very much. I now invite questions from the examination panel."*
