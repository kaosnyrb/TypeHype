module Game {
    var health: number = 30;

    interface GameObject {
        x: number;
        y: number;
        texture: number;
        active: boolean;
        Update(objects: Array<GameObject>);
    }

    class Player implements GameObject {
        constructor(){
            this.x = 0;
            this.y = 0;
            this.texture = 1;
            this.active = true;
        }
        x: number;
        y: number;
        texture: number;
        active: boolean;

        Update(objects: Array<GameObject>) {
        }
    }

    class Enemy implements GameObject {
        constructor() {
            this.x = 0;
            this.y = 0;
            this.texture = 3;
            this.active = true;
        }
        x: number;
        y: number;
        texture: number;
        active: boolean;

        Update(objects: Array<GameObject>) {
            this.y++;
            //Warning, breaks on monitors higher than 4K. Hopefully this shouldn't be a problem.
            if (this.y > 2160) {
                this.active = false;
            }
            var hit = false;
            for (var i = 0; i < objects.length && !hit; i++) {
                if (objects[i].x != this.x ||
                    objects[i].y != this.y) {
                    if (objects[i].x <= (this.x + 16)
                        && this.x <= (objects[i].x + 16)
                        && objects[i].y <= (this.y + 16)
                        && this.y <= (objects[i].y + 16)) {
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
        }
    }

    class Bullet implements GameObject {
        constructor() {
            this.x = 0;
            this.y = 0;
            this.texture = 2;
            this.direction = 0;
            this.active = true;
        }
        x: number;
        y: number;
        texture: number;
        direction: number;
        active: boolean;

        Update(objects: Array<GameObject>) {
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
                if (objects[i].x != this.x ||
                    objects[i].y != this.y) {
                    if (objects[i].x <= (this.x + 16)
                        && this.x <= (objects[i].x + 16)
                        && objects[i].y <= (this.y + 16)
                        && this.y <= (objects[i].y + 16)) {
                        //hit enemy ship
                        if (objects[i].texture == 3) {
                            objects[i].active = false;
                            this.active = false;
                            hit = true;
                        }
                    }
                }
            }
        }
    }

    export class GameCore {
        private engine: RenderEngine;
        private gameobjects: Array<GameObject>;
        private speed: number;
        controls: Controls;
        firecooldown: number;
        enemyspawnrate: number;
        constructor(Engine: RenderEngine) {
            this.engine = Engine;
            this.gameobjects = new Array<GameObject>();
            var player = new Player();
            player.x = Engine.canvas.width / 2;
            player.y = Engine.canvas.height - 50;
            this.gameobjects.push(player);
            this.speed = 1;
            this.firecooldown = 0;
            this.controls = new Controls();
            this.enemyspawnrate = 0;
        }

        CreateBullet(x: number, y: number, direction: number) {
            var bullet = new Bullet();
            bullet.x = x;
            bullet.y = y;
            bullet.direction = direction;
            this.gameobjects.push(bullet);
        }

        LoadAssets() {
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
        }

        Update() {
            //Game Loop
            this.engine.Resize();//Resize the canvas to fill the screen
            this.engine.ClearRenderList();//Remove old objects
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
            }
            else {
                this.firecooldown--;
            }

            if (this.enemyspawnrate == 0) {
                this.enemyspawnrate = 10;
                var enemy = new Enemy();
                enemy.x = (Math.random() * this.engine.canvas.width) - 12;
                enemy.y = -10;
                this.gameobjects.push(enemy);
            }
            else {
                this.enemyspawnrate--;
            }
            
            for (var i = 0; i < this.gameobjects.length; i++)
            {
                if (this.gameobjects[i].texture != null && this.gameobjects[i].active) {
                    this.gameobjects[i].Update(this.gameobjects);
                    this.engine.RenderObject(this.gameobjects[i].texture, this.gameobjects[i].x, this.gameobjects[i].y);
                }
            }
            //render the health
            for (var i = 0; i < health; i++) {
                this.engine.RenderObject(5, 0 + (i * 15), this.engine.canvas.height - 5);
            }
            //Apply a filter to the array, we only want to keep active gameobjects.
            this.gameobjects = this.gameobjects.filter(function (value) { return value.active; });
            //----------------------------------
            //Render
            this.engine.Draw();
        }
    }
}