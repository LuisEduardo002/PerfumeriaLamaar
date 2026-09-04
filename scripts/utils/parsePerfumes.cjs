const fs=require('fs'), path=require('path');
const { slugify } = require('./slug.cjs');

function parsePerfumes(source){
  // Shared regex - handles id, nombre, marca, precio, categoria, genero, ml, stock, descripcion, imagen, notas
  const perfumes=[];
  const productRegex=/\{\s*id:\s*(\d+),\s*nombre:\s*"([^"]+)",\s*marca:\s*"([^"]+)",\s*precio:\s*(\d+),\s*categoria:\s*"([^"]+)",\s*genero:\s*"([^"]+)",\s*ml:\s*(\d+),\s*stock:\s*(\d+),\s*descripcion:\s*"([^"]+)"[\s\S]*?imagen:\s*(\w+)(?:,[\s\S]*?imagenes:\s*\[([^\]]*)\])?/g;
  // Build import map for image resolution (optional, not critical for pricing)
  const importMap={};
  const importRegex=/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g;
  let im;
  while((im=importRegex.exec(source))!==null){
    importMap[im[1]]=im[2];
  }
  let m;
  while((m=productRegex.exec(source))!==null){
    const [, id, nombre, marca, precio, categoria, genero, ml, stock, descripcion, imagenVar] = m;
    const blockStart=m.index;
    const blockEnd=source.indexOf('},', blockStart)+2;
    const block=source.slice(blockStart, blockEnd+800);
    const notasMatch=block.match(/notas:\s*\{\s*salida:\s*\[([^\]]*)\],\s*corazon:\s*\[([^\]]*)\],\s*fondo:\s*\[([^\]]*)\]/);
    let notas={ salida:[], corazon:[], fondo:[] };
    if(notasMatch){
      const parseList=s=>[...s.matchAll(/"([^"]+)"/g)].map(x=>x[1]);
      notas={ salida:parseList(notasMatch[1]), corazon:parseList(notasMatch[2]), fondo:parseList(notasMatch[3]) };
    }
    perfumes.push({
      id:Number(id), nombre, marca, precio:Number(precio), categoria, genero, ml:Number(ml), stock:Number(stock), descripcion,
      notas, slug:slugify(nombre), imagenVar, importPath:importMap[imagenVar]||null,
      sku:`LAMMAR-${id}`,
    });
  }
  return perfumes;
}

function loadPerfumes(){
  const source=fs.readFileSync(path.join(__dirname,'..','..','src/data/perfumes.js'),'utf8');
  return parsePerfumes(source);
}

module.exports={ parsePerfumes, loadPerfumes, slugify };
