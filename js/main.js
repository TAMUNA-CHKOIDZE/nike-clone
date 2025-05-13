import { loadComponent } from "./load-component.js";

// const header = document.querySelector("header");
// const topNav = document.querySelector(".top-nav");
// const bfrFixingIcon = document.querySelector(".bfr-fixing");
// const topNavlinks = document.querySelectorAll(".top-nav-link");
// const lines = document.querySelectorAll(".line");
// const mainNav = document.querySelector(".main-nav");
const hideFilterBtn = document.querySelector(".filters-section-filter-btn");
const filterBar = document.querySelector(".filters-section-bar");
const productsContainer = document.querySelector(".filters-section-cards");
const paginationContainer = document.querySelector(".pagination");

  // Logic for fixing the header on scroll--------------------
loadComponent("header", "header.html", () => {
  const mainNav = document.querySelector(".main-nav");
  const header = document.querySelector("header");
  const topNav = document.querySelector(".top-nav");
  const bfrFixingIcon = document.querySelector(".bfr-fixing");
  const topNavlinks = document.querySelectorAll(".top-nav-link");
  const lines = document.querySelectorAll(".line");
  
  window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
      header.classList.add("header-fixed");
      topNav.style.background = "var(--color-black)";
      mainNav.style.background = "var(--color-gray-300)";
      bfrFixingIcon.src = "./images/header/man-white.svg";
      topNavlinks.forEach((elem) => {
        elem.style.color = "var(--color-gray-200)";
      });
      lines.forEach((elem) => {
        elem.style.borderRightColor = "var(--color-gray-200)";
      });
    } else {
      header.classList.remove("header-fixed");
      topNav.style.background = "var(--color-gray-100)";
      mainNav.style.background = "var(--color-gray-200)";
      bfrFixingIcon.src = "./images/header/man-icon.svg";
      topNavlinks.forEach((elem) => {
        elem.style.color = "var(--color-black)";
      });
      lines.forEach((elem) => {
        elem.style.borderRightColor = "var(--color-black)";
      });
    }
  });
});

// hide filters -------------------------
hideFilterBtn.addEventListener("click", () => {
  filterBar.classList.toggle("hide");
  productsContainer.classList.toggle("full");
  const hideFilterspan = document.querySelector(".hide-filters");
  if (hideFilterspan.textContent === "Hide Filters") {
    hideFilterspan.textContent = "Show Filters";
  } else {
    hideFilterspan.textContent = "Hide Filters";
  }
});

// Reading data from a JSON file – logic -------------------------------
// თითოეულ გვერდზე პროდუქტის რაოდენობა
const productsPerPage = 6;
// მიმდინარე გვერდი
let currentPage = 1;
// ცარიელ მასივში შევინახავ სერვერიდან მოსულ data-ს
let allProducts = [];

async function fetchProducts() {
  try {
    const response = await fetch("js/data.json");

    // თუ ფაილი არ არსებობს
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    allProducts = data;
    renderProducts(currentPage);
    renderPagination();
  } catch (error) {
    console.log(error);
    productsContainer.innerHTML = `<div class="alert alert-danger">404 ERROR</div>`;
  }
}

// renderProducts-ის ფუნქცია, რომელიც allProducts მასივიდან ჭრის 6 ელემენტს და ეკრანზე ხატავს ბარათებს
function renderProducts(page) {
  productsContainer.innerHTML = "";
  const startIndex = (page - 1) * productsPerPage; // 0, 6, 12
  const endIndex = startIndex + productsPerPage; // 6, 12, 18
  const currentProducts = allProducts.slice(startIndex, endIndex);
  console.log(currentProducts); // პირველი 6 ელემენტია

  currentProducts.forEach((product) => {
    const card = document.createElement("a");
    card.classList.add("card");
    card.href = `product.html?id=${product.id}`; // URL პარამეტრი
    card.innerHTML = `
    <img src="${product.imageUrl}" alt="${product.Title}" class="card-image">
    <h3 class="card-title">${product.Title}</h3>
    <p class="card-category">${product.category}</p>
    <span class="product-price">$${product.price}</span>
  `;

    productsContainer.appendChild(card);
  });
}

// renderPagination ფუნქცია, რომელიც სხვადასხვა გვერდზე გადაგვიყვანს
function renderPagination() {
  paginationContainer.innerHTML = "";
  // Math.ceil ამრგვალებს უახლოეს ზედა რიცხვამდე ანუ 14/6-ზე იქნება 3 გვერდი. წინააღმდეგ შემთხვევაში იქნება 2.3333333 და სისტემა აღიქვამს 2-ად და სამი გვერდი აღარ იქნება
  const totalPage = Math.ceil(allProducts.length / productsPerPage);
  for (let i = 1; i <= totalPage; i++) {
    const listItems = document.createElement("li");
    listItems.classList.add("page-item");
    if (i === currentPage) {
      listItems.classList.add("active");
    }
    const link = document.createElement("a");
    link.classList.add("page-link");
    link.href = "#";
    link.textContent = i;
    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      renderProducts(currentPage);
      const activeItem = paginationContainer.querySelector(".page-item.active");
      if (activeItem) {
        activeItem.classList.remove("active");
      }
      listItems.classList.add("active");
    });
    listItems.appendChild(link);
    paginationContainer.appendChild(listItems);
  }
}

fetchProducts();
