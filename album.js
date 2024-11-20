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
let currentTracksIndex = 0;
let isPlaying = false;

const playPauseBtn = document.getElementById("playPauseBtn");

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
    playPauseBtn.textContent = "Pause";
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
      track.classList.add("row", "mt-3");
      track.setAttribute("id", "track");
      track.innerHTML = `<div class="col-7">
                      <div class="d-flex">
                        <span class="h-100 font-off">${index + 1}</span>
                        <div class="d-inline-block font-off ms-2">
                          <h4 class="fs-6 m-0">${element.title}</h4>
                          <p>${element.artist.name}</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-3">
                      <p class="font-off text-center">${element.rank}</p>
                    </div>
                    <div class="col-2">
                      <p class="font-off text-center">${convertSeconds(element.duration).minutes}:${convertSeconds(element.duration).remainingSeconds}</p>
                    </div>`;
      tracksContainer.appendChild(track);
      setupAudioElements(albumData.tracks.data);
    });
  });
