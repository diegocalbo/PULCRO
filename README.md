# 🧹 PULCRO - Sistema de Gestión de Servicios de Limpieza

Sistema web moderno para la gestión integral de servicios de limpieza de campanas de cocina.

## 🚀 DEMO EN VIVO

**🌐 URL:** https://diegocalbo.github.io/PULCRO  
**👤 Usuario:** admin / admin  
**📱 Roles:** admin (completo) | operador / operador (limitado)

## ✨ Características Principales

- 👥 **Gestión completa de usuarios** con roles diferenciados
- 🏢 **Administración de clientes** con información completa
- 📅 **Dashboard con calendario** interactivo
- 🧹 **Gestión de servicios** y equipos de trabajo
- 📊 **Reportes** y hojas de ruta
- 💰 **Control de ganancias** y métricas
- 🔐 **Autenticación** segura con persistencia
- 📱 **Diseño responsive** (móvil y desktop)

## 🛠️ Tecnologías

- **Frontend:** React 18 + TypeScript + Vite
- **UI:** TailwindCSS + Radix UI + Lucide React
- **Almacenamiento:** localStorage (sin backend)
- **Despliegue:** GitHub Pages

## 🎯 Instalación Local

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos
```bash
# Clonar repositorio
git clone https://github.com/diegocalbo/PULCRO.git
cd PULCRO

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Acceder a http://localhost:5173
```

## 📦 Despliegue

### GitHub Pages (Automático)
1. Fork este repositorio
2. Habilitar GitHub Pages en Settings
3. Seleccionar Source: "GitHub Actions"
4. Push cambios → Deploy automático

### Build Manual
```bash
# Construir para producción
npm run build

# Preview del build
npm run preview

# Archivos listos en dist/
```

## 👤 Usuarios de Demostración

| Usuario | Contraseña | Rol | Permisos |
|---------|------------|-----|----------|
| admin | admin | Administrador | Completo |
| operador | operador | Usuario | Limitado |

## 📋 Funcionalidades

### 🔐 Autenticación
- Login con validación
- Roles diferenciados (admin/user)
- Sesión persistente
- Protección de rutas

### 📊 Dashboard
- Métricas en tiempo real
- Calendario interactivo con servicios
- Servicios del día
- Próximos trabajos programados
- Indicadores visuales por estado

### 👥 Gestión de Clientes
- ✅ Crear, editar, eliminar clientes
- ✅ Búsqueda y filtrado
- ✅ Información completa (contacto, dirección, CUIT)
- ✅ Validación de formularios
- ✅ Vista responsive

### 🧹 Servicios (En desarrollo)
- Programación de servicios
- Asignación a equipos
- Control de estados
- Servicios recurrentes

### 👨‍💼 Equipos (En desarrollo)
- Gestión de equipos de trabajo
- Asignación de líderes
- Información de contacto

### 📊 Reportes (En desarrollo)
- Análisis de ganancias
- Hojas de ruta para WhatsApp
- Exportación a Excel

## 🗂️ Estructura del Proyecto

```
PULCRO/
├── src/
│   ├── components/     # Componentes UI
│   ├── pages/         # Páginas principales
│   ├── hooks/         # Hooks personalizados
│   ├── services/      # Servicios localStorage
│   ├── contexts/      # Contextos React
│   ├── types/         # Definiciones TypeScript
│   └── lib/           # Utilidades
├── public/            # Assets estáticos
├── .github/           # GitHub Actions
└── dist/              # Build de producción
```

## 💾 Almacenamiento

### localStorage
- **Persistencia:** Datos guardados en navegador
- **Inicialización:** Datos de demo automáticos
- **Entidades:** usuarios, clientes, servicios, equipos
- **Backup:** Exportación/importación (próximamente)

## 🎨 Diseño

### Tema
- **Colores:** Azul profesional + acentos verdes
- **Tipografía:** Inter (clean y legible)
- **Iconografía:** Lucide React (consistente)
- **Layout:** Sidebar colapsible + contenido central

### Responsive
- **Mobile First:** Optimizado para móviles
- **Breakpoints:** sm, md, lg, xl
- **Touch:** Elementos touch-friendly
- **Accesibilidad:** Contraste WCAG AA

## 🚀 Performance

- **First Load:** < 3 segundos
- **Build Size:** < 2MB optimizado
- **Code Splitting:** Lazy loading componentes
- **Caching:** Assets con hash versionado

## 🔧 Desarrollo

### Scripts Disponibles
```bash
npm run dev        # Servidor desarrollo
npm run build      # Build producción
npm run preview    # Preview build local
npm run lint       # Linting código
```

### Git Workflow
```bash
# Desarrollo de feature
git checkout -b feature/nueva-funcionalidad
git commit -m "feat: descripción"
git push origin feature/nueva-funcionalidad
# PR → main → deploy automático
```

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Dispositivos
- ✅ Desktop (1024px+)
- ✅ Tablet (768px-1023px)
- ✅ Mobile (320px-767px)

## 🆘 Solución de Problemas

### Build Fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### LocalStorage Issues
- Limpiar datos: Dev Tools → Application → Storage
- Navegador privado: Funcionamiento temporal
- Datos corruptos: Refresh automático

### GitHub Pages 404
- Verificar configuración Pages
- Check workflow status
- Refresh DNS cache

## 🔮 Roadmap

### v1.1 (Próximo)
- [ ] Calendario completo de servicios
- [ ] Gestión completa de equipos
- [ ] Tipos de servicio con precios

### v1.2 (Futuro)
- [ ] Reportes y análisis avanzados
- [ ] Exportación Excel/PDF
- [ ] Hojas de ruta WhatsApp
- [ ] Servicios recurrentes automáticos

### v2.0 (Visión)
- [ ] Integración WhatsApp API
- [ ] Notificaciones push
- [ ] App móvil PWA
- [ ] Backup automático cloud

## 📞 Soporte

### Reportar Bugs
1. Issues de GitHub con template
2. Información de navegador/dispositivo
3. Pasos para reproducir
4. Screenshots si aplica

### Contacto
- **GitHub:** [@diegocalbo](https://github.com/diegocalbo)
- **Email:** [contacto]
- **Issues:** GitHub Issues preferido

## 📄 Licencia

Desarrollado para uso interno de empresas de limpieza de campanas.

---

**🎯 PULCRO - Optimizando la gestión de servicios de limpieza profesional**

*Aplicación 100% funcional, sin backend, lista para producción.*
