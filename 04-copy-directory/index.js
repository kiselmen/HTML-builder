const fs = require('fs');
const fsPromises = require('fs/promises');
const dir = require('path');

const pathFrom = dir.join(__dirname, 'files');
const pathTo = dir.join(__dirname, 'files-copy');

async function deleteFolder(folder) {
    try {
        await fs.promises.rm(folder, {recursive : true, focre : true});
        // console.log('Delete folder ' + folder);
    } catch (err) {
        if (!(err.errno === -4058||err.errno === -4051)) throw err
    }
}
async function createFolder(folder) {
    try {
        await fs.promises.mkdir(folder, { recursive: true });
        // console.log('Create folder ' + folder);
    } catch (err) {
        throw err;
    }
}
async function copyFiles(from, to) {
    const files = await fsPromises.readdir(from, { withFileTypes: true });
    for (let file of files) {
        if (file.isDirectory()){
            await createFolder(dir.join(to, file.name));
            await copyFiles(dir.join(from, file.name), dir.join(to, file.name));
        } else if (file.isFile()) {
            const streamFrom = fs.createReadStream(dir.join(from, file.name));

            let fileData = '';
            streamFrom.on('data', chunk => fileData += chunk);
            streamFrom.on('end', () => {
                // console.log('Read from file ' + dir.join(from, file.name));
                fs.writeFile(dir.join(to, file.name), fileData, (err) => {
                    if (err) {
                        console.log('Can not write file: ', err)
                    }
                });
                // console.log('Write to file ' + dir.join(to, file.name));
            });
            streamFrom.on('error', err => console.log('Can not read file: ', err));            
        }
    }
}

(async () => {
    await deleteFolder(pathTo);
    await createFolder(pathTo);
    await copyFiles(pathFrom, pathTo);
})()
