const url = "https://striveschool-api.herokuapp.com/api/deezer/artist/";
const urlTracks = "https://striveschool-api.herokuapp.com/api/deezer/artist//top?limit=50";
const urlParams = new URLSearchParams(window.location.search);
const artistId = urlParams.get("artistId");
function convertSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return { minutes, remainingSeconds };
}

let audioElements = [];
let currentAudio = null;
let currentTracksIndex = 0;
let currentPlay = null;
let isPlaying = false;

const playPauseBtn = document.getElementById("playBtn");

function setupAudioElements(tracks) {
  tracks.forEach((track) => {
    const audio = new Audio(track.preview);

    audioElements.push(audio);
  });
}

function playTracks() {
  if (currentTracksIndex >= audioElements.length) {
    currentTracksIndex = 0;
  }

  audioElements[currentTracksIndex].play();
  audioElements[currentTracksIndex].addEventListener("ended", () => {
    currentTracksIndex++;
    playTracks();
  });
}

function stopTracks() {
  audioElements.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
}

playPauseBtn.addEventListener("click", () => {
  if (!isPlaying) {
    playPauseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="black" class="bi bi-stop-fill" viewBox="0 0 16 16">
  <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5"/>
</svg>`;
    playTracks();
    isPlaying = true;
  } else {
    playPauseBtn.innerHTML = `  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="black" class="bi bi-play-fill" viewBox="0 0 16 16">
                    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
                  </svg>`;
    stopTracks();
    isPlaying = false;
  }
});

fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}`)
  .then((response) => {
    if (response.ok) {
      console.log(response);
      return response.json();
    }
  })
  .then((artistData) => {
    const bannerArtist = document.getElementById("bannerArtist");
    bannerArtist.style.backgroundImage = `url(${artistData.picture_xl})`;
    const nameArtist = document.getElementById("nameArtist");

    nameArtist.textContent = artistData.name;
    const nbFans = document.getElementById("nbFans");
    nbFans.textContent = `${artistData.nb_fan} ascoltatori mensili`;

    const liked = document.getElementById("liked");
    liked.src = artistData.picture_small;
    const pLike = document.getElementById("pLike");
    pLike.textContent = `Di ${artistData.name}`;

    /* const photoSong = document.getElementById("photoSong");
    const nameSong = document.getElementById("nameSong");
    const listeners = document.getElementById("listeners");
    const timeSong = document.getElementById("timeSong");*/
  })

  .catch((err) => console.log(err));
console.log("ciao");

fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=50`)
  .then((response) => {
    if (response.ok) {
      console.log(response);
      return response.json();
    }
  })
  .then((tracksdata) => {
    const tracks=tracksdata.data;
    setupAudioElements(tracksdata.data);
    tracksdata.data.forEach((element, index) => {
      const containerTracks = document.getElementById("containerTracks");
      const tracks = document.createElement("div");
      tracks.classList.add("row", "justify-content-start", "align-items-center", "mb-3", "rounded", "py-1");
      tracks.setAttribute("id", "singleSong");
      tracks.innerHTML = `<div class="col-7 d-flex justify-content-start align-items-center">

                                  <p id="numberSong" class="font-off m-0 fw-light fs-listeners">${index + 1}</p>
                                  <div class="containerPhotoSong mx-3">
                                    <img src="${element.album.cover_medium}
                                    " alt="" id="photoSong" class=" w-100"/>
                                  </div>
                                  <p id="nameSong" class="text-white m-0 fs-single-song text-truncate">${element.title_short}</p>
                                </div>
                                <div class="col-3">
                                  <p id="listeners" class="font-off m-0 fw-light fs-listeners">${element.rank}</p>
                                </div>
                                <div class="col-2">
                                  <p id="timeSong" class="font-off m-0 fw-light fs-listeners">${convertSeconds(element.duration).minutes}:${
        convertSeconds(element.duration).remainingSeconds
      }</p>
                                </div>`;
      tracks.addEventListener("click", () => {
        if (currentAudio && currentPlay === index) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          currentAudio = null;
          currentPlay = null;
          console.log(`Stopped: ${tracks.title}`);
          return;
        }

        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }

        const audio = new Audio(element.preview);
        audio.play();
        currentAudio = audio;
        currentPlay = index;
        console.log(`Playing: ${element.title}`);
      });
      containerTracks.appendChild(tracks);
      
    });
  })

  .catch((err) => console.log(err));

const back = document.getElementById("back");
const forward = document.getElementById("forward");

back.addEventListener("click", () => {
  window.history.back();
});

forward.addEventListener("click", () => {
  window.history.forward();
});








// عناصر پلیر
const playPauseBtn2 = document.getElementById("playPauseBtn2");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const volumeBar = document.getElementById("volumeBar");
const albumCover = document.getElementById("albumCover");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");

// متغیرهای کنترلی

let currentTrackIndex = 0;
let isShuffle = false;
let isRepeat = false;
let tracks = []; // لیست آهنگ‌ها

// مقداردهی پلیر
function initializePlayer(albumTracks) {
  tracks = albumTracks;
  loadTrack(currentTrackIndex);
}

// بارگذاری آهنگ
function loadTrack(index) {
  if (tracks[index]) {
    const track = tracks[index];
    currentAudio = new Audio(track.preview);
    albumCover.src = track.album.cover_medium;
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist.name;

    // بروزرسانی زمان
    currentAudio.addEventListener("loadedmetadata", () => {
      totalTimeEl.textContent = formatTime(currentAudio.duration);
      progressBar.value = 0;
      progressBar.max = Math.floor(currentAudio.duration);
    });

    // بروزرسانی پیشرفت آهنگ
    currentAudio.addEventListener("timeupdate", () => {
      progressBar.value = Math.floor(currentAudio.currentTime);
      currentTimeEl.textContent = formatTime(currentAudio.currentTime);
    });

    // اتمام آهنگ
    currentAudio.addEventListener("ended", () => {
      if (isRepeat) {
        playTrack();
      } else if (isShuffle) {
        currentTrackIndex = Math.floor(Math.random() * tracks.length);
        loadTrack(currentTrackIndex);
        playTrack();
      } else {
        nextTrack();
      }
    });
  }
}

// پخش آهنگ
function playTrack() {
  if (currentAudio) {
    currentAudio.play();
    isPlaying = true;
    playPauseBtn2.textContent = "⏸️";
  }
}

// توقف آهنگ
function pauseTrack() {
  if (currentAudio) {
    currentAudio.pause();
    isPlaying = false;
    playPauseBtn2.textContent = "⏯️";
  }
}

// آهنگ بعدی
function nextTrack() {
  if (currentAudio) {
    currentAudio.pause(); // توقف آهنگ قبلی
    currentAudio.currentTime = 0; // بازگشت به ابتدای آهنگ
  }

  // تغییر به آهنگ بعدی
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(currentTrackIndex);
  playTrack();
}

// آهنگ قبلی
function prevTrack() {
  if (currentAudio) {
    currentAudio.pause(); // توقف آهنگ قبلی
    currentAudio.currentTime = 0; // بازگشت به ابتدای آهنگ
  }
  currentTrackIndex =
    (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrackIndex);
  playTrack();
}

// تغییر وضعیت پخش
playPauseBtn2.addEventListener("click", () => {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
});

// آهنگ بعدی و قبلی
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

// تنظیم صدا
volumeBar.addEventListener("input", () => {
  if (currentAudio) {
    currentAudio.volume = volumeBar.value / 100;
  }
});

// تنظیم پیشرفت آهنگ
progressBar.addEventListener("input", () => {
  if (currentAudio) {
    currentAudio.currentTime = progressBar.value;
  }
});

// تغییر حالت Shuffle
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.color = isShuffle ? "green" : "black";
});

// تغییر حالت Repeat
repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.style.color = isRepeat ? "green" : "black";
});

// فرمت زمان
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
}

// مقداردهی اولیه با API
fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=50`)
  .then((res) => res.json())
  .then((data) => {
    initializePlayer(data.data);
  })
  .catch((err) => console.error(err));