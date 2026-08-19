const fs = require('fs');
const path = require('path');

const perfumesPath = path.join('src', 'data', 'perfumes.js');
let content = fs.readFileSync(perfumesPath, 'utf8');

const imagesDir = path.join('src', 'assets', 'images');
const images = fs.readdirSync(imagesDir);

// Remove all existing imports that start with img
content = content.replace(/import img\d+ from '\.\.\/assets\/images\/.*?';\n/g, '');

const nameToImage = {};
images.forEach(img => {
  const name = img.split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  nameToImage[name] = img;
});

let newImports = '';
let imgIndex = 0;

// find each object with marca: "Lattafa"
const regex = /nombre:\s*"([^"]+)",[\s\S]*?marca:\s*"Lattafa",[\s\S]*?imagen:\s*([^,]+),[\s\S]*?imagenes:\s*(\[[^\]]*\])/g;

let updatedContent = content.replace(regex, (match, nombre, imagen, imagenes) => {
  let searchName = nombre.toLowerCase().replace(/[^a-z0-9]/g, '');
  let matchedImage = nameToImage[searchName];
  
  if (!matchedImage) {
    searchName = searchName.replace(/setx\dpc.*$/, '');
    matchedImage = nameToImage[searchName];
  }
  
  // Try mapping some specific ones if needed, but let's see what matches first
  if (matchedImage) {
    const importName = 'img_lattafa_' + imgIndex;
    newImports += `import ${importName} from '../assets/images/${matchedImage}';\n`;
    
    // Replace in the match
    let newMatch = match.replace(/imagen:\s*[^,]+/, `imagen: ${importName}`);
    newMatch = newMatch.replace(/imagenes:\s*\[[^\]]*\]/, `imagenes: [${importName}]`);
    
    imgIndex++;
    return newMatch;
  }
  
  return match;
});

// Put new imports at the top
updatedContent = newImports + '\n' + updatedContent;

fs.writeFileSync(perfumesPath, updatedContent, 'utf8');
console.log('Updated ' + imgIndex + ' images for Lattafa');
