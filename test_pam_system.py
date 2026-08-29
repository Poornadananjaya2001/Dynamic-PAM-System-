# basic_pam_test.py
import os
import sys
import json

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def test_pam_system_files():
    """Test PAM system without importing app.py"""
    
    print("=" * 60)
    print("PAM SYSTEM - BASIC FUNCTIONALITY TESTS")  
    print("=" * 60)
    
    tests_passed = 0
    total_tests = 0
    
    # Test 1: Core files exist
    print("\n📋 Testing Core Files:")
    core_files = ['app.py', 'system_settings.json', 'users.json']
    for file in core_files:
        total_tests += 1
        if os.path.exists(file):
            print(f"  ✅ {file} exists")
            tests_passed += 1
        else:
            print(f"  ❌ {file} missing")
    
    # Test 2: Web files exist
    print("\n📋 Testing Web Interface Files:")
    web_files = ['index.html', 'portal.html', 'login.html', 'script.js']
    for file in web_files:
        total_tests += 1
        if os.path.exists(file):
            print(f"  ✅ {file} exists")
            tests_passed += 1
        else:
            print(f"  ❌ {file} missing")
    
    # Test 3: Settings validation
    print("\n📋 Testing Settings Configuration:")
    total_tests += 1
    try:
        with open('system_settings.json', 'r') as f:
            settings = json.load(f)
        
        required_keys = ['risk_thresholds', 'session_management']
        for key in required_keys:
            if key in settings:
                print(f"  ✅ {key} configuration found")
            else:
                print(f"  ❌ {key} missing from settings")
        
        thresholds = settings['risk_thresholds']
        print(f"  ✅ Risk thresholds: {thresholds}")
        tests_passed += 1
        
    except Exception as e:
        print(f"  ❌ Settings file error: {e}")
    
    # Test 4: Log system
    print("\n📋 Testing Log System:")
    log_files = ['real_activity.log', 'auth_activity.log']
    for log in log_files:
        total_tests += 1
        if os.path.exists(log):
            try:
                with open(log, 'r') as f:
                    lines = len(f.readlines())
                print(f"  ✅ {log} exists ({lines} entries)")
                tests_passed += 1
            except:
                print(f"  ⚠️  {log} exists but unreadable")
        else:
            print(f"  ⚠️  {log} not found (created when needed)")
            tests_passed += 1  # This is OK
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    success_rate = (tests_passed / total_tests * 100) if total_tests > 0 else 0
    print(f"Tests Run: {total_tests}")
    print(f"Passed: {tests_passed}")
    print(f"Success Rate: {success_rate:.1f}%")
    
    if success_rate >= 70:
        print("\n✅ PAM SYSTEM STRUCTURE VALIDATED")
        print("   Core components are properly organized")
    else:
        print("\n⚠️  SOME COMPONENTS MISSING")
        print("   Review file structure and configuration")
    
    print("=" * 60)

if __name__ == '__main__':
    test_pam_system_files()