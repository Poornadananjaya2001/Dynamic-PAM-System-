import os
import sys
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import OneHotEncoder
import joblib

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

print("=== SecureSafe PAM: ML Behavior Analysis Model Training ===")

# Baseline privileged actions data
default_data = [
    [9, 1, 'DB_CONNECT', 'Database Admin'],
    [10, 1, 'RUN_QUERY', 'Database Admin'],
    [11, 1, 'RUN_QUERY', 'Database Admin'],
    [14, 1, 'BACKUP_DB', 'Database Admin'],
    [15, 1, 'RUN_QUERY', 'Database Admin'],
    [9, 1, 'SSH_ROUTER', 'Network Engineer'],
    [10, 1, 'PING_HOST', 'Network Engineer'],
    [11, 1, 'CHECK_FIREWALL', 'Network Engineer'],
    [14, 1, 'PING_HOST', 'Network Engineer'],
    [10, 1, 'START_SERVER', 'App Developer'],
    [11, 1, 'DEPLOY_APP', 'App Developer'],
    [14, 1, 'GIT_PULL', 'App Developer'],
    [15, 1, 'CHECK_BILLING', 'App Developer'],
    [9, 1, 'OAUTH_LOGIN_SUCCESS', 'Database Admin'],
    [9, 1, 'OAUTH_LOGIN_SUCCESS', 'Network Engineer'],
    [9, 1, 'OAUTH_LOGIN_SUCCESS', 'App Developer'],
    [9, 1, 'LOGIN_SUCCESS', 'System Admin']
]

# Load existing log data if available
loaded_rows = []
if os.path.exists('real_activity.log'):
    try:
        with open('real_activity.log', 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                parts = line.strip().split(',')
                if len(parts) >= 4:
                    try:
                        loaded_rows.append([
                            int(parts[0]),
                            int(parts[1]),
                            parts[2].strip(),
                            parts[3].strip()
                        ])
                    except ValueError:
                        continue
        print(f"Loaded {len(loaded_rows)} entries from real_activity.log")
    except Exception as e:
        print(f"Notice: {e}")

all_rows = default_data + loaded_rows
df = pd.DataFrame(all_rows, columns=['hour', 'ip_is_local', 'action_type', 'user_role'])

# Feature Engineering: OneHotEncode action_type and user_role
encoder = OneHotEncoder(handle_unknown='ignore')
X_encoded = encoder.fit_transform(df[['action_type', 'user_role']])
X_final = pd.concat([df[['hour', 'ip_is_local']].reset_index(drop=True), pd.DataFrame(X_encoded.toarray())], axis=1)
X_final.columns = X_final.columns.astype(str)

# Train Isolation Forest (unsupervised anomaly detection)
model = IsolationForest(contamination=0.05, random_state=42)
model.fit(X_final)

joblib.dump(model, 'risk_model.joblib')
joblib.dump(encoder, 'encoder.joblib')

print(f"Model training successful on {len(df)} samples.")
print("Updated 'risk_model.joblib' and 'encoder.joblib'.")