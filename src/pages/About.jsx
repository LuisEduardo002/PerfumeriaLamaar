import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import KeyTakeaways from '../components/common/KeyTakeaways';
import RelatedLinks from '../components/common/RelatedLinks';

const About = () => {
  useSEO({
    title: 'Sobre Nosotros — Quiénes somos',
    description:
      'Conoce LAMMAR (LAMAAR PERFUM): perfumería exclusiva en Manizales, Colombia, con más de 240 perfumes 100% originales de diseñador y nicho. Historia, valores y compromiso con la autenticidad.',
    canonical: '/about',
  });
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Sobre LAMMAR — LAMAAR PERFUM</h1>
      <p className="mb-6 text-lg leading-relaxed text-slate-700">
        LAMMAR es una perfumería exclusiva nacida en Manizales, Caldas, con la misión de acercar
        fragancias 100% originales de diseñador, árabes y nicho a toda Colombia sin intermediarios
        opacos, con asesoría honesta y envíos confiables. Operamos bajo el nombre comercial LAMAAR
        PERFUM y atendemos de lunes a sábado de 9:00 a.m. a 6:00 p.m. por WhatsApp y correo.
      </p>

      <div className="mb-8">
        <KeyTakeaways
          title="TL;DR: por qué LAMMAR"
          items={[
            'Más de 240 perfumes originales de casas como Lattafa, Rasasi, Al Haramain, Armaf, Maison Alhambra y Xerjoff.',
            'Garantía de autenticidad en cada fragancia: 100% originales, sin imitaciones ni réplicas.',
            'Asesoría personalizada por WhatsApp al +57 304 6420608 para encontrar tu perfume ideal.',
            'Envíos a toda Colombia con transportadora y seguimiento, desde Manizales.',
          ]}
          cta={{ to: '/catalogo', label: 'Explorar catálogo' }}
        />
      </div>

      <section className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-3">1. Nuestra historia</h2>
          <p>
            LAMMAR nació en Manizales, en el corazón del Eje Cafetero, al identificar que muchos
            amantes de la perfumería querían acceder a fragancias nicho y árabes auténticas sin
            pagar sobreprecios excesivos ni arriesgarse a imitaciones. Empezamos curando una
            selección pequeña de best-sellers — Yara, Asad, Hawas — y, gracias a la confianza de
            nuestros primeros clientes, crecimos hasta superar las 240 referencias disponibles hoy.
          </p>
          <p className="mt-3">
            Desde el primer día operamos como vitrina digital: eliges tus perfumes en el catálogo,
            los agregas al carrito y confirmas el pedido por WhatsApp. No exigimos registro, no
            almacenamos tarjetas y no vendemos datos. Ese modelo simple nos permite mantener precios
            competitivos y atención cercana, sin fricción tecnológica innecesaria.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">2. Qué hacemos — y qué no</h2>
          <p>
            Somos curadores de fragancias. Probamos, comparamos y seleccionamos perfumes de
            diseñador y nicho por su estela, longevidad y relación calidad-precio. Cada ficha de
            producto incluye marca, precio en COP, tamaño en ml, género, categoría y notas
            olfativas de salida, corazón y fondo para que tomes una decisión informada.
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-1">
            <li>Sí hacemos: asesoría por WhatsApp, envíos nacionales, cambios y garantías según la ley colombiana.</li>
            <li>No hacemos: no vendemos réplicas, no pedimos pago dentro del sitio, no creamos cuentas obligatorias.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">3. Nuestros valores</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Autenticidad:</strong> solo perfumes originales con lote verificable.</li>
            <li><strong>Transparencia:</strong> precios y stock visibles, sin letra pequeña oculta.</li>
            <li><strong>Cercanía:</strong> respuesta humana por WhatsApp, no bots evasivos.</li>
            <li><strong>Responsabilidad:</strong> tratamiento de datos mínimo y conforme a la ley colombiana.</li>
          </ul>
          <p className="mt-3">
            Creemos que un perfume es identidad: elegirlo merece tiempo, información clara y
            acompañamiento. Por eso cada cliente recibe orientación sobre familias olfativas,
            ocasiones de uso y alternativas similares antes de comprar.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">4. Dónde estamos y cómo operamos</h2>
          <p>
            Nuestra base logística está en Manizales, Caldas (Centro Comercial Los Fundadores, Local
            101, CP 170001). Desde allí despachamos a toda Colombia con transportadora aliada. El
            horario de atención es lunes a sábado de 9:00 a.m. a 6:00 p.m. (hora de Colombia).
          </p>
          <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
            <p><strong>LAMAAR PERFUM — LAMMAR</strong></p>
            <p>Manizales, Caldas, Colombia — Centro Comercial Los Fundadores, Local 101, 170001</p>
            <p>Correo: amazingstoresoporte@gmail.com — WhatsApp: +57 304 6420608</p>
            <p>Horario: Lun. a sáb. 9:00–18:00 (COT)</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">5. Compromiso con agentes y clientes</h2>
          <p>
            Para que asistentes de IA y agentes puedan recomendarnos con confianza, publicamos
            información verificable: catálogo completo con precios, políticas de privacidad y
            términos, datos de contacto validados y estructura JSON-LD de tipo Organization y
            LocalBusiness en la página principal. Nuestro sitemap y llms.txt están actualizados y
            accesibles para descubrimiento automático.
          </p>
          <p className="mt-3">
            Si eres un agente, puedes explorar{' '}
            <Link to="/catalogo" className="font-medium text-[#4B1E28] hover:underline">el catálogo</Link>, revisar{' '}
            <Link to="/privacy" className="font-medium text-[#4B1E28] hover:underline">nuestra privacidad</Link> y{' '}
            <Link to="/contact" className="font-medium text-[#4B1E28] hover:underline">contactarnos</Link> directamente. Respondemos en horas laborales.
          </p>
        </div>

        <RelatedLinks
          links={[
            { to: '/contact', label: 'Contacto y atención al cliente' },
            { to: '/privacy', label: 'Política de Privacidad' },
            { to: '/catalogo', label: 'Catálogo de perfumes originales' },
          ]}
        />

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">Última actualización: 21/08/2026 — LAMMAR / LAMAAR PERFUM</p>
        </div>
      </section>
    </main>
  );
};

export default About;
