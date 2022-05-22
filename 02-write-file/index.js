const dir = require('path');
const fs = require('fs');
const process = require('process');
const { stdin, stdout } = require('process');
const fileStream = fs.createWriteStream(dir.join(__dirname, 'input.txt'));

function writeToFile(data) {
    try {
        fileStream.write(data);
    } catch (error) {
        stdout.write('Не могу записать в файл данные, ошибка: ' + error);
        process.exit();
    }
}

stdout.write('Жду текст!\n');

stdin.on('data', data =>{
    if (data.toString().trim().toLowerCase() === 'exit') {
        process.exit();
    } else {
        writeToFile(data);
    }
})


process.on('exit', () => {
    stdout.write('Good job!\n');
})
process.on('SIGINT', () => {
    process.exit()
});