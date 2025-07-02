# 🚀 Guía de Despliegue en GitHub Pages

Esta guía te ayudará a desplegar PULCRO en GitHub Pages de forma completamente gratuita.

## 📋 Requisitos Previos

1. **Cuenta de GitHub:** [Crear cuenta gratis](https://github.com)
2. **Git instalado:** [Descargar Git](https://git-scm.com)
3. **Node.js 18+:** [Descargar Node.js](https://nodejs.org)

## 🏗️ Paso 1: Configurar el Repositorio

### Opción A: Usar este código directamente

1. **Crear nuevo repositorio en GitHub:**
   ```
   Nombre: PULCRO
   Descripción: Sistema de Gestión de Servicios de Limpieza
   Público: ✅ (para GitHub Pages gratuito)
   ```

2. **Clonar y configurar:**
   ```bash
   # Crear directorio local
   mkdir PULCRO
   cd PULCRO
   
   # Inicializar git
   git init
   
   # Copiar todos los archivos de pulcro-standalone/
   # (Copia el contenido completo de este directorio)
   
   # Agregar remote
   git remote add origin https://github.com/tu-usuario/PULCRO.git
   
   # Primer commit
   git add .
   git commit -m "🎉 Initial commit - PULCRO v2.0.0"
   git branch -M main
   git push -u origin main
   ```

### Opción B: Fork del repositorio (si está público)

1. Hacer fork del repositorio original
2. Clonar tu fork:
   ```bash
   git clone https://github.com/tu-usuario/PULCRO.git
   cd PULCRO
   ```

## ⚙️ Paso 2: Configurar GitHub Pages

1. **Ir a tu repositorio en GitHub**
2. **Ir a Settings (Configuración)**
3. **En el menú lateral, hacer clic en "Pages"**
4. **Configurar Source:**
   ```
   Source: GitHub Actions
   ```
5. **¡Listo!** El workflow se ejecutará automáticamente

## 🔧 Paso 3: Personalizar para tu Empresa

### Actualizar información de la empresa

1. **Editar `src/components/Layout.tsx`:**
   ```typescript
   // Cambiar el logo y nombre
   <h1 className="text-xl font-bold text-white">TU-EMPRESA</h1>
   ```

2. **Editar `src/pages/Login.tsx`:**
   ```typescript
   // Actualizar título y descripción
   <h1 className="text-3xl font-bold text-gray-900">TU-EMPRESA</h1>
   <p className="text-gray-600 mt-2">Tu descripción personalizada</p>
   ```

3. **Editar `public/index.html`:**
   ```html
   <title>TU-EMPRESA - Sistema de Gestión</title>
   ```

### Personalizar colores y tema

1. **Editar `src/index.css`:**
   ```css
   :root {
     --primary: 221.2 83.2% 53.3%;    /* Tu color principal */
     --secondary: 210 40% 96%;         /* Tu color secundario */
     /* Personalizar según tu marca */
   }
   ```

### Actualizar datos de ejemplo

1. **Editar `src/services/localStorage.ts`:**
   ```typescript
   // Actualizar datos de clientes, servicios, etc.
   const defaultClientes: Cliente[] = [
     // Tus clientes de ejemplo
   ];
   ```

## 🚀 Paso 4: Desplegar

1. **Hacer cambios y commit:**
   ```bash
   git add .
   git commit -m "✨ Personalización para mi empresa"
   git push
   ```

2. **GitHub Actions se ejecutará automáticamente:**
   - Ve a la pestaña "Actions" en tu repositorio
   - Verás el workflow "Deploy PULCRO to GitHub Pages"
   - Espera a que termine (2-3 minutos)

3. **Tu aplicación estará disponible en:**
   ```
   https://tu-usuario.github.io/PULCRO/
   ```

## 📱 Paso 5: Configuración Avanzada

### Dominio personalizado (Opcional)

1. **Si tienes un dominio propio:**
   ```bash
   # Crear archivo CNAME en la raíz
   echo "tudominio.com" > public/CNAME
   ```

2. **Configurar DNS en tu proveedor:**
   ```
   CNAME: www -> tu-usuario.github.io
   A: @ -> 185.199.108.153
   A: @ -> 185.199.109.153
   A: @ -> 185.199.110.153
   A: @ -> 185.199.111.153
   ```

### Variables de entorno (si necesitas)

```yaml
# En .github/workflows/deploy.yml
- name: Build application
  run: pnpm build
  env:
    VITE_APP_NAME: "Mi Empresa"
    VITE_CONTACT_EMAIL: "contacto@miempresa.com"
```

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
pnpm install

# Desarrollo local
pnpm dev
# Abre http://localhost:3000

# Construir para producción
pnpm build

# Vista previa de producción
pnpm preview
```

## 🔍 Verificación del Despliegue

### Checklist post-despliegue:

- [ ] ✅ Aplicación carga sin errores
- [ ] ✅ Login funciona (admin/admin)
- [ ] ✅ Dashboard muestra métricas
- [ ] ✅ Navegación entre páginas funciona
- [ ] ✅ Crear cliente funciona
- [ ] ✅ Datos persisten en localStorage
- [ ] ✅ Responsive en móvil
- [ ] ✅ No hay errores en consola

### URLs para verificar:

```
https://tu-usuario.github.io/PULCRO/          # Página principal
https://tu-usuario.github.io/PULCRO/login     # Login
https://tu-usuario.github.io/PULCRO/dashboard # Dashboard
```

## 🐛 Solución de Problemas

### Error: No se encuentra la página
```bash
# Verificar que el workflow terminó exitosamente
# Verificar Settings > Pages > Source = GitHub Actions
```

### Error: Aplicación en blanco
```bash
# Verificar consola del navegador (F12)
# Usualmente problema de rutas en SPA
```

### Error: Build falla
```bash
# Verificar logs en Actions tab
# Instalar dependencias localmente y probar build
pnpm install
pnpm build
```

### Datos no persisten
```bash
# Verificar que localStorage esté habilitado
# No usar modo incógnito para pruebas de persistencia
```

## 📊 Monitoreo y Analytics

### Google Analytics (Opcional)

1. **Agregar a `public/index.html`:**
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Uptime Monitoring

- Usar servicios como [UptimeRobot](https://uptimerobot.com) (gratuito)
- Configurar monitoreo de `https://tu-usuario.github.io/PULCRO/`

## 🔒 Seguridad y Backup

### Backup automático
```bash
# GitHub es tu backup automático
# Todos los cambios están versionados
```

### Datos de usuario
```bash
# Los datos se almacenan en localStorage del navegador
# Cada usuario tiene sus propios datos
# No hay datos centralizados que respaldar
```

## 📈 Escalabilidad

### Para más funcionalidades:
1. Fork del repositorio
2. Desarrollar nuevas features
3. Pull request con tus mejoras
4. Deploy automático en tu fork

### Para backend real:
1. Usar este frontend como base
2. Desarrollar API REST separada
3. Modificar `src/services/localStorage.ts` para usar fetch()

## 📞 Soporte

### Recursos útiles:
- 📖 [Documentación de GitHub Pages](https://docs.github.com/en/pages)
- 🎯 [Guía de GitHub Actions](https://docs.github.com/en/actions)
- ⚡ [Documentación de Vite](https://vitejs.dev)
- ⚛️ [Documentación de React](https://react.dev)

### Comunidad:
- 💬 Issues en GitHub para reportar bugs
- 🤝 Pull Requests para contribuir
- ⭐ Star el repositorio si te gusta

---

## 🎉 ¡Felicitaciones!

Si seguiste todos los pasos, ahora tienes:

✅ **Una aplicación web profesional**  
✅ **Desplegada automáticamente en GitHub Pages**  
✅ **Completamente gratis**  
✅ **Con dominio personalizable**  
✅ **Actualizaciones automáticas con git push**  

**¡Tu empresa de limpieza ya tiene su sistema de gestión online!**

---

### 📱 Comparte tu implementación

¿Implementaste PULCRO para tu empresa? ¡Nos encantaría saberlo!

- Crea un issue con el tag `showcase`
- Comparte tu URL
- Cuenta tu experiencia

**¡Juntos hacemos crecer la comunidad PULCRO!** 🌟
