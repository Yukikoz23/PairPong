'use strict';
{

  function playGame() {
    const canvas = document.querySelector('canvas');
    const width = 600;
    const height = 400;
    const btn = document.getElementById('btn');
    const body = document.querySelector('body');
    let ctx;
    let dpr;
    let myGame;
    let mouseX;
    let score;
    let isPlaying = false;
    let timerId;

    if (typeof canvas.getContext === 'undefined') {
      return;
    }

    ctx = canvas.getContext('2d');

    // Retinaディスプレイ対応
    dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    class Label {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }

      drawLabel(text) {
        ctx.font = '18px "Noto Sans JP"';
        ctx.fillStyle = '#322932';
        ctx.textAlign = 'left';
        ctx.fillText(text, this.x, this.y);
      }
    }

    class Ball {
      constructor(x, y, vx, vy, r) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.r = r;
      }

      // ボールを描く
      drawBall() {
        ctx.beginPath();
        ctx.fillStyle = '#ba4858';
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, true);
        ctx.fill();
      }

      // ボールを動かす
      moveBall() {
        // ボールの位置を更新
        this.x += this.vx;
        this.y += this.vy;

        // 右端 or 左端
        if (this.x + this.r > width || this.x - this.r < 0) {
          this.vx *= -1;
        }
        // 上
        if (this.y - this.r < 0) {
          this.vy *= -1;
        }
        // 下
        if (this.y + this.r > height) {
          isPlaying = false;
          btn.classList.remove('hidden');
          btn.textContent = 'REPLAY ?'
        }
      }

      // ボールの衝突判定
      checkCollision(paddle) {
        // ボール下端がパドルのyより大きい and ボール下端がパドル下端のyより小さい (つまりボールがパドル高さ内にある)
        if ((this.y + this.r > paddle.y && this.y + this.r < paddle.y + paddle.h) &&
        // ボールのxがパドル左端より大きい and ボールのxがパドル右端より小さい (つまりボールがパドル幅内にある)
        (this.x > paddle.x - paddle.w / 2 && this.x < paddle.x + paddle.w /2)) {
          this.vy *= -1;
          score++;
          if (score % 3 === 0) {
            this.vx *= 1.1;
            paddle.w *= 0.9;
          }
        }
      }
    }

    class Paddle {
      constructor(w, h) {
        this.w = w;
        this.h = h;
        this.x = width / 2;
        this.y = height - 30;
      }

      drawPaddle() {
        ctx.fillStyle = '#322932';
        ctx.fillRect(this.x - this.w / 2, this.y, this.w, this.h);
      }
    }

    class Game {
      constructor() {
        this.Paddle01 = new Paddle(100, 10);
        this.Paddle02 = new Paddle(100, 10);
        this.Ball = new Ball(rand(50, 550), rand(0, 100), 4, 4, 6);
        this.Label = new Label(10, 25);
      }
    }

    // ランダムな値を返す
    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function init() {
      score = 0;
      isPlaying = true;
      myGame = new Game();
      myGame.Label.drawLabel('SCORE: ' + score);
      myGame.Paddle01.x -= 200;
      myGame.Paddle02.x += 200;
    }

    function clearStage() {
      ctx.fillStyle = '#fefbf1';
      ctx.fillRect(0, 0, width, height);
    }

    function update() {
      clearStage();
      myGame.Label.drawLabel('SCORE: ' + score);
      myGame.Paddle01.drawPaddle();
      myGame.Paddle02.drawPaddle();
      myGame.Ball.drawBall();
      myGame.Ball.moveBall();
      myGame.Ball.checkCollision(myGame.Paddle01);
      myGame.Ball.checkCollision(myGame.Paddle02);
      timerId = requestAnimationFrame(update);
      if (!isPlaying) cancelAnimationFrame(timerId);
    }

    btn.addEventListener('click', () => {
      btn.classList.add('hidden');
      init();
      update();
    });

    document.addEventListener('keydown', e => {
      if (e.key === '1') {
        myGame.Paddle01.x -= 20;
      } else if (e.key === '2') {
        myGame.Paddle01.x += 20;
      } else if (e.key === '9') {
        myGame.Paddle02.x -= 20;
      } else if (e.key === '0') {
        myGame.Paddle02.x += 20;
      }
    });
  }

  playGame();

}
