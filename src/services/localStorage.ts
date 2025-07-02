// localStorage service for PULCRO application
import { User, Cliente, TipoServicio, Equipo, Servicio, DashboardMetrics } from '@/types';

const STORAGE_KEYS = {
  USERS: 'pulcro_users',
  CLIENTES: 'pulcro_clientes',
  TIPOS_SERVICIO: 'pulcro_tipos_servicio',
  EQUIPOS: 'pulcro_equipos',
  SERVICIOS: 'pulcro_servicios',
  CURRENT_USER: 'pulcro_current_user',
  INITIALIZED: 'pulcro_initialized'
};

class LocalStorageService {
  // Generic methods
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  }

  // Initialize with sample data
  initializeData(): void {
    if (this.getItem(STORAGE_KEYS.INITIALIZED, false)) {
      return; // Already initialized
    }

    // Initialize users
    const defaultUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        password: 'admin',
        nivel: 'admin',
        nombre: 'Administrador',
        email: 'admin@pulcro.com',
        fechaCreacion: new Date().toISOString()
      },
      {
        id: '2',
        username: 'operador',
        password: 'operador',
        nivel: 'user',
        nombre: 'Operador',
        email: 'operador@pulcro.com',
        fechaCreacion: new Date().toISOString()
      }
    ];

    // Initialize clients (Argentine data)
    const defaultClientes: Cliente[] = [
      {
        id: '1',
        nombre: 'Hotel Palermo Plaza',
        empresa: 'Hotelería Palermo SA',
        telefono: '+5411-4832-1234',
        email: 'info@palermohotel.com.ar',
        direccion: 'Av. Santa Fe 1234, Palermo, Buenos Aires',
        cuit: '30-12345678-9',
        contacto: 'María Fernanda García',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      },
      {
        id: '2',
        nombre: 'Parrilla El Asador',
        empresa: 'El Asador Parrilla SRL',
        telefono: '+5411-4567-8901',
        email: 'contacto@elasador.com.ar',
        direccion: 'Av. Corrientes 2456, San Telmo, Buenos Aires',
        cuit: '30-87654321-0',
        contacto: 'Carlos Alberto Martínez',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      },
      {
        id: '3',
        nombre: 'Café Tortoni',
        empresa: 'Café Tortoni SA',
        telefono: '+5411-4342-4328',
        email: 'admin@cafetortoni.com.ar',
        direccion: 'Av. de Mayo 825, Monserrat, Buenos Aires',
        cuit: '30-11223344-5',
        contacto: 'Ana María López',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      },
      {
        id: '4',
        nombre: 'Panadería La Baguette',
        empresa: 'La Baguette Panadería LTDA',
        telefono: '+5411-4801-2345',
        email: 'info@labaguette.com.ar',
        direccion: 'Av. Cabildo 1567, Belgrano, Buenos Aires',
        cuit: '30-55667788-1',
        contacto: 'Luis Miguel Rodríguez',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      },
      {
        id: '5',
        nombre: 'Pizzería Napolitana',
        empresa: 'Napolitana Pizzas SRL',
        telefono: '+5411-4963-7890',
        email: 'pedidos@napolitana.com.ar',
        direccion: 'Av. Rivadavia 5432, Caballito, Buenos Aires',
        cuit: '30-99887766-3',
        contacto: 'Giuseppe Romano',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      }
    ];

    // Initialize service types (Argentine pricing in ARS)
    const defaultTiposServicio: TipoServicio[] = [
      {
        id: '1',
        nombre: 'Limpieza Básica de Campana',
        precio: 15000.00,
        descripcion: 'Limpieza básica de campana extractora incluyendo filtros y desengrasado superficial',
        tiempoEstimado: 120,
        frecuencia: 'Mensual',
        categoria: 'Básico',
        fechaCreacion: new Date().toISOString()
      },
      {
        id: '2',
        nombre: 'Limpieza Completa de Campana',
        precio: 25000.00,
        descripcion: 'Limpieza completa de campana, ductos y sistema de extracción con desengrasado profundo',
        tiempoEstimado: 180,
        frecuencia: 'Mensual',
        categoria: 'Completo',
        fechaCreacion: new Date().toISOString()
      },
      {
        id: '3',
        nombre: 'Mantenimiento de Ductos',
        precio: 18000.00,
        descripcion: 'Limpieza y mantenimiento preventivo de ductos de ventilación',
        tiempoEstimado: 150,
        frecuencia: 'Trimestral',
        categoria: 'Mantenimiento',
        fechaCreacion: new Date().toISOString()
      },
      {
        id: '4',
        nombre: 'Inspección Técnica',
        precio: 8000.00,
        descripcion: 'Inspección técnica completa del sistema de extracción y ventilación',
        tiempoEstimado: 60,
        frecuencia: 'Semestral',
        categoria: 'Inspección',
        fechaCreacion: new Date().toISOString()
      },
      {
        id: '5',
        nombre: 'Desengrase Profundo',
        precio: 35000.00,
        descripcion: 'Desengrase profundo de campanas industriales con productos especializados',
        tiempoEstimado: 240,
        frecuencia: 'Bajo demanda',
        categoria: 'Especializado',
        fechaCreacion: new Date().toISOString()
      }
    ];

    // Initialize teams (Argentine data)
    const defaultEquipos: Equipo[] = [
      {
        id: '1',
        nombre: 'Equipo Alpha',
        lider: 'Daniel Martínez',
        telefono: '+5411-4567-1111',
        email: 'daniel@pulcro.com.ar',
        especialidad: 'Limpieza de Campanas',
        activo: true,
        fechaCreacion: new Date().toISOString()
      },
      {
        id: '2',
        nombre: 'Equipo Beta',
        lider: 'Carmen Ruiz',
        telefono: '+5411-4567-2222',
        email: 'carmen@pulcro.com.ar',
        especialidad: 'Mantenimiento de Ductos',
        activo: true,
        fechaCreacion: new Date().toISOString()
      },
      {
        id: '3',
        nombre: 'Equipo Gamma',
        lider: 'Roberto Fernández',
        telefono: '+5411-4567-3333',
        email: 'roberto@pulcro.com.ar',
        especialidad: 'Inspección y Desengrase',
        activo: true,
        fechaCreacion: new Date().toISOString()
      },
      {
        id: '4',
        nombre: 'Equipo Delta',
        lider: 'María José Pérez',
        telefono: '+5411-4567-4444',
        email: 'maria@pulcro.com.ar',
        especialidad: 'Emergencias',
        activo: true,
        fechaCreacion: new Date().toISOString()
      }
    ];

    // Initialize services with future dates (Argentine addresses)
    const today = new Date();
    const defaultServicios: Servicio[] = [
      {
        id: '1',
        clienteId: '1',
        tipoServicioId: '1',
        equipoId: '1',
        fecha: this.addDays(today, 1).toISOString().split('T')[0],
        hora: '09:00',
        estado: 'Programado',
        direccion: 'Av. Santa Fe 1234, Palermo, Buenos Aires',
        observaciones: 'Limpieza programada mensual - Cocina principal',
        prioridad: 'Media',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      },
      {
        id: '2',
        clienteId: '2',
        tipoServicioId: '2',
        equipoId: '2',
        fecha: this.addDays(today, 2).toISOString().split('T')[0],
        hora: '14:00',
        estado: 'Programado',
        direccion: 'Av. Corrientes 2456, San Telmo, Buenos Aires',
        observaciones: 'Limpieza completa después de renovación de parrilla',
        prioridad: 'Alta',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      },
      {
        id: '3',
        clienteId: '3',
        tipoServicioId: '3',
        equipoId: '3',
        fecha: this.addDays(today, 3).toISOString().split('T')[0],
        hora: '10:30',
        estado: 'Programado',
        direccion: 'Av. de Mayo 825, Monserrat, Buenos Aires',
        observaciones: 'Mantenimiento trimestral de ductos históricos',
        prioridad: 'Media',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      },
      {
        id: '4',
        clienteId: '4',
        tipoServicioId: '4',
        equipoId: '1',
        fecha: this.addDays(today, 5).toISOString().split('T')[0],
        hora: '16:00',
        estado: 'Programado',
        direccion: 'Av. Cabildo 1567, Belgrano, Buenos Aires',
        observaciones: 'Inspección semestral - Verificar cumplimiento normativo',
        prioridad: 'Baja',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      },
      {
        id: '5',
        clienteId: '5',
        tipoServicioId: '5',
        equipoId: '4',
        fecha: this.addDays(today, 7).toISOString().split('T')[0],
        hora: '11:00',
        estado: 'Programado',
        direccion: 'Av. Rivadavia 5432, Caballito, Buenos Aires',
        observaciones: 'Desengrase profundo horno industrial',
        prioridad: 'Alta',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      },
      {
        id: '6',
        clienteId: '1',
        tipoServicioId: '1',
        equipoId: '2',
        fecha: this.addDays(today, 14).toISOString().split('T')[0],
        hora: '08:30',
        estado: 'Programado',
        direccion: 'Av. Santa Fe 1234, Palermo, Buenos Aires',
        observaciones: 'Limpieza mensual recurrente - Cocina secundaria',
        prioridad: 'Media',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      }
    ];

    // Save all data
    this.setItem(STORAGE_KEYS.USERS, defaultUsers);
    this.setItem(STORAGE_KEYS.CLIENTES, defaultClientes);
    this.setItem(STORAGE_KEYS.TIPOS_SERVICIO, defaultTiposServicio);
    this.setItem(STORAGE_KEYS.EQUIPOS, defaultEquipos);
    this.setItem(STORAGE_KEYS.SERVICIOS, defaultServicios);
    this.setItem(STORAGE_KEYS.INITIALIZED, true);
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  // User methods
  getUsers(): User[] {
    return this.getItem(STORAGE_KEYS.USERS, []);
  }

  saveUsers(users: User[]): void {
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  getCurrentUser(): User | null {
    return this.getItem(STORAGE_KEYS.CURRENT_USER, null);
  }

  setCurrentUser(user: User | null): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  // Cliente methods
  getClientes(): Cliente[] {
    return this.getItem(STORAGE_KEYS.CLIENTES, []);
  }

  saveClientes(clientes: Cliente[]): void {
    this.setItem(STORAGE_KEYS.CLIENTES, clientes);
  }

  // TipoServicio methods
  getTiposServicio(): TipoServicio[] {
    return this.getItem(STORAGE_KEYS.TIPOS_SERVICIO, []);
  }

  saveTiposServicio(tipos: TipoServicio[]): void {
    this.setItem(STORAGE_KEYS.TIPOS_SERVICIO, tipos);
  }

  // Equipo methods
  getEquipos(): Equipo[] {
    return this.getItem(STORAGE_KEYS.EQUIPOS, []);
  }

  saveEquipos(equipos: Equipo[]): void {
    this.setItem(STORAGE_KEYS.EQUIPOS, equipos);
  }

  // Servicio methods
  getServicios(): Servicio[] {
    return this.getItem(STORAGE_KEYS.SERVICIOS, []);
  }

  saveServicios(servicios: Servicio[]): void {
    this.setItem(STORAGE_KEYS.SERVICIOS, servicios);
  }

  // Dashboard metrics
  getDashboardMetrics(): DashboardMetrics {
    const clientes = this.getClientes();
    const servicios = this.getServicios();
    const equipos = this.getEquipos();
    const tipos = this.getTiposServicio();

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const today = new Date().toISOString().split('T')[0];

    const serviciosMes = servicios.filter(s => {
      const fecha = new Date(s.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    });

    const serviciosHoy = servicios.filter(s => s.fecha === today);

    const ingresosMes = serviciosMes.reduce((total, servicio) => {
      const tipo = tipos.find(t => t.id === servicio.tipoServicioId);
      return total + (tipo?.precio || 0);
    }, 0);

    const ingresosTotal = servicios.reduce((total, servicio) => {
      const tipo = tipos.find(t => t.id === servicio.tipoServicioId);
      return total + (tipo?.precio || 0);
    }, 0);

    return {
      totalClientes: clientes.length,
      totalServicios: servicios.length,
      serviciosPendientes: servicios.filter(s => s.estado === 'Pendiente').length,
      serviciosCompletados: servicios.filter(s => s.estado === 'Realizado').length,
      ingresosMes,
      ingresosTotal,
      serviciosHoy: serviciosHoy.length,
      equiposActivos: equipos.filter(e => e.activo).length
    };
  }

  // Clear all data
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const storageService = new LocalStorageService();
