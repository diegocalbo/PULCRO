# 🚀 GUÍA COMPLETA: PULCRO EN GITHUB PASO A PASO

## 📋 PREPARACIÓN PREVIA

### 1. Crear cuenta en GitHub
- Ve a: https://github.com
- Crea tu cuenta gratuita
- Confirma tu email

### 2. Instalar Git en tu computadora
- Windows: Descarga de https://git-scm.com/download/win
- Mac: `brew install git`
- Linux: `sudo apt install git`

## 🗂️ ESTRUCTURA FINAL DEL PROYECTO

```
PULCRO/
├── README.md
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── pulcro.db
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── contexts/
│   └── public/
└── docs/
    ├── INSTALLATION.md
    └── USER_GUIDE.md
```

## 📝 PASO A PASO PARA GITHUB

### PASO 1: Preparar tu carpeta local
```bash
# Crear carpeta del proyecto
mkdir PULCRO
cd PULCRO

# Inicializar Git
git init
```

### PASO 2: Crear repositorio en GitHub
1. Ve a GitHub.com
2. Haz clic en "New repository" (botón verde)
3. Nombre: `PULCRO`
4. Descripción: `Sistema de Gestión de Servicios de Limpieza de Campanas`
5. ✅ Public (para que sea gratis)
6. ✅ Add README file
7. ✅ Add .gitignore → Choose "Node"
8. Clic en "Create repository"

### PASO 3: Clonar el repositorio
```bash
# Copiar la URL de tu repositorio y ejecutar:
git clone https://github.com/TU_USUARIO/PULCRO.git
cd PULCRO
```

### PASO 4: Copiar archivos del proyecto
1. Copia TODOS los archivos de `/workspace/pulcro-nueva/` a tu carpeta `PULCRO/`
2. Renombra `pulcro-nueva/backend/` → `PULCRO/backend/`
3. Renombra `pulcro-nueva/frontend/pulcro-frontend/` → `PULCRO/frontend/`

### PASO 5: Crear archivos de documentación

#### README.md principal:
```markdown
# 🧹 PULCRO - Sistema de Gestión de Servicios de Limpieza

Sistema web moderno para la gestión integral de servicios de limpieza de campanas de cocina.

## ✨ Características Principales

- 👥 Gestión completa de usuarios (crear, editar, eliminar)
- 🏢 Administración de clientes
- 📅 Calendario interactivo con servicios por día
- 🧹 Gestión de servicios y equipos de trabajo
- 📊 Reportes y hojas de ruta para WhatsApp
- 💰 Control de ganancias y exportaciones Excel
- 🔐 Sistema de autenticación con roles

## 🛠️ Tecnologías

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** FastAPI + SQLite
- **Despliegue:** Vite + Python

## 🚀 Instalación Rápida

### Prerrequisitos
- Node.js 18+
- Python 3.8+
- Git

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📱 Uso

1. Abrir: http://localhost:5173
2. Login: admin/admin
3. ¡Explorar todas las funciones!

## 🎯 Funcionalidades Clave

### Gestión de Usuarios ✅
- Crear nuevos usuarios
- **Editar contraseñas** (funcionalidad principal)
- Cambiar roles (Admin/Usuario)
- Eliminar usuarios

### Calendar Integration ✅
- Calendario interactivo
- Ver servicios por día
- Navegación mensual

### WhatsApp Routes ✅
- Generar hojas de ruta por equipo
- Sin precios (para operadores)
- Copiar al portapapeles

## 👨‍💻 Desarrollado por
Sistema desarrollado para optimizar la gestión de servicios de limpieza profesional.
```

### PASO 6: Subir archivos a GitHub
```bash
# Agregar todos los archivos
git add .

# Confirmar cambios
git commit -m "🎉 PULCRO - Sistema completo funcionando"

# Subir a GitHub
git push origin main
```

## 🌐 OPCIONES DE HOSTING GRATUITO

### Opción A: Vercel (Recomendado)
1. Ve a https://vercel.com
2. "Import Git Repository"
3. Conecta tu GitHub
4. Selecciona el repositorio PULCRO
5. Configure:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
6. Deploy ✅

### Opción B: Netlify
1. Ve a https://netlify.com
2. "Add new site" → "Import from Git"
3. Conecta GitHub → Selecciona PULCRO
4. Configure:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`
5. Deploy ✅

### Opción C: GitHub Pages
1. En tu repositorio GitHub
2. Settings → Pages
3. Source: "Deploy from a branch"
4. Branch: main / root
5. Save ✅

## 📋 CHECKLIST FINAL

- [ ] Repositorio creado en GitHub
- [ ] Archivos subidos correctamente
- [ ] README.md completo
- [ ] Backend funcional
- [ ] Frontend con calendario
- [ ] Gestión de usuarios operativa
- [ ] Deploy en hosting gratuito
- [ ] URL pública funcionando

## 🎯 RESULTADO ESPERADO

✅ Aplicación web completamente funcional
✅ Accesible desde cualquier dispositivo
✅ Todas las funcionalidades originales
✅ Código fuente seguro en GitHub
✅ Hosting gratuito permanente

## 🆘 SOPORTE

Si algo no funciona:
1. Revisa que Node.js y Python estén instalados
2. Verifica que todos los archivos se copiaron
3. Ejecuta `npm install` en frontend
4. Ejecuta `pip install -r requirements.txt` en backend

¡Tu sistema PULCRO estará listo y funcionando al 100%!
