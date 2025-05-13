

const queryString = window.location.search; // "?id=3"
const urlParams = new URLSearchParams(queryString); // ქმნის ახალ ობიექტს URLSearchParams, რომელიც საშუალებას გაძლევს იოლად წაიკითხო URL-ში არსებული query პარამეტრები — ანუ ისეთი პარამეტრები, რომლებიც მოჰყვება ? სიმბოლოს ბმულში.
const idFromUrl = urlParams.get("id"); // "3" (აბრუნებს string-ის სახით)
const productId = parseInt(idFromUrl); // 3 (number)

// იტვირთება მონაცემები data.json-დან
fetch("js/data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((products) => {
    const product = products.find((prod) => prod.id === productId);
    if (product) {
      const productDetails = document.querySelector(".product-details");
      productDetails.classList.add("cardDescription");
      productDetails.innerHTML = `
     <div class="product-details-left">
            <img src="${product.imageUrl}" alt="${product.Title}" class="product-details-image">
        </div>
        <div class="product-details-right">
            <div class="small-photos">
                <img src="${product.smallImg1}" alt="${product.Title}" class="product-small-img">
                <img src="${product.smallImg2}" alt="${product.Title}" class="product-small-img">
            </div>
            <p class="product-description">${product.shortdescription}</p>
            <a href="#" class="view-product-link">View Product Details</a>
        </div>
  `;
    } else {
      document.body.innerHTML = "<p>Product not found!</p>";
    }
  })
  .catch((error) => {
    console.error("error:", error);
    document.body.innerHTML = "<p>Data loading error</p>";
  });
