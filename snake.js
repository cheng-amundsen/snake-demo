(function() {
  var SnakeGame = function(main, start, stop) {
    this.main = this.g(main);
    this.mainCxt = this.main.getContext('2d');
    this.startBtn = this.g(start);
    this.startCxt = this.startBtn.getContext('2d');
    this.stopBtn = this.g(stop);
    this.stopCxt = this.stopBtn.getContext('2d');
    this.stopBtn.width = 60;
    this.stopBtn.height = 60;
    this.WIDTH = 880;
    this.HEIGHT = 608;
    this.SIZE = 16;
    this.COL = this.WIDTH / this.SIZE;
    this.ROW = this.HEIGHT / this.SIZE;
    this.score = 0;
    this.timeStart = 0;
    this.SPEED = 150;
    this.timer = null;

    this.bodyImg = new Image();
    this.bodyImg.src = './src/body.png';
    this.foodImg = new Image();
    this.foodImg.src = './src/apple.png';
    this.exitImg = new Image();
    this.exitImg.src = './src/exit.png';

    this.snake = {
      x: 8 * this.SIZE,
      y: 8 * this.SIZE,
      map: [],
      body: 5,
      direction: 2
    };

    this.food = {
      x: 0,
      y: 0
    };

    this.init();
    this.addEvent();
  };

  SnakeGame.prototype = {
    constructor: SnakeGame,

    init: function () {
      var _this = this;
      _this.timeStart = 0;
      _this.score = 0;
      _this.snake = {
        x: 8 * this.SIZE,
        y: 8 * this.SIZE,
        map: [],
        body: 5,
        direction: 2
      };
      clearInterval(_this.timer);
      _this.startBtn.style.display = 'block';
      _this.stopBtn.style.display = 'none';

      _this.main.width = _this.WIDTH;
      _this.main.height = _this.HEIGHT;
      var bg = new Image();
      bg.src = './src/bg.png';
      bg.onload = function () {
        _this.mainCxt.drawImage(bg, 0, 0, _this.WIDTH, _this.HEIGHT);
      };
      var start = new Image();
      start.src = './src/start.png';
      start.onload = function () {
        _this.startCxt.drawImage(start, 0, 0);
      };
      _this.exitImg.onload = function () {
        _this.stopCxt.drawImage(_this.exitImg, 0, 0, 60, 60);
      };


    },

    g: function (id) {
      return document.getElementById(id);
    },

    /**
     * 设置画布宽高和蛇身大小
     * @param width 画布宽度
     * @param height 画布高度
     * @param size 每节蛇身大小
     */
    setSize: function (width, height, size) {
      this.WIDTH = width;
      this.HEIGHT = height;
      this.SIZE = size;
    },

    /**
     * 获取游戏开始到当前所用的时间
     * @returns {string}
     */
    getGameTime: function () {
      if (this.timeStart == 0) {
        return '0:00:00';
      }
      var timeNow = ((new Date()).getTime() - this.timeStart) / 1000;
      var h = '' + Math.floor(timeNow / 60 / 60);
      var m = '' + Math.floor(timeNow / 60 % 60);
      var s = '' + Math.floor(timeNow % 60);
      if (m.length < 2) {
        m = '0' + m;
      }
      if (s.length < 2) {
        s = '0' + s;
      }
      return h + ':' + m + ':' + s;
    },

    /**
     * 获得分数
     * @returns {number}
     */
    getScore: function () {
      return this.score;
    },

    /**
     * 获得最高分
     * @returns {string}
     */
    getHighScore: function () {
      return localStorage.getItem('highScore') ? localStorage.getItem('highScore') : 0;
    },

    /**
     * 更新最高分
     * @param value 最高分
     */
    setHighScore: function (value) {
      localStorage.setItem('highScore', value);
    },
    
    startGame: function () {
      var _this = this;
      this.timeStart = (new Date()).getTime();
      this.startBtn.style.display = 'none';
      this.stopBtn.style.display = 'block';
      this.mainCxt.beginPath();
      this.mainCxt.clearRect(0, 0, this.WIDTH, this.HEIGHT);
      this.foodRender();
      _this.timer = setInterval(function(){
        switch(_this.snake.direction) {
          case 0:
            _this.snake.x -= _this.SIZE;
            break;
          case 1:
            _this.snake.y -= _this.SIZE;
            break;
          case 2:
            _this.snake.x += _this.SIZE;
            break;
          case 3:
            _this.snake.y += _this.SIZE;
            break;
        }

        // 判断边界
        if (_this.snake.x < 0) {
          _this.snake.x = _this.WIDTH - _this.SIZE;
        }
        if (_this.snake.y < 0) {
          _this.snake.y = _this.HEIGHT - _this.SIZE;
        }
        if (_this.snake.x >= _this.WIDTH) {
          _this.snake.x = 0;
        }
        if (_this.snake.y >= _this.HEIGHT) {
          _this.snake.y = 0;
        }

        _this.snake.map.push({
          x: _this.snake.x,
          y: _this.snake.y
        });

        if(_this.snake.map.length > _this.snake.body) {
          var del = _this.snake.map.shift();
          _this.clearSnake(del);
        }

        if(_this.snake.x ==_this.food.x && _this.snake.y == _this.food.y) {
          _this.snake.body++;
          _this.score++;
          if (+_this.score > +_this.getHighScore()) {
            _this.setHighScore(_this.score);
          }
          _this.clearFood(_this.food);
          _this.foodRender();
        }

        _this.snakeRender();

        // 判断自身碰撞
        for (var i = 0; i < _this.snake.map.length - 1; i++) {
          if (_this.snake.x == _this.snake.map[i].x && _this.snake.y == _this.snake.map[i].y) {
            _this.mainCxt.font = '60px Microsoft Yahei';
            _this.mainCxt.fillStyle = 'red';
            _this.mainCxt.fillText('Game Over!', _this.WIDTH * 0.3, _this.HEIGHT * 0.45);
            clearInterval(_this.timer);
          }
        }
      }, _this.SPEED)
    },

    snakeRender: function () {
      this.mainCxt.beginPath();
      this.mainCxt.drawImage(this.bodyImg, this.snake.x, this.snake.y, this.SIZE, this.SIZE);
    },
    
    foodRender: function () {
      var _this = this;
      do {
        this.food.x = Math.floor(Math.random() * this.COL) * this.SIZE;
        this.food.y = Math.floor(Math.random() * this.ROW) * this.SIZE;
      } while (!isInSnake(this.food.x, this.food.y));
      function isInSnake(x, y) {
        for (var map in _this.snake.map) {
          if (map.x == x && map.y == y) {
            return false;
          }
        }
        return true;
      }

      this.mainCxt.beginPath();
      this.mainCxt.drawImage(this.foodImg, this.food.x, this.food.y, this.SIZE, this.SIZE);
    },
    
    clearSnake: function (del) {
      this.mainCxt.beginPath();
      this.mainCxt.clearRect(del.x, del.y, this.SIZE, this.SIZE);
    },

    clearFood: function (food) {
      this.mainCxt.beginPath();
      this.mainCxt.clearRect(food.x, food.y, this.SIZE, this.SIZE);
    },

    addEvent: function () {
      var _this = this;
      _this.startBtn.addEventListener('click', function () {
        _this.startGame();
      });

      _this.stopBtn.addEventListener('click', function () {
        _this.init();
      });

      document.addEventListener("keydown", function(e){
        var e = e || window.event;
        switch(e.keyCode - 37){
          // 左：0
          case 0:
            if (_this.snake.direction != 2) {
              _this.snake.direction = 0;
            }
            break;
          case 1:
            if (_this.snake.direction != 3) {
              _this.snake.direction = 1;
            }
            break;
          case 2:
            if (_this.snake.direction != 0) {
              _this.snake.direction = 2;
            }
            break;
          case 3:
            if (_this.snake.direction != 1) {
              _this.snake.direction = 3;
            }
            break;
          default:
            console.log("error");
        }
      });
    }
  };

  window.SnakeGame = SnakeGame;
})();
