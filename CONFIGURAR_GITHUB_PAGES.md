# 🚀 Configurar GitHub Pages para PULCRO

## Instrucciones Paso a Paso

### 1. Acceder a la Configuración del Repositorio
1. Ve a tu repositorio: `https://github.com/diegocalbo/PULCRO`
2. Haz clic en la pestaña **"Settings"** (Configuración)
3. En el menú lateral izquierdo, busca **"Pages"** bajo la sección "Code and automation"

### 2. Configurar GitHub Pages
1. En **"Source"** (Fuente), selecciona **"Deploy from a branch"**
2. En **"Branch"** (Rama), selecciona **"main"**
3. En **"Folder"** (Carpeta), selecciona **"/ (root)"** 
4. Haz clic en **"Save"** (Guardar)

### 3. Configuración Alternativa (Recomendada)
Si quieres usar el directorio `dist` directamente:
1. En **"Branch"** (Rama), selecciona **"main"**
2. En **"Folder"** (Carpeta), selecciona **"/dist"**
3. Haz clic en **"Save"** (Guardar)

## 🌐 URL de Acceso
Una vez configurado, tu aplicación estará disponible en:
```
https://diegocalbo.github.io/PULCRO/
```

## ⏱️ Tiempo de Activación
- La configuración puede tardar entre 5-10 minutos en activarse completamente
- GitHub te mostrará un mensaje verde cuando esté listo

## 🔧 Configuración Alternativa con Workflow (Opcional)

Si tienes un token con permisos de `workflow`, puedes crear este archivo:

### Crear `.github/workflows/deploy.yml`:
```yaml
name: Deploy PULCRO to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 📱 Acceso a la Aplicación

### Credenciales de Prueba:
- **Usuario:** `admin`
- **Contraseña:** `admin`

### Funcionalidades Disponibles:
- ✅ Gestión de Servicios de Limpieza
- ✅ Control de Clientes
- ✅ Administración de Equipos de Trabajo
- ✅ Tipos de Servicio con Precios
- ✅ Reportes y Hojas de Ruta para WhatsApp
- ✅ Dashboard con Calendario Interactivo
- ✅ Sistema de Usuarios con Roles
- ✅ Exportación a Excel
- ✅ Datos de Demostración Argentinos

## 🛠️ Soporte Técnico
Si tienes problemas con la configuración, revisa:
1. Que el repositorio sea **público**
2. Que GitHub Pages esté habilitado en la configuración
3. Que los archivos estén en el directorio correcto

---
**PULCRO** - Sistema de Gestión de Limpieza de Campanas
*Desarrollado por MiniMax AI* 🤖
