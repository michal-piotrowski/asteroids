const path = require('path');

module.exports = {
    mode: 'development',
    entry: './js/Asteroids.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'asteroids.bundle.js'
    },
};


