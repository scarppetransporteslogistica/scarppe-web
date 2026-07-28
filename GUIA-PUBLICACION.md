# Guía paso a paso para publicar la web de Scarppe

Esta guía asume que nunca publicaste un sitio web antes. Vas a necesitar
una computadora, el archivo `scarppe-web.zip` que te entregué, y unos 30-40
minutos. No hace falta saber programar ni usar la terminal: todo se hace
haciendo clic.

Vas a usar dos herramientas gratuitas:

- **GitHub Desktop**: para guardar el código del sitio en un repositorio (una especie de "carpeta en la nube" de tu código).
- **Render**: el hosting donde el sitio va a vivir online, las 24 horas.

---

## Paso 0 — Descomprimir el proyecto

Descomprimí `scarppe-web.zip` en tu computadora (doble clic, o clic derecho →
"Extraer todo"). Vas a tener una carpeta llamada `scarppe-web` con todo el
código adentro. No borres ni muevas nada de adentro.

---

## Paso 1 — Crear una cuenta de GitHub

1. Andá a [github.com](https://github.com) y hacé clic en **Sign up**.
2. Completá con tu e-mail, una contraseña y un nombre de usuario. Seguí los
   pasos (te van a pedir verificar el e-mail).
3. Con eso ya tenés cuenta. No hace falta configurar nada más ahí por ahora.

---

## Paso 2 — Instalar GitHub Desktop

Usamos esta app (no la terminal) porque subir el proyecto por la web de
GitHub tiene un límite de 100 archivos por vez, y el sitio tiene más de 100.
GitHub Desktop no tiene ese límite y es simplemente hacer clic en botones.

1. Andá a [desktop.github.com](https://desktop.github.com) y descargala
   (detecta automáticamente si tenés Windows o Mac).
2. Instalala y abrila.
3. Te va a pedir iniciar sesión con la cuenta de GitHub que creaste en el
   Paso 1. Iniciá sesión.

---

## Paso 3 — Subir el proyecto a GitHub con la app

1. En GitHub Desktop, andá al menú **File → Add local repository...**
2. Hacé clic en **Choose...** y seleccioná la carpeta `scarppe-web` que
   descomprimiste en el Paso 0.
3. Te va a aparecer un aviso tipo *"This directory does not appear to be a
   Git repository"*. Hacé clic en **create a repository** (es un link
   dentro del mismo mensaje).
4. En la pantalla de creación, dejá el nombre `scarppe-web` y hacé clic en
   **Create Repository**.
5. Ahora vas a ver una lista larga de archivos (es todo el código). Abajo a
   la izquierda escribí en "Summary" algo como `Primera versión del sitio` y
   hacé clic en **Commit to main**.
6. Arriba a la derecha vas a ver un botón que dice **Publish repository**.
   Hacé clic ahí.
7. Te va a preguntar el nombre (dejalo `scarppe-web`) y si querés que sea
   **privado** — marcá la casilla **Keep this code private** (recomendado,
   así nadie más ve el código) y hacé clic en **Publish Repository**.

Listo, el código ya está en tu cuenta de GitHub. Podés verificarlo entrando
a `github.com/TU-USUARIO/scarppe-web` desde el navegador.

---

## Paso 4 — Crear una cuenta en Render

1. Andá a [render.com](https://render.com) y hacé clic en **Get Started** o
   **Sign Up**.
2. Elegí **Sign up with GitHub** (más simple: usa la misma cuenta que ya
   creaste, no necesitás otra contraseña).
3. Autorizá el acceso cuando te lo pida.

---

## Paso 5 — Crear el "Web Service" en Render

1. En el Dashboard de Render, hacé clic en el botón **+ New** (arriba a la
   derecha) y elegí **Web Service**.
2. Te va a mostrar tus repositorios de GitHub. Si no aparece `scarppe-web`,
   hacé clic en **Configure account** para darle permiso a Render de verlo,
   y volvé.
3. Buscá `scarppe-web` en la lista y hacé clic en **Connect**.
4. Completá el formulario:
   - **Name**: `scarppe-web` (o el nombre que quieras, será parte de la URL temporal).
   - **Region**: la más cercana disponible (por ejemplo Ohio o Virginia; no hay región en Sudamérica, cualquiera anda bien).
   - **Branch**: `main`.
   - **Runtime**: `Node`.
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: elegí **Starter** (es un plan pago, ~USD 7/mes). El
     plan gratuito **no permite** disco persistente, que es imprescindible
     para este sitio (si no, se perderían los cambios del panel de admin en
     cada reinicio).
5. Todavía no hagas clic en crear — seguí al Paso 6 para agregar el disco y
   las variables de entorno primero (está todo en la misma pantalla, más
   abajo, bajo **Advanced**).

---

## Paso 6 — Agregar el disco persistente

Esto es lo que hace que el contenido que edites desde `/admin` (y las fotos
que subas) no se borre nunca.

1. En la misma pantalla de creación, buscá la sección **Disks** (puede estar
   dentro de "Advanced").
2. Hacé clic en **Add Disk**.
3. Completá:
   - **Name**: `scarppe-data`
   - **Mount Path**: `/opt/render/project/src/render-data`
   - **Size**: 1 GB alcanza de sobra para empezar.
4. Confirmá.

---

## Paso 7 — Configurar las variables de entorno

En la misma pantalla, en la sección **Environment Variables**, agregá estas
dos (clic en **+ Add Environment Variable** por cada una):

| Key | Value |
|---|---|
| `ADMIN_PASSWORD` | Una contraseña nueva y segura que vos elijas (no uses `scarppe2026`, esa es solo de prueba) |
| `ADMIN_SECRET` | Cualquier texto largo random, por ejemplo `sk9x-scarppe-2026-secreto-xyz123` |

Guardalas bien en un lugar seguro (un gestor de contraseñas o una nota
privada): son las que vas a usar para entrar a `/admin`.

---

## Paso 8 — Crear el servicio

Ahora sí, al final de la página hacé clic en **Create Web Service** (o
**Deploy Web Service**). Render va a empezar a instalar y compilar el sitio.
Esto tarda entre 3 y 8 minutos la primera vez. Vas a ver los logs corriendo
en pantalla — cuando diga algo como `Your service is live`, ya está.

Vas a tener una URL temporal tipo `https://scarppe-web.onrender.com`. Abrila
y confirmá que el sitio carga bien.

---

## Paso 9 — Conectar tu dominio propio (si ya tenés uno, ej. scarppe.com.uy)

Si todavía no compraste un dominio, podés omitir este paso por ahora y usar
la URL de Render mientras tanto.

1. En el servicio dentro de Render, andá a **Settings** → sección
   **Custom Domains** → **+ Add Custom Domain**.
2. Escribí tu dominio (ej. `www.scarppe.com.uy`) y confirmá.
3. Render te va a mostrar qué registro DNS tenés que cargar (normalmente un
   **CNAME** apuntando a tu URL de Render, o un registro **A** si es el
   dominio raíz sin `www`).
4. Entrá al panel de tu proveedor de dominio (donde lo compraste: ej.
   Antel, GoDaddy, Namecheap) y cargá ese registro en la sección de DNS.
5. Puede tardar unas horas en propagarse. Volvé a Render y hacé clic en
   **Verify** junto al dominio cuando quieras chequear si ya está listo.

---

## Paso 10 — Entrar al panel de administración y dejar todo listo

1. Andá a `tu-sitio.com/admin` (o `https://scarppe-web.onrender.com/admin`
   si todavía no conectaste el dominio).
2. Iniciá sesión con la contraseña que pusiste en `ADMIN_PASSWORD` (Paso 7).
3. En **Formularios**, pegá tu access key gratuita de
   [web3forms.com](https://web3forms.com) (creá la cuenta ahí, es gratis,
   te da una clave) — sin esto, el formulario de cotización y el de
   currículum no envían el mail todavía.
4. En **General**, **Empresa** y **Servicios**, reemplazá las fotos de
   ejemplo por fotos reales de la flota y las operaciones.
5. Revisá los textos de **Contacto** (teléfonos) y confirmá que estén bien.

---

## Paso 11 — Probar todo antes de anunciarlo

- Enviá una cotización de prueba desde `/contacto` y confirmá que llegue el
  mail.
- Enviá un currículum de prueba desde `/trabaja-con-nosotros`.
- Mirá el sitio desde el celular (la mayoría de las visitas van a ser desde
  ahí).
- Probá los 6 links del menú.

---

## ¿Y si algo sale mal?

- **El sitio no carga / error al compilar**: en Render, andá a la pestaña
  **Logs** del servicio y fijate el último error en rojo. Muchas veces es
  una variable de entorno mal escrita.
- **Subí una foto desde el admin y no se ve**: revisá que el disco
  persistente esté conectado (Paso 6) — sin él, las fotos no se guardan.
- **No me deja iniciar sesión en /admin**: confirmá que estás escribiendo
  exactamente la contraseña que pusiste en `ADMIN_PASSWORD`, sin espacios.
- Cualquier otra duda, guardá el mensaje de error y consultame — lo reviso
  con vos.
