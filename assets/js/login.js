// Show modal after 1 second
setTimeout(() => {
  const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
  loginModal.show();
}, 1000);

// Hardcoded credentials
const validEmail = "chtahaamir757@gmail.com";
const validPhone = "3154645150";
const validPassword = "taha0000";

// Event listener for login button
document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.querySelector("#password .btn");
  const phoneLoginBtn = document.querySelector("#phone .codeSender-button");

  loginBtn.addEventListener("click", function () {
    const emailOrPhone = document
      .querySelector("#password input[type='email']")
      .value.trim();
    const password = document
      .querySelector("#password input[type='password']")
      .value.trim();

    if (
      (emailOrPhone === validEmail || emailOrPhone === validPhone) &&
      password === validPassword
    ) {
      window.location.href = "homepage.html";
    } else {
      alert("Invalid credentials");
    }
  });

  phoneLoginBtn.addEventListener("click", function () {
    const phoneCode = document
      .querySelector("#phone .country-code")
      .value.replace("PK+", "")
      .trim();
    const phoneNumber = document
      .querySelector("#phone input:not(.country-code)")
      .value.trim();

    const fullPhone = phoneNumber; // Simplified check without +92

    if (fullPhone === validPhone) {
      window.location.href = "./homepage.html";
    } else {
      alert("Invalid credentials");
    }
  });
});
