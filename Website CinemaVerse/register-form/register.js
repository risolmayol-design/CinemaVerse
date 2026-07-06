const username = document.querySelector('.input-username');
const password = document.querySelector(".input-password");
const togglePassword = document.querySelector('.show-toggle i');
const cpassword = document.querySelector('.cpassword');
const cpToggle = document.querySelector('.show-cpToggle i');
const terms = document.querySelector('#terms');
const registerBtn = document.querySelector('.register');
const notif = document.querySelector('.notif');
const notifText = document.querySelector('.info-txt');
const notifIcon = document.querySelector('.notif-info i');
const closeNotif = document.querySelector('.close');
const registerForm = document.querySelector('.card-content')
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

cpToggle.addEventListener("click", function(){
    if (cpassword.type === "password") {
        cpassword.type = "text";
    }
    else {
        cpassword.type = "password";
    }
    cpToggle.classList.toggle("fa-eye");
    cpToggle.classList.toggle("fa-eye-slash");
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


registerForm.addEventListener("submit", function(event){
    event.preventDefault();
    const usernameInput = username.value.trim();
    const passwordInput = password.value;
    const cpasswordInput = cpassword.value;
    const termsBox = terms.checked;
    const usernameExist = users.some(function(user){
        return user.username === usernameInput;
    })
    

    if (usernameInput === "" || usernameInput === " " ) {
        showNotification("Please enter a username!", "error");
        return;
    }
    
    if (passwordInput.trim() === "" || passwordInput.trim() === " " ) {
        showNotification("Please enter a password!", "error");
        return;
    }
    if (/\s/.test(passwordInput)) {
        showNotification("Password cannot contain spaces!", "error");
        return;
    }
    if (cpasswordInput !== passwordInput) {
        showNotification("Passwords do not match", "error");
        return;
    }

    if (!termsBox) {
        showNotification("Please agree to the Terms!", "exclamation");
        return;
    }

    if (usernameExist) {
        showNotification("Username already exists!", "exclamation");
        return;
    }

    const user = {
        username : usernameInput,
        password : passwordInput
    }

    users.push(user);
    localStorage.setItem("users",JSON.stringify(users));
    registerForm.reset();
    showNotification("Account created! Redirecting to login..", "succes");
    setTimeout(function(){
        window.location.href = "/login-form/login.html";
    },1500);
})

closeNotif.addEventListener("click",function(){
    notif.classList.remove("active");
})

notif.addEventListener("click",function(){
    if (event.target === notif) {
        notif.classList.remove("active");
    }
})