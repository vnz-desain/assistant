// ==========================================
// FILE: script.js (Taruh di root/MEA-Trading/)
// ==========================================

// MASUKKAN URL GOOGLE APPS SCRIPT WEB APP DI BAWAH INI
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbw3rOuckASOEq-ThYO0FcoyaNNkXM7FOH4cgWUBBs39jplrkgAShBQjW8Mq8fSRLdCqMA/exec";

let currentUser = null;
let currentFullName = null;

document.addEventListener("DOMContentLoaded", function() {

    const session =
      JSON.parse(
        localStorage.getItem("mea_session")
      );

    if (!session) {
        window.location.href = "/login/";
        return;
    }

    currentUser = session.username;
    currentFullName =
      session.fullName ||
      session.username;

    document.getElementById('ui-fullname').innerText =
      currentFullName;

    document.getElementById('ui-username').innerText =
      "@" + currentUser;

});
// 2. Fungsi Logout
function logout() {
    localStorage.removeItem("mea_session");
    window.location.href = "/login/";
}

// 3. UI Interactions
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('open');
}

function newConversation() {
    document.getElementById('chatArea').innerHTML = '<div class="welcome-message">Sistem direstart. Siap untuk analisis baru.</div>';
    toggleSidebar();
}

function updatePriceLabel() {
    const isChecked = document.getElementById('priceToggle').checked;
    const label = document.getElementById('priceLabel');
    label.innerText = isChecked ? "Open" : "Sekarang";
    label.style.color = isChecked ? "var(--white-dim)" : "var(--white)";
}

// 4. Submit Analisis ke Backend GAS
document.getElementById('tradingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('submitBtn');
    btn.innerText = "MENGANALISIS...";
    btn.disabled = true;

    // Kumpulkan data form
    const dataPayload = {
        username: currentUser,
        ticker: document.getElementById('ticker').value,
        type: document.getElementById('tradeType').value,
        style: document.getElementById('riskStyle').value,
        openPrice: document.getElementById('openPrice').value,
        closePrice: document.getElementById('closePrice').value,
        avgPrice: document.getElementById('avgPrice').value || "",
        lots: document.getElementById('lots').value || "",
        bidVol: document.getElementById('bidVol').value || "",
        askVol: document.getElementById('askVol').value || ""
    };

    appendMessage('user', `REQ: ${dataPayload.ticker.toUpperCase()} | ${dataPayload.type.toUpperCase()} | ${dataPayload.style.toUpperCase()}`);

    try {
        // Fetch ke Google Apps Script
        const response = await fetch(GAS_API_URL, {
            method: 'POST',
            // Gunakan text/plain untuk bypass CORS preflight pada GAS
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(dataPayload)
        });

        const result = await response.json();
        
        if (result.status === 'success') {
            appendMessage('ai', result.data, dataPayload.ticker);
        } else {
            appendMessage('ai', "Error dari server: " + result.message);
        }
    } catch (error) {
        appendMessage('ai', "Gagal terhubung ke AI. Pastikan URL API sudah benar. Details: " + error.message);
    } finally {
        btn.innerText = "ANALISIS SEKARANG";
        btn.disabled = false;
    }
});

// 5. Append Message & Chart UI
function appendMessage(sender, text, ticker = null) {
    const chatArea = document.getElementById('chatArea');
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg-container msg-${sender}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    if(sender === 'ai') {
        const chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
        bubble.innerHTML = `<pre>${text}</pre>`;
        msgDiv.appendChild(bubble);
        chatArea.appendChild(msgDiv);
       // if(ticker) renderDummyChart(chartId);
    } else {
        bubble.innerText = text;
        msgDiv.appendChild(bubble);
        chatArea.appendChild(msgDiv);
    }
    
    chatArea.scrollTop = chatArea.scrollHeight;
}



