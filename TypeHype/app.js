var Game;
(function (Game) {
    var Texture = (function () {
        function Texture() {
        }
        return Texture;
    })();

    var RenderObject = (function () {
        function RenderObject() {
        }
        return RenderObject;
    })();

    var RenderEngine = (function () {
        function RenderEngine() {
            //Create the Canvas
            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");
            this.canvas.width = window.innerWidth; //640;
            this.canvas.height = window.innerHeight; //480;
            document.body.appendChild(this.canvas);

            //Create the Texture Tools
            this.TexArray = new Array();
            this.RenderArray = new Array();
            for (var i = 0; i < 256; i++) {
                var RenderTexture = new RenderObject();
                RenderTexture.Active = false;
                RenderTexture.x = 0;
                RenderTexture.y = 0;
                RenderTexture.TextureId = 0;
                this.RenderArray.push(RenderTexture);
            }
        }
        RenderEngine.prototype.Resize = function () {
            this.canvas.width = window.innerWidth; //640;
            this.canvas.height = window.innerHeight; //480;
        };
        RenderEngine.prototype.LoadTexture = function (texturepath) {
            var Tex = new Texture();
            Tex.Ready = false;
            Tex.Image = new Image();
            Tex.Image.onload = function () {
                Tex.Ready = true;
            };
            Tex.Image.src = texturepath;
            this.TexArray.push(Tex);
        };

        RenderEngine.prototype.RenderObject = function (TextureID, x, y) {
            var FoundTexture = false;
            for (var i = 0; i < 256 && FoundTexture == false; i++) {
                if (this.RenderArray[i].Active == false) {
                    this.RenderArray[i].Active = true;
                    this.RenderArray[i].x = x;
                    this.RenderArray[i].y = y;
                    this.RenderArray[i].TextureId = TextureID;
                    FoundTexture = true;
                }
            }
        };

        RenderEngine.prototype.Draw = function () {
            for (var i = 0; i < 256; i++) {
                if (this.RenderArray[i].Active == true) {
                    this.ctx.drawImage(this.TexArray[this.RenderArray[i].TextureId].Image, this.RenderArray[i].x, this.RenderArray[i].y);
                }
            }
        };

        RenderEngine.prototype.ClearRenderList = function () {
            for (var i = 0; i < 256; i++) {
                this.RenderArray[i].Active = false;
            }
        };
        return RenderEngine;
    })();
    Game.RenderEngine = RenderEngine;

    window.onload = function () {
        var Engine = new RenderEngine();
        var GameEngine = new Game.GameCore(Engine);
        GameEngine.LoadAssets();

        //Bind controls
        addEventListener("keydown", GameEngine.controls.HandleKeyboardEventDown, false);
        addEventListener("keyup", GameEngine.controls.HandleKeyboardEventUp, false);

        setInterval(function () {
            GameEngine.Update();
        }, 1);
    };
})(Game || (Game = {}));
//# sourceMappingURL=app.js.map
