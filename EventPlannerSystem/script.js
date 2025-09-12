document.getElementById("eventForm").addEventListener("submit", async (e) => {
  e.preventDefault();

//   here take input from user from web page
  const name = document.getElementById("eventName").value;
  const date = document.getElementById("eventDate").value;
  const type = document.getElementById("eventType").value;
  const guests = document.getElementById("guestCount").value;
  
//   this is for output box of generated plan and download button
  const outputBox = document.getElementById("outputBox");
  const downloadBtn = document.getElementById("downloadPDF");

  outputBox.innerHTML = "<p>🤖 Generating AI Event Plan...</p>";
  downloadBtn.style.display = "none";

});
