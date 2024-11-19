// انتخاب عناصر مورد نیاز
const albumsContainer = document.getElementById("albums");
const previousButton = document.querySelector(".bi-chevron-left");
const nextButton = document.querySelector(".bi-chevron-right");

// آرایه ژانرها
const genres = ["pop", "rock", "jazz", "classical", "hiphop","classic","trans"];
let albums = [];
let currentAlbumIndex = 0;

// API Base URL
const API_BASE_URL = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";

// ساخت یک تگ Audio برای پخش موسیقی
const audioPlayer = new Audio();
let isPlaying = false; // وضعیت پخش موسیقی

// تابع برای گرفتن اطلاعات آلبوم‌ها از تمام ژانرها
const fetchAllAlbums = () => {
  albums = []; // پاک کردن آلبوم‌های قبلی

  genres.forEach((genre, index) => {
    fetch(`${API_BASE_URL}${genre}`)
      .then((response) => {
        if (!response.ok) {
          console.error(`Errore durante il recupero dei dati per ${genre}:`, response.status);
          return [];
        }
        return response.json();
      })
      .then((data) => {
        albums = albums.concat(data.data || []); // اضافه کردن آلبوم‌ها به آرایه
        if (index === genres.length - 1) {
          currentAlbumIndex = 0; // ریست اندیس
          displayAlbum();
        }
      })
      .catch((error) => console.error(`Errore durante la connessione per ${genre}:`, error));
  });
};

// تابع برای نمایش یک آلبوم
const displayAlbum = () => {
  // پاک کردن محتوای قبلی
  albumsContainer.innerHTML = "";

  if (albums.length === 0) {
    albumsContainer.innerHTML = "<p class='text-white'>Nessun album trovato.</p>";
    return;
  }

  const album = albums[currentAlbumIndex];

  const albumCard = document.createElement("div");
  albumCard.classList.add("card", "mb-3", "rounded-0", "border-0", "text-white", "w-100", "gradient");
  albumCard.setAttribute("id", "album-card");

  albumCard.innerHTML = `
    <div class="row g-0 justify-content-between">
      <div class="col-3 p-2">
        <img src="${album.album.cover_medium}" class="img-fluid my-3 mx-2" alt="${album.album.title}" />
      </div>
      <div class="col-md-9">
        <div class="card-body">
          <div class="mb-2 d-flex justify-content-between">
            <p class="fs-7">ALBUM</p>
            <button type="button" class="btn bg-main-section btn-sm rounded-pill font-off fs-7 fw-bold" id="toggle-content">NASCONDI ANNUNCI</button>
          </div>
          <div id="album-content">
            <h2 class="card-title display-4 fw-bold">${album.album.title}</h2>
            <p class="card-text lead fs-6">Artista: ${album.artist.name}</p>
            <p class="card-text lead fs-6">
              <small class="text-white">Album pubblicato da ${album.artist.name}.</small>
            </p>
            <div class="d-flex align-items-center">
              <button class="btn btn-outline-success spotify text-black rounded-pill fs-7 lead px-4 py-2 fw-bold play-btn" data-preview="${album.preview}">Play</button>
              <a href="#" class="btn btn-outline-dark text-white rounded-pill fs-7 lead px-4 py-2 fw-bold border border-white border-opacity-25 mx-3 stop-btn">Stop</a>
              <a href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#B3B3B3" class="text-white bi bi-three-dots" viewBox="0 0 16 16">
                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  albumsContainer.appendChild(albumCard);

  
// مدیریت دکمه Play
const playButton = document.querySelector(".play-btn"); // دکمه Play
playButton.addEventListener("click", () => {
  const previewUrl = playButton.getAttribute("data-preview");

  if (audioPlayer.src !== previewUrl) {
    audioPlayer.src = previewUrl; // تنظیم URL موسیقی
  }
  audioPlayer.play(); // پخش موسیقی
  isPlaying = true;
});

// مدیریت دکمه Stop
const stopButton = document.querySelector(".stop-btn"); // دکمه Stop
stopButton.addEventListener("click", () => {
  if (isPlaying) {
    audioPlayer.pause(); // توقف موسیقی
    audioPlayer.currentTime = 0; // بازگرداندن به ابتدای موسیقی
    isPlaying = false;
  }
});
};

// مدیریت دکمه "بعدی"
nextButton.addEventListener("click", () => {
  if (albums.length > 0) {
    currentAlbumIndex = (currentAlbumIndex + 1) % albums.length;
    displayAlbum();
  }
});

// مدیریت دکمه "قبلی"
previousButton.addEventListener("click", () => {
  if (albums.length > 0) {
    currentAlbumIndex = (currentAlbumIndex - 1 + albums.length) % albums.length;
    displayAlbum();
  }
});

// گرفتن آلبوم‌ها هنگام بارگذاری صفحه
fetchAllAlbums();
