const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const zlib = require('zlib');

const NPM_VERSION = '10.9.2';
const url = `https://registry.npmjs.org/npm/-/npm-${NPM_VERSION}.tgz`;
const dest = path.join(os.tmpdir(), `npm-${NPM_VERSION}.tgz`);
const npmDir = 'C:\\npm-portable';

console.log(`Downloading npm ${NPM_VERSION}...`);

const file = fs.createWriteStream(dest);
https.get(url, (res) => {
    if (res.statusCode === 302 || res.statusCode === 301) {
        https.get(res.headers.location, (res2) => { res2.pipe(file); });
    } else {
        res.pipe(file);
    }
    file.on('finish', () => {
        file.close();
        console.log('Downloaded. Done.');
    });
}).on('error', (e) => {
    console.error('Error:', e.message);
});
