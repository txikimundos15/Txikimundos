// ============================================================================
// CONFIGURACIÓN CENTRAL DE TXIKIMUNDOS
// Aquí podrás modificar fácilmente precios, textos, reglas y rutas de fotos
// sin necesidad de tocar el resto del código de la web.
// ============================================================================

const TXIKI_CONFIG = {
  // 1. DATOS GENERALES Y CONEXIÓN DE PEDIDOS
  marca: "Txikimundos",
  emailContacto: "hola@txikimundos.es", // Cámbialo por tu email real cuando quieras
  // Cuando configuremos Google Sheets + Gmail, pegaremos aquí la URL del script:
  googleScriptUrl: "https://script.google.com/macros/s/AKfycbxCRWMxd6aNO1NnWTjxcAeVvOr7fJsop88_ivBf-61nGWTTCtVvBPMQoCyWwPyo4xCV/exec",

  // 2. TEXTOS DE PORTADA (INICIO)
  inicio: {
    etiqueta: "Ecosistemas vivos hechos a mano",
    titulo: "Un pequeño mundo natural encerrado en cristal.",
    subtitulo:
      "Cada Txikimundo es un paisaje botánico único que respira, recicla su propia humedad y transforma cualquier rincón en un refugio de calma.",
    fotoHero: "img/hero-terrario.jpg",
    pilares: [
      {
        titulo: "Ciclo del agua autónomo",
        texto:
          "El agua se evapora, se condensa suavemente en las paredes del cristal y vuelve a caer en forma de lluvia interior, manteniendo el ecosistema hidratado durante meses."
      },
      {
        titulo: "Capas en equilibrio",
        texto:
          "Combinamos grava volcánica de drenaje, carbón activo purificador, sustrato orgánico aireado y musgo vivo para garantizar la salud de cada raíz."
      },
      {
        titulo: "Naturaleza sin prisas",
        texto:
          "Diseñados para convivir contigo con un mantenimiento mínimo: solo necesitan luz natural indirecta y observar cómo evolucionan día a día."
      }
    ]
  },

  // 3. RECIPIENTES DE CRISTAL (PASO 1)
  // Nota: Los precios actuales son provisionales para pruebas. Cámbialos cuando los tengas.
  recipientes: [
    {
      id: "txikihuevito",
      nombre: "Txikihuevito",
      medidas: "Ø 12 cm · Alto 15 cm (aprox.)",
      descripcion: "Formato compacto y delicado, ideal para escritorios o pequeños detalles.",
      precio: 28,
      imagen: "img/cristal-txikihuevito.jpg"
    },
    {
      id: "txikihuevo",
      nombre: "Txikihuevo",
      medidas: "Ø 16 cm · Alto 20 cm (aprox.)",
      descripcion: "Silueta ovalada equilibrada que permite jugar con alturas y musgos.",
      precio: 38,
      imagen: "img/cristal-txikihuevo.jpg"
    },
    {
      id: "txikibola",
      nombre: "Txikibola",
      medidas: "Ø 18 cm · Alto 17 cm (aprox.)",
      descripcion: "Esfera luminosa con visión envolvente de 360 grados.",
      precio: 42,
      imagen: "img/cristal-txikibola.jpg"
    },
    {
      id: "txikimatraz",
      nombre: "Txikimatraz",
      medidas: "Ø 20 cm · Alto 26 cm (aprox.)",
      descripcion: "Inspirado en los matraces botánicos clásicos, con cuello estrecho y gran base.",
      precio: 54,
      imagen: "img/cristal-txikimatraz.jpg"
    },
    {
      id: "txikibotella",
      nombre: "Txikibotella",
      medidas: "Ø 19 cm · Alto 30 cm (aprox.)",
      descripcion: "Verticalidad elegante para composiciones frondosas de porte medio.",
      precio: 58,
      imagen: "img/cristal-txikibotella.jpg"
    },
    {
      id: "txikimax",
      nombre: "Txikimax",
      medidas: "Ø 26 cm · Alto 34 cm (aprox.)",
      descripcion: "Nuestro formato más amplio para crear auténticos bosques en miniatura.",
      precio: 79,
      imagen: "img/cristal-txikimax.jpg"
    }
  ],

  // 4. GRUPOS DE PLANTAS Y REGLAS DE COMPATIBILIDAD (PASO 2)
  // Basado exactamente en tu tabla:
  // - grupoId agrupa las plantas que comparten límite máximo en un mismo recipiente.
  // - maximoPorRecipiente define cuántas unidades del grupo caben (0 = incompatible).
  gruposPlantas: [
    {
      id: "grupo_fitonias",
      nombre: "Grupo 1 · Fitonias",
      descripcion: "Hojas nervadas de colores vivos que adoran la humedad constante.",
      maximoPorRecipiente: {
        txikihuevito: 2,
        txikihuevo: 2,
        txikibola: 2,
        txikimatraz: 3,
        txikibotella: 3,
        txikimax: 5
      }
    },
    {
      id: "grupo_helecho",
      nombre: "Grupo 2 · Helechos",
      descripcion: "Frondas ligeras que aportan volumen y textura silvestre.",
      maximoPorRecipiente: {
        txikihuevito: 0, // Incompatible (x)
        txikihuevo: 1,
        txikibola: 1,
        txikimatraz: 1,
        txikibotella: 1,
        txikimax: 2
      }
    },
    {
      id: "grupo_porte_medio",
      nombre: "Grupo 3 · Porte medio (Esparraguera, Maranta, Calathea)",
      descripcion: "Especies protagonistas de mayor desarrollo para recipientes amplios.",
      maximoPorRecipiente: {
        txikihuevito: 0, // Incompatible (x)
        txikihuevo: 0,   // Incompatible (x)
        txikibola: 0,    // Incompatible (x)
        txikimatraz: 1,  // 1 a elegir entre Esparraguera, Maranta o Calathea
        txikibotella: 1, // 1 a elegir entre Esparraguera, Maranta o Calathea
        txikimax: 2      // Máximo 2 en total combinando este grupo
      }
    },
    {
      id: "grupo_hiedra",
      nombre: "Grupo 4 · Trepadoras y tapizantes",
      descripcion: "Tallos flexibles que abrazan piedras, troncos y desniveles.",
      maximoPorRecipiente: {
        txikihuevito: 0, // Incompatible (x)
        txikihuevo: 1,
        txikibola: 1,
        txikimatraz: 2,
        txikibotella: 2,
        txikimax: 3
      }
    }
  ],

  plantas: [
    {
      id: "fitonia-verde",
      grupoId: "grupo_fitonias",
      nombre: "Fitonia verde",
      detalle: "Nervadura blanca brillante sobre hoja verde intenso.",
      precio: 4.5,
      imagen: "img/planta-fitonia-verde.jpg"
    },
    {
      id: "fitonia-blanca",
      grupoId: "grupo_fitonias",
      nombre: "Fitonia blanca",
      detalle: "Follaje claro muy luminoso que aporta contraste suave.",
      precio: 4.5,
      imagen: "img/planta-fitonia-blanca.jpg"
    },
    {
      id: "fitonia-roja",
      grupoId: "grupo_fitonias",
      nombre: "Fitonia roja",
      detalle: "Tonos rosados y carmesí que rompen el monocromo verde.",
      precio: 4.5,
      imagen: "img/planta-fitonia-roja.jpg"
    },
    {
      id: "helecho",
      grupoId: "grupo_helecho",
      nombre: "Helecho",
      detalle: "Follaje plumoso clásico de sotobosque húmedo.",
      precio: 5.5,
      imagen: "img/planta-helecho.jpg"
    },
    {
      id: "esparraguera",
      grupoId: "grupo_porte_medio",
      nombre: "Esparraguera",
      detalle: "Aspecto vaporoso y ligero, crea sensación de profundidad.",
      precio: 6.5,
      imagen: "img/planta-esparraguera.jpg"
    },
    {
      id: "maranta",
      grupoId: "grupo_porte_medio",
      nombre: "Maranta",
      detalle: "Hojas dibujadas que se pliegan ligeramente al caer la tarde.",
      precio: 7.0,
      imagen: "img/planta-maranta.jpg"
    },
    {
      id: "calathea",
      grupoId: "grupo_porte_medio",
      nombre: "Calathea",
      detalle: "Patrones botánicos marcados con envés violáceo.",
      precio: 7.5,
      imagen: "img/planta-calathea.jpg"
    },
    {
      id: "hiedra",
      grupoId: "grupo_hiedra",
      nombre: "Hiedra",
      detalle: "Pequeñas hojas lobuladas ideales para dar movimiento natural.",
      precio: 5.0,
      imagen: "img/planta-hiedra.jpg"
    }
  ],

  // 5. COMPLEMENTOS NATURALES (PASO 3)
  complementos: [
    {
      id: "piedra-peq-blanca",
      nombre: "Piedras pequeñas · Blancas",
      detalle: "Proporcionadas al recipiente. Ideales para senderos o claros.",
      precio: 2.0,
      maximo: 6,
      imagen: "img/comp-piedra-peq-blanca.jpg"
    },
    {
      id: "piedra-peq-oscura",
      nombre: "Piedras pequeñas · Marrón / Gris",
      detalle: "Proporcionadas al recipiente. Acabado natural de ribera.",
      precio: 2.0,
      maximo: 6,
      imagen: "img/comp-piedra-peq-oscura.jpg"
    },
    {
      id: "piedra-med-blanca",
      nombre: "Piedras medianas · Blancas",
      detalle: "Puntos de luz mineral que estructuran el relieve.",
      precio: 3.0,
      maximo: 4,
      imagen: "img/comp-piedra-med-blanca.jpg"
    },
    {
      id: "piedra-med-oscura",
      nombre: "Piedras medianas · Marrón / Gris",
      detalle: "Roca natural en tonos tierra y pizarra.",
      precio: 3.0,
      maximo: 4,
      imagen: "img/comp-piedra-med-oscura.jpg"
    },
    {
      id: "piedra-gra-blanca",
      nombre: "Piedras grandes · Blancas",
      detalle: "Piezas protagonistas proporcionadas al tamaño del cristal.",
      precio: 4.0,
      maximo: 3,
      imagen: "img/comp-piedra-gra-blanca.jpg"
    },
    {
      id: "piedra-gra-oscura",
      nombre: "Piedras grandes · Marrón / Gris",
      detalle: "Formaciones rocosas principales para paisajes de montaña.",
      precio: 4.0,
      maximo: 3,
      imagen: "img/comp-piedra-gra-oscura.jpg"
    },
    {
      id: "tronco-natural",
      nombre: "Tronco natural curado",
      detalle: "La forma es variable y cada pieza es única; la seleccionamos artesanalmente para que encaje con tu diseño.",
      precio: 5.5,
      maximo: 3,
      imagen: "img/comp-tronco.jpg"
    }
  ],

  // 6. ESTILOS DE MONTAJE (PASO 4)
  estilos: [
    {
      id: "pendiente",
      nombre: "En pendiente",
      descripcion: "Composición escalonada pensada para contemplarse desde una cara principal.",
      precio: 0,
      imagen: "img/estilo-pendiente.jpg"
    },
    {
      id: "plano",
      nombre: "Plano",
      descripcion: "Paisaje sereno a nivel, armonioso desde cualquier ángulo.",
      precio: 0,
      imagen: "img/estilo-plano.jpg"
    },
    {
      id: "montana",
      nombre: "Montaña",
      descripcion: "Elevación central con caída suave hacia todos los lados del cristal.",
      precio: 0,
      imagen: "img/estilo-montana.jpg"
    },
    {
      id: "sorpresa",
      nombre: "Sorpresa",
      descripcion: "Déjalo en nuestras manos: diseñaremos el relieve que mejor luzca tus plantas.",
      precio: 0,
      imagen: "img/estilo-sorpresa.jpg"
    }
  ],

  // 7. HISTORIAS DE TERRARIOS ENTREGADOS
  // Para añadir una nueva historia en el futuro, copia uno de estos bloques {...},
  // pégalo arriba del todo y cambia los textos y el nombre de la foto.
  historias: [
    {
      id: "hist-01",
      fecha: "Entregado · Otoño",
      titulo: "Un bosque en pendiente para el salón de Ane",
      recipiente: "Txikimatraz · Estilo en pendiente",
      texto:
        "Ane buscaba un punto verde junto a su zona de lectura sin luz directa. Combinamos fitonias verdes y rojas con un tronco natural y roca gris para crear un pequeño sendero interior.",
      imagen: "img/historia-01.jpg"
    },
    {
      id: "hist-02",
      fecha: "Entregado · Regalo especial",
      titulo: "Txikibola de aniversario con helecho y musgo",
      recipiente: "Txikibola · Estilo montaña",
      texto:
        "Un regalo pensado para durar años. El relieve central permite admirar la textura del helecho y la fitonia blanca desde cualquier lado de la mesa.",
      imagen: "img/historia-02.jpg"
    },
    {
      id: "hist-03",
      fecha: "Entregado · Estudio",
      titulo: "Txikimax frondoso con Maranta protagonista",
      recipiente: "Txikimax · Estilo sorpresa",
      texto:
        "Nuestro formato más grande vestido con Maranta, hiedra tapizante y piedras de ribera. A las pocas semanas el musgo ya había abrazado todo el sustrato.",
      imagen: "img/historia-03.jpg"
    }
  ],

  // 8. GUÍA DE CUIDADOS Y PREGUNTAS FRECUENTES
  cuidados: [
    {
      titulo: "Luz natural indirecta",
      texto:
        "Coloca tu Txikimundo en un lugar luminoso, pero nunca bajo el sol directo. El cristal haría efecto lupa y elevaría demasiado la temperatura interior."
    },
    {
      titulo: "Riego muy espaciado",
      texto:
        "Al ser un ecosistema cerrado, conserva su propia humedad. Solo necesitará unas pocas pulverizaciones de agua (preferiblemente sin cal o reposada) cada varios meses si notas el musgo seco."
    },
    {
      titulo: "La condensación es buena señal",
      texto:
        "Es normal que el cristal amanezca ligeramente empañado por un lado debido al cambio de temperatura entre el día y la noche. Si ves gotas gruesas todo el día, destápalo un par de horas para ventilar."
    },
    {
      titulo: "Poda de mantenimiento",
      texto:
        "Si alguna hoja toca el cristal durante mucho tiempo o crece más de la cuenta, puedes recortarla con unas tijeras limpias para mantener la armonía del paisaje."
    }
  ],

  faqs: [
    {
      pregunta: "¿Cómo se realiza el pago y la entrega de mi pedido?",
      respuesta:
        "Al finalizar tu diseño en la web no se realiza ningún cargo automático. Recibirás un correo con tu resumen y nos pondremos en contacto contigo (por email o WhatsApp, según nos autorices) para confirmar plazos de elaboración artesanal, método de pago y entrega o envío."
    },
    {
      pregunta: "¿Hacéis envíos o solo entrega en mano?",
      respuesta:
        "Preparamos embalajes especiales de alta protección para envíos nacionales y también realizamos entregas en mano según zona. Al revisar tu pedido te confirmaremos la opción más segura para el tamaño de cristal elegido."
    },
    {
      pregunta: "¿Cuánto tiempo tarda en prepararse un Txikimundo a medida?",
      respuesta:
        "Cada terrario se monta de forma artesanal tras recibir tu configuración y necesita unos días de aclimatación para asegurar que las plantas y el musgo estén estables antes de viajar contigo."
    },
    {
      pregunta: "¿Qué ocurre si aparece algo de moho blanco al principio?",
      respuesta:
        "En ecosistemas jóvenes puede surgir un poco de micelio por exceso de humedad inicial. Basta con retirar la zona afectada con un bastoncillo y dejar el recipiente destapado unas horas para equilibrar la humedad."
    }
  ]
};
