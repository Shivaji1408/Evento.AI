document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const promptInput = document.getElementById("promptInput");
  const resultContainer = document.getElementById("resultContainer");
  const resultText = document.getElementById("resultText");

  let typewriterInterval;

  const setLoading = (isLoading) => {
    if (isLoading) {
      generateBtn.classList.add("loading");
      generateBtn.disabled = true;
    } else {
      generateBtn.classList.remove("loading");
      generateBtn.disabled = false;
    }
  };

  const startTypewriter = (text) => {
    if (typewriterInterval) {
      clearInterval(typewriterInterval);
    }

    let i = 0;
    resultText.innerHTML = "";
    resultContainer.classList.remove("hidden"); 

    const cursor = document.createElement("span");
    cursor.classList.add("cursor");
    resultText.appendChild(cursor);

    typewriterInterval = setInterval(() => {
      if (i < text.length) {
        resultText.insertBefore(document.createTextNode(text.charAt(i)), cursor);
        i++;
      } else {
        clearInterval(typewriterInterval);
        cursor.remove();
      }
    }, 30);
  };

  generateBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();

    if (!prompt) {
      startTypewriter("⚠️ Please enter a message prompt.");
      return;
    }

    setLoading(true);
    resultContainer.classList.add("hidden");
    resultText.innerHTML = "";

    try {
      const response = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.message) {
        startTypewriter(`💬 ${data.message}`);
      } else {
        startTypewriter("❌ No message received from server.");
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      startTypewriter("⚠️ Error: Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  });
});