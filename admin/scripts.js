
//   // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
  import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
 

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
  const app=initializeApp(firebaseConfig);
  const db = getDatabase(app);
  if (sessionStorage.getItem('username')) {
    window.location.href = 'home.html'; 
  }
document.getElementById("login").addEventListener('click',function(e){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    username=username.replace(".","-");
    console.log(username);
    const userRef = ref(db, 'user/' + username);
    if(username!=""&&password!=""){
        get(child(ref(db), 'user/' + username)).then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                if(userData.password!=document.getElementById("password").value){
                    alert("Invalid Password!!");
                    document.getElementById("password").value="";
                }else{
                    event.preventDefault();
                    sessionStorage.setItem('username', userData.username);
                    sessionStorage.setItem('rights', userData.rights);
                    window.location.href = 'home.html'; 
                }
            } else {
                console.log();
                alert("No data available for the specified user.");
                document.getElementById("username").value="";
                document.getElementById("password").value="";
            }
        }).catch((error) => {
            console.error("Error reading data:", error);
        });
    }else{
        alert("Enter Necessary Details!!");
    }
});
var form = document.getElementById('loginForm'); 
form.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        document.getElementById("login").click();
    }
});