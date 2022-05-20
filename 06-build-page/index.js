const fs = require('fs');
const fsPromises = require('fs/promises');
const dir = require('path');

async function deleteFolder(folder) {
    try {
        await fs.promises.rm(folder, {recursive : true, focre : true});
        console.log('Delete folder ' + folder);
    } catch (err) {
        if (!(err.errno === -4058||err.errno === -4051)) throw err
    }
}
async function createFolder(folder) {
    try {
        await fs.promises.mkdir(folder, { recursive: true });
        console.log('Create folder ' + folder);
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

async function bundleCSS(filePath, folderPath){
    let styles = '';
    try{
        const files = await fsPromises.readdir(folderPath, { withFileTypes: true });
        for (const file of files) {
            if (dir.extname(dir.join(folderPath, file.name)) === '.css'){
                const fileContent = await fsPromises.readFile(dir.join(folderPath, file.name), 'utf8');
                styles += fileContent;
            }
        }
        await fsPromises.writeFile(filePath, styles);
    } catch (err) {
        console.log('Can not do css bundle, error: ', err);
    }
}

async function bundleHTML(fileFrom, fileTo, folderPath){
    const components = [];
    try{
        const files = await fsPromises.readdir(folderPath, { withFileTypes: true });
        for (const file of files) {
            if (dir.extname(dir.join(folderPath, file.name)) === '.html'){
                const fileContent = await fsPromises.readFile(dir.join(folderPath, file.name), 'utf8');
                const name = file.name.split('.')[0];
                components.push({name: name, data :fileContent});
            }
        }

        let htmlContent = await fsPromises.readFile(dir.join(fileFrom), 'utf8');

        components.forEach(component => {
            let foundPos = htmlContent.indexOf('{{' + component.name + '}}');

            if (foundPos > 0) {
                let htmlContentBefore = htmlContent.slice(0, foundPos);
                let htmlContentAfter  = htmlContent.slice(foundPos + component.name.length + 4);
                htmlContent = htmlContentBefore + component.data + htmlContentAfter;
            }
        });

        await fsPromises.writeFile(fileTo, htmlContent);
    } catch (err) {
        console.log('Can not do html bundle, error: ', err);
    }
}

const pathTo = dir.join(__dirname, 'project-dist');

(async () => {
    await deleteFolder(pathTo);
    await createFolder(pathTo);
    await createFolder(dir.join(pathTo, 'assets'))
    copyFiles(dir.join(__dirname, 'assets'), dir.join(pathTo, 'assets'));
    bundleCSS(dir.join(pathTo, 'bundle.css'), dir.join(__dirname, 'styles'));
    bundleHTML(dir.join(__dirname, 'template.html'), dir.join(pathTo, 'index.html'), dir.join(__dirname, 'components'));
})()
