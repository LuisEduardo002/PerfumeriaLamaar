const fs = require('fs');
const perfumesPath = 'src/data/perfumes.js';
let content = fs.readFileSync(perfumesPath, 'utf8');

// Clean up old img0-img9 imports
content = content.replace(/import img\d from '.*?';\n/g, '');

// We need to add 2 new imports
const honorImport = `import img_lattafa_honor from '../assets/images/BadeeAlOudHonorAndGlory.webp';\n`;
const anghamImport = `import img_lattafa_angham from '../assets/images/angham lattafa.jpg';\n`;

content = honorImport + anghamImport + content;

// Replace BADEE AL OUD HONOR & GLORY
content = content.replace(/(nombre:\s*"BADEE AL OUD HONOR & GLORY",[\s\S]*?marca:\s*"Lattafa",[\s\S]*?imagen:\s*)[^,]+,([\s\S]*?imagenes:\s*)\[[^\]]*\]/, '$1img_lattafa_honor,$2[img_lattafa_honor]');

// Replace ANGHAM (Not ANGHAM SECOND SONG, which is already matched or will not match if we match exactly)
content = content.replace(/(nombre:\s*"ANGHAM",[\s\S]*?marca:\s*"Lattafa",[\s\S]*?imagen:\s*)[^,]+,([\s\S]*?imagenes:\s*)\[[^\]]*\]/, '$1img_lattafa_angham,$2[img_lattafa_angham]');

fs.writeFileSync(perfumesPath, content, 'utf8');
console.log('Fixed missing and cleaned old imports.');
