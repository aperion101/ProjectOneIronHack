const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//VARIABLES
let hero = "";
let dragon = "";
let dragon2 = "";
let dragon3 = "";
let score = 0;
let gravity;
let isJumping = false;
let endGame = false;

let animationFrameID;

/// MUSICA
let soundTrack = new Audio("/music/MYKI - MYKI - Delenya - 01 Vertigo.mp3");
soundTrack.volume = 0.3;
soundTrack.preload = "auto";
soundTrack.load();

// SCORE
const drawScore = () => {
  ctx.font = "18px monospace";
  ctx.fillStyle = "red";
  ctx.fillText("Score: " + score, 20, 30);
};

// Background image
let backgroundImages = "";
backgroundImages = new Image();
backgroundImages.src = "/img/background.png";

//Hero image
let muerteImage = "";
(muerteImage = new Image()), (muerteImage.src = "/img/dead.png");

let heroImage = "";
heroImage = new Image();
heroImage.src = "/img/soldier2.png";

let dragonImage = "";
dragonImage = new Image();
dragonImage.src = "/img/charizar2.png";

let dragonImage2 = "";
dragonImage2 = new Image();
dragonImage2.src = "/img/pajaro.png";

let dragonImage3 = "";
dragonImage3 = new Image();
dragonImage3.src = "/img/pajaro2.png";

//---
let arrayDragones = [];

//-------------- CLASES --------------------------------
class Hero {
  constructor() {
    this.x = 50;
    this.y = 500;
    this.width = 80;
    this.height = 80;
    this.vy = 0;
    this.gravity = 15;
    this.weight = 0.17;
  }
  jump() {
    this.vy = -5;
  }

  draw() {
    ctx.drawImage(heroImage, this.x, this.y, this.width, this.height);
  }

  update() {
    if (this.y < 0) {
      this.y = 0;
    }
    //actualizamos la posicion
    this.y += this.vy;

    //Para cuando encuentra el suelo
    // console.log(canvas.height - this.height)

    if (this.y + this.height >= canvas.height) {
      this.y = canvas.height - this.height; // vertice inferior izquierdo(pies de personaje) es === a el suelo que es canvas.height
      this.vy = 0;
    }

    //Cuando la velocidad vertical es menor que la gravedad le sumamos el peso, para que baje
    if (this.vy < this.gravity) {
      this.vy += this.weight;
    }
  }
  checkForHeroColission(dragon) {
    if (
      this.x < dragon.x + dragon.width &&
      this.x + this.width > dragon.x &&
      this.y < dragon.y + dragon.height &&
      this.height + this.y > dragon.y
    ) {
      //deadSound.play
      endGame = true;
    }
  }
}

hero = new Hero();

// Dibujar dragon 1
class Dragon {
  constructor() {
    this.x = 1000;
    this.y = 500;
    this.width = 100;
    this.height = 100;
    this.speed = 2;
    this.toDelete = false;
  }
  draw() {
    ctx.drawImage(dragonImage, this.x, this.y, this.width, this.height);
  }

  update() {
    this.x -= this.speed;
    if (this.x + this.width >= 0) {
      this.delete = true;
    }
  }
}

// Dibujar dragon 2
class Dragon2 {
  constructor() {
    this.x = 1000;
    this.y = Math.floor(Math.random() * 380) + 1;
    this.width = 115;
    this.height = 115;
    this.speed = 3;
    this.toDelete = false;
  }
  draw() {
    ctx.drawImage(dragonImage2, this.x, this.y, this.width, this.height);
  }

  update() {
    this.x -= this.speed;

    if (this.x + this.width >= 0) {
      this.delete = true;
    }
  }
}

// Dibujar dragon 3
class Dragon3 {
  constructor() {
    this.x = 1000;
    this.y = Math.floor(Math.random() * 385) + 2; // Random 'y' position between 153 and 320;
    this.width = 120;
    this.height = 120;
    this.speed = 4;
    this.toDelete = false;
  }
  draw() {
    ctx.drawImage(dragonImage3, this.x, this.y, this.width, this.height);
  }

  update() {
    this.x -= this.speed;

    if (this.x + this.width >= 0) {
      this.delete = true;
    }
  }
}

//-------LOOP INFINITO PARA DRAGONES INFINITOS------//

const createDragons = () => {
  setInterval(() => {
    arrayDragones.push(new Dragon(dragonImage));
  }, 3500);

  setInterval(() => {
    arrayDragones.push(new Dragon2(dragonImage2));
  }, 3000);

  setInterval(() => {
    arrayDragones.push(new Dragon3(dragonImage3));
  }, 4000);
};

const deleteDragons = () => {
  arrayDragones = arrayDragones.filter((dragon) => !dragon.toDelete);
};

const updateDrawDragons = () => {
  arrayDragones.forEach((dragon) => {
    dragon.draw();
    dragon.update();

    if (dragon.x < 0) {
      score++;
      dragon.toDelete = true;
    }
  });
};

const clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const drawGameOver = () => {
  ctx.drawImage(muerteImage, 0, 0, canvas.width, canvas.height);
  soundTrack.pause();
};

const gameOver = () => {
  clearCanvas();
  setTimeout(() => {
    cancelAnimationFrame(animationFrameID);
  });

  drawGameOver();
};

const startGame = () => {
  createDragons();
  updateCanvas();
};

//-------------- LOOP JUEGO ------------------------

dragon = new Dragon();

const updateCanvas = () => {
  ctx.drawImage(backgroundImages, 0, 0, canvas.width, canvas.height);

  hero.draw();
  hero.update();

  updateDrawDragons();

  arrayDragones.forEach((dragon) => {
    hero.checkForHeroColission(dragon);
  });

  deleteDragons();
  drawScore();

  if (endGame) {
    clearCanvas();
    gameOver();
    soundTrack.pause();
  }

  animationFrameID = requestAnimationFrame(updateCanvas);
};

//-------------- WINDOW ON LOAD ------------------------

window.onload = () => {
  const startButton = document.getElementById("start-button");

  startButton.onclick = () => {
    soundTrack.play();
    startGame();

    startButton.style.display = "none";
  };

  document.getElementById("sound_button_on").onclick = () => {
    soundTrack.play();
  };

  document.getElementById("sound_button_off").onclick = () => {
    soundTrack.pause();
  };

  //JUMP
  document.addEventListener("keydown", function (evt) {
    if (evt.key === " ") {
      isJumping = true;
      hero.jump();
    }
  });
  document.addEventListener("keyup", function (evt) {
    if (evt.key === "32") {
      isJumping = false;
    }
  });
};
