const fs = require('fs');
const content = fs.readFileSync('src/data/perfumes.js', 'utf8');
const regex = /nombre:\s*"([^"]+)",[\s\S]*?marca:\s*"Lattafa",[\s\S]*?imagen:\s*([^,]+)/g;
let match;
let missing = [];
while ((match = regex.exec(content)) !== null) {
  if (!match[2].includes('img_lattafa_')) {
    missing.push(match[1]);
  }
}
console.log('Missing: ' + missing.length);
console.log(missing.join('\n'));
