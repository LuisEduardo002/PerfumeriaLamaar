/**
 * generate-markdown.cjs
 * Generates Markdown representations for all routes into dist/__markdown/
 * Used by the Edge Middleware for Accept: text/markdown negotiation.
 */
const fs = require('fs');
const path = require('path');
const { SITE_URL } = require('./utils/site.cjs');
const { slugify } = require('./utils/slug.cjs');
const { loadPerfumes } = require('./utils/parsePerfumes.cjs');
const { formatPriceCOP } = require('./utils/formatPrice.cjs');

const perfumes = loadPerfumes();
console.log(`Parsed ${perfumes.length} products for markdown generation`);

const outBase = path.join(__dirname, '..', 'dist', '__markdown');
const outProductoBase = path.join(outBase, 'producto');

// Ensure dirs
fs.mkdirSync(outBase, { recursive: true });
fs.mkdirSync(outProductoBase, { recursive: true });

function formatPrice(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}

// --- Home --- SEO: perfumería Manizales originales elegante calidad
const homeMd = `# Perfumería en Manizales — Perfumes Originales, Elegantes y de Calidad | LAMMAR

> Perfumería elegante en Manizales, Colombia. Perfumes 100% originales y de calidad — diseñador, árabes y nicho. Elegancia y originalidad garantizada en Manizales.

## Perfumes Originales de Calidad en Manizales

En LAMMAR Manizales encuentras perfumes 100% originales, elegantes y de calidad de casas como Lattafa, Rasasi, Al Haramain, Armaf, Maison Alhambra, Xerjoff y Valentino. Cada fragancia elegante en Manizales cuenta con garantía de autenticidad y calidad.

**Colección Exclusiva 2026 — Perfumes Originales en Manizales**

[Explorar Catálogo de Perfumes Originales en Manizales](${SITE_URL}/catalogo)

## Fragancias Nicho Elegantes — Originales y de Calidad

Aromas únicos, originales y de calidad importados para Manizales. 100% Originales, elegantes — Envío Garantizado a Manizales.

## Fragancias Elegantes para Todos los Estilos en Manizales

- **Perfumes Originales para Caballero — Original y Elegante** — [Explorar fragancias elegantes para caballero en Manizales](${SITE_URL}/catalogo?genero=Masculino)
- **Perfumes Originales para Dama Elegante** — [Explorar fragancias elegantes para dama en Manizales](${SITE_URL}/catalogo?genero=Femenino)

## Perfumes Originales de Calidad Más Buscados en Manizales

Las opciones elegantes y originales más cotizadas en Manizales. Descubre en el [catálogo](${SITE_URL}/catalogo) más de ${perfumes.length} fragancias originales y de calidad disponibles en nuestra perfumería en Manizales.

## ¿Por Qué Elegir Nuestra Perfumería Elegante en Manizales?

- **Perfumes 100% Originales — Calidad Garantizada en Manizales** — Garantía directa de autenticidad, elegancia y calidad en cada fragancia original.
- **Envíos de Perfumes Originales en Manizales y Colombia** — Despachos rápidos y de calidad a Manizales y toda Colombia con seguimiento.
- **Asesoría Elegante y Personalizada en Manizales** — Te ayudamos a elegir tu perfume original elegante y de calidad por WhatsApp al +57 304 6420608 en Manizales.

---

*Contacto: amazingstoresoporte@gmail.com — WhatsApp: +57 304 6420608 — Manizales, Caldas, Colombia — Lun. a sáb. 9:00–18:00*
`;

fs.writeFileSync(path.join(outBase, 'home.md'), homeMd);
fs.writeFileSync(path.join(outBase, 'index.md'), homeMd); // alias for /

// --- Catalog ---
const catalogMd = `# Catálogo de Fragancias — LAMMAR

> Explora nuestra exclusiva selección de perfumes de diseñador, árabes y fragancias nicho.

En LAMMAR encuentras más de ${perfumes.length} fragancias 100% originales. Filtra por marca, categoría y género para encontrar tu esencia ideal.

## Cómo comprar

1. Explora el catálogo y filtra por tus preferencias.
2. Agrega perfumes al carrito.
3. Confirma tu pedido por WhatsApp al +57 304 6420608.

## Marcas disponibles

${[...new Set(perfumes.map((p) => p.marca))].sort().map((m) => `- ${m}`).join('\n')}

## Categorías

${[...new Set(perfumes.map((p) => p.categoria))].sort().map((c) => `- ${c}`).join('\n')}

## Productos destacados

${perfumes
  .filter((p) => p.nombre.includes('YARA') || p.nombre.includes('ASAD') || p.nombre.includes('HAWAS'))
  .slice(0, 10)
  .map((p) => `- [${p.nombre} de ${p.marca}](${SITE_URL}/producto/${p.slug}) — ${formatPriceCOP(p.precio)} — ${p.genero} · ${p.ml} ml`)
  .join('\n')}

[Ver catálogo completo](${SITE_URL}/catalogo) · [Inicio](${SITE_URL}/)
`;

fs.writeFileSync(path.join(outBase, 'catalogo.md'), catalogMd);

// --- Privacy (simplified markdown, full content would be long - use key sections) ---
const privacyMd = `# Política de Privacidad y Tratamiento de Datos Personales — LAMMAR

> Última actualización: 21/08/2026

## TL;DR: lo esencial

- No pedimos registro ni almacenamos datos personales en el sitio: el carrito se guarda solo en tu navegador.
- Los pedidos se gestionan por WhatsApp; los datos que envíes allí se usan únicamente para procesar tu compra y entrega.
- No vendemos ni cedemos tu información; solo la compartimos con la transportadora cuando es necesario para entregar tu pedido.
- Puedes conocer, rectificar o solicitar la eliminación de tus datos escribiendo a amazingstoresoporte@gmail.com o al WhatsApp 304 6420608.

[Explorar perfumes originales](${SITE_URL}/catalogo)

## Resumen: datos tratados y su finalidad

| Información | Origen | Finalidad |
|---|---|---|
| Productos y cantidades del carrito | Almacenamiento local del navegador (localStorage) | Conservar temporalmente tu selección mientras compras |
| Nombre, teléfono, dirección y ciudad | Mensaje voluntario enviado por WhatsApp | Gestionar, confirmar y coordinar la compra y entrega del pedido |
| Datos necesarios para la entrega | Compartidos con la empresa transportadora | Efectuar la entrega en la dirección indicada |

## 1. Responsable

**Nombre comercial:** LAMAAR PERFUM — **País:** Colombia — **Correo:** amazingstoresoporte@gmail.com — **WhatsApp:** 304 6420608

## 2. Información que recopilamos directamente desde nuestro sitio web

Nuestro sitio web funciona como una plataforma de exhibición y selección de productos y no cuenta con un sistema propio de registro de usuarios ni con una base de datos para almacenar información personal.

La página puede utilizar el almacenamiento local del navegador (localStorage) exclusivamente para conservar temporalmente información relacionada con el carrito de compras: productos seleccionados, cantidades e información necesaria para mantener el funcionamiento del carrito.

## 3. Proceso de compra mediante WhatsApp

Cuando el usuario selecciona sus productos y decide realizar el pedido, la página genera un mensaje con el contenido del carrito y lo redirige a WhatsApp. El usuario decide voluntariamente si desea enviar dicho mensaje.

A través de WhatsApp, el usuario puede proporcionar: nombre, número de teléfono, dirección de entrega, ciudad e información relacionada con el pedido.

Las condiciones aplicables a la compra se detallan en nuestros [Términos y Condiciones](${SITE_URL}/terminos).

## 4. Finalidades del tratamiento

Los datos personales podrán ser utilizados para: gestionar y confirmar pedidos, contactar al cliente respecto de su compra, coordinar la entrega, gestionar cambios/devoluciones/garantías, atender PQRS, cumplir obligaciones legales y mantener registros comerciales.

## 5. WhatsApp y tratamiento de la información

WhatsApp es utilizado como canal de comunicación para recibir y gestionar pedidos. El uso de WhatsApp está sujeto a los términos y políticas de Meta y WhatsApp.

## 6. Compartición de información

Los datos podrán ser compartidos únicamente cuando resulte necesario para cumplir con la finalidad correspondiente (ej. datos de entrega a la transportadora). No comercializamos ni vendemos los datos personales.

## 7. Cookies y almacenamiento local

Nuestro sitio puede utilizar localStorage para conservar temporalmente el contenido del carrito. Si incorporamos cookies o píxeles, esta política será actualizada.

## 8. Información de pago

Nuestra página web no solicita ni almacena directamente información completa de tarjetas. Cuando un pago se realice mediante un tercero, la información será tratada directamente por dicho proveedor.

## 9. Seguridad

Adoptamos medidas razonables para proteger la información personal frente a accesos no autorizados. Ningún sistema electrónico puede garantizar seguridad absoluta.

## 10. Derechos de los titulares

De acuerdo con la legislación colombiana: conocer, actualizar y rectificar datos; solicitar información sobre el tratamiento; solicitar prueba de autorización; presentar consultas y reclamos; solicitar supresión; revocar autorización; acceder gratuitamente a datos; presentar quejas ante la SIC.

## 11. Consultas, solicitudes y reclamos

**Correo:** amazingstoresoporte@gmail.com — **WhatsApp:** 304 6420608

## 12. Conservación de la información

Se conservará durante el tiempo necesario para cumplir las finalidades y obligaciones legales, luego se eliminará.

## 13. Datos de menores de edad

Nuestros productos y servicios no están dirigidos específicamente a menores de edad.

## 14. Modificaciones

Podremos actualizar esta Política cuando sea necesario. La versión vigente estará disponible en el sitio.

## 15. Contacto

LAMAAR PERFUM — Correo: amazingstoresoporte@gmail.com — WhatsApp: 304 6420608 — Colombia

---

*Temas relacionados: [Términos y Condiciones](${SITE_URL}/terminos) · [Catálogo](${SITE_URL}/catalogo) · [Inicio](${SITE_URL}/)*
`;

fs.writeFileSync(path.join(outBase, 'privacidad.md'), privacyMd);
fs.writeFileSync(path.join(outBase, 'privacy.md'), privacyMd);

// --- About ---
const aboutMd = `# Sobre LAMMAR — LAMAAR PERFUM

> Perfumería exclusiva en Manizales, Colombia, con más de ${perfumes.length} perfumes 100% originales de diseñador y nicho.

LAMMAR (nombre comercial LAMAAR PERFUM) es una perfumería exclusiva nacida en Manizales, Caldas, para acercar fragancias auténticas a toda Colombia sin intermediarios opacos, con asesoría honesta y envíos confiables. Atendemos lunes a sábado de 9:00 a 18:00 por WhatsApp y correo.

## TL;DR: por qué LAMMAR

- Más de ${perfumes.length} perfumes originales de casas como Lattafa, Rasasi, Al Haramain, Armaf, Maison Alhambra y Xerjoff.
- Garantía de autenticidad en cada fragancia: 100% originales, sin imitaciones.
- Asesoría personalizada por WhatsApp al +57 304 6420608.
- Envíos a toda Colombia con transportadora y seguimiento, desde Manizales.

## 1. Nuestra historia

LAMMAR nació en Manizales, en el corazón del Eje Cafetero, al identificar que muchos amantes de la perfumería querían acceder a fragancias nicho y árabes auténticas sin pagar sobreprecios excesivos ni arriesgarse a imitaciones. Empezamos curando best-sellers como Yara, Asad y Hawas y, gracias a la confianza de nuestros primeros clientes, crecimos hasta superar las ${perfumes.length} referencias disponibles hoy.

Operamos principalmente como perfumería física en Manizales (Centro Comercial Los Fundadores, Local 101) con atención presencial; el sitio web es solo catálogo informativo: eliges en el catálogo, agregas al carrito y confirmas el pedido en tienda o por WhatsApp. No exigimos registro, no almacenamos tarjetas y no vendemos datos. No somos tienda digital pura.

## 2. Qué hacemos — y qué no

Somos curadores de fragancias. Cada ficha incluye marca, precio en COP, tamaño en ml, género, categoría y notas olfativas de salida, corazón y fondo.

- Sí hacemos: asesoría por WhatsApp, envíos nacionales, cambios y garantías según la ley colombiana.
- No hacemos: no vendemos réplicas, no pedimos pago dentro del sitio, no creamos cuentas obligatorias.

## 3. Nuestros valores

- **Autenticidad:** solo perfumes originales con lote verificable.
- **Transparencia:** precios y stock visibles, sin letra pequeña oculta.
- **Cercanía:** respuesta humana por WhatsApp, no bots evasivos.
- **Responsabilidad:** tratamiento de datos mínimo y conforme a la ley colombiana.

Un perfume es identidad: elegirlo merece tiempo, información clara y acompañamiento.

## 4. Dónde estamos y cómo operamos

Base logística en Manizales, Caldas — Centro Comercial Los Fundadores, Local 101, CP 170001. Despachamos a toda Colombia. Horario: lunes a sábado 9:00–18:00 (COT).

**LAMAAR PERFUM — LAMMAR** — Manizales, Caldas, Colombia — amazingstoresoporte@gmail.com — +57 304 6420608

## 5. Compromiso con agentes

Para que IA y agentes puedan recomendarnos, publicamos catálogo completo, políticas de privacidad y términos, datos de contacto validados y estructura JSON-LD de tipo Organization y LocalBusiness. Sitemap y llms.txt actualizados.

[Catálogo](${SITE_URL}/catalogo) · [Contacto](${SITE_URL}/contact) · [Privacidad](${SITE_URL}/privacy)
`;

fs.writeFileSync(path.join(outBase, 'about.md'), aboutMd);
fs.writeFileSync(path.join(outBase, 'nosotros.md'), aboutMd);

// --- Contact ---
const contactMd = `# Contacto — LAMMAR

> Atención al cliente desde Manizales para toda Colombia — WhatsApp +57 304 6420608 — amazingstoresoporte@gmail.com — Lun. a sáb. 9:00–18:00.

¿Dudas sobre un perfume, tu pedido o un cambio? Escríbenos y te respondemos en horario laboral.

## TL;DR: cómo contactarnos rápido

- **WhatsApp preferente:** +57 304 6420608 (respuesta más rápida, Lun. a sáb. 9:00–18:00 COT).
- **Correo:** amazingstoresoporte@gmail.com — responde en máximo 24 horas hábiles.
- **Dirección operativa:** Centro Comercial Los Fundadores, Local 101, Manizales, Caldas 170001, Colombia.
- **Para pedidos:** indica nombre, productos y ciudad para cotizar envío y confirmar disponibilidad.

[WhatsApp directo](https://wa.me/573046420608) · [Correo](mailto:amazingstoresoporte@gmail.com)

## 1. Datos oficiales de contacto

**Nombre comercial:** LAMAAR PERFUM (marca pública: LAMMAR)
**Dirección:** Centro Comercial Los Fundadores, Local 101, Manizales, Caldas 170001, Colombia
**Coordenadas:** 5.0703, -75.5138
**Teléfono / WhatsApp:** +57 304 6420608
**Correo:** amazingstoresoporte@gmail.com
**Horario:** Lunes a sábado 9:00–18:00 (COT)
**Web:** ${SITE_URL}

Estos datos coinciden con los publicados en nuestra ficha Organization/LocalBusiness JSON-LD y en el footer del sitio (NAP consistente).

## 2. Qué atendemos por cada canal

- **WhatsApp:** cotizaciones, confirmación de pedidos, seguimiento de envíos, asesoría de fragancias.
- **Correo:** solicitudes formales, PQRS, derechos de datos personales, garantías y reclamaciones.
- **Instagram / Facebook:** novedades y atención ligera.

Incluye: nombre completo, número de WhatsApp, referencia del perfume (ej. “AL NOBLE AMEER de Lattafa 100 ml”) y ciudad de entrega.

## 3. Tiempos de respuesta y envíos

Respondemos WhatsApp en minutos dentro del horario laboral; correos en máximo 24 horas hábiles. Los envíos se despachan desde Manizales con tracking; los tiempos son estimados según ciudad (1–3 días capitales, 2–5 días resto).

No procesamos pagos dentro del sitio. Los métodos se coordinan al confirmar el pedido por WhatsApp. Consulta [Términos y Condiciones](${SITE_URL}/terminos).

## 4. Privacidad y datos

Al contactarnos por WhatsApp o correo nos compartes voluntariamente datos personales para gestionar tu pedido. Solo los usamos para esa finalidad. Consulta nuestra [Política de Privacidad](${SITE_URL}/privacy).

---
*Temas relacionados: [Sobre nosotros](${SITE_URL}/about) · [Catálogo](${SITE_URL}/catalogo) · [Privacidad](${SITE_URL}/privacy)*
`;

fs.writeFileSync(path.join(outBase, 'contact.md'), contactMd);
fs.writeFileSync(path.join(outBase, 'contacto.md'), contactMd);

// --- Terms ---
const termsMd = `# Términos y Condiciones — LAMMAR

> Última actualización: 21/08/2026

Antes de comprar en LAMMAR es útil saber cómo funciona el pedido por WhatsApp, qué pasa con los precios y promociones, en cuánto llega tu perfume y cómo solicitar un cambio, devolución o garantía. El tratamiento de tu información personal se detalla en nuestra [Política de Privacidad](${SITE_URL}/privacidad).

## TL;DR: lo esencial

- Somos perfumería física en Manizales (Centro Comercial Los Fundadores, Local 101) con catálogo web informativo: seleccionas tus perfumes aquí y el pedido se confirma en tienda física o por WhatsApp.
- No necesitas crear cuenta ni pagar en el sitio; los métodos de pago se coordinan al confirmar el pedido en tienda o por WhatsApp. No somos tienda digital pura.
- Los tiempos de entrega son estimados y varían según ciudad y transportadora.
- Cambios, devoluciones y garantías se rigen por la legislación colombiana: escríbenos a amazingstoresoporte@gmail.com.

[Ver perfumes disponibles](${SITE_URL}/catalogo)

## Condiciones clave de compra

| Aspecto | Detalle |
|---|---|
| Realización del pedido | Selección de productos en el sitio y confirmación por WhatsApp. |
| Confirmación | El pedido queda firme únicamente cuando LAMMAR lo confirma por sus canales oficiales. |
| Pago | Los métodos se informan durante la gestión del pedido; no hay pagos dentro del sitio. |
| Envío | A la dirección confirmada por el cliente; tiempos estimados según ciudad y transportadora. |
| Cambios y devoluciones | Gestionados según la legislación colombiana a través de nuestros canales de contacto. |
| Precios y promociones | Pueden modificarse sin previo aviso; los cambios no afectan pedidos ya confirmados. |

## 1. Información general

Estos Términos y Condiciones regulan el acceso y uso del sitio web de LAMAAR PERFUM, así como las condiciones aplicables a la selección y solicitud de productos realizada a través del sitio. Al utilizar nuestro sitio web, el usuario acepta estos Términos.

**Nombre comercial:** LAMAAR PERFUM — **País:** Colombia — **Correo:** amazingstoresoporte@gmail.com

## 2. Funcionamiento del sitio web

Somos principalmente una perfumería física en Manizales (Centro Comercial Los Fundadores, Local 101) con atención presencial. Nuestro sitio web es únicamente un catálogo informativo para consultar productos y precios; no es una tienda digital con pago online. El usuario puede seleccionar productos, agregarlos al carrito, modificar las cantidades y revisar el contenido de su pedido. El carrito puede utilizar localStorage para conservar temporalmente los productos seleccionados. El sitio no requiere la creación de una cuenta de usuario.

## 3. Realización de pedidos mediante WhatsApp

Al seleccionar la opción para realizar un pedido, el sitio genera un mensaje con la información de los productos incluidos en el carrito y redirige al usuario a WhatsApp. El usuario deberá revisar la información del pedido antes de enviarla. El pedido se considerará confirmado únicamente cuando LAMAAR PERFUM lo confirme a través de sus canales oficiales.

## 4. Productos y disponibilidad

Procuramos mantener actualizada la información de los productos publicados, incluyendo nombres, características, imágenes, precios y disponibilidad. La disponibilidad puede cambiar sin previo aviso. Las imágenes tienen fines ilustrativos.

## 5. Precios

Los precios publicados corresponden al valor informado al momento de su publicación. Los precios y promociones pueden modificarse sin previo aviso. Dichos cambios no afectarán pedidos que ya hayan sido confirmados, salvo situación excepcional o error manifiesto.

## 6. Promociones y descuentos

Las promociones, descuentos, combos y ofertas estarán sujetos a las condiciones específicas indicadas en cada promoción. Las promociones pueden tener vigencia determinada o estar sujetas a disponibilidad.

## 7. Métodos de pago

Los métodos de pago disponibles serán informados al cliente durante la gestión del pedido mediante nuestros canales de atención.

## 8. Envíos y entregas

Los pedidos serán enviados a la dirección proporcionada por el cliente y confirmada durante el proceso de compra. Los tiempos de entrega son estimados y pueden variar dependiendo de la ciudad, empresa transportadora, condiciones climáticas, disponibilidad logística, etc.

## 9. Cambios, devoluciones y garantías

Los cambios, devoluciones y garantías se gestionarán de acuerdo con la legislación colombiana aplicable y con las condiciones particulares de cada producto.

## 10. Cancelación de pedidos

El cliente podrá solicitar la cancelación comunicándose con nosotros a través de nuestros canales oficiales. La posibilidad de cancelar dependerá del estado en que se encuentre la preparación y envío del mismo.

## 11. Responsabilidad del usuario

El usuario se compromete a proporcionar información verdadera, completa y actualizada y a utilizar el sitio de manera lícita.

## 12. Propiedad intelectual

Los textos, imágenes, logotipos, diseños, elementos gráficos, código y demás contenidos del sitio son propiedad de LAMAAR PERFUM o son utilizados con las autorizaciones correspondientes.

## 13. Enlaces y servicios de terceros

Nuestro sitio puede utilizar o redirigir a servicios de terceros, como WhatsApp u otros proveedores relacionados con la operación comercial.

## 14. Disponibilidad del sitio

Procuramos mantener el sitio disponible y funcionando correctamente. Sin embargo, no garantizamos disponibilidad permanente o libre de errores.

## 15. Modificaciones de los términos

LAMAAR PERFUM podrá modificar estos Términos cuando resulte necesario debido a cambios legales, comerciales, tecnológicos u operativos.

## 16. Legislación aplicable

Estos Términos y Condiciones se rigen por las leyes de la República de Colombia.

## 17. Contacto

LAMAAR PERFUM — Correo: amazingstoresoporte@gmail.com — Colombia

---

*Temas relacionados: [Política de Privacidad](${SITE_URL}/privacidad) · [Catálogo](${SITE_URL}/catalogo) · [Inicio](${SITE_URL}/)*
`;

fs.writeFileSync(path.join(outBase, 'terminos.md'), termsMd);

// --- 404 ---
const notFoundMd = `# 404 — Página no encontrada — LAMMAR

> Lo sentimos, la página que estás buscando no existe o ha sido movida.

La URL que solicitaste no corresponde a ninguna página de LAMMAR. Puede que el enlace esté desactualizado, que el producto haya sido retirado o que hayas escrito mal la dirección.

## ¿Dónde ir ahora?

- [Inicio](${SITE_URL}/) — Perfumería en Manizales, colecciones y fragancias destacadas
- [Catálogo](${SITE_URL}/catalogo) — Listado completo de perfumes con filtros por marca, categoría y género
- [Política de Privacidad](${SITE_URL}/privacidad) — Qué datos tratamos y con qué finalidad
- [Términos y Condiciones](${SITE_URL}/terminos) — Condiciones de compra, envíos y devoluciones

## Mapa del sitio y recursos para agentes

- [Sitemap XML](${SITE_URL}/sitemap.xml) — Lista completa de URLs indexables
- [llms.txt](${SITE_URL}/llms.txt) — Resumen del sitio para modelos de lenguaje
- [OpenAPI](${SITE_URL}/openapi.json) — Especificación de la API

Si llegaste aquí desde un enlace externo, por favor verifica la URL o utiliza el buscador del catálogo.

---

*Contacto: amazingstoresoporte@gmail.com — WhatsApp: +57 304 6420608 — Manizales, Caldas, Colombia*
`;

fs.writeFileSync(path.join(outBase, '404.md'), notFoundMd);

// --- Product pages ---
for (const p of perfumes) {
  const md = `# ${p.nombre} — ${p.marca} — LAMMAR

> ${p.descripcion}

**Marca:** ${p.marca} — **Categoría:** ${p.categoria} — **Género:** ${p.genero} — **Tamaño:** ${p.ml} ml — **Disponibilidad:** ${p.stock > 0 ? `${p.stock} unidades disponibles` : 'Agotado temporalmente'} — **Precio:** ${formatPriceCOP(p.precio)}

## Notas olfativas

- **Salida:** ${p.notas.salida.join(', ') || '—'}
- **Corazón:** ${p.notas.corazon.join(', ') || '—'}
- **Fondo:** ${p.notas.fondo.join(', ') || '—'}

## Compra

Agrega al carrito y confirma tu pedido por WhatsApp. Envíos a toda Colombia.

[Ver producto en la tienda](${SITE_URL}/producto/${p.slug}) · [Explorar catálogo](${SITE_URL}/catalogo)

---

*Perfumería exclusiva en Manizales, Colombia — LAMMAR — WhatsApp: +57 304 6420608 — amazingstoresoporte@gmail.com*
`;
  fs.writeFileSync(path.join(outProductoBase, `${p.slug}.md`), md);
  // Brand-prefixed alias e.g. lattafa-yara for yara (user example URLs)
  const brandSlug = slugify(`${p.marca} ${p.nombre}`);
  if (brandSlug !== p.slug) {
    fs.writeFileSync(path.join(outProductoBase, `${brandSlug}.md`), md);
  }
}

console.log(`✓ Markdown generado: ${perfumes.length} productos + 8 páginas estáticas (home, catalogo, privacidad/privacy, terminos, about/nosotros, contact/contacto, 404) en ${outBase} (+brand aliases)`);
