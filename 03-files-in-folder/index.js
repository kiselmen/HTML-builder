const dir = require('path');
const fs = require('fs/promises');
const { stdout } = require('process');

(async () => {
    const files = await fs.readdir(dir.join(__dirname, 'secret-folder'), { withFileTypes: true });
    for (const file of files){
        if (file.isFile()) {
            const name = file.name.split('.')[0];
            const path = dir.join(__dirname, 'secret-folder', file.name);
            const ext = dir.extname(path).substring(1);
            const info = await fs.stat(path);
            stdout.write(name + ' - ' + ext + ' - ' + info.size +'b\n');
        }
    }
})()
