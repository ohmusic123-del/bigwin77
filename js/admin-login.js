// admin-login.js - Admin Login Logic
const API = "https://color-game-backend1.onrender.com";

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin login page loaded');
    
    // Check if already logged in
    checkAdminSession();
    
    // Setup form submission
    setupLoginForm();
    
    // Setup enter key submission
    setupEnterKey();
});

// Check if admin is already logged in
function checkAdminSession() {
    const token = localStorage.getItem('adminToken');
    if (token) {
        // Verify token is valid
        try {
            // Simple check - in production, you might want to verify with backend
            window.location.href = 'admin.html';
        } catch (error) {
            localStorage.removeItem('adminToken');
        }
    }
}

// Setup login form
function setupLoginForm() {
    const loginBtn = document.querySelector('button[onclick="adminLogin()"]');
    if (loginBtn) {
        loginBtn.addEventListener('click', adminLogin);
    }
}

// Setup enter key to submit
function setupEnterKey() {
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            adminLogin();
        }
    });
}

// Admin login function
async function adminLogin() {
    try {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const errorEl = document.getElementById('error');
        
        // Clear previous errors
        errorEl.textContent = '';
        
        // Validation
        if (!username || !password) {
            showError('Please enter both username and password');
            return;
        }
        
        // Show loading
        const button = document.querySelector('button[onclick="adminLogin()"]');
        const originalText = button.textContent;
        button.textContent = 'Logging in...';
        button.disabled = true;
        
        // Make API call
        const response = await fetch(`${API}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Invalid credentials');
        }
        
        // Store admin token
        localStorage.setItem('adminToken', data.token);
        
        // Show success
        showSuccess('Login successful! Redirecting...');
        
        // Redirect to admin panel
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
        
    } catch (error) {
        console.error('Admin login error:', error);
        showError(error.message || 'Login failed. Please try again.');
        
        // Restore button
        const button = document.querySelector('button[onclick="adminLogin()"]');
        if (button) {
            button.textContent = 'Login';
            button.disabled = false;
        }
    }
}

// Show error message
function showError(message) {
    const errorEl = document.getElementById('error');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.color = '#ef4444';
        
        // Add shake animation to inputs
        document.getElementById('username').classList.add('shake');
        document.getElementById('password').classList.add('shake');
        
        setTimeout(() => {
            document.getElementById('username').classList.remove('shake');
            document.getElementById('password').classList.remove('shake');
        }, 300);
    }
}

// Show success message
function showSuccess(message) {
    const errorEl = document.getElementById('error');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.color = '#22c55e';
    }
}

// Expose function globally
window.adminLogin = adminLogin;
