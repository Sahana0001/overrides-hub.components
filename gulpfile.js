var bump = require('./node_modules/hub.common.tooling/gulp/bump.js');

bump({
    src: ['./bower.json', './package.json'],
    configPath: '../../../bower.json'
});