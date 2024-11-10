// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getDatabase, ref, get, child, set ,remove} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

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
const db = getDatabase(app);


// Function to load courses for a specific year
async function loadCourse(year) {
    // Display loading and blur the background
    document.getElementById("loading").style.display = "flex";
    document.querySelector(".main_contain").classList.add("blur");
  
    // Reference to the database path for the selected year
    const dbRef = ref(db, `courses/year_${year}`);
  
    try {
        const snapshot = await get(dbRef);
  
        if (snapshot.exists()) {
            const courseList = snapshot.val();
            const courseLists = document.getElementById('courseList');
  
            // Clear the existing course list
            courseLists.innerHTML = ''; 
  
            // Loop through courses and create elements
            Object.keys(courseList).forEach((key) => {
                const url = courseList[key].course_link;
  
                // Course container
                const listItem = document.createElement('div');
                listItem.classList.add('course_container');
  
                // Course ID and name
                const courseId = document.createElement('h2');
                courseId.textContent = key; // Assuming `key` is the course ID
                courseId.id = "courseId";
                
                const line = document.createElement('h2');
                line.classList.add('line');
                line.textContent = '|';
                
                const courseName = document.createElement('h2');
                courseName.textContent = courseList[key].course_name;
                courseName.id = "courseName";
  
                // Set onclick for opening the course link
                listItem.onclick = function() {
                    window.open(url, '_blank');
                };
  
                // Append elements to course container
                listItem.appendChild(courseId);
                listItem.appendChild(line);
                listItem.appendChild(courseName);
  
                // Append course container to course list
                courseLists.appendChild(listItem);
            });
  
            // Hide loading and remove blur
            document.getElementById("loading").style.display = "none";
            document.querySelector(".main_contain").classList.remove("blur");
        } else {
            // If no data, log a message
            document.getElementById("loading").style.display = "none";
            document.querySelector(".main_contain").classList.remove("blur");
            console.log("No data available");
        }
    } catch (error) {
        // Handle errors
        document.getElementById("loading").style.display = "none";
        document.querySelector(".main_contain").classList.remove("blur");
        console.error("Error fetching data: ", error);
    }
  }
window.onload=loadCourse('3');
