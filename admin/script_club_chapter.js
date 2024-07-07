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
var content_count=0;
var imageLink;
// Authenticate anonymously
signInAnonymously(auth)
  .then(() => {
    console.log("Signed in anonymously");
    loadClubChapter();
  })
  .catch((error) => {
    console.error("Error signing in anonymously: ", error);
  });
  function sanitizeFileName(fileName) {
    return fileName.replace(/[.#$[\]]/g, '_');
}
  async function deleteClub(key, url) {
    // Delete from Storage
    const storageRefToDelete = storageRef(storage, 'clubChapter/' + url);
    try {
        await storage.deleteObject(storageRefToDelete);
        console.log("Image deleted from Firebase Storage");
    } catch (error) {
        console.error("Error deleting image from Storage: ", error);
    }

    // Delete from Database
    const dbRefToDelete = ref(db, 'clubChapter/' + key);
    try {
        await set(dbRefToDelete, null); // Set to null to delete
        console.log("Image data deleted from Firebase Database");
    } catch (error) {
        console.error("Error deleting image data from Database: ", error);
    }

    // Refresh the list of time tables
    location.reload();
    loadClubChapter();
}
// Function to create and append elements dynamically
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

async function uploadImage() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image to upload.");
        return;
    }

    const sanitizedFileName = sanitizeFileName(file.name);
    const storageReference = storageRef(storage, 'clubChapter/' + sanitizedFileName);

    try {
        console.log("Uploading image to Firebase Storage...");
        await uploadBytes(storageReference, file);
        console.log("Image uploaded to Firebase Storage");

        console.log("Getting download URL...");
        const downloadURL = await getDownloadURL(storageReference);
        console.log("Download URL obtained: ", downloadURL);

       imageLink=downloadURL;
        console.log("URL saved to the database");
        
        // loadClubChapter();
        // Display the uploaded image
        alert("Image uploaded successfully!");
    } catch (error) {
        console.error("Error uploading image: ", error);
        alert("Error uploading image. Please try again.");
    }
}
function createAndAppendElementInput(parent, elementType, className,placeholder='', textContent = '',type='',id='') {
    const element = document.createElement(elementType);
    element.className = className;
    element.textContent = textContent;
    element.placeholder = placeholder;
    element.type = type;
    element.id = id;
    parent.appendChild(element);
    return element;
  }
function createAndAppendElementTextArea(parent, elementType, className,placeholder='', textContent = '',id='',row='') {
    const element = document.createElement(elementType);
    element.className = className;
    element.textContent = textContent;
    element.placeholder = placeholder;
    element.id = id;
    element.row = row;
    parent.appendChild(element);
    return element;
  }
function createAndAppendElementWithID(parent, elementType, className,textContent='',id='') {
    const element = document.createElement(elementType);
    element.className = className;
    element.textContent = textContent;
    element.id = id;
    parent.appendChild(element);
    return element;
  }

async function createClub(){
    let club_link=document.getElementById("club_link").value;
    let contentArray = [];
    for (let i = 0; i < content_count; i++) {
        let title = document.getElementById("text_title_" + i).value;
        let description = document.getElementById("text_description_" + i).value;
        contentArray.push({ title: title, description: description });
    }
    try{
        const imageRef = ref(db, 'clubChapter/' + document.getElementById("title_text").value);
        console.log("Saving URL to the database...");
        await set(imageRef, {
            content:contentArray,
            content_count:content_count,
            url:imageLink,
            club_link:club_link
        });
        console.log("URL saved to the database");
    }catch(error){
    
    }
    document.getElementById("title").value="";
    document.getElementById("club_link").value="";
    document.getElementById('imageInput').value=null;
    for(let i=0;i<content_count;i++){
        document.getElementById("text_description_area_"+i).remove();
    }
}
// Ensure DOM is fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    // Attach the event listener to the button
    document.getElementById('uploadButton').addEventListener('click', uploadImage);
    document.getElementById('addContent').addEventListener('click', ()=>{
        const textAreaDescriptionArea=createAndAppendElementWithID(document.getElementById("text_description_list"),'div','text_description_area_'+content_count,'','text_description_area_'+content_count);
        const textAreaDescriptionAreaContainer=createAndAppendElement(textAreaDescriptionArea,'div','text_description_area');
        const textAreaDescriptionAreaMain=createAndAppendElement(textAreaDescriptionAreaContainer,'div','text_description_area_main');
        createAndAppendElementInput(textAreaDescriptionAreaMain,'input','form-control mb-3','title','','text','text_title_'+content_count);
        createAndAppendElementTextArea(textAreaDescriptionAreaMain,'textarea','form-control mb-3','Enter description here...','','text_description_'+content_count,4);
        content_count++;
        if(content_count==1){
            createAndAppendElementWithID(document.getElementById("addButton"),'button','btn btn-primary mb-3','CREATE CLUB','create_club');
            document.getElementById('create_club').addEventListener('click', createClub);
    }
});

});


