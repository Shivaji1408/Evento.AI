// public/js/chatbot.js
document.addEventListener("DOMContentLoaded", () => {
  const chatWindow = document.getElementById("chatWindow");
  const chatForm = document.getElementById("chatForm");
  const userMessageInput = document.getElementById("userMessage");
  const micBtn = document.getElementById("micBtn");
  const languageSelect = document.getElementById("language");

  function addMessage(text, isUser) {
    const div = document.createElement("div");
    div.className = "message " + (isUser ? "user-msg" : "bot-msg");
    div.innerText = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function addTyping() {
    const typing = document.createElement("div");
    typing.className = "message bot-msg typing";
    typing.innerText = "Evento.AI is typing...";
    chatWindow.appendChild(typing);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return typing;
  }

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = userMessageInput.value.trim();
    const language = languageSelect.value || "English";
    if (!msg) return;
    addMessage(msg, true);
    userMessageInput.value = "";
    const typingEl = addTyping();

    try {
      const res = await fetch("/ai/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: msg, language })
      });
      const data = await res.json();
      typingEl.remove();
      if (data && data.success) {
        addMessage(data.reply, false);
      } else {
        addMessage(data?.reply || "AI error. Try again.", false);
      }
    } catch (err) {
      typingEl.remove();
      addMessage("Network error. Try again.", false);
    }
  });

  // Speech to text (optional)
  let recognition;
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;

    micBtn.addEventListener("click", () => {
      try {
        recognition.start();
        micBtn.classList.add("text-danger");
      } catch (e) {
        console.warn(e);
      }
    });

    recognition.onresult = (e) => {
      userMessageInput.value = e.results[0][0].transcript;
      micBtn.classList.remove("text-danger");
    };

    recognition.onerror = () => {
      micBtn.classList.remove("text-danger");
      alert("Microphone error. Please try again or use typing.");
    };
  } else {
    micBtn.disabled = true;
    micBtn.title = "Mic not supported";
  }
});
