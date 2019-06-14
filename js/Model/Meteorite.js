"use strict";

// import * as THREE from "../three.js-master/build/three.js";

let TYPE = {
    SPHERE: 'Sphere',
    CUBE: 'Cube',
    CONE: 'Cone'
}

var three = require('three');

export class Meteorite {


    constructor(x, y, z, width, height, depth, geometryType, materialParams) {

        this.width = width == null ? 2 : width;
        this.height = height == null ? 4 : height;
        this.depth = depth == null ? 2 : depth;

        this.geometry = geometryType == null ?
            THREE.BoxGeometry(2, 4, 2) :
            (function(type, dimensions) {
                switch (type) {
                    case TYPE.SPHERE: return new THREE.SphereGeometry()
                }
                // type == TYPE.SPHERE : return new THREE
            })(geometryType, [this.width, this.height, this.depth]);
        this.material = materialParams == null ? THREE.MeshLambertMaterial({color: 0x0000FF}) : THREE.MeshLambertMaterial(materialParams);

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.positionX = x == null ? Math.random() * 50 - 25 : x;
        this.mesh.positionY = y == null ? Math.random() * 50 - 25 : y;
        this.mesh.positionZ = z == null ? 0 : z;

    }

    set geometry(geom) {this.geometry = geom};

}