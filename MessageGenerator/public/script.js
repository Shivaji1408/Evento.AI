document.addEventListener("DOMContentLoaded", () => {
  // Get all new elements
  const generateBtn = document.getElementById("generateBtn");
  const promptInput = document.getElementById("promptInput");
  const resultContainer = document.getElementById("resultContainer");
  const resultText = document.getElementById("resultText");

  let typewriterInterval; // To store the typewriter interval

  // Function to show/hide loading state on the button
  const setLoading = (isLoading) => {
    if (isLoading) {
      generateBtn.classList.add("loading");
      generateBtn.disabled = true;
    } else {
      generateBtn.classList.remove("loading");
      generateBtn.disabled = false;
    }
  };

  // Typewriter effect function
  const startTypewriter = (text) => {
    // Clear any existing interval
    if (typewriterInterval) {
      clearInterval(typewriterInterval);
    }

    let i = 0;
    resultText.innerHTML = ""; // Clear previous text
    resultContainer.classList.remove("hidden"); // Show the result box

    // Add a blinking cursor
    const cursor = document.createElement("span");
    cursor.classList.add("cursor");
    resultText.appendChild(cursor);

    typewriterInterval = setInterval(() => {
      if (i < text.length) {
        // Insert the new character *before* the cursor
        resultText.insertBefore(document.createTextNode(text.charAt(i)), cursor);
        i++;
      } else {
        // Stop the interval and remove the cursor when done
        clearInterval(typewriterInterval);
        cursor.remove();
      }
    }, 30); // Adjust typing speed (milliseconds)
  };

  // Main click event
  generateBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();

    if (!prompt) {
      // Use the typewriter to show the error
      startTypewriter("⚠️ Please enter a message prompt.");
      return;
    }

    setLoading(true);
    resultContainer.classList.add("hidden"); // Hide old result
    resultText.innerHTML = ""; // Clear text

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