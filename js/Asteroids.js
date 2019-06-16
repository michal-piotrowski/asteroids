/************************** SET THE SCENE *************************/
const THREE = require('three');
const DevUtils = require('./DevUtils');
require('three-fly-controls')(THREE);


const Meteorite = require("./Model/Meteorite").Meteorite;
const M_TYPE = require("./Model/Meteorite").TYPE;

const width = window.innerWidth;
const height = window.innerHeight;
const viewAngle = 45;
const nearClipping = 0.1;
const farClipping = 9999;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(viewAngle, width / height, nearClipping, farClipping);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor(0x000308);
renderer.setSize(width, height);
renderer.
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    THREE.Frustum
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

/************************** INITIALIZE OBJECTS *************************/

let projectiles = [];

// let meteorites = [
//     new Meteorite(-2, 4, -3, 2, 1, 1, M_TYPE.SPHERE),
//     new Meteorite(-2, -12, -3, 1, 1, 1, M_TYPE.SPHERE, {color: 0x1fef23}),
//     new Meteorite(-1, 0, -6, 1, 1, 1, M_TYPE.SPHERE, {color: 0xff1fa3}),
//     new Meteorite(1, 0, -9, 1, 1, 1, M_TYPE.SPHERE, {color: 0x2e02f3})
// ];

let shipGeometry = new THREE.ConeGeometry(0.5, 1, 4);
let shipMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00});
let ship = new THREE.Mesh(shipGeometry, shipMaterial);
let shipBox = new THREE.BoxHelper(ship, 0xffff00); // w celach wykrywania kolizji, ale
ship.add(shipBox);
// scene.add(shipBox);

let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);


let sphereGeometry = new THREE.SphereGeometry(0.5, 8, 8);
let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x0000ff});
let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

let starsGeometry = new THREE.SphereGeometry(0, 0, 0);

for (let i = 0; i < 50000; i++) {

    let star = new THREE.Vector3();
    star.x = THREE.Math.randFloatSpread(5000);
    star.y = THREE.Math.randFloatSpread(5000);
    star.z = THREE.Math.randFloatSpread(5000);
    starsGeometry.vertices.push(star);
}

let starsMaterial = new THREE.PointsMaterial({
    color: new THREE.Color(0xf3c3ff),
    sizeAttenuation: false,
    fog: false
});
let starField = new THREE.Points(starsGeometry, starsMaterial);

scene.add(starField);

cube.position.x = -2;
cube.position.z = -5;
sphere.position.z = -5;
sphere.position.x = 2;
scene.add(cube);
scene.add(sphere);

/************************** LIGHT *************************/
//
// let light = new THREE.DirectionalLight(0xFFFFFF, 1);
// light.position.x = 0;
// light.position.y = 10;
// light.position.z = 0;
// scene.add(light);

let light = new THREE.HemisphereLight(0xaa00dd, 0xffffff, 0.5);
light.position.x = 0;
light.position.y = 10;
light.position.z = 0;
scene.add(light);

scene.fog = new THREE.FogExp2( 0x000000, 0.06 );


/************************** TEXTURES *************************/
//
// var textureLoader = new THREE.TextureLoader();
// textureLoader.load("../resources/grass_texture.png", texture => {
//     coneGeometry = new THREE.ConeGeometry( 0.5, 1, 4 );
//     coneMaterial = new THREE.MeshLambertMaterial( { map: texture } );
//     cone = new THREE.Mesh( coneGeometry, coneMaterial);
//     cone.position.z = -5;
//     scene.add(cone);
//     }
// );

// const update = function () {
//     /** Bringing meteorites closer to (0,0,0) **/
//     for (let meteorite of meteorites) {
//         bringCloser(meteorite);
//     }
// };

/************************* MOUSE CONTROLS **************************/
const controls = new THREE.FlyControls(camera);

document.addEventListener('onfocus', () => {
    controls.movementSpeed = 0.005;
    controls.domElement = renderer.domElement;
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = true;
    controls.dragToLook = false;
    controls.update();
});

document.addEventListener("keydown", onDocumentKeyDown, false);


/** Projectile initialization and initial placement bullet.velocity = new THREE.Vector(

 - Math.sin(camera.rotation.x),

 0

 Math.sin(camera.rotation.y)

 )


 w pętli update: bullet.position.add(bullet.velocity)
 */
const sendProjectile = function() {
    let projectileGeometry = new THREE.SphereGeometry(0.1, 6, 6);
    let projectileMaterial = new THREE.MeshLambertMaterial({color: 0xFDA50F});
    let projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);

    scene.add(projectile);

    let shipPos = ship.getWorldPosition(new THREE.Vector3());

    projectile.position.set(shipPos.x, shipPos.y, shipPos.z);
    projectile.velocity = new THREE.Vector3(
        -Math.sin(camera.rotation.y) * Math.cos(camera.rotation.x),
        Math.sin(camera.rotation.x),
        -Math.cos(camera.rotation.y)
    );
    DevUtils.logVector(projectile.velocity, '');
    DevUtils.logVector(camera.rotation, 'CAMERA: ');
    projectiles.push(projectile);

    var origin = new THREE.Vector3( 0, 0, 0 );
    var length = 1;
    var hex = 0xffff00;

    var arrowHelper = new THREE.ArrowHelper( projectile.velocity, origin, length, hex );
    ship.add( arrowHelper );


};

function onDocumentKeyDown(event) {
    let keyCode = event.which;
    if (keyCode === 32) { //spacebar
        sendProjectile();
    }
};


const accelerateProjectiles = function() {
    for (let p of projectiles)
    {
        p.position.add(p.velocity);
    }
};

/************************** Actual game loop *************************/

let clock = new THREE.Clock();
camera.add(ship);
scene.add(camera);

ship.rotation.x = Math.PI * (-0.3);

function animate() {

    let delta = clock.getDelta();
    controls.movementSpeed = 3 * delta;
    controls.rollSpeed = 0.2 * delta;

    controls.update(delta);

    // if (ship.intersectsObject(cube)) {
    //     console.log('ship intersecting cube');
    // }

    accelerateProjectiles();
    ship.position.set(0,-1.2,-5);

    // update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();


