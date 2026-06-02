document.addEventListener("DOMContentLoaded", () => {
  const session = JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY));
  if (!session || session.role !== CONFIG.ROLES.MEMBER) {
    localStorage.removeItem(CONFIG.SESSION_KEY);
    window.location.href = "../../login/index.html";
    return;
  }
  document.getElementById("sessionUser").textContent = `${session.username.toUpperCase()}@MEMBER-NODE`;
  document.getElementById("btnLogout").addEventListener("click", () => {
    localStorage.removeItem(CONFIG.SESSION_KEY); window.location.href = "../../login/index.html";
  });
});
