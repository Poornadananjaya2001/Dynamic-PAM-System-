# 🛡️ SecureSafe PAM - Dynamic Privileged Access Management System

[![Python 3.9+](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/downloads/)
[![Flask 3.0+](https://img.shields.io/badge/Flask-3.0%2B-green.svg)](https://flask.palletsprojects.com/)
[![ML Isolation Forest](https://img.shields.io/badge/ML%20Engine-Isolation%20Forest%20%26%20Random%20Forest-orange.svg)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**SecureSafe PAM** is a modern, enterprise-grade **Dynamic Privileged Access Management (PAM)** solution engineered with **Behavioral Anomaly Detection (UEBA)**, **Role-Based Access Control (RBAC)**, **Multi-Mode Authentication (OAuth 2.0 & Passwords)**, **Automated SMTP Email Onboarding**, and **Dynamic 3-Strike Access Revocation**.

---

## 📑 Table of Contents

1. [Key Features](#-key-features)
2. [System Architecture](#-system-architecture)
3. [Quick Start Guide (Zero-Knowledge Setup)](#-quick-start-guide-zero-knowledge-setup)
4. [Default Credentials & Demo Accounts](#-default-credentials--demo-accounts)
5. [User Guide & Feature Walkthrough](#-user-guide--feature-walkthrough)
   - [1. Authentication & Login](#1-authentication--login)
   - [2. Super Admin Dashboard](#2-super-admin-dashboard)
   - [3. User Onboarding Panel](#3-user-onboarding-panel)
   - [4. Role & Permission Management (RBAC)](#4-role--permission-management-rbac)
   - [5. Live Threat & Anomaly Simulator](#5-live-threat--anomaly-simulator)
   - [6. Privileged User Portal](#6-privileged-user-portal)
   - [7. Identity Registry Administration](#7-identity-registry-administration)
   - [8. Full Excel Activity Report Export](#8-full-excel-activity-report-export)
6. [Machine Learning UEBA Engine](#-machine-learning-ueba-engine)
7. [Running Automated Tests](#-running-automated-tests)
8. [Generating Research Datasets & Visualizations](#-generating-research-datasets--visualizations)
9. [Project Directory Structure](#-project-directory-structure)
10. [Configuration & SMTP Settings](#-configuration--smtp-settings)
11. [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🌟 Key Features

- 🔐 **Multi-Mode Authentication**:
  - Secure Email & Password login with salted scrypt password hashing.
  - Google OAuth 2.0 Single Sign-On (SSO).
  - 1-Click Quick Demo Access for fast evaluation across 4 preset roles.
  - Forgot password flow with email verification codes.
  - First-time temporary password activation flow.

- 👥 **User Onboarding & Automated SMTP Dispatch**:
  - Invite new administrators and engineers with custom PAM roles.
  - Auto-generates secure temporary passwords (`Pam#...`).
  - Dispatches branded HTML invitation emails via live SMTP (Gmail, SendGrid, TLS/SSL).
  - Smart Outbox dispatch log tracking email delivery statuses.
  - Full support for Gmail Plus-Addressing (`user+alias@gmail.com`) as independent user accounts.

- 🛡️ **Granular Role-Based Access Control (RBAC)**:
  - 21 granular system permissions categorized into DB, Network, Application, and Admin domains.
  - Role catalog editor allowing creation, modification, and deletion of custom roles.
  - Real-time permission matrix visualizer.

- 🧠 **ML-Driven Behavioral Anomaly Detection (UEBA)**:
  - Real-time scoring using **Isolation Forest** & **Random Forest** classification (87.3% overall accuracy).
  - Flags off-hours execution (outside 08:00-17:00), non-local external IPs, unauthorized privilege attempts, and destructive commands.

- ⚡ **Dynamic 3-Strike Escalation & Auto-Revocation**:
  - High-risk actions automatically increment session strikes (1/3, 2/3).
  - 3 critical strikes immediately revoke session OAuth tokens and lock the portal interface in real time.
  - Catastrophic commands (e.g., `rm -rf /`) trigger instant 3/3 strike revocation.

- 🎯 **Live Threat & Demonstration Simulator**:
  - 6 pre-built demonstration scenarios to showcase normal vs anomalous behaviors in real time.

- 📊 **Executive Excel Activity Report (.XLSX)**:
  - 9 professionally styled worksheet tabs with KPI cards, event logs, active sessions, threat alerts, onboarding registry, permission matrix, raw auth logs, telemetry, and email dispatch history.

---

## 🏗️ System Architecture

```
                                  ┌───────────────────────────────┐
                                  │      Web Browser Client       │
                                  │ (SPA: TailwindCSS + Chart.js) │
                                  └──────────────┬────────────────┘
                                                 │ HTTP / REST APIs
                                                 ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   Flask PAM Backend Application                                  │
│                                                                                                  │
│  ┌──────────────────────────┐  ┌──────────────────────────┐  ┌────────────────────────────────┐  │
│  │   Authentication & SSO   │  │   RBAC & Authorization   │  │   Real-Time Threat Analyzer    │  │
│  │ (OAuth 2.0 / Passwords)  │  │ (roles.json & Permissions│  │  (Risk Scoring + 3 Strikes)   │  │
│  └─────────────┬────────────┘  └────────────┬─────────────┘  └───────────────┬────────────────┘  │
│                │                            │                                │                   │
│                ▼                            ▼                                ▼                   │
│  ┌──────────────────────────┐  ┌──────────────────────────┐  ┌────────────────────────────────┐  │
│  │   SMTP Email Dispatcher  │  │   User Onboarding Engine │  │     Machine Learning Engine    │  │
│  │  (Gmail STARTTLS / SSL)  │  │   (Temporary Creds CRUD) │  │(Isolation Forest / Random Forest)│ │
│  └──────────────────────────┘  └──────────────────────────┘  └────────────────────────────────┘  │
└────────────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                                 │
                                                 ▼ Data Persistence
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  • users.json (User Accounts)           • roles.json (RBAC Registry)                             │
│  • system_settings.json (SMTP/Policy)   • outbox_emails.json (Email Outbox)                      │
│  • risk_model.joblib (ML Weights)       • real_activity.log & auth_activity.log (Audit Trail)    │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start Guide (Zero-Knowledge Setup)

Follow these simple steps to run the complete project on any Windows, macOS, or Linux computer.

### Step 1: Prerequisites
Ensure you have **Python 3.9 or newer** and **Git** installed:
- [Download Python](https://www.python.org/downloads/) *(Check the box: "Add Python to PATH" during installation on Windows)*
- [Download Git](https://git-scm.com/downloads)

### Step 2: Clone or Download the Repository
```bash
git clone https://github.com/your-username/securesafe-pam.git
cd securesafe-pam
```
*(Or extract the downloaded ZIP folder and open a terminal inside it)*

### Step 3: Create a Virtual Environment (Recommended)

**On Windows (PowerShell / Command Prompt):**
```powershell
python -m venv venv
.\venv\Scripts\activate
```

**On macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 4: Install Required Packages
```bash
pip install -r requirements.txt
```

### Step 5: Start the PAM Server
```bash
python app.py
```

### Step 6: Open the Application in Your Browser
Open your browser and navigate to:
```
http://127.0.0.1:5000
```
🎉 **The system is now live!**

---

## 🔑 Default Credentials & Demo Accounts

You can log in using either **Standard Password Login** or **1-Click Quick Demo Login** on the login page (`http://127.0.0.1:5000/login`):

| Role | Email / Username | Password | Access Scope |
|---|---|---|---|
| **System Admin (Super User)** | `admin@company.com` | `Admin@PAM2026!` | Full access to Admin Dashboard, Onboarding, RBAC, Settings, User Registry, Excel Reports, Simulator |
| **System Admin (Alt)** | `wikzpoorna@gmail.com` | `Admin@PAM2026!` | Full Super Admin Privileges |
| **Database Admin** | `rperera.test@gmail.com` | *(One-Click Demo)* | Database query, connect, and backup operations in User Portal |
| **Network Engineer** | `sfernando.test@gmail.com` | *(One-Click Demo)* | SSH router access, firewall checks, and ping operations in User Portal |
| **App Developer** | `asilva.test@gmail.com` | *(One-Click Demo)* | Server deployment, git sync, and app lifecycle operations in User Portal |
| **Security Auditor** | `dweerakoon.test@gmail.com` | `Pam#Temp2026!` | Least privilege audit access |

---

## 📖 User Guide & Feature Walkthrough

### 1. Authentication & Login
- Visit `http://127.0.0.1:5000/login`.
- **Tab 1: Password Login** — Enter registered email and password.
- **Tab 2: Google OAuth 2.0** — Single Sign-On via Google authentication.
- **Tab 3: Quick Demo Access** — One-click login into any pre-configured role.
- **Forgot Password** — Enter your email to receive a 6-digit verification code.

### 2. Super Admin Dashboard (`/`)
- Exclusive to the **System Admin** role *(non-admin users are automatically redirected to the user portal)*.
- Live KPI cards: Active Sessions, Critical Strikes, Total Anomalies, and ML UEBA Engine Accuracy (87.3%).
- Real-time audit event stream updating automatically every 4 seconds.
- High-risk threat alerts panel.

### 3. User Onboarding Panel
- Accessible from the sidebar (**User Onboarding**).
- Click **"+ Invite New User"** to enter name, email, and choose a role.
- Secure temporary password is automatically generated.
- Sends an invitation email immediately via SMTP.
- Track all accounts in the **Onboarded Users** table.
- Use **"Resend"** to issue a fresh temporary password or **"Revoke"** to lock access.
- Inspect the **Smart Outbox** at the bottom to view dispatch timestamps and SMTP delivery logs.

### 4. Role & Permission Management (RBAC)
- Accessible from the sidebar (**Role & Permissions**).
- **Role Catalog**: View all predefined roles and create dynamic custom roles.
- **Permission Matrix**: Live visual grid of all 21 permissions across all roles.
- **Granular Permissions**: DB operations, Network management, Application lifecycle, and Administrative controls.

### 5. Live Threat & Anomaly Simulator
- Accessible from the sidebar (**Threat & Demo Simulator**).
- Click **"Trigger Scenario"** on any of the 6 demonstration cards:
  1. **Standard SQL Query** — Normal daytime query (Score: 45, 0 strikes).
  2. **Off-Hours SSH Access** — Router access at 23:00 (Score: 85, alert flagged).
  3. **Non-Local IP IAM Escalation** — Privilege escalation from foreign IP (Score: 100, 1 strike).
  4. **Critical DROP TABLE** — Core database destruction attempt (Score: 95, 1 strike).
  5. **Router Shutdown** — Emergency core switch shutdown (Score: 95, 1 strike).
  6. **Catastrophic `rm -rf /`** — Destructive filesystem deletion (Score: 100, instant 3/3 strike revocation).

### 6. Privileged User Portal (`/portal`)
- Standard interface for operational engineers and developers.
- Role-restricted panels:
  - Database Admins see Database Operations (Connect, Query, Backup, Drop).
  - Network Engineers see Network Operations (SSH, Ping, Firewall, Shutdown).
  - App Developers see Application Operations (Start Server, Deploy, Git Pull, IAM, Root commands).
- Live Strike Counter (0/3). When strikes reach 3/3, the portal locks automatically and redirects to `/access-revoked`.

### 7. Identity Registry Administration
- Accessible from the sidebar (**User Registry**).
- View all registered accounts stored in `users.json`.
- **Add User**: Add privileged identity directly.
- **Edit User**: Update full name or role.
- **Delete User**: Remove user permanently from `users.json` and revoke active sessions. Changes sync in real time.

### 8. Full Excel Activity Report Export
- Located on the Admin Dashboard overview (green **"Download Report (.XLSX)"** button).
- Generates a 9-worksheet Excel workbook:
  - **Cover & Summary**: Executive dashboard, 6 KPI cards, risk level matrix, user status breakdown.
  - **Event Log**: Numbered chronological audit trail with ML risk scores and color-coded risk badges.
  - **Active Sessions**: Currently authenticated sessions with strike counts and status.
  - **Security Alerts**: Flagged anomalies with ML reason descriptions.
  - **Onboarded Users**: Full account registry with onboarding statuses and last login timestamps.
  - **Role Permissions**: Role catalog table + 21-permission matrix with checkmarks.
  - **Auth Log**: Authentication attempts from `auth_activity.log`.
  - **Command Telemetry**: Hourly telemetry from `real_activity.log`.
  - **Email Outbox**: Dispatched email history and SMTP delivery statuses.

---

## 🤖 Machine Learning UEBA Engine

SecureSafe PAM combines **heuristic contextual scoring** with **unsupervised Isolation Forest** and **supervised Random Forest** classification:

- **Features Evaluated**:
  - `hour`: Time of command execution (0-23).
  - `ip_is_local`: Internal network (1) vs external/foreign IP (0).
  - `action_type`: Specific command executed (encoded via `OneHotEncoder`).
  - `user_role`: Assigned RBAC role.
- **Trained Model Artifacts**:
  - `risk_model.joblib`: Pre-trained anomaly classifier.
  - `encoder.joblib`: Fitted one-hot feature encoder.
- **Research Accuracy Metrics**:
  - Overall Classification Accuracy: **87.3%**
  - Normal Action Accuracy: **96.4%**
  - Critical Detection Rate: **83.5%**
  - End-to-End Decision Latency: **2.5s**

---

## 🧪 Running Automated Tests

The codebase includes full automated test suites to ensure 100% reliability:

### 1. Run Complete PAM Coverage Tests (14 Tests)
```bash
python test_pam_coverage.py
```
*Validates Flask initialization, demo authentication, risk calculation, 3-strike escalation, threat simulations, API endpoints, and metrics.*

### 2. Run Onboarding & RBAC Security Tests (6 Tests)
```bash
python test_onboarding_and_roles.py
```
*Validates password login, temp-password activation, invite generation, forgot-password code verification, RBAC least privilege enforcement, and Gmail plus-addressing distinct user accounts.*

---

## 📈 Generating Research Datasets & Visualizations

To reproduce the research evaluation graphs and datasets:

```bash
python generate_final_submission_datasets.py
```

This single command generates:
- `pam_confusion_matrix_data.csv` (1,555 benchmark samples)
- `figure_6_3_confusion_matrix.png` & `.pdf` (Confusion Matrix heatmap)
- `figure_6_4_classification_report.png` & `.pdf` (Precision, Recall, F1 table)
- `figure_6_5_roc_curves.png` & `.pdf` (Multi-class ROC Curves)
- `figure_6_22_response_times.png` & `.pdf` (Latency benchmarks)

---

## 📁 Project Directory Structure

```
Source Code PAM/
├── app.py                                # Main Flask server, API routes, ML inference, auth engine
├── script.js                             # Admin Dashboard frontend Single Page Application (SPA)
├── index.html                            # Admin Dashboard container HTML
├── portal.html                           # Privileged User Portal interface
├── login.html                            # Multi-mode login & forgot password UI
├── access_revoked.html                   # Locked session access revocation screen
├── real_accuracy_dashboard.html          # ML research analytics dashboard UI
│
├── users.json                            # Identity registry & credential storage
├── roles.json                            # RBAC role catalog & 21-permission registry
├── system_settings.json                  # System policies, risk thresholds, and SMTP settings
├── outbox_emails.json                    # Dispatched email log
│
├── risk_model.joblib                     # Trained ML Isolation Forest model
├── encoder.joblib                        # Fitted OneHotEncoder for categorical features
│
├── auth_activity.log                     # Authentication audit trail
├── real_activity.log                     # Privileged action telemetry log
├── user_management.log                   # User CRUD audit trail
├── settings_audit.log                    # Policy configuration audit trail
│
├── test_pam_coverage.py                  # Master test suite (14 test cases)
├── test_onboarding_and_roles.py          # Onboarding, RBAC, and auth test suite (6 test cases)
├── generate_final_submission_datasets.py # Master pipeline generating research charts
├── requirements.txt                      # Python dependencies list
├── .gitignore                            # Git exclusion rules
└── README.md                             # Project documentation (this file)
```

---

## ⚙️ Configuration & SMTP Settings

System policies and SMTP credentials can be configured directly through the **Settings Page** in the Admin Dashboard or by editing `system_settings.json`:

```json
{
  "risk_thresholds": {
    "medium": 60,
    "high": 80,
    "critical": 95
  },
  "session_management": {
    "session_timeout_minutes": 30,
    "max_strikes": 3
  },
  "smtp": {
    "server": "smtp.gmail.com",
    "port": 587,
    "user": "your-email@gmail.com",
    "password": "your-app-password"
  }
}
```

> **Tip for Gmail SMTP**: Generate a 16-character [Google App Password](https://myaccount.google.com/apppasswords) and enter it in Settings to enable live email delivery to any inbox.

---

## ❓ Troubleshooting & FAQ

**Q: Port 5000 is already in use.**
- *Solution*: Start on another port by running `python -c "import app; app.app.run(port=5001)"` or terminate the existing process using port 5000.

**Q: Email invitations are not arriving in the recipient's inbox.**
- *Solution*: Check that your SMTP credentials in the **Settings Page** are valid and click **"Test Real Email Delivery"**. Check `outbox_emails.json` to view the status.

**Q: Why was my portal access revoked?**
- *Solution*: Executing actions with risk scores >= 95 adds strikes to your session. Once strikes reach 3/3, access is revoked. Log in again or click **"Reset Strikes"** in the Admin Dashboard Sessions tab.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Developed for <strong>Privileged Access Management (PAM) & Cybersecurity Research</strong><br>
  Built with Python, Flask, Scikit-Learn, and TailwindCSS.
</p>
