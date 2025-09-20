document.getElementById("eventForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("eventName").value;
  const date = document.getElementById("eventDate").value;
  const type = document.getElementById("eventType").value;
  const guests = document.getElementById("guestCount").value;

  const outputBox = document.getElementById("outputBox");
  const downloadBtn = document.getElementById("downloadPDF");

  outputBox.innerHTML = "<p>🤖 Generating Your Event Plan...</p>";
  downloadBtn.style.display = "none";

  try {
    const res = await fetch("http://localhost:5000/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date, type, guests }),
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
  
  let yPosition = 40;
  const lineSpacing = 15;
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;

  const splitText = doc.splitTextToSize(planText, 500);

  splitText.forEach(line => {
    if (yPosition > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
    doc.text(line, margin, yPosition);
    yPosition += lineSpacing;
  });

  const filename = `EventPlan_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
});
