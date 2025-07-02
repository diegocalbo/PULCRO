// Data types for PULCRO application

export interface User {
  id: string;
  username: string;
  password: string;
  nivel: 'admin' | 'user';
  nombre?: string;
  email?: string;
  fechaCreacion: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  empresa?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  cuit?: string;
  contacto?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface TipoServicio {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  tiempoEstimado?: number; // en minutos
  frecuencia?: string;
  categoria?: string;
  fechaCreacion: string;
}

export interface Equipo {
  id: string;
  nombre: string;
  lider: string;
  telefono?: string;
  email?: string;
  especialidad?: string;
  activo: boolean;
  fechaCreacion: string;
}

export interface Servicio {
  id: string;
  clienteId: string;
  tipoServicioId: string;
  equipoId: string;
  fecha: string;
  hora: string;
  estado: 'Programado' | 'En Curso' | 'Realizado' | 'Cancelado' | 'Pendiente';
  direccion?: string;
  observaciones?: string;
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Urgente';
  fechaCreacion: string;
  fechaActualizacion: string;
  // Campos calculados
  clienteNombre?: string;
  tipoServicioNombre?: string;
  equipoNombre?: string;
  precio?: number;
}

export interface DashboardMetrics {
  totalClientes: number;
  totalServicios: number;
  serviciosPendientes: number;
  serviciosCompletados: number;
  ingresosMes: number;
  ingresosTotal: number;
  serviciosHoy: number;
  equiposActivos: number;
}

export interface AuthUser {
  id: string;
  username: string;
  nivel: 'admin' | 'user';
  nombre?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  clienteNombre: string;
  equipoNombre: string;
  estado: string;
  prioridad: string;
}

export interface ReporteData {
  servicios: Servicio[];
  fechaInicio: string;
  fechaFin: string;
  totalIngresos: number;
  totalServicios: number;
  serviciosPorEstado: Record<string, number>;
  serviciosPorEquipo: Record<string, number>;
  ingresosPorMes: Record<string, number>;
}

export interface WhatsAppRoute {
  fecha: string;
  equipo: string;
  servicios: {
    hora: string;
    cliente: string;
    direccion: string;
    tipoServicio: string;
    observaciones?: string;
  }[];
}
