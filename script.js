const playButton = document.getElementById("playButton");
const timeline = document.getElementById("timeline");
const timeDisplay = document.getElementById("timeDisplay");
const photo = document.getElementById("photo");
const sceneName = document.getElementById("sceneName");
const sceneTime = document.getElementById("sceneTime");

let seconds = 0;
let playing = false;
let timer;

const wind = new Audio("sounds/wind.mp3");
const birds = new Audio("sounds/birds.mp3");
const bell = new Audio("sounds/school-bell.mp3");
const crowd = new Audio("sounds/crowd.mp3");
const cars = new Audio("sounds/cars.mp3");

wind.loop = true;
birds.loop = true;
crowd.loop = true;
cars.loop = true;

wind.volume = 0.25;
birds.volume = 0.45;
bell.volume = 0.7;
crowd.volume = 0.45;
cars.volume = 0.55;

const sounds = [wind, birds, bell, crowd, cars];

function playSound(sound, shouldPlay) {
  if (playing && shouldPlay) {
    if (sound.paused && !sound.ended) {
      sound.play().catch(function() {});
    }
  } else {
    sound.pause();
  }
}

function updateSounds() {
  playSound(wind, seconds < 75);
  playSound(birds, seconds < 20 || seconds >= 55 && seconds < 75);
  playSound(bell, seconds >= 14 && seconds < 19);
  playSound(crowd, seconds >= 18 && seconds < 43);
  playSound(cars, seconds >= 36 && seconds < 63);
}

function updatePage() {
  timeline.value = seconds;
  let minutes = Math.floor(seconds / 60);
  let remaining = seconds % 60;
  timeDisplay.textContent = minutes + ":" + String(remaining).padStart(2, "0") + " / 1:15";

  if (seconds < 18) {
    photo.src = "https://commons.wikimedia.org/wiki/Special:FilePath/San_Ramon_View.jpg?width=1100";
    sceneName.textContent = "Morning in the valley";
    sceneTime.textContent = "Morning";
  } else if (seconds < 44) {
    photo.src = "https://commons.wikimedia.org/wiki/Special:FilePath/San_Ramon_Intermodal_Transit_Center_01.jpg?width=1100";
    sceneName.textContent = "School day";
    sceneTime.textContent = "Midday";
  } else {
    photo.src = "https://commons.wikimedia.org/wiki/Special:FilePath/SanRamonPanorama.jpg?width=1100";
    sceneName.textContent = "Afternoon in San Ramon";
    sceneTime.textContent = "Afternoon";
  }
  updateSounds();
}

function pauseSoundscape() {
  playing = false;
  clearInterval(timer);
  playButton.textContent = "Play";
  for (let i = 0; i < sounds.length; i++) {
    sounds[i].pause();
  }
}

playButton.addEventListener("click", function() {
  if (playing) {
    pauseSoundscape();
  } else {
    if (seconds === 75) seconds = 0;
    playing = true;
    playButton.textContent = "Pause";
    updatePage();
    timer = setInterval(function() {
      seconds++;
      if (seconds >= 75) {
        seconds = 75;
        pauseSoundscape();
      }
      updatePage();
    }, 1000);
  }
});

timeline.addEventListener("input", function() {
  seconds = Number(timeline.value);
  // Restart clips when moving to another moment in the soundscape.
  for (let i = 0; i < sounds.length; i++) {
    sounds[i].pause();
    sounds[i].currentTime = 0;
  }
  updatePage();
});

updatePage();
