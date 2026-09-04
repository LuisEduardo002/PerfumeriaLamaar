import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import KeyTakeaways from '../components/common/KeyTakeaways';
import RelatedLinks from '../components/common/RelatedLinks';

const Contact = () => {
  useSEO({
    title: 'Contacto — Atención al cliente',
    description:
      'Contacta a LAMMAR (LAMAAR PERFUM) en Manizales: WhatsApp +57 304 6420608, correo amazingstoresoporte@gmail.com, horario Lun. a sáb. 9:00–18:00. Resolvemos pedidos, envíos y garantías.',
    canonical: '/contact',
  });
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Contacto — LAMMAR</h1>
      <p className="mb-6 text-lg leading-relaxed text-slate-700">
        ¿Tienes dudas sobre un perfume, tu pedido o un cambio? Escríbenos y te respondemos en horario
        laboral. Atendemos desde Manizales para toda Colombia por WhatsApp y correo electrónico. No
        necesitas crear cuenta: solo envíanos tu consulta con tu nombre y número de pedido si aplica.
      </p>

      <div className="mb-8">
        <KeyTakeaways
          title="TL;DR: cómo contactarnos rápido"
          items={[
            'WhatsApp preferente: +57 304 6420608 (respuesta más rápida, Lun. a sáb. 9:00–18:00 COT).',
            'Correo: amazingstoresoporte@gmail.com — responde en máximo 24 horas hábiles.',
            'Dirección operativa: KPalogrande, Av. Lindsay, Frente coliseo menor, Cl. 65 #24-89 Local Piso -1, Manizales, Caldas 170001, Colombia.',
            'Para pedidos: indica nombre, productos y ciudad para cotizar envío y confirmar disponibilidad.',
          ]}
          cta={{ to: '/catalogo', label: 'Ver catálogo y elegir fragancia' }}
        />
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 p-4 bg-white">
          <h2 className="font-semibold text-[#111]">WhatsApp</h2>
          <p className="mt-1 text-sm text-gray-600">+57 304 6420608</p>
          <a href="https://wa.me/573046420608" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-medium text-[#4B1E28] hover:underline">
            Abrir WhatsApp →
          </a>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 bg-white">
          <h2 className="font-semibold text-[#111]">Correo</h2>
          <p className="mt-1 text-sm text-gray-600">amazingstoresoporte@gmail.com</p>
          <a href="mailto:amazingstoresoporte@gmail.com" className="mt-2 inline-block text-sm font-medium text-[#4B1E28] hover:underline">
            Enviar correo →
          </a>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 bg-white">
          <h2 className="font-semibold text-[#111]">Horario</h2>
          <p className="mt-1 text-sm text-gray-600">Lun. a sáb. 9:00–18:00 (COT)</p>
          <p className="text-xs text-gray-500">Domingos y festivos: respuesta al siguiente día hábil</p>
        </div>
      </div>

      <section className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-3">1. Datos oficiales de contacto</h2>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed">
            <p><strong>Nombre comercial:</strong> LAMAAR PERFUM (marca pública: LAMMAR)</p>
            <p><strong>Dirección:</strong> KPalogrande, Av. Lindsay, Frente coliseo menor, Cl. 65 #24-89 Local Piso -1, Manizales, Caldas 170001, Colombia</p>
            <p><strong>Coordenadas:</strong> 5.0549, -75.4850 (Manizales centro)</p>
            <p><strong>Teléfono / WhatsApp:</strong> +57 304 6420608</p>
            <p><strong>Correo:</strong> amazingstoresoporte@gmail.com</p>
            <p><strong>Horario:</strong> Lunes a sábado 9:00–18:00 (COT)</p>
            <p><strong>Web:</strong> https://lamaarperfum.store</p>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            Estos datos coinciden con los publicados en nuestra ficha de Organización/LocalBusiness JSON-LD y
            en el footer del sitio, para que agentes y buscadores verifiquen consistencia NAP (Name, Address, Phone).
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">2. Qué atendemos por cada canal</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>WhatsApp:</strong> cotizaciones, confirmación de pedidos, seguimiento de envíos, asesoría de fragancias.</li>
            <li><strong>Correo:</strong> solicitudes formales, PQRS, derechos de datos personales, garantías y reclamaciones.</li>
            <li><strong>Instagram / Facebook:</strong> novedades y atención ligera (no para datos sensibles).</li>
          </ul>
          <p className="mt-3">
            Para agilizar tu solicitud, incluye: nombre completo, número de WhatsApp, referencia del perfume
            (ej. “AL NOBLE AMEER de Lattafa 100 ml”) y ciudad de entrega. Si es sobre un pedido existente,
            añade la fecha del mensaje de WhatsApp donde lo confirmaste.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">3. Tiempos de respuesta y envíos</h2>
          <p>
            Respondemos WhatsApp en minutos dentro del horario laboral; correos en máximo 24 horas hábiles.
            Los envíos se despachan desde Manizales con transportadora aliada y tracking; los tiempos son
            estimados según ciudad (1–3 días capitales, 2–5 días resto). Te avisamos si hay demora o quiebre
            de stock antes de confirmar el pedido.
          </p>
          <p className="mt-3">
            No procesamos pagos dentro del sitio. Los métodos se coordinan al confirmar el pedido por
            WhatsApp. Consulta detalles en nuestros{' '}
            <Link to="/terminos" className="font-medium text-[#4B1E28] hover:underline">Términos y Condiciones</Link>.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">4. Privacidad y datos</h2>
          <p>
            Al contactarnos por WhatsApp o correo nos compartes voluntariamente datos personales para
            gestionar tu pedido. Solo los usamos para esa finalidad y para cumplir obligaciones legales
            colombianas. No vendemos ni cedemos tu información. Puedes consultar cómo ejercer tus derechos
            en nuestra{' '}
            <Link to="/privacy" className="font-medium text-[#4B1E28] hover:underline">Política de Privacidad</Link>.
          </p>
        </div>

        <RelatedLinks
          links={[
            { to: '/about', label: 'Sobre nosotros — Historia y valores' },
            { to: '/privacy', label: 'Política de Privacidad y datos personales' },
            { to: '/catalogo', label: 'Catálogo de perfumes originales' },
          ]}
        />

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">Última actualización: 21/08/2026 — LAMMAR / LAMAAR PERFUM — Manizales, Colombia</p>
        </div>
      </section>
    </main>
  );
};

export default Contact;
