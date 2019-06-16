"use strict";

const THREE = require('three');

const logVector = function(vector, label) {

    console.log(label + 'x: ' + (vector.x !== undefined ? vector.x.toFixed(4) : 'unde') +
                ' y: ' + (vector.y !== undefined ? vector.y.toFixed(4) : 'unde') +
                ' z: ' +( vector.z !== undefined ? vector.z.toFixed(4) : 'unde'));

}

module.exports = {logVector};