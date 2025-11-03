document.getElementById("eventForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("eventName").value;
  const type = document.getElementById("eventType").value;
  const startDate = document.getElementById("eventStartDate").value;
  const endDate = document.getElementById("eventEndDate").value;
  const guests = document.getElementById("guestCount").value;

  const outputBox = document.getElementById("outputBox");
  const downloadBtn = document.getElementById("downloadPDF");

  outputBox.innerHTML = "<p>🤖 Generating Your Multi-Day Event Plan...</p>";
  downloadBtn.style.display = "none";

  try {
    const res = await fetch("http://localhost:5000/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type, startDate, endDate, guests }),
    });

    const data = await res.json();
    if (!data.plan) throw new Error("No plan generated");

    const htmlPlan = marked.parse(data.plan);
    outputBox.innerHTML = htmlPlan;

    downloadBtn.style.display = "inline-block";
    window.generatedPlan = data.plan;
  } catch (err) {
    outputBox.innerHTML = "<p>❌ Error generating plan. Please try again.</p>";
    console.error(err);
  }
});

document.getElementById("downloadPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const planText = window.generatedPlan || document.getElementById("outputBox").innerText;
  let y = 40;
  const margin = 40;
  const lineHeight = 15;
  const pageHeight = doc.internal.pageSize.getHeight();

  const lines = doc.splitTextToSize(planText, 500);
  lines.forEach((line) => {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  });

  const filename = `EventPlan_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
});
