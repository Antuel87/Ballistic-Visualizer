# Ballistic Visualizer como PWA

Esta carpeta es la app completa. Para instalarla, tiene que estar servida por **https** (o desde `localhost` para probar).

## Publicarla gratis (elegí una)

**GitHub Pages**
1. Creá un repositorio, por ejemplo `ballistic-visualizer`.
2. Subí todo el contenido de esta carpeta a la raíz del repo.
3. En el repo: Settings → Pages → Source: "Deploy from a branch" → rama `main`, carpeta `/ (root)`.
4. En un minuto queda en `https://TU-USUARIO.github.io/ballistic-visualizer/`.

**Netlify Drop**
1. Entrá a https://app.netlify.com/drop
2. Arrastrá esta carpeta. Te da una dirección https al instante.

## Instalarla
- **Android / Chrome / Edge (PC):** abrí la dirección y tocá **Install** en la barra de la app (o el ícono de instalar del navegador).
- **iPhone / iPad:** abrila en Safari → Compartir → **Agregar a pantalla de inicio**.

## Probarla en tu PC sin publicar
```
cd ballistic-pwa
python3 -m http.server 8000
```
y abrí `http://localhost:8000`.

## Actualizar la app más adelante
1. Reemplazá `index.html` por la versión nueva.
2. En `sw.js`, cambiá el número de `VERSION` (por ejemplo `bv-2026-10-22-2`).
3. Volvé a subir. Las apps instaladas muestran "A new version is ready" con un botón **Reload**.

## Notas
- Funciona sin conexión después de la primera visita. Las fuentes se guardan la primera vez que hay internet; mientras tanto se usa una tipográfica del sistema.
- Tus impactos y ajustes se guardan en el dispositivo (no se sincronizan entre teléfono y PC). Para pasarlos de uno a otro usá Calibration → Hits file → Export / Import.
- Cada dirección (dominio) tiene su propio almacenamiento: si cambiás de hosting, exportá los impactos antes.
