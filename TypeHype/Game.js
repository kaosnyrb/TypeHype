var Game;
(function (Game) {
    var health = 30;

    var Player = (function () {
        function Player() {
            this.x = 0;
            this.y = 0;
            this.texture = 1;
            this.active = true;
        }
        Player.prototype.Update = function (objects) {
        };
        return Player;
    })();

    var Enemy = (function () {
        function Enemy() {
            this.x = 0;
            this.y = 0;
            this.texture = 3;
            this.active = true;
        }
        Enemy.prototype.Update = function (objects) {
            this.y++;

            //Warning, breaks on monitors higher than 4K. Hopefully this shouldn't be a problem.
            if (this.y > 2160) {
                this.active = false;
            }
            var hit = false;
            for (var i = 0; i < objects.length && !hit; i++) {
                if (objects[i].x != this.x || objects[i].y != this.y) {
                    if (objects[i].x <= (this.x + 16) && this.x <= (objects[i].x + 16) && objects[i].y <= (this.y + 16) && this.y <= (objects[i].y + 16)) {
                        //hit enemy ship
                        if (objects[i].texture == 1) {
                            //objects[i].active = false;
                            health--;
                            this.active = false;
                            hit = true;
                        }
                    }
                }
            }
        };
        return Enemy;
    })();

    var Bullet = (function () {
        function Bullet() {
            this.x = 0;
            this.y = 0;
            this.texture = 2;
            this.direction = 0;
            this.active = true;
        }
        Bullet.prototype.Update = function (objects) {
            if (this.direction == 0) {
                this.x -= 0.5;
                this.y--;
            }
            if (this.direction == 1) {
                this.y--;
            }
            if (this.direction == 2) {
                this.x += 0.5;
                this.y--;
            }
            if (this.y < 0) {
                this.active = false;
            }
            var hit = false;
            for (var i = 0; i < objects.length && !hit; i++) {
                if (objects[i].x != this.x || objects[i].y != this.y) {
                    if (objects[i].x <= (this.x + 16) && this.x <= (objects[i].x + 16) && objects[i].y <= (this.y + 16) && this.y <= (objects[i].y + 16)) {
                        //hit enemy ship
                        if (objects[i].texture == 3) {
                            objects[i].active = false;
                            this.active = false;
                            hit = true;
                        }
                    }
                }
            }
        };
        return Bullet;
    })();

    var GameCore = (function () {
        function GameCore(Engine) {
            this.engine = Engine;
            this.gameobjects = new Array();
            var player = new Player();
            player.x = Engine.canvas.width / 2;
            player.y = Engine.canvas.height - 50;
            this.gameobjects.push(player);
            this.speed = 1;
            this.firecooldown = 0;
            this.controls = new Game.Controls();
            this.enemyspawnrate = 0;
        }
        GameCore.prototype.CreateBullet = function (x, y, direction) {
            var bullet = new Bullet();
            bullet.x = x;
            bullet.y = y;
            bullet.direction = direction;
            this.gameobjects.push(bullet);
        };

        GameCore.prototype.LoadAssets = function () {
            //Here we load the textures we're going to use in the game.
            this.engine.LoadTexture("assets/background.png");
            this.engine.LoadTexture("assets/player.png");
            this.engine.LoadTexture("assets/bullet.png");
            this.engine.LoadTexture("assets/enemy.png");
            this.engine.LoadTexture("assets/title.png");
            this.engine.LoadTexture("assets/health.png");
            this.engine.LoadTexture("assets/exp1.png");
            this.engine.LoadTexture("assets/exp2.png");
            this.engine.LoadTexture("assets/exp3.png");
        };

        GameCore.prototype.Update = function () {
            //Game Loop
            this.engine.Resize(); //Resize the canvas to fill the screen
            this.engine.ClearRenderList(); //Remove old objects

            //-------Game Logic goes here-------
            this.engine.RenderObject(0, 0, 0);
            if (this.controls.upPressed) {
                if (this.gameobjects[0].y > 0) {
                    this.gameobjects[0].y -= this.speed;
                }
            }
            if (this.controls.downPressed) {
                if (this.gameobjects[0].y < this.engine.canvas.height - 45) {
                    this.gameobjects[0].y += this.speed;
                }
            }
            if (this.controls.leftPressed) {
                if (this.gameobjects[0].x > 0) {
                    this.gameobjects[0].x -= this.speed;
                }
            }
            if (this.controls.rightPressed) {
                if (this.gameobjects[0].x < this.engine.canvas.width - 32) {
                    this.gameobjects[0].x += this.speed;
                }
            }
            if (this.firecooldown == 0) {
                if (this.controls.firePressed) {
                    this.firecooldown = 70;
                    this.CreateBullet(this.gameobjects[0].x + 8, this.gameobjects[0].y, 0);
                    this.CreateBullet(this.gameobjects[0].x + 8, this.gameobjects[0].y, 1);
                    this.CreateBullet(this.gameobjects[0].x + 8, this.gameobjects[0].y, 2);
                }
            } else {
                this.firecooldown--;
            }

            if (this.enemyspawnrate == 0) {
                this.enemyspawnrate = 10;
                var enemy = new Enemy();
                enemy.x = (Math.random() * this.engine.canvas.width) - 12;
                enemy.y = -10;
                this.gameobjects.push(enemy);
            } else {
                this.enemyspawnrate--;
            }

            for (var i = 0; i < this.gameobjects.length; i++) {
                if (this.gameobjects[i].texture != null && this.gameobjects[i].active) {
                    this.gameobjects[i].Update(this.gameobjects);
                    this.engine.RenderObject(this.gameobjects[i].texture, this.gameobjects[i].x, this.gameobjects[i].y);
                }
            }

            for (var i = 0; i < health; i++) {
                this.engine.RenderObject(5, 0 + (i * 15), this.engine.canvas.height - 5);
            }

            //Apply a filter to the array, we only want to keep active gameobjects.
            this.gameobjects = this.gameobjects.filter(function (value) {
                return value.active;
            });

            //----------------------------------
            //Render
            this.engine.Draw();
        };
        return GameCore;
    })();
    Game.GameCore = GameCore;
})(Game || (Game = {}));
//# sourceMappingURL=Game.js.map
