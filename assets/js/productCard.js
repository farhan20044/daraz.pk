fetch("productsDetails.json")
  .then((response) => response.json())
  .then((data) => {
    const saleContainer = document.getElementById("product-container");
    const justForYouContainer = document.getElementById(
      "just-for-you-container"
    );
    const saleProducts = data.filter((product) => product.onSale).slice(0, 6);
    const nonSaleProducts = data.filter((product) => !product.onSale);

    // Reusable function to render products
    function renderProducts(
      products,
      container,
      colClass = "d-flex justify-content-center"
    ) {
      products.forEach((product) => {
        const col = document.createElement("div");
        col.className = colClass;

        const card = document.createElement("div");
        card.className = "product-card";
        card.onclick = () =>
          (window.location.href = `./productPage.html?id=${product.id}`);
        card.innerHTML = `
          <img src="${product.image}" alt="${product.title}" class="product-img">
          <div class="ms-2">
            <div class="product-title">${product.title}</div>
            <div class="product-price">
              <div>${product.current_price}</div>
              <span class="original-price ml-2">${product.original_price}</span>
              <span class="discount ml-2">(${product.discount})</span>
            </div>
          </div>
        `;
        col.appendChild(card);
        container.appendChild(col);
      });
    }
    renderProducts(
      saleProducts,
      saleContainer,
      "col-2 d-flex justify-content-center"
    );
    renderProducts(nonSaleProducts, justForYouContainer);
  })
  .catch((error) => console.error("Error loading products:", error));
