document.addEventListener("DOMContentLoaded", () => {
  const session = JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY));
  if (!session || session.role !== CONFIG.ROLES.ADMIN) {
    localStorage.removeItem(CONFIG.SESSION_KEY);
    window.location.href = "../../login/index.html";
    return;
  }

  document.getElementById("sessionUser").textContent = `${session.username.toUpperCase()}@ADMIN-NODE`;
  document.getElementById("btnLogout").addEventListener("click", () => {
    localStorage.removeItem(CONFIG.SESSION_KEY); window.location.href = "../../login/index.html";
  });
  document.getElementById("btnRefresh").addEventListener("click", fetchTableData);

  async function fetchTableData() {
    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = `<tr><td colspan="7" class="loading-state">Querying secure records...</td></tr>`;
    try {
      const response = await fetch(CONFIG.API_URL, {
        method: "POST", mode: "cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "getUsers", userId: session.userId })
      });
      const result = await response.json();
      if (result.status === "success") renderTable(result.data);
    } catch (e) { tbody.innerHTML = `<tr><td colspan="7" class="loading-state" style="color:red">Failed to map nodes.</td></tr>`; }
  }

  function renderTable(users) {
    const tbody = document.getElementById("userTableBody"); tbody.innerHTML = "";
    users.forEach(user => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.fullName}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td><span class="mono">${user.role.toUpperCase()}</span></td>
        <td><span class="badge-status ${user.status}">${user.status.toUpperCase()}</span></td>
        <td class="actions-cell"></td>
      `;
      const tdActions = tr.querySelector(".actions-cell");
      if (user.status === CONFIG.STATUS.PENDING) {
        const btnApp = document.createElement("button");
        btnApp.className = "btn-mod approve"; btnApp.textContent = "APPROVE";
        btnApp.onclick = () => executeAction(user.id, "approveUser");
        
        const btnRej = document.createElement("button");
        btnRej.className = "btn-mod reject"; btnRej.textContent = "REJECT";
        btnRej.onclick = () => executeAction(user.id, "rejectUser");
        
        tdActions.appendChild(btnApp); tdActions.appendChild(btnRej);
      } else {
        tdActions.textContent = "LOCKED PROFILE";
      }
      tbody.appendChild(tr);
    });
  }

  async function executeAction(targetId, actionName) {
    try {
      const response = await fetch(CONFIG.API_URL, {
        method: "POST", mode: "cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: actionName, operatorId: session.userId, targetId: targetId })
      });
      const res = await response.json(); alert(res.message); fetchTableData();
    } catch(e) { alert("Error dispatching authorization call."); }
  }
  fetchTableData();
});
