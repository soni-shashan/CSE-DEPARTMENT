if (sessionStorage.getItem('username')) {
    if(sessionStorage.getItem('rights')==1){
    }
    var name = sessionStorage.getItem('username').substring(0,sessionStorage.getItem('username').indexOf("-"));
    name=name.replace("_"," ");
    name=capitalizeFirstLetter(name);
    console.log(name);
    document.getElementById('welcome_admin').innerText =name +"\nWelcome To Admin Panel";
} else {
    window.location.href = 'index.html'; 
}
    // window.addEventListener('beforeunload', function(event) {
    //     sessionStorage.removeItem('username');
    //     sessionStorage.removeItem('rights');
    // });


    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }