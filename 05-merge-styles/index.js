const fsPromises = require('fs/promises');
const dir = require('path');


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

const filePath      = dir.join(__dirname, 'project-dist', 'bundle.css');
const folderPath    = dir.join(__dirname, 'styles');
bundleCSS(filePath, folderPath);
