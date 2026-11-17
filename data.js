// ==========================================
// CASILLEROS DEL TABLERO
// ==========================================

const casilleros = [
    { nombre: "Inicio", tipo: "especial", descripcion: "Recibís 2 ingredientes distintos al completar una vuelta." },

    {
        nombre: "Enero - Tortas de Navidad",
        tipo: "receta",
        grupo: "recetas",
        precio: 4,
        alquiler: 1,
        ingredientesRequeridos: ["cebolla"]
    },
    {
        nombre: "Febrero - Pastel Chabela",
        tipo: "receta",
        grupo: "recetas",
        precio: 5,
        alquiler: 1,
        ingredientesRequeridos: ["azucar", "huevos"]
    },
    { nombre: "La cocina del rancho", tipo: "comunidad" },
    { nombre: "Paga impuestos", tipo: "impuesto", costo: 3 },
    { nombre: "Vuelta en caballo", tipo: "transporte", precio: 8, alquiler: 2 },
    { nombre: "Gana ingredientes", tipo: "ingredientes" },
    { nombre: "Efluvios y pasiones", tipo: "fortuna" },

    {
        nombre: "Marzo - Codornices en pétalos de rosas",
        tipo: "receta",
        grupo: "recetas",
        precio: 5,
        alquiler: 1,
        ingredientesRequeridos: ["ajo", "anis"]
    },
    {
        nombre: "Abril - Mole de guajolote con almendra y ajonjolí",
        tipo: "receta",
        grupo: "recetas",
        precio: 6,
        alquiler: 2,
        ingredientesRequeridos: [
            "cebolla", "azucar", "ajo", "almendras",
            "pimienta", "chileAncho", "canela", "anis"
        ]
    },
    { nombre: "Casillero pendiente", tipo: "pendiente" },

    { nombre: "De visita / Manicomio", tipo: "carcel" },

    { nombre: "Gana ingredientes", tipo: "ingredientes" },
    { nombre: "El pozo del rancho", tipo: "servicio", precio: 6, alquiler: 2 },

    {
        nombre: "Mayo - Chorizo norteño",
        tipo: "receta",
        grupo: "recetas",
        precio: 6,
        alquiler: 2,
        ingredientesRequeridos: ["ajo", "comino", "pimienta", "chileAncho"]
    },

    { nombre: "Gana ingredientes", tipo: "ingredientes" },
    { nombre: "Vuelta en caballo", tipo: "transporte", precio: 8, alquiler: 2 },
    { nombre: "Gana ingredientes", tipo: "ingredientes" },
    { nombre: "La cocina del rancho", tipo: "comunidad" },

    {
        nombre: "Junio - Masa para hacer fósforos",
        tipo: "receta",
        grupo: "recetas",
        precio: 7,
        alquiler: 2,
        ingredientesRequeridos: [],
        comprable: false
    },

    { nombre: "Gana ingredientes", tipo: "ingredientes" },
    { nombre: "Casillero pendiente", tipo: "pendiente" },

    { nombre: "Parada libre", tipo: "especial" },

    {
        nombre: "Julio - Caldo de colita de res",
        tipo: "receta",
        grupo: "recetas",
        precio: 8,
        alquiler: 2,
        ingredientesRequeridos: ["cebolla", "ajo", "jitomate"]
    },

    { nombre: "Efluvios y pasiones", tipo: "fortuna" },

    {
        nombre: "Agosto - Champandongo",
        tipo: "receta",
        grupo: "recetas",
        precio: 8,
        alquiler: 2,
        ingredientesRequeridos: [
            "cebolla", "azucar", "almendras", "jitomate",
            "comino", "acitron", "nueces"
        ]
    },

    { nombre: "Gana ingredientes", tipo: "ingredientes" },
    { nombre: "Vuelta en caballo", tipo: "transporte", precio: 8, alquiler: 2 },
    { nombre: "Gana ingredientes", tipo: "ingredientes" },

    {
        nombre: "Septiembre - Chocolate y Rosca de Reyes",
        tipo: "receta",
        grupo: "recetas",
        precio: 9,
        alquiler: 3,
        ingredientesRequeridos: ["azucar"]
    },

    {
        nombre: "Compañía de energía - Fábrica de fósforos",
        tipo: "servicio",
        precio: 6,
        alquiler: 2
    },

    { nombre: "Casillero pendiente", tipo: "pendiente" },
    { nombre: "Casillero pendiente", tipo: "pendiente" },

    { nombre: "Andá a la cárcel", tipo: "ir-carcel" },

    {
        nombre: "Octubre - Torrejas de natas",
        tipo: "receta",
        grupo: "recetas",
        precio: 10,
        alquiler: 3,
        ingredientesRequeridos: ["canela", "huevos"]
    },

    { nombre: "Gana ingredientes", tipo: "ingredientes" },
    { nombre: "La cocina del rancho", tipo: "comunidad" },

    {
        nombre: "Noviembre - Frijoles gordos con chile a la Tezcucana",
        tipo: "receta",
        grupo: "recetas",
        precio: 11,
        alquiler: 3,
        ingredientesRequeridos: ["cebolla", "pimienta", "chileAncho"]
    },

    { nombre: "Gana ingredientes", tipo: "ingredientes" },
    { nombre: "Vuelta en caballo", tipo: "transporte", precio: 8, alquiler: 2 },
    { nombre: "Gana ingredientes", tipo: "ingredientes" },
    { nombre: "Paga impuestos", tipo: "impuesto", costo: 3 },
    { nombre: "Efluvios y pasiones", tipo: "fortuna" },

    {
        nombre: "Diciembre - Chiles en nogada",
        tipo: "receta",
        grupo: "recetas",
        precio: 12,
        alquiler: 3,
        ingredientesRequeridos: [
            "cebolla", "azucar", "almendras", "jitomate",
            "comino", "acitron", "nueces"
        ]
    }
];

const nombresCasillas = casilleros.map(c => c.nombre);


// ==========================================
// INGREDIENTES
// ==========================================

// Cada jugador comienza con 2 unidades de cada ingrediente.
// Los números de la tabla del PDF indican en cuántos meses
// aparece cada ingrediente, no el inventario inicial.

const ingredientesIniciales = {
    cebolla: 2,
    azucar: 2,
    ajo: 2,
    almendras: 2,
    jitomate: 2,
    comino: 2,
    pimienta: 2,
    chileAncho: 2,
    canela: 2,
    anis: 2,
    acitron: 2,
    nueces: 2,
    huevos: 2
};

const nombresIngredientes = {
    cebolla: "Cebolla",
    azucar: "Azúcar",
    ajo: "Ajo",
    almendras: "Almendras",
    jitomate: "Jitomate",
    comino: "Comino",
    pimienta: "Pimienta",
    chileAncho: "Chile ancho",
    canela: "Canela",
    anis: "Anís",
    acitron: "Acitrón",
    nueces: "Nueces",
    huevos: "Huevos"
};


// ==========================================
// JUGADORES
// ==========================================

const jugadoresIniciales = [
    {
        nombre: "Jugador 1",
        color: "#A94438",
        propiedades: [],
        tarjetas: [],
        ingredientes: { ...ingredientesIniciales },
        enManicomio: false,
        turnosManicomio: 0
    },
    {
        nombre: "Jugador 2",
        color: "#477A55",
        propiedades: [],
        tarjetas: [],
        ingredientes: { ...ingredientesIniciales },
        enManicomio: false,
        turnosManicomio: 0
    },
    {
        nombre: "Jugador 3",
        color: "#426A9B",
        propiedades: [],
        tarjetas: [],
        ingredientes: { ...ingredientesIniciales },
        enManicomio: false,
        turnosManicomio: 0
    },
    {
        nombre: "Jugador 4",
        color: "#A17A35",
        propiedades: [],
        tarjetas: [],
        ingredientes: { ...ingredientesIniciales },
        enManicomio: false,
        turnosManicomio: 0
    }
];


// ==========================================
// CARTAS: LA COCINA DEL RANCHO
// ==========================================

const cartasCocina = [
    {
        titulo: "Efecto afrodisíaco de las codornices",
        descripcion: "Tu sangre mezclada con pétalos de rosa desata una energía irresistible en la mesa.",
        efecto: "irInicio"
    },
    {
        titulo: "Encierro en el manicomio",
        descripcion: "Tras romper los chorizos y rebelarte ante Mamá Elena, ordenan que te lleven al manicomio.",
        efecto: "manicomio"
    },
    {
        titulo: "Rescate del Dr. John Brown",
        descripcion: "John te envuelve en tu colcha, te baja del Palomar y te lleva a su laboratorio.",
        efecto: "salirManicomio"
    },
    {
        titulo: "Ataque de eclampsia de Rosaura",
        descripcion: "El complicado parto prematuro exige insumos médicos al Dr. John Brown.",
        efecto: "perderIngredientes",
        cantidad: 2
    },
    {
        titulo: "Tratamiento de caldo de colita de res",
        descripcion: "Chencha prepara un plato caliente de caldo que te devuelve la cordura y el habla.",
        efecto: "perderIngredientes",
        cantidad: 1
    },
    {
        titulo: "Clases de modales y piano de Esperanza",
        descripcion: "Rosaura exige preparar atoles e insumos para los maestros de la alta sociedad.",
        efecto: "darAlMenor"
    },
    {
        titulo: "Destrozos del remolino de gallinas",
        descripcion: "El tornado de gallinas arrasa con la huerta y destruye los pañales bordados.",
        efecto: "perderPorPropiedades"
    },
    {
        titulo: "El contrabando del chinito",
        descripcion: "Conseguís mercancía fina y especias del comerciante chino.",
        efecto: "ingredientes",
        cantidad: 3
    },
    {
        titulo: "Los ahorros de Nacha",
        descripcion: "Recordás el zootropo que Nacha te regaló ahorrando de su propio salario.",
        efecto: "ingredientes",
        cantidad: 2
    },
    {
        titulo: "Reserva de conservas",
        descripcion: "Desenterrás la reserva de gallinas y chorizos enterrados en ceniza.",
        efecto: "ingredientes",
        cantidad: 2
    },
    {
        titulo: "El cofre secreto de Mamá Elena",
        descripcion: "Abrís el cofre de madera y encontrás valiosas recetas y provisiones.",
        efecto: "ingredientes",
        cantidad: 5
    },
    {
        titulo: "Éxito del mole de guajolote",
        descripcion: "El banquete del bautizo del pequeño Roberto es un éxito.",
        efecto: "ingredientes",
        cantidad: 1
    },
    {
        titulo: "Remedios de la profesora Jovita",
        descripcion: "Compartís una receta casera y conseguís provisiones.",
        efecto: "intercambio"
    },
    {
        titulo: "Cosecha de sal de lágrimas",
        descripcion: "Nacha recolecta la sal que quedó en las losetas tras tu nacimiento.",
        efecto: "ingredientes",
        cantidad: 1
    },
    {
        titulo: "Elogios de Paquita Lobo",
        descripcion: "Halagan tus modales en la velada navideña.",
        efecto: "ingredientes",
        cantidad: 1
    },
    {
        titulo: "Festejo de los 16 años",
        descripcion: "Celebrás tu cumpleaños el 30 de septiembre preparando tu platillo favorito.",
        efecto: "cumpleanos"
    }
];


// ==========================================
// CARTAS: EFLUVIOS Y PASIONES
// ==========================================

const cartasEfluvios = [
    {
        titulo: "Codornices en pétalos de rosas",
        descripcion: "Tu sangre derramada sobre las rosas desata una pasión desbordada.",
        efecto: "ingredientes",
        cantidad: 3
    },
    {
        titulo: "La teoría de los cerillos del Dr. John Brown",
        descripcion: "El aliento del ser amado enciende un cerillo en tu interior.",
        efecto: "ingredientes",
        cantidad: 2
    },
    {
        titulo: "El zootropo de Reyes",
        descripcion: "Recordás las proyecciones mágicas del cinito de Nacha.",
        efecto: "ingredientes",
        cantidad: 2
    },
    {
        titulo: "Elogios por el licor de Noyó",
        descripcion: "Paquita Lobo y los invitados quedan deslumbrados con tu licor artesanal.",
        efecto: "ingredientes",
        cantidad: 2
    },
    {
        titulo: "Truco de cebolla en la mollera",
        descripcion: "Ponés un trozo de cebolla en la cabeza al picar y evitás llorar.",
        efecto: "ingredientes",
        cantidad: 1
    },
    {
        titulo: "Venta de conservas y encajes",
        descripcion: "Preparás el almidón perfecto para la ropa y obtenés provisiones extra.",
        efecto: "intercambio"
    },
    {
        titulo: "El secreto de las tortas de Navidad",
        descripcion: "Lográs el horneado idóneo en la víspera de Año Nuevo.",
        efecto: "ingredientes",
        cantidad: 1
    },
    {
        titulo: "Visita de las tropas revolucionarias",
        descripcion: "El capitán Juan Alejandrez respeta tu carácter y comparte suministros.",
        efecto: "cumpleanos"
    },
    {
        titulo: "El llanto del pastel Chabela",
        descripcion: "Tus lágrimas en el turrón provocan una melancolía colectiva.",
        efecto: "perderIngredientes",
        cantidad: 2
    },
    {
        titulo: "Incendio en el cuarto oscuro",
        descripcion: "El fuego interior de Gertrudis destruye provisiones del rancho.",
        efecto: "perderIngredientes",
        cantidad: 1
    },
    {
        titulo: "Reprensión de Mamá Elena",
        descripcion: "Te descubren opinando sin permiso o cosiendo sin hilvanar previamente.",
        efecto: "darAlMenor"
    },
    {
        titulo: "Destrozos en el palomar y la huerta",
        descripcion: "Un incidente en el rancho echa a perder parte de las reservas.",
        efecto: "perderPorPropiedades"
    },
    {
        titulo: "Huida a todo galope",
        descripcion: "Gertrudis responde a su llamado interior y escapa a caballo.",
        efecto: "galope"
    },
    {
        titulo: "Banquete de fósforos",
        descripcion: "Avanzás directamente a La Cocina y cobrás tu ración de ingredientes.",
        efecto: "irInicio"
    },
    {
        titulo: "Rebelión contra la autoridad",
        descripcion: "Te rebelás ante Mamá Elena y rompés los chorizos.",
        efecto: "manicomio"
    },
    {
        titulo: "La colcha de ganchillo de Tita",
        descripcion: "Tejiste una colcha kilométrica que te abriga y protege.",
        efecto: "salirManicomio"
    }
];


// ==========================================
// MEZCLAR LOS MAZOS
// ==========================================

function mezclarCartas(cartas) {
    const mazo = [...cartas];

    for (let i = mazo.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
    }

    return mazo;
}

let mazoCocina = mezclarCartas(cartasCocina);
let mazoEfluvios = mezclarCartas(cartasEfluvios);