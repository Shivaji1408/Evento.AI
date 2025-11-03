const expenseForm = document.getElementById("expenseForm");
const expenseTableBody = document.querySelector("#expenseTable tbody");
const calculateBtn = document.getElementById("calculateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const chartCanvas = document.getElementById("expenseChart");

let expenses = [];
let chartInstance = null;

// Add expense
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("expenseName").value.trim();
  const amount = parseFloat(document.getElementById("expenseAmount").value);

  if (!name || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid expense name and amount.");
    return;
  }

  expenses.push({ name, amount });
  updateExpenseTable();
  expenseForm.reset();
});

// Update the table
function updateExpenseTable() {
  expenseTableBody.innerHTML = "";
  expenses.forEach((expense, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" class="delete-check" data-index="${index}" /></td>
      <td>${expense.name}</td>
      <td>₹${expense.amount.toLocaleString()}</td>
    `;
    expenseTableBody.appendChild(row);
  });
}

// Delete selected expenses
deleteBtn.addEventListener("click", () => {
  const checkboxes = document.querySelectorAll(".delete-check:checked");

  if (checkboxes.length === 0) {
    alert("Please select at least one expense to delete.");
    return;
  }

  const indexesToDelete = Array.from(checkboxes).map((cb) =>
    parseInt(cb.getAttribute("data-index"))
  );

  // Filter out selected expenses
  expenses = expenses.filter((_, index) => !indexesToDelete.includes(index));

  updateExpenseTable();

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  alert("Selected expenses deleted successfully!");
});

// Generate chart
calculateBtn.addEventListener("click", () => {
  if (expenses.length === 0) {
    alert("No expenses to calculate. Please add some first!");
    return;
  }

  const labels = expenses.map((e) => e.name);
  const data = expenses.map((e) => e.amount);

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Expenses (₹)",
          data,
          backgroundColor: [
            "#3b82f6",
            "#1e3a8a",
            "#60a5fa",
            "#2563eb",
            "#4f46e5",
            "#38bdf8",
          ],
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Expense Distribution by Category",
          color: "#111",
          font: { size: 18 },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => "₹" + value,
          },
        },
      },
    },
  });
});
