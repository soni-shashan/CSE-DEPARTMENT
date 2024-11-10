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
const auth = getAuth(app);
const db = getDatabase(app);

// Authenticate anonymously
signInAnonymously(auth)
  .then(() => {
    console.log("Signed in anonymously");
  })
  .catch((error) => {
    console.error("Error signing in anonymously: ", error);
  });
  function sanitizeFileName(fileName) {
    return fileName.replace(/[.#$[\]]/g, '_');
}
window.onload=loadCourse('1');
window.onload=loadCourse('2');
window.onload=loadCourse('3');
window.onload=loadCourse('4');


// Function to add a course
async function addCourse() {
  // Get input values
  const courseCode = document.getElementById('course_code').value.trim();
  const courseName = document.getElementById('course_name').value.trim();
  const courseLink = document.getElementById('course_link').value.trim();
  const year = document.getElementById('year').value;

  // Validate input fields
  if (!courseCode || !courseName || !courseLink || !year) {
      alert("Please fill in all fields.");
      return;
  }

  // Reference to the database path for the selected year and course code
  const dbRef = ref(db, `courses/year_${year}/${courseCode}`);

  // Course data object
  const courseData = {
      course_name: courseName,
      course_link: courseLink
  };

  try {
      // Add course to the database
      await set(dbRef, courseData);
      alert("Course added successfully!");

      // Clear input fields
      document.getElementById('course_code').value = '';
      document.getElementById('course_name').value = '';
      document.getElementById('course_link').value = '';
      document.getElementById('year').value = '';
      location.reload();
  } catch (error) {
      console.error("Error adding course: ", error);
      alert("Failed to add course. Please try again.");
  }
}

async function deleteCourse(courseCode, year) {
  // Confirm deletion
  const confirmDelete = confirm(`Are you sure you want to delete the course ${courseCode}?`);
  if (!confirmDelete) return;

  // Reference to the database path for the selected year and course code
  const dbRef = ref(db, `courses/year_${year}/${courseCode}`);

  try {
      // Remove the course from the database
      await remove(dbRef);
      alert("Course deleted successfully!");

      // Optionally, reload the course list to reflect the change
      location.reload();
  } catch (error) {
      console.error("Error deleting course: ", error);
      alert("Failed to delete course. Please try again.");
  }
}

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

              // Delete button
              const deleteBtn = document.createElement('a');
              deleteBtn.classList.add('btn', 'btn-danger','mx-3','mb-3');
              deleteBtn.textContent = 'Delete';
              deleteBtn.onclick = function(event) {
                  event.stopPropagation(); // Prevent triggering listItem onclick
                  deleteCourse(key, year); // Call deleteCourse with course ID and year
              };
              listItem.appendChild(deleteBtn);

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



// Add event listener for adding a course
document.getElementById('addBtn').addEventListener('click', addCourse);
