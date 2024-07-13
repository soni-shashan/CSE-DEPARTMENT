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
window.onload=loadFacultyArea();
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);
var content_count=0;
var imageLink;
// Authenticate anonymously
signInAnonymously(auth)
  .then(() => {
    console.log("Signed in anonymously");
    loadFacultyArea();
  })
  .catch((error) => {
    console.error("Error signing in anonymously: ", error);
  });
  function sanitizeFileName(fileName) {
    return fileName.replace(/[.#$[\]]/g, '_');
}
  async function deleteClub(key, url) {
    // Delete from Storage
    const storageRefToDelete = storageRef(storage, 'FacultyArea/' + url);
    try {
        await storage.deleteObject(storageRefToDelete);
        console.log("Image deleted from Firebase Storage");
    } catch (error) {
        console.error("Error deleting image from Storage: ", error);
    }

    // Delete from Database
    const dbRefToDelete = ref(db, 'FacultyArea/' + key);
    try {
        await set(dbRefToDelete, null); // Set to null to delete
        console.log("Image data deleted from Firebase Database");
    } catch (error) {
        console.error("Error deleting image data from Database: ", error);
    }

    // Refresh the list of time tables
    location.reload();
    loadFacultyArea();
}
// Function to create and append elements dynamically
function createAndAppendElement(parent, elementType, className, textContent = '') {
  const element = document.createElement(elementType);
  element.className = className;
  element.textContent = textContent;
  parent.appendChild(element);
  return element;
}

async function loadFacultyArea() {
    document.getElementById("loading").style.display = "flex";
    document.querySelector("._main_contain").classList.add("blur");
    const dbRef = ref(db, 'FacultyArea/');
    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const facultyArea = snapshot.val();
            const facultyList = document.getElementById('facultyList');

            // Check if facultyList already exists
            if (!facultyList) {
                // Create ul element if it doesn't exist
                const ul = document.createElement('ul');
                ul.id = 'facultyList';
                ul.className = 'faculty-list'; // Optional: Add a class for styling
                document.body.appendChild(ul); // Append to body or any parent element you want
            }

            // Get the ul element again
            const updatedList = document.getElementById('facultyList');

            // Iterate through facultyArea and populate the list
            Object.keys(facultyArea).forEach(facultyName => {
                const facultyData = facultyArea[facultyName];
                const listItem = document.createElement('li');

                const containerDiv = document.createElement('div');
                containerDiv.className = 'container';

                const rowDiv = document.createElement('div');
                rowDiv.className = 'row justify-content-center';

                const colDiv = document.createElement('div');
                colDiv.className = 'col-md-20';

                const profileCardDiv = document.createElement('div');
                profileCardDiv.className = 'profile-card';

                if (facultyData.profileLink) {
                    profileCardDiv.onclick = () => window.open(facultyData.profileLink, '_blank');
                }

                const profileImg = document.createElement('img');
                profileImg.src = facultyData.imageUrl;
                profileImg.alt = 'Profile Picture';
                profileImg.className = 'profile-img';

                const profileNameDiv = document.createElement('div');
                profileNameDiv.className = 'profile-name';
                profileNameDiv.textContent = facultyName;

                const profilePostDiv = document.createElement('div');
                profilePostDiv.className = 'profile-post';
                profilePostDiv.textContent = facultyData.position;

                profileCardDiv.appendChild(profileImg);
                profileCardDiv.appendChild(profileNameDiv);
                profileCardDiv.appendChild(profilePostDiv);

                colDiv.appendChild(profileCardDiv);
                rowDiv.appendChild(colDiv);
                containerDiv.appendChild(rowDiv);
                listItem.appendChild(containerDiv);

                updatedList.appendChild(listItem); // Append to the updated ul element
            });
            document.getElementById("loading").style.display = "none";
            document.querySelector("._main_contain").classList.remove("blur");
        } else {
            document.getElementById("loading").style.display = "none";
            document.querySelector("._main_contain").classList.remove("blur");
            console.log("No data available");
        }
    } catch (error) {
        document.getElementById("loading").style.display = "none";
        document.querySelector("._main_contain").classList.remove("blur");
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
    const storageReference = storageRef(storage, 'FacultyArea/' + sanitizedFileName);

    try {
        console.log("Uploading image to Firebase Storage...");
        await uploadBytes(storageReference, file);
        console.log("Image uploaded to Firebase Storage");

        console.log("Getting download URL...");
        const downloadURL = await getDownloadURL(storageReference);
        console.log("Download URL obtained: ", downloadURL);

       imageLink=downloadURL;
        console.log("URL saved to the database");
        createFaculty();
        loadFacultyArea();
        // Display the uploaded image
        alert("Image uploaded successfully!");
    } catch (error) {
        console.error("Error uploading image: ", error);
        alert("Error uploading image. Please try again.");
    }
}


async function createFaculty(){
    let name=document.getElementById("name").value;
    let position=document.querySelector('input[name="position"]:checked').value;
    let profile_link=document.getElementById("profile_link").value;
    try{
        const imageRef = ref(db, 'FacultyArea/' + name);
        console.log("Saving URL to the database...");
        await set(imageRef, {
            position:position,
            profileLink:profile_link,
            imageUrl:imageLink
        });
        console.log("URL saved to the database");
    }catch(error){
    
    }
    document.getElementById("name").value="";
    document.getElementById("profile_link").value="";
}
// Ensure DOM is fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    // Attach the event listener to the button
    document.getElementById('uploadButton').addEventListener('click', uploadImage);
   

});


