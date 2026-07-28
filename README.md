# Scarppe Transporte y Logística — Sitio Web Corporativo

Sitio web corporativo desarrollado en Next.js 14, organizado por páginas
independientes (no landing page de scroll infinito), con un panel de
administración propio para editar todo el contenido sin tocar código.

## Identidad visual

El sitio usa el logo oficial provisto (servido desde `/uploads/logo-blanco.svg`) y un
favicon generado a partir de la marca (ícono navy). Tipografías: Barlow
Condensed (títulos, uppercase) y Barlow (texto), estilo editorial premium con
grillas de líneas finas, tarjetas con esquinas rectas y hover que invierte a
navy — inspirado en la referencia visual entregada por la empresa.

Colores editables desde `/admin/general`: primario (navy), secundario,
terciario, acento (celeste) y color claro (fondos).

## Contenido incluido

- **Inicio**: banner de pantalla completa, indicadores de trayectoria, resumen de servicios.
- **Empresa**: Política de Gestión (con galería), Historia (línea de tiempo con fotos), Misión, Visión, Valores.
- **Servicios**: página general + página propia para cada uno de los 8 servicios.
- **Comercio Exterior**: coordinación con despachantes, depósitos fiscales, asesoramiento continuo (con el aviso de que Scarppe no posee despachantes de aduana propios).
- **Contacto**: directores, gerencia, logística, formulario de cotización, mapas de Uruguay y Brasil.
- **Trabaja con Nosotros**: formulario para envío de currículum.

Todos los textos institucionales fueron transcriptos tal cual del documento
oficial de Scarppe. La única cifra corregida fue la superficie de depósito
(3.850 m², confirmada por la empresa; el documento original decía "3.0 m²").

## Panel de administración (/admin)

Accedé a `tudominio.com/admin` con la contraseña definida en la variable de
entorno `ADMIN_PASSWORD` (por defecto `scarppe2026`, **cambiarla antes de
publicar el sitio**). Desde ahí se puede editar sin tocar código:

- Logo, colores institucionales y tipografías (Google Fonts).
- Menú de navegación (agregar, quitar, reordenar páginas).
- Banner de inicio (foto o video, títulos, indicadores).
- Todos los textos de Empresa (Política de Gestión, Historia, Misión, Visión, Valores) y sus galerías/línea de tiempo.
- Servicios: agregar, editar o eliminar servicios (cada uno genera su propia página automáticamente).
- Comercio Exterior, Contacto (directores, teléfonos, mapas) y Trabaja con Nosotros.
- SEO (título y descripción) de cada página.
- Configuración de los formularios (ver siguiente sección).

Los cambios se guardan en un solo directorio de datos (ver "Almacenamiento"
abajo) y se publican al instante, sin necesidad de volver a compilar el sitio.

## Formularios de contacto y CV

Los formularios usan el servicio gratuito **Web3Forms** para enviar los
datos por e-mail sin necesidad de mantener un servidor de correo propio:

1. Creá una cuenta gratuita en https://web3forms.com y obtené tu *Access Key*.
2. Ingresá a `/admin/formularios` y pegá la access key.
3. Los e-mails de destino ya están precargados: `joaquin.expo@scarppe.com.br`
   (cotizaciones) y `transportescarppe@gmail.com` (currículums), editables
   desde `/admin/contacto` y `/admin/trabaja-con-nosotros`.

Hasta que se configure la access key, los formularios muestran un aviso al
usuario y el envío queda registrado en los logs del servidor.

## Cómo correrlo localmente

```bash
npm install
cp .env.example .env.local   # y editar ADMIN_PASSWORD / ADMIN_SECRET
npm run dev
```

Abrir http://localhost:3000

## Almacenamiento (importante para publicarlo)

Todo el contenido editable (textos) e imágenes subidas vive en **una sola
carpeta**: `render-data/` (se crea sola la primera vez que arranca el sitio,
copiando el contenido inicial desde `seed/`). Esto significa que para
publicarlo en producción alcanza con un **único disco persistente** montado
en esa carpeta.

Variable de entorno opcional `DATA_DIR`: si no se define, se usa
`render-data/` dentro del proyecto (ideal para desarrollo local). En
producción se recomienda apuntarla a la ruta del disco persistente, por
ejemplo `/var/data`.

No se recomienda Vercel/Netlify en su modo serverless estándar, porque el
sistema de archivos se reinicia en cada deploy y se perderían los cambios
hechos desde `/admin`. Recomendado: **Render.com** (Web Service + Persistent
Disk) o Railway.app.

Pasos generales:

```bash
npm install
npm run build
npm run start
```

Variables de entorno a configurar en el panel del hosting: `ADMIN_PASSWORD`,
`ADMIN_SECRET` y opcionalmente `DATA_DIR` (ruta del disco persistente).

**Ver la guía paso a paso completa en `GUIA-PUBLICACION.md`**, pensada para
alguien que nunca publicó un sitio web antes.

## Notas

- Las fotografías de flota y operaciones son marcadores de posición
  (placeholders) generados automáticamente. Reemplazalas por fotografías
  reales desde el panel de administración en cada sección (Inicio, Empresa,
  Servicios).
- Los mapas de Uruguay y Brasil están embebidos con las coordenadas
  provistas, sin necesidad de API key de Google Maps.
