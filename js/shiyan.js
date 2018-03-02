Array.prototype.callEach = function (callback, num) {
    for (var i = 0; i < this.length; i++) {
        if (i < num) {
            callback.call(this[i]);
        }
    }
};
var Particle = {
    init: function (options) {
        var t = this;
        t.opt = options;
        t.ctx = options.canvas.getContext("2d");
        t.Particles = t.createSquareParticle();
        t.squareInit();
    },
    imgSrc: "../image/e476e2d1e62a42d2a5fc09924ed33b47.PNG",
    play: true,
    sequence: 1,
    opt: null,
    userIndex: 20,
    userParam: {},
    userInitArcR:3,
    validNum: 220,
    wordAtomsCoordinate: [],
    Particles: [],
    lightTimer:null,
    squareInit: function () {
        var t = this;
        t.Particles.callEach(function () {
            this.paint();
        }, t.validNum);
        setTimeout(function () {
            t.startMove();
        }, 1000);

    },
    lightInit: function (opt) {
        //画圆
        var t = this;
        var canvas = document.getElementById("light");
        var context = canvas.getContext("2d");
        var radius = 0;
        var lineWidth = 3;
        canvas.width = t.opt.canvas.width;
        canvas.height = t.opt.canvas.height;
        var drawCircle = function() {
            context.clearRect(0,0, canvas.width,canvas.height);
            context.beginPath();
            context.arc(t.userParam.disx+3, t.userParam.disy+3, radius, 0, Math.PI * 2);
            context.closePath();
            context.lineWidth = lineWidth; //线条宽度
            context.strokeStyle = 'rgba(250,250,50,1)'; //颜色
            context.stroke();
            radius += 0.05; //每一帧半径增加0.5
            lineWidth-=.1;
            //半径radius大于30时，重置为0
            if (radius > 6) {
                radius = 0;
            }
            if(lineWidth<0){
                lineWidth = 3;
            }
        };

        //创建一个临时canvas来缓存主canvas的历史图像
        var backCanvas = document.getElementById('lightBg'),
            backCtx = backCanvas.getContext('2d');
        backCanvas.width = canvas.width;
        backCanvas.height = canvas.height;
        //设置主canvas的绘制透明度
        context.globalAlpha = .95;
        //显示即将绘制的图像，忽略临时canvas中已存在的图像
        backCtx.globalCompositeOperation = 'copy';
        var render = function() {
            //1.先将主canvas的图像缓存到临时canvas中
            backCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height);

            //2.清除主canvas上的图像
            context.clearRect(0, 0, canvas.width, canvas.height);

            //3.在主canvas上画新圆
            drawCircle();

            //4.等新圆画完后，再把临时canvas的图像绘制回主canvas中
            context.drawImage(backCanvas, 0, 0, canvas.width, canvas.width);
        };
        var timer = setInterval(function(){
            render();
        },1000/60);
    },
    startMove: function () {
        var t = Particle;
        t.animate({type: t.sequence});
        if (t.play) {//暂停的时候终止运动
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
        }
    },
    focallength: 250,
    animate: function (animateOpt) {
        var t = this;
        var animateType = parseInt(animateOpt.type, 10);//0，平面扩散，1运动到空间散射，2形成文字，3整体放大，4整体缩小
        t.ctx.clearRect(0, 0, t.opt.canvas.width, t.opt.canvas.height);
        t.Particles.callEach(function () {
            t.animateData(this, animateType);
            this.paint();
        }, t.validNum);

    },
    drawText: function (callBack) {
        var t = this;
        var image = new Image(); //定义一个图片对象
        image.src = t.imgSrc;
        image.onload = function () {
            var nowCanvas = document.getElementById("word");
            var ctx = nowCanvas.getContext("2d");
            ctx.clearRect(0, 0, nowCanvas.width, nowCanvas.height);
            ctx.drawImage(image, 0, 0, nowCanvas.width, nowCanvas.height);//将图片从Canvas画布的左上角(0,0)位置开始绘制，大小默认为图片实际大小
            var imgData = ctx.getImageData(0, 0, nowCanvas.width, nowCanvas.height);
            var sumNum = 0;
            for (var i = 0; i < imgData.width; i += 6) {
                for (var j = 0; j < imgData.height; j += 6) {
                    var num = (j * imgData.width + i) * 4;
                    if (imgData.data[num] < 128) {
                        if (sumNum < t.validNum) {
                            var dataJson = {
                                disx: i - 3,
                                disy: j - 3,
                                disz: 0
                            };
                            t.wordAtomsCoordinate.push(dataJson);
                            sumNum++;
                        }
                    }
                }
            }
            t.wordAtomsCoordinate = t.wordAtomsCoordinate.sort(t.randomSort);
            for (var wNum = 0; wNum < t.wordAtomsCoordinate.length; wNum++) {
                if (wNum < t.validNum) {
                    for (var k in t.wordAtomsCoordinate[wNum]) {
                        t.Particles[wNum][k] = t.wordAtomsCoordinate[wNum][k];
                    }
                }
            }
            t.sequence = 2;
            t.play = true;
            callBack && callBack();
        };

    },
    createWordParticle: function () {
        var t = this;
        var callBack = function () {
            setTimeout(function () {
                t.startMove();
            }, 1000);
        };
        t.drawText(callBack);
    },
    animateData: function (obj, animateType) {
        var t = this;
        var particle = obj;
        switch (animateType) {
            case 0:
                break;
            case 1:
                if (Math.abs(particle.locx - particle.x) < 0.1 && Math.abs(particle.locy - particle.y) < 0.1 && Math.abs(particle.locz - particle.z) < 0.1) {
                    particle.x = particle.locx;
                    particle.y = particle.locy;
                    particle.z = particle.z + (particle.locz - particle.z) * 0.1;
                    t.play = false;
                    t.createWordParticle();
                } else {
                    particle.x = particle.x + (particle.locx - particle.x) * 0.01;
                    particle.y = particle.y + (particle.locy - particle.y) * 0.01;
                    particle.z = particle.z + (particle.locz - particle.z) * 0.01;
                }
                break;
            case 2:
                if (Math.abs(particle.disx - particle.x) < 0.1 && Math.abs(particle.disy - particle.y) < 0.1 && Math.abs(particle.disz - particle.z) < 0.1) {
                    particle.x = particle.disx;
                    particle.y = particle.disy;
                    particle.z = particle.disz;
                    t.play = false;
                    console.log("开启");
                    t.lightInit();
                } else {
                    particle.x = particle.x + (particle.disx - particle.x) * 0.1;
                    particle.y = particle.y + (particle.disy - particle.y) * 0.1;
                    particle.z = particle.z + (particle.disz - particle.z) * 0.1;

                }

                break;
        }

        return particle;
    },
    zoomScale: function (type) {
        var t = this;
        for (var num = 0; num < t.Particles.length; num++) {

        }
    },
    orig: 6,
    atoms: function (x, y, z, r) {
        var t = this;
        return {
            x: x,
            y: y,
            z: z,
            r: r,
            locx: parseInt(Math.random() * t.opt.canvas.width),
            locy: parseInt(Math.random() * t.opt.canvas.height),
            locz: Math.random() * t.focallength * 2 - t.focallength,
            radius: r,
            paint: function () {
                var ctx = t.ctx;
                var focallength = t.focallength;
                var canvas = t.opt.canvas;
                var scale = focallength / (focallength + this.z);
                var arcX = canvas.width / 2 + (this.x - canvas.width / 2) * scale;
                var arcY = canvas.height / 2 + (this.y - canvas.height / 2) * scale;
                var arcR = this.radius * scale;
                var image = new Image(); //定义一个图片对象
                if(this.isUser){
                    image.src = '../image/junyong02.jpg';
                    arcR = t.magnifyUser(t.sequence);
                }else{
                    image.src = '../image/home.jpg';
                }
                ctx.drawImage(image, arcX, arcY, 2 * arcR, 2 * arcR);
            }
        }
    },
    magnifyUser: function (direction) {
        var t = this;
        var nowArcR = t.userInitArcR;
        switch (direction) {
            case 0:
                break;
            case 1:
                nowArcR += .1;
                break;
            case 2:
                if (nowArcR > 3) {
                    nowArcR -= 2;
                }else{
                    nowArcR = 3;
                }
                break;
        }
        t.userInitArcR = nowArcR;
        return t.userInitArcR;
    },
    randomSort: function (a, b) {
        return Math.random() > 0.5 ? -1 : 1;
    },
    createSquareParticle: function () {
        var t = this;
        var newArr = [];
        for (var i = 0; i < t.opt.canvas.width; i += 6) {
            for (var j = 0; j < t.opt.canvas.height; j += 6) {
                var particle = t.atoms(i - 3, j - 3, 0, 3);
                newArr.push(particle);
            }
        }
        var lastArr = newArr.sort(t.randomSort);
        lastArr.forEach(function(val,index){
            if(index===t.userIndex){
                val.isUser = true;
                t.userParam = val;
            }else{
                val.isUser = false;
            }
        });
        return lastArr;
    }
};
