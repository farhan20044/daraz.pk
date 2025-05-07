document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        displayError("No product ID found in URL");
        return;
    }
    
    const apiUrl = "https://68196ebd1ac115563504d21d.mockapi.io/api/v1/products";
    
    // Fetch all products and find the specific one by ID
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            // Find the product with matching ID
            // Convert both to strings for comparison to ensure type matching
            const product = products.find(p => String(p.id) === String(productId));
            
            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }
            
            // Update product page with fetched data
            updateProductDetails(product);
            
            // Fetch related products (same category)
            const relatedProducts = products
                .filter(p => p.category === product.category && String(p.id) !== String(productId))
                .slice(0, 5); // Limit to 5 related products
                
            displayRelatedProducts(relatedProducts);
        })
        .catch(error => {
            console.error("Error fetching product details:", error);
            displayError(`Error loading product: ${error.message}`);
        });
    
    function updateProductDetails(product) {
        // Update breadcrumb
        document.getElementById('productCategory').textContent = product.category || 'Category';
        document.getElementById('productName').textContent = product.title || 'Product';
        
        // Update product details
        document.getElementById('productTitle').textContent = product.title || 'Product Title';
        document.getElementById('productImage').src = product.image || '/placeholder.svg';
        document.getElementById('productImage').alt = product.title || 'Product Image';
        
        // Update price information
        document.getElementById('productPrice').textContent = product.current_price || 'Rs. 0';
        document.getElementById('productOriginalPrice').textContent = product.original_price || 'Rs. 0';
        document.getElementById('productDiscount').textContent = product.discount || '-0%';
        
        // Update ratings and reviews
        const ratingStars = generateStarRating(product.rating || 0);
        document.getElementById('productRating').innerHTML = ratingStars;
        document.getElementById('productReviews').textContent = `(${product.reviews || 0} Reviews)`;
        document.getElementById('productSold').textContent = `${product.sold || 0} Sold`;
        
        // Update stock information
        document.getElementById('productStock').textContent = `In stock: ${product.stock || 0}`;
        
        // Update product thumbnails if available
        if (product.thumbnails && Array.isArray(product.thumbnails) && product.thumbnails.length > 0) {
            updateProductThumbnails(product.thumbnails);
        } else {
            // If no thumbnails, use main image as thumbnail
            updateProductThumbnails([product.image]);
        }
        
        // Update product description if available
        if (document.getElementById('productDescription')) {
            document.getElementById('productDescription').innerHTML = product.description || 'No description available';
        }
        
        // Update product brand if available
        if (document.getElementById('productBrand')) {
            document.getElementById('productBrand').textContent = product.brand || 'No brand';
        }
        
        // Update page title
        document.title = `${product.title} - Daraz.pk`;
        
        // Update product details section
        updateProductDetailsSection(product);
    }
    
    function updateProductDetailsSection(product) {
        // Update the static product details section with dynamic data
        const productTitleElements = document.querySelectorAll('.product-title');
        if (productTitleElements.length > 0) {
            productTitleElements.forEach(el => {
                el.textContent = `Product details of ${product.title}`;
            });
        }
        
        // Update specifications if they exist
        const specValues = document.querySelectorAll('.spec-value');
        if (specValues.length > 0 && product.brand) {
            // Find the brand spec value and update it
            const brandSpecs = Array.from(specValues).filter(el => 
                el.previousElementSibling && 
                el.previousElementSibling.textContent === 'Brand'
            );
            
            if (brandSpecs.length > 0) {
                brandSpecs.forEach(el => {
                    el.textContent = product.brand;
                });
            }
        }
        
        // Update ratings title
        const ratingsTitleElements = document.querySelectorAll('.ratings-title');
        if (ratingsTitleElements.length > 0) {
            ratingsTitleElements.forEach(el => {
                el.textContent = `Ratings & Reviews of ${product.title}`;
            });
        }
    }
    
    function updateProductThumbnails(thumbnails) {
        const thumbnailsContainer = document.getElementById('productThumbnails');
        thumbnailsContainer.innerHTML = '';
        
        thumbnails.forEach((thumbnail, index) => {
            const col = document.createElement('div');
            col.className = 'col-3';
            
            const img = document.createElement('img');
            img.src = thumbnail;
            img.alt = `Thumbnail ${index + 1}`;
            img.className = 'img-fluid thumbnail-img';
            img.onclick = function() {
                document.getElementById('productImage').src = thumbnail;
            };
            
            col.appendChild(img);
            thumbnailsContainer.appendChild(col);
        });
    }
    
    function displayRelatedProducts(products) {
        const container = document.getElementById('relatedProducts');
        container.innerHTML = '';
        
        if (products.length === 0) {
            container.innerHTML = '<div class="col-12 text-center">No related products found</div>';
            return;
        }
        
        products.forEach(product => {
            const col = document.createElement('div');
            col.className = 'col';
            
            const card = document.createElement('div');
            card.className = 'card h-100 product-card';
            card.onclick = () => window.location.href = `./productPage.html?id=${product.id}`;
            
            card.innerHTML = `
                <img src="${product.image}" class="card-img-top p-2" alt="${product.title}">
                <div class="card-body">
                    <h5 class="card-title small text-truncate">${product.title}</h5>
                    <p class="card-text text-orange mb-0">${product.current_price}</p>
                    <small class="text-decoration-line-through text-muted">${product.original_price}</small>
                    <small class="text-orange">${product.discount}</small>
                </div>
            `;
            
            col.appendChild(card);
            container.appendChild(col);
        });
    }
    
    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let stars = '';
        
        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '★';
        }
        
        // Add half star if needed
        if (halfStar) {
            stars += '★';
        }
        
        // Add empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars += '☆';
        }
        
        return stars;
    }
    
    function displayError(message) {
        const productDetails = document.getElementById('productDetails');
        productDetails.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Product Not Found</h4>
                    <p>${message}</p>
                    <hr>
                    <p class="mb-0">Please return to the <a href="homePage.html" class="alert-link">homepage</a> and try again.</p>
                </div>
            </div>
        `;
    }
    
    // Handle quantity buttons
    document.getElementById('decreaseQuantity').addEventListener('click', function() {
        const input = document.getElementById('quantityInput');
        const currentValue = parseInt(input.value);
        if (currentValue > 1) {
            input.value = currentValue - 1;
        }
    });
    
    document.getElementById('increaseQuantity').addEventListener('click', function() {
        const input = document.getElementById('quantityInput');
        const currentValue = parseInt(input.value);
        const stock = parseInt(document.getElementById('productStock').textContent.replace('In stock: ', ''));
        if (currentValue < stock) {
            input.value = currentValue + 1;
        }
    });
    
    // Handle add to cart button
    document.getElementById('addToCartBtn').addEventListener('click', function() {
        const productTitle = document.getElementById('productTitle').textContent;
        const quantity = document.getElementById('quantityInput').value;
        alert(`Added ${quantity} ${productTitle}(s) to cart`);
    });
    
    // Handle buy now button
    document.getElementById('buyNowBtn').addEventListener('click', function() {
        const productTitle = document.getElementById('productTitle').textContent;
        const quantity = document.getElementById('quantityInput').value;
        alert(`Proceeding to checkout with ${quantity} ${productTitle}(s)`);
    });
});