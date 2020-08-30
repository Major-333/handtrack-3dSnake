var container;
var camera, scene, renderer;
var snake, food;
var cubeGroup;
var GameStart = false;
var gameScore = 0;
function Cube(x, y, z, a, color) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.a = a;
    this.color = color;
}

Cube.prototype.draw = function() {

    var geometry = new THREE.BoxGeometry( this.a, this.a, this.a );
    var material = new THREE.MeshLambertMaterial( { color: this.color, overdraw: 0.5 } );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.x = this.x;
    cube.position.z = this.z;
    cubeGroup.add(cube);
    scene.add(cubeGroup);
};

function Snake () {
    var snakeArr = [];
    for (var i = 0; i < 4; i++) {
        var cube = new Cube(i*50, 50, 0, 50, 0xffffff);
        snakeArr.splice(0,0,cube);
    }
    var head = snakeArr[0];
    head.color = "red";


    this.head = snakeArr[0];
    this.snakeArr = snakeArr;
    this.direction = 39;
    this.directionBuffer = 39;
};

Snake.prototype.draw = function () {
    if(this.isover) {
        return;
    }
    for (var i = 0; i < this.snakeArr.length; i++) {
        this.snakeArr[i].draw();
    }
};

Snake.prototype.move = function () {
    var cube = new Cube(this.head.x, this.head.y, this.head.z, this.head.a, 0xffffff);
    this.snakeArr.splice(1, 0, cube);


    if (isEat()) {
        let score = document.getElementById("score");
        score.innerText = "score: "+gameScore.toString();
        food = new getRandomFood();
    } else {
        this.snakeArr.pop();

    }
    console.log("directionBuffer: ",this.directionBuffer, this.direction);
    switch (this.directionBuffer) {
        case 37://左
            if(this.direction !== 39){
                this.head.x -= this.head.a;
                this.direction = this.directionBuffer;
            } else {
                this.head.x += this.head.a;
                this.directionBuffer = this.direction;
            }
            break;
        case 38://上
            if(this.direction !== 40){
                this.head.z -= this.head.a;
                this.direction = this.directionBuffer;
            } else {
                this.head.z += this.head.a;
                this.directionBuffer = this.direction;
            }
            break;
        case 39: //右
            if(this.direction !== 37){
                this.head.x += this.head.a;
                this.direction = this.directionBuffer;
            } else {
                this.head.x -= this.head.a;
                this.directionBuffer = this.direction;
            }
            break;
        case 40://下
            if(this.direction !== 38){
                this.head.z += this.head.a;
                this.direction = this.directionBuffer;
            } else {
                this.head.z -= this.head.a;
                this.directionBuffer = this.direction;
            }
            break;
        default:
            break;
    }
    if (this.head.x > 450 || this.head.x < -500 || this.head.z > 450 || this.head.z < -500){
        this.isover= true;
        stop();
    }

    for (var i = 1; i < this.snakeArr.length; i++) {
        if (this.snakeArr[i].x == this.head.x && this.snakeArr[i].z == this.head.z){
            this.isover= true;
            stop();
        }
    }


};

function getNumberInRange (min,max) {
    var range = max-min;
    var r = Math.random();
    return Math.round(r*range+min)
}

function getRandomFood () {

    var isOnSnake = true;
    while(isOnSnake){

        isOnSnake = false;
        var indexX = getNumberInRange(-10, 9);
        var indexZ = getNumberInRange(-10, 9);
        var cube = new Cube(indexX*50, 50, indexZ*50, 50, "green");
        for (var i = 0; i < snake.snakeArr.length; i++) {
            if(snake.snakeArr[i].x == cube.x && snake.snakeArr[i].z == cube.z){
                isOnSnake = true;
                break;
            }
        }
    }
    return cube;
}

function isEat () {
    if (snake.head.x == food.x && snake.head.z == food.z){
        gameScore += 10;
        return true;
    } else {
        return false;
    }
}

document.onkeydown = function (e) {
    var ev = e||window.event;
    console.log(ev.keyCode);

    switch(ev.keyCode){
        case 37:{
            if (snake.direction !== 39 && !snake.isover){
                // snake.direction = 37;
                snake.directionBuffer = 37;
            }
            GameStart = true;
            break;
        }
        case 38:{
            if (snake.direction !== 40 && !snake.isover){
                // snake.direction = 38;
                snake.directionBuffer = 38;
            }
            GameStart = true;
            break;
        }
        case 39:{
            if (snake.direction !== 37 && !snake.isover){
                // snake.direction = 39;
                snake.directionBuffer = 39;
            }
            GameStart = true;
            break;
        }
        case 40:{
            if (snake.direction !== 38 && !snake.isover){
                // snake.direction = 40;
                snake.directionBuffer = 40;
            }
            GameStart = true;
            break;
        }
        case 32:{
            GameStart = false;
            restart();
            break;
        }
        default:
            break;
    }
    ev.preventDefault();
};

function restart() {
    let result = document.getElementById("result");
    result.style.display = "none";
    scene.remove(cubeGroup);
    cubeGroup = new THREE.Object3D();
    snake = new Snake();
    food = new getRandomFood();
    gameScore = 0;
    let score = document.getElementById("score");
    score.innerText = "score: "+gameScore.toString();
    start();
}

function init() {
    container = document.createElement("div");
    document.body.appendChild(container);
    // container = document.getElementById("container");
    // container.style.zIndex = 1;
    // let context = container.getContext('2d');
    // context.fillStyle = 'rgba(255, 255, 255, 0)';
    //

    camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -500, 1000);
    camera.position.x = 100;
    camera.position.y = 100;
    camera.position.z = 100;

    scene = new THREE.Scene();

    //grid
    var size = 500, step = 50;

    var geometry = new THREE.Geometry();
    for ( var i = - size; i <= size; i += step) {

        geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
        geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

        geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
        geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );
    }
    var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.5 } );

    var line = new THREE.LineSegments( geometry, material );
    scene.add( line );


    cubeGroup = new THREE.Object3D();

    snake = new Snake();
    food = new getRandomFood();


    var ambientLight = new THREE.AmbientLight( Math.random() * 0x10 );
    scene.add( ambientLight );

    var pointLight = new THREE.PointLight("#ccffcc");
    pointLight.position.set(0, 10, 10);
    scene.add( pointLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.x = -0.3;
    directionalLight.position.y = 0.8;
    directionalLight.position.z = 0.3;
    directionalLight.position.normalize();
    scene.add( directionalLight );



    renderer = new THREE.CanvasRenderer();
    // renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setClearColor( 0xf0f0f0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );


    window.addEventListener( 'resize', onWindowResize, false );
    console.log(cubeGroup);
    console.log(snake);
    console.log(food);
}



function onWindowResize() {

    camera.left = window.innerWidth / - 2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = window.innerHeight / - 2;

    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    window.location.reload();
}

var ani;
function animate() {
    ani = setTimeout("requestAnimationFrame("+ animate +")", 600);
    render();

}

function start () {
    if (!ani && !this.isover) {
        animate();
    }
}

function stop () {
    if(ani) {
        cancelAnimationFrame(ani);
        clearTimeout(ani);
        ani = undefined;

        let result_score = document.getElementById("result_score");
        result_score.innerText = "score: "+gameScore.toString();
        let result = document.getElementById("result");
        result.style.display = "";
    }
}

function render() {
    //写变化
    scene.remove(cubeGroup);
    cubeGroup = new THREE.Object3D();
    snake.draw();
    if(GameStart) {
        snake.move();
    }
    food.draw();
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}

init();
start();
