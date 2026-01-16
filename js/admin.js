// admin.js - Complete Admin Panel Logic
const API = "https://color-game-backend1.onrender.com";

// Global variables
let currentDeposits = [];
let currentWithdrawals = [];
let currentUsers = [];
let currentTransactions = [];

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin panel initializing...');
    
    // Check admin authentication
    checkAdminAuth();
    
    // Setup tab switching
    setupTabs();
    
    // Setup filter tabs
    setupFilters();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load initial data
    loadDashboardStats();
    loadRecentActivity();
    
    console.log('Admin panel initialized');
});

// Check if admin is logged in
function checkAdminAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        console.log('No admin token found, redirecting to login');
        window.location.href = 'admin-login.html';
    }
}

// Setup tab switching
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabName) {
                    content.classList.add('active');
                }
            });
            
            // Load data for the tab
            switch(tabName) {
                case 'dashboard':
                    loadDashboardStats();
                    loadRecentActivity();
                    break;
                case 'users':
                    loadUsers();
                    break;
                case 'deposits':
                    loadDeposits();
                    break;
                case 'withdrawals':
                    loadWithdrawals();
                    break;
                case 'transactions':
                    loadTransactions();
                    break;
                case 'settings':
                    loadSettings();
                    break;
            }
        });
    });
}

// Setup filter tabs
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            const parent = this.closest('.filter-tabs');
            
            // Update active filter
            parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filter
            const activeTab = document.querySelector('.tab-content.active').id;
            switch(activeTab) {
                case 'deposits':
                    filterDeposits(filter);
                    break;
                case 'withdrawals':
                    filterWithdrawals(filter);
                    break;
                case 'transactions':
                    filterTransactions(filter);
                    break;
            }
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search input for users
    const userSearch = document.getElementById('userSearch');
    if (userSearch) {
        userSearch.addEventListener('input', function() {
            searchUsers(this.value);
        });
    }
    
    // Refresh button
    const refreshBtn = document.querySelector('[onclick="refreshStats()"]');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshStats);
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminToken');
        window.location.href = 'admin-login.html';
    }
}

// Load dashboard stats
async function loadDashboardStats() {
    try {
        showLoading('dashboard');
        
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API}/admin/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 401) {
            logout();
            return;
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Update stats - Match field names with backend
        document.getElementById('totalUsers').textContent = data.users || data.totalUsers || 0;
        document.getElementById('totalDeposits').textContent = formatCurrency(data.deposits || data.totalDeposits || 0);
        document.getElementById('totalWithdrawals').textContent = formatCurrency(data.withdrawals || data.totalWithdrawals || 0);
        document.getElementById('totalWallet').textContent = formatCurrency(data.wallet || data.totalWallet || 0);
        document.getElementById('totalProfit').textContent = formatCurrency(data.profit || data.totalProfit || 0);
        document.getElementById('totalRounds').textContent = data.rounds || data.totalRounds || 0;
        
        hideLoading('dashboard');
        
    } catch (error) {
        console.error('Load dashboard stats error:', error);
        showError('dashboard', 'Failed to load dashboard stats');
    }
}

// Load recent activity
async function loadRecentActivity() {
    try {
        showLoading('activity');
        
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API}/admin/recent-activity`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        const container = document.getElementById('recentActivity');
        
        if (!data || data.length === 0) {
            container.innerHTML = '<div class="empty">No recent activity</div>';
            return;
        }
        
        container.innerHTML = data.map(item => `
            <div class="activity-item">
                <div class="activity-type">${item.type}</div>
                <div class="activity-user">${item.user}</div>
                <div class="activity-amount">${formatCurrency(item.amount)}</div>
                <div class="activity-time">${formatTime(item.time)}</div>
            </div>
        `).join('');
        
        hideLoading('activity');
        
    } catch (error) {
        console.error('Load recent activity error:', error);
        showError('activity', 'Failed to load activity');
    }
}

// Load users
async function loadUsers() {
    try {
        showLoading('users');
        
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API}/admin/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        currentUsers = data;
        const container = document.getElementById('usersList');
        
        if (!data || data.length === 0) {
            container.innerHTML = '<div class="empty">No users found</div>';
            return;
        }
        
        container.innerHTML = data.map(user => `
            <div class="user-row">
                <div>
                    <strong>${user.mobile}</strong>
                    <div class="user-meta">
                        Joined: ${formatDate(user.createdAt)} | 
                        Wallet: ${formatCurrency(user.wallet)} | 
                        Bonus: ${formatCurrency(user.bonus)} | 
                        Wagered: ${formatCurrency(user.totalWagered)}
                    </div>
                    <div class="user-meta">
                        Referrals: ${user.totalReferrals || 0} | 
                        Code: ${user.referralCode || 'N/A'}
                    </div>
                </div>
                <div class="user-actions">
                    <button onclick="editUserBalance('${user.mobile}')" class="btn-small">Edit Balance</button>
                    <button onclick="viewUserDetails('${user.mobile}')" class="btn-small">Details</button>
                    ${user.banned ? 
                        '<button onclick="unbanUser(\'' + user.mobile + '\')" class="btn-small btn-danger-small">Unban</button>' : 
                        '<button onclick="banUser(\'' + user.mobile + '\')" class="btn-small btn-danger-small">Ban</button>'
                    }
                </div>
            </div>
        `).join('');
        
        hideLoading('users');
        
    } catch (error) {
        console.error('Load users error:', error);
        showError('users', 'Failed to load users');
    }
}

// Load deposits
async function loadDeposits() {
    try {
        showLoading('deposits');
        
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API}/admin/deposits`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        currentDeposits = data;
        const container = document.getElementById('depositsList');
        
        if (!data || data.length === 0) {
            container.innerHTML = '<div class="empty">No deposits found</div>';
            return;
        }
        
        container.innerHTML = data.map(deposit => `
            <div class="deposit-row ${deposit.status}">
                <div>
                    <strong>${deposit.mobile}</strong>
                    <div class="deposit-meta">
                        ${formatDateTime(deposit.createdAt)}
                        ${deposit.referenceId ? ` | Ref: ${deposit.referenceId}` : ''}
                        ${deposit.method ? ` | Method: ${deposit.method.toUpperCase()}` : ''}
                    </div>
                    ${deposit.adminNote ? `<div class="deposit-note">Note: ${deposit.adminNote}</div>` : ''}
                </div>
                <div class="deposit-info">
                    <div class="deposit-amount">${formatCurrency(deposit.amount)}</div>
                    <div class="deposit-status ${deposit.status}">${deposit.status}</div>
                    ${deposit.status === 'PENDING' ? `
                        <div class="deposit-actions">
                            <button onclick="approveDeposit('${deposit._id}')" class="btn-success">Approve</button>
                            <button onclick="rejectDeposit('${deposit._id}')" class="btn-danger">Reject</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
        
        hideLoading('deposits');
        
    } catch (error) {
        console.error('Load deposits error:', error);
        showError('deposits', 'Failed to load deposits');
    }
}

// Load withdrawals
async function loadWithdrawals() {
    try {
        showLoading('withdrawals');
        
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API}/admin/withdraws`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        currentWithdrawals = data;
        const container = document.getElementById('withdrawalsList');
        
        if (!data || data.length === 0) {
            container.innerHTML = '<div class="empty">No withdrawals found</div>';
            return;
        }
        
        container.innerHTML = data.map(withdrawal => `
            <div class="withdrawal-row ${withdrawal.status}">
                <div>
                    <strong>${withdrawal.mobile}</strong>
                    <div class="withdrawal-meta">
                        ${formatDateTime(withdrawal.createdAt)}
                        ${withdrawal.method ? ` | ${withdrawal.method.toUpperCase()}` : ''}
                        ${withdrawal.processedAt ? ` | Processed: ${formatDateTime(withdrawal.processedAt)}` : ''}
                    </div>
                    ${withdrawal.details ? `
                        <div class="withdrawal-details">
                            ${withdrawal.details.upiId ? `UPI: ${withdrawal.details.upiId}` : ''}
                            ${withdrawal.details.accountNumber ? `Account: ${withdrawal.details.accountNumber.slice(-4)}` : ''}
                            ${withdrawal.details.bankName ? ` | ${withdrawal.details.bankName}` : ''}
                        </div>
                    ` : ''}
                    ${withdrawal.adminNote ? `<div class="withdrawal-note">Note: ${withdrawal.adminNote}</div>` : ''}
                </div>
                <div class="withdrawal-info">
                    <div class="withdrawal-amount">${formatCurrency(withdrawal.amount)}</div>
                    <div class="withdrawal-status ${withdrawal.status}">${withdrawal.status}</div>
                    ${withdrawal.status === 'PENDING' ? `
                        <div class="withdrawal-actions">
                            <button onclick="approveWithdrawal('${withdrawal._id}')" class="btn-success">Approve</button>
                            <button onclick="rejectWithdrawal('${withdrawal._id}')" class="btn-danger">Reject</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
        
        hideLoading('withdrawals');
        
    } catch (error) {
        console.error('Load withdrawals error:', error);
        showError('withdrawals', 'Failed to load withdrawals');
    }
}

// Load transactions
async function loadTransactions() {
    try {
        showLoading('transactions');
        
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API}/admin/transactions`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        currentTransactions = data;
        const container = document.getElementById('transactionsList');
        
        if (!data || data.length === 0) {
            container.innerHTML = '<div class="empty">No transactions found</div>';
            return;
        }
        
        container.innerHTML = data.map(transaction => `
            <div class="transaction-row ${transaction.type}">
                <div>
                    <strong>${transaction.mobile}</strong>
                    <div class="transaction-meta">
                        ${formatDateTime(transaction.createdAt)}
                        | ${transaction.type ? transaction.type.toUpperCase() : 'TRANSACTION'}
                        ${transaction.roundId ? ` | Round: ${transaction.roundId.substring(0, 8)}` : ''}
                    </div>
                    ${transaction.color ? `<div class="transaction-details">Color: ${transaction.color.toUpperCase()}</div>` : ''}
                </div>
                <div class="transaction-info">
                    <div class="transaction-amount ${transaction.type === 'withdraw' ? 'text-red' : 'text-green'}">
                        ${transaction.type === 'withdraw' ? '-' : '+'}${formatCurrency(transaction.amount)}
                    </div>
                    <div class="transaction-status ${transaction.status || 'COMPLETED'}">
                        ${transaction.status || 'COMPLETED'}
                    </div>
                </div>
            </div>
        `).join('');
        
        hideLoading('transactions');
        
    } catch (error) {
        console.error('Load transactions error:', error);
        showError('transactions', 'Failed to load transactions');
    }
}

// Load settings
async function loadSettings() {
    try {
        showLoading('settings');
        
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API}/admin/settings`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        // Populate settings form
        document.getElementById('minBet').value = data.minBet || 1;
        document.getElementById('maxBet').value = data.maxBet || 10000;
        document.getElementById('houseEdge').value = data.houseEdge || 2;
        document.getElementById('minDeposit').value = data.minDeposit || 100;
        document.getElementById('minWithdraw').value = data.minWithdraw || 100;
        document.getElementById('upiId').value = data.upiId || '';
        document.getElementById('bonusPercent').value = data.bonusPercent || 100;
        
        hideLoading('settings');
        
    } catch (error) {
        console.error('Load settings error:', error);
        showError('settings', 'Failed to load settings');
    }
}

// Approve deposit
async function approveDeposit(depositId) {
    if (!confirm('Approve this deposit?')) return;
    
    try {
        const token = localStorage.getItem('adminToken');
        const note = prompt('Add admin note (optional):', 'Approved');
        
        const response = await fetch(`${API}/admin/deposit/${depositId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                action: 'approve', 
                adminNote: note || 'Approved by admin' 
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        alert('Deposit approved successfully!');
        loadDeposits();
        loadDashboardStats(); // Refresh stats
        
    } catch (error) {
        console.error('Approve deposit error:', error);
        alert('Failed to approve deposit: ' + error.message);
    }
}

// Reject deposit
async function rejectDeposit(depositId) {
    if (!confirm('Reject this deposit?')) return;
    
    try {
        const token = localStorage.getItem('adminToken');
        const note = prompt('Add admin note (optional):', 'Rejected');
        
        const response = await fetch(`${API}/admin/deposit/${depositId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                action: 'reject', 
                adminNote: note || 'Rejected by admin' 
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        alert('Deposit rejected!');
        loadDeposits();
        
    } catch (error) {
        console.error('Reject deposit error:', error);
        alert('Failed to reject deposit: ' + error.message);
    }
}

// Approve withdrawal
async function approveWithdrawal(withdrawalId) {
    if (!confirm('Approve this withdrawal?')) return;
    
    try {
        const token = localStorage.getItem('adminToken');
        const note = prompt('Add admin note
