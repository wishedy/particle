Array.prototype.callEach = function (callback) {
    for (var i = 0; i < this.length; i++) {
        callback.call(this[i]);
    }
};
var Particle = {
    ctx: null,
    txt: "",
    derection: true,
    pause: false,
    lastTime: null,
    particleArr: null,
    timer: null,
    focallength: 250,//运动幅度
    move: function () {
        var t = this;
        t.timer = setTimeout(t.makeParticle, 10)

    },
    makeParticle: function () {
        var t = Particle;
        t.ctx.clearRect(0, 0, 1432, 768);
        for (var i = 0; i < t.particleArr.length; i++) {
            var particle = t.particleArr[i];
            particle.paint();
        }
    },
    initMove: function () {
        var t = this;
        t.particleArr.callEach(function () {
            this.locx = parseInt(Math.random() * t.opt.canvas.width);
            this.locy = parseInt(Math.random() * t.opt.canvas.height);
            this.locz = Math.random() * t.focallength * 2 - t.focallength;
            this.x = parseInt(Math.random() * t.opt.canvas.width);
            this.y = parseInt(Math.random() * t.opt.canvas.height);
            this.z = Math.random() * t.focallength * 2 - t.focallength;
            //this.paint();
        });
        console.log(t.particleArr)
        //t.startMove(t.ctx);
    },
    startMove: function (ctx) {
        var t = Particle;
        clearInterval(t.timer);
        var thisTime = new Date();
        t.ctx.clearRect(0, 0, t.opt.canvas.width, t.opt.canvas.height);
        t.particleArr.callEach(function () {
            var particle = this;
            if (t.derection) {
                //此时粒子呈现聚合状态
                if (Math.abs(particle.disx - particle.x) < 0.1 && Math.abs(particle.disy - particle.y) < 0.1 && Math.abs(particle.disz - particle.z) < 0.1) {
                    particle.x = particle.disx;
                    particle.y = particle.disy;
                    particle.z = particle.disz;
                    if (thisTime - t.lastTime > 300) {
                        t.derection = false;
                    }
                } else {
                    particle.x = particle.x + (particle.disx - particle.x) * 0.1;
                    particle.y = particle.y + (particle.disy - particle.y) * 0.1;
                    particle.z = particle.z + (particle.disz - particle.z) * 0.1;
                    t.lastTime = new Date();
                }
            } else {
                //粒子在不断地散开
                if (Math.abs(particle.locx - particle.x) < 0.1 && Math.abs(particle.locy - particle.y) < 0.1 && Math.abs(particle.locz - particle.z) < 0.1) {
                    particle.x = particle.locx;
                    particle.y = particle.locy;
                    particle.z = particle.z + (particle.locz - particle.z) * 0.1;
                    t.pause = true;
                    clearInterval(t.timer);
                    t.move();

                } else {
                    particle.x = particle.x + (particle.locx - particle.x) * 0.01;
                    particle.y = particle.y + (particle.locy - particle.y) * 0.01;
                    particle.z = particle.z + (particle.locz - particle.z) * 0.01;
                    //console.log(particle.locx);
                    t.pause = false;
                }
            }
            particle.paint();
        });
        if (!t.pause) {
            if ("requestAnimationFrame" in window) {
                requestAnimationFrame(t.startMove);
            }
            else if ("webkitRequestAnimationFrame" in window) {
                webkitRequestAnimationFrame(t.startMove);
            }
            else if ("msRequestAnimationFrame" in window) {
                msRequestAnimationFrame(t.startMove);
            }
            else if ("mozRequestAnimationFrame" in window) {
                mozRequestAnimationFrame(t.startMove);
            }
            //setTimeout(t.startMove,Math.floor(100))
        }
    },
    createParticle: function (text) {
        var t = this;
        t.drawText(text);
        var ctx = t.ctx;
        var imgData = ctx.getImageData(0, 0, t.opt.canvas.width, t.opt.canvas.height);
        ctx.clearRect(0, 0, t.opt.canvas.width, t.opt.canvas.height);
        var newArr = [];
        for (var i = 0; i < imgData.width; i += 6) {
            for (var j = 0; j < imgData.height; j += 6) {
                var num = (j * imgData.width + i) * 4;
                if (imgData.data[num] >= 128) {
                    var particle = t.atoms(i - 3, j - 3, 0, 3);
                    newArr.push(particle);
                }
            }
        }
        return newArr
    },
    atoms: function (x, y, z, r) {
        var t = this;
        var atom = {
            disx: x,//文字锁定的位置
            disy: y,
            disz: z,
            x: x,
            y: y,
            z: z,
            locx: 0,
            locy: 0,//   运动前位置
            locz: 0,
            radius: r,
            col: "rgba(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ",1)",
            paint: function () {
                var ctx = t.ctx;
                var canvas = t.opt.canvas;
                //var focallength = t.focallength;
                var focallength = 250;
                var image = new Image(); //定义一个图片对象
                image.src = 'image/home.jpg';
                ctx.save();
                ctx.beginPath();
                var scale = focallength / (focallength + this.z);
                //var scale = this.z;
                var arcX =canvas.width / 2 + (this.x - canvas.width / 2) * scale;
                var arcY = canvas.height / 2 + (this.y - canvas.height / 2) * scale;
                var arcR = this.radius * scale;
                var arcSAngle = 0;
                var arcCounterclockwise = 2 * Math.PI;
                ctx.drawImage(image,arcX,arcY,2*arcR,2*arcR);
                ctx.arc(arcX, arcY, arcR, arcSAngle, arcCounterclockwise);

                ctx.fillStyle = "rgba(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + 0 + ")";
                /*ctx.fillStyle = "rgba(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + scale + ")";*/
                ctx.fill();
                ctx.restore();
            }
        };
        console.log(atom.locx)
        return atom;

    },
    drawText: function (text) {
        var t = this;
        var ctx = t.ctx;
        var canvas = t.opt.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.font = "136px 微软雅黑 bold";
        ctx.fillStyle = "rgba(255,255,255,1)";//纯色 方便扫面
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        ctx.restore();
    },
    init: function (options) {
        var t = this;
        t.opt = options;
        t.ctx = options.canvas.getContext("2d");
        t.txt = options.txt;
        t.particleArr = t.createParticle(t.txt);
        t.initMove();
    }
};