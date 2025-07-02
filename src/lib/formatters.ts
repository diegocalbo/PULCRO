// Argentine formatting utilities for PULCRO

/**
 * Format currency in Argentine Pesos
 * @param amount - Amount in ARS
 * @returns Formatted string like "$15.000"
 */
export function formatCurrencyARS(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format phone number in Argentine format
 * @param phone - Phone number
 * @returns Formatted phone like "+5411-4567-8901"
 */
export function formatPhoneAR(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // If it starts with 54, format as +54-11-XXXX-XXXX
  if (digits.startsWith('54') && digits.length >= 10) {
    const cleaned = digits.substring(2);
    if (cleaned.startsWith('11')) {
      return `+54${cleaned.substring(0, 2)}-${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
    }
  }
  
  // If it starts with 11, format as +5411-XXXX-XXXX
  if (digits.startsWith('11') && digits.length >= 10) {
    return `+54${digits.substring(0, 2)}-${digits.substring(2, 6)}-${digits.substring(6)}`;
  }
  
  // Default format
  return phone;
}

/**
 * Format date in Argentine format DD/MM/YYYY
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDateAR(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Format time in 24-hour format
 * @param time - Time string
 * @returns Formatted time string
 */
export function formatTimeAR(time: string): string {
  return time;
}

/**
 * Format CUIT in Argentine format XX-XXXXXXXX-X
 * @param cuit - CUIT number
 * @returns Formatted CUIT string
 */
export function formatCUITAR(cuit: string): string {
  const digits = cuit.replace(/\D/g, '');
  if (digits.length === 11) {
    return `${digits.substring(0, 2)}-${digits.substring(2, 10)}-${digits.substring(10)}`;
  }
  return cuit;
}

/**
 * Get service status color based on status
 * @param estado - Service status
 * @returns Tailwind color class
 */
export function getStatusColor(estado: string): string {
  switch (estado.toLowerCase()) {
    case 'programado':
      return 'bg-blue-100 text-blue-800';
    case 'en curso':
      return 'bg-yellow-100 text-yellow-800';
    case 'realizado':
    case 'completado':
      return 'bg-green-100 text-green-800';
    case 'cancelado':
      return 'bg-red-100 text-red-800';
    case 'pendiente':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get priority color based on priority
 * @param prioridad - Service priority
 * @returns Tailwind color class
 */
export function getPriorityColor(prioridad: string): string {
  switch (prioridad.toLowerCase()) {
    case 'alta':
      return 'bg-red-100 text-red-800';
    case 'media':
      return 'bg-yellow-100 text-yellow-800';
    case 'baja':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Calculate service duration in hours from minutes
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours} h`;
  } else {
    return `${hours}h ${mins}m`;
  }
}

/**
 * Generate WhatsApp message for service (without price for operators)
 * @param servicio - Service object
 * @param cliente - Client object
 * @param tipoServicio - Service type object
 * @param equipo - Team object (optional)
 * @returns WhatsApp message string
 */
export function generateWhatsAppMessage(
  servicio: any,
  cliente: any,
  tipoServicio: any,
  equipo?: any
): string {
  const fecha = formatDateAR(servicio.fecha);
  
  return `🧽 *PULCRO - Servicio Programado*

📅 *Fecha:* ${fecha} a las ${servicio.hora}
🏢 *Cliente:* ${cliente.nombre}
📍 *Dirección:* ${servicio.direccion}
🔧 *Servicio:* ${tipoServicio.nombre}
👥 *Equipo:* ${equipo?.nombre || 'Equipo no asignado'}

📞 *Contacto:* ${cliente.contacto}
📱 *Teléfono:* ${cliente.telefono}

📝 *Observaciones:* ${servicio.observaciones || 'Sin observaciones especiales'}`;
}
