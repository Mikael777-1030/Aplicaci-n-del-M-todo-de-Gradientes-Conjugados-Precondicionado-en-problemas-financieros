// ==========================================
// MÓDULO DE MÉTODOS NUMÉRICOS (SOLVERS)
// ==========================================

// 1. Resolución de Sistema Triangular Inferior (L * y = b)
function resolverTriangularInferior(L, b) {
    const n = b.length;
    let y = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        let suma = 0;
        for (let j = 0; j < i; j++) {
            suma += L[i][j] * y[j];
        }
        y[i] = (b[i] - suma) / L[i][i];
    }
    return y;
}

// 2. Resolución de Sistema Triangular Superior (L^T * x = y)
function resolverTriangularSuperior(Lt, y) {
    const n = y.length;
    let x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        let suma = 0;
        for (let j = i + 1; j < n; j++) {
            suma += Lt[i][j] * x[j];
        }
        x[i] = (y[i] - suma) / Lt[i][i];
    }
    return x;
}

// 3. Solución de Referencia por Descomposición de Cholesky (A = L * L^T)
function solucionReferenciaCholesky(A, b) {
    const n = A.length;
    let L = Array.from({ length: n }, () => new Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j <= i; j++) {
            let suma = 0;
            for (let k = 0; k < j; k++) {
                suma += L[i][k] * L[j][k];
            }
            if (i === j) {
                let val = A[i][i] - suma;
                if (val <= 0) throw new Error("La matriz no es definida positiva.");
                L[i][j] = Math.sqrt(val);
            } else {
                L[i][j] = (A[i][j] - suma) / L[j][j];
            }
        }
    }

    // Resolver L * y = b y luego L^T * x = y
    let y = resolverTriangularInferior(L, b);
    let Lt = L.map((row, i) => L.map((_, j) => L[j][i])); // Transpuesta de L
    let x = resolverTriangularSuperior(Lt, y);
    return x;
}

// 4. Algoritmo de Gradientes Conjugados Precondicionado (GCP) - Suñagua (2020)
function gradientesConjugadosPrecondicionado(A, b, tol = 1e-6, maxIter = 1000) {
    const n = b.length;
    let x = new Array(n).fill(0); // Vector inicial x0 = 0[cite: 3]
    let r = [...b];                // r0 = b - A*x0 -> r0 = b[cite: 3]
    
    let normB = normaL2(b);
    if (normB === 0) return { solucion: x, iteraciones: 0, residuoRelativo: 0 };

    // Precondicionador de Jacobi (Diagonal de A)[cite: 3]
    let M_inv = A.map((row, i) => 1 / row[i]); 

    let z = r.map((ri, i) => ri * M_inv[i]); // M*z = r[cite: 3]
    let p = [...z];
    
    let iter = 0;
    let residuoRelativo = normaL2(r) / normB;

    while (residuoRelativo > tol && iter < maxIter) {
        let Ap = multiplicarMatrizVector(A, p);
        let rz_old = productoPunto(r, z);
        let alpha = rz_old / productoPunto(p, Ap);

        for (let i = 0; i < n; i++) {
            x[i] += alpha * p[i];
            r[i] -= alpha * Ap[i];
        }

        z = r.map((ri, i) => ri * M_inv[i]);
        let rz_new = productoPunto(r, z);
        let beta = rz_new / rz_old;

        for (let i = 0; i < n; i++) {
            p[i] = z[i] + beta * p[i];
        }

        residuoRelativo = normaL2(r) / normB;
        iter++;
    }

    return { solucion: x, iteraciones: iter, residuoRelativo: residuoRelativo };
}

// 5. Gradientes Conjugados Simple (GC sin precondicionar - para contraste)[cite: 3]
function gradientesConjugadosSimple(A, b, tol = 1e-6, maxIter = 1000) {
    const n = b.length;
    let x = new Array(n).fill(0);
    let r = [...b];
    let p = [...r];
    
    let normB = normaL2(b);
    if (normB === 0) return { iteraciones: 0 };

    let iter = 0;
    let residuoRelativo = normaL2(r) / normB;

    while (residuoRelativo > tol && iter < maxIter) {
        let Ap = multiplicarMatrizVector(A, p);
        let rr_old = productoPunto(r, r);
        let alpha = rr_old / productoPunto(p, Ap);

        for (let i = 0; i < n; i++) {
            x[i] += alpha * p[i];
            r[i] -= alpha * Ap[i];
        }

        let rr_new = productoPunto(r, r);
        let beta = rr_new / rr_old;

        for (let i = 0; i < n; i++) {
            p[i] = r[i] + beta * p[i];
        }

        residuoRelativo = normaL2(r) / normB;
        iter++;
    }

    return { iteraciones: iter };
}