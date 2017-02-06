const fs = require('fs');
const path = require('path');
const modelsDirectory = path.join(__dirname, 'models/');

var files = fs.readdirSync(modelsDirectory);
for (var i = 0; i < files.length; i++) {
    if (files[i].endsWith(".js")) {
        require(path.join(modelsDirectory, files[i]));
    }

}
module.exports = {};