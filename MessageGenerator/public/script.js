document.getElementById("generateBtn").addEventListener("click", async () => {
  const prompt = document.getElementById("userInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (!prompt) {
    resultDiv.textContent = "⚠️ Please enter a message prompt.";
    return;
  }

  resultDiv.textContent = "⏳ Generating message...";

  try {
    const response = await fetch("http://localhost:3000/generate", { // ✅ explicit full URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    if (data.message) {
      resultDiv.textContent = `💬 ${data.message}`;
    } else {
      resultDiv.textContent = "❌ No message received.";
    }
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    resultDiv.textContent = "⚠️ Error generating message.";
  }
});
