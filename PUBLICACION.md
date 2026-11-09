# Gasfitería The Master — publicación

Dominio configurado: **https://themastergasfitero.com/**.

## Entrega

`release/themastergasfitero.zip` contiene únicamente las páginas comerciales, imágenes utilizadas, estilos, scripts, catálogo, robots y mapa del sitio. No incluye los documentos de análisis, originales pesados, pruebas ni páginas académicas.

Extraer el ZIP en la raíz pública del alojamiento y conectar el dominio con HTTPS. Esta entrega prepara los archivos; no modifica el DNS ni publica en un servidor. Configurar en el alojamiento una redirección de `www` al dominio sin `www`, y de HTTP a HTTPS. Retirar del alojamiento las versiones antiguas de `siteplan.html`, `attributions.html`, `styles/siteplan.css`, `scripts/home.js` y `scripts/form-action.js` si se habían publicado antes. La dirección antigua `form-action.html` conduce al contacto y no reenvía los datos de su URL.

## Contacto

El formulario prepara un mensaje para el WhatsApp **936 872 862**. El visitante debe pulsar Enviar dentro de WhatsApp. No se registran solicitudes en un servidor ni se guardan borradores del formulario. El enlace directo de WhatsApp y el teléfono están disponibles aunque JavaScript falle.

Se conservaron los datos comerciales existentes: teléfonos, dirección, correo, horario de emergencias, razón social, RUC, experiencia, acreditaciones y clientes mencionados. El dominio fue confirmado durante esta revisión. La empresa debe verificar la vigencia de los demás datos, las condiciones de garantía y el permiso para mencionar clientes antes del lanzamiento.

## Imágenes y créditos

Se reutilizaron los archivos del proyecto; no se descargaron imágenes de las webs de referencia. La antigua página de atribuciones indicaba que las imágenes y la marca fueron proporcionadas por el negocio. Se conserva aquí esa procedencia declarada; esta revisión no verificó licencias de cada original. Tipografías Poppins y Roboto, servidas mediante Google Fonts. Las referencias externas y los documentos adjuntos se usaron como inspiración de composición, sin copiar teléfonos ni tarifas de otras empresas.

## Mantenimiento y comprobación

Para previsualizar: `python -m http.server 8765 --bind 127.0.0.1` y abrir `http://127.0.0.1:8765/`.

Para comprobar el formulario: `node --test tests/contact.test.mjs`.

Para validar rutas y preparar otra entrega: `python scripts/package-site.py`.

El catálogo interactivo utiliza `data/services.json`. Al cambiar servicios, actualizar también las tarjetas de respaldo en `services.html`, las opciones de `contact.html` y las referencias de la portada. El empaquetador comprueba que cada servicio tenga tarjeta y opción de contacto.

Comprobaciones realizadas: navegación móvil, cierre con Escape, galería 3+2 en escritorio, adaptación a 320/390/768/1440 píxeles, búsqueda sin tildes, filtros y estado vacío, detalle de servicio y preselección en contacto. Se verificó la preparación del mensaje localmente, sin enviar mensajes reales. La comprobación final de recepción se realiza por la empresa después de publicar.
