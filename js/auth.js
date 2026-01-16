const API = "https://color-game-backend1.onrender.com";

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const currentPage = window.location.pathname;
    
    // Pages that don't require authentication
    const publicPages = ['index.html', 'admin-login.html'];
    const isPublicPage = publicPages.some(page => currentPage.includes(page));
    
    // If no token and not on public page, redirect to login
    if (!token && !isPublicPage) {
        window.location.href = 'index.html';
        return;
    }
    
    // If has token and on login page, redirect to home
    if (token && currentPage.includes('index.html')) {
        window.location.href = 'home.html';
    }
});

// Enhanced login function
async function login(mobile, password) {
    if (!mobile || !password) {
        throw new Error('Mobile and password required');
    }
    
    try {
        const response = await fetch(`${API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        
        // Store token
        localStorage.setItem('token', data.token);
        
        // Redirect to home
        window.location.href = 'home.html';
        
        return data;
        
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Enhanced register function
async function register(mobile, password, referralCode = '') {
    if (!mobile || !password) {
        throw new Error('Mobile and password required');
    }
    
    try {
        const payload = { mobile, password };
        if (referralCode) {
            payload.referralCode = referralCode;
        }
        
        const response = await fetch(`${API}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }
        
        return data;
        
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// Admin logout
function adminLogout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'admin-login.html';
}

// Expose functions globally
window.login = login;
window.register = register;
window.logout = logout;
window.adminLogout = adminLogout;
