const url = "https://striveschool-api.herokuapp.com/api/deezer/artist/412";
const urlTracks = "https://striveschool-api.herokuapp.com/api/deezer/artist/412/top?limit=50";

function convertSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return { minutes, remainingSeconds };
}

fetch(url)
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

fetch(urlTracks)
  .then((response) => {
    if (response.ok) {
      console.log(response);
      return response.json();
    }
  })
  .then((tracksdata) => {
    tracksdata.data.forEach((element, index) => {
      const containerTracks = document.getElementById("containerTracks");
      const tracks = document.createElement("div");
      tracks.classList.add("row", "justify-content-start", "align-items-center", "mb-3", "rounded", "py-1");
      tracks.setAttribute("id", "singleSong");
      tracks.innerHTML = `<div class="col-7 d-flex justify-content-start align-items-center">
                                  <p id="numberSong" class="font-off m-0 fw-light fs-listeners">${index + 1}</p>
                                  <div class="containerPhotoSong mx-3">
                                    <img src="${element.album.cover_small}
                                    " alt="" id="photoSong" class="img-fluid" />
                                  </div>
                                  <p id="nameSong" class="text-white m-0 fs-single-song">${element.title_short}</p>
                                </div>
                                <div class="col-3">
                                  <p id="listeners" class="font-off m-0 fw-light fs-listeners">${element.rank}</p>
                                </div>
                                <div class="col-2">
                                  <p id="timeSong" class="font-off m-0 fw-light fs-listeners">${convertSeconds(element.duration).minutes}:${
        convertSeconds(element.duration).remainingSeconds
      }</p>
                                </div>`;

      containerTracks.appendChild(tracks);
    });
  })

  .catch((err) => console.log(err));
