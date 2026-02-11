const AGE = 18;

/* Canvas */
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
resize();
addEventListener("resize", resize);

/* Fireworks */
class Particle {
  constructor(x, y, color, size = 2, text = null) {
    this.x = x; this.y = y;
    this.vx = (Math.random() - 0.5) * 7;
    this.vy = (Math.random() - 0.5) * 7;
    this.life = 100;
    this.color = color;
    this.size = size;
    this.text = text;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.06;
    this.life--;
  }
  draw() {
    if (this.text) {
      ctx.font = "bold 26px Segoe UI";
      ctx.shadowBlur = 18;
      ctx.shadowColor = "#ffd700";
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, this.x, this.y);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
}

let particles = [];

function explode(x, y, withText = false) {
  const colors = ["#ffd700","#ff5252","#7c4dff","#40c4ff"];

  for (let i = 0; i < 70; i++) {
    particles.push(new Particle(x, y, colors[Math.random()*colors.length|0]));
  }

  if (withText) {
    const p = new Particle(x - 60, y, "#ffd700", 0, "HAPPY");
    p.vx = (Math.random() - 0.5) * 1.2;
    p.vy = -2.8 - Math.random() * 1.5;
    p.life = 120;
    particles.push(p);

    const p2 = new Particle(x + 20, y, "#ffd700", 0, "BIRTHDAY");
    p2.vx = (Math.random() - 0.5) * 1.2;
    p2.vy = -2.8 - Math.random() * 1.5;
    p2.life = 120;
    particles.push(p2);
  }
}

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.life <= 0) particles.splice(i, 1);
  });
  requestAnimationFrame(animate);
}

/* 🔥 MANY Background crackers */
setInterval(() => {
  const bursts = 3 + Math.floor(Math.random() * 4); // 3–6 bursts each wave
  for (let i = 0; i < bursts; i++) {
    setTimeout(() => {
      explode(
        Math.random() * canvas.width,
        Math.random() * canvas.height * 0.45,
        Math.random() > 0.5   // sometimes show text
      );
    }, i * 220);
  }
}, 2000);

animate();

/* Balloons */
const balloonColors = ["#ff5252","#ffd740","#69f0ae","#40c4ff","#b388ff"];
const balloonsWrap = document.createElement("div");
balloonsWrap.className = "balloons";
document.body.appendChild(balloonsWrap);

setInterval(() => {
  const b = document.createElement("div");
  b.className = "balloon";
  b.style.left = Math.random() * 100 + "vw";
  b.style.background = balloonColors[Math.random()*balloonColors.length|0];
  b.style.animationDuration = 8 + Math.random()*6 + "s";
  balloonsWrap.appendChild(b);
  setTimeout(() => b.remove(), 15000);
}, 700);

/* UI logic */
const gift = document.getElementById("giftBox");
const ageContainer = document.getElementById("ageContainer");
const message = document.getElementById("finalMessage");
const music = document.getElementById("bgMusic");
const openSound = document.getElementById("openSound");
const card = document.getElementById("card");

let opened = false;
let blown = false;

function explodeDigit(el) {
  const r = el.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  explode(x, y, true);
  el.style.opacity = "0";
  el.style.transform = "translateY(-120px) scale(0.2)";
}

function showAge() {
  ageContainer.innerHTML = "";
  AGE.toString().split("").forEach((d, i) => {
    const span = document.createElement("span");
    span.className = "digit";
    span.textContent = d;
    ageContainer.appendChild(span);
    setTimeout(() => span.classList.add("show"), i * 700);
  });
}

function typeMessage() {
  const text = message.innerHTML;
  message.innerHTML = "";
  let i = 0;
  (function type() {
    if (i < text.length) {
      message.innerHTML += text.charAt(i++);
      setTimeout(type, 28);
    }
  })();
}

gift.addEventListener("click", () => {
  if (opened) return;
  opened = true;
  gift.classList.add("open");
  card.classList.add("shake");
  openSound.play();
  showAge();

  // Mega burst on open
  for (let i = 0; i < 5; i++) {
    setTimeout(() => explode(canvas.width/2, canvas.height*0.35, true), i * 200);
  }

  setTimeout(() => {
    message.classList.remove("hidden");
    typeMessage();
  }, 900);

  music.volume = 0.45;
  music.play();
});

document.body.addEventListener("click", () => {
  if (!opened || blown) return;
  blown = true;
  document.querySelectorAll(".digit").forEach((d, i) => {
    setTimeout(() => {
      d.classList.add("blow");
      explodeDigit(d);
    }, i * 350);
  });
});
