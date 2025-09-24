const API_URL = "https://php.kesug.com/chat.php";

// Get messages
async function fetchMessages() {
  try {
    const res = await fetch(`${API_URL}?action=get`);
    const data = await res.json();

    const div = document.getElementById("messages");
    div.innerHTML = "";
    data.forEach(m => {
      const p = document.createElement("p");
      p.textContent = m.message;
      div.appendChild(p);
    });
  } catch (e) {
    console.error("Fetch failed", e);
  }
}

// Send messages
async function sendMessage() {
  const input = document.getElementById("message-input");
  const msg = input.value.trim();
  if (!msg) return;

  try {
    const res = await fetch(`${API_URL}?action=send&message=${encodeURIComponent(msg)}`);
    await res.json();
    input.value = "";
    fetchMessages();
  } catch (e) {
    console.error("Send failed", e);
  }
}

document.getElementById("send-btn").addEventListener("click", sendMessage);
setInterval(fetchMessages, 2000);
fetchMessages();
