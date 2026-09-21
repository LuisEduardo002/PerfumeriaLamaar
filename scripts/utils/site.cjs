const fs=require('fs'), path=require('path');
function readEnvValue(key){
  try{ const env=fs.readFileSync(path.join(__dirname,'..','..','.env'),'utf8'); const m=env.match(new RegExp(`^${key}=(.*)$`,'m')); return m?m[1].trim():null;}catch{return null;}
}
const SITE_URL=(process.env.VITE_SITE_URL||readEnvValue('VITE_SITE_URL')||'https://lamaarperfum.store').replace(/\/+$/,'');
const SITE_NAME='LAMAAR';
const SITE_ALTERNATE_NAME='LAMMAR';
const SITE_FULL_NAME='LAMAAR Perfumería';
const NAP={
  name:SITE_NAME, alternateName:SITE_ALTERNATE_NAME, fullName:SITE_FULL_NAME, url:SITE_URL,
  email:'amazingstoresoporte@gmail.com', telephone:'+57 304 6420608', telephoneDigits:'573046420608', whatsapp:'573046420608',
  address:{ streetAddress:'KPalogrande, Av. Lindsay, Frente coliseo menor, Cl. 65 #24-89 Local Piso -1', addressLocality:'Manizales', addressRegion:'Caldas', postalCode:'170001', addressCountry:'CO', full:'KPalogrande, Av. Lindsay, Frente coliseo menor, Cl. 65 #24-89 Local Piso -1, Manizales, Caldas 170001, Colombia' },
  geo:{ latitude:5.0549, longitude:-75.4850 },
  hours:{ days:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens:'09:00', closes:'18:00' },
};
const SOCIAL={
  whatsapp:'https://wa.me/573046420608',
  instagram:'https://www.instagram.com/lamaar_perfumm/',
  facebook:'https://www.facebook.com/profile.php?id=61557995259913',
  tiktok:'https://www.tiktok.com/@lamaar.perfume',
};
// IndexNow: la key es pública por diseño (va en /<key>.txt). Se lee de env o default.
// PH_SERVICE: fuente única para pasos de medición pH (usado en Home, markdown, JSON-LD).
const INDEXNOW_KEY=process.env.INDEXNOW_KEY||'6db2ccb300575995b1ab6ee52d751c3c';
const PH_SERVICE={
  name:'Medición de pH para elección de perfume en Manizales',
  steps:['Limpieza de la piel','Aplicación de tira reactiva','Lectura en 30-60 segundos','Recomendación entre 240+ originales'],
  cost:'Incluida sin costo con tu visita',
  schedule:'Lunes a sábado 9:00-18:00, presencial, sin cita',
};
module.exports={ SITE_URL, SITE_NAME, SITE_ALTERNATE_NAME, SITE_FULL_NAME, NAP, SOCIAL, INDEXNOW_KEY, PH_SERVICE, CURRENCY:'COP', PRICE_TTL_DAYS:30 };
