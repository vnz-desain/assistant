document.addEventListener("DOMContentLoaded", () => {
  // Session Guard Authentication Verification Block
  const session = JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY));
  if (!session || session.role !== CONFIG.ROLES.OWNER) {
    localStorage.removeItem(CONFIG.SESSION_KEY);
    window.location.href = "../../login/index.html";
    return;
  }

  document.getElementById("sessionUser").textContent = `${session.username.toUpperCase()}@OWNER-NODE`;
  
  document.getElementById("btnLogout").addEventListener("click", () => {
    localStorage.removeItem(CONFIG.SESSION_KEY);
    window.location.href = "../../login/index.html";
  });

  document.getElementById("btnRefresh").addEventListener("click", fetchTableData);

  async function fetchTableData() {
    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = `<tr><td colspan="7" class="loading-state">Synchronizing secure user matrix rows...</td></tr>`;
    
    try {
      const response = await fetch(CONFIG.API_URL, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "getUsers", userId: session.userId })
      });
      const result = await response.json();

      if (result.status === "success") {
        renderTable(result.data);
      } else {
        tbody.innerHTML = `<tr><td colspan="7" class="loading-state" style="color:red">Error: ${result.message}</td></tr>`;
      }
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="7" class="loading-state" style="color:red">Network disruption mapping database core.</td></tr>`;
    }
  }

  function renderTable(users) {
    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = "";

    let pendingCount = 0;
    document.getElementById("countTotal").textContent = users.length;

    users.forEach(user => {
      if (user.status === CONFIG.STATUS.PENDING) pendingCount++;

      const tr = document.createElement("tr");

      // ID Cell
      const tdId = document.createElement("td");
      tdId.textContent = user.id;
      tr.appendChild(tdId);

      // Names & Meta Cells
      const tdName = document.createElement("td"); tdName.textContent = user.fullName; tr.appendChild(tdName);
      const tdUser = document.createElement("td"); tdUser.textContent = user.username; tr.appendChild(tdUser);
      const tdEmail = document.createElement("td"); tdEmail.textContent = user.email; tr.appendChild(tdEmail);

      // Role Select Box Cell
      const tdRole = document.createElement("td");
      const sel = document.createElement("select");
      sel.className = "select-role";
      [CONFIG.ROLES.MEMBER, CONFIG.ROLES.ADMIN, CONFIG.ROLES.OWNER].forEach(r => {
        const opt = document.createElement("option");
        opt.value = r; opt.textContent = r.toUpperCase();
        if(user.role === r) opt.selected = true;
        sel.appendChild(opt);
      });
      // Mencegah owner menurunkan pangkat diri sendiri secara tidak sengaja
      if (user.id === session.userId) sel.disabled = true; 
      
      sel.addEventListener("change", () => updateRole(user.id, sel.value));
      tdRole.appendChild(sel);
      tr.appendChild(tdRole);

      // Status Badge Cell
      const tdStatus = document.createElement("td");
      const badge = document.createElement("span");
      badge.className = `badge-status ${user.status}`;
      badge.textContent = user.status.toUpperCase();
      tdStatus.appendChild(badge);
      tr.appendChild(tdStatus);

      // Moderation Actions Cell
      const tdActions = document.createElement("td");
      tdActions.className = "actions-cell";
      
      if (user.status === CONFIG.STATUS.PENDING && user.id !== session.userId) {
        const btnApp = document.createElement("button");
        btnApp.className = "btn-mod approve"; btnApp.textContent = "APPROVE";
        btnApp.onclick = () => moderateUser(user.id, "approveUser");
        
        const btnRej = document.createElement("button");
        btnRej.className = "btn-mod reject"; btnRej.textContent = "REJECT";
        btnRej.onclick = () => moderateUser(user.id, "rejectUser");
        
        tdActions.appendChild(btnApp);
        tdActions.appendChild(btnRej);
      } else if (user.id === session.userId) {
        tdActions.textContent = "SYSTEM ROOT";
      } else {
        tdActions.textContent = "NO RECENT TRIGGERS";
      }
      tr.appendChild(tdActions);
      tbody.appendChild(tr);
    });

    document.getElementById("countPending").textContent = pendingCount;
  }

  async function moderateUser(targetId, actionName) {
    if(!confirm("Execute status authorization change?")) return;
    try {
      const response = await fetch(CONFIG.API_URL, {
        method: "POST", mode: "cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: actionName, operatorId: session.userId, targetId: targetId })
      });
      const res = await response.json();
      alert(res.message);
      fetchTableData();
    } catch(e) { alert("Action pipeline crash."); }
  }

  async function updateRole(targetId, newRole) {
    try {
      const response = await fetch(CONFIG.API_URL, {
        method: "POST", mode: "cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "changeRole", operatorId: session.userId, targetId: targetId, newRole: newRole })
      });
      const res = await response.json();
      alert(res.message);
      fetchTableData();
    } catch(e) { alert("Role update execution failure."); }
  }

  fetchTableData();
});
