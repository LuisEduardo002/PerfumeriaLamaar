import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import KeyTakeaways from '../components/common/KeyTakeaways';
import RelatedLinks from '../components/common/RelatedLinks';

const PoliticaPrivacidad = () => {
    useSEO({
        title: 'Política de Privacidad',
        description:
            'Conoce cómo LAMMAR trata la información personal de sus usuarios: datos recopilados, finalidades del tratamiento, seguridad y derechos de los titulares.',
        canonical: '/privacy',
    });
    return (
        <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
            <h1 className="text-3xl font-bold mb-4">
                Política de Privacidad y Tratamiento de Datos Personales
            </h1>

            <p className="mb-6">
                Si llegaste aquí buscando qué datos recopilamos al comprar perfumes en LAMMAR,
                cómo los usamos y qué puedes hacer sobre tu información personal, en esta página
                encontrarás la respuesta completa según la legislación colombiana.
            </p>

            <div className="mb-8">
                <KeyTakeaways
                    title="TL;DR: lo esencial de esta política"
                    items={[
                        'No pedimos registro ni almacenamos datos personales en el sitio: el carrito se guarda solo en tu navegador.',
                        'Los pedidos se gestionan por WhatsApp; los datos que envíes allí se usan únicamente para procesar tu compra y entrega.',
                        'No vendemos ni cedemos tu información; solo la compartimos con la transportadora cuando es necesario para entregar tu pedido.',
                        'Puedes conocer, rectificar o solicitar la eliminación de tus datos escribiendo a amazingstoresoporte@gmail.com o al WhatsApp 304 6420608.',
                    ]}
                    cta={{ to: '/catalogo', label: 'Explorar perfumes originales' }}
                />
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">
                    Resumen: datos tratados y su finalidad
                </h2>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th scope="col" className="px-4 py-3 font-semibold">Información</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Origen</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Finalidad</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            <tr>
                                <td className="px-4 py-3">Productos y cantidades del carrito</td>
                                <td className="px-4 py-3">Almacenamiento local del navegador (<code>localStorage</code>)</td>
                                <td className="px-4 py-3">Conservar temporalmente tu selección mientras compras</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">Nombre, teléfono, dirección y ciudad</td>
                                <td className="px-4 py-3">Mensaje voluntario enviado por WhatsApp</td>
                                <td className="px-4 py-3">Gestionar, confirmar y coordinar la compra y entrega del pedido</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">Datos necesarios para la entrega</td>
                                <td className="px-4 py-3">Compartidos con la empresa transportadora</td>
                                <td className="px-4 py-3">Efectuar la entrega en la dirección indicada</td>
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
                        1. Responsable
                    </h2>

                    <p>
                        <strong>Nombre o razón social:</strong> LAMAAR PERFUM

                    </p>
                    <p>
                        <strong>Nombre comercial:</strong> LAMAAR PERFUM

                    </p>
                    <p>

                    </p>
                    <p>
                        <strong>País:</strong> Colombia
                    </p>
                    <p>
                        <strong>Correo electrónico:</strong> amazingstoresoporte@gmail.com
                    </p>
                    <p>
                        <strong>WhatsApp:</strong>  304 6420608
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">
                        2. Información que recopilamos directamente desde nuestro sitio web
                    </h2>

                    <p>
                        Nuestro sitio web funciona como una plataforma de exhibición y
                        selección de productos y no cuenta con un sistema propio de
                        registro de usuarios ni con una base de datos para almacenar
                        información personal.
                    </p>

                    <p className="mt-3">
                        La página puede utilizar el almacenamiento local del navegador
                        (<code>localStorage</code>) exclusivamente para conservar
                        temporalmente información relacionada con el carrito de compras,
                        como:
                    </p>

                    <ul className="list-disc pl-6 mt-3 space-y-1">
                        <li>Productos seleccionados.</li>
                        <li>Cantidades.</li>
                        <li>
                            Información necesaria para mantener el funcionamiento del
                            carrito.
                        </li>
                    </ul>

                    <p className="mt-3">
                        Esta información permanece en el dispositivo del usuario y no
                        constituye por sí misma una recopilación de datos personales por
                        parte de nuestra página, siempre que no incluya información que
                        permita identificar directamente al usuario.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">
                        3. Proceso de compra mediante WhatsApp
                    </h2>

                    <p>
                        Nuestra página no procesa directamente el pedido mediante un
                        servidor propio.
                    </p>

                    <p className="mt-3">
                        Cuando el usuario selecciona sus productos y decide realizar el
                        pedido, la página genera un mensaje con el contenido del carrito y
                        lo redirige a WhatsApp.
                    </p>

                    <p className="mt-3">
                        El usuario decide voluntariamente si desea enviar dicho mensaje.
                    </p>

                    <p className="mt-3">
                        A través de WhatsApp, el usuario puede proporcionar información
                        personal necesaria para gestionar su pedido, como:
                    </p>

                    <ul className="list-disc pl-6 mt-3 space-y-1">
                        <li>Nombre.</li>
                        <li>Número de teléfono.</li>
                        <li>Dirección de entrega.</li>
                        <li>Ciudad.</li>
                        <li>Información relacionada con el pedido.</li>
                    </ul>

                    <p className="mt-3">
                        Cuando recibimos esta información a través de WhatsApp, podremos
                        tratarla exclusivamente para gestionar, confirmar y coordinar la
                        compra y entrega de los productos, así como para atender
                        solicitudes relacionadas con el pedido.
                    </p>

                    <p className="mt-3">
                        Las condiciones aplicables a la compra se detallan en nuestros{' '}
                        <Link to="/terminos" className="font-medium text-[#4B1E28] hover:underline">
                            Términos y Condiciones
                        </Link>.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">
                        4. Finalidades del tratamiento
                    </h2>

                    <p>
                        Los datos personales que el usuario proporcione voluntariamente a
                        través de nuestros canales de contacto podrán ser utilizados para:
                    </p>

                    <ul className="list-disc pl-6 mt-3 space-y-1">
                        <li>Gestionar y confirmar pedidos.</li>
                        <li>Contactar al cliente respecto de su compra.</li>
                        <li>Coordinar la entrega de productos.</li>
                        <li>Gestionar cambios, devoluciones o garantías cuando corresponda.</li>
                        <li>Atender preguntas, solicitudes, peticiones, quejas o reclamos.</li>
                        <li>Cumplir obligaciones legales relacionadas con la actividad comercial.</li>
                        <li>Mantener los registros necesarios relacionados con las operaciones comerciales.</li>
                    </ul>

                    <p className="mt-3">
                        Cuando se requiera autorización para una finalidad determinada,
                        esta será solicitada de acuerdo con la legislación aplicable.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">
                        5. WhatsApp y tratamiento de la información
                    </h2>

                    <p>
                        WhatsApp es utilizado como uno de nuestros canales de comunicación
                        para recibir y gestionar pedidos.
                    </p>

                    <p className="mt-3">
                        La información que el usuario decida proporcionar mediante
                        WhatsApp podrá ser tratada por <strong>LAMAAR PERFUM
                        </strong>
                        para las finalidades descritas en esta política.
                    </p>

                    <p className="mt-3">
                        Asimismo, el uso de WhatsApp está sujeto a los términos y políticas
                        de privacidad establecidos por Meta y WhatsApp.
                    </p>

                    <p className="mt-3">
                        El usuario debe tener en cuenta que, al utilizar servicios de
                        terceros como WhatsApp, dichos servicios pueden realizar sus
                        propios tratamientos de información de acuerdo con sus respectivas
                        políticas.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">
                        6. Compartición de información
                    </h2>

                    <p>
                        Los datos personales proporcionados para realizar una compra podrán
                        ser compartidos únicamente cuando resulte necesario para cumplir
                        con la finalidad correspondiente.
                    </p>

                    <p className="mt-3">
                        Por ejemplo, cuando sea necesario realizar la entrega de un pedido,
                        podremos proporcionar a la empresa transportadora los datos
                        necesarios para efectuar dicha entrega.
                    </p>

                    <p className="mt-3">
                        No comercializamos ni vendemos los datos personales de nuestros
                        clientes.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">
                        7. Cookies y almacenamiento local
                    </h2>

                    <p>
                        Nuestro sitio puede utilizar <code>localStorage</code> para
                        conservar temporalmente el contenido del carrito de compras en el
                        dispositivo del usuario.
                    </p>

                    <p className="mt-3">
                        Este almacenamiento puede ser eliminado por el usuario mediante las
                        opciones de su navegador o puede desaparecer al limpiar los datos
                        del sitio.
                    </p>

                    <p className="mt-3">
                        Si en el futuro incorporamos cookies, píxeles publicitarios,
                        herramientas de analítica u otras tecnologías que permitan
                        recopilar información sobre los visitantes, esta política será
                        actualizada cuando corresponda.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">
                        8. Información de pago
                    </h2>

                    <p>
                        Nuestra página web no solicita ni almacena directamente información
                        completa de tarjetas de crédito, débito u otros instrumentos
                        financieros.
                    </p>

                    <p className="mt-3">
                        Cuando un pago se realice mediante un tercero, la información
                        correspondiente podrá ser tratada directamente por dicho proveedor
                        conforme a sus propios términos y políticas.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">
                        9. Seguridad
                    </h2>

                    <p>
                        Adoptamos medidas razonables para proteger la información personal
                        que recibimos frente a accesos, usos, modificaciones o
                        divulgaciones no autorizadas.
                    </p>

                    <p className="mt-3">
                        No obstante, ningún sistema de comunicación o almacenamiento
                        electrónico puede garantizar una seguridad absoluta.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">
                        10. Derechos de los titulares
                    </h2>

                    <p>
                        De acuerdo con la legislación colombiana, los titulares de datos
                        personales tienen derecho a:
                    </p>

                    <ul className="list-disc pl-6 mt-3 space-y-1">
                        <li>Conocer, actualizar y rectificar sus datos personales.</li>
                        <li>Solicitar información sobre el tratamiento realizado sobre sus datos.</li>
                        <li>Solicitar prueba de la autorización cuando esta sea necesaria.</li>
                        <li>Presentar consultas y reclamos.</li>
                        <li>Solicitar la supresión de sus datos cuando sea procedente.</li>
                        <li>Revocar la autorización para el tratamiento cuando sea legalmente posible.</li>
                        <li>Acceder gratuitamente a sus datos personales en los términos establecidos por la legislación aplicable.</li>
                        <li>
                            Presentar quejas ante la Superintendencia de Industria y Comercio
                            cuando considere que sus derechos han sido vulnerados.
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">
                        11. Consultas, solicitudes y reclamos
                    </h2>

                    <p>
                        El titular podrá ejercer sus derechos comunicándose mediante:
                    </p>

                    <p className="mt-3">
                        <strong>Correo electrónico:</strong> amazingstoresoporte@gmail.com
                    </p>

                    <p>
                        <strong>WhatsApp:</strong>  304 6420608
                    </p>

                    <p className="mt-3">
                        La solicitud deberá contener, en la medida de lo posible, el nombre
                        del titular, información de contacto y una descripción clara de la
                        solicitud.
                    </p>

                    <p className="mt-3">
                        Las consultas y reclamos serán atendidos de acuerdo con los
                        términos establecidos por la legislación colombiana aplicable.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">
                        12. Conservación de la información
                    </h2>

                    <p>
                        La información personal que recibamos mediante nuestros canales de
                        comunicación será conservada durante el tiempo necesario para
                        cumplir las finalidades para las cuales fue proporcionada y las
                        obligaciones legales, contractuales o comerciales correspondientes.
                    </p>

                    <p className="mt-3">
                        Cuando la información ya no sea necesaria y no exista obligación
                        legal de conservarla, se procederá a su eliminación o se aplicarán
                        las medidas correspondientes.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">
                        13. Datos de menores de edad
                    </h2>

                    <p>
                        Nuestros productos y servicios no están dirigidos específicamente
                        a menores de edad.
                    </p>

                    <p className="mt-3">
                        No buscamos recopilar deliberadamente datos personales de niños,
                        niñas o adolescentes sin cumplir con las condiciones y garantías
                        establecidas por la legislación colombiana.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">
                        14. Modificaciones
                    </h2>

                    <p>
                        Podremos actualizar esta Política de Privacidad cuando sea
                        necesario debido a cambios legales, tecnológicos, operativos o
                        comerciales.
                    </p>

                    <p className="mt-3">
                        La versión vigente estará disponible en nuestro sitio web e
                        indicará la fecha de su última actualización.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">
                        15. Contacto
                    </h2>

                    <p>
                        Para cualquier pregunta relacionada con esta Política de Privacidad
                        o con el tratamiento de datos personales, puede comunicarse con
                        nosotros:
                    </p>

                    <div className="mt-3">
                        <p><strong>LAMAAR PERFUM
                        </strong></p>
                        <p>Correo: amazingstoresoporte@gmail.com</p>
                        <p>WhatsApp:  304 6420608</p>
                        <p>Colombia</p>
                    </div>
                </div>

                <RelatedLinks
                    links={[
                        { to: '/terminos', label: 'Términos y Condiciones de compra' },
                        { to: '/catalogo', label: 'Catálogo de perfumes originales' },
                        { to: '/', label: 'Inicio: perfumería exclusiva LAMMAR' },
                    ]}
                />

                <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Última actualización: 21/08/2026
                    </p>
                </div>
            </section>
        </main>
    );
};

export default PoliticaPrivacidad;