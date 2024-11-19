// Fetch albums when the page loads
window.addEventListener("DOMContentLoaded", (event) => {
  fetchAllAlbums();
});

// Select necessary elements
const albumsContainer = document.getElementById("albums");
const previousButton = document.querySelector(".bi-chevron-left");
const nextButton = document.querySelector(".bi-chevron-right");
const buonasera = document.getElementById("buonasera");
const altro = document.getElementById("altro");
let isCreateBuonasera = 0; // Flag to check if "Buonasera" section is created
let isCreateAltro = 0; // Flag to check if "Altro" section is created

// Array of genres
const genres = [/* "pop", */ "rock", "jazz","hiphop", "classic", "trans"];
let albums = []; // Array to store album data
let currentAlbumIndex = 0; // Index for currently displayed album

// API Base URL
const API_BASE_URL = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";

// Create an audio element for music playback
const audioPlayer = new Audio();
let isPlaying = false; // Playback state

// Bottom player controls
const playerContainer = document.getElementById("player"); // Bottom player container
const playerTitle = playerContainer.querySelector(".track-title"); // Song title
const playerArtist = playerContainer.querySelector(".track-artist"); // Artist name
const playerCover = playerContainer.querySelector(".album-cover"); // Album cover image
const playPauseBtn = playerContainer.querySelector(".play-pause-btn"); // Play/Pause button
const progressBar = playerContainer.querySelector(".progress-bar"); // Progress bar
const currentTimeEl = playerContainer.querySelector(".current-time"); // Current time display
const totalTimeEl = playerContainer.querySelector(".total-time"); // Total duration display
const volumeBar = playerContainer.querySelector(".volume-bar"); // Volume slider

// Function to fetch album data for all genres
const fetchAllAlbums = () => {
  albums = []; // Clear previous albums

  genres.forEach((genre, index) => {
    fetch(`${API_BASE_URL}${genre}`)
      .then((response) => {
        if (!response.ok) {
          console.error(`Error retrieving data for ${genre}:`, response.status);
          return [];
        }
        return response.json();
      })
      .then((data) => {
        albums = albums.concat(data.data || []); // Append new album data to the array
        if (index === genres.length - 1) {
          currentAlbumIndex = 0; // Reset index
          displayAlbum(); // Display the first album
        }
      })
      .catch((error) => console.error(`Connection error for ${genre}:`, error));
  });
};

// Function to display an album
const displayAlbum = () => {
  // Clear previous content
  albumsContainer.innerHTML = "";

  if (albums.length === 0) {
    albumsContainer.innerHTML = "<p class='text-white'>No albums found.</p>";
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
            <button type="button" class="btn bg-main-section btn-sm rounded-pill font-off fs-7 fw-bold" id="toggle-content"> NASCONDI ANNUNCI</button>
          </div>
          <div id="album-content">
            <a class="text-decoration-none text-white" href="./album.html"><h2 class="card-title display-4 fw-bold text-truncate">${album.album.title}</h2></a>
            <a class="text-decoration-none text-white" href="./artist.html"><p class="card-text lead fs-6"> ${album.artist.name}</p></a>
            <p class="card-text lead fs-6">
              <small class="text-white">Listen to the new single by ${album.artist.name}.</small>
            </p>
            <div class="d-flex align-items-center">
              <button class="text-black rounded-pill fs-7 lead px-4 py-2 fw-bold play-btn" data-preview="${album.preview}" data-title="${album.album.title}" data-artist="${album.artist.name}" data-cover="${album.album.cover_medium}">Play</button>
              <button class="btn btn-secondary text-white rounded-pill fs-7 lead px-4 py-2 fw-bold border border-white border-opacity-25 mx-3">salva</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  albumsContainer.appendChild(albumCard);

  // Manage the Play button
  const playButton = document.querySelector(".play-btn");
  playButton.addEventListener("click", () => {
    const previewUrl = playButton.getAttribute("data-preview");
    const title = playButton.getAttribute("data-title");
    const artist = playButton.getAttribute("data-artist");
    const cover = playButton.getAttribute("data-cover");

    if (isPlaying && audioPlayer.src === previewUrl) {
      // Pause music
      audioPlayer.pause();
      playButton.textContent = "Play";
      playPauseBtn.textContent = "⏯️";
      isPlaying = false;
    } else {
      // Play music
      audioPlayer.src = previewUrl;
      audioPlayer.play();
      isPlaying = true;
      playButton.textContent = "Stop";
      playPauseBtn.textContent = "⏸️";

      // Update bottom player
      playerTitle.textContent = title;
      playerArtist.textContent = artist;
      playerCover.src = cover;
      playerContainer.style.display = "flex";
    }
  });

  // Populate the "Buonasera" section
  if (isCreateBuonasera === 0) {
    for (let i = 1; i < 7; i++) {
      const buonaseraCard = document.createElement("div");
      buonaseraCard.classList.add("col-4", "g-0");
      buonaseraCard.innerHTML = `<div class="card m-0 rounded-1 bg-main-cards me-3 mb-3">
                      <div class="row g-0">
                        <div class="col-3">
                          <img src="${albums[i].album.cover_medium}" class="img-fluid rounded-start object-fit-cover" alt="" />
                        </div>
                        <div class="col-9">
                          <div class="card-body">
                            <p class="card-text text-white fs-6 mt-3 text-truncate">${albums[i].album.title}</p>
                            <p class="card-text lead fs-6">
                             <small class="text-white">${album.artist.name}.</small>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>`;
      buonasera.appendChild(buonaseraCard);
    }
    isCreateBuonasera = 1; // Mark as created
  }

  // Populate the "Altro" section
  if (isCreateAltro === 0) {
    for (let i = 7; i < 12; i++) {
      const altroCard = document.createElement("div");
      altroCard.classList.add("card", "rounded-1", "me-3", "bg-secondary-cards", "text-white", "border-0");
      altroCard.innerHTML = `<div class="p-3">
                      <img src="${albums[i].album.cover_medium}" class="object-fit-cover rounded img-fluid img.object-fit-cover " alt="..." />
                    </div>
                    <div class="card-body">
                      <p class="card-title fw-bold text-truncate ">${albums[i].album.title}</p>
                      <p class="card-text font-off">${albums[i].artist.name}.</p>
                    </div>`;
      altro.appendChild(altroCard);
    }
    isCreateAltro = 1; // Mark as created
  }
};

// Handle the "Next" button
nextButton.addEventListener("click", () => {
  if (albums.length > 0) {
    currentAlbumIndex = (currentAlbumIndex + 1) % albums.length;
    displayAlbum();
  }
});

// Handle the "Previous" button
previousButton.addEventListener("click", () => {
  if (albums.length > 0) {
    currentAlbumIndex = (currentAlbumIndex - 1 + albums.length) % albums.length;
    displayAlbum();
  }
});

// Handle Play/Pause in the bottom player
playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    audioPlayer.pause();
    playPauseBtn.textContent = "⏯️";
    isPlaying = false;
  } else {
    audioPlayer.play();
    playPauseBtn.textContent = "⏸️";
    isPlaying = true;
  }
});

// Manage the volume slider
volumeBar.addEventListener("input", () => {
  audioPlayer.volume = volumeBar.value / 100;
});

// Update progress bar as the song plays
audioPlayer.addEventListener("timeupdate", () => {
  const currentTime = audioPlayer.currentTime;
  const duration = audioPlayer.duration;

  progressBar.value = (currentTime / duration) * 100;
  currentTimeEl.textContent = formatTime(currentTime);
  totalTimeEl.textContent = formatTime(duration);
});

// Change playback position using progress bar
progressBar.addEventListener("input", () => {
  const duration = audioPlayer.duration;
  audioPlayer.currentTime = (progressBar.value / 100) * duration;
});

// Format time for display
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
}