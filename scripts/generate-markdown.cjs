/**
 * generate-markdown.cjs
 * Generates Markdown representations for all routes into dist/__markdown/
 * Used by the Edge Middleware for Accept: text/markdown negotiation.
 */
const fs = require('fs');
const path = require('path');

function readEnvValue(key) {
  try {
    const env = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
    const match = env.match(new RegExp(`^${key}=(.*)$`, 'm'));
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

const SITE_URL = (
  process.env.VITE_SITE_URL ||
  readEnvValue('VITE_SITE_URL') ||
  'https://lamaarperfum.store'
).replace(/\/+$/, '');

const slugify = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

// Parse perfumes data (regex, avoids importing ESM with image deps)
const perfumesSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'perfumes.js'), 'utf8');

function parsePerfumes(source) {
  // Extract each product object block
  const perfumes = [];
  const productRegex = /\{\s*id:\s*(\d+),\s*nombre:\s*"([^"]+)",\s*marca:\s*"([^"]+)",\s*precio:\s*(\d+),\s*categoria:\s*"([^"]+)",\s*genero:\s*"([^"]+)",\s*ml:\s*(\d+),\s*stock:\s*(\d+),\s*descripcion:\s*"([^"]+)"/g;
  let m;
  while ((m = productRegex.exec(source)) !== null) {
    const [, id, nombre, marca, precio, categoria, genero, ml, stock, descripcion] = m;
    // Extract notas for this product (look ahead for notas block)
    const blockStart = m.index;
    const blockEnd = source.indexOf('},', blockStart) + 2;
    const block = source.slice(blockStart, blockEnd + 500);
    const notasMatch = block.match(/notas:\s*\{\s*salida:\s*\[([^\]]*)\],\s*corazon:\s*\[([^\]]*)\],\s*fondo:\s*\[([^\]]*)\]/);
    let notas = { salida: [], corazon: [], fondo: [] };
    if (notasMatch) {
      const parseList = (s) => [...s.matchAll(/"([^"]+)"/g)].map((x) => x[1]);
      notas = {
        salida: parseList(notasMatch[1]),
        corazon: parseList(notasMatch[2]),
        fondo: parseList(notasMatch[3]),
      };
    }
    perfumes.push({
      id: Number(id),
      nombre,
      marca,
      precio: Number(precio),
      categoria,
      genero,
      ml: Number(ml),
      stock: Number(stock),
      descripcion,
      notas,
      slug: slugify(nombre),
    });
  }
  return perfumes;
}

const perfumes = parsePerfumes(perfumesSource);
console.log(`Parsed ${perfumes.length} products for markdown generation`);

const outBase = path.join(__dirname, '..', 'dist', '__markdown');
const outProductoBase = path.join(outBase, 'producto');

// Ensure dirs
fs.mkdirSync(outBase, { recursive: true });
fs.mkdirSync(outProductoBase, { recursive: true });

function formatPrice(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}

// --- Home ---
const homeMd = `# LAMMAR | Perfumería en Manizales — Perfumes Originales de Diseñador

> Perfumería exclusiva en Manizales, Colombia. Perfumes 100% originales de diseñador, árabes y fragancias nicho.

## Encuentra la esencia que te define

Descubre nuestra curaduría de perfumes de diseñador y fragancias nicho. La máxima expresión de lujo y personalidad a un clic.

**Colección Exclusiva 2026**

[Explorar Catálogo](${SITE_URL}/catalogo)

## Fragancias Nicho

Aromas únicos importados directamente para ti. 100% Originales — Envío Garantizado.

## Elige tu colección

- **Caballero** — [Explorar fragancias](${SITE_URL}/catalogo?genero=Masculino)
- **Dama** — [Explorar fragancias](${SITE_URL}/catalogo?genero=Femenino)

## Fragancias Destacadas

Las opciones más cotizadas y queridas por nuestros clientes. Descubre en el [catálogo](${SITE_URL}/catalogo) más de ${perfumes.length} fragancias disponibles.

## Por qué elegir LAMMAR

- **100% Originales** — Garantía directa de autenticidad en cada fragancia.
- **Envíos Nacionales** — Despachos rápidos a toda Colombia con seguimiento.
- **Asesoría Personalizada** — Te ayudamos a encontrar tu perfume ideal por WhatsApp al +57 304 6420608.

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
  .map((p) => `- [${p.nombre} de ${p.marca}](${SITE_URL}/producto/${p.slug}) — ${formatPrice(p.precio)} — ${p.genero} · ${p.ml} ml`)
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

// --- Terms ---
const termsMd = `# Términos y Condiciones — LAMMAR

> Última actualización: 21/08/2026

Antes de comprar en LAMMAR es útil saber cómo funciona el pedido por WhatsApp, qué pasa con los precios y promociones, en cuánto llega tu perfume y cómo solicitar un cambio, devolución o garantía. El tratamiento de tu información personal se detalla en nuestra [Política de Privacidad](${SITE_URL}/privacidad).

## TL;DR: lo esencial

- El sitio funciona como vitrina: seleccionas tus perfumes aquí y el pedido se confirma por WhatsApp.
- No necesitas crear cuenta ni pagar en el sitio; los métodos de pago se coordinan al confirmar el pedido.
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

Nuestro sitio web funciona como una plataforma de exhibición y selección de productos. El usuario puede seleccionar productos, agregarlos al carrito, modificar las cantidades y revisar el contenido de su pedido. El carrito puede utilizar localStorage para conservar temporalmente los productos seleccionados. El sitio no requiere la creación de una cuenta de usuario.

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

// --- Product pages ---
for (const p of perfumes) {
  const md = `# ${p.nombre} — ${p.marca} — LAMMAR

> ${p.descripcion}

**Marca:** ${p.marca} — **Categoría:** ${p.categoria} — **Género:** ${p.genero} — **Tamaño:** ${p.ml} ml — **Disponibilidad:** ${p.stock > 0 ? `${p.stock} unidades disponibles` : 'Agotado temporalmente'} — **Precio:** ${formatPrice(p.precio)}

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
}

console.log(`✓ Markdown generado: ${perfumes.length} productos + 4 páginas estáticas en ${outBase}`);
