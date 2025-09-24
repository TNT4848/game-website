const API_URL = "https://php.kesug.com/chat.php";

// Fetch messages from server
async function fetchMessages() {
  try {
    const response = await fetch(`${API_URL}?action=get`);
    if (!response.ok) throw new Error("Network error while fetching messages");

    const messages = await response.json();

    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = ""; // clear old messages

    messages.forEach(msg => {
      const p = document.createElement("p");
      p.textContent = msg.message;
      messagesDiv.appendChild(p);
    });
  } catch (err) {
    console.error("Failed to fetch messages", err);
  }
}

// Send a message to server
async function sendMessage() {
  const input = document.getElementById("message-input");
  const message = input.value.trim();
  if (!message) return;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "send",
        message: message
      })
    });

    if (!response.ok) throw new Error("Network error while sending message");

    input.value = ""; // clear box
    fetchMessages();  // refresh messages
  } catch (err) {
    console.error("Failed to send message", err);
  }
}

// Attach event listener
document.getElementById("send-btn").addEventListener("click", sendMessage);

// Load messages every 2 seconds
setInterval(fetchMessages, 2000);

// Load first time immediately
fetchMessages();
