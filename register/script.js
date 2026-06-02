/**
 * ============================================================
 * MEA ASSISTANT V2 — REGISTER LOGIC ENGINE
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const authNotify = document.getElementById("authNotify");
  const btnSubmit = document.getElementById("btnSubmit");
  const btnText = btnSubmit.querySelector(".btn-text");
  const spinner = btnSubmit.querySelector(".spinner");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearNotification();

    const fullName = document.getElementById("fullName").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Prosedur Validasi Sisi Klien (In-Engine Guard Validation)
    if (!fullName || !username || !email || !password || !confirmPassword) {
      showNotification("All operational data protocols must be complete.", "error");
      return;
    }

    if (username.length < 4) {
      showNotification("Username must be at least 4 alphanumeric characters.", "error");
      return;
    }

    if (!validateEmail(email)) {
      showNotification("Invalid telemetry matrix: Email structural failure.", "error");
      return;
    }

    if (password.length < 8) {
      showNotification("Security matrix weak: Password must be at least 8 characters.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showNotification("Security discrepancy: Passwords do not match.", "error");
      return;
    }

    setLoading(true);

    try {
      const passwordHash = await hashSHA256(password);

      const payload = {
        action: "register",
        fullName: fullName,
        username: username,
        email: email,
        passwordHash: passwordHash
      };

      const response = await fetch(CONFIG.API_URL, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Gateway connection lost.");

      const result = await response.json();

      if (result.status === "success") {
        showNotification("Registrasi berhasil. Tunggu persetujuan administrator.", "success");
        registerForm.reset();
        btnSubmit.style.display = "none";
      } else {
        showNotification(result.message, "error");
        setLoading(false);
      }

    } catch (error) {
      showNotification("Database communication fault. Access denied.", "error");
      setLoading(false);
    }
  });

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function hashSHA256(string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function showNotification(msg, type) {
    authNotify.textContent = msg;
    authNotify.className = `auth-notify ${type}`;
    authNotify.style.display = "block";
  }

  function clearNotification() {
    authNotify.style.display = "none";
    authNotify.textContent = "";
  }

  function setLoading(isLoading) {
    if (isLoading) {
      btnSubmit.disabled = true;
      btnText.textContent = "UPLINKING TO CLOUD DB...";
      spinner.style.display = "inline-block";
    } else {
      btnSubmit.disabled = false;
      btnText.textContent = "SUBMIT REQUEST";
      spinner.style.display = "none";
    }
  }
});
        
