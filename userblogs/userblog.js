import {
  getDocs,
  collection,
  db,
  onAuthStateChanged,
  auth,
  deleteDoc,
  doc,
} from "../firebase/firebase.js";

import { getSingleProduct } from "../app.js";

window.getSingleProduct = getSingleProduct;
const blogContainer = document.querySelector(".products-container");
const loader = document.querySelector(".loader");
let currUserUid;
let blogIdToDelete = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currUserUid = user.uid;
    logInUserBlog();
  } else {
    blogContainer.innerHTML = "Please log in to see your blogs.";
  }
});

async function logInUserBlog() {
  if (!currUserUid) return;

  blogContainer.innerHTML = ""; // Clear previous content

  try {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    let blogObj = [];

    querySnapshot.forEach((doc) => {
      const { blogImg, title, uid, description } = doc.data();

      if (currUserUid === uid) {
        blogObj.push({ blogImg, title, description });

        // Create blog post HTML
        const blogHtml = `
          <div style="height: 477px;" data-id="${doc.id}" data-category="blogs" class="product max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <img class="rounded-t-lg" src="${blogImg}" alt="productImage" />
            <div class="p-5">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Title: ${title}
              </h5>
             <button 
              onclick="getSingleProduct(this)" 
              type="button" 
              style="background: linear-gradient(to right, #00b4d8, #0077b6); color: white;" 
              class="hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
              Read Full Article
            </button>

            <a 
              style="background: linear-gradient(to right, #00f5d4, #00c2a1); color: white;" 
              class="hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-300             dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              href="../updateblog/update.html?id=${doc.id}&category=blogs">
              Edit Blog
            </a>

            <button 
              onclick="showDeleteMsg(this)" 
              type="button" 
              style="background: linear-gradient(to right, #f72585, #bf1363); color: white;" 
              class="relative top-0 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" 
              data-id="${doc.id}">
              Delete Blog
            </button>
            </div>
          </div>
        `;
        blogContainer.innerHTML += blogHtml;
      }
    });

    if (blogObj.length === 0) {
      blogContainer.innerHTML = "No blog to show.";
    }
  } catch (error) {
    console.log(error);
    blogContainer.innerHTML = "Error loading blogs.";
  } finally {
    loader.classList.add("none");
  }
}

function showDeleteMsg(button) {
  blogIdToDelete = button.getAttribute("data-id");
  const deleteModal = document.getElementById("delete-modal");
  deleteModal.classList.remove("hidden");
}

function hideDeleteMsg() {
  const deleteModal = document.getElementById("delete-modal");
  deleteModal.classList.add("hidden");
}

async function deleteBlog() {
  if (blogIdToDelete) {
    try {
      await deleteDoc(doc(db, "blogs", blogIdToDelete));
      logInUserBlog();
      hideDeleteMsg();
    } catch (error) {
      console.log("Error deleting blog:", error);
    }
  }
}

window.hideDeleteMsg = hideDeleteMsg;
window.deleteBlog = deleteBlog;
window.showDeleteMsg = showDeleteMsg;
