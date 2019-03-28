/************************** SET THE SCENE *************************/


var width = window.innerWidth;
var height = window.innerHeight;
var viewAngle = 45;
var nearClipping = 1;
var farClipping = 9999;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( viewAngle, width / height, nearClipping, farClipping );
var renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize( width, height );
document.body.appendChild( renderer.domElement );

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
})




/************************** INITIALIZE OBJECTS *************************/

var cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
var coneGeometry = new THREE.ConeGeometry( 0.5, 1, 4 );
var coneMaterial = new THREE.MeshLambertMaterial( {color: 0x00ff00} );
var cone = new THREE.Mesh( coneGeometry, coneMaterial );
var sphereGeometry = new THREE.SphereGeometry( 0.5, 8, 8 );
var sphereMaterial = new THREE.MeshLambertMaterial( { color: 0x0000ff } );
var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );

var spaceTex = new THREE.TextureLoader().load('../resources/space.png');
var spacesphereGeo = new THREE.SphereGeometry(10,10,10);
var spacesphereMat = new THREE.MeshPhongMaterial();
spacesphereMat.map = spaceTex;

var spacesphere = new THREE.Mesh(spacesphereGeo,spacesphereMat);

//spacesphere needs to be double sided as the camera is within the spacesphere
spacesphere.material.side = THREE.BackSide;

spacesphere.material.map.wrapS = THREE.RepeatWrapping;
spacesphere.material.map.wrapT = THREE.RepeatWrapping;
spacesphere.material.map.repeat.set( 5, 3);

spacesphere.positionX = 0;
spacesphere.positionY = 10;
spacesphere.positionZ = 0;

scene.add(spacesphere);

cube.position.x = -2;
cube.position.z = -5;
cone.position.z = -5;
sphere.position.z = -5;
sphere.position.x = 2;
cube.position.z = -5;
scene.add(cube);
scene.add(cone);
scene.add(sphere);

/************************** LIGHT *************************/

var light = new THREE.PointLight(0xFFFFFF);
light.position.x = 0;
light.position.y = 10;
light.position.z = 0;
scene.add(light);

var lightAngle = 0;
function animateLight() {
    lightAngle += 5;
    if (lightAngle > 360) { lightAngle = 0;};
    light.position.x = 5 * Math.cos(lightAngle * Math.PI / 180) + 0.01;
    light.position.z = 5 * Math.sin(lightAngle * Math.PI / 180);
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
animateLight();


/************************** TEXTURES *************************/

var textureLoader = new THREE.TextureLoader();
textureLoader.load("../resources/grass_texture.png", texture => {
    coneGeometry = new THREE.ConeGeometry( 0.5, 1, 4 );
    coneMaterial = new THREE.MeshLambertMaterial( { map: texture } );
    cone = new THREE.Mesh( coneGeometry, coneMaterial);
    cone.position.z = -5;
    scene.add(cone);
    }
);



/************************** CREATE A LOOP *************************/

function animate() {
    cube.rotation.x += 0.01;

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
animate();