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
    console.log(user);
    logInUserBlog();
  } else {
    blogContainer.innerHTML = "Please log in to see your blogs.";
    console.log("User logged out");
  }
});

async function logInUserBlog() {
  if (!currUserUid) {
    return;
  }

  blogContainer.innerHTML = ""; // Clear previous content

  try {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    let blogObj = [];

    querySnapshot.forEach((doc) => {
      const { blogImg, title, uid, description } = doc.data();

      if (currUserUid === uid) {
        blogObj.push({ blogImg, title, description });

        // Append each blog post to the blogContainer
        blogContainer.innerHTML += `
          <div style="height: 477px;" data-id="${doc.id}" data-category="blogs" class="product max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <img class="rounded-t-lg" src="${blogImg}" alt="productImage" />
            <div class="p-5">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Title: ${title}
              </h5>
              <button onclick="getSingleProduct(this)" type="button" class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Read More</button>
              <a class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" 
              href="../updateblog/update.html?id=${doc.id}&category=blogs">
                Edit Blog
              </a>
              <a class="relative top-1 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" 
              href="#" onclick="showDeleteMsg(this)">
                Delete Blog
              </a>
            </div>
          </div>
        `;
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

let deleteMsg = document.querySelector(".delete-confirmation");
// Function to handle blog deletion
function showDeleteMsg(ele) {
  let parent = ele.parentElement.parentElement;
  blogIdToDelete = parent.getAttribute("data-id");
  deleteMsg.classList.remove("none");
}

function hideDeleteMsg() {
  deleteMsg.classList.add("none");
}
async function deleteBlog() {
  if (blogIdToDelete) {
    try {
      await deleteDoc(doc(db, "blogs", blogIdToDelete));
      // Refresh the blog list after deletion
      deleteMsg.classList.add("none");
      logInUserBlog();
    } catch (error) {
      console.log("Error deleting blog:", error);
    }
  }
}
document.querySelector(".confirm-delete").addEventListener("click", deleteBlog);

window.showDeleteMsg = showDeleteMsg;
window.hideDeleteMsg = hideDeleteMsg;
