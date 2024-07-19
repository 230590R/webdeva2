/*jshint esversion: 6*/

// class representing each layer of BGM.
class MusicLayer {
  constructor(filepath, maxvolume, volume = 0) {
    this.audio = new Audio(filepath);
    this.maxvolume = maxvolume;
    this.volume = volume;
    this.audio.volume = volume;
  }

  // eases the volume into the targeted volume
  Update(dt) {
    this.volume += (this.maxvolume - this.volume) * 5 * dt;
    this.audio.volume = this.volume;
  }
}


// class to encapsulate the cover parallax
class Cover {
  constructor() {
    // get the elements
    this.mountain = document.getElementById("title-mountain");
    this.ground = document.getElementById("title-ground");
    this.text = document.getElementById("title-h1");
    this.cover = document.getElementById("title-cover");
    // define the position of the title, set it
    this.textTop = -250;
    this.text.style.top = this.textTop + 'px';
  }

  // update function to be added to the scroll event listener
  ScrollUpdate(scrollY) {
    this.mountain.style.top = (scrollY * -0.75) + 'px';
    //this.cover.style.top = (scrollY * -1) + 'px';
    let textPos = this.textTop + (scrollY * 0.005 * Math.abs(this.textTop));
    this.text.style.top = Math.min(textPos, 200) + 'px';
  }
}

// class to handle rounded corners
class Blob {
  constructor(target, start, range, timer) {
    // store the element to be changed
    this.target = target;
    // 4 element list of border radius floats
    this.borders = [start, start, start, start];
    this.tBorders = [0, 0, 0, 0];
    // variables to keep track of starting radius and range
    this.start = start;
    this.range = range;
    // variables to keep track of internal timer
    this.timer = timer;
    this.elapsed = timer;
  }

  Update(dt) {
    // tick up elapsed time
    this.elapsed += dt;
    // interpolate to the target size
    for (let i = 0; i < this.borders.length; i++) {
      this.borders[i] += (this.tBorders[i] - this.borders[i]) * dt / this.timer;
    }
    // snap to the nearest pixel, set the element's border-radius
    this.target.style.borderRadius =
      Math.floor(this.borders[0]) + "px " +
      Math.floor(this.borders[1]) + "px " +
      Math.floor(this.borders[2]) + "px " +
      Math.floor(this.borders[3]) + "px";

    // randomise a new target when timer is up
    if (this.elapsed >= this.timer) {
      for (let i = 0; i < this.tBorders.length; i++) {
        let rand = -(0.5 * this.range) + (Math.random() * this.range);
        this.tBorders[i] = this.start + rand;
      }
      this.elapsed = 0;
    }
  }
}


// class to encapsulate slider functionality 
class Slider {
  constructor() {
    const slides = document.querySelectorAll(".slides .slide");
    console.log(slides);
  }
}

let slider = new Slider();

let cover = new Cover();
window.addEventListener('scroll', function () {
  cover.ScrollUpdate(window.scrollY);
});

let music = new MusicLayer("audio/bgm-music.mp3", 0.25, 0.25);
let bass = new MusicLayer("audio/bgm-bass.mp3", 0, 0);
let drums = new MusicLayer("audio/bgm-drums.mp3", 0, 0);

// class to encapsulate navbar functionality
class Navbar {
  constructor() {
    // hamburger elements
    let btnHam = document.getElementById("hambtn");
    let hamblob = document.getElementById("hamblob");
    let hamicon = document.querySelector(".hamicon");
    // init nav event listener
    let navUL = document.querySelector("nav ul");
    btnHam.addEventListener('click', () => {
      hamicon.classList.toggle("hamicon-toggled");
      hamblob.classList.toggle("hamblob-toggled");
      navUL.classList.toggle("hidden");
    });
    // create the hamicon blob
    this.hamiconBlob = new Blob(btnHam, 20, 20, 0.25);
    this.hamiconBeforeBlob = new Blob(hamblob, 30, 30, 0.5);
    // subpage elements
    this.subpages = [
      document.getElementById("introduction"),
      document.getElementById("species"),
      document.getElementById("game"),
    ];
  }

  // to be invoked once after the transition is played
  HideSubpages(index) {
    // hide all other subpages
    for (let i = 0; i < this.subpages.length; i++) {
      if (i === index) continue;
      this.subpages[i].classList.add("displaynone");
    }
    this.subpages[index].classList.remove("hidden-subpage");
  }

  ToggleSubpage(index) {
    // hide all other subpages
    for (let i = 0; i < this.subpages.length; i++) {
      this.subpages[i].classList.add("hidden-subpage");
    }
    this.subpages[index].classList.remove("displaynone");

    // scroll to view
    document.getElementById("content-anchor").scrollIntoView({ behavior: "smooth", block: "start", inline: "center" });
  
    // set the music
    if (index == 0) {
      music.maxvolume = 0;
      bass.maxvolume = 1;
      drums.maxvolume = 0;
    }
    else if (index == 1) {
      music.maxvolume = 1;
      bass.maxvolume = 1;
      drums.maxvolume = 0;
    }
    else if (index == 2) {
      music.maxvolume = 1;
      bass.maxvolume = 1;
      drums.maxvolume = 1;
    }

  }
  Update(dt) {
    this.hamiconBlob.Update(dt);
    this.hamiconBeforeBlob.Update(dt);
  }
}


let navbar = new Navbar();

let btnIntro = document.getElementById("page1btn");
let btnSpecies = document.getElementById("page2btn");
let btnGame = document.getElementById("page3btn");

btnIntro.addEventListener('click', function () {
  navbar.ToggleSubpage(0);
  btnIntro.classList.add("button-toggled");
  btnSpecies.classList.remove("button-toggled");
  btnGame.classList.remove("button-toggled");

  setTimeout(function () {
    navbar.HideSubpages(0);
  }, 201);
});

btnSpecies.addEventListener('click', function () {
  navbar.ToggleSubpage(1);
  btnIntro.classList.remove("button-toggled");
  btnSpecies.classList.add("button-toggled");
  btnGame.classList.remove("button-toggled");

  setTimeout(function () {
    navbar.HideSubpages(1);
  }, 201);
});

btnGame.addEventListener('click', function () {
  navbar.ToggleSubpage(2);
  btnIntro.classList.remove("button-toggled");
  btnSpecies.classList.remove("button-toggled");
  btnGame.classList.add("button-toggled");

  setTimeout(function () {
    navbar.HideSubpages(2);
  }, 201);

});


let btnStart = document.getElementById("start");
let btnMusic = document.getElementById("music");
let btnBass = document.getElementById("bass");
let btnDrums = document.getElementById("drums");



btnStart.addEventListener('click', function () {
  music.audio.play();
  bass.audio.play();
  drums.audio.play();
});


btnMusic.addEventListener('click', function () { ToggleAudio(music, 0.25); });
btnBass.addEventListener('click', function () { ToggleAudio(bass, 1); });
btnDrums.addEventListener('click', function () { ToggleAudio(drums, 0.25); });

function ToggleAudio(a, volume) {
  a.maxvolume = (a.maxvolume == 0) ? volume : 0;
}

const deltatime = 0.006;
function AppLoop() {
  UpdateLoop(deltatime);
  // step into the next frame when frame time has elapsed
  requestAnimationFrame(AppLoop);
}

function UpdateLoop(dt) {
  music.Update(dt);
  bass.Update(dt);
  drums.Update(dt);
  navbar.Update(dt);
}

requestAnimationFrame(AppLoop);