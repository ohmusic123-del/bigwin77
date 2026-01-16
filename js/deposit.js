// Set quick amount
function setAmount(value) {
    document.getElementById("amount").value = value;
}

// Enhanced deposit function
async function deposit() {
    try {
        const amount = Number(document.getElementById("amount").value);
        
        // Validation
        if (!amount || amount < 100) {
            alert("Minimum deposit is ₹100");
            return;
        }
        
        // Show loading
        const button = document.querySelector('button[onclick="deposit()"]');
        const originalText = button.textContent;
        button.textContent = 'Processing...';
        button.disabled = true;
        
        // Make API call using apiCall wrapper
        const result = await apiCall('/deposit', {
            method: 'POST',
            body: JSON.stringify({ amount })
        });
        
        // Show success
        alert(`Deposit successful! ₹${amount} added to your wallet.`);
        
        // Clear input
        document.getElementById("amount").value = '';
        
        // Redirect to wallet or reload wallet data
        if (typeof loadWalletData === 'function') {
            await loadWalletData();
        } else {
            window.location.href = 'wallet.html';
        }
        
    } catch (error) {
        console.error('Deposit error:', error);
        // Error already shown by apiCall wrapper
    } finally {
        // Restore button
        const button = document.querySelector('button[onclick="deposit()"]');
        if (button) {
            button.textContent = 'Proceed Deposit';
            button.disabled = false;
        }
    }
}

// Load deposit history if on deposit-history page
async function loadDepositHistory() {
    try {
        const data = await apiCall('/wallet/deposit-history');
        
        const container = document.getElementById('depositHistory');
        if (!container) return;
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p class="empty">No deposits found</p>';
            return;
        }
        
        container.innerHTML = data.map(deposit => `
            <div class="history-item">
                <div>
                    <strong>Deposit</strong>
                    <div class="date">${new Date(deposit.createdAt).toLocaleString()}</div>
                </div>
                <div class="amount ${deposit.status.toLowerCase()}">
                    ₹${deposit.amount}
                    <div class="status">${deposit.status}</div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Load deposit history error:', error);
        const container = document.getElementById('depositHistory');
        if (container) {
            container.innerHTML = '<p class="error">Failed to load deposit history</p>';
        }
    }
}

// Auto-load history if on deposit-history page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('depositHistory')) {
        loadDepositHistory();
    }
});

// Expose functions globally
window.setAmount = setAmount;
window.deposit = deposit;
