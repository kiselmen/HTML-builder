const dir = require('path');
const fs = require('fs');

const stream = fs.createReadStream(dir.join(__dirname, 'text.txt'));

let result = '';
stream.on('data', chunk => result += chunk);
stream.on('end', () => console.log(result));
stream.on('error', err => console.log('Error: ', err.message));