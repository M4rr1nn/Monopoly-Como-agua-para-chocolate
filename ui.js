const tablero = document.getElementById("tablero");
const panelJugadores = document.getElementById("jugadores");

const coloresGrupos = {
    cocina: "",
    ingredientes: "",
    recetas: "",
    hacienda: "",
    tradiciones: ""
};

function obtenerPosicion(indice) {
    if (indice < 8) {
        return { fila: 1, columna: indice + 1 };
    }

    if (indice < 15) {
        return { fila: indice - 6, columna: 8 };
    }

    if (indice < 22) {
        return { fila: 8, columna: 22 - indice };
    }

    return { fila: 29 - indice, columna: 1 };
}

function dibujarTablero() {
    casilleros.forEach((casillero, indice) => {

        const elemento = document.createElement("div");
        const posicion = obtenerPosicion(indice);

        elemento.classList.add("casillero");

        elemento.style.gridRow = posicion.fila;
        elemento.style.gridColumn = posicion.columna;

        elemento.innerHTML = `
            <span class="numero">${indice + 1}</span>
            <span class="nombre">${casillero.nombre}</span>
        `;

        if (casillero.tipo === "propiedad") {
            elemento.classList.add("propiedad");

            elemento.style.borderTopColor =
                coloresGrupos[casillero.grupo];
        } else {
            elemento.classList.add("especial");
        }

        tablero.appendChild(elemento);
    });
}

function dibujarJugadores() {
    jugadoresIniciales.forEach(jugador => {

        const elemento = document.createElement("div");

        elemento.classList.add("jugador");

        elemento.innerHTML = `
            <div class="ficha"
                style="background-color: ${jugador.color}">
            </div>

            <div class="datos-jugador">
                <strong>${jugador.nombre}</strong>
                <span>$${jugador.dinero}</span>
            </div>
        `;

        panelJugadores.appendChild(elemento);
    });
}

dibujarTablero();
dibujarJugadores();
