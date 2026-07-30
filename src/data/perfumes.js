/**
 * perfumes.js — Fuente de datos local en COP
 */

import asadImage from '../assets/images/asad.jpeg';
import khamrahImage from '../assets/images/khamrah.jpeg';
import yaraImage from '../assets/images/yara.jpeg';
import clubDeNuitImage from '../assets/images/clubdenuit.jpeg';
import amethystImage from '../assets/images/amethyst.jpeg';
import sauvageImage from '../assets/images/sauvageedp.jpeg';
import bleuDeChanelImage from '../assets/images/bleuchaneledt.jpeg';
import blackOrchidImage from '../assets/images/orchid.jpeg';
import laVieEstBelleImage from '../assets/images/estbelle.jpeg';
import aventusImage from '../assets/images/creedaventus.png';
import oudForGreatnessImage from '../assets/images/gretness.jpeg';
import goodGirlImage from '../assets/images/goodgirl.jpeg';

export const perfumes = [
  {
    id: 1,
    nombre: "Asad",
    marca: "Lattafa",
    precio: 180000,
    categoria: "Arabes",
    genero: "Masculino",
    ml: 100,
    stock: 15,
    descripcion:
      "Una fragancia intensa y especiada con notas de vainilla, ámbar y maderas. Inspirada en las noches del desierto, Asad combina potencia y elegancia en cada aplicación.",
    notas: {
      salida: ["Pimienta negra", "Tabaco"],
      corazon: ["Ámbar", "Café"],
      fondo: ["Vainilla", "Sándalo", "Almizcle"],
    },
    imagen: asadImage,
    imagenes: [asadImage],
    destacado: true,
  },
  {
    id: 2,
    nombre: "Khamrah",
    marca: "Lattafa",
    precio: 220000,
    categoria: "Arabes",
    genero: "Unisex",
    ml: 100,
    stock: 10,
    descripcion:
      "Dulce, gourmand, con toques de canela y praliné. Khamrah es una experiencia olfativa que evoca calidez y sofisticación, perfecta para noches especiales.",
    notas: {
      salida: ["Canela", "Nuez moscada"],
      corazon: ["Praliné", "Dátil"],
      fondo: ["Vainilla", "Ámbar", "Madera de oud"],
    },
    imagen: khamrahImage,
    imagenes: [khamrahImage],
    destacado: true,
  },
  {
    id: 3,
    nombre: "Yara",
    marca: "Lattafa",
    precio: 160000,
    categoria: "Arabes",
    genero: "Femenino",
    ml: 100,
    stock: 20,
    descripcion:
      "Femenino y dulce con notas tropicales y vainilla. Yara es la fragancia perfecta para la mujer moderna que busca dejar una estela inolvidable.",
    notas: {
      salida: ["Orquídea", "Heliotropo"],
      corazon: ["Golosa", "Vainilla"],
      fondo: ["Almizcle", "Sándalo"],
    },
    imagen: yaraImage,
    imagenes: [yaraImage],
    destacado: true,
  },
  {
    id: 4,
    nombre: "Club de Nuit Intense",
    marca: "Armaf",
    precio: 210000,
    categoria: "Arabes",
    genero: "Masculino",
    ml: 105,
    stock: 12,
    descripcion:
      "Cítrico, ahumado y amaderado, ideal para cualquier ocasión. Una fragancia que combina frescura y profundidad con una proyección impresionante.",
    notas: {
      salida: ["Limón", "Piña", "Grosellas negras"],
      corazon: ["Rosa", "Abedul"],
      fondo: ["Almizcle", "Ámbar gris", "Vetiver"],
    },
    imagen: clubDeNuitImage,
    imagenes: [clubDeNuitImage],
    destacado: true,
  },
  {
    id: 5,
    nombre: "Bade'e Al Oud Amethyst",
    marca: "Lattafa",
    precio: 190000,
    categoria: "Arabes",
    genero: "Unisex",
    ml: 100,
    stock: 8,
    descripcion:
      "Una fusión cautivadora de oud y notas florales. Amethyst captura la esencia del lujo árabe con un giro moderno que lo hace accesible y adictivo.",
    notas: {
      salida: ["Azafrán", "Ciruela"],
      corazon: ["Rosa de Damasco", "Jazmín"],
      fondo: ["Oud", "Vainilla", "Ámbar"],
    },
    imagen: amethystImage,
    imagenes: [amethystImage],
    destacado: false,
  },
  {
    id: 6,
    nombre: "Sauvage",
    marca: "Dior",
    precio: 580000,
    categoria: "Diseñador",
    genero: "Masculino",
    ml: 100,
    stock: 6,
    descripcion:
      "Fresca, potente y magnética. Sauvage de Dior es el perfume masculino más icónico de la última década, inspirado en los paisajes abiertos del desierto.",
    notas: {
      salida: ["Bergamota", "Pimienta"],
      corazon: ["Lavanda", "Pimienta de Sichuan"],
      fondo: ["Ambroxan", "Cedro"],
    },
    imagen: sauvageImage,
    imagenes: [sauvageImage],
    destacado: false,
  },
  {
    id: 7,
    nombre: "Bleu de Chanel",
    marca: "Chanel",
    precio: 650000,
    categoria: "Diseñador",
    genero: "Masculino",
    ml: 100,
    stock: 5,
    descripcion:
      "Elegancia atemporal en un frasco. Bleu de Chanel es un woody aromático que encarna la libertad y la determinación del hombre contemporáneo.",
    notas: {
      salida: ["Menta", "Pomelo", "Limón"],
      corazon: ["Cedro", "Jengibre"],
      fondo: ["Sándalo", "Almizcle", "Incienso"],
    },
    imagen: bleuDeChanelImage,
    imagenes: [bleuDeChanelImage],
    destacado: false,
  },
  {
    id: 8,
    nombre: "Black Orchid",
    marca: "Tom Ford",
    precio: 890000,
    categoria: "Nicho",
    genero: "Unisex",
    ml: 100,
    stock: 3,
    descripcion:
      "Lujoso, oscuro y absolutamente cautivador. Black Orchid es la obra maestra de Tom Ford, una fragancia que rompe convenciones con su mezcla de orquídea negra y especias.",
    notas: {
      salida: ["Trufa negra", "Ylang-Ylang"],
      corazon: ["Orquídea negra", "Especias"],
      fondo: ["Pachulí", "Vainilla", "Vetiver"],
    },
    imagen: blackOrchidImage,
    imagenes: [blackOrchidImage],
    destacado: false,
  },
  {
    id: 9,
    nombre: "La Vie Est Belle",
    marca: "Lancôme",
    precio: 480000,
    categoria: "Diseñador",
    genero: "Femenino",
    ml: 75,
    stock: 9,
    descripcion:
      "La felicidad hecha fragancia. Un gourmand floral que celebra la belleza de la vida con su icónico acorde de iris y praliné.",
    notas: {
      salida: ["Grosellas negras", "Pera"],
      corazon: ["Iris", "Jazmín"],
      fondo: ["Praliné", "Vainilla", "Pachulí"],
    },
    imagen: laVieEstBelleImage,
    imagenes: [laVieEstBelleImage],
    destacado: false,
  },
  {
    id: 10,
    nombre: "Aventus",
    marca: "Creed",
    precio: 1250000,
    categoria: "Nicho",
    genero: "Masculino",
    ml: 100,
    stock: 2,
    descripcion:
      "El rey de las fragancias nicho. Aventus de Creed celebra la fuerza, el poder y el éxito con una mezcla única de piña y abedul ahumado.",
    notas: {
      salida: ["Piña", "Bergamota", "Manzana"],
      corazon: ["Abedul", "Rosa", "Jazmín"],
      fondo: ["Almizcle", "Vainilla", "Roble"],
    },
    imagen: aventusImage,
    imagenes: [aventusImage],
    destacado: false,
  },
  {
    id: 11,
    nombre: "Oud For Greatness",
    marca: "Initio",
    precio: 1100000,
    categoria: "Nicho",
    genero: "Unisex",
    ml: 90,
    stock: 4,
    descripcion:
      "Oud en su máxima expresión. Una fragancia de Initio Parfums que combina el mejor oud con almizcle y azafrán para crear una experiencia sublime.",
    notas: {
      salida: ["Azafrán", "Nuez moscada"],
      corazon: ["Oud de Laos", "Gálbano"],
      fondo: ["Almizcle", "Cedro"],
    },
    imagen: oudForGreatnessImage,
    imagenes: [oudForGreatnessImage],
    destacado: false,
  },
  {
    id: 12,
    nombre: "Good Girl",
    marca: "Carolina Herrera",
    precio: 450000,
    categoria: "Diseñador",
    genero: "Femenino",
    ml: 80,
    stock: 11,
    descripcion:
      "Dual como la mujer moderna. Good Girl combina la dulzura del jazmín con la intensidad del cacao y tonka en un frasco icónico con forma de stiletto.",
    notas: {
      salida: ["Almendras", "Café"],
      corazon: ["Tuberosa", "Jazmín sambac"],
      fondo: ["Cacao", "Haba tonka", "Sándalo"],
    },
    imagen: goodGirlImage,
    imagenes: [goodGirlImage],
    destacado: false,
  },
];
