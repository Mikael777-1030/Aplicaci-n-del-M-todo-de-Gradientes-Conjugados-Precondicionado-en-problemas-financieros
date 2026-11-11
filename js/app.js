// Definición de los tres escenarios financieros (Ingeniería de Sistemas - n = 4)
const escenarios = {
    ideal: {
        A: [
            [4, -1, 0, 0],
            [-1, 4, -1, 0],
            [0, -1, 4, -1],
            [0, 0, -1, 4]
        ],
        b: [1000, 2000, 3000, 4000]
    },
    estres: {
        A: [
            [4.5, -1.2, -0.1, 0],
            [-1.2, 4.5, -1.2, -0.1],
            [-0.1, -1.2, 4.5, -1.2],
            [0, -0.1, -1.2, 4.5]
        ],
        b: [1250, 2400, 3600, 4800]
    },
    malcondicionado: {
        A: [
            [10, -9, 0, 0],
            [-9, 10, -9, 0],
            [0, -9, 10, -9],
            [0, 0, -9, 10]
        ],
        b: [1000, 1000, 1000, 1000]
    }
};

// Inicializar la interfaz al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarEscenario('ideal');
});

// Función para cargar los escenarios en los inputs HTML
function cargarEscenario(nombre) {
    const esc = escenarios[nombre];
    const contenedorA = document.getElementById("matriz-a-inputs");
    const contenedorB = document.getElementById("vector-b-inputs");
    
    contenedorA.innerHTML = "";
    contenedorB.innerHTML = "";

    // Llenar Matriz A (4x4)
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let input = document.createElement("input");
            input.type = "number";
            input.step = "any";
            input.value = esc.A[i][j];
            input.className = "w-full p-2 border border-gray-300 rounded text-center text-sm font-mono";
            input.id = `a_${i}_${j}`;
            contenedorA.appendChild(input);
        }
    }

    // Llenar Vector b (4x1)
    for (let i = 0; i < 4; i++) {
        let input = document.createElement("input");
        input.type = "number";
        input.step = "any";
        input.value = esc.b[i];
        input.className = "w-full p-2 border border-gray-300 rounded text-center text-sm font-mono";
        input.id = `b_${i}`;
        contenedorB.appendChild(input);
    }
}

// Función principal para leer datos, validar y ejecutar los cálculos numéricos
function ejecutarCalculos() {
    try {
        let A = [];
        let b = [];

        // Leer Matriz A desde los inputs
        for (let i = 0; i < 4; i++) {
            let row = [];
            for (let j = 0; j < 4; j++) {
                row.push(parseFloat(document.getElementById(`a_${i}_${j}`).value));
            }
            A.push(row);
        }

        // Leer Vector b desde los inputs
        for (let i = 0; i < 4; i++) {
            b.push(parseFloat(document.getElementById(`b_${i}`).value));
        }

        // Validaciones requeridas (Simetría y Definida Positiva)
        if (!esSimetrica(A)) {
            alert("Error de validación (QA): La matriz A no es simétrica (A ≠ A^T).");
            return;
        }
        if (!esDefinidaPositiva(A)) {
            alert("Error de validación (QA): La matriz A no es definida positiva (Sylvester ≤ 0).");
            return;
        }

        // Cálculos numéricos
        let x_ref = solucionReferenciaCholesky(A, b);
        let gcp = gradientesConjugadosPrecondicionado(A, b, 1e-6);
        let gcSimple = gradientesConjugadosSimple(A, b, 1e-6);

        // Mostrar resultados en la sección correspondiente
        const seccionResultados = document.getElementById("resultados");
        const output = document.getElementById("output-resultados");
        seccionResultados.classList.remove("hidden");

        let html = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-4 rounded-lg border">
                    <h3 class="font-bold text-blue-900 mb-2">Solución Numérica de Referencia (Cholesky):</h3>
                    <p class="font-mono text-sm">[${x_ref.map(v => v.toFixed(4)).join(", ")}]</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border">
                    <h3 class="font-bold text-blue-900 mb-2">Solución GCP (Suñagua, 2020):</h3>
                    <p class="font-mono text-sm">[${gcp.solucion.map(v => v.toFixed(4)).join(", ")}]</p>
                    <p class="text-xs text-gray-500 mt-1">Iteraciones GCP: <strong>${gcp.iteraciones}</strong> | Residuo Relativo: <strong>${gcp.residuoRelativo.toExponential(4)}</strong></p>
                    <p class="text-xs text-gray-500">Iteraciones GC Simple (sin precondicionar): <strong>${gcSimple.iteraciones}</strong></p>
                </div>
            </div>
            
            <h3 class="font-bold text-blue-900 mt-6 mb-2">Análisis de Errores por Variable ($i = 1, \dots, 4$):</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-blue-50 border-b">
                            <th class="p-2 font-semibold">Variable</th>
                            <th class="p-2 font-semibold">Ref. ($x_{\text{ref}}$)</th>
                            <th class="p-2 font-semibold">GCP ($x_{\text{GCP}}$)</th>
                            <th class="p-2 font-semibold">Error Absoluto ($E_{a}$)</th>
                            <th class="p-2 font-semibold">Error Porcentual ($E_{p}$)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y text-sm font-mono">
        `;

        for (let i = 0; i < 4; i++) {
            let ea = Math.abs(x_ref[i] - gcp.solucion[i]);
            let ep = x_ref[i] !== 0 ? (ea / Math.abs(x_ref[i])) * 100 : 0;
            html += `
                <tr>
                    <td class="p-2 font-bold">x_${i+1}</td>
                    <td class="p-2">${x_ref[i].toFixed(4)}</td>
                    <td class="p-2">${gcp.solucion[i].toFixed(4)}</td>
                    <td class="p-2">${ea.toExponential(4)}</td>
                    <td class="p-2">${ep.toFixed(6)}%</td>
                </tr>
            `;
        }

        html += `
                    </tbody>
                </table>
            </div>
        `;

        output.innerHTML = html;
        seccionResultados.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        alert("Error en la ejecución numérica: " + error.message);
    }
}