//import Vibrant from "node-vibrant";

const url = "https://striveschool-api.herokuapp.com/api/deezer/album/";

const urlParams = new URLSearchParams(window.location.search);
const albumId = urlParams.get("albumId");

const albumContainer = document.getElementById("album_container");

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
    playPauseBtn.innerHTML = ` 
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="black" class="bi bi-stop-fill" viewBox="0 0 16 16">
        <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5" />
      </svg>
    `;
    playTracks();
    isPlaying = true;
  } else {
    playPauseBtn.textContent = "Play";
    stopTracks();
    isPlaying = false;
  }
});

fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`)
  .then((response) => {
    if (response.ok) {
      console.log(response);

      return response.json();
    }
  })
  .then((albumData) => {
    console.log(albumData.cover_big);

    const albumImage = document.getElementById("albumImage");
    const albumTitle = document.getElementById("albumTitle");
    const artistName = document.getElementById("artistName");
    const smallImage = document.getElementById("smallImage");
    const year = document.getElementById("year");
    const numberOfSongs = document.getElementById("numberOfSongs");
    const totalTime = document.getElementById("totalTime");

    albumImage.src = albumData.cover_big;

    /*const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    albumImage.crossOrigin = "anonymous";
    albumImage.src = proxyUrl + albumData.cover_big;

    albumImage.onload = () => {
      const vibrant = new Vibrant(albumImage);
      vibrant.getPalette().then((palette) => {
        const dominantColor = palette.Vibrant.getHex();
        console.log("Dominant Color:", dominantColor);
        albumContainer.style.backgroundColor = dominantColor;
      });
    };*/
    albumTitle.textContent = albumData.title;
    artistName.textContent = albumData.artist.name;
    smallImage.src = albumData.cover_small;
    year.textContent = albumData.release_date;
    numberOfSongs.textContent = ` Number of tracks: ${albumData.nb_tracks}`;
    console.log(convertSeconds(albumData.duration));
    totalTime.textContent = `${convertSeconds(albumData.duration).minutes} minutes ${convertSeconds(albumData.duration).remainingSeconds} seconds`;
    albumData.tracks.data.forEach((element, index) => {
      const tracksContainer = document.getElementById("tracksContainer");
      const track = document.createElement("div");
      track.classList.add("row", "mt-3", "justify-content-start", "align-items-center", "py-1", "rounded");
      track.setAttribute("id", "track");

      track.innerHTML = `<div class="col-7 d-flex justify-content-start align-items-center">
                     
                        <p class="m-0 font-off fs-listeners">${index + 1}</p>
                        <div class="d-inline-block font-off  ms-3">
                          <p class="fs-6 m-0 text-white ">${element.title}</p>
                          <p class="m-0 fs-7">${element.artist.name}</p>
                        </div>
                      </div>
                    
                    <div class="col-3">
                      <p class="font-off text-center m-0 fs-listeners">${element.rank}</p>
                    </div>
                    <div class="col-2">
                      <p class="font-off text-center m-0 fs-listeners">${convertSeconds(element.duration).minutes}:${
        convertSeconds(element.duration).remainingSeconds
      }</p>
                    </div>`;

      track.addEventListener("click", () => {
        if (currentAudio && currentPlay === index) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          currentAudio = null;
          currentPlay = null;
          console.log(`Stopped: ${track.title}`);
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
      tracksContainer.appendChild(track);
      setupAudioElements(albumData.tracks.data);
    });
  })
  .catch((error) => console.log(error));

const back = document.getElementById("back");
const forward = document.getElementById("forward");

back.addEventListener("click", () => {
  window.history.back();
});

forward.addEventListener("click", () => {
  window.history.forward();
});
