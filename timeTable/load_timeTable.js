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
loadTimeTables();

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
            timeTableList.innerHTML = `<style>
            .card{
                margin:10px;
            }
            `; // Clear the existing list
  
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
                
            });
        } else {
            console.log("No data available");
        }
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Attach the event listener to the button
    loadTimeTables();           
});