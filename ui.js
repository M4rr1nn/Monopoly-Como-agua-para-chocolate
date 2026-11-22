
// ==========================================
// ELEMENTOS DEL TABLERO
// ==========================================

const tablero = document.getElementById("tablero");
const panelJugadores = document.getElementById("jugadores");

let posicionesJugadores = [];


// ==========================================
// POSICIONES DEL TABLERO
// ==========================================

function obtenerPosicion(indice) {

    // Lado superior: de izquierda a derecha
    if (indice <= 10) {
        return {
            fila: 1,
            columna: indice + 1
        };
    }

    // Lado derecho: de arriba hacia abajo
    if (indice <= 20) {
        return {
            fila: indice - 9,
            columna: 11
        };
    }

    // Lado inferior: de derecha a izquierda
    if (indice <= 30) {
        return {
            fila: 11,
            columna: 31 - indice
        };
    }

    // Lado izquierdo: de abajo hacia arriba
    return {
        fila: 41 - indice,
        columna: 1
    };
}


// ==========================================
// DIBUJAR TABLERO
// ==========================================

function dibujarTablero() {
    if (!tablero) return;

    tablero.querySelectorAll(".casilla").forEach(casilla => {
        casilla.remove();
    });

    casilleros.forEach((casillero, indice) => {
        const casilla = document.createElement("div");

        casilla.className = "casilla tipo-" + casillero.tipo;
        casilla.dataset.indice = indice;

        const numero = document.createElement("span");
        numero.className = "numero-casilla";
        numero.textContent = indice + 1;

        const nombre = document.createElement("span");
        nombre.className = "nombre-casilla";
        nombre.textContent = casillero.nombre;

        const fichas = document.createElement("div");
        fichas.className = "fichas-casilla";

        casilla.appendChild(numero);
        casilla.appendChild(nombre);

        if (casillero.precio !== undefined) {
            const precio = document.createElement("span");
            precio.className = "precio-casilla";
            precio.textContent = casillero.precio + " ingredientes";
            casilla.appendChild(precio);
        }

        casilla.appendChild(fichas);

        const posicion = obtenerPosicion(indice);

        casilla.style.gridRow = posicion.fila;
        casilla.style.gridColumn = posicion.columna;

        tablero.appendChild(casilla);
    });

    dibujarFichas();
}


// ==========================================
// DIBUJAR FICHAS
// ==========================================

function dibujarFichas() {
    if (!tablero) return;

    tablero.querySelectorAll(".fichas-casilla").forEach(contenedor => {
        contenedor.innerHTML = "";
    });

    posicionesJugadores.forEach((posicion, indiceJugador) => {
        const casilla = tablero.querySelector(
            '.casilla[data-indice="' + posicion + '"]'
        );

        if (!casilla) return;

        const contenedor = casilla.querySelector(".fichas-casilla");
        const jugador = jugadoresIniciales[indiceJugador];

        if (!contenedor || !jugador) return;

        const ficha = document.createElement("span");

        ficha.className = "ficha-tablero";
        ficha.style.backgroundColor = jugador.color;
        ficha.title = jugador.nombre;

        contenedor.appendChild(ficha);
    });
}


// ==========================================
// PANEL DE JUGADORES
// ==========================================

function dibujarJugadores() {
    if (!panelJugadores) return;

    panelJugadores.innerHTML = "";

    jugadoresIniciales.forEach((jugador, indice) => {
        const tarjeta = document.createElement("div");

        tarjeta.className = "jugador";

        if (indice === jugadorActivo) {
            tarjeta.classList.add("activo");
        }

        const cabecera = document.createElement("div");
        cabecera.className = "jugador-cabecera";

        const indicador = document.createElement("span");
        indicador.className = "ficha-tablero";
        indicador.style.backgroundColor = jugador.color;

        const nombre = document.createElement("span");
        nombre.className = "jugador-nombre";
        nombre.textContent = jugador.nombre;

        cabecera.appendChild(indicador);
        cabecera.appendChild(nombre);

        tarjeta.appendChild(cabecera);

        const datos = document.createElement("div");
        datos.className = "jugador-datos";

        const propiedades = document.createElement("span");
        propiedades.textContent =
            "🏡 Propiedades: " + jugador.propiedades.length;

        const totalIngredientes = Object.values(
            jugador.ingredientes
        ).reduce((total, cantidad) => total + cantidad, 0);

        const ingredientes = document.createElement("span");
        ingredientes.textContent =
            "🥘 Ingredientes: " + totalIngredientes;

        const cartasLiberacion = jugador.tarjetas.filter(
            tarjeta => tarjeta === "salirManicomio"
        ).length;

        const tarjetas = document.createElement("span");
        tarjetas.textContent =
            "📜 Cartas: " + cartasLiberacion;

        datos.appendChild(propiedades);
        datos.appendChild(ingredientes);
        datos.appendChild(tarjetas);

        tarjeta.appendChild(datos);

        if (indice === jugadorActivo) {
            const turno = document.createElement("div");
            turno.className = "jugador-turno";
            turno.textContent = "Turno actual";

            tarjeta.appendChild(turno);
        }

        if (jugador.enManicomio) {
            const estado = document.createElement("div");
            estado.className = "jugador-turno";
            estado.textContent =
                "En el manicomio · " +
                jugador.turnosManicomio + "/2 turnos";

            tarjeta.appendChild(estado);
        }

        panelJugadores.appendChild(tarjeta);
    });
}


// ==========================================
// PREPARAR TABLERO
// ==========================================

function prepararTablero() {
    posicionesJugadores = jugadoresIniciales.map(() => 0);

    dibujarTablero();
    dibujarJugadores();
}


// ==========================================
// ACTUALIZAR INTERFAZ
// ==========================================

function actualizarInterfaz() {
    dibujarFichas();
    dibujarJugadores();
}


// ==========================================
// ESTILOS DE LAS TARJETAS
// ==========================================

function crearEstilosModal() {
    if (document.getElementById("estilos-modal")) return;

    const estilos = document.createElement("style");
    estilos.id = "estilos-modal";

    estilos.textContent = `
        #modal-casillero {
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(12, 5, 4, 0.84);
            backdrop-filter: blur(7px);
        }

        #modal-casillero.visible {
            display: flex;
            animation: fondoModal 0.25s ease;
        }

        .contenido-modal {
            position: relative;
            width: min(100%, 490px);
            max-height: 85vh;
            overflow-y: auto;
            padding: 38px 32px 30px;
            text-align: center;
            color: #49301f;
            background:
                radial-gradient(ellipse at top, #fff8e7 0%, transparent 65%),
                linear-gradient(145deg, #f4e6c9, #e7d0a5);
            border: 3px solid #a87a37;
            outline: 1px solid #e9c77f;
            outline-offset: -9px;
            border-radius: 5px;
            box-shadow:
                0 25px 70px rgba(0, 0, 0, 0.65),
                inset 0 0 35px rgba(122, 78, 32, 0.15);
            animation: tarjetaAparecer 0.35s cubic-bezier(.2,.8,.2,1);
        }

        .contenido-modal::before,
        .contenido-modal::after {
            content: "✦";
            position: absolute;
            color: #a87a37;
            font-size: 24px;
        }

        .contenido-modal::before {
            top: 13px;
            left: 17px;
        }

        .contenido-modal::after {
            top: 13px;
            right: 17px;
        }

        .modal-etiqueta {
            display: inline-block;
            margin-bottom: 13px;
            padding: 5px 15px;
            color: #f5e6c5;
            background: #681923;
            border: 1px solid #b58a48;
            border-radius: 2px;
            font-family: 'Cinzel', Georgia, serif;
            font-size: 10px;
            letter-spacing: 3px;
            text-transform: uppercase;
        }

        #modal-titulo {
            margin: 0 0 13px;
            color: #701b27;
            font-family: 'Cinzel', Georgia, serif;
            font-size: clamp(21px, 5vw, 29px);
            line-height: 1.25;
            text-shadow: 1px 1px 0 #fff5dd;
        }

        .modal-separador {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin: 16px 0;
            color: #a47a3d;
        }

        .modal-separador::before,
        .modal-separador::after {
            content: "";
            width: 65px;
            height: 1px;
            background: #b58a48;
        }

        #modal-descripcion {
            margin: 0 auto 14px;
            max-width: 390px;
            color: #493526;
            font-family: Georgia, serif;
            font-size: 16px;
            line-height: 1.65;
        }

        #modal-detalle {
            margin: 0 auto;
            max-width: 390px;
            color: #795b3a;
            font-family: Georgia, serif;
            font-size: 13px;
            line-height: 1.6;
        }

        #modal-botones {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 12px;
            margin-top: 27px;
        }

        #modal-botones button {
            min-width: 125px;
            padding: 12px 19px;
            color: #fff2d6;
            background: linear-gradient(145deg, #8d2934, #59121d);
            border: 1px solid #bd9855;
            border-radius: 3px;
            font-family: 'Cinzel', Georgia, serif;
            font-size: 12px;
            letter-spacing: 0.5px;
            cursor: pointer;
            box-shadow: 0 4px 9px rgba(65, 26, 15, 0.2);
            transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
        }

        #modal-botones button:hover {
            background: linear-gradient(145deg, #ad3944, #761d29);
            transform: translateY(-3px);
            box-shadow: 0 7px 15px rgba(65, 26, 15, 0.3);
        }

        #modal-botones button:active {
            transform: translateY(0);
        }

        @keyframes fondoModal {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes tarjetaAparecer {
            from {
                opacity: 0;
                transform: translateY(25px) scale(0.94);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        @media (max-width: 480px) {
            .contenido-modal {
                padding: 35px 22px 25px;
            }

            #modal-botones {
                flex-direction: column;
            }

            #modal-botones button {
                width: 100%;
            }
        }
    `;

    document.head.appendChild(estilos);
}


// ==========================================
// CREAR VENTANA EMERGENTE
// ==========================================

function crearModal() {
    crearEstilosModal();

    let modal = document.getElementById("modal-casillero");

    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "modal-casillero";

    modal.innerHTML = `
        <div class="contenido-modal">
            <div class="modal-etiqueta">Como agua para chocolate</div>

            <h2 id="modal-titulo"></h2>

            <div class="modal-separador">✦</div>

            <p id="modal-descripcion"></p>

            <p id="modal-detalle"></p>

            <div id="modal-botones"></div>
        </div>
    `;

    document.body.appendChild(modal);

    return modal;
}


// ==========================================
// MOSTRAR TARJETA O AVISO
// ==========================================

function mostrarTarjeta({
    titulo,
    descripcion,
    detalle = "",
    botones = []
}) {
    const modal = crearModal();

    const tituloElemento = document.getElementById("modal-titulo");
    const descripcionElemento = document.getElementById("modal-descripcion");
    const detalleElemento = document.getElementById("modal-detalle");
    const botonesElemento = document.getElementById("modal-botones");

    tituloElemento.textContent = titulo || "Información";
    descripcionElemento.textContent = descripcion || "";

    detalleElemento.textContent = detalle;
    detalleElemento.style.display = detalle ? "block" : "none";

    botonesElemento.innerHTML = "";

    if (!botones.length) {
        botones = [
            { texto: "Continuar", valor: "continuar" }
        ];
    }

    modal.classList.add("visible");

    return new Promise(resolve => {
        botones.forEach(boton => {
            const elemento = document.createElement("button");

            elemento.type = "button";
            elemento.textContent = boton.texto;

            elemento.addEventListener("click", () => {
                modal.classList.remove("visible");
                resolve(boton.valor);
            }, { once: true });

            botonesElemento.appendChild(elemento);
        });
    });
}
