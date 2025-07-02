import { mockAPI } from './mockApi';

const API_BASE_URL = 'http://localhost:8003';
const USE_MOCK_API = true; // Cambiar a false cuando el backend esté disponible

// Tipos TypeScript
export interface Cliente {
  id: number;
  nombre: string;
  empresa?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  cuit?: string;
}

export interface TipoServicio {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
}

export interface Equipo {
  id: number;
  nombre: string;
  lider?: string;
  telefono?: string;
}

export interface Servicio {
  id: number;
  cliente_id: number;
  fecha: string;
  hora: string;
  tipo_servicio_id: number;
  estado: string;
  equipo_id: number;
  observaciones?: string;
}

export interface ServicioDetallado {
  id: number;
  cliente_nombre: string;
  fecha: string;
  hora: string;
  tipo_servicio_nombre: string;
  precio: number;
  estado: string;
  equipo_nombre: string;
  observaciones?: string;
}

export interface Usuario {
  id: number;
  username: string;
  nivel: string;
}

export interface DashboardMetrics {
  total_servicios: number;
  total_clientes: number;
  ingresos_mes: number;
  servicios_pendientes: number;
  servicios_completados: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_level: string;
  username: string;
}

// Configuración de headers
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Función para hacer requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// API de autenticación
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    if (USE_MOCK_API) {
      return mockAPI.login(credentials);
    }
    return apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_level');
    localStorage.removeItem('username');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getUserLevel: () => {
    return localStorage.getItem('user_level') || 'user';
  },

  getUsername: () => {
    return localStorage.getItem('username') || '';
  }
};

// API de dashboard
export const dashboardAPI = {
  getMetrics: (): Promise<DashboardMetrics> => {
    if (USE_MOCK_API) {
      return mockAPI.getDashboardMetrics();
    }
    return apiRequest('/dashboard/metrics');
  }
};

// API de clientes
export const clientesAPI = {
  getAll: (): Promise<Cliente[]> => {
    if (USE_MOCK_API) {
      return mockAPI.getClientes();
    }
    return apiRequest('/clientes');
  },

  create: (cliente: Omit<Cliente, 'id'>): Promise<Cliente> => {
    if (USE_MOCK_API) {
      return mockAPI.createCliente(cliente);
    }
    return apiRequest('/clientes', {
      method: 'POST',
      body: JSON.stringify(cliente),
    });
  },

  update: (id: number, cliente: Partial<Cliente>): Promise<Cliente> => {
    if (USE_MOCK_API) {
      return mockAPI.updateCliente(id, cliente);
    }
    return apiRequest(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cliente),
    });
  },

  delete: (id: number): Promise<{ message: string }> => {
    if (USE_MOCK_API) {
      return mockAPI.deleteCliente(id);
    }
    return apiRequest(`/clientes/${id}`, {
      method: 'DELETE',
    });
  }
};

// API de tipos de servicio
export const tiposServicioAPI = {
  getAll: (): Promise<TipoServicio[]> => {
    if (USE_MOCK_API) {
      return mockAPI.getTiposServicio();
    }
    return apiRequest('/tipos-servicio');
  },

  create: (tipo: Omit<TipoServicio, 'id'>): Promise<TipoServicio> => {
    if (USE_MOCK_API) {
      return mockAPI.createTipoServicio(tipo);
    }
    return apiRequest('/tipos-servicio', {
      method: 'POST',
      body: JSON.stringify(tipo),
    });
  },

  delete: (id: number): Promise<{ message: string }> => {
    if (USE_MOCK_API) {
      return mockAPI.deleteTipoServicio(id);
    }
    return apiRequest(`/tipos-servicio/${id}`, {
      method: 'DELETE',
    });
  }
};

// API de equipos
export const equiposAPI = {
  getAll: (): Promise<Equipo[]> => {
    if (USE_MOCK_API) {
      return mockAPI.getEquipos();
    }
    return apiRequest('/equipos');
  },

  create: (equipo: Omit<Equipo, 'id'>): Promise<Equipo> => {
    if (USE_MOCK_API) {
      return mockAPI.createEquipo(equipo);
    }
    return apiRequest('/equipos', {
      method: 'POST',
      body: JSON.stringify(equipo),
    });
  },

  delete: (id: number): Promise<{ message: string }> => {
    if (USE_MOCK_API) {
      return mockAPI.deleteEquipo(id);
    }
    return apiRequest(`/equipos/${id}`, {
      method: 'DELETE',
    });
  }
};

// API de servicios
export const serviciosAPI = {
  getAll: (): Promise<ServicioDetallado[]> => {
    if (USE_MOCK_API) {
      return mockAPI.getServicios();
    }
    return apiRequest('/servicios');
  },

  create: (servicio: Omit<Servicio, 'id'>): Promise<Servicio> => {
    if (USE_MOCK_API) {
      return mockAPI.createServicio(servicio);
    }
    return apiRequest('/servicios', {
      method: 'POST',
      body: JSON.stringify(servicio),
    });
  },

  update: (id: number, servicio: Partial<Servicio>): Promise<Servicio> => {
    if (USE_MOCK_API) {
      return mockAPI.updateServicio(id, servicio);
    }
    return apiRequest(`/servicios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(servicio),
    });
  },

  delete: (id: number): Promise<{ message: string }> => {
    if (USE_MOCK_API) {
      return mockAPI.deleteServicio(id);
    }
    return apiRequest(`/servicios/${id}`, {
      method: 'DELETE',
    });
  }
};

// API de usuarios
export const usuariosAPI = {
  getAll: (): Promise<Usuario[]> => {
    if (USE_MOCK_API) {
      return mockAPI.getUsuarios();
    }
    return apiRequest('/usuarios');
  },

  create: (usuario: Omit<Usuario, 'id'> & { password: string }): Promise<Usuario> => {
    if (USE_MOCK_API) {
      return mockAPI.createUsuario(usuario);
    }
    return apiRequest('/usuarios', {
      method: 'POST',
      body: JSON.stringify(usuario),
    });
  },

  update: (id: number, usuario: { username: string; password: string; nivel: string }): Promise<Usuario> => {
    if (USE_MOCK_API) {
      return mockAPI.updateUsuario(id, usuario);
    }
    return apiRequest(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuario),
    });
  },

  delete: (id: number): Promise<{ message: string }> => {
    if (USE_MOCK_API) {
      return mockAPI.deleteUsuario(id);
    }
    return apiRequest(`/usuarios/${id}`, {
      method: 'DELETE',
    });
  }
};

// API de reportes
export const reportesAPI = {
  generarReporteFechas: (fecha_desde: string, fecha_hasta: string) => {
    if (USE_MOCK_API) {
      return mockAPI.generarReporteFechas(fecha_desde, fecha_hasta);
    }
    return apiRequest('/reportes/fechas', {
      method: 'POST',
      body: JSON.stringify({ fecha_desde, fecha_hasta }),
    });
  }
};

// API de calendario
export const calendarioAPI = {
  getServiciosMes: (year: number, month: number) => {
    if (USE_MOCK_API) {
      return mockAPI.getServiciosCalendario(year, month);
    }
    return apiRequest(`/calendario/${year}/${month}`);
  }
};
