// Utilidades para generación de reportes y exportaciones

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Función para generar hoja de ruta para WhatsApp (sin precios)
export const generarHojaRutaWhatsApp = (servicios: any[], equipo: string, fecha: string) => {
  const serviciosEquipo = servicios.filter(s => s.equipo_nombre === equipo && s.fecha === fecha);
  
  if (serviciosEquipo.length === 0) {
    return `📋 HOJA DE RUTA - ${equipo}
📅 ${format(new Date(fecha), 'EEEE dd/MM/yyyy', { locale: es })}

❌ No hay servicios programados para este día.`;
  }

  let reporte = `📋 HOJA DE RUTA - ${equipo}
📅 ${format(new Date(fecha), 'EEEE dd/MM/yyyy', { locale: es })}
════════════════════════════════

`;

  serviciosEquipo
    .sort((a, b) => a.hora.localeCompare(b.hora))
    .forEach((servicio, index) => {
      reporte += `${index + 1}. 🕒 ${servicio.hora}
   🏢 ${servicio.cliente_nombre}
   🔧 ${servicio.tipo_servicio_nombre}
   📝 ${servicio.observaciones || 'Sin observaciones'}
   ─────────────────────────────

`;
    });

  reporte += `✅ Total de servicios: ${serviciosEquipo.length}

💡 Recuerda:
• Llegar puntual a cada cita
• Llevar todo el equipo necesario
• Confirmar servicio completado
• Reportar cualquier inconveniente

¡Buen trabajo equipo! 💪`;

  return reporte;
};

// Función para generar reporte de ganancias en texto
export const generarReporteGananciasTexto = (datos: any) => {
  const fechaActual = format(new Date(), 'dd/MM/yyyy HH:mm');
  
  let reporte = `╔════════════════════════════════════════╗
║          REPORTE DE GANANCIAS          ║
╚════════════════════════════════════════╝

📅 Período: ${datos.fecha_desde} al ${datos.fecha_hasta}
📊 Generado: ${fechaActual}

═══════════════════════════════════════════

💰 RESUMEN FINANCIERO:
─────────────────────────────────────────
• Total de Servicios: ${datos.cantidad_servicios}
• Ingresos Totales: $${datos.total_general.toLocaleString('es-AR')} ARS
• Promedio por Servicio: $${(datos.total_general / (datos.cantidad_servicios || 1)).toLocaleString('es-AR')} ARS

═══════════════════════════════════════════

📋 DETALLE DE SERVICIOS:
─────────────────────────────────────────
`;

  let totalPorDia = 0;
  let fechaActualDetalle = '';

  datos.servicios.forEach((servicio: any[]) => {
    const [fecha, hora, cliente, tipo, precio, equipo, estado] = servicio;
    
    if (fecha !== fechaActualDetalle) {
      if (fechaActualDetalle !== '') {
        reporte += `
   💵 Subtotal del día: $${totalPorDia.toLocaleString('es-AR')} ARS
─────────────────────────────────────────
`;
      }
      reporte += `
📅 ${format(new Date(fecha), 'EEEE dd/MM/yyyy', { locale: es })}
`;
      fechaActualDetalle = fecha;
      totalPorDia = 0;
    }
    
    reporte += `   ${hora} | ${cliente} | ${tipo} | $${precio.toLocaleString('es-AR')} | ${equipo} | ${estado}
`;
    totalPorDia += precio;
  });

  if (fechaActualDetalle !== '') {
    reporte += `
   💵 Subtotal del día: $${totalPorDia.toLocaleString('es-AR')} ARS
─────────────────────────────────────────
`;
  }

  reporte += `
═══════════════════════════════════════════
💰 TOTAL GENERAL: $${datos.total_general.toLocaleString('es-AR')} ARS
═══════════════════════════════════════════

📈 ANÁLISIS:
• Servicios completados: ${datos.servicios.filter((s: any[]) => s[6] === 'Completado').length}
• Servicios pendientes: ${datos.servicios.filter((s: any[]) => s[6] === 'Pendiente').length}
• Servicios cancelados: ${datos.servicios.filter((s: any[]) => s[6] === 'Cancelado').length}

──────────────────────────────────────────
Reporte generado por PULCRO v2.0
`;

  return reporte;
};

// Función para copiar texto al portapapeles
export const copiarAlPortapapeles = async (texto: string) => {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch (err) {
    // Fallback para navegadores que no soportan clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = texto;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};

// Función para descargar archivo CSV/Excel compatible
export const descargarCSV = (datos: any[], nombreArchivo: string, headers: string[]) => {
  const csvContent = [
    headers.join(','),
    ...datos.map(fila => fila.map((campo: any) => `"${campo}"`).join(','))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', nombreArchivo);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Función para generar Excel de clientes
export const generarExcelClientes = (clientes: any[]) => {
  const headers = ['ID', 'Nombre', 'Empresa', 'Teléfono', 'Email', 'Dirección', 'CUIT'];
  const datos = clientes.map(cliente => [
    cliente.id,
    cliente.nombre,
    cliente.empresa || '',
    cliente.telefono || '',
    cliente.email || '',
    cliente.direccion || '',
    cliente.cuit || ''
  ]);

  const fechaActual = format(new Date(), 'yyyy-MM-dd_HH-mm');
  descargarCSV(datos, `backup_clientes_${fechaActual}.csv`, headers);
};

// Función para generar Excel de ganancias
export const generarExcelGanancias = (datos: any) => {
  const headers = ['Fecha', 'Hora', 'Cliente', 'Tipo de Servicio', 'Precio (ARS)', 'Equipo', 'Estado'];
  const fechaActual = format(new Date(), 'yyyy-MM-dd_HH-mm');
  descargarCSV(datos.servicios, `reporte_ganancias_${fechaActual}.csv`, headers);
};

// Función para obtener servicios del día
export const obtenerServiciosDelDia = (servicios: any[], fecha: string) => {
  return servicios
    .filter(s => s.fecha === fecha)
    .sort((a, b) => a.hora.localeCompare(b.hora));
};

// Función para formatear hora en formato 12h
export const formatearHora12 = (hora: string) => {
  const [horas, minutos] = hora.split(':');
  const hora24 = parseInt(horas);
  const ampm = hora24 >= 12 ? 'PM' : 'AM';
  const hora12 = hora24 === 0 ? 12 : hora24 > 12 ? hora24 - 12 : hora24;
  return `${hora12}:${minutos} ${ampm}`;
};
