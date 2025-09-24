const messagesDiv = document.getElementById('messages');
const input = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

const API_URL = 'https://php.kesug.com/chat.php?action=get'; // Your PHP URL

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

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;
  try {
    await fetch(`${API_URL}?action=send&message=${encodeURIComponent(message)}`);
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
setInterval(fetchMessages, 2000); // Refresh every 2 seconds
