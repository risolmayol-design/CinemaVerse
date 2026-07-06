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
let favorites = JSON.parse(localStorage.getItem(favoritesKey)) ||[];
let selectedMovie = null;
let selectedMovieGenres = "";
const ExploresList = document.querySelector('.explore-list');
const emptyList = document.querySelector('.empty');
const apiKey = "a4c96da3b2659a6385aaac6c0a5b1c6d";
let genres = {};
const back = document.querySelector('.back');

async function getGenres() {
    const response = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
    );

    const data = await response.json();

    data.genres.forEach(function(genre){
        genres[genre.id] = genre.name;
    });
}

let page = 1;
let isLoading = false;

async function searchMovies(query) {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`
        );

        const data = await response.json();
            if (data.results.length === 0){
            emptyList.classList.add("active");
            ExploresList.innerHTML = ""
            return;
        }
        showMovies(data.results, true);
    } catch (error) {
        console.log(error);
    }
}

async function getMovies(page = 1, clear = true) {
    if (isLoading) return;
    isLoading = true;

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}`
        );

        const data = await response.json();

        showMovies(data.results, clear);
    } catch (error) {
        console.log(error);
    }

    isLoading = false;
}

async function init() {
    await getGenres();
    await getMovies(page, true);
}
init();

window.addEventListener("scroll",function(){
    if (window.scrollY > 50) {
        navbar.classList.add("active");
    }
    else {
        navbar.classList.remove("active");
    }
})


let timeout;

searchInput.addEventListener("input", function () {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
        const search = searchInput.value.trim();

        if (search === "") {
            page = 1;
            getMovies(page, true);
            return;
        }

        searchMovies(search);
    }, 300);
});


function showMovies(movies, clear = true) {
    if (clear) {
        ExploresList.innerHTML = "";
    }
    movies.forEach(function(movie){
        console.log(movie)
        const movieGenres = movie.genre_ids.map(function(id){return genres[id];
        })
        const card = document.createElement("div");
        card.classList.add("movie-card");
        console.log(`https://image.tmdb.org/t/p/w500${movie.poster_path}`);
        card.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                    <div class="movie-info">
                        <h3 class="movie-title">${movie.title}</h3>
                        <div class="movie-meta">
                            <i class="fa-solid fa-star"></i><span class="rating">  ${movie.vote_average.toFixed(1)}</span>
                            <span class="year">${movie.release_date.slice(0,4)}</span>

                        </div>
                    </div>`;

        ExploresList.appendChild(card);

        
        card.addEventListener("click",function(){
        selectedMovie = movie;
        selectedMovieGenres = movieGenres.join(", ");
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
        modalTitle.textContent = movie.title
        modalImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        modalImg.alt = movie.title
        modalGenre.textContent = selectedMovieGenres
        modalRating.textContent = movie.vote_average.toFixed(1)
        modalYear.textContent = movie.release_date.slice(0,4)
        modalDesc.textContent = movie.overview
        updateFavoriteIcon(movie.title)
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

favBtn.addEventListener("click",function(){

    if (!currentUser) {
        window.location.href = "/login-form/login.html";
        return;
    }
    
    if (!selectedMovie) {
        return;
    }

    if (!favorites.some(movie => movie.title === selectedMovie.title)) {
        favorites.push({
            title: selectedMovie.title,
            img: `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`,
            year: selectedMovie.release_date.slice(0,4),
            rating: selectedMovie.vote_average.toFixed(1),
            genre: selectedMovieGenres || "Unknown",
            desc: selectedMovie.overview
        });
        console.log(favorites)
    }
    else {
        favorites = favorites.filter(movie => movie.title !== selectedMovie.title)
    }
    localStorage.setItem(favoritesKey,JSON.stringify(favorites));
    updateFavoriteIcon(selectedMovie.title);

});

window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        page++;
        getMovies(page, false);
    }
});

back.addEventListener("click",function(){
    window.location.href = "/index.html"
})