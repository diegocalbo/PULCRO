import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Clock, User, Wrench, Trash2, Edit, Search, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { storageService } from '@/services/localStorage';
import { formatCurrencyARS, formatDateAR, getStatusColor, getPriorityColor } from '@/lib/formatters';
import { Servicio, Cliente, TipoServicio, Equipo } from '@/types';

const Servicios: React.FC = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    clienteId: '',
    tipoServicioId: '',
    equipoId: '',
    fecha: '',
    hora: '',
    estado: 'Programado' as 'Programado' | 'En Curso' | 'Realizado' | 'Cancelado' | 'Pendiente',
    prioridad: 'Media' as 'Baja' | 'Media' | 'Alta' | 'Urgente',
    observaciones: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setServicios(storageService.getServicios());
    setClientes(storageService.getClientes());
    setTiposServicio(storageService.getTiposServicio());
    setEquipos(storageService.getEquipos());
  };

  const resetForm = () => {
    setFormData({
      clienteId: '',
      tipoServicioId: '',
      equipoId: '',
      fecha: '',
      hora: '',
      estado: 'Programado' as 'Programado' | 'En Curso' | 'Realizado' | 'Cancelado' | 'Pendiente',
      prioridad: 'Media' as 'Baja' | 'Media' | 'Alta' | 'Urgente',
      observaciones: ''
    });
  };

  const handleCreate = () => {
    if (!formData.clienteId || !formData.tipoServicioId || !formData.equipoId || !formData.fecha || !formData.hora) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    const cliente = clientes.find(c => c.id === formData.clienteId);
    if (!cliente) return;

    const newServicio: Servicio = {
      id: Date.now().toString(),
      clienteId: formData.clienteId,
      tipoServicioId: formData.tipoServicioId,
      equipoId: formData.equipoId,
      fecha: formData.fecha,
      hora: formData.hora,
      estado: formData.estado,
      direccion: cliente.direccion,
      observaciones: formData.observaciones,
      prioridad: formData.prioridad,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };

    const updatedServicios = [...servicios, newServicio];
    setServicios(updatedServicios);
    storageService.saveServicios(updatedServicios);

    toast({
      title: "Éxito",
      description: "Servicio creado correctamente",
    });

    resetForm();
    setIsCreateDialogOpen(false);
  };

  const handleEdit = () => {
    if (!selectedServicio || !formData.clienteId || !formData.tipoServicioId || !formData.equipoId || !formData.fecha || !formData.hora) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    const cliente = clientes.find(c => c.id === formData.clienteId);
    if (!cliente) return;

    const updatedServicio: Servicio = {
      ...selectedServicio,
      clienteId: formData.clienteId,
      tipoServicioId: formData.tipoServicioId,
      equipoId: formData.equipoId,
      fecha: formData.fecha,
      hora: formData.hora,
      estado: formData.estado,
      direccion: cliente.direccion,
      observaciones: formData.observaciones,
      prioridad: formData.prioridad,
      fechaActualizacion: new Date().toISOString()
    };

    const updatedServicios = servicios.map(s => s.id === selectedServicio.id ? updatedServicio : s);
    setServicios(updatedServicios);
    storageService.saveServicios(updatedServicios);

    toast({
      title: "Éxito",
      description: "Servicio actualizado correctamente",
    });

    resetForm();
    setIsEditDialogOpen(false);
    setSelectedServicio(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este servicio?')) {
      const updatedServicios = servicios.filter(s => s.id !== id);
      setServicios(updatedServicios);
      storageService.saveServicios(updatedServicios);

      toast({
        title: "Éxito",
        description: "Servicio eliminado correctamente",
      });
    }
  };

  const openEditDialog = (servicio: Servicio) => {
    setSelectedServicio(servicio);
    setFormData({
      clienteId: servicio.clienteId,
      tipoServicioId: servicio.tipoServicioId,
      equipoId: servicio.equipoId,
      fecha: servicio.fecha,
      hora: servicio.hora,
      estado: servicio.estado,
      prioridad: servicio.prioridad,
      observaciones: servicio.observaciones || ''
    });
    setIsEditDialogOpen(true);
  };

  const getClienteName = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : 'Cliente no encontrado';
  };

  const getTipoServicioInfo = (tipoId: string) => {
    const tipo = tiposServicio.find(t => t.id === tipoId);
    return tipo ? { nombre: tipo.nombre, precio: tipo.precio } : { nombre: 'Tipo no encontrado', precio: 0 };
  };

  const getEquipoName = (equipoId: string) => {
    const equipo = equipos.find(e => e.id === equipoId);
    return equipo ? equipo.nombre : 'Equipo no encontrado';
  };

  const filteredServicios = servicios.filter(servicio => {
    const matchesSearch = getClienteName(servicio.clienteId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getTipoServicioInfo(servicio.tipoServicioId).nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         servicio.observaciones?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || servicio.estado === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const sortedServicios = filteredServicios.sort((a, b) => {
    const dateA = new Date(`${a.fecha} ${a.hora}`);
    const dateB = new Date(`${b.fecha} ${b.hora}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Servicios</h1>
          <p className="text-gray-600">Gestión de servicios de limpieza de campanas</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Servicio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Servicio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Cliente *</label>
                <Select value={formData.clienteId} onValueChange={(value) => setFormData({...formData, clienteId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map(cliente => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Tipo de Servicio *</label>
                <Select value={formData.tipoServicioId} onValueChange={(value) => setFormData({...formData, tipoServicioId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposServicio.map(tipo => (
                      <SelectItem key={tipo.id} value={tipo.id}>
                        {tipo.nombre} - {formatCurrencyARS(tipo.precio)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Equipo *</label>
                <Select value={formData.equipoId} onValueChange={(value) => setFormData({...formData, equipoId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipos.filter(e => e.activo).map(equipo => (
                      <SelectItem key={equipo.id} value={equipo.id}>
                        {equipo.nombre} - {equipo.lider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Fecha *</label>
                  <Input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Hora *</label>
                  <Input
                    type="time"
                    value={formData.hora}
                    onChange={(e) => setFormData({...formData, hora: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Estado</label>
                  <Select value={formData.estado} onValueChange={(value: 'Programado' | 'En Curso' | 'Realizado' | 'Cancelado' | 'Pendiente') => setFormData({...formData, estado: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Programado">Programado</SelectItem>
                      <SelectItem value="En Curso">En Curso</SelectItem>
                      <SelectItem value="Realizado">Realizado</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Prioridad</label>
                  <Select value={formData.prioridad} onValueChange={(value: 'Baja' | 'Media' | 'Alta' | 'Urgente') => setFormData({...formData, prioridad: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Baja">Baja</SelectItem>
                      <SelectItem value="Urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Observaciones</label>
                <Textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  placeholder="Observaciones adicionales..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreate} className="flex-1">
                  Crear Servicio
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="Programado">Programado</SelectItem>
            <SelectItem value="En Curso">En Curso</SelectItem>
            <SelectItem value="Realizado">Realizado</SelectItem>
            <SelectItem value="Cancelado">Cancelado</SelectItem>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedServicios.map((servicio) => {
          const clienteInfo = clientes.find(c => c.id === servicio.clienteId);
          const tipoInfo = getTipoServicioInfo(servicio.tipoServicioId);
          const equipoInfo = equipos.find(e => e.id === servicio.equipoId);

          return (
            <Card key={servicio.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{clienteInfo?.nombre}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(servicio)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(servicio.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(servicio.estado)}>
                    {servicio.estado}
                  </Badge>
                  <Badge className={getPriorityColor(servicio.prioridad)}>
                    {servicio.prioridad}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDateAR(servicio.fecha)} a las {servicio.hora}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Wrench className="w-4 h-4" />
                  <span>{tipoInfo.nombre}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{equipoInfo?.nombre} ({equipoInfo?.lider})</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{servicio.direccion}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-lg font-semibold text-green-600">
                    {formatCurrencyARS(tipoInfo.precio)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ID: {servicio.id}
                  </span>
                </div>

                {servicio.observaciones && (
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    {servicio.observaciones}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sortedServicios.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay servicios</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? 'No se encontraron servicios con los filtros aplicados.'
              : 'Comience creando un nuevo servicio.'
            }
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Servicio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Cliente *</label>
              <Select value={formData.clienteId} onValueChange={(value) => setFormData({...formData, clienteId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map(cliente => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Tipo de Servicio *</label>
              <Select value={formData.tipoServicioId} onValueChange={(value) => setFormData({...formData, tipoServicioId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposServicio.map(tipo => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.nombre} - {formatCurrencyARS(tipo.precio)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Equipo *</label>
              <Select value={formData.equipoId} onValueChange={(value) => setFormData({...formData, equipoId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipo" />
                </SelectTrigger>
                <SelectContent>
                  {equipos.filter(e => e.activo).map(equipo => (
                    <SelectItem key={equipo.id} value={equipo.id}>
                      {equipo.nombre} - {equipo.lider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Fecha *</label>
                <Input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Hora *</label>
                <Input
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({...formData, hora: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Estado</label>
                <Select value={formData.estado} onValueChange={(value: 'Programado' | 'En Curso' | 'Realizado' | 'Cancelado' | 'Pendiente') => setFormData({...formData, estado: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Programado">Programado</SelectItem>
                    <SelectItem value="En Curso">En Curso</SelectItem>
                    <SelectItem value="Realizado">Realizado</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Prioridad</label>
                <Select value={formData.prioridad} onValueChange={(value: 'Baja' | 'Media' | 'Alta' | 'Urgente') => setFormData({...formData, prioridad: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Baja">Baja</SelectItem>
                    <SelectItem value="Urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Observaciones</label>
              <Textarea
                value={formData.observaciones}
                onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                placeholder="Observaciones adicionales..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleEdit} className="flex-1">
                Guardar Cambios
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Servicios;
