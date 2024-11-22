export function extractColor() {
  const albumCard = document.getElementById("album-card");
  const albumCover = document.getElementById("Cover");

  if (!albumCard || !albumCover) {
    console.error("Elements album-card or cover not found.");
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = albumCover.naturalWidth;
  canvas.height = albumCover.naturalHeight;

  try {
    ctx.drawImage(albumCover, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let r = 0,
      g = 0,
      b = 0,
      count = 0;

    for (let i = 0; i < imageData.length; i += 4) {
      r += imageData[i];
      g += imageData[i + 1];
      b += imageData[i + 2];
      count++;
    }

    if (count > 0) {
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      albumCard.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      albumCard.classList.remove("grayscale");
      const rgbColor = `rgb(${r}, ${g}, ${b})`;
      localStorage.setItem("lastBackgroundColor", rgbColor);
      console.log("Background color saved:", rgbColor);

      console.log(`Background color set to: rgb(${r}, ${g}, ${b})`);
    } else {
      console.error("No pixel data found to calculate color.");
    }
  } catch (error) {
    console.error("Error extracting image data:", error.message);
  }
}
