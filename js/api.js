document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = "https://68196ebd1ac115563504d21d.mockapi.io/api/v1/products";
    let allProducts = []; 
    let currentPage = 1;
    const productsPerPage = 15;
    
    //create product card on home page 
    function createProductCard(product) {
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
        return col;
    }

    function displayError(containerId, error) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Unable to load products</h4>
                    <p>We're having trouble loading the product data. Please try again later.</p>
                    <hr>
                    <p class="mb-0">Error: ${error.message}</p>
                </div>
            </div>
        `;
    }

    // Function to load more products
    function loadMoreProducts() {
        const forYouContainer = document.getElementById("for-you-container");
        const startIndex = currentPage * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        
        // Get the next batch of products
        const nextBatch = allProducts.slice(startIndex, endIndex);
        
        // If no more products to show, disable the load more button
        if (nextBatch.length === 0) {
            const loadMoreBtn = document.querySelector('.load-more .more');
            loadMoreBtn.textContent = 'No more products';
            loadMoreBtn.style.backgroundColor = '#ccc';
            loadMoreBtn.style.cursor = 'default';
            loadMoreBtn.removeEventListener('click', loadMoreClickHandler);
            return;
        }
        
        // Add the next batch of products to the container
        nextBatch.forEach(product => {
            forYouContainer.appendChild(createProductCard(product));
        });
        
        // Increment the page counter
        currentPage++;
    }
    
    // Load more button click handler
    function loadMoreClickHandler() {
        loadMoreProducts();
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error("Data format invalid");
            }

            // Store all products
            allProducts = [...data].sort(() => 0.5 - Math.random());
            
            const productContainer = document.getElementById("product-container");
            const forYouContainer = document.getElementById("for-you-container");

            productContainer.innerHTML = '';
            forYouContainer.innerHTML = '';

            // Show first 6 products as "On Sale Now"
            const onSaleProducts = data.slice(0, 6);
            onSaleProducts.forEach(product => {
                productContainer.appendChild(createProductCard(product));
            });

            // Show first batch of products in "For You Products" section
            const initialProducts = allProducts.slice(0, productsPerPage);
            initialProducts.forEach(product => {
                forYouContainer.appendChild(createProductCard(product));
            });
            
            // Add event listener to the "Load more" button
            const loadMoreBtn = document.querySelector('.load-more .more');
            if (loadMoreBtn) {
                loadMoreBtn.addEventListener('click', loadMoreClickHandler);
            }
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            displayError("product-container", error);
            displayError("for-you-container", error);
        });
});