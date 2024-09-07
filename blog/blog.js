<<<<<<< HEAD
let loader = document.querySelector(".loader");
document.addEventListener("DOMContentLoaded", () => {
  let productData = localStorage.getItem("productData");
  productData = JSON.parse(productData);
  let id = localStorage.getItem("productId");
  id = JSON.parse(id);
  let category = localStorage.getItem("productCategory");
  category = JSON.parse(category);
  const { blogImg, title, description, uid, createdBy, userPic } = productData;
  console.log(blogImg, title, description);
  showProduct(blogImg, title, description, createdBy, userPic, uid);
  loader.classList.add("none");
  localStorage.removeItem("productData");
});

function showProduct(img, title, description, user, pic, uid) {
  let currProductImg = document.getElementById("curr-product-img");
  let productTitle = document.querySelector(".title");
  let productDescription = document.querySelector(".description");
  let userName = document.querySelector(".username");
  let userPic = document.querySelector(".user-pic");

  if (!userPic) {
    userPic.src = "./profile.png";
  } else {
    userPic.src = pic;
  }
  currProductImg.src = img;
  userName.innerHTML = user;
  productTitle.innerHTML = title;
  productDescription.innerHTML += description;
}
=======
let loader = document.querySelector(".loader");
document.addEventListener("DOMContentLoaded", () => {
  let productData = localStorage.getItem("productData");
  productData = JSON.parse(productData);
  let id = localStorage.getItem("productId");
  id = JSON.parse(id);
  let category = localStorage.getItem("productCategory");
  category = JSON.parse(category);
  const { blogImg, title, description, uid, createdBy, userPic } = productData;
  console.log(blogImg, title, description);
  showProduct(blogImg, title, description, createdBy, userPic, uid);
  loader.classList.add("none");
  localStorage.removeItem("productData");
});

function showProduct(img, title, description, user, pic, uid) {
  let currProductImg = document.getElementById("curr-product-img");
  let productTitle = document.querySelector(".title");
  let productDescription = document.querySelector(".description");
  let userName = document.querySelector(".username");
  let userPic = document.querySelector(".user-pic");

  if (!userPic) {
    userPic.src = "./profile.png";
  } else {
    userPic.src = pic;
  }
  currProductImg.src = img;
  userName.innerHTML = user;
  productTitle.innerHTML = title;
  productDescription.innerHTML += description;
}
>>>>>>> c081eb1afa4d934e4b7fe789875d211dc6f5eab1
