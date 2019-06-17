"use strict";

const THREE = require('three');

const logVector = function(vector, label) {

    console.log(label + 'x: ' + (vector.x !== undefined ? vector.x.toFixed(4) : 'unde') +
                ' y: ' + (vector.y !== undefined ? vector.y.toFixed(4) : 'unde') +
                ' z: ' +( vector.z !== undefined ? vector.z.toFixed(4) : 'unde'));

}

const intersects = function(o1, o2, radius1, radius2) {
        let object1 = o1.getWorldPosition(new THREE.Vector3());
        let object2 = o2.getWorldPosition(new THREE.Vector3());
        return (Math.sqrt(Math.pow(object1.x - object2.x, 2) +
                    Math.pow(object1.y - object2.y, 2) +
                    Math.pow(object1.z - object2.z, 2)) < (radius1 + radius2));
    }



module.exports = {logVector, intersects};