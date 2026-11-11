# Desafío Académico de Métodos Numéricos: GCP en Finanzas

**Estudiante:** Brandon Mikael Quiñones Rosales
**Carrera:** Ingeniería de Sistemas — Universidad Mayor de San Andrés (UMSA)
**Mención:** Ingeniería de Sistemas
**Área:** Finanzas / Investigación de Operaciones  

---

## 📌 Descripción del Proyecto
Este proyecto consiste en una aplicación web interactiva desarrollada para modelar y resolver un sistema lineal de ecuaciones ($Ax = b, n \ge 4$) aplicado a la **planificación financiera y distribución de recursos presupuestarios interdepartamentales**. 

La aplicación implementa el **Método de Gradientes Conjugados Precondicionado (GCP)** basado en la investigación de *Porfirio Suñagua S. (Revista Boliviana de Matemática - UMSA, 2020)*, evaluando su velocidad de convergencia, número de condición y precisión a través de tres escenarios financieros (Ideal, Bajo Estrés Financiero y Mal Condicionado), en comparación directa con un método de resolución directo (Factorización de Cholesky) y el Gradiente Conjugado simple.

---

## 💡 Modelo Financiero (Ingeniería de Sistemas)
El sistema modela la asignación de un presupuesto anual de **$100,000 USD** entre 4 unidades organizacionales ($n = 4$):
1. **$x_1$:** Unidad de Investigación y Desarrollo (I+D / Innovación Tecnológica).
2. **$x_2$:** Unidad de Infraestructura y Redes (Soporte Operativo).
3. **$x_3$:** Unidad de Marketing y Expansión Comercial.
4. **$x_4$:** Unidad de Gestión de Talento Humano y Capacitación.

### Restricciones Matemáticas
* **Matriz $A$ ($4 \times 4$):** Cuadrada, simétrica ($A = A^T$) y definida positiva ($x^T A x > 0$).
* **Vector $b$ ($4 \times 1$):** Demandas mínimas de capital de cada unidad.
* **Tolerancia:** $\frac{\Vert{}r_k\Vert{}_2}{\Vert{}b\Vert{}_2} < 10^{-6}$.

---

## 🚀 Arquitectura y Tecnologías
* **Frontend:** HTML5, Tailwind CSS (vía CDN para diseño limpio y responsivo) y JavaScript (ES6+).
* **Motor Matemático Nativo (`js/matrix.js` & `js/solvers.js`):**
  * Validación de simetría ($A = A^T$) y Criterio de Sylvester para matrices definidas positivas.
  * Solución de Referencia mediante Descomposición de Cholesky ($A = LL^T$).
  * Algoritmo GCP de Suñagua (2020) con precondicionador de Jacobi (diagonal).
  * Gradiente Conjugado simple para contraste de convergencia[cite: 3].
  * Cálculo dinámico de errores absolutos ($E_a$), relativos y porcentuales ($E_p$) por variable.
* **Módulo QA (`js/app.js`):** Integración de pruebas de software automatizadas (carga de escenarios, captura de matrices no válidas, recálculo dinámico y comparativa de precondicionamiento).

---

## 📂 Estructura del Repositorio
```text
desafio-metodos-numericos/
├── index.html          # Interfaz web principal con los 10 módulos obligatorios
├── js/
│   ├── matrix.js       # Validaciones matemáticas (Simetría, Sylvester, Operaciones matriciales)
│   ├── solvers.js      # Solvers numéricos (Cholesky, GCP Suñagua 2020, GC Simple)
│   └── app.js          # Lógica interactiva, carga de escenarios y renderizado del DOM
└── README.md           # Documentación técnica y guía de instalación
