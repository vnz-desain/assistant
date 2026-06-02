/**
 * ============================================================
 * MEA ASSISTANT V2 — LOGIN LOGIC ENGINE
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const authNotify = document.getElementById("authNotify");
  const btnSubmit = document.getElementById("btnSubmit");
  const btnText = btnSubmit.querySelector(".btn-text");
  const spinner = btnSubmit.querySelector(".spinner");

  // Alihkan secara otomatis jika sesi terverifikasi valid masih aktif
  if (localStorage.getItem(CONFIG.SESSION_KEY)) {
    redirectByRole(JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY)).role);
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearNotification();

    const identity = document.getElementById("identity").value.trim();
    const password = document.getElementById("password").value;

    if (!identity || !password) {
      showNotification("All security credentials must be filled.", "error");
      return;
    }

    setLoading(true);

    try {
      // Mengamankan password menggunakan SHA-256 Native Web Crypto API
      const passwordHash = await hashSHA256(password);

      const payload = {
        action: "login",
        identity: identity,
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

      if (!response.ok) throw new Error("Network clearance failure.");

      const result = await response.json();

      if (result.status === "success") {
        showNotification("Clearance granted. Establishing session...", "success");
        
        // Buat objek payload session terenkapsulasi
        const sessionData = {
          userId: result.data.id,
          username: result.data.username,
          role: result.data.role,
          loginTime: new Date().getTime()
        };
        
        localStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(sessionData));
        
        // Eksekusi rute pengalihan berdasarkan hak akses (Role-based Authorization Redirect)
        setTimeout(() => {
          redirectByRole(result.data.role);
        }, 1000);
      } else {
        showNotification(result.message, "error");
        setLoading(false);
      }

    } catch (error) {
      showNotification("Gateway timeout or cross-origin breakdown. Try again.", "error");
      setLoading(false);
    }
  });

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
      btnText.textContent = "VERIFYING CLEARANCE...";
      spinner.style.display = "inline-block";
    } else {
      btnSubmit.disabled = false;
      btnText.textContent = "INITIALIZE ACCESS";
      spinner.style.display = "none";
    }
  }

  function redirectByRole(role) {
    switch(role) {
      case CONFIG.ROLES.OWNER:
        window.location.href = "../dashboard/owner/index.html";
        break;
      case CONFIG.ROLES.ADMIN:
        window.location.href = "../dashboard/admin/index.html";
        break;
      case CONFIG.ROLES.MEMBER:
        window.location.href = "../dashboard/member/index.html";
        break;
      default:
        localStorage.removeItem(CONFIG.SESSION_KEY);
        window.location.href = "index.html";
    }
  }
});
    
