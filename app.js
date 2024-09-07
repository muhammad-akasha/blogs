import {
  onAuthStateChanged,
  auth,
  signOut,
  collection,
  getDocs,
  getDoc,
  db,
  doc,
} from "./firebase/firebase.js";

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("navbar-default");

  menuToggle.addEventListener("click", function () {
    // Manually toggle the open class
    navLinks.classList.toggle("open");
  });
});

const getSingleProduct = async (ele) => {
  let eleParent = ele.parentElement.parentElement;
  let id = eleParent.getAttribute("data-id");
  let category = eleParent.getAttribute("data-category");
  const docRef = doc(db, category, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    localStorage.setItem("productData", JSON.stringify(docSnap.data()));
    localStorage.setItem("productId", JSON.stringify(id));
    localStorage.setItem("productCategory", JSON.stringify(category));
    const currentURL = window.location.href;
    const targetURL = currentURL.includes("userblogs")
      ? "./../blog/index.html"
      : "./blog/index.html";

    window.location.href = targetURL;
  } else {
    console.log("No such document!");
  }
};

window.getSingleProduct = getSingleProduct;
let profileDetail = document.querySelector(".profile-details");
let profilePic = document.querySelector(".profile-pic");
let username = document.querySelector(".username");
let addProductLink = document.querySelector(".link-to-add-product");
let signInAndLogOut = document.querySelector(".sign-logout");
let loader = document.querySelector(".loader");
let myBlog = document.querySelector(".my-blog");
let currUserUid;

const getProducts = async () => {
  loader.classList.remove("none");
  document.body.style.overflowY = "hidden";
  const productContainer = document.querySelector(".products-container");
  productContainer.innerHTML = "";
  try {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    querySnapshot.forEach((doc) => {
      const { blogImg, title, uid } = doc.data();
      // console.log(blogImg, title, doc.id, uid); // showing all product by category
      productContainer.innerHTML += `
              <div data-id="${doc.id}" data-category="blogs" class="product max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    
                  <img class="rounded-t-lg" src="${blogImg}" alt="productImage" />
                <div class="p-5">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Title: ${title}
                    </h5>
                  <button onclick="getSingleProduct(this)" type="button" class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Read Full Article</button>
                </div>
              </div>
          `;
    });
  } catch (error) {
    console.error(`Error fetching data for category blog:`, error);
  }
  document.body.style.overflowY = "auto";
  loader.classList.add("none");
};

// check if user login or not

onAuthStateChanged(auth, (user) => {
  if (user) {
    currUserUid = user.uid;
    profileDetail.classList.remove("none");
    addProductLink.classList.remove("disabled-link");
    myBlog.classList.remove("none");
    signInAndLogOut.classList.add("logout");
    signInAndLogOut.innerHTML = "LOGOUT";
    signInAndLogOut.href = "javascript:void(0);";
    profilePic.src = `${user.photoURL}`;
    username.innerHTML = `${user.displayName}`;
    getProducts();

    // Add the event listener here to user logout
    signInAndLogOut.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          console.log("Sign out successful");
        })
        .catch((error) => {
          console.log("Sign out error:", error);
        });
    });
  } else {
    getProducts();
    profileDetail.classList.add("none");
    myBlog.classList.add("none");
    addProductLink.classList.add("disabled-link");
    signInAndLogOut.classList.remove("logout");
    signInAndLogOut.innerHTML = "SIGN IN";
    signInAndLogOut.href = "./auth/signin/signin.html";
  }
});

export { getSingleProduct };
