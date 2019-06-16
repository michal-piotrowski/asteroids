"use strict";

const THREE = require('three');

let TYPE = {
    SPHERE: 'Sphere',
    CUBE: 'Cube',
    CONE: 'Cone'
}

class Meteorite {

    constructor(x, y, z, width, height, depth, geometryType, materialParams) {
        this.width = width == null ? 2 : width;
        this.height = height == null ? 4 : height;
        this.depth = depth == null ? 2 : depth;

        this.geometry = geometryType == null ?
            new THREE.BoxGeometry(2, 4, 2) :
            (function(type, dimensions) {
                switch (type) {
                    case TYPE.SPHERE: return new THREE.SphereGeometry(dimensions[0]/2);
                    case TYPE.CONE: return new THREE.ConeGeometry(dimensions[0]/2, dimensions[1]);
                    case TYPE.CUBE: return new THREE.BoxGeometry(dimensions[0], dimensions[1], dimensions[2]);
                }
            })(geometryType, [this.width, this.height, this.depth]);

        this.material = materialParams == null ?
            new THREE.MeshLambertMaterial({color: 0x0000FF}) :
            new THREE.MeshLambertMaterial(materialParams);

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.x = x == null ? Math.random() * 50 - 25 : x;
        this.mesh.position.y = y == null ? Math.random() * 50 - 25 : y;
        this.mesh.position.z = z == null ? 0 : z;
    }

}

module.exports = {Meteorite, TYPE};