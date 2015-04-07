var Game;
(function (Game) {
    var Controls = (function () {
        function Controls() {
            var _this = this;
            this.HandleKeyboardEventUp = function (e) {
                if (e.keyCode == 38) {
                    _this.upPressed = false;
                }
                if (e.keyCode == 40) {
                    _this.downPressed = false;
                }
                if (e.keyCode == 37) {
                    _this.leftPressed = false;
                }
                if (e.keyCode == 39) {
                    _this.rightPressed = false;
                }
                if (e.keyCode == 32) {
                    _this.firePressed = false;
                }
            };
            this.HandleKeyboardEventDown = function (e) {
                if (e.keyCode == 38) {
                    _this.upPressed = true;
                }
                if (e.keyCode == 40) {
                    _this.downPressed = true;
                }
                if (e.keyCode == 37) {
                    _this.leftPressed = true;
                }
                if (e.keyCode == 39) {
                    _this.rightPressed = true;
                }
                if (e.keyCode == 32) {
                    _this.firePressed = true;
                }
            };
        }
        return Controls;
    })();
    Game.Controls = Controls;
})(Game || (Game = {}));
//# sourceMappingURL=Controls.js.map
