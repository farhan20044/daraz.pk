document.addEventListener('DOMContentLoaded', function() {
  fetch("productsDetails.json")
      .then(response => response.json())
      .then(data => {
          const container = document.getElementById("product-container");
          
          data.forEach(product => {
              const col = document.createElement("div");
              col.className = "col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4";
              
              const card = document.createElement("div");
              card.className = "product-card";
              card.onclick = () => window.location.href = `./productPage.html?id=${product.id}`;
              
              card.innerHTML = `
                  <div class="text-center">
                      <img src="${product.image}" alt="${product.title}" class="product-img">
                  </div>
                  <div class="product-details">
                      <div class="product-title">${product.title}</div>
                      <div class="product-price">
                          <div>${product.current_price}</div>
                          <span class="original-price">${product.original_price}</span>
                          <span class="discount">${product.discount}</span>
                      </div>
                  </div>
              `;
              
              col.appendChild(card);
              container.appendChild(col);
          });
      })
      .catch(error => console.error("Error loading products:", error));
});