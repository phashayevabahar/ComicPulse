// Global variable to store products data
let productsData = [];

// initialization function
async function initSearch() {
  console.log("InitSearch function started"); // Debug log

  const searchToggle = document.getElementById("searchToggle");
  const searchPanel = document.getElementById("searchPanel");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const closeSearch = document.getElementById("closeSearch");

  // Load products data from JSON
  try {
    console.log("Loading products data..."); // Debug log
    const response = await fetch("products.json");
    productsData = await response.json();
    console.log("Products data loaded:", productsData.length, "items"); // Debug log
  } catch (error) {
    console.error("Error loading products data:", error);
  }

  // Event listeners
  searchToggle.addEventListener("click", () => {
    searchPanel.classList.add("active");
    document.getElementById("searchResults").style.display = "block";
  });

  closeSearch.addEventListener("click", () => {
    searchPanel.classList.remove("active");
    searchInput.value = "";
    clearSearchResults();
  });

  searchInput.addEventListener("input", performSearch);
  searchButton.addEventListener("click", performSearch);

  console.log("InitSearch completed"); // Debug log
}

function clearSearchResults() {
  const resultsContainer = document.getElementById("searchResults");
  if (resultsContainer) {
    resultsContainer.innerHTML = "";
    resultsContainer.style.display = "none";
  }
}

// search function
function performSearch() {
  console.log("Performing search..."); // Debug log

  const searchTerm = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  const resultsContainer = document.getElementById("searchResults");

  if (!resultsContainer) {
    console.error("Search results container not found!");
    return;
  }

  clearSearchResults();

  if (!searchTerm) {
    console.log("Search term is empty"); // Debug log
    return;
  }

  if (!productsData || productsData.length === 0) {
    resultsContainer.innerHTML = "<p>Məhsul məlumatları yüklənməyib</p>";
    resultsContainer.style.display = "block";
    console.log("No products data available"); // Debug log
    return;
  }

  const filteredProducts = productsData.filter((product) => {
    return (
      (product.name && product.name.toLowerCase().includes(searchTerm)) ||
      (product.author && product.author.toLowerCase().includes(searchTerm)) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm)) ||
      (product.type && product.type.toLowerCase().includes(searchTerm))
    );
  });

  console.log("Found", filteredProducts.length, "results"); // Debug log
  displaySearchResults(filteredProducts, searchTerm);
}

function displaySearchResults(products, searchTerm) {
  const resultsContainer = document.getElementById("searchResults");

  if (!products.length) {
    resultsContainer.innerHTML = `<p>"${searchTerm}" üçün heç bir nəticə tapılmadı</p>`;
    resultsContainer.style.display = "block";
    return;
  }

  resultsContainer.innerHTML = `
        <div class="search-results-header">
            <h3>"${searchTerm}" üçün tapılan nəticələr (${products.length})</h3>
        </div>
        <div class="search-results-grid">
            ${products
              .map((product) => createProductCard(product, searchTerm))
              .join("")}
        </div>
    `;
  resultsContainer.style.display = "block";
}

function createProductCard(product, searchTerm) {
  // Highlight search term in product details
  const highlightText = (text) => {
    if (!text) return "";
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, '<span class="highlight">$1</span>');
  };

  return `
        <div class="product-card">
            <img src="${product.imgSource}" alt="${
    product.name
  }" onerror="this.src='default-image.jpg'">
            <div class="product-info">
                <h4>${highlightText(product.name)}</h4>
                <p class="author">${highlightText(product.author)}</p>
                <p class="description">${highlightText(
                  product.description
                    ? product.description.substring(0, 100)
                    : ""
                )}...</p>
                <div class="product-meta">
                    <span class="price">$${product.price}</span>
                    <span class="rating">⭐ ${product.starRate}</span>
                    <span class="type">${product.type}</span>
                </div>
            </div>
        </div>
    `;
}

// when the page is loaded
document.addEventListener("DOMContentLoaded", initSearch);
