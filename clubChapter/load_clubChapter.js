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

function createAndAppendElement(parent, elementType, className, textContent = '') {
    const element = document.createElement(elementType);
    element.className = className;
    element.textContent = textContent;
    parent.appendChild(element);
    return element;
  }

async function loadClubChapter() {
    const dbRef = ref(db, 'clubChapter/');
    try {
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const clubChapters = snapshot.val();
        const clubChapterList = document.getElementById('clubChapterList');
        clubChapterList.innerHTML = ''; // Clear the existing list
  
        Object.keys(clubChapters).forEach((key) => {
          const chapter = clubChapters[key];
          const url = chapter.url;
          const clubLink = chapter.club_link;
  
          // Create main club div
          const mainClubDiv = createAndAppendElement(clubChapterList, 'div', 'main_club mb-5');
          createAndAppendElement(mainClubDiv, 'h3', '', key).innerHTML = `<u>${key}</u>`;
  
          // Create club container div
          const clubContainerDiv = createAndAppendElement(mainClubDiv, 'div', 'club_container');
  
          // Add image if URL exists
          if (url) {
            const img = createAndAppendElement(clubContainerDiv, 'img', '', '');
            img.src = url;
            // img.width = 40%;
            // img.height = 40%;
          }
  
          // Add content div
          const contentDiv = createAndAppendElement(clubContainerDiv, 'div', 'content');
  
          // Populate content
          chapter.content.forEach(item => {
            createAndAppendElement(contentDiv, 'h4', '', item.title);
            createAndAppendElement(contentDiv, 'p', '', item.description);
          });
  
          // Add join link button if clubLink is not empty
          if (clubLink) {
            const joinLink = createAndAppendElement(mainClubDiv, 'a', 'btn btn-primary mt-3', 'JOIN LINK');
            joinLink.href = clubLink;
            joinLink.target = "_blank";
          }
        });
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

loadClubChapter();