import { loadComponent } from "./load-component.js";

const hideFilterBtn = document.querySelector(".filters-section-filter-btn");
const filterBar = document.querySelector(".filters-section-bar");
const productsContainer = document.querySelector(".filters-section-cards");
const paginationContainer = document.querySelector(".pagination");

// Footer-ის ჩატვირთვა
loadComponent("footer", "footer.html", () => {});

// Header-ის ჩატვირთვა + scroll ლოგიკა + search ლოგიკა
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
      topNavlinks.forEach(
        (elem) => (elem.style.color = "var(--color-gray-200)")
      );
      lines.forEach(
        (elem) => (elem.style.borderRightColor = "var(--color-gray-200)")
      );
    } else {
      header.classList.remove("header-fixed");
      topNav.style.background = "var(--color-gray-100)";
      mainNav.style.background = "var(--color-gray-200)";
      bfrFixingIcon.src = "./images/header/man-icon.svg";
      topNavlinks.forEach((elem) => (elem.style.color = "var(--color-black)"));
      lines.forEach(
        (elem) => (elem.style.borderRightColor = "var(--color-black)")
      );
    }
  });

  const searchInput = document.getElementById("header-input");
  const searchBtn = document.querySelector(".nav-search-btn");
  const overlaySection = document.getElementById("overlay-section");
  const cancelBtn = document.getElementById("cancel-btn");

  // ფუნქცია overlay-ის საჩვენებლად
  const showOverlay = () => {
    overlaySection.style.display = "flex";
  };

  // ღილაკზე დაკლიკებისას
  searchBtn.addEventListener("click", (e) => {
    e.preventDefault(); // არ გააგზავნოს ფორმა
    showOverlay();
  });

  // input-ზე focus-ის დროს
  searchInput.addEventListener("focus", showOverlay);

  // Cancel ღილაკზე დაკლიკებისას overlay-ის დახურვა
  cancelBtn.addEventListener("click", () => {
    overlaySection.style.display = "none";
  });
});

// საძიებო overlay ფორმის ლოგიკა
const searchOverleyForm = document.getElementById("search-overlay-form");
const searchOverleyInput = document.getElementById("overlay-submit-input");
const filtersContent = document.querySelector("#filters-content");
const filtersError = document.querySelector("#filters-error");

// ღილაკზე ან ენთერზე დაჭერისას განხორციელდება ფილტრაცია submit ივენთით
searchOverleyForm.addEventListener("submit", (e) => {
  // ფორმა, რომ არ დასაბმითდეს ავტომატურად
  e.preventDefault();
  // input-ში შეყვანილი მნიშვნელობა სფეისების და რეგისტრის გარეშე შენახვა
  const searchTerm = searchOverleyInput.value.trim().toLowerCase();

  //   // თუ მომხმარებელი არაფერს არ ჩაწერს
  if (!searchTerm) {
    renderProducts(currentPage);
    renderPagination();
    return;
  }

  // ბაზიდან ამოღებული პროდუქტების მასივს allProducts-ს გადავუვლი filter-ით და სახელის მიხედვით გავფილტრავ. თუ პროდუქტის სახელი შეიცავს searchTerm-ს, მაშინ ის პროდუქტი ჩავარდება filteredProducts-ში
  const filteredProducts = allProducts.filter((product) =>
    product.Title.toLowerCase().includes(searchTerm)
  );

  //   // renderFilteredProducts ფუნქციას გადავცემ ფილტრის შედეგად გაფილტრულ პროდუქტების მასივს და გამოვიძახებ
  renderFilteredProducts(filteredProducts);
  //  input-ის ველის გაწმენდა ძიების შემდეგ
  searchOverleyInput.value = "";

  // დასაბმითებისას ფილტრების სექციაზე ჩამოსქროლვა
  const targetSection = document.querySelector(".filters-section");
  if (targetSection) {
    const yOffset = -200; //  200px-ით ზემოთ უნდა გავაჩერო, თორემ ვიუპორტის კიდეზე ააქვს სექცია
    const y =
      targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
  const overlaySection = document.getElementById("overlay-section");
  overlaySection.style.display = "none";
});

// renderFilteredProducts ფუნქცია და გადავცემ ფილტრის შედეგად გაფილტრულ პროდუქტების მასივს
function renderFilteredProducts(filteredProducts) {
  productsContainer.innerHTML = "";
  paginationContainer.innerHTML = ""; //pagination-ს არ ვაჩვენებ ძიების შემდეგ

  // თუ filteredProducts ცარიელია, ანუ ჩაწერილ მნიშვნელობაზე ვერ მოიძებნა ვერაფერი, filtersSection-ის კონტენტს დავმალავ და გამოჩნდება მის ნაცვლად ტექსტი We could not find anything for "${searchTerm}"
  if (filteredProducts.length === 0) {
    filtersContent.style.display = "none";
    filtersError.style.display = "block";
    filtersError.innerHTML = `
      <div class="alert alert-warning no-border p-0 m-0">
        We could not find anything for "<strong>${searchOverleyInput.value}</strong>"
      </div>`;
    return;
  }

  // როცა მომხმარებელი სწორ საძიებო სახელს ჩაწერს კონტენტს გამოვაჩენ ისევ და ერორს დავმალავ
  filtersContent.style.display = "block";
  filtersError.style.display = "none";

  // თუ filteredProducts-ში ჩავარდება პროდუქტი
  filteredProducts.forEach((product) => {
    const card = document.createElement("a");
    card.classList.add("card");
    card.href = `product.html?id=${product.id}`;
    card.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.Title}" class="card-image">
      <h3 class="card-title">${product.Title}</h3>
      <p class="card-category">${product.category}</p>
      <span class="product-price">$${product.price}</span>
    `;
    productsContainer.appendChild(card);
  });
}

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

// drop down menu --------------------------------------------------
const dropDownMenuContainer = document.querySelector(".drop-down-menu-container");

dropDownMenuContainer.addEventListener("click", function (event) {
  const header = event.target.closest(".drop-down-menu-header");
  if (header) {
    const menu = header.nextElementSibling;
    const arrow = header.querySelector("img"); 

    if (menu && menu.classList.contains("drop-down-menu-checkboxs")) {
      const isOpen = menu.classList.toggle("active");
      arrow.src = isOpen
        ? "./images/pagination/sort-icon.svg"
        : "./images/pagination/select-icon.svg";
    }
  }
});
