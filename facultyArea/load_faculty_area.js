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

window.onload=loadFacultyArea();

async function loadFacultyArea() {
    const dbRef = ref(db, 'FacultyArea/');
    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const facultyArea = snapshot.val();
            const facultyList = document.getElementById('facultyList'); // Assuming there's a ul element with id 'faculty-list'
  
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
  
                facultyList.appendChild(listItem);
            });
  
        } else {
            console.log("No data available");
        }
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
  }