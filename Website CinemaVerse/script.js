const questions = document.querySelectorAll('.faq-question');
const answers = document.querySelectorAll('.faq-answer');
const icons = document.querySelectorAll('.btn-faq');
const searchInput = document.querySelector('.search-input');
const movieCards = document.querySelectorAll('.movie-card');
const searchResults = document.querySelector('.search-result');
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.menu ul li a');
const modal = document.querySelector('.modal');
const closeBtn = document.querySelector('.close-btn');
const favBtn = document.querySelector('.fav-btn');
const heartIcon = favBtn.querySelector("i");
const modalTitle = document.querySelector('.modal-title');
const modalImg = document.querySelector('.modal-img img');
const modalYear = document.querySelector('.modal-genre .year p');
const modalGenre = document.querySelector('.modal-genre .genre p');
const modalRating = document.querySelector('.modal-genre .rating p');
const modalDesc = document.querySelector('.modal-description p');
const loginBtn = document.querySelector('.login-btn');
const accountMenu = document.querySelector('.account-menu');
const accountName = document.querySelector('.account-name');
const accountBtn = document.querySelector('.account-btn');
const accountDropdown = document.querySelector('.account-dropdown');
const iconDropdown = document.querySelector('.account-btn .icon-dropdown');
const logoutBtn = document.querySelector('.logout-btn');
const notif = document.querySelector('.notif');
const notifText = document.querySelector('.info-txt');
const notifIcon = document.querySelector('.notif-info i');
const closeNotif = document.querySelector('.close');
const explore = document.querySelector('.btn-explore button');
const movieList = document.querySelector('.movie-list');
const popularList = document.querySelector('.popular-list');
const stars = document.querySelectorAll('.stars i');
const submitRating = document.querySelector('.submit-rating');
const ratingInfo = document.querySelector('.rating-info');
const currentUser = localStorage.getItem("currentUser");
const favoritesKey = `favorites_${currentUser}`;
const ratingsKey = `ratings_${currentUser}`;
let ratings = JSON.parse(localStorage.getItem(ratingsKey));
if (!ratings || typeof ratings !== "object" || Array.isArray(ratings)) {
    ratings = {};
}
console.log(ratings);
console.log(Array.isArray(ratings));
let favorites = JSON.parse(localStorage.getItem(favoritesKey)) ||[];
let notifTimer;
const apiKey = "a4c96da3b2659a6385aaac6c0a5b1c6d";
let genres = {};
let selectedRating = 0;
let selectedMovie = null;

async function getGenres(){

    const response = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
    );

    const data = await response.json();

    data.genres.forEach(function(genre){
        genres[genre.id] = genre.name;
    });

}

async function getTrendings(){

    const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`
    );

    const data = await response.json();

    showMovies(data.results,movieList);

}

async function getPopulars(){

    const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
    );

    const data = await response.json();

    showMovies(data.results,popularList);

}


function showMovies(movies, container) {
      container.innerHTML = "";

    movies.slice(0,4).forEach(function(movie){

        const card=document.createElement("div");

        card.classList.add("movie-card");

        card.innerHTML=`
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">

            <div class="movie-info">

                <h3 class="movie-title">${movie.title}</h3>

                <div class="movie-meta">

                    <i class="fa-solid fa-star"></i>

                    <span class="rating">${movie.vote_average.toFixed(1)}</span>

                    <span class="year">${movie.release_date.slice(0,4)}</span>

                </div>

            </div>
        `;

        container.appendChild(card);

    card.addEventListener("click", function () {
    selectedMovie = movie;
    const saveRating = ratings[selectedMovie.title];
    selectedRating = 0;
    if (saveRating) {
        selectedRating = saveRating;
        submitRating.style.display = "none";
         ratingInfo.textContent = `You rated this movie ${selectedRating}/5`;
         stars.forEach(function(star){
    if(Number(star.dataset.value) <= saveRating){

        star.classList.remove("fa-regular");
        star.classList.add("fa-solid");

    }else{

        star.classList.remove("fa-solid");
        star.classList.add("fa-regular");

    }

});
    }
    else {
        selectedRating = 0;
        submitRating.style.display = "block"
        ratingInfo.textContent = "";
        stars.forEach(function(star){
        star.classList.remove("fa-solid");
        star.classList.add("fa-regular");
        })
    }
    const movieGenres = movie.genre_ids.map(id => genres[id]);
    modalTitle.textContent = movie.title;
    modalImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    modalImg.alt = movie.title;
    modalYear.textContent = movie.release_date.slice(0, 4);
    modalRating.textContent = movie.vote_average.toFixed(1);
    modalDesc.textContent = movie.overview;
    modalGenre.textContent = movieGenres.join(", "); 
    updateFavoriteIcon(movie.title);

    modal.classList.add("active");
    document.body.classList.add("no-scroll");
});

    });

}

async function init() {
    await getPopulars();
    await getTrendings();
    await getGenres();
}
init();


if (currentUser) {
    console.log("User login",currentUser);
    loginBtn.style.display = "none";
    accountMenu.style.display = "flex";
    accountName.textContent = currentUser;
}
else {
    console.log("Belom login");
    loginBtn.style.display = "flex";
    accountMenu.style.display = "none";
}

window.addEventListener("scroll",function(){
    if(window.scrollY > 50) {
        navbar.classList.add("active");
    }
    else {
        navbar.classList.remove("active");
    }
});

submitRating.addEventListener("click",function(){
    console.log("kepencet")
    console.log(ratingsKey)
    console.log(ratings)

     if (!currentUser) {
        window.location.href = "/login-form/login.html";
        return;
    }

    if(selectedRating === 0) {
        showNotification("Please select a rating first!","exclamation");
        return;
    }
    ratings[selectedMovie.title] = selectedRating;
    console.log(ratings);
    console.log(selectedMovie.title);
    localStorage.setItem(ratingsKey,JSON.stringify(ratings));
    console.log(localStorage.getItem(ratingsKey));
    submitRating.style.display ="none";
    ratingInfo.textContent = `You rated this movie ${selectedRating}/5`
})

explore.addEventListener("click",function(){
     if (!currentUser) {
        window.location.href = "/login-form/login.html";
        return;
    }
    window.location.href = "/explore-page/explore.html";
})

window.addEventListener("scroll",function(){
    let current = ""
    sections.forEach(function(section){
     const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
    }
    })

    navLinks.forEach(function(link){
        link.classList.remove("active")
        if (link.getAttribute("href") === "#" + current){
            link.classList.add("active")
        }
    })
   
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
    },5000)
}

closeNotif.addEventListener("click",function(){
    notif.classList.remove("active");
})

notif.addEventListener("click",function(){
    if (event.target === notif) {
        notif.classList.remove("active");
    }
})

accountBtn.addEventListener("click",function(){
    accountDropdown.classList.toggle("active");
    iconDropdown.classList.toggle("fa-chevron-down");
    iconDropdown.classList.toggle("fa-chevron-up");
})

logoutBtn.addEventListener("click",function(){
    localStorage.removeItem("currentUser");
    window.location.reload();
})

questions.forEach(function(question){
    question.addEventListener("click",function(){
        const answer = question.parentElement.querySelector('.faq-answer');
        const icon = question.parentElement.querySelector('.btn-faq');
        
        answers.forEach(function(item){
            if(item!==answer) {
                item.classList.remove("active");
            }
        });

        icons.forEach(function(btnIcon){
            if(btnIcon!==icon) {
                btnIcon.textContent = "+";
            }
        });
        

        answer.classList.toggle("active");

       if(answer.classList.contains("active")) {
            icon.textContent = "-";
        }
        else {
            icon.textContent = "+";
        }

    });
});

function updateFavoriteIcon(title) {
    if (favorites.some(movie => movie.title === title)) {
        heartIcon.classList.remove("fa-regular");
        heartIcon.classList.add("fa-solid");
    }
    else {
        heartIcon.classList.remove("fa-solid");
        heartIcon.classList.add("fa-regular");
    }
}

closeBtn.addEventListener("click",function(){
    modal.classList.remove("active");
     document.body.classList.remove("no-scroll");
})

modal.addEventListener("click",function(){
    if(event.target === modal) {
        modal.classList.remove("active");
        document.body.classList.remove("no-scroll");
    }
})

favBtn.addEventListener("click",function(){
    const title = modalTitle.textContent;

    if (!currentUser) {
        window.location.href = "/login-form/login.html";
        return;
    }
    
    if (!favorites.some(movie => movie.title === title)) {
        favorites.push({
            title: modalTitle.textContent,
            img: modalImg.src,
            year: modalYear.textContent,
            rating: modalRating.textContent,
            genre: modalGenre.textContent,
            desc: modalDesc.textContent
        });
    }
    else {
        favorites = favorites.filter(function(movie){
            return movie.title!==title;
        });
    }
    localStorage.setItem(favoritesKey,JSON.stringify(favorites));
    updateFavoriteIcon(title);

});

stars.forEach(function(star){
    star.addEventListener("click",function(){
        selectedRating = Number(star.dataset.value);
        stars.forEach(function(item){
            item.classList.remove("fa-solid");
            item.classList.add("fa-regular");
            if (Number(item.dataset.value)<=selectedRating) {
                item.classList.remove("fa-regular");
                item.classList.add("fa-solid");
            }
            else {
                item.classList.remove("fa-solid");
                item.classList.add("fa-regular");
            }
        })
    })
})
