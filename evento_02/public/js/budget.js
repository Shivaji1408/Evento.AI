data.items.forEach(item => {
  html += `
    <div class="d-flex justify-content-between border-bottom py-2">
      <span>${item.title} <small class="text-muted">(${item.category})</small></span>
      <div>
        <strong>₹${item.cost}</strong>
        <form action="/budget/delete/${item._id}" method="POST" style="display:inline;">
          <button class="btn btn-sm btn-danger ms-2">✖</button>
        </form>
      </div>
    </div>
  `;
});
