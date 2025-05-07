// Authentication state management
const auth = {
    // Check if user is logged in
    isLoggedIn: function() {
        return localStorage.getItem('currentUser') !== null;
    },
    
    // Get current user
    getCurrentUser: function() {
        return JSON.parse(localStorage.getItem('currentUser'));
    },
    
    // Logout user
    logout: function() {
        localStorage.removeItem('currentUser');
        window.location.reload();
    },
    
    // Update UI based on auth state
    updateAuthUI: function() {
        const loginLink = document.querySelector('a[data-bs-toggle="modal"][data-bs-target="#loginModal"]');
        const currentUser = this.getCurrentUser();
        
        if (currentUser && loginLink) {
            // Replace login link with user dropdown
            const parentElement = loginLink.parentElement;
            parentElement.innerHTML = `
            <div class="dropdown">
                <a class="text-white text-decoration-none fs-8 px-2 dropdown-toggle" href="#" role="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    ${currentUser.name}
                </a>
                <ul class="dropdown-menu" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" href="#">My Account</a></li>
                    <li><a class="dropdown-item" href="#">My Orders</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" id="logoutLink">Logout</a></li>
                </ul>
            </div>
            `;
            
            // Add event listener for logout
            document.getElementById('logoutLink')?.addEventListener('click', function(e) {
                e.preventDefault();
                auth.logout();
            });
        }
    }
};

// Initialize auth state when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    auth.updateAuthUI();
});