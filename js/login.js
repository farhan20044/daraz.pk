// Show modal after 1 second
setTimeout(() => {
  const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
  loginModal.show();
}, 1000);

document.addEventListener('DOMContentLoaded', function() {
  // Get the login link and add click event listener
  const loginLink = document.querySelector('a[data-bs-toggle="modal"][data-bs-target="#loginModal"]');
  
  // Create the login modal if it doesn't exist
  if (!document.getElementById('loginModal')) {
      createLoginModal();
  }
  
  // Add event listener to the login form
  document.addEventListener('submit', handleLoginSubmit);
  
  // Function to create the login modal
  function createLoginModal() {
      const modalHTML = `
      <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header bg-orange text-white">
                      <h5 class="modal-title" id="loginModalLabel">Login to Daraz</h5>
                      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <div id="loginAlert" class="alert d-none" role="alert"></div>
                      <form id="loginForm">
                          <div class="mb-3">
                              <label for="email" class="form-label">Email</label>
                              <input type="email" class="form-control" id="email" name="email" required>
                          </div>
                          <div class="mb-3">
                              <label for="password" class="form-label">Password</label>
                              <div class="input-group">
                                  <input type="password" class="form-control" id="password" name="password" required>
                                  <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                                      <i class="bi bi-eye"></i>
                                  </button>
                              </div>
                          </div>
                          <div class="d-flex justify-content-between align-items-center mb-3">
                              <div class="form-check">
                                  <input type="checkbox" class="form-check-input" id="rememberMe">
                                  <label class="form-check-label" for="rememberMe">Remember me</label>
                              </div>
                              <a href="#" class="text-decoration-none">Forgot Password?</a>
                          </div>
                          <button type="submit" class="btn btn-orange w-100">Login</button>
                      </form>
                      <div class="text-center mt-3">
                          <p>Don't have an account? <a href="#" class="text-decoration-none">Sign up</a></p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      `;
      
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      
      // Add event listener for password toggle
      const togglePassword = document.getElementById('togglePassword');
      if (togglePassword) {
          togglePassword.addEventListener('click', function() {
              const passwordInput = document.getElementById('password');
              const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
              passwordInput.setAttribute('type', type);
              this.innerHTML = type === 'password' ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
          });
      }
  }
  
  // Function to handle login form submission
  function handleLoginSubmit(event) {
      if (event.target && event.target.id === 'loginForm') {
          event.preventDefault();
          
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          const alertElement = document.getElementById('loginAlert');
          
          // Show loading state
          const submitButton = event.target.querySelector('button[type="submit"]');
          const originalButtonText = submitButton.innerHTML;
          submitButton.innerHTML = 'Logging in...';
          submitButton.disabled = true;
          
          // Fetch login API
          fetch('https://68196ebd1ac115563504d21d.mockapi.io/api/v1/login')
              .then(response => {
                  if (!response.ok) {
                      throw new Error('Network response was not ok');
                  }
                  return response.json();
              })
              .then(users => {
                  // Reset button state
                  submitButton.innerHTML = originalButtonText;
                  submitButton.disabled = false;
                  
                  // Find user with matching email and password
                  const user = users.find(user => user.email === email && user.password === password);
                  
                  if (user) {
                      // Successful login
                      alertElement.className = 'alert alert-success';
                      alertElement.textContent = 'Login successful!';
                      alertElement.classList.remove('d-none');
                      
                      // Store user info in localStorage
                      localStorage.setItem('currentUser', JSON.stringify({
                          id: user.id,
                          email: user.email,
                          name: user.name || email.split('@')[0]
                      }));
                      
                      // Close modal after 1 second
                      setTimeout(() => {
                          const loginModalElement = document.getElementById('loginModal');
                          const modal = bootstrap.Modal.getInstance(loginModalElement);
                          if (modal) {
                              modal.hide();
                          }
                          
                          // Update UI to show logged in state
                          updateUIForLoggedInUser();
                      }, 1000);
                  } else {
                      // Failed login
                      alertElement.className = 'alert alert-danger';
                      alertElement.textContent = 'Incorrect email or password. Please try again.';
                      alertElement.classList.remove('d-none');
                  }
              })
              .catch(error => {
                  // Reset button state
                  submitButton.innerHTML = originalButtonText;
                  submitButton.disabled = false;
                  
                  // Show error
                  alertElement.className = 'alert alert-danger';
                  alertElement.textContent = 'Error connecting to the server. Please try again later.';
                  alertElement.classList.remove('d-none');
                  console.error('Login error:', error);
              });
      }
  }
  
  // Function to update UI for logged in user
  function updateUIForLoggedInUser() {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser) {
          // Update login link to show user name
          if (loginLink) {
              loginLink.textContent = currentUser.name;
              loginLink.removeAttribute('data-bs-toggle');
              loginLink.removeAttribute('data-bs-target');
              
              // Add dropdown for logout
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
              document.getElementById('logoutLink').addEventListener('click', function(e) {
                  e.preventDefault();
                  localStorage.removeItem('currentUser');
                  window.location.reload();
              });
          }
      }
  }
  
  // Check if user is already logged in
  updateUIForLoggedInUser();
});