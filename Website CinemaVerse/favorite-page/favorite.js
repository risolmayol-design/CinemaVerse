const movieCards = document.querySelectorAll('.movie-card');
const searchResults = document.querySelector('.search-result');
const navbar = document.querySelector('.navbar');
const searchInput = document.querySelector('.search-input')
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
const title = document.querySelector('.movie-title');
const img = document.querySelector('img');
const year = document.querySelector('.year');
const rating = document.querySelector('.rating');
const currentUser = localStorage.getItem("currentUser");
const stars = document.querySelectorAll('.stars i');
const submitRating = document.querySelector('.submit-rating');
const ratingInfo = document.querySelector('.rating-info');
const favoritesKey = `favorites_${currentUser}`;
const ratingsKey = `ratings_${currentUser}`;
let ratings = JSON.parse(localStorage.getItem(ratingsKey));
if (!ratings || typeof ratings !== "object" || Array.isArray(ratings)) {
    ratings = {};
}
let selectedRating = 0;
let selectedMovie = null;
let favorites = JSON.parse(localStorage.getItem(favoritesKey)) ||[];
const favoritesList = document.querySelector('.favorite-list');
const emptyList = document.querySelector('.empty');
const Back = document.querySelector('.back');

if (!currentUser) {
    window.location.href = "/login-form/login.html"
}

window.addEventListener("scroll",function(){
    if (window.scrollY > 50) {
        navbar.classList.add("active");
    }
    else {
        navbar.classList.remove("active");
    }
})



Back.addEventListener("click",function(){
    window.location.href = "/index.html"
})

if (favorites.length === 0) {
    emptyList.classList.add("active");
}
else {
    favorites.forEach(function(movie){
    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.innerHTML = ` <img src="${movie.img}" alt="${movie.title}">
                    <div class="movie-info">
                        <h3 class="movie-title">${movie.title}</h3>
                        <div class="movie-meta">
                            <i class="fa-solid fa-star"></i><span class="rating">  ${movie.rating}</span>
                            <span class="year">${movie.year}</span>

                        </div>
                    </div>`
    favoritesList.appendChild(card);

    searchInput.addEventListener("input",function(){
    const search = searchInput.value;
    if (search === " ") {
        favoritesList.style.display = ""
        return;
    }
    const title = card.querySelector('.movie-title').textContent.toLowerCase();

    if (title.includes(search)) {
        card.style.display = "";
    }
    else {
        card.style.display = "none";
    }
})

    card.addEventListener("click",function(){
    const saveRating = ratings[movie.title];
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
        modalTitle.textContent = movie.title
        modalImg.src = movie.img
        modalImg.alt = movie.title
        modalGenre.textContent = movie.genre || ""
        modalRating.textContent = movie.rating
        modalYear.textContent = movie.year
        modalDesc.textContent = movie.desc
        updateFavoriteIcon(movie.title);
        modal.classList.add("active");
        document.body.classList.add("no-scroll");
    })
})
}

submitRating.addEventListener("click",function(){
    console.log("kepencet")
    console.log(ratingsKey)
    console.log(ratings)
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
    
    favorites = favorites.filter(function(movie){
        return movie.title !== title;
    });

    localStorage.setItem(favoritesKey,JSON.stringify(favorites));
    updateFavoriteIcon(title);
    window.location.reload();
});