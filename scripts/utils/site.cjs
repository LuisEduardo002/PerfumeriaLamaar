const fs=require('fs'), path=require('path');
function readEnvValue(key){
  try{ const env=fs.readFileSync(path.join(__dirname,'..','..','.env'),'utf8'); const m=env.match(new RegExp(`^${key}=(.*)$`,'m')); return m?m[1].trim():null;}catch{return null;}
}
const SITE_URL=(process.env.VITE_SITE_URL||readEnvValue('VITE_SITE_URL')||'https://lamaarperfum.store').replace(/\/+$/,'');
const NAP={
  name:'LAMMAR', alternateName:'LAMAAR PERFUM', url:SITE_URL,
  email:'amazingstoresoporte@gmail.com', telephone:'+57 304 6420608', telephoneDigits:'573046420608', whatsapp:'573046420608',
  address:{ streetAddress:'Centro Comercial Los Fundadores, Local 101', addressLocality:'Manizales', addressRegion:'Caldas', postalCode:'170001', addressCountry:'CO', full:'Centro Comercial Los Fundadores, Local 101, Manizales, Caldas 170001, Colombia' },
  geo:{ latitude:5.0703, longitude:-75.5138 },
};
const SOCIAL={
  whatsapp:'https://wa.me/573046420608',
  instagram:'https://www.instagram.com/lamaar_perfumm/',
  facebook:'https://www.facebook.com/profile.php?id=61557995259913',
  tiktok:'https://www.tiktok.com/@lamaar.perfume',
};
module.exports={ SITE_URL, NAP, SOCIAL, CURRENCY:'COP', PRICE_TTL_DAYS:30 };
