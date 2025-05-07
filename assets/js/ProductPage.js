// Get the product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// Fetch the product data from the local JSON file
fetch("./productsDetails.json")
  .then((response) => response.json()) 
  .then((data) => {
    // Find the product in the data that matches the ID from the URL
    const product = data.find((p) => p.id == productId);

    // If product exists, update the page with its details
    if (product) {
      updateProductDetails(product);
    } else {
      // If not found, show the product not found message
      showProductNotFound();
    }
  })
  .catch((error) => {
    // Handle errors such as file not found or JSON parsing error
    console.error("Error loading product:", error);
    showProductNotFound();
  });

// Function to update the HTML with product details
function updateProductDetails(product) {
  // Update the page title
  document.title = `${product.name} - Daraz`;

  // Update category and name
  document.getElementById("productCategory").textContent = product.category;
  document.getElementById("productName").textContent = product.name;

  // Update main product title and image
  document.getElementById("productTitle").textContent = product.name;
  document.getElementById("productImage").src = product.image;
  document.getElementById("productImage").alt = product.name;

  // Update pricing details
  document.getElementById(
    "productPrice"
  ).textContent = `Rs. ${product.price.toLocaleString()}`;
  document.getElementById(
    "productOriginalPrice"
  ).textContent = `Rs. ${product.originalPrice.toLocaleString()}`;
  document.getElementById(
    "productDiscount"
  ).textContent = `-${product.discount}%`;

  // Update description and stock information
  document.getElementById("productDescription").textContent =
    product.description;
  document.getElementById(
    "productStock"
  ).textContent = `In stock: ${product.stock}`;
  document
    .getElementById("productStock")
    .setAttribute("data-stock", product.stock);

  // Update brand (or show "Unknown" if not provided)
  document.getElementById("productBrand").textContent =
    product.brand || "Unknown";

  // Display star rating (★ for full stars, ☆ for empty)
  const ratingStars =
    "★".repeat(Math.floor(product.rating)) +
    "☆".repeat(5 - Math.floor(product.rating));
  document.getElementById("productRating").textContent = ratingStars;

  // Update reviews and sold information
  document.getElementById(
    "productReviews"
  ).textContent = `(${product.reviews} Reviews)`;
  document.getElementById("productSold").textContent = `${product.sold} Sold`;

  // Populate thumbnail images
  const thumbnailsContainer = document.getElementById("productThumbnails");
  thumbnailsContainer.innerHTML = ""; // Clear existing thumbnails

  product.images.forEach((image, index) => {
    // Create a column div for each thumbnail
    const col = document.createElement("div");
    col.className = "col-3 col-md-2";

    // Create image element
    const img = document.createElement("img");
    img.src = image;
    img.alt = `${product.name} - Image ${index + 1}`;
    img.className = index === 0 ? "img-fluid active" : "img-fluid"; // Make first image active

    // Add click event to change the main image
    img.addEventListener("click", function () {
      document.getElementById("productImage").src = image;

      // Remove "active" class from all thumbnails
      document.querySelectorAll("#productThumbnails img").forEach((thumb) => {
        thumb.classList.remove("active");
      });

      // Add "active" class to the clicked image
      this.classList.add("active");
    });

    // Append image to column, then column to container
    col.appendChild(img);
    thumbnailsContainer.appendChild(col);
  });
}

// Function to show "Product Not Found" message
function showProductNotFound() {
  document.getElementById("productDetails").innerHTML = `
    <div class="col-12 text-center py-5">
      <h2>Product Not Found</h2>
      <p>The product you are looking for does not exist or has been removed.</p>
      <a href="index.html" class="btn btn-orange mt-3">Back to Home</a>
    </div>
  `;

  // Hide related products section if it exists
  const relatedSection = document.getElementById("relatedProducts");
  if (relatedSection && relatedSection.parentElement) {
    relatedSection.parentElement.style.display = "none";
  }
}
