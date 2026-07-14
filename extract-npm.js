const os = require('os');
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

// Minimal tar extraction for npm tgz
const tgz = path.join(os.tmpdir(), 'npm-10.9.2.tgz');
const out = 'C:\\npm-portable';

if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });

const gunzip = zlib.createGunzip();
const inp = fs.createReadStream(tgz);
let buf = Buffer.alloc(0);

inp.pipe(gunzip).on('data', (chunk) => {
    buf = Buffer.concat([buf, chunk]);
}).on('end', () => {
    // Parse tar
    let offset = 0;
    while (offset < buf.length - 512) {
        const header = buf.slice(offset, offset + 512);
        const name = header.slice(0, 100).toString('utf8').replace(/\0/g, '');
        if (!name) break;
        const sizeStr = header.slice(124, 136).toString('utf8').replace(/\0/g, '').trim();
        const size = parseInt(sizeStr, 8) || 0;
        offset += 512;

        // Strip leading 'package/'
        const rel = name.replace(/^package\//, '');
        if (rel && !name.endsWith('/')) {
            const dest = path.join(out, rel);
            const dir = path.dirname(dest);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(dest, buf.slice(offset, offset + size));
        }
        offset += Math.ceil(size / 512) * 512;
    }
    console.log('npm extracted to C:\\npm-portable');
}).on('error', e => console.error('Error:', e.message));
