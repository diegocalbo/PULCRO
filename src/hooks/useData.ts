import { useState, useCallback, useEffect } from 'react';
import { Cliente, TipoServicio, Equipo, Servicio, User, DashboardMetrics } from '@/types';
import { storageService } from '@/services/localStorage';

// Generic hook for CRUD operations
function useEntityData<T extends { id: string }>(
  getEntities: () => T[],
  saveEntities: (entities: T[]) => void
) {
  const [entities, setEntities] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const loadEntities = useCallback(() => {
    setLoading(true);
    try {
      const data = getEntities();
      setEntities(data);
    } catch (error) {
      console.error('Error loading entities:', error);
    } finally {
      setLoading(false);
    }
  }, [getEntities]);

  const createEntity = useCallback((entity: Omit<T, 'id'>) => {
    const newEntity = {
      ...entity,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    } as T;
    
    const updatedEntities = [...entities, newEntity];
    setEntities(updatedEntities);
    saveEntities(updatedEntities);
    return newEntity;
  }, [entities, saveEntities]);

  const updateEntity = useCallback((id: string, updates: Partial<T>) => {
    const updatedEntities = entities.map(entity =>
      entity.id === id ? { ...entity, ...updates } : entity
    );
    setEntities(updatedEntities);
    saveEntities(updatedEntities);
  }, [entities, saveEntities]);

  const deleteEntity = useCallback((id: string) => {
    const updatedEntities = entities.filter(entity => entity.id !== id);
    setEntities(updatedEntities);
    saveEntities(updatedEntities);
  }, [entities, saveEntities]);

  const getEntityById = useCallback((id: string) => {
    return entities.find(entity => entity.id === id);
  }, [entities]);

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  return {
    entities,
    loading,
    createEntity,
    updateEntity,
    deleteEntity,
    getEntityById,
    refreshEntities: loadEntities
  };
}

// Specific hooks for each entity type
export const useClientes = () => {
  const hook = useEntityData<Cliente>(
    storageService.getClientes.bind(storageService),
    storageService.saveClientes.bind(storageService)
  );

  const createCliente = useCallback((clienteData: Omit<Cliente, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => {
    const now = new Date().toISOString();
    return hook.createEntity({
      ...clienteData,
      fechaCreacion: now,
      fechaActualizacion: now
    } as Omit<Cliente, 'id'>);
  }, [hook]);

  const updateCliente = useCallback((id: string, updates: Partial<Cliente>) => {
    hook.updateEntity(id, {
      ...updates,
      fechaActualizacion: new Date().toISOString()
    });
  }, [hook]);

  return {
    ...hook,
    clientes: hook.entities,
    createCliente,
    updateCliente,
    deleteCliente: hook.deleteEntity,
    getClienteById: hook.getEntityById
  };
};

export const useTiposServicio = () => {
  const hook = useEntityData<TipoServicio>(
    storageService.getTiposServicio.bind(storageService),
    storageService.saveTiposServicio.bind(storageService)
  );

  const createTipoServicio = useCallback((tipoData: Omit<TipoServicio, 'id' | 'fechaCreacion'>) => {
    return hook.createEntity({
      ...tipoData,
      fechaCreacion: new Date().toISOString()
    } as Omit<TipoServicio, 'id'>);
  }, [hook]);

  return {
    ...hook,
    tiposServicio: hook.entities,
    createTipoServicio,
    updateTipoServicio: hook.updateEntity,
    deleteTipoServicio: hook.deleteEntity,
    getTipoServicioById: hook.getEntityById
  };
};

export const useEquipos = () => {
  const hook = useEntityData<Equipo>(
    storageService.getEquipos.bind(storageService),
    storageService.saveEquipos.bind(storageService)
  );

  const createEquipo = useCallback((equipoData: Omit<Equipo, 'id' | 'fechaCreacion'>) => {
    return hook.createEntity({
      ...equipoData,
      fechaCreacion: new Date().toISOString()
    } as Omit<Equipo, 'id'>);
  }, [hook]);

  return {
    ...hook,
    equipos: hook.entities,
    createEquipo,
    updateEquipo: hook.updateEntity,
    deleteEquipo: hook.deleteEntity,
    getEquipoById: hook.getEntityById
  };
};

export const useServicios = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);

  const hook = useEntityData<Servicio>(
    storageService.getServicios.bind(storageService),
    storageService.saveServicios.bind(storageService)
  );

  useEffect(() => {
    setClientes(storageService.getClientes());
    setTiposServicio(storageService.getTiposServicio());
    setEquipos(storageService.getEquipos());
  }, []);

  const createServicio = useCallback((servicioData: Omit<Servicio, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => {
    const now = new Date().toISOString();
    return hook.createEntity({
      ...servicioData,
      fechaCreacion: now,
      fechaActualizacion: now
    } as Omit<Servicio, 'id'>);
  }, [hook]);

  const updateServicio = useCallback((id: string, updates: Partial<Servicio>) => {
    hook.updateEntity(id, {
      ...updates,
      fechaActualizacion: new Date().toISOString()
    });
  }, [hook]);

  // Get services with populated related data
  const getServiciosWithDetails = useCallback(() => {
    return hook.entities.map(servicio => {
      const cliente = clientes.find(c => c.id === servicio.clienteId);
      const tipoServicio = tiposServicio.find(t => t.id === servicio.tipoServicioId);
      const equipo = equipos.find(e => e.id === servicio.equipoId);

      return {
        ...servicio,
        clienteNombre: cliente?.nombre || 'Cliente no encontrado',
        tipoServicioNombre: tipoServicio?.nombre || 'Tipo no encontrado',
        equipoNombre: equipo?.nombre || 'Equipo no encontrado',
        precio: tipoServicio?.precio || 0
      };
    });
  }, [hook.entities, clientes, tiposServicio, equipos]);

  const getServiciosByDateRange = useCallback((startDate: string, endDate: string) => {
    return getServiciosWithDetails().filter(servicio => 
      servicio.fecha >= startDate && servicio.fecha <= endDate
    );
  }, [getServiciosWithDetails]);

  const getServiciosByDate = useCallback((date: string) => {
    return getServiciosWithDetails().filter(servicio => servicio.fecha === date);
  }, [getServiciosWithDetails]);

  return {
    ...hook,
    servicios: hook.entities,
    serviciosWithDetails: getServiciosWithDetails(),
    createServicio,
    updateServicio,
    deleteServicio: hook.deleteEntity,
    getServicioById: hook.getEntityById,
    getServiciosByDateRange,
    getServiciosByDate,
    clientes,
    tiposServicio,
    equipos
  };
};

export const useUsers = () => {
  const hook = useEntityData<User>(
    storageService.getUsers.bind(storageService),
    storageService.saveUsers.bind(storageService)
  );

  const createUser = useCallback((userData: Omit<User, 'id' | 'fechaCreacion'>) => {
    return hook.createEntity({
      ...userData,
      fechaCreacion: new Date().toISOString()
    } as Omit<User, 'id'>);
  }, [hook]);

  return {
    ...hook,
    users: hook.entities,
    createUser,
    updateUser: hook.updateEntity,
    deleteUser: hook.deleteEntity,
    getUserById: hook.getEntityById
  };
};

export const useDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  const loadMetrics = useCallback(() => {
    setLoading(true);
    try {
      const dashboardMetrics = storageService.getDashboardMetrics();
      setMetrics(dashboardMetrics);
    } catch (error) {
      console.error('Error loading dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetrics();
    
    // Refresh metrics every 30 seconds
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, [loadMetrics]);

  return {
    metrics,
    loading,
    refreshMetrics: loadMetrics
  };
};
