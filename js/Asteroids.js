/*********************** SET THE SCENE (GAME SETTINGS) **************/
const THREE = require('three');
const DevUtils = require('./DevUtils');
require('three-fly-controls')(THREE);

/** */
const width = window.innerWidth;
const height = window.innerHeight;
const viewAngle = 45;
const nearClipping = 0.1;
const farClipping = 9999;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(viewAngle, width / height, nearClipping, farClipping)
const devMode = true;
const renderer = new THREE.WebGLRenderer({antialias: true});

let hp = '♥ ♥ ♥ ♥ ♥';

renderer.setClearColor(0x000308);
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);



window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
/********************** LESS BORING GAME SETTINGS ******************/
const SHOOT_INTERVAL = 250;                   // in ms
const PROJECTILE_TTL = 2000;                  // Time to live in ms
const METEORITE_SPEED = 0.2;                  // delta of z of meteorite position
const METEORITE_SPAWN_INTERVAL = 1000;         // in ms
const METEORITE_TTL = 1000;                   //

/************************** INITIALIZE OBJECTS *************************/

let projectiles = [];
let meteorites = [];

let shipGeometry = new THREE.ConeGeometry(0.5, 1, 4);
let shipMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00});
let ship = new THREE.Mesh(shipGeometry, shipMaterial);
ship.geometry.computeBoundingBox();
let shipBBox = new THREE.Box3().setFromObject(ship);
// ship.add(shipBBox);
/************************* TO REMOVE ******************** */
let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
let cubeMaterial = new  THREE.MeshLambertMaterial({color: 0xff0000});
let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.geometry.computeBoundingBox();

/****** this ends <TO REMOVE> ****/
ship.canShoot = true;
let canAddMeteorite = true;

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

let light = new THREE.HemisphereLight(0xcccccc,0x333333, 0.8);
light.position.x = 0;
light.position.y = 10;
light.position.z = 0;
scene.add(light);

scene.fog = new THREE.FogExp2( 0x000000, 0.06 );


/************************* MOUSE CONTROLS **************************/
const controls = new THREE.FlyControls(camera);

document.addEventListener('onfocus', (event) => {
    controls.movementSpeed = 0.005;
    controls.domElement = renderer.domElement;
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = true;
    controls.dragToLook = false;
    controls.update();
});

document.addEventListener("keydown", onDocumentKeyDown, false);

const sendProjectile = function() {
    if (ship.canShoot) {
        let projectileGeometry = new THREE.SphereGeometry(0.1, 6, 6);
        let projectileMaterial = new THREE.MeshLambertMaterial({color: 0xFDA50F, fog: false});
        let projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);

        // projectile.geometry.computeBoundingBox();
        // projectile.bBox = (new THREE.Box3()).setFromObject(projectile);
        // projectile.add(projectile.bBox);

        let shipPos = ship.getWorldPosition(new THREE.Vector3());

        projectile.position.set(shipPos.x, shipPos.y, shipPos.z);
        projectile.quaternion.copy(camera.quaternion);
        scene.add(projectile);
        //
        // let cubeBox = new THREE.BoxHelper(cube, 0xfafa00);
        // cube.add(cubeBox);

        projectile.alive = true;
        setTimeout(() => {
            projectile.alive = false;
            scene.remove(projectile);
            projectiles.unshift(projectile);
        }, PROJECTILE_TTL);

        ship.canShoot = false;
        setTimeout(() => {
            ship.canShoot = true;
        }, SHOOT_INTERVAL);

        projectiles.push(projectile);
    }
};
//
function onDocumentKeyDown(event) {
    event.preventDefault();
    let keyCode = event.which;
    if (keyCode === 32) { //spacebar
        sendProjectile();
    }
}


const accelerateProjectiles = function(delta) {
    for (let p of projectiles) {
        p.translateZ(-25 * delta);

    }
};



const addRandomMeteorite = function() {
    if (canAddMeteorite) {
        new THREE.TextureLoader().load("../resources/steelBricksBMP.bmp", texture => {
                let meteoriteGeometry = new THREE.SphereGeometry(THREE.Math.randFloat(0.5, 2), THREE.Math.randFloat(0.5, 2), THREE.Math.randFloat(0.5, 2));
                let meteoriteMaterial = new THREE.MeshLambertMaterial({map: texture});
                let meteorite = new THREE.Mesh(meteoriteGeometry, meteoriteMaterial);
                meteorite.position.set(THREE.Math.randFloat(-16, 16), THREE.Math.randFloat(-4, 3), -170);
                meteorite.acceleration = THREE.Math.randFloat(-0.06, 0.09);

                canAddMeteorite = false;
                setTimeout(() => {
                    canAddMeteorite = true;
                }, METEORITE_SPAWN_INTERVAL);

                meteorites.push(meteorite);
                scene.add(meteorite);

                setTimeout(() => {
                    canAddMeteorite = true;
                }, METEORITE_TTL);
            }
        );

    }
};

const accelerateMeteorites = function() {
    for (let p of projectiles)
        if (DevUtils.intersects(cube, p, 1, 1))
            scene.remove(cube);

    for (let p of projectiles)
        if (DevUtils.intersects(sphere, p, 1, 1))
            scene.remove(sphere);


    for (let m of meteorites) {
        m.position.z += METEORITE_SPEED + m.acceleration;
        for (let p of projectiles)
            if (DevUtils.intersects(m, p, 1, 0.2)) {
                scene.remove(m);
                scene.remove(p);
            }

        if (DevUtils.intersects(m, ship, 1, 1))
            console.log('WE\'VE BEEN HIT!');
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

    addRandomMeteorite();
    accelerateProjectiles(delta);
    accelerateMeteorites();

    if (DevUtils.intersects(ship, cube, 1, 1)) {
        console.log('ship intersecting cube');
    }

    ship.position.set(0,-1.2,-5);

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}



animate();


