# 📦 INSTALACIÓN PULCRO - GUÍA SIMPLE

## 🚀 INSTALACIÓN DE 1 CLIC

### ⚡ Pasos Súper Rápidos:

#### 1. Descargar Prerrequisitos (Solo la primera vez)
- **Node.js** - [Descargar](https://nodejs.org) (Versión LTS recomendada)
- **Python** - [Descargar](https://python.org) (Versión 3.8 o superior)

#### 2. Descargar PULCRO
- **Opción A:** `git clone https://github.com/TU_USUARIO/PULCRO.git`
- **Opción B:** Descargar ZIP desde GitHub y extraer

#### 3. Ejecutar PULCRO
- **Windows:** Doble clic en `start.bat`
- **Linux/Mac:** `./start.sh`

#### 4. ¡Listo!
- PULCRO se abre automáticamente en: http://localhost:5173
- **Login:** admin / admin

---

## 🔧 INSTALACIÓN DETALLADA (Si tienes problemas)

### Windows - Paso a Paso

#### Prerrequisitos:
1. **Instalar Node.js:**
   - Ir a https://nodejs.org
   - Descargar versión LTS
   - Ejecutar instalador (siguiente, siguiente, finalizar)
   - Abrir CMD y escribir: `node --version` (debe mostrar la versión)

2. **Instalar Python:**
   - Ir a https://python.org
   - Descargar versión 3.8+
   - **IMPORTANTE:** Marcar "Add Python to PATH" durante instalación
   - Abrir CMD y escribir: `python --version` (debe mostrar la versión)

#### Instalación PULCRO:
1. **Descargar PULCRO:**
   ```cmd
   git clone https://github.com/TU_USUARIO/PULCRO.git
   cd PULCRO
   ```
   
2. **Iniciar aplicación:**
   ```cmd
   start.bat
   ```

3. **¡Funciona!** PULCRO se abre automáticamente

### Linux/Mac - Paso a Paso

#### Prerrequisitos:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm python3 python3-pip

# macOS (con Homebrew)
brew install node python3

# Verificar instalación
node --version
python3 --version
```

#### Instalación PULCRO:
```bash
# Descargar
git clone https://github.com/TU_USUARIO/PULCRO.git
cd PULCRO

# Hacer ejecutable y correr
chmod +x start.sh
./start.sh
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS COMUNES

### ❌ "Node.js no encontrado"
**Solución:**
1. Descargar Node.js desde https://nodejs.org
2. Durante instalación, asegurarse de que se agregue al PATH
3. Reiniciar terminal/CMD
4. Verificar: `node --version`

### ❌ "Python no encontrado"
**Solución:**
1. Descargar Python desde https://python.org
2. **MARCAR "Add Python to PATH"** durante instalación
3. Reiniciar terminal/CMD
4. Verificar: `python --version` o `python3 --version`

### ❌ "Puerto en uso" o "EADDRINUSE"
**Solución:**
- Los scripts automáticamente cierran procesos previos
- Si persiste: reiniciar computadora
- Manualmente: cerrar todos los procesos de Node.js y Python

### ❌ "npm install failed"
**Solución:**
```bash
# Limpiar caché
cd frontend
rm -rf node_modules package-lock.json
npm install

# Si sigue fallando, usar npm con --force
npm install --force
```

### ❌ "pip install failed"
**Solución:**
```bash
# Actualizar pip
python -m pip install --upgrade pip

# Instalar dependencias
cd backend
pip install -r requirements.txt --user
```

### ❌ Frontend no carga / Pantalla blanca
**Solución:**
1. Esperar 10-15 segundos después de iniciar
2. Refrescar navegador (F5)
3. Verificar que backend esté corriendo en puerto 8000
4. Probar en modo incógnito

### ❌ Error de CORS / API no conecta
**Solución:**
- Los scripts automáticamente configuran CORS
- Verificar que backend muestre "Server running on port 8000"
- Verificar antivirus/firewall no esté bloqueando

---

## 📱 VERIFICACIÓN DE INSTALACIÓN

### ✅ Lista de Verificación:

1. **Prerrequisitos instalados:**
   - [ ] Node.js: `node --version` funciona
   - [ ] Python: `python --version` funciona

2. **PULCRO descargado:**
   - [ ] Carpeta PULCRO descargada y extraída
   - [ ] Archivos `start.bat` y `start.sh` presentes

3. **Aplicación funcionando:**
   - [ ] Backend inicia en puerto 8000
   - [ ] Frontend inicia en puerto 5173
   - [ ] Login admin/admin funciona
   - [ ] Dashboard se carga correctamente

### 🎯 URLs de Verificación:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **Documentación API:** http://localhost:8000/docs

---

## 🚀 PRÓXIMOS PASOS

### Después de la instalación exitosa:

1. **Cambiar contraseña admin** (recomendado)
2. **Crear usuarios adicionales** según necesidad
3. **Configurar tipos de servicio** de tu empresa
4. **Agregar clientes** iniciales
5. **Programar primeros servicios**

### Para uso en equipo:
1. **Compartir carpeta PULCRO** en red local
2. **Configurar acceso remoto** (opcional)
3. **Capacitar usuarios** en el sistema

---

## 📞 SOPORTE

### Si nada funciona:
1. **Verificar prerrequisitos** nuevamente
2. **Reiniciar computadora** 
3. **Probar en otra computadora** para descartar problemas locales
4. **Contactar soporte técnico** con detalles específicos del error

### Información útil para soporte:
- Sistema operativo y versión
- Versión de Node.js: `node --version`
- Versión de Python: `python --version`
- Mensaje de error exacto
- Pasos realizados antes del error

---

**🎉 ¡Una vez funcionando, PULCRO es muy fácil de usar!**

**💡 Consejo:** Mantén PULCRO en una carpeta fija y crea accesos directos a `start.bat` para facilitar el uso diario.
