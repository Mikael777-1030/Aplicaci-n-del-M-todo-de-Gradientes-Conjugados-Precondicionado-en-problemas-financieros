// ==========================================
// MÓDULO DE ÁLGEBRA LINEAL Y VALIDACIONES
// ==========================================

// 1. Multiplicación de Matriz por Vector (A * x)
function multiplicarMatrizVector(A, x) {
    const n = A.length;
    let resultado = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            resultado[i] += A[i][j] * x[j];
        }
    }
    return resultado;
}

// 2. Norma L2 de un vector (||v||_2)
function normaL2(v) {
    let suma = v.reduce((acc, val) => acc + val * val, 0);
    return Math.sqrt(suma);
}

// 3. Producto punto entre dos vectores
function productoPunto(u, v) {
    return u.reduce((acc, val, i) => acc + val * v[i], 0);
}

// 4. Verificación de Simetría (A = A^T)
function esSimetrica(A) {
    const n = A.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (Math.abs(A[i][j] - A[j][i]) > 1e-6) return false;
        }
    }
    return true;
}

// 5. Determinante de una matriz (para menor principales / Sylvester)
function determinante(M) {
    const n = M.length;
    if (n === 1) return M[0][0];
    if (n === 2) return M[0][0] * M[1][1] - M[0][1] * M[1][0];
    
    let det = 0;
    for (let c = 0; c < n; c++) {
        let subM = M.slice(1).map(row => row.filter((_, colIndex) => colIndex !== c));
        det += Math.pow(-1, c) * M[0][c] * determinante(subM);
    }
    return det;
}

// 6. Criterio de Sylvester para verificar si es definida positiva[cite: 3]
function esDefinidaPositiva(A) {
    if (!esSimetrica(A)) return false;
    const n = A.length;
    for (let k = 1; k <= n; k++) {
        // Extraer submatriz principal de k x k
        let subMatriz = A.slice(0, k).map(row => row.slice(0, k));
        if (determinante(subMatriz) <= 0) return false;
    }
    return true;
}