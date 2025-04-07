function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === "admin" && pass === "admin") {
    window.location.href = "loan-application.html";
  } else {
    document.getElementById("loginError").style.display = "block";
  }
}

function nextStep(step) {
  const currentStep = document.getElementById("step" + step);
  const inputs = currentStep.querySelectorAll("input, select, textarea");
  let valid = true;

  inputs.forEach((input) => {
    if (!input.checkValidity()) {
      input.classList.add("is-invalid");
      valid = false;
    } else {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
    }
  });

  if (step === 1 && !validateDOB()) return;
  if (step === 1 && !validatePhone()) return;

  if (valid) {
    currentStep.style.display = "none";
    document.getElementById("step" + (step + 1)).style.display = "block";
  }
}

function prevStep(step) {
  document.getElementById("step" + step).style.display = "none";
  document.getElementById("step" + (step - 1)).style.display = "block";
}

document.getElementById("loanForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const appId = "LN" + Math.floor(100000 + Math.random() * 900000);
  sessionStorage.setItem("appId", appId);
  window.location.href = "loan-confirmation.html";
});

window.onload = function () {
  const appNumEl = document.getElementById("appNumber");
  const appId = sessionStorage.getItem("appId");
  if (appNumEl && appId) {
    appNumEl.innerText = appId;
    new QRCode(document.getElementById("qrcode"), {
      text:
        "https://nimisha0609.github.io/loanappdemo/check-status.html?app_id=" +
        appId,
      width: 192,
      height: 192,
    });
  }
};

function validateDOB() {
  const dobInput = document.getElementById("dob");
  const dob = new Date(dobInput.value);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();

  if (age < 18 || isNaN(age)) {
    dobInput.classList.add("is-invalid");
    return false;
  } else {
    dobInput.classList.remove("is-invalid");
    dobInput.classList.add("is-valid");
    return true;
  }
}

function validatePhone() {
  const phoneInput = document.getElementById("phone");
  const phone = phoneInput.value;
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    phoneInput.classList.add("is-invalid");
    return false;
  } else {
    phoneInput.classList.remove("is-invalid");
    phoneInput.classList.add("is-valid");
    return true;
  }
}

function toggleEmploymentDetails() {
  const status = document.getElementById("employmentStatus").value;
  const detailsSection = document.getElementById("employmentDetails");
  const inputs = detailsSection.querySelectorAll("input");

  if (status === "Salaried" || status === "Self-Employed") {
    detailsSection.style.display = "block";
    inputs.forEach((input) => input.setAttribute("required", "true"));
  } else {
    detailsSection.style.display = "none";
    inputs.forEach((input) => {
      input.removeAttribute("required");
      input.classList.remove("is-invalid", "is-valid");
      input.value = ""; // Optionally clear data
    });
  }
}
