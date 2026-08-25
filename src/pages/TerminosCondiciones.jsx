import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import KeyTakeaways from '../components/common/KeyTakeaways';
import RelatedLinks from '../components/common/RelatedLinks';

const TerminosCondiciones = () => {
    useSEO({
        title: 'Términos y Condiciones',
        description:
            'Consulta los términos y condiciones de compra en LAMMAR: precios, envíos a toda Colombia, cambios, devoluciones y garantías de nuestros perfumes originales.',
        canonical: '/terminos',
    });
    return (<main className="max-w-4xl mx-auto px-6 py-12 text-gray-800"> <h1 className="text-3xl font-bold mb-4">
        Términos y Condiciones </h1>

        <p className="mb-6">
            Antes de comprar en LAMMAR es útil saber cómo funciona el pedido por WhatsApp,
            qué pasa con los precios y promociones, en cuánto llega tu perfume y cómo solicitar
            un cambio, devolución o garantía. Esas son las condiciones que encontrarás a
            continuación. El tratamiento de tu información personal se detalla en nuestra{' '}
            <Link to="/privacidad" className="font-medium text-[#4B1E28] hover:underline">
                Política de Privacidad
            </Link>.
        </p>

        <div className="mb-8">
            <KeyTakeaways
                title="TL;DR: lo esencial de estos términos"
                items={[
                    'El sitio funciona como vitrina: seleccionas tus perfumes aquí y el pedido se confirma por WhatsApp.',
                    'No necesitas crear cuenta ni pagar en el sitio; los métodos de pago se coordinan al confirmar el pedido.',
                    'Los tiempos de entrega son estimados y varían según ciudad y transportadora.',
                    'Cambios, devoluciones y garantías se rigen por la legislación colombiana: escríbenos a amazingstoresoporte@gmail.com para gestionarlos.',
                ]}
                cta={{ to: '/catalogo', label: 'Ver perfumes disponibles' }}
            />
        </div>

        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Condiciones clave de compra</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th scope="col" className="px-4 py-3 font-semibold">Aspecto</th>
                            <th scope="col" className="px-4 py-3 font-semibold">Detalle</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        <tr>
                            <td className="px-4 py-3 font-medium">Realización del pedido</td>
                            <td className="px-4 py-3">Selección de productos en el sitio y confirmación por WhatsApp.</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-medium">Confirmación</td>
                            <td className="px-4 py-3">El pedido queda firme únicamente cuando LAMMAR lo confirma por sus canales oficiales.</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-medium">Pago</td>
                            <td className="px-4 py-3">Los métodos se informan durante la gestión del pedido; no hay pagos dentro del sitio.</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-medium">Envío</td>
                            <td className="px-4 py-3">A la dirección confirmada por el cliente; tiempos estimados según ciudad y transportadora.</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-medium">Cambios y devoluciones</td>
                            <td className="px-4 py-3">Gestionados según la legislación colombiana a través de nuestros canales de contacto.</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-medium">Precios y promociones</td>
                            <td className="px-4 py-3">Pueden modificarse sin previo aviso; los cambios no afectan pedidos ya confirmados.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <p className="text-sm text-gray-500 mb-8">
            Última actualización: 21/08/2026
        </p>

        <section className="space-y-8">
            <div>
                <h2 className="text-xl font-semibold mb-3">
                    1. Información general
                </h2>

                <p>
                    Estos Términos y Condiciones regulan el acceso y uso del sitio web
                    de <strong>LAMAAR PERFUM
                    </strong>, así como las condiciones
                    aplicables a la selección y solicitud de productos realizada a
                    través del sitio.
                </p>

                <p className="mt-3">
                    Al utilizar nuestro sitio web, el usuario acepta estos Términos y
                    Condiciones. Si no está de acuerdo con alguno de ellos, deberá
                    abstenerse de utilizar el sitio.
                </p>

                <div className="mt-4">
                    <p>
                        <strong>Nombre comercial:</strong> LAMAAR PERFUM

                    </p>
                    <p>
                        <strong>Responsable:</strong> [NOMBRE COMPLETO / RAZÓN SOCIAL]
                    </p>
                    <p>
                        <strong>NIT:</strong> [NIT, SI APLICA]
                    </p>
                    <p>
                        <strong>País:</strong> Colombia
                    </p>
                    <p>
                        <strong>Correo:</strong> amazingstoresoporte@gmail.com
                    </p>
                    <p>
                        <strong>WhatsApp:</strong> [NÚMERO]
                    </p>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">
                    2. Funcionamiento del sitio web
                </h2>

                <p>
                    Nuestro sitio web funciona como una plataforma de exhibición y
                    selección de productos.
                </p>

                <p className="mt-3">
                    El usuario puede seleccionar productos, agregarlos al carrito,
                    modificar las cantidades y revisar el contenido de su pedido.
                </p>

                <p className="mt-3">
                    El carrito puede utilizar el almacenamiento local del navegador
                    (<code>localStorage</code>) para conservar temporalmente los
                    productos seleccionados.
                </p>

                <p className="mt-3">
                    El sitio no requiere la creación de una cuenta de usuario para
                    realizar una solicitud de compra.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">
                    3. Realización de pedidos mediante WhatsApp
                </h2>

                <p>
                    Al seleccionar la opción para realizar un pedido, el sitio genera
                    un mensaje con la información de los productos incluidos en el
                    carrito y redirige al usuario a WhatsApp.
                </p>

                <p className="mt-3">
                    El usuario deberá revisar la información del pedido antes de
                    enviarla y será responsable de verificar que los productos,
                    cantidades y demás información sean correctos.
                </p>

                <p className="mt-3">
                    La generación del mensaje y la redirección a WhatsApp no implican
                    por sí mismas que el pedido haya sido aceptado o confirmado.
                </p>

                <p className="mt-3">
                    El pedido se considerará confirmado únicamente cuando
                    <strong> LAMAAR PERFUM
                    </strong> lo confirme a través de sus
                    canales oficiales de comunicación.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">
                    4. Productos y disponibilidad
                </h2>

                <p>
                    Procuramos mantener actualizada la información de los productos
                    publicados en el sitio, incluyendo sus nombres, características,
                    imágenes, precios y disponibilidad.
                </p>

                <p className="mt-3">
                    Sin embargo, la disponibilidad puede cambiar sin previo aviso.
                    En caso de que un producto seleccionado no se encuentre disponible,
                    nos comunicaremos con el cliente para informarle y, cuando sea
                    posible, ofrecer alternativas.
                </p>

                <p className="mt-3">
                    Las imágenes utilizadas en el sitio tienen fines ilustrativos y
                    pueden presentar pequeñas diferencias respecto al producto físico.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">
                    5. Precios
                </h2>

                <p>
                    Los precios publicados en el sitio corresponden al valor informado
                    para cada producto o promoción al momento de su publicación.
                </p>

                <p className="mt-3">
                    Los precios y promociones pueden modificarse sin previo aviso.
                    Dichos cambios no afectarán pedidos que ya hayan sido confirmados,
                    salvo que exista una situación excepcional o un error manifiesto
                    en la información publicada.
                </p>

                <p className="mt-3">
                    En caso de presentarse un error evidente en el precio de un
                    producto, <strong>LAMAAR PERFUM
                    </strong> podrá comunicarse
                    con el cliente para aclarar la situación antes de confirmar el
                    pedido.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">
                    6. Promociones y descuentos
                </h2>

                <p>
                    Las promociones, descuentos, combos y ofertas disponibles en el
                    sitio estarán sujetos a las condiciones específicas indicadas en
                    cada promoción.
                </p>

                <p className="mt-3">
                    Las promociones pueden tener una vigencia determinada, estar
                    sujetas a disponibilidad o aplicar únicamente a determinados
                    productos.
                </p>

                <p className="mt-3">
                    Salvo que se indique expresamente lo contrario, las promociones no
                    son acumulables entre sí.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">
                    7. Métodos de pago
                </h2>

                <p>
                    Los métodos de pago disponibles serán informados al cliente durante
                    la gestión del pedido mediante nuestros canales de atención.
                </p>

                <p className="mt-3">
                    Cuando se utilice un proveedor externo para procesar un pago, las
                    condiciones y políticas de dicho proveedor también podrán resultar
                    aplicables.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">
                    8. Envíos y entregas
                </h2>

                <p>
                    Los pedidos serán enviados a la dirección proporcionada por el
                    cliente y confirmada durante el proceso de compra.
                </p>

                <p className="mt-3">
                    Los tiempos de entrega son estimados y pueden variar dependiendo
                    de la ciudad, empresa transportadora, condiciones climáticas,
                    disponibilidad logística, temporadas de alta demanda u otras
                    circunstancias ajenas a nuestro control.
                </p>

                <p className="mt-3">
                    El cliente deberá proporcionar información correcta y suficiente
                    para realizar la entrega.
                </p>

                <p className="mt-3">
                    En caso de que la entrega no pueda realizarse debido a información
                    incorrecta, ausencia del destinatario, negativa a recibir el
                    pedido u otras circunstancias atribuibles al cliente, podrán
                    aplicarse las condiciones de envío y devolución correspondientes.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">
                    9. Cambios, devoluciones y garantías
                </h2>

                <p>
                    Los cambios, devoluciones y garantías se gestionarán de acuerdo con
                    la legislación colombiana aplicable y con las condiciones
                    particulares de cada producto.
                </p>

                <p className="mt-3">
                    Para solicitar un cambio, devolución o hacer efectiva una garantía,
                    el cliente deberá comunicarse con nosotros mediante nuestros
                    canales oficiales y proporcionar la información necesaria para
                    identificar la compra.
                </p>

                <p className="mt-3">
                    No se aceptarán solicitudes que contravengan las condiciones
                    establecidas por la legislación aplicable o que correspondan a
                    situaciones expresamente excluidas por esta.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">
                    10. Cancelación de pedidos
                </h2>

                <p>
                    El cliente podrá solicitar la cancelación de un pedido comunicándose
                    con nosotros a través de nuestros canales oficiales.
                </p>

                <p className="mt-3">
                    La posibilidad de cancelar un pedido dependerá del estado en que se
                    encuentre la preparación y envío del mismo y de los derechos que
                    correspondan al consumidor conforme a la legislación colombiana.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">
                    11. Responsabilidad del usuario
                </h2>

                <p>
                    El usuario se compromete a proporcionar información verdadera,
                    completa y actualizada cuando sea necesaria para gestionar una
                    compra.
                </p>

                <p className="mt-3">
                    El usuario también se compromete a utilizar el sitio de manera
                    lícita y a no realizar actividades que puedan afectar su
                    funcionamiento o seguridad.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">
                    12. Propiedad intelectual
                </h2>

                <p>
                    Los textos, imágenes, logotipos, diseños, elementos gráficos,
                    código y demás contenidos del sitio son propiedad de
                    <strong> LAMAAR PERFUM
                    </strong> o son utilizados con las
                    autorizaciones correspondientes, cuando aplique.
                </p>

                <p className="mt-3">
                    No está permitido copiar, reproducir, modificar, distribuir o
                    utilizar dichos contenidos con fines comerciales sin autorización
                    previa, salvo que la ley permita expresamente su utilización.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">
                    13. Enlaces y servicios de terceros
                </h2>

                <p>
                    Nuestro sitio puede utilizar o redirigir a servicios de terceros,
                    como WhatsApp u otros proveedores relacionados con la operación
                    comercial.
                </p>

                <p className="mt-3">
                    Estos servicios cuentan con sus propios términos y políticas, por
                    lo que recomendamos al usuario consultar sus condiciones antes de
                    utilizarlos.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">
                    14. Disponibilidad del sitio
                </h2>

                <p>
                    Procuramos mantener el sitio disponible y funcionando
                    correctamente. Sin embargo, no garantizamos que el sitio se
                    encuentre disponible de manera permanente o libre de errores.
                </p>

                <p className="mt-3">
                    El sitio puede experimentar interrupciones debido a mantenimiento,
                    actualizaciones, fallos técnicos, problemas de conexión u otras
                    circunstancias.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">
                    15. Modificaciones de los términos
                </h2>

                <p>
                    <strong>LAMAAR PERFUM
                    </strong> podrá modificar estos
                    Términos y Condiciones cuando resulte necesario debido a cambios
                    legales, comerciales, tecnológicos u operativos.
                </p>

                <p className="mt-3">
                    La versión vigente estará disponible en esta página e indicará la
                    fecha de su última actualización.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">
                    16. Legislación aplicable
                </h2>

                <p>
                    Estos Términos y Condiciones se rigen por las leyes de la República
                    de Colombia, sin perjuicio de los derechos que correspondan a los
                    consumidores de acuerdo con la legislación aplicable.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">
                    17. Contacto
                </h2>

                <p>
                    Para preguntas, solicitudes o cualquier asunto relacionado con
                    nuestros productos y servicios, puede comunicarse con nosotros a
                    través de:
                </p>

                <div className="mt-3">
                    <p><strong>LAMAAR PERFUM
                    </strong></p>
                    <p>Correo: amazingstoresoporte@gmail.com</p>
                    <p>WhatsApp: [NÚMERO]</p>
                    <p>Colombia</p>
                </div>
            </div>

            <RelatedLinks
                links={[
                    { to: '/privacidad', label: 'Política de Privacidad y datos personales' },
                    { to: '/catalogo', label: 'Catálogo de perfumes originales' },
                    { to: '/', label: 'Inicio: perfumería exclusiva LAMMAR' },
                ]}
            />

            <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                    Última actualización: 21/08.2026
                </p>
            </div>
        </section>
    </main>


    );
};

export default TerminosCondiciones;
