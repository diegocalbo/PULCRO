// Mock API que simula el backend para demo
const DEMO_USERS = [
  { username: 'admin', password: 'admin', nivel: 'admin' },
  { username: 'user', password: 'user', nivel: 'user' }
];

const DEMO_CLIENTES = [
  { id: 1, nombre: 'Hotel Plaza', empresa: 'Hotelería Plaza SA', telefono: '555-1001', email: 'info@hotelplaza.com', direccion: 'Av. Principal 123', cuit: '20-12345678-9' },
  { id: 2, nombre: 'Café Central', empresa: 'Café Central SRL', telefono: '555-1002', email: 'contacto@cafecentral.com', direccion: 'Calle Central 456', cuit: '20-87654321-0' },
  { id: 3, nombre: 'Restaurante Sabor', empresa: 'Sabor Gourmet SA', telefono: '555-1003', email: 'admin@sabor.com', direccion: 'Av. Gastronómica 789', cuit: '20-11223344-5' },
  { id: 4, nombre: 'Panadería María', empresa: 'Panadería María LTDA', telefono: '555-1004', email: 'maria@panaderia.com', direccion: 'Calle del Pan 321', cuit: '20-55667788-1' }
];

const DEMO_SERVICIOS = [
  { id: 1, cliente_nombre: 'Hotel Plaza', fecha: '2025-07-06', hora: '11:30', tipo_servicio_nombre: 'BASE', precio: 300000, estado: 'Pendiente', equipo_nombre: 'ALFA - DANI', observaciones: 'Servicio programado' },
  { id: 2, cliente_nombre: 'Hotel Plaza', fecha: '2025-07-06', hora: '11:30', tipo_servicio_nombre: 'BASE', precio: 300000, estado: 'Pendiente', equipo_nombre: 'ALFA - DANI', observaciones: 'Servicio de mantenimiento' },
  { id: 3, cliente_nombre: 'Café Central', fecha: '2025-07-04', hora: '16:00', tipo_servicio_nombre: 'Inspección Técnica', precio: 10000, estado: 'Pendiente', equipo_nombre: 'Equipo Beta', observaciones: 'Inspección rutinaria' },
  { id: 4, cliente_nombre: 'Restaurante Sabor', fecha: '2025-07-03', hora: '13:00', tipo_servicio_nombre: 'Instalación de Filtros', precio: 7500, estado: 'Pendiente', equipo_nombre: 'Equipo Gamma', observaciones: 'Instalación programada' },
  { id: 5, cliente_nombre: 'Panadería María', fecha: '2025-07-02', hora: '08:30', tipo_servicio_nombre: 'Cambio de Ductos', precio: 25000, estado: 'Pendiente', equipo_nombre: 'Equipo Alpha', observaciones: 'Cambio de ductos' },
  { id: 6, cliente_nombre: 'Hotel Plaza', fecha: '2025-07-01', hora: '10:00', tipo_servicio_nombre: 'Mantenimiento General', precio: 20000, estado: 'Pendiente', equipo_nombre: 'ALFA - DANI', observaciones: 'Mantenimiento general' }
];

const DEMO_EQUIPOS = [
  { id: 1, nombre: 'ALFA - DANI', lider: 'Daniel Alfa', telefono: '555-1004' },
  { id: 2, nombre: 'Equipo Alpha', lider: 'Carlos Rodriguez', telefono: '555-1001' },
  { id: 3, nombre: 'Equipo Beta', lider: 'Ana García', telefono: '555-1002' },
  { id: 4, nombre: 'Equipo Gamma', lider: 'Luis Martínez', telefono: '555-1003' }
];

const DEMO_TIPOS_SERVICIO = [
  { id: 1, nombre: 'BASE', precio: 300000, descripcion: 'Servicio base completo' },
  { id: 2, nombre: 'Cambio de Ductos', precio: 25000, descripcion: 'Cambio de ductos de ventilación' },
  { id: 3, nombre: 'Inspección Técnica', precio: 10000, descripcion: 'Inspección técnica del sistema' },
  { id: 4, nombre: 'Instalación de Filtros', precio: 7500, descripcion: 'Instalación de filtros nuevos' },
  { id: 5, nombre: 'Limpieza de Campana', precio: 15000, descripcion: 'Limpieza completa de campana extractora' },
  { id: 6, nombre: 'Mantenimiento General', precio: 20000, descripcion: 'Mantenimiento completo del sistema' },
  { id: 7, nombre: 'Reparación de Motor', precio: 35000, descripcion: 'Reparación de motor de extracción' }
];

const DEMO_USUARIOS = [
  { id: 1, username: 'admin', nivel: 'admin' },
  { id: 2, username: 'user', nivel: 'user' }
];

// Simulación de delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAPI = {
  // Autenticación
  login: async (credentials: { username: string; password: string }) => {
    await delay(800);
    const user = DEMO_USERS.find(u => u.username === credentials.username && u.password === credentials.password);
    if (!user) {
      throw new Error('Credenciales incorrectas');
    }
    return {
      access_token: `${user.nivel}-token`,
      token_type: 'bearer',
      user_level: user.nivel,
      username: user.username
    };
  },

  // Dashboard
  getDashboardMetrics: async () => {
    await delay(500);
    return {
      total_servicios: DEMO_SERVICIOS.length,
      total_clientes: DEMO_CLIENTES.length,
      ingresos_mes: DEMO_SERVICIOS.reduce((sum, s) => sum + s.precio, 0),
      servicios_pendientes: DEMO_SERVICIOS.filter(s => s.estado === 'Pendiente').length,
      servicios_completados: DEMO_SERVICIOS.filter(s => s.estado === 'Completado').length
    };
  },

  // Clientes
  getClientes: async () => {
    await delay(400);
    return DEMO_CLIENTES;
  },

  createCliente: async (cliente: any) => {
    await delay(600);
    const newCliente = { ...cliente, id: DEMO_CLIENTES.length + 1 };
    DEMO_CLIENTES.push(newCliente);
    return newCliente;
  },

  updateCliente: async (id: number, cliente: any) => {
    await delay(600);
    const index = DEMO_CLIENTES.findIndex(c => c.id === id);
    if (index !== -1) {
      DEMO_CLIENTES[index] = { ...DEMO_CLIENTES[index], ...cliente };
      return DEMO_CLIENTES[index];
    }
    throw new Error('Cliente no encontrado');
  },

  deleteCliente: async (id: number) => {
    await delay(600);
    const index = DEMO_CLIENTES.findIndex(c => c.id === id);
    if (index !== -1) {
      DEMO_CLIENTES.splice(index, 1);
      return { message: 'Cliente eliminado correctamente' };
    }
    throw new Error('Cliente no encontrado');
  },

  // Servicios
  getServicios: async () => {
    await delay(500);
    return DEMO_SERVICIOS;
  },

  createServicio: async (servicio: any) => {
    await delay(700);
    const newId = DEMO_SERVICIOS.length + 1;
    const newServicio = { 
      id: newId,
      cliente_nombre: 'Cliente Demo',
      fecha: servicio.fecha,
      hora: servicio.hora,
      tipo_servicio_nombre: 'Servicio Demo',
      precio: 10000,
      estado: servicio.estado,
      equipo_nombre: 'Equipo Demo',
      observaciones: servicio.observaciones
    };
    DEMO_SERVICIOS.push(newServicio);
    // Retornar en formato Servicio
    return {
      id: newId,
      cliente_id: servicio.cliente_id,
      fecha: servicio.fecha,
      hora: servicio.hora,
      tipo_servicio_id: servicio.tipo_servicio_id,
      estado: servicio.estado,
      equipo_id: servicio.equipo_id,
      observaciones: servicio.observaciones
    };
  },

  updateServicio: async (id: number, servicio: any) => {
    await delay(700);
    const index = DEMO_SERVICIOS.findIndex(s => s.id === id);
    if (index !== -1) {
      DEMO_SERVICIOS[index] = { ...DEMO_SERVICIOS[index], ...servicio };
      // Retornar en formato Servicio en lugar de ServicioDetallado
      return {
        id: DEMO_SERVICIOS[index].id,
        cliente_id: 1, // Simplificado para demo
        fecha: DEMO_SERVICIOS[index].fecha,
        hora: DEMO_SERVICIOS[index].hora,
        tipo_servicio_id: 1, // Simplificado para demo
        estado: DEMO_SERVICIOS[index].estado,
        equipo_id: 1, // Simplificado para demo
        observaciones: DEMO_SERVICIOS[index].observaciones
      };
    }
    throw new Error('Servicio no encontrado');
  },

  deleteServicio: async (id: number) => {
    await delay(600);
    const index = DEMO_SERVICIOS.findIndex(s => s.id === id);
    if (index !== -1) {
      DEMO_SERVICIOS.splice(index, 1);
      return { message: 'Servicio eliminado correctamente' };
    }
    throw new Error('Servicio no encontrado');
  },

  // Equipos
  getEquipos: async () => {
    await delay(400);
    return DEMO_EQUIPOS;
  },

  createEquipo: async (equipo: any) => {
    await delay(600);
    const newEquipo = { ...equipo, id: DEMO_EQUIPOS.length + 1 };
    DEMO_EQUIPOS.push(newEquipo);
    return newEquipo;
  },

  deleteEquipo: async (id: number) => {
    await delay(600);
    const index = DEMO_EQUIPOS.findIndex(e => e.id === id);
    if (index !== -1) {
      DEMO_EQUIPOS.splice(index, 1);
      return { message: 'Equipo eliminado correctamente' };
    }
    throw new Error('Equipo no encontrado');
  },

  // Tipos de Servicio
  getTiposServicio: async () => {
    await delay(400);
    return DEMO_TIPOS_SERVICIO;
  },

  createTipoServicio: async (tipo: any) => {
    await delay(600);
    const newTipo = { ...tipo, id: DEMO_TIPOS_SERVICIO.length + 1 };
    DEMO_TIPOS_SERVICIO.push(newTipo);
    return newTipo;
  },

  deleteTipoServicio: async (id: number) => {
    await delay(600);
    const index = DEMO_TIPOS_SERVICIO.findIndex(t => t.id === id);
    if (index !== -1) {
      DEMO_TIPOS_SERVICIO.splice(index, 1);
      return { message: 'Tipo de servicio eliminado correctamente' };
    }
    throw new Error('Tipo de servicio no encontrado');
  },

  // Usuarios
  getUsuarios: async () => {
    await delay(400);
    return DEMO_USUARIOS;
  },

  createUsuario: async (usuario: any) => {
    await delay(600);
    const newUsuario = { ...usuario, id: DEMO_USUARIOS.length + 1 };
    delete newUsuario.password; // No retornar password
    DEMO_USUARIOS.push(newUsuario);
    return newUsuario;
  },

  deleteUsuario: async (id: number) => {
    await delay(600);
    const index = DEMO_USUARIOS.findIndex(u => u.id === id);
    if (index !== -1) {
      DEMO_USUARIOS.splice(index, 1);
      return { message: 'Usuario eliminado correctamente' };
    }
    throw new Error('Usuario no encontrado');
  },

  updateUsuario: async (id: number, userData: any) => {
    await delay(600);
    const index = DEMO_USUARIOS.findIndex(u => u.id === id);
    if (index !== -1) {
      DEMO_USUARIOS[index] = { 
        ...DEMO_USUARIOS[index], 
        username: userData.username,
        nivel: userData.nivel 
      };
      // No retornar password
      const { password, ...updatedUser } = DEMO_USUARIOS[index] as any;
      return updatedUser;
    }
    throw new Error('Usuario no encontrado');
  },

  // Reportes
  generarReporteFechas: async (fechaDesde: string, fechaHasta: string) => {
    await delay(800);
    const serviciosFiltrados = DEMO_SERVICIOS.filter(s => 
      s.fecha >= fechaDesde && s.fecha <= fechaHasta
    );
    return {
      servicios: serviciosFiltrados.map(s => [
        s.fecha, s.hora, s.cliente_nombre, s.tipo_servicio_nombre, 
        s.precio, s.equipo_nombre, s.estado
      ]),
      total_general: serviciosFiltrados.reduce((sum, s) => sum + s.precio, 0),
      cantidad_servicios: serviciosFiltrados.length,
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta
    };
  },

  // Calendario
  getServiciosCalendario: async (year: number, month: number) => {
    await delay(500);
    // Simular datos de calendario
    const calendar = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();
    
    let week = [];
    for (let i = 0; i < firstDay; i++) {
      week.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const fecha = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const serviciosDelDia = DEMO_SERVICIOS.filter(s => s.fecha === fecha);
      
      week.push({
        dia: day,
        fecha,
        servicios: serviciosDelDia.length,
        ingresos: serviciosDelDia.reduce((sum, s) => sum + s.precio, 0)
      });
      
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }
    
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      calendar.push(week);
    }
    
    return calendar;
  }
};
