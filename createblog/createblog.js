import {
  addDoc,
  collection,
  db,
  auth,
  onAuthStateChanged,
  uploadBytes,
  getDownloadURL,
  storage,
  ref,
} from "../firebase/firebase.js";

let createForm = document.getElementById("create-form");
let loader = document.querySelector(".spin");

let uid;
let userName;
let userPic;

onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    userName = user.displayName;
    userPic = user.photoURL;
    console.log("log in");
  } else {
    console.log("logout");
  }
});
createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log(e);
  let image = e.srcElement[0];
  let title = e.srcElement[1].value;
  let description = e.srcElement[2].value;
  let btn = e.srcElement[3];
  // console.log(image , title , description , btn);
  console.log(userName, userPic, uid);
  if (image.files.length === 0 || !title || !description) {
    return alert("all the field are required");
  }

  loader.classList.remove("none");
  btn.classList.add("flex-class");
  btn.setAttribute("disabled", true);
  const storageRef = ref(storage, `products/${image.files[0].name}`);
  const uploadImg = await uploadBytes(storageRef, image.files[0]);
  console.log(uploadImg);
  const imgUrl = await getDownloadURL(ref(storageRef));
  console.log(imgUrl);

  await addDoc(collection(db, `blogs`), {
    title,
    description,
    blogImg: imgUrl,
    createdBy: userName,
    userPic,
    uid,
  });
  alert("add create successfully");
  loader.classList.add("none");
  btn.removeAttribute("disabled");
  btn.classList.remove("flex-class");
  window.location.href = "../index.html";
});
