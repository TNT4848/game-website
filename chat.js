const messagesDiv = document.getElementById('messages');
const input = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

const API_URL = 'https://php.kesug.com/chat.php'; // PHP endpoint

// Fetch messages
async function fetchMessages() {
  try {
    const res = await fetch(`${API_URL}?action=get`);
    const data = await res.json();
    messagesDiv.innerHTML = '';
    data.forEach(msg => {
      const div = document.createElement('div');
      div.textContent = msg.message;
      messagesDiv.appendChild(div);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } catch (err) {
    console.error('Failed to fetch messages', err);
  }
}

// Send message
async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        action: 'send',
        message: message
      })
    });
    input.value = '';
    fetchMessages();
  } catch (err) {
    console.error('Failed to send message', err);
  }
}

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keydown', e => {
  if(e.key === 'Enter') sendMessage();
});

fetchMessages();
setInterval(fetchMessages, 2000);
