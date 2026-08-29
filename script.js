const App = {
    // --- STATE MANAGEMENT ---
    state: {
        currentPage: 'dashboard',
        alerts: [],
        activeSessions: [],
        allEvents: [],
        usersList: {},
        onboardingUsers: [],
        outboxList: [],
        rolesData: { permissions: {}, roles: {} },
        metricsData: null,
        dataFetchInterval: null,
        refreshPaused: false,
        lastInteractionTime: Date.now(),
        settings: null,
        thresholds: {
            medium: 60,
            high: 80,
            critical: 95
        }
    },

    // --- DATA FETCHING ---
    fetchDashboardData: async function() {
        if (this.state.refreshPaused) return;

        try {
            // Fetch alerts
            const alertsResponse = await fetch('/get_alerts');
            if (alertsResponse.ok) {
                const alertsFromServer = await alertsResponse.json();
                this.state.alerts = alertsFromServer.map(a => ({
                    ...a,
                    time: new Date(a.time),
                    anomalyReason: [`Risk Score: ${a.riskScore}`]
                }));
            }

            // Fetch active sessions
            const sessionsResponse = await fetch('/api/active_sessions');
            if (sessionsResponse.ok) {
                this.state.activeSessions = await sessionsResponse.json();
            }

            // Fetch all events
            const eventsResponse = await fetch('/api/all_events');
            if (eventsResponse.ok) {
                const eventsFromServer = await eventsResponse.json();
                this.state.allEvents = eventsFromServer.map(e => ({
                    ...e,
                    time: new Date(e.time)
                }));
            }

            // Real-time sync for identity registry and onboarding users
            if (this.state.currentPage === 'users') {
                const usersResponse = await fetch('/api/users');
                if (usersResponse.ok) {
                    this.state.usersList = await usersResponse.json();
                }
            }
            if (this.state.currentPage === 'onboarding') {
                const onbResponse = await fetch('/api/onboarding/users');
                if (onbResponse.ok) {
                    this.state.onboardingUsers = await onbResponse.json();
                }
            }

            // Re-render if on a dynamic monitoring page
            if (['dashboard', 'sessions', 'alerts', 'users', 'onboarding'].includes(this.state.currentPage)) {
                this.render();
            }
        } catch (e) {
            console.error("Dashboard sync error:", e);
        }
    },

    // --- UI RENDERING ---
    render: function() {
        const container = document.getElementById('app-container');
        if (!container) return;
        container.innerHTML = `
            ${this.Sidebar()}
            <div class="flex-1 flex flex-col overflow-hidden">
                ${this.Header()}
                <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4 md:p-6">
                    ${this.PageContent()}
                </main>
            </div>
        `;
        this.addEventListeners();
    },

    PageContent: function() {
        switch (this.state.currentPage) {
            case 'dashboard': return this.DashboardPage();
            case 'sessions': return this.SessionsPage();
            case 'onboarding': return this.OnboardingPage();
            case 'roles': return this.RolesPage();
            case 'alerts': return this.AlertsPage();
            case 'analytics': return this.AnalyticsPage();
            case 'users': return this.UsersPage();
            case 'simulator': return this.SimulatorPage();
            case 'settings': return this.SettingsPage();
            default: return `<div class="p-6 text-gray-400">Page not found</div>`;
        }
    },

    Sidebar: function() {
        const navItems = [
            { id: 'dashboard', icon: 'fa-tachometer-alt', label: 'Security Dashboard' },
            { id: 'sessions', icon: 'fa-users', label: 'Active Sessions' },
            { id: 'onboarding', icon: 'fa-user-plus', label: 'User Onboarding & Invites' },
            { id: 'roles', icon: 'fa-shield-alt', label: 'Role & Permission RBAC' },
            { id: 'alerts', icon: 'fa-bell', label: 'Threat Alerts' },
            { id: 'analytics', icon: 'fa-chart-line', label: 'Model Accuracy (87.3%)' },
            { id: 'simulator', icon: 'fa-shield-virus', label: 'Threat & Demo Simulator' },
            { id: 'users', icon: 'fa-user-cog', label: 'Identity Registry' },
            { id: 'settings', icon: 'fa-cog', label: 'System Configuration' },
        ];
        return `
            <div class="hidden md:flex flex-col w-16 bg-gray-950 border-r border-gray-800">
                <div class="flex items-center justify-center h-16 bg-gray-900 border-b border-gray-800">
                    <a href="/" class="text-cyan-400 hover:text-cyan-300 transition"><i class="fas fa-shield-halved text-2xl"></i></a>
                </div>
                <div class="flex flex-col flex-1 overflow-y-auto py-4">
                    <nav class="flex-1 px-2 space-y-2.5">
                        ${navItems.map(item => `
                            <a href="#" data-page="${item.id}" class="sidebar-icon flex items-center justify-center p-3 rounded-xl transition ${this.state.currentPage === item.id ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow' : 'text-gray-400 hover:text-white hover:bg-gray-800'}" title="${item.label}">
                                <i class="fas ${item.icon} text-lg"></i>
                            </a>
                        `).join('')}
                    </nav>
                </div>
            </div>
        `;
    },

    Header: function() {
        const titles = {
            dashboard: 'Live Security Overview',
            sessions: 'Privileged Session Management',
            onboarding: 'User Onboarding & Invite Dispatcher',
            roles: 'Role & Permission Management (RBAC)',
            alerts: 'Real-Time Threat & Anomaly Alerts',
            analytics: 'Model Accuracy & Research Performance Metrics',
            simulator: 'Live Threat & Anomaly Demonstration Simulator',
            users: 'Privileged User Administration',
            settings: 'System Policy & Configuration Engine'
        };

        const refreshControls = this.state.currentPage === 'settings' ? 
            `<div class="flex items-center space-x-2 text-sm">
                <span class="text-yellow-400 flex items-center text-xs">
                    <i class="fas fa-pause text-xs mr-1.5"></i>
                    Auto-refresh paused
                </span>
                <button onclick="App.manualRefresh()" class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition">
                    <i class="fas fa-sync mr-1"></i>Manual Refresh
                </button>
            </div>` :
            `<div class="flex items-center space-x-4 text-sm">
                <span class="text-green-400 flex items-center text-xs">
                    <i class="fas fa-circle text-[8px] mr-1.5 ${this.state.refreshPaused ? '' : 'animate-pulse'}"></i>
                    ${this.state.refreshPaused ? 'Paused' : 'Live Real-Time Sync'}
                </span>
                <button onclick="App.toggleRefresh()" class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition">
                    <i class="fas fa-${this.state.refreshPaused ? 'play' : 'pause'} mr-1"></i>
                    ${this.state.refreshPaused ? 'Resume' : 'Pause'}
                </button>
            </div>`;

        return `
            <header class="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-800">
                <div>
                    <h1 class="text-lg font-bold text-white tracking-tight">${titles[this.state.currentPage] || 'Admin Dashboard'}</h1>
                    <p class="text-xs text-gray-400">Dynamic PAM System • OAuth 2.0, RBAC & ML Behavioral Analysis</p>
                </div>
                <div class="flex items-center space-x-4">
                    ${refreshControls}
                    <a href="/portal" class="text-xs bg-cyan-600/20 text-cyan-400 border border-cyan-500/40 px-3 py-1.5 rounded-lg hover:bg-cyan-600/30 transition font-semibold" title="Go to User Portal">
                        <i class="fas fa-external-link-alt mr-1"></i> User Portal
                    </a>
                    <a href="/logout" class="text-gray-400 hover:text-white transition" title="Logout">
                        <i class="fas fa-sign-out-alt text-lg"></i>
                    </a>
                </div>
            </header>
        `;
    },

    // --- 1. DASHBOARD PAGE ---
    DashboardPage: function() {
        const criticalAlerts = this.state.alerts.filter(a => a.riskScore >= this.state.thresholds.critical).length;
        const totalAnomalies = this.state.alerts.length;
        const activeSessionCount = this.state.activeSessions.length;
        const highRiskAlerts = this.state.alerts.filter(a => a.riskScore >= this.state.thresholds.high);

        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center justify-between shadow-xl">
                    <div>
                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Sessions</p>
                        <p class="text-3xl font-bold text-white mt-1">${activeSessionCount}</p>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-2xl">
                        <i class="fas fa-users"></i>
                    </div>
                </div>
                <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center justify-between shadow-xl">
                    <div>
                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Critical Strikes / Alerts</p>
                        <p class="text-3xl font-bold text-red-500 mt-1 ${criticalAlerts > 0 ? 'animate-pulse-fast' : ''}">${criticalAlerts}</p>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center text-2xl">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                </div>
                <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center justify-between shadow-xl">
                    <div>
                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Anomalies</p>
                        <p class="text-3xl font-bold text-yellow-400 mt-1">${totalAnomalies}</p>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center text-2xl">
                        <i class="fas fa-bell"></i>
                    </div>
                </div>
                <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center justify-between shadow-xl">
                    <div>
                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">ML UEBA Engine</p>
                        <p class="text-3xl font-bold text-green-400 mt-1">87.3%</p>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center text-2xl">
                        <i class="fas fa-brain"></i>
                    </div>
                </div>
            </div>

            <div class="mt-6 bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-xl flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl">
                        <i class="fas fa-file-excel"></i>
                    </div>
                    <div>
                        <h4 class="text-sm font-bold text-white">Full User Activity Report</h4>
                        <p class="text-[11px] text-gray-400">Download a comprehensive Excel report — includes events, sessions, alerts, users, auth logs, email outbox &amp; statistics.</p>
                    </div>
                </div>
                <button onclick="App.downloadActivityReport()" class="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition flex items-center space-x-2 shadow-lg">
                    <i class="fas fa-download"></i>
                    <span>Download Report (.XLSX)</span>
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div class="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-xl">
                    <h3 class="font-bold text-base mb-4 text-cyan-300 flex items-center">
                        <i class="fas fa-shield-halved mr-2 text-cyan-400"></i> Recent High-Risk Alerts
                    </h3>
                    <div class="max-h-[500px] overflow-y-auto pr-1" style="scrollbar-width: thin; scrollbar-color: #374151 #1f2937;">
                        ${highRiskAlerts.length > 0 ? this.AlertsList(highRiskAlerts.slice(0, 10)) : '<p class="text-gray-500 text-center py-6 text-xs">No high-risk alerts recorded.</p>'}
                    </div>
                </div>
                <div class="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-xl">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-base text-cyan-300 flex items-center">
                            <i class="fas fa-list-check mr-2 text-cyan-400"></i> Full Security Audit Stream
                        </h3>
                        <span class="text-xs bg-gray-700 text-gray-300 px-2.5 py-0.5 rounded-full font-mono">${this.state.allEvents.length} events</span>
                    </div>
                    <div class="max-h-[500px] overflow-y-auto pr-1" style="scrollbar-width: thin; scrollbar-color: #374151 #1f2937;">
                        ${this.AlertsList(this.state.allEvents)}
                    </div>
                </div>
            </div>
        `;
    },

    // --- 2. SESSIONS PAGE ---
    SessionsPage: function() {
        if (this.state.activeSessions.length === 0) {
            return `
                <div class="p-12 bg-gray-800 border border-gray-700 rounded-2xl text-center text-gray-400 space-y-3 shadow-xl">
                    <i class="fas fa-users-slash text-5xl text-gray-600 mb-2"></i>
                    <h3 class="text-lg font-bold text-white">No Active Sessions</h3>
                    <p class="text-xs text-gray-400">There are currently no authenticated privileged user sessions.</p>
                </div>
            `;
        }
        return `
            <div class="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
                <div class="p-5 border-b border-gray-700 flex justify-between items-center">
                    <h3 class="font-bold text-base text-white flex items-center">
                        <i class="fas fa-users text-cyan-400 mr-2"></i> Active Privileged Sessions (${this.state.activeSessions.length})
                    </h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs text-gray-300">
                        <thead class="bg-gray-900/80 text-gray-400 uppercase text-[11px] font-semibold border-b border-gray-700">
                            <tr>
                                <th class="p-4">User & Email</th>
                                <th class="p-4">Assigned Role</th>
                                <th class="p-4">Login Time</th>
                                <th class="p-4">Critical Strikes</th>
                                <th class="p-4">Portal Status</th>
                                <th class="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-700/60">
                            ${this.state.activeSessions.map(s => {
                                const isRevoked = s.portal_access === 'revoked' || s.strike_count >= 3;
                                return `
                                    <tr class="hover:bg-gray-700/30 transition">
                                        <td class="p-4">
                                            <div class="font-bold text-white">${s.name}</div>
                                            <div class="text-gray-400 font-mono text-[11px]">${s.email}</div>
                                        </td>
                                        <td class="p-4">
                                            <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-900/60 text-cyan-300 border border-cyan-700">
                                                ${s.role}
                                            </span>
                                        </td>
                                        <td class="p-4 text-gray-400">${new Date(s.login_time).toLocaleTimeString()}</td>
                                        <td class="p-4">
                                            <span class="font-bold font-mono px-2.5 py-1 rounded-lg ${s.strike_count > 0 ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-green-950 text-green-400 border border-green-800'}">
                                                ${s.strike_count} / 3 Strikes
                                            </span>
                                        </td>
                                        <td class="p-4">
                                            ${isRevoked ? 
                                                '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-900/80 text-red-200 border border-red-700 animate-pulse">REVOKED (Locked Out)</span>' : 
                                                '<span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-900/60 text-green-300 border border-green-700">Active</span>'
                                            }
                                        </td>
                                        <td class="p-4 text-right">
                                            ${isRevoked ? `
                                                <button onclick="App.resetSessionAccess('${s.session_id}')" class="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold text-xs transition shadow flex items-center gap-1.5 ml-auto">
                                                    <i class="fas fa-undo"></i> Restore Access
                                                </button>
                                            ` : `
                                                <button onclick="App.revokeSessionDirect('${s.email}')" class="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg font-semibold text-xs transition flex items-center gap-1.5 ml-auto">
                                                    <i class="fas fa-ban"></i> Terminate
                                                </button>
                                            `}
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // --- 3. ONBOARDING & INVITES PAGE (NEW) ---
    OnboardingPage: function() {
        if (!this.state.onboardingUsers.length) {
            this.loadOnboardingData();
        }

        const totalUsers = this.state.onboardingUsers.length;
        const pendingInvites = this.state.onboardingUsers.filter(u => u.status === 'invited').length;
        const activeUsers = this.state.onboardingUsers.filter(u => u.status === 'active').length;
        const dispatchedEmails = this.state.outboxList.length;

        return `
            <div class="space-y-6">
                <!-- Top Summary Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="p-5 bg-gray-800 border border-gray-700 rounded-2xl shadow-xl flex items-center justify-between">
                        <div>
                            <p class="text-xs text-gray-400 font-semibold uppercase">Total Users</p>
                            <p class="text-2xl font-bold text-white mt-1">${totalUsers}</p>
                        </div>
                        <i class="fas fa-users text-3xl text-cyan-400"></i>
                    </div>
                    <div class="p-5 bg-gray-800 border border-gray-700 rounded-2xl shadow-xl flex items-center justify-between">
                        <div>
                            <p class="text-xs text-gray-400 font-semibold uppercase">Pending Invitations</p>
                            <p class="text-2xl font-bold text-amber-400 mt-1">${pendingInvites}</p>
                        </div>
                        <i class="fas fa-envelope-open-text text-3xl text-amber-400"></i>
                    </div>
                    <div class="p-5 bg-gray-800 border border-gray-700 rounded-2xl shadow-xl flex items-center justify-between">
                        <div>
                            <p class="text-xs text-gray-400 font-semibold uppercase">Active Accounts</p>
                            <p class="text-2xl font-bold text-green-400 mt-1">${activeUsers}</p>
                        </div>
                        <i class="fas fa-user-check text-3xl text-green-400"></i>
                    </div>
                    <div class="p-5 bg-gray-800 border border-gray-700 rounded-2xl shadow-xl flex items-center justify-between">
                        <div>
                            <p class="text-xs text-gray-400 font-semibold uppercase">Dispatched Emails</p>
                            <p class="text-2xl font-bold text-blue-400 mt-1">${dispatchedEmails}</p>
                        </div>
                        <i class="fas fa-paper-plane text-3xl text-blue-400"></i>
                    </div>
                </div>

                <!-- Onboarding Table Card -->
                <div class="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
                    <div class="p-5 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 class="font-bold text-base text-white flex items-center gap-2">
                                <i class="fas fa-user-plus text-cyan-400"></i> Onboarded Privileged Users
                            </h3>
                            <p class="text-xs text-gray-400">Invite new administrators and engineers with temporary credentials</p>
                        </div>
                        <button onclick="App.openInviteUserModal()" class="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-900/30 transition flex items-center gap-2">
                            <i class="fas fa-plus"></i> Invite New User
                        </button>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs text-gray-300">
                            <thead class="bg-gray-900/80 text-gray-400 uppercase text-[11px] font-semibold border-b border-gray-700">
                                <tr>
                                    <th class="p-4">User Details</th>
                                    <th class="p-4">Assigned Role</th>
                                    <th class="p-4">Onboarding Status</th>
                                    <th class="p-4">Temporary Password</th>
                                    <th class="p-4">Invited / Last Login</th>
                                    <th class="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-700/60">
                                ${this.state.onboardingUsers.map(u => {
                                    let statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-950 text-green-300 border border-green-800">Active</span>';
                                    if (u.status === 'invited') {
                                        statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">Invited (Pending)</span>';
                                    } else if (u.status === 'locked') {
                                        statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-950 text-red-300 border border-red-800">Revoked / Locked</span>';
                                    }

                                    return `
                                        <tr class="hover:bg-gray-700/30 transition">
                                            <td class="p-4">
                                                <div class="font-bold text-white">${u.name}</div>
                                                <div class="text-gray-400 font-mono text-[11px]">${u.email}</div>
                                            </td>
                                            <td class="p-4">
                                                <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-900/60 text-cyan-300 border border-cyan-700">
                                                    ${u.role}
                                                </span>
                                            </td>
                                            <td class="p-4">${statusBadge}</td>
                                            <td class="p-4 font-mono">
                                                ${u.temp_password ? `
                                                    <span class="bg-gray-900 px-2 py-1 rounded border border-gray-700 text-green-400 font-bold select-all">${u.temp_password}</span>
                                                ` : `<span class="text-gray-500 italic">Permanent Password Set</span>`}
                                            </td>
                                            <td class="p-4 text-gray-400 text-[11px]">
                                                <div>Invited: ${u.invited_at ? new Date(u.invited_at).toLocaleDateString() : 'N/A'}</div>
                                                <div>Last Login: ${u.last_login ? new Date(u.last_login).toLocaleTimeString() : 'Never'}</div>
                                            </td>
                                            <td class="p-4 text-right space-x-2">
                                                <button onclick="App.resendInvite('${u.email}')" class="px-2.5 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs transition" title="Resend New Temporary Password">
                                                    <i class="fas fa-sync mr-1"></i> Resend
                                                </button>
                                                <button onclick="App.revokeUserAccess('${u.email}')" class="px-2.5 py-1 bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700 rounded-lg text-xs transition" title="Revoke User Access">
                                                    <i class="fas fa-user-slash mr-1"></i> Revoke
                                                </button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Smart Outbox & Email Dispatch Log -->
                <div class="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-5 space-y-4">
                    <div class="flex justify-between items-center border-b border-gray-700 pb-3">
                        <h3 class="font-bold text-base text-white flex items-center gap-2">
                            <i class="fas fa-inbox text-cyan-400"></i> Smart Outbox & Invitation Dispatch Log
                        </h3>
                        <span class="text-xs text-gray-400">${this.state.outboxList.length} total messages dispatched</span>
                    </div>

                    <div class="space-y-3 max-h-72 overflow-y-auto pr-1" style="scrollbar-width: thin; scrollbar-color: #374151 #1f2937;">
                        ${this.state.outboxList.length > 0 ? this.state.outboxList.map(m => `
                            <div class="p-3.5 bg-gray-900/90 border border-gray-700/80 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                                <div>
                                    <div class="font-bold text-white flex items-center gap-2">
                                        <span>${m.subject}</span>
                                        <span class="px-2 py-0.5 bg-cyan-950 text-cyan-400 rounded-full border border-cyan-800 text-[10px] uppercase font-mono">${m.type}</span>
                                    </div>
                                    <div class="text-gray-400 mt-1">Recipient: <strong class="text-gray-200">${m.to}</strong></div>
                                    ${m.metadata && m.metadata.temp_password ? `
                                        <div class="text-green-400 mt-0.5">Generated Temp Password: <code class="bg-black/50 px-1.5 py-0.5 rounded">${m.metadata.temp_password}</code></div>
                                    ` : ''}
                                    ${m.metadata && m.metadata.reset_token ? `
                                        <div class="text-cyan-300 mt-0.5">Reset Verification Code: <code class="bg-black/50 px-1.5 py-0.5 rounded font-bold">${m.metadata.reset_token}</code></div>
                                    ` : ''}
                                </div>
                                <div class="text-gray-500 font-mono text-[11px] whitespace-nowrap">
                                    ${new Date(m.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        `).join('') : '<p class="text-gray-500 text-center py-4 text-xs">No dispatched emails in outbox log.</p>'}
                    </div>
                </div>
            </div>
        `;
    },

    // --- 4. ROLES & PERMISSIONS PAGE (NEW) ---
    RolesPage: function() {
        if (!Object.keys(this.state.rolesData.roles).length) {
            this.loadRolesData();
        }

        const roles = Object.values(this.state.rolesData.roles || {});
        const permissions = this.state.rolesData.permissions || {};

        return `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex justify-between items-center bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-xl">
                    <div>
                        <h3 class="font-bold text-base text-white flex items-center gap-2">
                            <i class="fas fa-shield-alt text-cyan-400"></i> Role-Based Access Control (RBAC) & Permissions
                        </h3>
                        <p class="text-xs text-gray-400">Configure granular permissions, full admin access, or least-privilege profiles</p>
                    </div>
                    <button onclick="App.openCreateRoleModal()" class="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-900/30 transition flex items-center gap-2">
                        <i class="fas fa-plus"></i> Create Custom Role
                    </button>
                </div>

                <!-- Roles Catalog Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${roles.map(r => {
                        const isSystem = r.is_system;
                        const isAll = r.permissions.includes('*') || r.name === 'System Admin';
                        return `
                            <div class="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-xl space-y-4 flex flex-col justify-between">
                                <div>
                                    <div class="flex justify-between items-start">
                                        <h4 class="font-bold text-base text-white">${r.name}</h4>
                                        ${isSystem ? 
                                            '<span class="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded-full text-[10px] font-semibold">Core System</span>' : 
                                            '<span class="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded-full text-[10px] font-semibold">Custom Role</span>'
                                        }
                                    </div>
                                    <p class="text-xs text-gray-400 mt-1">${r.description}</p>
                                    
                                    <div class="mt-4 space-y-2">
                                        <p class="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">Granted Permissions (${isAll ? 'ALL (*)' : r.permissions.length}):</p>
                                        <div class="flex flex-wrap gap-1.5">
                                            ${isAll ? `
                                                <span class="px-2 py-1 bg-green-950 text-green-300 border border-green-800 rounded-md text-[11px] font-mono font-bold">
                                                    * (Full Privileges & Root Admin)
                                                </span>
                                            ` : r.permissions.map(p => `
                                                <span class="px-2 py-0.5 bg-gray-900 text-cyan-300 border border-gray-700 rounded-md text-[10px] font-mono">
                                                    ${p}
                                                </span>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>

                                <div class="pt-3 border-t border-gray-700/80 flex justify-between items-center">
                                    <button onclick="App.openEditRoleModal('${r.name}')" class="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition">
                                        <i class="fas fa-edit mr-1"></i> Edit Permissions
                                    </button>
                                    ${!isSystem ? `
                                        <button onclick="App.deleteCustomRole('${r.name}')" class="text-xs text-red-400 hover:text-red-300 transition">
                                            <i class="fas fa-trash-alt mr-1"></i> Delete
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    // --- 5. ALERTS PAGE ---
    AlertsPage: function() {
        return `
            <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl space-y-4">
                <div class="flex justify-between items-center border-b border-gray-700 pb-3">
                    <h3 class="font-bold text-base text-white flex items-center">
                        <i class="fas fa-bell text-yellow-400 mr-2"></i> Real-Time Anomaly & Threat Log
                    </h3>
                    <span class="text-xs text-gray-400">${this.state.alerts.length} total flagged events</span>
                </div>
                ${this.AlertsList(this.state.alerts)}
            </div>
        `;
    },

    // --- 6. ANALYTICS & RESEARCH ACCURACY PAGE (Slide 23/25) ---
    AnalyticsPage: function() {
        return `
            <div class="space-y-6">
                <!-- Research Accuracy Summary -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="p-5 bg-gray-800 border border-gray-700 rounded-2xl shadow-xl">
                        <p class="text-xs font-semibold text-gray-400 uppercase">Overall Model Accuracy</p>
                        <p class="text-3xl font-extrabold text-green-400 mt-1">87.3%</p>
                        <p class="text-[11px] text-gray-400 mt-1">Slide 23 Verified Benchmark</p>
                    </div>
                    <div class="p-5 bg-gray-800 border border-gray-700 rounded-2xl shadow-xl">
                        <p class="text-xs font-semibold text-gray-400 uppercase">Normal Activity Precision</p>
                        <p class="text-3xl font-extrabold text-cyan-400 mt-1">96.4%</p>
                        <p class="text-[11px] text-gray-400 mt-1">Class Accuracy (Normal)</p>
                    </div>
                    <div class="p-5 bg-gray-800 border border-gray-700 rounded-2xl shadow-xl">
                        <p class="text-xs font-semibold text-gray-400 uppercase">Critical Threat Detection</p>
                        <p class="text-3xl font-extrabold text-red-400 mt-1">83.5%</p>
                        <p class="text-[11px] text-gray-400 mt-1">High/Critical Sensitivity</p>
                    </div>
                    <div class="p-5 bg-gray-800 border border-gray-700 rounded-2xl shadow-xl">
                        <p class="text-xs font-semibold text-gray-400 uppercase">End-to-End Latency</p>
                        <p class="text-3xl font-extrabold text-yellow-400 mt-1">2.5s</p>
                        <p class="text-[11px] text-gray-400 mt-1">Slide 25 Latency Benchmark</p>
                    </div>
                </div>

                <!-- Confusion Matrix & Research Performance -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl space-y-4">
                        <h3 class="font-bold text-base text-cyan-300 flex items-center">
                            <i class="fas fa-table mr-2 text-cyan-400"></i> Multiclass Confusion Matrix (N = 1,555 Samples)
                        </h3>
                        <div class="overflow-x-auto">
                            <table class="w-full text-center text-xs border-collapse">
                                <thead>
                                    <tr class="bg-gray-900 text-gray-400">
                                        <th class="p-3 text-left">Actual \\ Predicted</th>
                                        <th class="p-3 text-green-400">Normal</th>
                                        <th class="p-3 text-yellow-400">Low</th>
                                        <th class="p-3 text-orange-400">Medium</th>
                                        <th class="p-3 text-red-400">Critical</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-700 font-mono">
                                    <tr>
                                        <td class="p-3 text-left font-bold text-white">Normal (0-59)</td>
                                        <td class="p-3 bg-green-950/60 text-green-300 font-bold">1,130 (96.4%)</td>
                                        <td class="p-3 text-gray-400">28</td>
                                        <td class="p-3 text-gray-400">12</td>
                                        <td class="p-3 text-gray-400">2</td>
                                    </tr>
                                    <tr>
                                        <td class="p-3 text-left font-bold text-white">Low Risk (60-79)</td>
                                        <td class="p-3 text-gray-400">18</td>
                                        <td class="p-3 bg-yellow-950/60 text-yellow-300 font-bold">96 (72.2%)</td>
                                        <td class="p-3 text-gray-400">15</td>
                                        <td class="p-3 text-gray-400">4</td>
                                    </tr>
                                    <tr>
                                        <td class="p-3 text-left font-bold text-white">Medium Risk (80-94)</td>
                                        <td class="p-3 text-gray-400">8</td>
                                        <td class="p-3 text-gray-400">11</td>
                                        <td class="p-3 bg-orange-950/60 text-orange-300 font-bold">82 (77.4%)</td>
                                        <td class="p-3 text-gray-400">5</td>
                                    </tr>
                                    <tr>
                                        <td class="p-3 text-left font-bold text-white">Critical Threat (95+)</td>
                                        <td class="p-3 text-red-400">2 (1.8% FNR)</td>
                                        <td class="p-3 text-gray-400">4</td>
                                        <td class="p-3 text-gray-400">11</td>
                                        <td class="p-3 bg-red-950/60 text-red-300 font-bold">86 (83.5%)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl space-y-4">
                        <h3 class="font-bold text-base text-cyan-300 flex items-center">
                            <i class="fas fa-tachometer-alt mr-2 text-cyan-400"></i> Real-Time Processing Latency Breakdown
                        </h3>
                        <div class="space-y-3 text-xs">
                            <div>
                                <div class="flex justify-between text-gray-300 mb-1">
                                    <span>OAuth 2.0 Token Handshake</span>
                                    <span class="font-bold font-mono">0.8s</span>
                                </div>
                                <div class="w-full bg-gray-900 rounded-full h-2">
                                    <div class="bg-blue-500 h-2 rounded-full" style="width: 32%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between text-gray-300 mb-1">
                                    <span>Isolation Forest ML Inference</span>
                                    <span class="font-bold font-mono">1.2s</span>
                                </div>
                                <div class="w-full bg-gray-900 rounded-full h-2">
                                    <div class="bg-cyan-500 h-2 rounded-full" style="width: 48%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between text-gray-300 mb-1">
                                    <span>Dynamic Strikeout & Auto-Revocation</span>
                                    <span class="font-bold font-mono">0.5s</span>
                                </div>
                                <div class="w-full bg-gray-900 rounded-full h-2">
                                    <div class="bg-green-500 h-2 rounded-full" style="width: 20%"></div>
                                </div>
                            </div>
                            <div class="p-4 bg-gray-900/90 rounded-xl border border-gray-700/80 mt-4">
                                <p class="text-xs text-gray-400"><strong>End-to-End Latency:</strong> 2.5 seconds from user action to automated token revocation upon critical policy breach.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // --- 7. THREAT SIMULATOR PAGE (Slide 33) ---
    SimulatorPage: function() {
        const scenarios = [
            { id: 'sql_normal', name: '1. Standard SQL Query (Normal)', score: 45, strikes: '0/3', desc: 'Authorized daytime query execution on production database.', action: 'RUN_QUERY', payload: { query: 'SELECT count(*) FROM users' } },
            { id: 'off_hours', name: '2. Off-Hours SSH Access', score: 85, strikes: '0/3', desc: 'SSH router session established outside 08:00-17:00 operational window.', action: 'SSH_ROUTER', payload: { target_host: 'router-01.dc' } },
            { id: 'foreign_iam', name: '3. Non-Local IP IAM Escalation', score: 100, strikes: '1/3 Strike', desc: 'Privilege modification originating from external non-local IP address.', action: 'UPDATE_IAM', payload: { policy_name: 'AdministratorAccess' } },
            { id: 'drop_table', name: '4. Critical Threat: DROP TABLE', score: 95, strikes: '1/3 Strike', desc: 'Attempted destruction of core database customer table.', action: 'DELETE_TABLE', payload: { table_name: 'users_core' } },
            { id: 'shutdown_net', name: '5. Critical Threat: Router Shutdown', score: 95, strikes: '1/3 Strike', desc: 'Emergency switch shutdown command dispatched.', action: 'SHUTDOWN_ROUTER', payload: { target_host: 'core-gw-01' } },
            { id: 'rm_rf', name: '6. Catastrophic Attack: rm -rf /', score: 100, strikes: '3/3 Strikes (Revocation)', desc: 'Simulated destructive root attack triggering instant automated OAuth token revocation.', action: 'rm -rf /', payload: { command: 'rm -rf / --no-preserve-root' } }
        ];

        return `
            <div class="space-y-6">
                <div class="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-xl">
                    <h3 class="font-bold text-base text-white flex items-center gap-2">
                        <i class="fas fa-shield-virus text-red-400"></i> Slide 33 Live Demonstration Scenarios
                    </h3>
                    <p class="text-xs text-gray-400">Trigger threat simulations to demonstrate real-time risk scoring, alerts, and dynamic strike escalation.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${scenarios.map(s => `
                        <div class="p-5 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl flex flex-col justify-between space-y-4">
                            <div>
                                <div class="flex justify-between items-start">
                                    <h4 class="font-bold text-sm text-white">${s.name}</h4>
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${s.score >= 95 ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-yellow-950 text-yellow-400 border border-yellow-800'}">
                                        Score: ${s.score}
                                    </span>
                                </div>
                                <p class="text-xs text-gray-400 mt-2">${s.desc}</p>
                                <p class="text-[11px] text-purple-300 font-mono mt-1">Impact: ${s.strikes}</p>
                            </div>
                            <button onclick="App.runThreatSimulation('${s.id}', '${s.action}', ${JSON.stringify(s.payload).replace(/"/g, '&quot;')})" 
                                class="w-full py-2.5 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-white rounded-xl text-xs font-semibold shadow transition flex items-center justify-center gap-2">
                                <i class="fas fa-play"></i> Trigger Scenario
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // --- 8. USERS REGISTRY PAGE ---
    UsersPage: function() {
        if (!this.state.usersList || (Array.isArray(this.state.usersList) && this.state.usersList.length === 0) || (typeof this.state.usersList === 'object' && Object.keys(this.state.usersList).length === 0)) {
            this.loadUsersList();
        }

        const usersArray = Array.isArray(this.state.usersList)
            ? this.state.usersList
            : Object.entries(this.state.usersList || {}).map(([email, u]) => ({ email, ...u }));

        return `
            <div class="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
                <div class="p-5 border-b border-gray-700 flex justify-between items-center">
                    <div>
                        <h3 class="font-bold text-base text-white flex items-center gap-2">
                            <i class="fas fa-user-cog text-cyan-400"></i> Identity Registry (users.json)
                        </h3>
                        <p class="text-xs text-gray-400">Active privileged identities permitted to authenticate into SecureSafe PAM (${usersArray.length} registered)</p>
                    </div>
                    <button onclick="App.openAddUserModal()" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow transition flex items-center gap-2">
                        <i class="fas fa-plus"></i> Add User
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs text-gray-300">
                        <thead class="bg-gray-900/80 text-gray-400 uppercase text-[11px] font-semibold border-b border-gray-700">
                            <tr>
                                <th class="p-4">Name</th>
                                <th class="p-4">Registered Email</th>
                                <th class="p-4">PAM Role</th>
                                <th class="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-700/60">
                            ${usersArray.length === 0 ? `
                                <tr>
                                    <td colspan="4" class="p-8 text-center text-gray-400">Loading user registry...</td>
                                </tr>
                            ` : usersArray.map(user => {
                                const userEmail = user.email || '';
                                const userName = (user.name || '').replace(/'/g, "\\'");
                                const userRole = user.role || 'User';

                                return `
                                    <tr class="hover:bg-gray-700/30 transition">
                                        <td class="p-4 font-bold text-white">${user.name || 'Unknown'}</td>
                                        <td class="p-4 font-mono text-cyan-300 font-semibold">${userEmail}</td>
                                        <td class="p-4">
                                            <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-900/60 text-cyan-300 border border-cyan-700">
                                                ${userRole}
                                            </span>
                                        </td>
                                        <td class="p-4 text-right space-x-2">
                                            <button onclick="App.editUser('${userEmail}', '${userName}', '${userRole}')" class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs transition">
                                                <i class="fas fa-edit mr-1"></i> Edit
                                            </button>
                                            <button onclick="App.deleteUser('${userEmail}')" class="px-3 py-1 bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700 rounded-lg text-xs transition">
                                                <i class="fas fa-trash mr-1"></i> Delete
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // --- 9. SETTINGS PAGE ---
    SettingsPage: function() {
        if (!this.state.settings) {
            this.loadSettings();
            return `<div class="p-8 text-center text-gray-400">Loading system settings...</div>`;
        }

        const smtp = this.state.settings.smtp || { server: 'smtp.gmail.com', port: 587, user: '', password: '' };

        return `
            <div class="space-y-6">
                <form id="settings-form" onsubmit="App.handleSettingsSubmit(event)" class="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl space-y-6">
                    <h3 class="font-bold text-base text-cyan-300 flex items-center">
                        <i class="fas fa-sliders-h mr-2 text-cyan-400"></i> Policy & Risk Threshold Configuration
                    </h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-gray-300 mb-1">Medium Risk Threshold</label>
                            <input type="number" id="setting-medium" value="${this.state.settings.risk_thresholds.medium}" class="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-sm text-white focus:border-cyan-500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-300 mb-1">High Risk Threshold</label>
                            <input type="number" id="setting-high" value="${this.state.settings.risk_thresholds.high}" class="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-sm text-white focus:border-cyan-500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-300 mb-1">Critical Threshold (Auto-Strike)</label>
                            <input type="number" id="setting-critical" value="${this.state.settings.risk_thresholds.critical}" class="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-sm text-white focus:border-cyan-500">
                        </div>
                    </div>

                    <!-- SMTP Mail Server Settings -->
                    <div class="pt-6 border-t border-gray-700 space-y-4">
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="font-bold text-base text-cyan-300 flex items-center">
                                    <i class="fas fa-envelope-open-text mr-2 text-cyan-400"></i> Outgoing SMTP Mail Server (Real Email Delivery)
                                </h3>
                                <p class="text-xs text-gray-400">Configure your Gmail or company SMTP server to send live emails to invited users (supports email aliases like <code>test+1@mail.com</code>)</p>
                            </div>
                            <button type="button" onclick="App.testSmtpDelivery()" class="px-3.5 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5">
                                <i class="fas fa-paper-plane"></i> Test Real Email Delivery
                            </button>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-gray-300 mb-1">SMTP Server</label>
                                <input type="text" id="setting-smtp-server" value="${smtp.server || 'smtp.gmail.com'}" placeholder="smtp.gmail.com" class="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-sm text-white focus:border-cyan-500 font-mono">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-300 mb-1">SMTP Port</label>
                                <input type="number" id="setting-smtp-port" value="${smtp.port || 587}" placeholder="587" class="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-sm text-white focus:border-cyan-500 font-mono">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-300 mb-1">Sender Email</label>
                                <input type="email" id="setting-smtp-user" value="${smtp.user || ''}" placeholder="wikzpoorna@gmail.com" class="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-sm text-white focus:border-cyan-500">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-300 mb-1">App Password / Password</label>
                                <input type="password" id="setting-smtp-pw" value="${smtp.password || ''}" placeholder="16-character App Password" class="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-sm text-white focus:border-cyan-500">
                            </div>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-gray-700 flex justify-between items-center">
                        <button type="button" onclick="App.exportLogsZip()" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2">
                            <i class="fas fa-file-archive"></i> Export Audit Logs (.ZIP)
                        </button>
                        <button type="submit" class="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow transition">
                            Save Policy & SMTP Settings
                        </button>
                    </div>
                </form>
            </div>
        `;
    },

    // --- REUSABLE COMPONENTS ---
    RiskBadge: function(score) {
        let colorClass = "bg-green-950 text-green-300 border-green-800";
        let label = "Low Risk";
        if (score >= this.state.thresholds.critical) {
            colorClass = "bg-red-950 text-red-300 border-red-800 animate-pulse";
            label = "Critical Strike";
        } else if (score >= this.state.thresholds.high) {
            colorClass = "bg-orange-950 text-orange-300 border-orange-800";
            label = "High Risk";
        } else if (score >= this.state.thresholds.medium) {
            colorClass = "bg-yellow-950 text-yellow-300 border-yellow-800";
            label = "Medium Risk";
        }
        return `<span class="px-2.5 py-1 rounded-full text-[11px] font-bold border ${colorClass}">${score} - ${label}</span>`;
    },

    AlertsList: function(events) {
        if (!events || events.length === 0) return `<p class="text-gray-500 text-center py-6 text-xs">No events recorded.</p>`;
        return `
            <div class="space-y-3">
                ${events.map(event => `
                    <div class="p-3.5 rounded-xl bg-gray-900/80 border border-gray-700/80 hover:border-gray-600 transition space-y-1.5">
                        <div class="flex justify-between items-center">
                            <div>
                                <span class="font-bold text-white text-xs">${event.user ? event.user.role : 'User'}</span>
                                <span class="text-cyan-400 font-mono text-xs ml-1.5">${event.action}</span>
                            </div>
                            ${this.RiskBadge(event.riskScore)}
                        </div>
                        <p class="text-[11px] text-gray-400 font-mono">${new Date(event.time).toLocaleString()}</p>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // --- API HANDLERS & MODALS ---
    loadOnboardingData: async function() {
        try {
            const [usersRes, outboxRes, rolesRes] = await Promise.all([
                fetch('/api/onboarding/users'),
                fetch('/api/onboarding/outbox'),
                fetch('/api/roles')
            ]);
            if (usersRes.ok) this.state.onboardingUsers = await usersRes.json();
            if (outboxRes.ok) this.state.outboxList = await outboxRes.json();
            if (rolesRes.ok) this.state.rolesData = await rolesRes.json();
            if (this.state.currentPage === 'onboarding') this.render();
        } catch (e) {
            console.error("Onboarding data fetch error:", e);
        }
    },

    loadRolesData: async function() {
        try {
            const res = await fetch('/api/roles');
            if (res.ok) {
                this.state.rolesData = await res.json();
                if (this.state.currentPage === 'roles') this.render();
            }
        } catch (e) {
            console.error("Roles data fetch error:", e);
        }
    },

    openInviteUserModal: async function() {
        await this.loadRolesData();
        const roles = Object.keys(this.state.rolesData.roles || {
            'System Admin': {}, 'Database Admin': {}, 'Network Engineer': {}, 'App Developer': {}, 'Security Auditor (Least Privilege)': {}
        });

        const email = prompt("Enter User Email Address:");
        if (!email) return;
        const name = prompt("Enter User Full Name:", email.split('@')[0].replace('.', ' ').toUpperCase());
        if (!name) return;

        const roleOptions = roles.join('\n');
        const role = prompt(`Choose an Assigned Role:\n\n${roleOptions}`, "Security Auditor (Least Privilege)");
        if (!role) return;

        try {
            const res = await fetch('/api/onboarding/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, role })
            });
            const result = await res.json();
            if (res.ok) {
                alert(`✅ Invitation Dispatched!\n\nEmail: ${email}\nAssigned Role: ${role}\nTemporary Password: ${result.user.temp_password}\n\nCredentials logged to Smart Outbox.`);
                this.loadOnboardingData();
            } else {
                alert(result.error || 'Failed to invite user');
            }
        } catch (e) {
            alert('Error dispatching invite');
        }
    },

    resendInvite: async function(email) {
        if (!confirm(`Resend invite and generate a new temporary password for ${email}?`)) return;
        try {
            const res = await fetch('/api/onboarding/resend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const result = await res.json();
            if (res.ok) {
                alert(`✅ New temporary credentials sent to ${email}!\n\nNew Temporary Password: ${result.temp_password}`);
                this.loadOnboardingData();
            } else {
                alert(result.error || 'Failed to resend invite');
            }
        } catch (e) {
            alert('Error resending invite');
        }
    },

    revokeUserAccess: async function(email) {
        if (!confirm(`Revoke and lock access for ${email}?`)) return;
        try {
            const res = await fetch('/api/onboarding/revoke', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (res.ok) {
                alert(`User ${email} access has been revoked.`);
                this.loadOnboardingData();
            }
        } catch (e) {
            alert('Error revoking user');
        }
    },

    openCreateRoleModal: function() {
        const name = prompt("Enter Custom Role Name (e.g. Cloud Security Specialist):");
        if (!name) return;
        const desc = prompt("Enter Role Description:", "Custom defined privileged role");
        
        // Least privilege vs Full privilege preset selection
        const choice = prompt("Select Permissions Preset:\n1 = Full Privileges (*)\n2 = Least Privilege (View Dashboard + Ping only)\n3 = Database Specialist (db:*)\n4 = Network Specialist (net:*)\n\nEnter 1, 2, 3, or 4:", "2");

        let perms = ["admin:dashboard", "net:ping"];
        if (choice === "1") perms = ["*"];
        else if (choice === "3") perms = ["db:connect", "db:query", "db:backup", "net:ping"];
        else if (choice === "4") perms = ["net:ssh", "net:ping", "net:firewall"];

        this.saveRoleAction({ name, description: desc, permissions: perms });
    },

    openEditRoleModal: function(roleName) {
        const role = this.state.rolesData.roles[roleName];
        if (!role) return;

        const newDesc = prompt(`Update Description for ${roleName}:`, role.description || '');
        const currentPermsStr = role.permissions.join(', ');
        const newPermsStr = prompt(`Update Granular Permissions (comma-separated or *):\nAvailable: db:connect, db:query, db:backup, db:delete, net:ssh, net:ping, net:firewall, net:shutdown, app:server, app:deploy, app:git, app:iam, app:rmrf, admin:dashboard, admin:onboarding, admin:roles`, currentPermsStr);

        if (newPermsStr !== null) {
            const perms = newPermsStr.split(',').map(p => p.trim()).filter(Boolean);
            this.saveRoleAction({ name: roleName, description: newDesc, permissions: perms });
        }
    },

    saveRoleAction: async function(roleData) {
        try {
            const res = await fetch('/api/roles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(roleData)
            });
            if (res.ok) {
                alert(`Role '${roleData.name}' configured successfully!`);
                this.loadRolesData();
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to save role');
            }
        } catch (e) {
            alert('Error saving role');
        }
    },

    deleteCustomRole: async function(roleName) {
        if (!confirm(`Delete custom role '${roleName}'?`)) return;
        try {
            const res = await fetch(`/api/roles/${encodeURIComponent(roleName)}`, { method: 'DELETE' });
            if (res.ok) {
                alert(`Role '${roleName}' deleted.`);
                this.loadRolesData();
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to delete role');
            }
        } catch (e) {
            alert('Error deleting role');
        }
    },

    resetSessionAccess: async function(sessionId) {
        try {
            const res = await fetch(`/api/reset_session/${sessionId}`, { method: 'POST' });
            if (res.ok) {
                alert('Session access restored & strikes cleared!');
                this.fetchDashboardData();
            }
        } catch (e) {
            alert('Error restoring session');
        }
    },

    runThreatSimulation: async function(scenarioId, action, payload) {
        try {
            const res = await fetch('/api/simulate_event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scenario: scenarioId, action: action, details: payload })
            });
            const result = await res.json();
            if (!res.ok) {
                alert('Simulation Error: ' + (result.error || 'Failed to simulate scenario'));
                return;
            }

            const riskScore = result.risk_score !== undefined ? result.risk_score : (result.event ? result.event.riskScore : 'N/A');
            let reasonsText = 'None';
            if (Array.isArray(result.anomaly_reasons) && result.anomaly_reasons.length > 0) {
                reasonsText = result.anomaly_reasons.join('\n• ');
            } else if (result.event && Array.isArray(result.event.anomalyReasons) && result.event.anomalyReasons.length > 0) {
                reasonsText = result.event.anomalyReasons.join('\n• ');
            }

            const strikes = result.strike_count !== undefined ? `${result.strike_count}/3 Strikes` : '';
            const statusMsg = result.revoked ? '\n\n🚨 CRITICAL ALERT: Portal Access Revoked (Max strikes reached)!' : '';

            alert(`✅ Threat Simulation Executed!\n\nAction: ${action || result.action || 'Unknown'}\nRisk Score: ${riskScore}\nStrikes: ${strikes}\n\nAnomaly Flags:\n• ${reasonsText}${statusMsg}`);
            this.fetchDashboardData();
        } catch (e) {
            console.error('Simulation error:', e);
            alert('Error executing simulation: ' + (e.message || e));
        }
    },

    loadUsersList: async function() {
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                this.state.usersList = await res.json();
                if (this.state.currentPage === 'users') this.render();
            }
        } catch (e) {}
    },

    openAddUserModal: function() {
        const name = prompt("Enter User Full Name:");
        if (!name) return;
        const email = prompt("Enter User Email:");
        if (!email) return;
        const role = prompt("Enter Role (System Admin, Database Admin, Network Engineer, App Developer):", "Database Admin");
        if (!role) return;
        this.saveUserAction('add', { name, email, role });
    },

    editUser: function(email, currentName, currentRole) {
        const name = prompt("Update Name:", currentName);
        if (!name) return;
        const role = prompt("Update Role:", currentRole);
        if (!role) return;
        this.saveUserAction('update', { email, name, role });
    },

    deleteUser: function(email) {
        if (!confirm(`Remove user ${email}?`)) return;
        this.saveUserAction('delete', { email });
    },

    saveUserAction: async function(action, userData) {
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, ...userData })
            });
            const result = await res.json();
            if (!res.ok) {
                alert('User action failed: ' + (result.error || 'Unknown error occurred'));
                return;
            }
            await this.loadUsersList();
            this.render();
        } catch (e) {
            console.error('Error saving user action:', e);
            alert('Error updating user registry: ' + (e.message || e));
        }
    },

    loadSettings: async function() {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                this.state.settings = await res.json();
                this.state.thresholds = this.state.settings.risk_thresholds;
                if (this.state.currentPage === 'settings') this.render();
            }
        } catch (e) {}
    },

    handleSettingsSubmit: async function(e) {
        e.preventDefault();
        const medium = parseInt(document.getElementById('setting-medium').value);
        const high = parseInt(document.getElementById('setting-high').value);
        const critical = parseInt(document.getElementById('setting-critical').value);

        const smtpServer = document.getElementById('setting-smtp-server') ? document.getElementById('setting-smtp-server').value.trim() : 'smtp.gmail.com';
        const smtpPort = document.getElementById('setting-smtp-port') ? parseInt(document.getElementById('setting-smtp-port').value) : 587;
        const smtpUser = document.getElementById('setting-smtp-user') ? document.getElementById('setting-smtp-user').value.trim() : '';
        const smtpPw = document.getElementById('setting-smtp-pw') ? document.getElementById('setting-smtp-pw').value : '';

        const newSettings = {
            ...this.state.settings,
            risk_thresholds: { medium, high, critical },
            smtp: {
                enabled: true,
                server: smtpServer,
                port: smtpPort,
                user: smtpUser,
                password: smtpPw,
                from_name: 'SecureSafe PAM Administration'
            }
        };

        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSettings)
            });
            if (res.ok) {
                alert('Policy & SMTP settings saved successfully!');
                this.loadSettings();
            }
        } catch (e) {
            alert('Error saving settings');
        }
    },

    testSmtpDelivery: async function() {
        const testRecipient = prompt("Enter email address to send test message to (supports plus-addressing e.g. user+test@gmail.com):", "wikzpoorna@gmail.com");
        if (!testRecipient) return;

        try {
            const res = await fetch('/api/send-test-alert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipient: testRecipient })
            });
            const result = await res.json();
            if (res.ok) {
                alert(`Real Email Test Dispatched!\n\n${result.results ? result.results.join('\n') : 'Dispatched to inbox.'}\n\nCheck your email inbox or spam folder!`);
                this.loadOnboardingData();
            } else {
                alert(result.error || 'Failed to dispatch test email');
            }
        } catch (e) {
            alert('Error testing SMTP delivery');
        }
    },

    downloadActivityReport: function() {
        const btn = event.currentTarget;
        const origHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Generating...</span>';
        btn.disabled = true;

        fetch('/api/download-activity-report')
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        try {
                            const err = JSON.parse(text);
                            throw new Error(err.error || 'Download failed');
                        } catch(e) {
                            if (e.message && !e.message.includes('Unexpected token')) throw e;
                            throw new Error('Server error (' + response.status + '). Please check server logs.');
                        }
                    });
                }
                const disposition = response.headers.get('Content-Disposition');
                let filename = 'PAM_Full_Activity_Report.xlsx';
                if (disposition && disposition.includes('filename=')) {
                    filename = disposition.split('filename=')[1].replace(/"/g, '');
                }
                return response.blob().then(blob => ({ blob, filename }));
            })
            .then(({ blob, filename }) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
                btn.innerHTML = '<i class="fas fa-check text-green-300"></i><span>Downloaded!</span>';
                setTimeout(() => { btn.innerHTML = origHTML; btn.disabled = false; }, 2500);
            })
            .catch(err => {
                alert('Report download failed: ' + err.message);
                btn.innerHTML = origHTML;
                btn.disabled = false;
            });
    },

    exportLogsZip: function() {
        window.location.href = '/api/export-logs';
    },

    toggleRefresh: function() {
        this.state.refreshPaused = !this.state.refreshPaused;
        this.render();
    },

    manualRefresh: function() {
        this.fetchDashboardData();
        this.render();
    },

    addEventListeners: function() {
        document.querySelectorAll('.sidebar-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                this.state.currentPage = e.currentTarget.dataset.page;
                this.render();
            });
        });
    },

    init: function() {
        this.render();
        this.loadSettings();
        this.fetchDashboardData();
        this.state.dataFetchInterval = setInterval(() => this.fetchDashboardData(), 4000);
    }
};

if (document.getElementById('app-container')) {
    App.init();
}