const password = document.querySelector(".input-password");
const togglePassword = document.querySelector('.show-toggle i');
const loginForm = document.querySelector('.card-content');
const notif = document.querySelector('.notif');
const notifText = document.querySelector('.info-txt');
const notifIcon = document.querySelector('.notif-info i');
const closeNotif = document.querySelector('.close');
const usernameInput = document.querySelector('.input-username');
const passwordInput = document.querySelector('.input-password');
let users = JSON.parse(localStorage.getItem("users")) || [];
let notifTimer;

togglePassword.addEventListener("click", function(){
    if (password.type === "password") {
        password.type = "text";
        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");
    }
    else {
        password.type = "password";
        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");
    }
})

function showNotification(message, type){
    if (type === "error") {
        notifIcon.classList.remove("fa-circle-check");
        notifIcon.classList.remove("fa-circle-exclamation");
        notifIcon.classList.add("fa-circle-xmark");
        notifIcon.classList.add("error");
    }
    if (type === "exclamation") {
        notifIcon.classList.remove("fa-circle-xmark");
        notifIcon.classList.remove("fa-circle-check");
        notifIcon.classList.add("fa-circle-exclamation");
        notifIcon.classList.add("exclamation");
    }
    if (type === "succes") {
        notifIcon.classList.remove("fa-circle-xmark");
        notifIcon.classList.remove("fa-circle-exclamation")
        notifIcon.classList.add("fa-circle-check");
        notifIcon.classList.add("succes");
    }

    notifText.textContent = message;
    notif.classList.add("active");
    clearTimeout(notifTimer);
    notifTimer = setTimeout(function(){
        notif.classList.remove("active");
    },3000)
}

loginForm.addEventListener("submit",function(event){
    event.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (username === "" || username === " ") {
        showNotification("Please enter a username!", "error")
        return;
    }

    if (password.trim() === "" || password.trim() === " ") {
        showNotification("Please enter a password!", "error")
        return;
    }

    if (/\s/.test(password)) {
        showNotification("Password cannot contains space!", "error");
        return
    }
    
    const user = users.find(function(user){
        return username ===  user.username && password === user.password;
    })

    if (!user) {
        showNotification("Invalid username or password.","error");
        return;
    }

    localStorage.setItem("currentUser",user.username);
    window.location.href = "/index.html";
    
})

closeNotif.addEventListener("click",function(){
    notif.classList.remove("active");
})

notif.addEventListener("click",function(){
    if (event.target === notif) {
        notif.classList.remove("active");
    }
})