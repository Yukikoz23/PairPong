'use strict';
{

  function playGame() {

    const canvas = document.querySelector('canvas');
    const btn = document.getElementById('btn');
    const body = document.querySelector('body');
    const height = 400;
    const width = 600;
    let ctx;
    let dpr;
    let myGame;
    let label
    let ball;
    let paddle01;
    let paddle02;
    let level;
    let isPlaying = false;
    let timerId;
    let levelUpTimerId;

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

    class Paddle {
      constructor(w, h, x, y) {
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.isPressed = {
          right: false,
          left: false,
        };
      }

      drawPaddle() {
        ctx.fillStyle = '#322932';
        ctx.fillRect(this.x, this.y, this.w, this.h);
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
          clearTimeout(levelUpTimerId);
          btn.classList.remove('hidden');
          btn.textContent = 'REPLAY ?'
        }
      }

      // ボールの衝突判定
      checkCollision(paddle) {
        // ボールがパドル高さ内にある
        if ((this.y + this.r >= paddle.y && this.y + this.r <= paddle.y + paddle.h) &&
        // ボールがパドル幅内にある
        (this.x >= paddle.x && this.x <= paddle.x + paddle.w)) {
          this.vy *= -1;
          // 二つのパドルが重なり衝突×2カウントされた場合の処理
          if (this.vy > 0) {
            this.vy *= -1;
          }
        }
      }
    }

    // ランダムな値を返す
    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Canvasをクリアー
    function clearCanvas() {
      ctx.fillStyle = '#fefbf1';
      ctx.fillRect(0, 0, width, height);
    }

    // 15秒ごとにレベルアップ
    function levelUp() {
      level++;
      if (level >= 2) {
        ball.vx *= 1.1;
        paddle01.w *= 0.95;
        paddle02.w *= 0.95;
      }
      levelUpTimerId = setTimeout(levelUp, 15000);
    }

    // 位置更新
    function update() {
      ball.moveBall();
      ball.checkCollision(paddle01);
      ball.checkCollision(paddle02);
      // パドルの移動
      if (paddle01.isPressed.right) {
        paddle01.x += 2;
      }
      if (paddle01.isPressed.left) {
        paddle01.x -= 2;
      }
      if (paddle02.isPressed.right) {
        paddle02.x += 2;
      }
      if (paddle02.isPressed.left) {
        paddle02.x -= 2;
      }
    }

    // 描画
    function render() {
      clearCanvas();
      paddle01.drawPaddle();
      paddle02.drawPaddle();
      label.drawLabel('level: ' + level);
      ball.drawBall();
    }

    // 初期化
    function init() {
      paddle01 = new Paddle(100, 10, 22, (height - 30), 1);
      paddle02 = new Paddle(100, 10, (width - 122), (height - 60), 2);
      label = new Label(10, 25);
      ball = new Ball(rand(50, 550), rand(10, 100), 3, 3, 6);
      isPlaying = true;
      level = 0;
      levelUp();
    }

    // ループ処理
    function mainLoop() {
      update();
      render();
      timerId = requestAnimationFrame(mainLoop);
      if (!isPlaying) cancelAnimationFrame(timerId);
    }

    // パドルをセット
    function setPaddle() {
      paddle01 = new Paddle(100, 10, 22, (height - 30), 1);
      paddle02 = new Paddle(100, 10, (width - 122), (height - 60), 2);
      paddle01.drawPaddle();
      paddle02.drawPaddle();
    }

    setPaddle();

    btn.addEventListener('click', () => {
      btn.classList.add('hidden');
      init();
      mainLoop();
    });

    document.addEventListener('keydown', e => {
      switch (e.key) {
        case '1':
          paddle01.isPressed.left = true;
          break;
        case '2':
          paddle01.isPressed.right = true;
          break;
        case '9':
          paddle02.isPressed.left = true;
          break;
        case '0':
          paddle02.isPressed.right = true;
          break;
      }
    });

    document.addEventListener('keyup', e => {
      switch (e.key) {
        case '1':
          paddle01.isPressed.left = false;
          break;
        case '2':
          paddle01.isPressed.right = false;
          break;
        case '9':
          paddle02.isPressed.left = false;
          break;
        case '0':
          paddle02.isPressed.right = false;
          break;
      }
    });
  }

  playGame();

}
