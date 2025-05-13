// This file contains the main JavaScript logic for the website

// Logic for fixing the header on scroll--------------------
const header = document.querySelector("header");
const topNav = document.querySelector(".top-nav");
const bfrFixingIcon = document.querySelector(".bfr-fixing");
const topNavlinks = document.querySelectorAll(".top-nav-link");
const lines = document.querySelectorAll(".line");
const mainNav = document.querySelector(".main-nav");

window.addEventListener("scroll", handleSroll);

function handleSroll() {
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
}

// product.html ფაილში — წაიკითხე ID და გამოიძახე მონაცემები
// ეს კოდი გაწერს product.html-ში
// const params = new URLSearchParams(window.location.search);
// const productId = params.get('id');

// fetch(`/api/products/${productId}`)
//   .then(res => res.json())
//   .then(product => {
//     // აქ დაამატე DOM-ში პროდუქტის დეტალები
//     document.getElementById('product-name').textContent = product.name;
//     document.getElementById('product-description').textContent = product.description;
//     // და ა.შ...
//   });

// ტრადიციული მიდგომა — ცალკე HTML გვერდი
// ✅ მარტივი, გასაგები დასაწყისისთვის.

// თითო ბარათი შეიძლება იყოს <a href="/product.html?id=123"> ფორმატით.

// შემდეგ product.html-ში URLSearchParams-ით წაიკითხავ ID-ს:

// js
// Copy
// Edit
// const params = new URLSearchParams(window.location.search);
// const productId = params.get('id');

// fetch(`/api/products/${productId}`)
//   .then(res => res.json())
//   .then(product => renderProductDetails(product));
