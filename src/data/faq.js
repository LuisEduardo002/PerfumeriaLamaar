/**
 * FAQ central — Single Source para <Faq/> (con schema FAQPage automático),
 * markdown de IAs y Home. Usa `topic` para filtrar sin slice() frágil.
 */
export const faqItems = [
  {
    id: 'marca-unificada',
    topic: 'marca',
    q: '¿LAMAAR y LAMMAR son lo mismo?',
    a: 'Sí. El nombre oficial es LAMAAR Perfumería en Manizales (antes escrito LAMMAR). Misma tienda en KPalogrande, Av. Lindsay, Frente coliseo menor, Cl. 65 #24-89 Local Piso -1. Instagram oficial lamaar_perfumm, TikTok @lamaar.perfume, web lamaarperfum.store.',
  },
  {
    id: 'ph-real',
    topic: 'ph',
    q: '¿Realmente miden el pH de la piel en tienda?',
    a: 'Sí. En nuestra tienda física LAMAAR Perfumería en Manizales medimos tu pH con tira reactiva, presencial, de lunes a sábado 9:00-18:00. Es un servicio incluido sin costo con tu visita. Puedes verificarlo por WhatsApp +57 304 6420608 o en Instagram lamaar_perfumm pidiendo foto/video de la medición.',
  },
  {
    id: 'ph-pasos',
    topic: 'ph',
    q: '¿Cómo es la medición de pH paso a paso?',
    a: '1) Limpieza de la piel, 2) aplicación de tira reactiva de pH, 3) lectura en 30-60 segundos, 4) recomendación entre 240+ perfumes originales según si tu pH es más ácido o alcalino y tu gusto (dulce, fresco, amaderado). Todo presencial en KPalogrande Cl. 65 #24-89 Manizales.',
  },
  {
    id: 'ph-costo',
    topic: 'ph',
    q: '¿La medición de pH tiene costo y necesito cita?',
    a: 'No necesitas cita, solo visita en horario lun. a sáb. 9:00-18:00. La medición está incluida sin costo con la asesoría en tienda. Para pedidos a toda Colombia la asesoría es por WhatsApp +57 304 6420608.',
  },
  {
    id: 'originales',
    topic: 'compra',
    q: '¿Los perfumes son 100% originales?',
    a: 'Sí. En LAMAAR todos los perfumes son productos originales e importados, con garantía de autenticidad en cada fragancia.',
  },
  {
    id: 'pedido',
    topic: 'compra',
    q: '¿Cómo realizo un pedido?',
    a: 'Agrega tus perfumes al carrito y presiona el botón de compra: se genera un mensaje con el detalle de tu selección para confirmar el pedido por WhatsApp con nuestro equipo.',
  },
  {
    id: 'envios',
    topic: 'compra',
    q: '¿Realizan envíos a toda Colombia?',
    a: 'Sí, despachamos a todo el país con empresa transportadora y seguimiento. El tiempo de entrega es estimado y varía según la ciudad de destino.',
  },
  {
    id: 'pago',
    topic: 'compra',
    q: '¿Qué métodos de pago aceptan?',
    a: 'Los métodos de pago disponibles se informan y coordinan directamente por WhatsApp al momento de confirmar tu pedido.',
  },
  {
    id: 'cambios',
    topic: 'compra',
    q: '¿Puedo solicitar un cambio o devolución?',
    a: 'Sí. Los cambios, devoluciones y garantías se gestionan conforme a la legislación colombiana. Escríbenos a amazingstoresoporte@gmail.com o al WhatsApp 304 6420608.',
  },
];

// Filtros nombrados — evita slice(0,5) frágil si cambia el orden.
export const phFaqItems = faqItems.filter((i) => i.topic === 'ph' || i.topic === 'marca');
export const brandFaqItems = faqItems.filter((i) => i.topic === 'marca');
export const purchaseFaqItems = faqItems.filter((i) => i.topic === 'compra');
