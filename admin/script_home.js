// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getDatabase, ref, get, child, set } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  })
  .catch((error) => {
    console.error("Error signing in anonymously: ", error);
  });
if (sessionStorage.getItem('username')) {
    if(sessionStorage.getItem('rights')==1){
    }
    var name = sessionStorage.getItem('username').substring(0,sessionStorage.getItem('username').indexOf("-"));
    name=name.replace("_"," ");
    name=capitalizeFirstLetter(name);
    console.log(name);
    document.getElementById('welcome_admin').innerText ="Welcome to the Admin Panel!";
    document.getElementById('name').innerText ='Dear '+name+',';
} else {
    window.location.href = 'index.html'; 
}
        
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    document.getElementById("logout").addEventListener('click',()=>{
        logout();
    });

let logoutTimer;

function resetLogoutTimer() {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(logout, 300000); // 5 minutes
}

function logout() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('rights');
    sessionStorage.removeItem('password');
    window.location.href="./index.html" // Adjust to your logout URL
}

window.onload = resetLogoutTimer;
window.onmousemove = resetLogoutTimer;
window.onmousedown = resetLogoutTimer;  // Detects mouse clicks
window.ontouchstart = resetLogoutTimer; // Detects touch events
window.onclick = resetLogoutTimer;      // Detects clicks
window.onkeypress = resetLogoutTimer;   // Detects keyboard activity

// Optional: Add visibility change detection
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearTimeout(logoutTimer); // Stop the timer when the page is not active
    } else {
        resetLogoutTimer(); // Restart the timer when the page becomes active again
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Attach the event listener to the button
    document.getElementById('change_password').addEventListener('click', changePassword);
});
async function changePassword() {
    let newPassword = prompt("Please Enter New Password", sessionStorage.getItem('password'));
    if (newPassword != null) {
        const change_password = ref(db, 'user/' + sessionStorage.getItem('username'));
        await set(change_password, {
            username:sessionStorage.getItem('username'),
            password:newPassword,
            rights:sessionStorage.getItem('rights')
        });
        sessionStorage.removeItem('password');
        sessionStorage.setItem('password', newPassword);
    }
  }