Array.prototype.callEach = function (callback,num) {
    for (var i = 0; i < this.length; i++) {
        if(i<num){
            callback.call(this[i]);
        }
    }
};
var Particle = {
    init:function(options){
        var t = this;
        t.opt = options;
        t.ctx = options.canvas.getContext("2d");
        t.Particles = t.createSquareParticle();
        console.log(t.Particles);
        t.squareInit();
    },
    imgSrc:"../image/e476e2d1e62a42d2a5fc09924ed33b47.PNG",
    play:true,
    sequence:1,
    opt:null,
    userIndex:20,
    userParam:{},
    validNum:220,
    wordAtomsCoordinate:[],
    Particles:[],
    squareInit:function(){
        var t = this;
        t.Particles.callEach(function(){
            this.paint();
        },t.validNum);
        setTimeout(function(){
            t.startMove();
        },1000);

    },
    startMove:function(){
        var t = Particle;
        t.animate({type:t.sequence});
        if(t.play){//暂停的时候终止运动
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
    focallength:250,
    animate:function(animateOpt){
      var t = this;
      var animateType = parseInt(animateOpt.type,10);//0，平面扩散，1运动到空间散射，2形成文字，3整体放大，4整体缩小
        t.ctx.clearRect(0, 0, t.opt.canvas.width, t.opt.canvas.height);
        t.Particles.callEach(function(){
            t.animateData(this,animateType);
            this.paint();
        },t.validNum);

    },
    drawText:function(callBack){
        var t = this;
        var image = new Image(); //定义一个图片对象
        image.src = t.imgSrc;
        image.onload = function(){
            var nowCanvas = document.getElementById("word");
            var ctx = nowCanvas.getContext("2d");
            ctx.clearRect(0, 0, nowCanvas.width, nowCanvas.height);
            ctx.drawImage(image,0,0,nowCanvas.width,nowCanvas.height);//将图片从Canvas画布的左上角(0,0)位置开始绘制，大小默认为图片实际大小
            var imgData = ctx.getImageData(0, 0, nowCanvas.width, nowCanvas.height);
            var sumNum = 0;
            for (var i = 0; i < imgData.width; i += 6) {
                for (var j = 0; j < imgData.height; j += 6) {
                    var num = (j * imgData.width + i) * 4;
                    if (imgData.data[num] < 128) {
                        if(sumNum<t.validNum){
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
            for(var wNum = 0;wNum<t.wordAtomsCoordinate.length;wNum++){
                if(wNum<t.validNum){
                    for(var k in t.wordAtomsCoordinate[wNum]){
                        t.Particles[wNum][k] = t.wordAtomsCoordinate[wNum][k];
                    }
                }
            }
            t.sequence=2;
            t.play = true;
            callBack&&callBack();
        };

    },
    createWordParticle:function(){
        var t = this;
        var callBack = function(){
            setTimeout(function(){
                t.startMove();
            },1000);
        };
        t.drawText(callBack);
    },
    animateData:function(obj,animateType){
        var t = this;
        var particle = obj;
        switch (animateType){
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
                        t.zoomScale();
                    } else {
                        particle.x = particle.x + (particle.disx - particle.x) * 0.1;
                        particle.y = particle.y + (particle.disy - particle.y) * 0.1;
                        particle.z = particle.z + (particle.disz - particle.z) * 0.1;

                    }

                break;
        }

        return particle;
    },
    zoomScale:function(type){
        var t = this;
        for(var num = 0;num<t.Particles.length;num++){

        }
    },
    atoms:function(x,y,z,r){
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
                var canvas = t.opt.canvas;
                var focallength = t.focallength;
                var image = new Image(); //定义一个图片对象

                if(this.isUser){
                    console.log(this);
                    t.userParam = this;
                    this.src = '../image/junyong02.jpg';
                    image.src = this.src;
                }else{
                    this.src = '../image/home.jpg';
                    image.src = this.src;
                }
                ctx.save();
                ctx.beginPath();
                var scale = focallength / (focallength + this.z);
                var arcX = canvas.width / 2 + (this.x - canvas.width / 2) * scale;
                var arcY = canvas.height / 2 + (this.y - canvas.height / 2) * scale;
                var arcR = this.radius * scale;
                var arcSAngle = 0;
                var arcCounterclockwise = 2 * Math.PI;
                ctx.drawImage(image, arcX, arcY, 2 * arcR, 2 * arcR);
                ctx.arc(arcX, arcY, arcR, arcSAngle, arcCounterclockwise);
                ctx.fillStyle = "rgba(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + 0 + ")";
                /*ctx.fillStyle = "rgba(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + scale + ")";*/
                ctx.fill();
                ctx.restore();
            }
        }
    },
    randomSort:function(a, b) {
        return Math.random() > 0.5 ? -1 : 1;
    },
    createSquareParticle:function(){
        var t = this;
        var newArr = [];
        for (var i = 0; i < t.opt.canvas.width; i += 6) {
            for (var j = 0; j < t.opt.canvas.height; j += 6) {
                    var particle = t.atoms(i - 3, j - 3, 0, 3);
                newArr.push(particle);
            }
        }
        var lastArr = newArr.sort(t.randomSort);
        for(var num=0;num<lastArr.length;num++){
            var obj = lastArr[num];
            if(num===t.userIndex){
                obj.isUser = true;
                obj.locx = 135;
                obj.locy = 15;
                obj.locz = 35;
            }else{
                obj.isUser = false;
            }
        }
        return lastArr;
    }
};
