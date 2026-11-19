// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaCantidad = document.getElementById("pantalla-cantidad");
const pantallaConfiguracion = document.getElementById("pantalla-configuracion");
const pantallaJuego = document.getElementById("pantalla-juego");

const botonComenzar = document.getElementById("btn-comenzar");
const botonVolverInicio = document.getElementById("btn-volver-inicio");
const botonVolverCantidad = document.getElementById("btn-volver-cantidad");
const botonIniciarPartida = document.getElementById("btn-iniciar-partida");
const botonDados = document.getElementById("btn-dados");

const mensajeError = document.getElementById("error-configuracion");
const mensaje = document.getElementById("mensaje");

const panelMusica = document.getElementById("panel-musica");
const ubicacionMusicaInicial = document.getElementById("ubicacion-musica-inicial");
const ubicacionMusicaJuego = document.getElementById("ubicacion-musica-juego");
const tituloMusica = document.getElementById("titulo-musica");
const nombreCancion = document.getElementById("nombre-cancion");


// ==========================================
// MÚSICA
// ==========================================

function mostrarMusicaInicial() {
    if (!panelMusica || !ubicacionMusicaInicial) return;

    ubicacionMusicaInicial.appendChild(panelMusica);

    if (tituloMusica) tituloMusica.textContent = "🎼 Música de la historia";
    if (nombreCancion) nombreCancion.textContent = "Estrellita — Manuel Ponce";
}

function mostrarMusicaPartida() {
    if (!panelMusica || !ubicacionMusicaJuego) return;

    ubicacionMusicaJuego.appendChild(panelMusica);

    if (tituloMusica) tituloMusica.textContent = "🎼 Música de la partida";
    if (nombreCancion) nombreCancion.textContent = "Estrellita — Manuel Ponce";
}


// ==========================================
// CONFIGURACIÓN Y TURNOS
// ==========================================

const coloresJugadores = ["#A94438", "#477A55", "#426A9B", "#A17A35"];

let cantidadJugadores = 2;
let jugadorActivo = 0;

let faseDefinicionInicio = false;
let jugadoresParaTirar = [];
let indiceTiradaInicial = 0;
let resultadosTirada = {};

let ordenTurnos = [];
let indiceTurno = 0;
let lanzandoDados = false;
let doblesConsecutivos = 0;
let ultimoLanzamientoDoble = false;


// ==========================================
// TEMPORIZADOR DE PARTIDA
// ==========================================

const DURACION_PARTIDA = 2 * 60 * 60 * 1000;

let tiempoFinalPartida = null;
let intervaloTemporizador = null;
let partidaFinalizada = false;

function crearTemporizador() {
    if (document.getElementById("temporizador-partida")) return;

    const estilo = document.createElement("style");

    estilo.textContent = `
        #temporizador-partida {
            position: fixed;
            top: 15px;
            right: 20px;
            z-index: 999;
            padding: 12px 18px;
            border: 2px solid #d5a64d;
            border-radius: 12px;
            background: #3b241d;
            color: #fff1d0;
            font-size: 20px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,.35);
        }

        #temporizador-partida.urgente {
            background: #8b2929;
            border-color: #ff7777;
        }

        #modal-final-partida {
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            background: rgba(0,0,0,.8);
        }

        #modal-final-partida .contenido-final {
            max-width: 500px;
            width: 100%;
            padding: 30px;
            border: 3px solid #d5a64d;
            border-radius: 18px;
            background: #3b241d;
            color: #fff1d0;
            text-align: center;
            box-shadow: 0 8px 30px rgba(0,0,0,.5);
        }

        #modal-final-partida h2 {
            margin-top: 0;
            color: #f2c66d;
        }

        #modal-final-partida button {
            margin-top: 20px;
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            background: #d5a64d;
            color: #3b241d;
            font-weight: bold;
            cursor: pointer;
        }

        #modal-final-partida .resultado-jugador {
            margin: 10px 0;
            padding: 10px;
            border-radius: 8px;
            background: rgba(255,255,255,.1);
        }
    `;

    document.head.appendChild(estilo);

    const temporizador = document.createElement("div");
    temporizador.id = "temporizador-partida";
    temporizador.textContent = "Tiempo restante: 02:00:00";

    document.body.appendChild(temporizador);
}

function formatearTiempo(tiempo) {
    const horas = Math.floor(tiempo / 3600000);
    const minutos = Math.floor((tiempo % 3600000) / 60000);
    const segundos = Math.floor((tiempo % 60000) / 1000);

    return [horas, minutos, segundos]
        .map(valor => String(valor).padStart(2, "0"))
        .join(":");
}

function iniciarTemporizador() {
    detenerTemporizador();

    partidaFinalizada = false;
    tiempoFinalPartida = Date.now() + DURACION_PARTIDA;

    crearTemporizador();

    const temporizador = document.getElementById("temporizador-partida");

    if (temporizador) {
        temporizador.classList.remove("urgente");
    }

    actualizarTemporizador();

    intervaloTemporizador = setInterval(
        actualizarTemporizador,
        1000
    );
}

function detenerTemporizador() {
    if (intervaloTemporizador) {
        clearInterval(intervaloTemporizador);
    }

    intervaloTemporizador = null;
    tiempoFinalPartida = null;
}

function actualizarTemporizador() {
    if (partidaFinalizada || tiempoFinalPartida === null) return;

    const restante = Math.max(0, tiempoFinalPartida - Date.now());

    const temporizador = document.getElementById("temporizador-partida");

    if (temporizador) {
        temporizador.textContent =
            "Tiempo restante: " + formatearTiempo(restante);

        temporizador.classList.toggle(
            "urgente",
            restante <= 5 * 60 * 1000
        );
    }

    if (restante <= 0) {
        finalizarPartida();
    }
}

function mostrarResultadoFinal(resultados, ganadores) {
    const anterior = document.getElementById("modal-final-partida");
    if (anterior) anterior.remove();

    const modal = document.createElement("div");
    modal.id = "modal-final-partida";

    const contenido = document.createElement("div");
    contenido.className = "contenido-final";

    const titulo = document.createElement("h2");

    titulo.textContent = ganadores.length === 1
        ? "¡Tenemos un ganador!"
        : "¡La partida terminó en empate!";

    const descripcion = document.createElement("p");

    descripcion.textContent = ganadores.length === 1
        ? "¡Felicitaciones, " + ganadores[0].jugador.nombre + "!"
        : "Los jugadores terminaron igualados.";

    contenido.appendChild(titulo);
    contenido.appendChild(descripcion);

    resultados.forEach(resultado => {
        const linea = document.createElement("div");
        linea.className = "resultado-jugador";

        linea.textContent =
            resultado.jugador.nombre +
            " — " + resultado.recetas + " recetas, " +
            resultado.ingredientes + " ingredientes";

        contenido.appendChild(linea);
    });

    const botonCerrar = document.createElement("button");
    botonCerrar.textContent = "Cerrar partida";

    botonCerrar.addEventListener("click", () => {
        modal.remove();
    });

    contenido.appendChild(botonCerrar);
    modal.appendChild(contenido);
    document.body.appendChild(modal);
}

function finalizarPartida() {
    if (partidaFinalizada) return;

    partidaFinalizada = true;

    if (intervaloTemporizador) {
        clearInterval(intervaloTemporizador);
    }

    intervaloTemporizador = null;

    if (botonDados) {
        botonDados.disabled = true;
    }

    const resultados = jugadoresIniciales.map(jugador => {
        const recetas = jugador.propiedades.filter(indice => {
            return casilleros[indice]?.tipo === "receta";
        }).length;

        return {
            jugador,
            recetas,
            ingredientes: cantidadTotalIngredientes(jugador)
        };
    });

    const mayorCantidadRecetas = Math.max(
        ...resultados.map(resultado => resultado.recetas)
    );

    const candidatos = resultados.filter(
        resultado => resultado.recetas === mayorCantidadRecetas
    );

    const mayorCantidadIngredientes = Math.max(
        ...candidatos.map(resultado => resultado.ingredientes)
    );

    const ganadores = candidatos.filter(
        resultado => resultado.ingredientes === mayorCantidadIngredientes
    );

    if (mensaje) {
        mensaje.textContent = ganadores.length === 1
            ? "¡Ganó " + ganadores[0].jugador.nombre + "!"
            : "¡La partida terminó en empate!";
    }

    mostrarResultadoFinal(resultados, ganadores);
}


// ==========================================
// INICIO DE PANTALLAS
// ==========================================

if (pantallaInicio) pantallaInicio.classList.remove("oculta");
if (pantallaCantidad) pantallaCantidad.classList.add("oculta");
if (pantallaConfiguracion) pantallaConfiguracion.classList.add("oculta");
if (pantallaJuego) pantallaJuego.classList.add("oculta");

if (botonDados) botonDados.disabled = true;

mostrarMusicaInicial();


// ==========================================
// NAVEGACIÓN
// ==========================================

if (botonComenzar) {
    botonComenzar.addEventListener("click", () => {
        pantallaInicio?.classList.add("oculta");
        pantallaCantidad?.classList.remove("oculta");
        mostrarMusicaInicial();
    });
}

document.querySelectorAll(".opcion-cantidad").forEach(boton => {
    boton.addEventListener("click", () => {
        const cantidad = Number(boton.dataset.cantidad);

        if (![2, 3, 4].includes(cantidad)) return;

        cantidadJugadores = cantidad;

        pantallaCantidad?.classList.add("oculta");
        pantallaConfiguracion?.classList.remove("oculta");

        mostrarMusicaInicial();

        document.querySelectorAll(".campo-jugador").forEach((campo, indice) => {
            campo.classList.toggle("oculta", indice >= cantidadJugadores);
        });

        for (let i = 1; i <= 4; i++) {
            const campoNombre = document.getElementById("nombre" + i);
            if (campoNombre) campoNombre.value = "";
        }

        if (mensajeError) mensajeError.textContent = "";
    });
});

if (botonVolverInicio) {
    botonVolverInicio.addEventListener("click", () => {
        pantallaCantidad?.classList.add("oculta");
        pantallaInicio?.classList.remove("oculta");
        mostrarMusicaInicial();
    });
}

if (botonVolverCantidad) {
    botonVolverCantidad.addEventListener("click", () => {
        pantallaConfiguracion?.classList.add("oculta");
        pantallaCantidad?.classList.remove("oculta");

        if (mensajeError) mensajeError.textContent = "";

        mostrarMusicaInicial();
    });
}


// ==========================================
// COMENZAR PARTIDA
// ==========================================

if (botonIniciarPartida) {
    botonIniciarPartida.addEventListener("click", () => {
        const nuevosJugadores = [];

        for (let i = 1; i <= cantidadJugadores; i++) {
            const campoNombre = document.getElementById("nombre" + i);
            const nombre = campoNombre ? campoNombre.value.trim() : "";

            if (!nombre) {
                if (mensajeError) {
                    mensajeError.textContent =
                        "Todos los jugadores deben ingresar su nombre.";
                }
                return;
            }

            nuevosJugadores.push({
                nombre,
                color: coloresJugadores[i - 1],
                propiedades: [],
                tarjetas: [],
                ingredientes: { ...ingredientesIniciales },
                enManicomio: false,
                turnosManicomio: 0
            });
        }

        detenerTemporizador();
        partidaFinalizada = false;

        jugadorActivo = 0;
        faseDefinicionInicio = true;

        jugadoresParaTirar = jugadoresIniciales.map((jugador, indice) => indice);
        indiceTiradaInicial = 0;
        resultadosTirada = {};

        jugadoresIniciales.splice(
            0,
            jugadoresIniciales.length,
            ...nuevosJugadores
        );

        mazoCocina = mezclarCartas(cartasCocina);
        mazoEfluvios = mezclarCartas(cartasEfluvios);

        jugadoresParaTirar = jugadoresIniciales.map((jugador, indice) => indice);
        indiceTiradaInicial = 0;
        resultadosTirada = {};

        ordenTurnos = [];
        indiceTurno = 0;
        doblesConsecutivos = 0;
        ultimoLanzamientoDoble = false;

        prepararTablero();

        pantallaConfiguracion?.classList.add("oculta");
        pantallaJuego?.classList.remove("oculta");

        mostrarMusicaPartida();

        if (botonDados) {
            botonDados.disabled = false;
            botonDados.textContent = "Tirar dados para definir el inicio";
        }

        if (mensajeError) mensajeError.textContent = "";

        if (mensaje) {
            mensaje.textContent =
                "¡Vamos a definir quién empieza! Tira primero " +
                jugadoresIniciales[jugadoresParaTirar[0]].nombre + ".";
        }

        const resultado = document.getElementById("resultado-dados");

        if (resultado) {
            resultado.textContent = "Tirada para definir el orden.";
        }

        actualizarTodo();
    });
}


// ==========================================
// FUNCIONES GENERALES
// ==========================================

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function tirarDado() {
    return Math.floor(Math.random() * 6) + 1;
}

function jugadorActual() {
    return jugadoresIniciales[jugadorActivo];
}

function actualizarTodo() {
    dibujarFichas();
    dibujarJugadores();
}

function mostrarAviso(titulo, descripcion, detalle = "") {
    return mostrarTarjeta({
        titulo,
        descripcion,
        detalle,
        botones: [{ texto: "Continuar", valor: "continuar" }]
    });
}


// ==========================================
// DADOS
// ==========================================

async function obtenerResultadoDados() {
    const dado1 = document.getElementById("dado1");
    const dado2 = document.getElementById("dado2");
    const resultado = document.getElementById("resultado-dados");

    if (!dado1 || !dado2 || !resultado) {
        throw new Error("Falta dado1, dado2 o resultado-dados en el HTML.");
    }

    dado1.classList.add("rodando");
    dado2.classList.add("rodando");

    resultado.textContent = "Lanzando dados...";

    for (let i = 0; i < 8; i++) {
        dado1.textContent = tirarDado();
        dado2.textContent = tirarDado();

        await esperar(90);

        if (partidaFinalizada) return 0;
    }

    const valor1 = tirarDado();
    const valor2 = tirarDado();
    const suma = valor1 + valor2;
    ultimoLanzamientoDoble = valor1 === valor2;

    dado1.classList.remove("rodando");
    dado2.classList.remove("rodando");

    dado1.textContent = valor1;
    dado2.textContent = valor2;

    resultado.textContent = valor1 + " + " + valor2 + " = " + suma;

    return suma;
}

if (botonDados) {
    botonDados.addEventListener("click", lanzarDados);
} else {
    console.error('No se encontró el botón con id="btn-dados".');
}


// ==========================================
// LANZAR DADOS
// ==========================================

async function lanzarDados() {
    if (
        !botonDados ||
        lanzandoDados ||
        botonDados.disabled ||
        partidaFinalizada
    ) return;

    lanzandoDados = true;
    botonDados.disabled = true;

    try {
        if (!faseDefinicionInicio && jugadorActual()?.enManicomio) {
            const quedoLibre = await resolverTurnoManicomio(jugadorActual());

            if (partidaFinalizada) return;

            actualizarTodo();

            if (!quedoLibre) {
                pasarAlSiguienteJugador();
                return;
            }
        }

        const suma = await obtenerResultadoDados();

        if (partidaFinalizada) return;

        if (faseDefinicionInicio) {
            await registrarTiradaInicial(suma);
        } else {
            await realizarTurno(suma);
        }

    } catch (error) {
        console.error("Error durante el turno:", error);

        if (mensaje) {
            mensaje.textContent =
                "Ocurrió un error. Revisá la consola del navegador.";
        }

    } finally {
        lanzandoDados = false;

        if (
            botonDados &&
            pantallaJuego &&
            !pantallaJuego.classList.contains("oculta") &&
            !partidaFinalizada
        ) {
            botonDados.disabled = false;
        }
    }
}


// ==========================================
// DEFINIR ORDEN INICIAL
// ==========================================

async function registrarTiradaInicial(suma) {
    const indiceJugador = jugadoresParaTirar[indiceTiradaInicial];
    const jugador = jugadoresIniciales[indiceJugador];

    resultadosTirada[indiceJugador] = suma;

    if (mensaje) {
        mensaje.textContent = jugador.nombre + " obtuvo " + suma + " puntos.";
    }

    indiceTiradaInicial++;

    await esperar(700);

    if (partidaFinalizada) return;

    if (indiceTiradaInicial < jugadoresParaTirar.length) {
        const siguiente = jugadoresParaTirar[indiceTiradaInicial];

        if (mensaje) {
            mensaje.textContent =
                "Ahora tira " + jugadoresIniciales[siguiente].nombre + ".";
        }

        return;
    }

    resolverTiradaInicial();
}

function resolverTiradaInicial() {
    const mayor = Math.max(
        ...jugadoresParaTirar.map(indice => resultadosTirada[indice])
    );

    const empatados = jugadoresParaTirar.filter(
        indice => resultadosTirada[indice] === mayor
    );

    if (empatados.length > 1) {
        jugadoresParaTirar = empatados;
        indiceTiradaInicial = 0;
        resultadosTirada = {};

        const nombres = empatados.map(
            indice => jugadoresIniciales[indice].nombre
        );

        if (mensaje) {
            mensaje.textContent =
                "¡Hay un empate! Vuelven a tirar: " + nombres.join(" y ") + ".";
        }

        const resultado = document.getElementById("resultado-dados");

        if (resultado) {
            resultado.textContent = "Empate. Hay que volver a tirar.";
        }

        return;
    }

    definirOrdenTurnos(empatados[0]);
}

function definirOrdenTurnos(indiceGanador) {
    ordenTurnos = [];

    for (let i = 0; i < jugadoresIniciales.length; i++) {
        ordenTurnos.push(
            (indiceGanador + i) % jugadoresIniciales.length
        );
    }

    indiceTurno = 0;
    jugadorActivo = ordenTurnos[indiceTurno];

    faseDefinicionInicio = false;

    iniciarTemporizador();

    actualizarTodo();

    if (mensaje) {
        mensaje.textContent =
            "¡" + jugadoresIniciales[indiceGanador].nombre +
            " empieza la partida! Ahora puede tirar los dados.";
    }

    const resultado = document.getElementById("resultado-dados");

    if (resultado) {
        resultado.textContent = "Orden definido. ¡Comienza la partida!";
    }

    if (botonDados) {
        botonDados.textContent = "Tirar dados";
    }
}


// ==========================================
// TURNOS
// ==========================================

async function realizarTurno(suma) {
    if (partidaFinalizada) return;

    const jugador = jugadorActual();

    if (!jugador) return;

    if (ultimoLanzamientoDoble) {
        doblesConsecutivos++;

        if (doblesConsecutivos >= 3) {
            doblesConsecutivos = 0;
            await enviarAlManicomio(jugador, true);

            if (partidaFinalizada) return;

            pasarAlSiguienteJugador();
            return;
        }
    } else {
        doblesConsecutivos = 0;
    }

    if (mensaje) {
        mensaje.textContent =
            jugador.nombre + " avanza " + suma + " casilleros.";
    }

    await esperar(400);
    if (partidaFinalizada) return;

    await moverFicha(jugadorActivo, suma);
    if (partidaFinalizada) return;

    await resolverCasillero(posicionesJugadores[jugadorActivo]);
    if (partidaFinalizada) return;

    actualizarTodo();

    if (jugador.enManicomio) {
        doblesConsecutivos = 0;
        pasarAlSiguienteJugador();
        return;
    }

    if (ultimoLanzamientoDoble) {
        if (mensaje) {
            mensaje.textContent =
                "¡Sacaste doble! " + jugador.nombre +
                " vuelve a tirar los dados.";
        }

        const resultado = document.getElementById("resultado-dados");

        if (resultado) {
            resultado.textContent =
                "¡Doble! Volvés a tirar. Dobles seguidos: " +
                doblesConsecutivos + " de 3.";
        }

        return;
    }

    pasarAlSiguienteJugador();
}

function pasarAlSiguienteJugador() {
    if (partidaFinalizada || !ordenTurnos.length) return;

    doblesConsecutivos = 0;
    indiceTurno = (indiceTurno + 1) % ordenTurnos.length;
    jugadorActivo = ordenTurnos[indiceTurno];

    actualizarTodo();

    if (mensaje) {
        mensaje.textContent =
            "Turno de " + jugadoresIniciales[jugadorActivo].nombre + ".";
    }

    const resultado = document.getElementById("resultado-dados");

    if (resultado) {
        resultado.textContent = "Esperando el lanzamiento...";
    }
}


// ==========================================
// MOVIMIENTO
// ==========================================

async function moverFicha(indiceJugador, cantidad) {
    for (let i = 0; i < cantidad && !partidaFinalizada; i++) {
        posicionesJugadores[indiceJugador]++;

        if (posicionesJugadores[indiceJugador] >= casilleros.length) {
            posicionesJugadores[indiceJugador] = 0;

            if (mensaje) {
                mensaje.textContent =
                    jugadoresIniciales[indiceJugador].nombre +
                    " pasó por La Cocina y recibió 2 ingredientes distintos.";
            }

            await ganarIngredientes(2, jugadoresIniciales[indiceJugador]);

            if (partidaFinalizada) return;
        }

        dibujarFichas();

        await esperar(220);
    }
}


// ==========================================
// PROPIEDADES
// ==========================================

function buscarPropietario(indiceCasillero) {
    return jugadoresIniciales.findIndex(jugador =>
        jugador.propiedades.includes(indiceCasillero)
    );
}

function cantidadTotalIngredientes(jugador) {
    return Object.values(jugador.ingredientes).reduce(
        (total, cantidad) => total + cantidad,
        0
    );
}

function mostrarNombreIngredientes(lista) {
    return lista.map(ingrediente =>
        nombresIngredientes[ingrediente] || ingrediente
    ).join(", ");
}


// ==========================================
// COMPRAR RECETAS
// ==========================================

function ingredientesQueFaltan(jugador, receta) {
    return receta.ingredientesRequeridos.filter(
        ingrediente => (jugador.ingredientes[ingrediente] || 0) < 1
    );
}

function tieneIngredientesDeReceta(jugador, receta) {
    return ingredientesQueFaltan(jugador, receta).length === 0;
}

async function resolverReceta(indiceCasillero) {
    const receta = casilleros[indiceCasillero];
    const jugador = jugadorActual();
    const propietario = buscarPropietario(indiceCasillero);

    if (propietario === jugadorActivo) {
        await mostrarAviso(
            receta.nombre,
            "Esta receta ya es tuya. No tenés que pagar."
        );
        return;
    }

    if (propietario !== -1) {
        const dueño = jugadoresIniciales[propietario];
        const alquiler = Number(receta.alquiler) || 0;

        if (cantidadTotalIngredientes(jugador) < alquiler) {
            await mostrarAviso(
                "Ingredientes insuficientes",
                "No podés completar el pago del alquiler.",
                "Necesitás " + alquiler + " ingredientes y tenés " +
                cantidadTotalIngredientes(jugador) + "."
            );
            return;
        }

        const pagados = await pagarIngredientes(alquiler, jugador, dueño);

        if (partidaFinalizada) return;

        await mostrarAviso(
            "Pago de alquiler",
            jugador.nombre + " cayó en una receta de " + dueño.nombre + ".",
            "Entregaste " + pagados + " ingredientes."
        );

        return;
    }

    if (receta.comprable === false) {
        await mostrarAviso(
            "Receta sin ingredientes asignados",
            "Esta receta todavía no se puede comprar con los ingredientes básicos del juego.",
            "La tabla final del PDF no asigna ingredientes básicos al mes de junio."
        );
        return;
    }

    const requeridos = receta.ingredientesRequeridos || [];
    const listaRequerida = mostrarNombreIngredientes(requeridos);

    const faltantes = ingredientesQueFaltan(jugador, receta);

    if (faltantes.length > 0) {
        await mostrarAviso(
            receta.nombre,
            "Todavía no tenés todos los ingredientes necesarios para comprar esta receta.",
            "Necesitás: " + listaRequerida +
            ". Te faltan: " + mostrarNombreIngredientes(faltantes) + "."
        );
        return;
    }

    const respuesta = await mostrarTarjeta({
        titulo: receta.nombre,
        descripcion: "Tenés todos los ingredientes necesarios para preparar esta receta.",
        detalle: "Ingredientes que vas a entregar: " + listaRequerida + ".",
        botones: [
            { texto: "Comprar receta", valor: "comprar" },
            { texto: "No comprar", valor: "no" }
        ]
    });

    if (partidaFinalizada || respuesta !== "comprar") return;

    for (const ingrediente of requeridos) {
        jugador.ingredientes[ingrediente]--;
    }

    jugador.propiedades.push(indiceCasillero);

    actualizarTodo();

    await mostrarAviso(
        "¡Receta adquirida!",
        jugador.nombre + " consiguió " + receta.nombre + ".",
        "Entregaste: " + listaRequerida + "."
    );
}


// ==========================================
// COMPRAR TRANSPORTES Y SERVICIOS
// ==========================================

async function resolverPropiedad(indiceCasillero) {
    const casillero = casilleros[indiceCasillero];
    const jugador = jugadorActual();
    const propietario = buscarPropietario(indiceCasillero);

    if (propietario === -1) {
        const costo = Number(casillero.precio) || 0;

        const respuesta = await mostrarTarjeta({
            titulo: casillero.nombre,
            descripcion: "Esta propiedad todavía no tiene dueño.",
            detalle: "Costo: " + costo + " ingredientes.",
            botones: [
                { texto: "Comprar", valor: "comprar" },
                { texto: "No comprar", valor: "no" }
            ]
        });

        if (partidaFinalizada) return;

        if (respuesta === "comprar") {
            if (cantidadTotalIngredientes(jugador) < costo) {
                await mostrarAviso(
                    "Ingredientes insuficientes",
                    "No tenés suficientes ingredientes para comprar esta propiedad."
                );
                return;
            }

            const pagados = await pagarIngredientes(costo, jugador);

            if (partidaFinalizada) return;

            if (pagados === costo) {
                jugador.propiedades.push(indiceCasillero);

                await mostrarAviso(
                    "¡Propiedad adquirida!",
                    jugador.nombre + " compró " + casillero.nombre + ".",
                    "Entregaste " + pagados + " ingredientes."
                );
            }
        }

        actualizarTodo();
        return;
    }

    if (propietario === jugadorActivo) {
        await mostrarAviso(
            casillero.nombre,
            "Esta propiedad ya es tuya. No tenés que pagar."
        );
        return;
    }

    const dueño = jugadoresIniciales[propietario];
    const alquiler = Number(casillero.alquiler) || 0;

    if (cantidadTotalIngredientes(jugador) < alquiler) {
        await mostrarAviso(
            "Ingredientes insuficientes",
            "No podés completar el pago del alquiler.",
            "Necesitás " + alquiler + " ingredientes y tenés " +
            cantidadTotalIngredientes(jugador) + "."
        );
        return;
    }

    const pagados = await pagarIngredientes(alquiler, jugador, dueño);

    if (partidaFinalizada) return;

    await mostrarAviso(
        "Pago de alquiler",
        jugador.nombre + " cayó en una propiedad de " + dueño.nombre + ".",
        "Entregaste " + pagados + " ingredientes."
    );

    actualizarTodo();
}


// ==========================================
// INGREDIENTES
// ==========================================

function ingredientesDisponibles(jugador) {
    return Object.keys(jugador.ingredientes).filter(
        ingrediente => jugador.ingredientes[ingrediente] > 0
    );
}

async function elegirIngrediente(jugador, excluidos = []) {
    const disponibles = ingredientesDisponibles(jugador).filter(
        ingrediente => !excluidos.includes(ingrediente)
    );

    if (!disponibles.length) return null;

    const botones = disponibles.map(ingrediente => ({
        texto: nombresIngredientes[ingrediente] +
            " (" + jugador.ingredientes[ingrediente] + ")",
        valor: ingrediente
    }));

    return mostrarTarjeta({
        titulo: "Elegí un ingrediente",
        descripcion: "Seleccioná qué ingrediente querés entregar.",
        botones
    });
}

async function ganarIngredientes(cantidad, jugador, descripcion = "") {
    const recibidos = [];

    for (let i = 0; i < cantidad && !partidaFinalizada; i++) {
        const botones = Object.keys(ingredientesIniciales)
            .filter(ingrediente => !recibidos.includes(ingrediente))
            .map(ingrediente => ({
                texto: nombresIngredientes[ingrediente],
                valor: ingrediente
            }));

        if (!botones.length) break;

        const elegido = await mostrarTarjeta({
            titulo: "Elegí un ingrediente",
            descripcion: "La despensa te entrega un ingrediente distinto. Elegí cuál querés recibir.",
            botones
        });

        if (partidaFinalizada || !elegido) break;

        jugador.ingredientes[elegido] =
            (jugador.ingredientes[elegido] || 0) + 1;

        recibidos.push(elegido);

        actualizarTodo();
    }

    if (partidaFinalizada) return recibidos;

    await mostrarAviso(
        "Ingredientes recibidos",
        descripcion || jugador.nombre + " recibió ingredientes.",
        recibidos.length
            ? "Recibiste: " + mostrarNombreIngredientes(recibidos) + "."
            : "No recibiste ingredientes."
    );

    return recibidos;
}

async function entregarIngredientes(cantidad, jugador, destinatario = null) {
    return pagarIngredientes(cantidad, jugador, destinatario);
}

async function pagarIngredientes(cantidad, jugador, destinatario = null) {
    if (cantidadTotalIngredientes(jugador) < cantidad) {
        await mostrarAviso(
            "Ingredientes insuficientes",
            "No tenés suficientes ingredientes para realizar este pago."
        );
        return 0;
    }

    const entregados = [];

    for (let i = 0; i < cantidad && !partidaFinalizada; i++) {
        let ingrediente = await elegirIngrediente(jugador, entregados);

        if (partidaFinalizada) return entregados.length;

        if (!ingrediente) {
            ingrediente = await elegirIngrediente(jugador);
        }

        if (partidaFinalizada || !ingrediente) break;

        jugador.ingredientes[ingrediente]--;

        if (destinatario) {
            destinatario.ingredientes[ingrediente] =
                (destinatario.ingredientes[ingrediente] || 0) + 1;
        }

        entregados.push(ingrediente);

        actualizarTodo();
    }

    return entregados.length;
}


// ==========================================
// EFECTOS DE LAS CARTAS
// ==========================================

function jugadorConMenosRecetas() {
    const candidatos = jugadoresIniciales.filter(
        jugador => jugador !== jugadorActual()
    );

    if (!candidatos.length) return null;

    candidatos.sort((a, b) => a.propiedades.length - b.propiedades.length);

    return candidatos[0];
}

async function efectoDarAlMenor(jugador) {
    const destinatario = jugadorConMenosRecetas();

    if (!destinatario) return;

    const ingredientesQueLeFaltan = ingredientesDisponibles(jugador).filter(
        ingrediente => (destinatario.ingredientes[ingrediente] || 0) === 0
    );

    if (!ingredientesQueLeFaltan.length) {
        await mostrarAviso(
            "No hay ingredientes para entregar",
            destinatario.nombre + " ya tiene todos los tipos de ingredientes que tenés."
        );
        return;
    }

    const botones = ingredientesQueLeFaltan.map(ingrediente => ({
        texto: nombresIngredientes[ingrediente] +
            " (" + jugador.ingredientes[ingrediente] + ")",
        valor: ingrediente
    }));

    const elegido = await mostrarTarjeta({
        titulo: "Entrega de ingredientes",
        descripcion: "Elegí un ingrediente que todavía no tenga " +
            destinatario.nombre + ".",
        botones
    });

    if (partidaFinalizada || !elegido) return;

    jugador.ingredientes[elegido]--;
    destinatario.ingredientes[elegido]++;

    actualizarTodo();

    await mostrarAviso(
        "Entrega realizada",
        "Entregaste " + nombresIngredientes[elegido] +
        " a " + destinatario.nombre + "."
    );
}

async function efectoPerderPorPropiedades(jugador) {
    const cantidadCocinas = jugador.propiedades.filter(
        indice => casilleros[indice].tipo === "receta"
    ).length;

    const cantidadRanchos = jugador.propiedades.filter(
        indice => casilleros[indice].tipo === "servicio"
    ).length;

    const cantidad =
        cantidadCocinas + (cantidadRanchos * 2);

    if (!cantidad) {
        await mostrarAviso(
            "Sin propiedades",
            "No tenés cocinas ni ranchos y no debés entregar ingredientes."
        );
        return;
    }

    await entregarIngredientes(cantidad, jugador);
}

async function efectoIntercambio(jugador) {
    await mostrarAviso(
        "Intercambio de ingredientes",
        "Vas a entregar 1 ingrediente y recibir 2 ingredientes distintos."
    );

    if (partidaFinalizada) return;

    const entregados = await entregarIngredientes(1, jugador);

    if (partidaFinalizada || entregados === 0) return;

    await ganarIngredientes(
        2,
        jugador,
        "Recibiste 2 ingredientes distintos de la despensa."
    );
}

async function efectoCumpleanos(jugador) {
    const recibidos = [];

    for (const otroJugador of jugadoresIniciales) {
        if (partidaFinalizada) return;

        if (otroJugador === jugador) continue;

        const disponibles = Object.keys(otroJugador.ingredientes).filter(
            ingrediente =>
                otroJugador.ingredientes[ingrediente] > 0 &&
                (jugador.ingredientes[ingrediente] || 0) === 0 &&
                !recibidos.includes(ingrediente)
        );

        if (!disponibles.length) continue;

        const botones = disponibles.map(ingrediente => ({
            texto: nombresIngredientes[ingrediente] +
                " (" + otroJugador.ingredientes[ingrediente] + ")",
            valor: ingrediente
        }));

        const elegido = await mostrarTarjeta({
            titulo: "Regalo de cumpleaños",
            descripcion: otroJugador.nombre +
                " debe entregarte un ingrediente que todavía no tengas.",
            botones
        });

        if (partidaFinalizada) return;

        if (elegido) {
            otroJugador.ingredientes[elegido]--;
            jugador.ingredientes[elegido]++;
            recibidos.push(elegido);
        }

        actualizarTodo();
    }

    if (partidaFinalizada) return;

    await mostrarAviso(
        "¡Feliz cumpleaños!",
        "Terminó el reparto de ingredientes.",
        recibidos.length
            ? "Recibiste: " + mostrarNombreIngredientes(recibidos) + "."
            : "No recibiste ingredientes en esta ocasión."
    );
}


// ==========================================
// MANICOMIO
// ==========================================

async function enviarAlManicomio(jugador, porDobles = false) {
    jugador.enManicomio = true;
    jugador.turnosManicomio = 0;

    posicionesJugadores[jugadorActivo] = 11;

    actualizarTodo();

    await mostrarAviso(
        porDobles ? "¡Te descubrieron haciendo trampa!" : "¡Al manicomio!",
        porDobles
            ? jugador.nombre + " sacó tres dobles consecutivos y fue enviado al manicomio."
            : jugador.nombre + " debe ir directamente al manicomio.",
        "No avanzás en la tercera tirada y debés cumplir dos turnos detenidos."
    );
}

async function efectoSalirManicomio(jugador) {
    if (!jugador.tarjetas.includes("salirManicomio")) {
        jugador.tarjetas.push("salirManicomio");
    }

    await mostrarAviso(
        "Carta de liberación",
        "Conservás esta carta para salir gratis del manicomio.",
        "Podés utilizarla cuando te toque cumplir una condena."
    );

    actualizarTodo();
}


// ==========================================
// EFECTOS DE MOVIMIENTO DE CARTAS
// ==========================================

async function efectoGalope() {
    const posicionActual = posicionesJugadores[jugadorActivo];

    const destinos = casilleros
        .map((casillero, indice) => ({ casillero, indice }))
        .filter(item =>
            item.casillero.tipo === "transporte" &&
            item.indice > posicionActual
        );

    let destino = destinos.length
        ? destinos[0].indice
        : casilleros.findIndex(
            casillero => casillero.tipo === "transporte"
        );

    if (destino === -1) return;

    if (destino < posicionActual) {
        await ganarIngredientes(2, jugadorActual());

        if (partidaFinalizada) return;
    }

    await mostrarAviso(
        "¡A todo galope!",
        "Avanzás hasta la siguiente casilla de Vuelta en caballo."
    );

    if (partidaFinalizada) return;

    posicionesJugadores[jugadorActivo] = destino;

    actualizarTodo();

    await resolverCasillero(destino);
}

async function efectoIrInicio(jugador) {
    posicionesJugadores[jugadorActivo] = 0;

    actualizarTodo();

    await mostrarAviso(
        "Banquete de fósforos",
        "Avanzás directamente a La Cocina y recibís 2 ingredientes distintos."
    );

    if (partidaFinalizada) return;

    await ganarIngredientes(2, jugador);
}

async function aplicarEfectoCarta(carta, jugador) {
    if (partidaFinalizada) return;

    switch (carta.efecto) {
        case "ingredientes":
            await ganarIngredientes(carta.cantidad || 1, jugador);
            break;

        case "perderIngredientes":
            await entregarIngredientes(carta.cantidad || 1, jugador);
            break;

        case "darAlMenor":
            await efectoDarAlMenor(jugador);
            break;

        case "perderPorPropiedades":
            await efectoPerderPorPropiedades(jugador);
            break;

        case "intercambio":
            await efectoIntercambio(jugador);
            break;

        case "cumpleanos":
            await efectoCumpleanos(jugador);
            break;

        case "manicomio":
            await enviarAlManicomio(jugador);
            break;

        case "salirManicomio":
            await efectoSalirManicomio(jugador);
            break;

        case "galope":
            await efectoGalope();
            break;

        case "irInicio":
            await efectoIrInicio(jugador);
            break;

        default:
            await mostrarAviso(
                "Carta sin efecto",
                "Esta carta todavía no tiene un efecto programado."
            );
    }
}


// ==========================================
// ROBAR CARTAS
// ==========================================

async function robarCarta(tipoMazo) {
    let mazo;
    let cartasOriginales;
    let nombreMazo;

    if (tipoMazo === "comunidad") {
        mazo = mazoCocina;
        cartasOriginales = cartasCocina;
        nombreMazo = "La cocina del rancho";
    } else {
        mazo = mazoEfluvios;
        cartasOriginales = cartasEfluvios;
        nombreMazo = "Efluvios y pasiones";
    }

    if (!mazo.length) {
        mazo = mezclarCartas(cartasOriginales);
    }

    const carta = mazo.pop();

    if (tipoMazo === "comunidad") {
        mazoCocina = mazo;
    } else {
        mazoEfluvios = mazo;
    }

    await mostrarTarjeta({
        titulo: nombreMazo,
        descripcion: "Sacaste una carta del mazo.",
        detalle: carta.titulo + ": " + carta.descripcion,
        botones: [{ texto: "Ver efecto", valor: "continuar" }]
    });

    if (partidaFinalizada) return;

    await aplicarEfectoCarta(carta, jugadorActual());
}


// ==========================================
// RESOLVER CASILLERO
// ==========================================

async function resolverCasillero(indice) {
    if (partidaFinalizada) return;

    const casillero = casilleros[indice];
    const jugador = jugadorActual();

    if (!casillero || !jugador) return;

    if (mensaje) {
        mensaje.textContent =
            jugador.nombre + " cayó en " + casillero.nombre + ".";
    }

    switch (casillero.tipo) {
        case "especial":
            await mostrarAviso(
                casillero.nombre,
                casillero.descripcion ||
                "Este casillero no tiene un efecto especial."
            );
            break;

        case "receta":
            await resolverReceta(indice);
            break;

        case "transporte":
        case "servicio":
            await resolverPropiedad(indice);
            break;

        case "comunidad":
            await robarCarta("comunidad");
            break;

        case "fortuna":
            await robarCarta("fortuna");
            break;

        case "impuesto": {
            const costo = Number(casillero.costo) || 1;
            const total = cantidadTotalIngredientes(jugador);

            if (total < costo) {
                await mostrarAviso(
                    "Ingredientes insuficientes",
                    "No tenés suficientes ingredientes para pagar el impuesto.",
                    "Necesitás " + costo + " y tenés " + total + "."
                );
            } else {
                const pagados = await pagarIngredientes(costo, jugador);

                if (partidaFinalizada) return;

                await mostrarAviso(
                    "Pago de impuestos",
                    "Entregaste " + pagados +
                    " ingredientes a la despensa central."
                );
            }

            break;
        }

        case "ingredientes":
            await ganarIngredientes(
                1,
                jugador,
                "¡Encontraste un ingrediente en el camino!"
            );
            break;

        case "carcel":
            await mostrarAviso(
                "De visita en el manicomio",
                "Estás de visita. No tenés que cumplir ninguna condena."
            );
            break;

        case "ir-carcel":
            await enviarAlManicomio(jugador);
            break;

        case "pendiente":
            await mostrarAviso(
                casillero.nombre,
                "Este casillero todavía no tiene una función asignada."
            );
            break;

        default:
            await mostrarAviso(
                casillero.nombre,
                "Este casillero todavía no tiene un efecto programado."
            );
    }

    if (!partidaFinalizada) {
        actualizarTodo();
    }
}


// ==========================================
// TURNOS EN EL MANICOMIO
// ==========================================

async function resolverTurnoManicomio(jugador) {
    if (partidaFinalizada) return false;

    const tieneCarta = jugador.tarjetas.includes("salirManicomio");

    const botones = [
        {
            texto: "Cumplir turno detenido",
            valor: "esperar"
        }
    ];

    if (tieneCarta) {
        botones.unshift({
            texto: "Usar carta y salir",
            valor: "carta"
        });
    }

    const respuesta = await mostrarTarjeta({
        titulo: "Estás en el manicomio",
        descripcion: "Durante este turno no podés tirar los dados ni avanzar.",
        detalle: tieneCarta
            ? "Podés utilizar tu carta de liberación o cumplir el turno detenido."
            : "Debés cumplir dos turnos detenidos. Turnos cumplidos: " +
              jugador.turnosManicomio + " de 2.",
        botones
    });

    if (partidaFinalizada) return false;

    if (respuesta === "carta") {
        const indiceCarta = jugador.tarjetas.indexOf("salirManicomio");

        if (indiceCarta !== -1) {
            jugador.tarjetas.splice(indiceCarta, 1);
        }

        jugador.enManicomio = false;
        jugador.turnosManicomio = 0;

        actualizarTodo();

        await mostrarAviso(
            "¡Saliste del manicomio!",
            "Utilizaste tu carta de liberación.",
            "Podés jugar normalmente durante este turno."
        );

        return !partidaFinalizada;
    }

    jugador.turnosManicomio++;

    if (jugador.turnosManicomio >= 2) {
        jugador.enManicomio = false;
        jugador.turnosManicomio = 0;

        actualizarTodo();

        await mostrarAviso(
            "Condena cumplida",
            jugador.nombre + " ya cumplió sus dos turnos detenidos.",
            "Quedaste libre. Vas a poder tirar los dados en tu próximo turno."
        );
    } else {
        actualizarTodo();

        await mostrarAviso(
            "Turno detenido",
            jugador.nombre + " sigue en el manicomio.",
            "Cumpliste 1 de los 2 turnos. Todavía te queda uno."
        );
    }

    return false;
}