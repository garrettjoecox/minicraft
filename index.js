var _minicraft = (function () {
'use strict';

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var keyCodes = {
    16: 'shift',
    87: 'w',
    65: 'a',
    83: 's',
    68: 'd',
    32: 'space'
};
var InputHandler = (function () {
    function InputHandler() {
        var _this = this;
        this.bindings = {
            w: 'up',
            a: 'left',
            s: 'down',
            d: 'right'
        };
        this.state = {
            up: false,
            left: false,
            down: false,
            right: false
        };
        document.addEventListener('keydown', function (e) { return _this.toggle(e.which, true); });
        document.addEventListener('keyup', function (e) { return _this.toggle(e.which, false); });
    }
    InputHandler.prototype.toggle = function (code, pressed) {
        if (code in keyCodes && keyCodes[code] in this.bindings) {
            var key = keyCodes[code];
            var action = this.bindings[key];
            if (action in this.state)
                this.state[action] = pressed;
        }
    };
    return InputHandler;
}());

var Entity = (function () {
    function Entity() {
    }
    Entity.prototype.tick = function () {
    };
    Entity.prototype.render = function (gameCanvas) {
    };
    Entity.prototype.remove = function () {
    };
    Entity.prototype.move = function (xa, ya) {
        if (xa !== 0 || ya !== 0) {
            this.x += xa;
            this.y += ya;
        }
    };
    return Entity;
}());

var Player = (function (_super) {
    __extends(Player, _super);
    function Player(_a) {
        var inputHandler = _a.inputHandler;
        _super.call(this);
        this.x = 0;
        this.y = 0;
        this.inputHandler = inputHandler;
    }
    Player.prototype.tick = function () {
        var xa = 0;
        var ya = 0;
        if (this.inputHandler.state.up)
            ya -= 1;
        if (this.inputHandler.state.down)
            ya += 1;
        if (this.inputHandler.state.left)
            xa -= 1;
        if (this.inputHandler.state.right)
            xa += 1;
        _super.prototype.move.call(this, xa, ya);
    };
    Player.prototype.render = function (gameCanvas) {
        gameCanvas.ctx.fillStyle = 'white';
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
        gameCanvas.ctx.fill();
    };
    return Player;
}(Entity));

var GameCanvas = (function () {
    function GameCanvas(_a) {
        var canvas = _a.canvas;
        this.frontCanvas = canvas;
        this.frontCtx = this.frontCanvas.getContext('2d');
        this.width = this.frontCanvas.offsetWidth;
        this.height = this.frontCanvas.offsetHeight;
        this.backCanvas = document.createElement('canvas');
        this.backCtx = this.backCanvas.getContext('2d');
        this.backCanvas.width = this.width;
        this.backCanvas.height = this.height;
    }
    Object.defineProperty(GameCanvas.prototype, "ctx", {
        get: function () {
            return this.backCtx;
        },
        enumerable: true,
        configurable: true
    });
    GameCanvas.prototype.clear = function () {
        this.backCtx.clearRect(0, 0, this.width, this.height);
    };
    GameCanvas.prototype.updateBuffer = function () {
        this.frontCtx.clearRect(0, 0, this.width, this.height);
        this.frontCtx.drawImage(this.backCanvas, 0, 0);
    };
    return GameCanvas;
}());

var GameLoop = (function () {
    function GameLoop() {
        this.running = false;
        this.unprocessed = 0;
        this.msPerTick = 1000 / 60;
        this.fps = 60;
        this.stats = {
            updateTime: 0,
            renderTime: 0,
            frameTime: 0,
            frameCount: 0,
            fps: 0
        };
    }
    GameLoop.prototype.start = function () {
        this.running = true;
        this.lastFrame = this.timestamp();
        this.frame();
    };
    GameLoop.prototype.stop = function () {
        this.running = false;
    };
    GameLoop.prototype.renderStats = function (gameCanvas) {
        gameCanvas.ctx.fillStyle = 'white';
        gameCanvas.ctx.font = '9pt sans-serif';
        gameCanvas.ctx.fillText("frame: " + this.stats.frameCount, gameCanvas.width - 100, gameCanvas.height - 75);
        gameCanvas.ctx.fillText("fps: " + this.stats.fps, gameCanvas.width - 100, gameCanvas.height - 60);
        gameCanvas.ctx.fillText("update: " + this.stats.updateTime + "ms", gameCanvas.width - 100, gameCanvas.height - 45);
        gameCanvas.ctx.fillText("render: " + this.stats.renderTime + "ms", gameCanvas.width - 100, gameCanvas.height - 30);
    };
    GameLoop.prototype.setTickHandler = function (handler) {
        this.tickHandler = handler;
    };
    GameLoop.prototype.removeTickHandler = function () {
        delete this.tickHandler;
    };
    GameLoop.prototype.setRenderHandler = function (handler) {
        this.renderHandler = handler;
    };
    GameLoop.prototype.removeRenderHandler = function () {
        delete this.renderHandler;
    };
    GameLoop.prototype.frame = function () {
        var _this = this;
        var start = this.timestamp();
        this.unprocessed += (start - this.lastFrame) / this.msPerTick;
        while (this.unprocessed >= 1) {
            this.emitTick();
            this.unprocessed -= 1;
        }
        var middle = this.timestamp();
        this.emitRender();
        var end = this.timestamp();
        this.updateStats(middle - start, end - middle);
        this.lastFrame = start;
        if (this.running)
            requestAnimationFrame(function () { return _this.frame(); });
    };
    GameLoop.prototype.timestamp = function () {
        return window.performance.now();
    };
    GameLoop.prototype.emitTick = function () {
        if (this.tickHandler)
            this.tickHandler();
    };
    GameLoop.prototype.emitRender = function () {
        if (this.renderHandler)
            this.renderHandler();
    };
    GameLoop.prototype.updateStats = function (updateTime, renderTime) {
        this.stats.updateTime = Math.floor(Math.max(1, updateTime));
        this.stats.renderTime = Math.floor(Math.max(1, renderTime));
        this.stats.frameTime = this.stats.updateTime + this.stats.renderTime;
        this.stats.frameCount = this.stats.frameCount === this.fps ? 0 : this.stats.frameCount + 1;
        this.stats.fps = Math.floor(Math.min(this.fps, 1000 / this.stats.frameTime));
    };
    return GameLoop;
}());

var Minicraft = (function () {
    function Minicraft(_a) {
        var _this = this;
        var canvas = _a.canvas;
        this.inputHandler = new InputHandler();
        this.gameCanvas = new GameCanvas({ canvas });
        this.gameLoop = new GameLoop();
        this.player = new Player({ inputHandler: this.inputHandler });
        this.gameLoop.start();
        this.gameLoop.setTickHandler(function () {
            _this.player.tick();
        });
        this.gameLoop.setRenderHandler(function () {
            _this.gameCanvas.clear();
            _this.player.render(_this.gameCanvas);
            _this.gameLoop.renderStats(_this.gameCanvas);
            _this.gameCanvas.updateBuffer();
        });
    }
    return Minicraft;
}());
window.Minicraft = Minicraft;

return Minicraft;

}());
