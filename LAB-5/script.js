// Select DOM elements
const form = document.getElementById("registrationForm");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const phone = document.getElementById("phone");
const successMessage = document.getElementById("successMessage");

// Error message containers
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const phoneError = document.getElementById("phoneError");

// Validation functions
function validateName() {
  if (fullName.value.trim() === "") {
    setError(fullName, nameError, "Full name is required");
    return false;
  } else {
    setSuccess(fullName, nameError);
    return true;
  }
}

function validateEmail() {
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (email.value.trim() === "") {
    setError(email, emailError, "Email is required");
    return false;
  } else if (!emailPattern.test(email.value)) {
    setError(email, emailError, "Enter a valid email address");
    return false;
  } else {
    setSuccess(email, emailError);
    return true;
  }
}

function validatePassword() {
  const pass = password.value;
  const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  if (pass.trim() === "") {
    setError(password, passwordError, "Password is required");
    return false;
  } else if (!strongPassword.test(pass)) {
    setError(password, passwordError, "Password must be at least 8 characters and include upper, lower, number, and special character");
    return false;
  } else {
    setSuccess(password, passwordError);
    return true;
  }
}

function validatePhone() {
  const phonePattern = /^[0-9]{10}$/;
  if (phone.value.trim() === "") {
    setError(phone, phoneError, "Phone number is required");
    return false;
  } else if (!phonePattern.test(phone.value)) {
    setError(phone, phoneError, "Enter a valid 10-digit phone number");
    return false;
  } else {
    setSuccess(phone, phoneError);
    return true;
  }
}

// Utility functions
function setError(input, errorField, message) {
  input.classList.add("error");
  input.classList.remove("valid");
  errorField.textContent = message;
}

function setSuccess(input, errorField) {
  input.classList.remove("error");
  input.classList.add("valid");
  errorField.textContent = "";
}

// Real-time validation
fullName.addEventListener("input", validateName);
email.addEventListener("input", validateEmail);
password.addEventListener("input", validatePassword);
phone.addEventListener("input", validatePhone);

// Handle form submission
form.addEventListener("submit", (event) => {
  event.preventDefault(); // prevent reload
  successMessage.textContent = "";

  const valid =
    validateName() && validateEmail() && validatePassword() && validatePhone();

  if (valid) {
    successMessage.textContent = "✅ Registration successful!";
    successMessage.style.color = "green";
    form.reset();
    // Remove valid states
    [fullName, email, password, phone].forEach((el) =>
      el.classList.remove("valid")
    );
  } else {
    successMessage.textContent = "❌ Please correct the highlighted fields.";
    successMessage.style.color = "red";
  }
});
