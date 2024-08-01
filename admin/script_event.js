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
var imageLinks = []; // Array to hold multiple image URLs

// Authenticate anonymously
signInAnonymously(auth)
  .then(() => {
    console.log("Signed in anonymously");
    loadEvents();
  })
  .catch((error) => {
    console.error("Error signing in anonymously: ", error);
  });

function sanitizeFileName(fileName) {
    return fileName.replace(/[.#$[\]]/g, '_');
}

async function uploadImages() {
    document.getElementById("loading").style.display = "flex";
    document.querySelector("._main_contain").classList.add("blur");
    const fileInput = document.getElementById('imageInput');
    const files = fileInput.files;

    if (files.length === 0) {
        alert("Please select images to upload.");
        return;
    }

    imageLinks = []; // Clear the previous URLs

    try {
        for (const file of files) {
            const sanitizedFileName = sanitizeFileName(file.name);
            const storageReference = storageRef(storage, 'Events/' + sanitizedFileName);

            console.log("Uploading image to Firebase Storage...");
            await uploadBytes(storageReference, file);
            console.log("Image uploaded to Firebase Storage");

            console.log("Getting download URL...");
            const downloadURL = await getDownloadURL(storageReference);
            console.log("Download URL obtained: ", downloadURL);

            imageLinks.push(downloadURL);  // Save each URL
        }
        document.getElementById("loading").style.display = "none";
       document.querySelector("._main_contain").classList.remove("blur");
        console.log("All images uploaded successfully:", imageLinks);
        createEvent(); // Call function to save event data with image URLs
        alert("All images uploaded successfully!");

    } catch (error) {
        console.error("Error uploading images: ", error);
        alert("Error uploading images. Please try again.");
        document.getElementById("loading").style.display = "none";
        document.querySelector("._main_contain").classList.remove("blur");
    }
}

async function createEvent(){
    document.getElementById("loading").style.display = "flex";
    document.querySelector("._main_contain").classList.add("blur");
    let eventName = document.getElementById("eventName").value;
    let description = document.getElementById("description").value;

    try {
        const eventRef = ref(db, 'Events/' + eventName);
        console.log("Saving event data to the database...");
        await set(eventRef, {
            description: description,
            imageUrls: imageLinks,
            name:eventName
        });
        console.log("Event data saved to the database");
        document.getElementById("loading").style.display = "none";
        document.querySelector("._main_contain").classList.remove("blur");
    } catch (error) {
        console.error("Error saving event data: ", error);
        document.getElementById("loading").style.display = "none";
        document.querySelector("._main_contain").classList.remove("blur");
    }

    // Clear the form fields
    document.getElementById("eventName").value = "";
    document.getElementById("description").value = "";
}

async function loadEvents() {
    document.getElementById("loading").style.display = "flex";
    document.querySelector("._main_contain").classList.add("blur");
    const dbRef = ref(db, 'Events'); // Adjust the path to your events data
    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const events = snapshot.val();
            console.log('Fetched events:', events); // Log the events object to check its structure

            if (events && typeof events === 'object') {
                const eventsList = document.getElementById('eventsList');
                eventsList.innerHTML = ''; // Clear existing items

                // Iterate over each event in the database
                Object.keys(events).forEach(eventId => {
                    const event = events[eventId];
                    console.log('Processing event:', event); // Log each event

                    // Create a list item for each event
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';

                    // Create carousel for event images
                    const carouselDiv = document.createElement('div');
                    carouselDiv.className = 'carousel slide';
                    carouselDiv.id = `eventCarousel-${eventId}`;
                    carouselDiv.setAttribute('data-bs-ride', 'carousel');

                    const carouselInnerDiv = document.createElement('div');
                    carouselInnerDiv.className = 'carousel-inner';

                    // Add carousel items for each image
                    if (Array.isArray(event.imageUrls)) {
                        event.imageUrls.forEach((imageSrc, index) => {
                            const carouselItemDiv = document.createElement('div');
                            carouselItemDiv.className = `carousel-item ${index === 0 ? 'active' : ''}`;
                            const img = document.createElement('img');
                            img.src = imageSrc;
                            img.className = 'd-block w-100';
                            img.alt = `Event Photo ${index + 1}`;
                            carouselItemDiv.appendChild(img);
                            carouselInnerDiv.appendChild(carouselItemDiv);
                        });
                    } else {
                        console.warn('Event imageUrls are not in the expected array format:', event.imageUrls);
                        document.getElementById("loading").style.display = "none";
                        document.querySelector("._main_contain").classList.remove("blur");
                    }

                    carouselDiv.appendChild(carouselInnerDiv);

                    // Add carousel controls
                    const prevButton = document.createElement('button');
                    prevButton.className = 'carousel-control-prev';
                    prevButton.type = 'button';
                    prevButton.setAttribute('data-bs-target', `#eventCarousel-${eventId}`);
                    prevButton.setAttribute('data-bs-slide', 'prev');
                    const prevIcon = document.createElement('span');
                    prevIcon.className = 'carousel-control-prev-icon';
                    prevButton.appendChild(prevIcon);
                    const prevText = document.createElement('span');
                    prevText.className = 'visually-hidden';
                    prevText.textContent = 'Previous';
                    prevButton.appendChild(prevText);

                    const nextButton = document.createElement('button');
                    nextButton.className = 'carousel-control-next';
                    nextButton.type = 'button';
                    nextButton.setAttribute('data-bs-target', `#eventCarousel-${eventId}`);
                    nextButton.setAttribute('data-bs-slide', 'next');
                    const nextIcon = document.createElement('span');
                    nextIcon.className = 'carousel-control-next-icon';
                    nextButton.appendChild(nextIcon);
                    const nextText = document.createElement('span');
                    nextText.className = 'visually-hidden';
                    nextText.textContent = 'Next';
                    nextButton.appendChild(nextText);

                    carouselDiv.appendChild(prevButton);
                    carouselDiv.appendChild(nextButton);

                    // Create card for event details
                    const cardDiv = document.createElement('div');
                    cardDiv.className = 'card bg-light';
                    const cardBodyDiv = document.createElement('div');
                    cardBodyDiv.className = 'card-body';

                    const cardTitle = document.createElement('h5');
                    cardTitle.className = 'card-title';
                    cardTitle.textContent = event.name || 'Unnamed Event'; // Default title if name is missing
                    cardBodyDiv.appendChild(cardTitle);

                    const cardText = document.createElement('p');
                    cardText.className = 'card-text';
                    cardText.textContent = event.description || 'No description available'; // Default description if missing
                    cardBodyDiv.appendChild(cardText);

                    cardDiv.appendChild(cardBodyDiv);

                    // Append carousel and card to the list item
                    listItem.appendChild(carouselDiv);
                    listItem.appendChild(cardDiv);

                    // Append the list item to the events list
                    eventsList.appendChild(listItem);
                });
            } else {
                console.error("Events data is not in the expected format or is empty");
                document.getElementById("loading").style.display = "none";
                document.querySelector("._main_contain").classList.remove("blur");
            }
        } else {
            console.log("No event data found");
            document.getElementById("loading").style.display = "none";
            document.querySelector("._main_contain").classList.remove("blur");
        }
    } catch (error) {
        console.error("Error fetching event data: ", error);
        document.getElementById("loading").style.display = "none";
          document.querySelector("._main_contain").classList.remove("blur");
    }
}



// Ensure DOM is fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('uploadButton').addEventListener('click', uploadImages);
});
