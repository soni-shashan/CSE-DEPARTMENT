// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getDatabase, ref, get, child, set } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKsvBCr6Xqr-RhBwnpr_HXp7TX1sScsvU",
  authDomain: "cspit-cse-department.firebaseapp.com",
  databaseURL: "https://cspit-cse-department-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cspit-cse-department",
  storageBucket: "cspit-cse-department.appspot.com",
  messagingSenderId: "946911360258",
  appId: "1:946911360258:web:9a35e888591e5cbbf2be1b",
  measurementId: "G-Q0RX2TWZXW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

// Authenticate anonymously
signInAnonymously(auth)
  .then(() => {
    console.log("Signed in anonymously");
    loadTimeTables();
  })
  .catch((error) => {
    console.error("Error signing in anonymously: ", error);
  });
  function sanitizeFileName(fileName) {
    return fileName.replace(/[.#$[\]]/g, '_');
}
  async function deleteImage(key, url) {
    // Delete from Storage
    const storageRefToDelete = storageRef(storage, 'timeTable/' + url);
    try {
        await storage.deleteObject(storageRefToDelete);
        console.log("Image deleted from Firebase Storage");
    } catch (error) {
        console.error("Error deleting image from Storage: ", error);
    }

    // Delete from Database
    const dbRefToDelete = ref(db, 'timeTable/' + key);
    try {
        await set(dbRefToDelete, null); // Set to null to delete
        console.log("Image data deleted from Firebase Database");
    } catch (error) {
        console.error("Error deleting image data from Database: ", error);
    }

    // Refresh the list of time tables
    location.reload();
    loadTimeTables();
}
// Function to create and append elements dynamically
function createAndAppendElement(parent, elementType, className, textContent = '') {
  const element = document.createElement(elementType);
  element.className = className;
  element.textContent = textContent;
  parent.appendChild(element);
  return element;
}

async function loadTimeTables() {
  const dbRef = ref(db, 'timeTable/');
  try {
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
          const timeTables = snapshot.val();
          const timeTableList = document.getElementById('timeTableList');
          timeTableList.innerHTML = ''; // Clear the existing list

          Object.keys(timeTables).forEach((key) => {
              const url = timeTables[key].url;

              // Create elements dynamically
              const listItem = createAndAppendElement(timeTableList, 'div', 'card');
              const cardHeader = createAndAppendElement(listItem, 'div', 'card-header text-center');
              createAndAppendElement(cardHeader, 'h2', '', key);
              const img = createAndAppendElement(listItem, 'img', '', '');
              img.src = url;
              img.style.width = '100%';
              const cardBody = createAndAppendElement(listItem, 'div', 'card-body text-center');
              const deleteBtn = createAndAppendElement(cardBody, 'a', 'btn btn-danger', 'Delete');
              deleteBtn.onclick = function() {
                  deleteImage(key, url);
              };
          });
      } else {
          console.log("No data available");
      }
  } catch (error) {
      console.error("Error fetching data: ", error);
  }
}

async function uploadImage() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image to upload.");
        return;
    }

    const sanitizedFileName = sanitizeFileName(file.name);
    const storageReference = storageRef(storage, 'timeTable/' + sanitizedFileName);

    try {
        console.log("Uploading image to Firebase Storage...");
        await uploadBytes(storageReference, file);
        console.log("Image uploaded to Firebase Storage");

        console.log("Getting download URL...");
        const downloadURL = await getDownloadURL(storageReference);
        console.log("Download URL obtained: ", downloadURL);

        // Save the image URL to the database
        const imageRef = ref(db, 'timeTable/' + document.getElementById("title_text").value);
        console.log("Saving URL to the database...");
        await set(imageRef, {
            url: downloadURL
        });
        console.log("URL saved to the database");
        
        loadTimeTables();
        // Display the uploaded image
        alert("Image uploaded successfully!");
    } catch (error) {
        console.error("Error uploading image: ", error);
        alert("Error uploading image. Please try again.");
    }
}

// Ensure DOM is fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    // Attach the event listener to the button
    document.getElementById('uploadButton').addEventListener('click', uploadImage);
});
