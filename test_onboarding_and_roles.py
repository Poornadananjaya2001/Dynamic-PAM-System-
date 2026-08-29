import unittest
import json
import os
import app
from werkzeug.security import generate_password_hash

class TestOnboardingAndRoles(unittest.TestCase):
    def setUp(self):
        self.client = app.app.test_client()
        self.app_context = app.app.app_context()
        self.app_context.push()

        # Ensure base test users have standard testing passwords
        users = app.load_users()
        users['admin@company.com'] = {
            'name': 'Poorna Wickramasinghe',
            'role': 'System Admin',
            'password_hash': generate_password_hash('Admin@PAM2026!'),
            'status': 'active',
            'temp_password_active': False
        }
        users['wikzpoorna@gmail.com'] = {
            'name': 'Poorna Wickramasinghe',
            'role': 'System Admin',
            'password_hash': generate_password_hash('Admin@PAM2026!'),
            'status': 'active',
            'temp_password_active': False
        }
        app.save_users(users)

    def tearDown(self):
        self.app_context.pop()

    def test_01_password_login_and_auth(self):
        """Test password login with default admin credentials"""
        res = self.client.post('/login-password', json={
            'email': 'wikzpoorna@gmail.com',
            'password': 'Admin@PAM2026!'
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['status'], 'success')
        self.assertEqual(data['role'], 'System Admin')
        self.assertEqual(data['redirect'], '/')

    def test_02_invalid_password(self):
        """Test login with wrong password"""
        res = self.client.post('/login-password', json={
            'email': 'wikzpoorna@gmail.com',
            'password': 'WrongPassword123!'
        })
        self.assertEqual(res.status_code, 401)

    def test_03_onboarding_invite_and_login_with_temp_pw(self):
        """Test inviting a user, generating temp password, and logging in with it"""
        # 1. Login as admin first
        self.client.post('/login-password', json={
            'email': 'admin@company.com',
            'password': 'Admin@PAM2026!'
        })

        # 2. Invite a new user
        test_email = 'new.engineer@company.com'
        res = self.client.post('/api/onboarding/invite', json={
            'email': test_email,
            'name': 'Kasun Perera',
            'role': 'Network Engineer'
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        temp_pw = data['user']['temp_password']
        self.assertTrue(temp_pw.startswith('Pam#'))

        # 3. Clear session and log in as the newly invited user using temporary password
        self.client.get('/logout')
        res_login = self.client.post('/login-password', json={
            'email': test_email,
            'password': temp_pw
        })
        self.assertEqual(res_login.status_code, 200)
        login_data = res_login.get_json()
        self.assertEqual(login_data['role'], 'Network Engineer')
        self.assertEqual(login_data['redirect'], '/portal')

    def test_04_forgot_password_flow(self):
        """Test forgot password code request and password reset flow"""
        target_email = 'wikzpoorna@gmail.com'
        
        # 1. Request reset code
        res = self.client.post('/api/auth/forgot-password', json={'email': target_email})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        demo_code = data['demo_code']
        self.assertTrue(len(demo_code) >= 6)

        # 2. Complete password reset with code
        new_pw = 'NewSecurePass@2026!'
        res_reset = self.client.post('/api/auth/reset-password', json={
            'email': target_email,
            'reset_token': demo_code,
            'new_password': new_pw
        })
        self.assertEqual(res_reset.status_code, 200)

        # 3. Log in with new password
        res_new_login = self.client.post('/login-password', json={
            'email': target_email,
            'password': new_pw
        })
        self.assertEqual(res_new_login.status_code, 200)

    def test_05_role_management_and_least_privilege(self):
        """Test creating custom role, configuring permissions, and permission enforcement"""
        # 1. Login as admin
        self.client.post('/login-password', json={
            'email': 'admin@company.com',
            'password': 'Admin@PAM2026!'
        })

        # 2. Create custom role with least privilege (only net:ping)
        res = self.client.post('/api/roles', json={
            'name': 'Junior Auditor',
            'description': 'Least privilege network observer',
            'permissions': ['net:ping']
        })
        self.assertEqual(res.status_code, 200)

        # 3. Invite user with Junior Auditor role
        auditor_email = 'auditor.test@company.com'
        res_inv = self.client.post('/api/onboarding/invite', json={
            'email': auditor_email,
            'name': 'Auditor User',
            'role': 'Junior Auditor'
        })
        temp_pw = res_inv.get_json()['user']['temp_password']

        # 4. Login as auditor
        self.client.get('/logout')
        self.client.post('/login-password', json={
            'email': auditor_email,
            'password': temp_pw
        })

        # 5. Check authorized action (PING_HOST -> allowed)
        res_ping = self.client.post('/execute_action', json={
            'action': 'PING_HOST',
            'details': {'target_host': '10.0.0.1'}
        })
        self.assertEqual(res_ping.status_code, 200)

        # 6. Check unauthorized action (DELETE_TABLE -> flagged unauthorized)
        res_del = self.client.post('/execute_action', json={
            'action': 'DELETE_TABLE',
            'details': {'table_name': 'users'}
        })
        self.assertEqual(res_del.status_code, 200)
        del_data = res_del.get_json()
        self.assertGreaterEqual(del_data['risk_score'], 90)
        self.assertTrue(any('Unauthorized Action' in r for r in del_data['anomaly_reasons']))

    def test_06_plus_addressing_distinct_users(self):
        """Test plus-addressing: test@mail.com and test+1@mail.com are distinct accounts delivering to same inbox"""
        # 1. Login as admin
        self.client.post('/login-password', json={
            'email': 'admin@company.com',
            'password': 'Admin@PAM2026!'
        })

        # 2. Invite base email
        email_base = 'evaluator@gmail.com'
        res1 = self.client.post('/api/onboarding/invite', json={
            'email': email_base,
            'name': 'Primary Evaluator',
            'role': 'Database Admin'
        })
        self.assertEqual(res1.status_code, 200)
        pw1 = res1.get_json()['user']['temp_password']

        # 3. Invite plus-addressed alias email
        email_alias = 'evaluator+1@gmail.com'
        res2 = self.client.post('/api/onboarding/invite', json={
            'email': email_alias,
            'name': 'Secondary Alias User',
            'role': 'Network Engineer'
        })
        self.assertEqual(res2.status_code, 200)
        pw2 = res2.get_json()['user']['temp_password']

        # Both passwords must be distinct
        self.assertNotEqual(pw1, pw2)

        # 4. Verify both exist independently in registry
        users = app.load_users()
        self.assertIn(email_base, users)
        self.assertIn(email_alias, users)
        self.assertEqual(users[email_base]['role'], 'Database Admin')
        self.assertEqual(users[email_alias]['role'], 'Network Engineer')

        # 5. Log in as base user
        self.client.get('/logout')
        res_login1 = self.client.post('/login-password', json={
            'email': email_base,
            'password': pw1
        })
        self.assertEqual(res_login1.status_code, 200)
        self.assertEqual(res_login1.get_json()['role'], 'Database Admin')

        # 6. Log in as alias user
        self.client.get('/logout')
        res_login2 = self.client.post('/login-password', json={
            'email': email_alias,
            'password': pw2
        })
        self.assertEqual(res_login2.status_code, 200)
        self.assertEqual(res_login2.get_json()['role'], 'Network Engineer')

if __name__ == '__main__':
    unittest.main()
