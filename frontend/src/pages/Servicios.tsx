import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { 
  serviciosAPI, 
  clientesAPI, 
  tiposServicioAPI, 
  equiposAPI,
  ServicioDetallado, 
  Cliente, 
  TipoServicio, 
  Equipo,
  Servicio 
} from '../services/api';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

interface ServicioFormData {
  cliente_id: number;
  fecha: string;
  hora: string;
  tipo_servicio_id: number;
  estado: string;
  equipo_id: number;
  observaciones?: string;
}

const Servicios: React.FC = () => {
  const [servicios, setServicios] = useState<ServicioDetallado[]>([]);
  const [filteredServicios, setFilteredServicios] = useState<ServicioDetallado[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingServicio, setEditingServicio] = useState<ServicioDetallado | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ServicioFormData>();

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    filterServicios();
  }, [servicios, searchTerm, statusFilter]);

  const loadAllData = async () => {
    try {
      const [serviciosData, clientesData, tiposData, equiposData] = await Promise.all([
        serviciosAPI.getAll(),
        clientesAPI.getAll(),
        tiposServicioAPI.getAll(),
        equiposAPI.getAll()
      ]);
      
      setServicios(serviciosData);
      setClientes(clientesData);
      setTiposServicio(tiposData);
      setEquipos(equiposData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const filterServicios = () => {
    let filtered = servicios;

    if (searchTerm) {
      filtered = filtered.filter(servicio => 
        servicio.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        servicio.tipo_servicio_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        servicio.equipo_nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(servicio => servicio.estado === statusFilter);
    }

    setFilteredServicios(filtered);
  };

  const onSubmitAdd = async (data: ServicioFormData) => {
    try {
      await serviciosAPI.create({
        cliente_id: Number(data.cliente_id),
        fecha: data.fecha,
        hora: data.hora,
        tipo_servicio_id: Number(data.tipo_servicio_id),
        estado: data.estado,
        equipo_id: Number(data.equipo_id),
        observaciones: data.observaciones
      });
      toast.success('Servicio creado exitosamente');
      setIsAddDialogOpen(false);
      reset();
      loadAllData();
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Error al crear el servicio');
    }
  };

  const onSubmitEdit = async (data: ServicioFormData) => {
    if (!editingServicio) return;
    
    try {
      await serviciosAPI.update(editingServicio.id, {
        cliente_id: Number(data.cliente_id),
        fecha: data.fecha,
        hora: data.hora,
        tipo_servicio_id: Number(data.tipo_servicio_id),
        estado: data.estado,
        equipo_id: Number(data.equipo_id),
        observaciones: data.observaciones,
        id: editingServicio.id
      });
      toast.success('Servicio actualizado exitosamente');
      setIsEditDialogOpen(false);
      setEditingServicio(null);
      reset();
      loadAllData();
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Error al actualizar el servicio');
    }
  };

  const handleEdit = (servicio: ServicioDetallado) => {
    setEditingServicio(servicio);
    
    // Find the cliente, tipo_servicio, and equipo IDs
    const cliente = clientes.find(c => c.nombre === servicio.cliente_nombre);
    const tipoServicio = tiposServicio.find(t => t.nombre === servicio.tipo_servicio_nombre);
    const equipo = equipos.find(e => e.nombre === servicio.equipo_nombre);
    
    setValue('cliente_id', cliente?.id || 0);
    setValue('fecha', servicio.fecha);
    setValue('hora', servicio.hora);
    setValue('tipo_servicio_id', tipoServicio?.id || 0);
    setValue('estado', servicio.estado);
    setValue('equipo_id', equipo?.id || 0);
    setValue('observaciones', servicio.observaciones || '');
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (servicio: ServicioDetallado) => {
    try {
      await serviciosAPI.delete(servicio.id);
      toast.success('Servicio eliminado exitosamente');
      loadAllData();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Error al eliminar el servicio');
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'Completado':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completado</Badge>;
      case 'Pendiente':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case 'Cancelado':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelado</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />{estado}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const ServicioForm = ({ onSubmit, submitText }: { onSubmit: (data: ServicioFormData) => void, submitText: string }) => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cliente_id">Cliente *</Label>
          <Select onValueChange={(value) => setValue('cliente_id', Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar cliente" />
            </SelectTrigger>
            <SelectContent>
              {clientes.map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.id.toString()}>
                  {cliente.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipo_servicio_id">Tipo de Servicio *</Label>
          <Select onValueChange={(value) => setValue('tipo_servicio_id', Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposServicio.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.id.toString()}>
                  {tipo.nombre} - {formatCurrency(tipo.precio)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fecha">Fecha *</Label>
          <Input
            id="fecha"
            type="date"
            {...register('fecha', { required: 'La fecha es requerida' })}
          />
          {errors.fecha && <p className="text-sm text-red-600">{errors.fecha.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="hora">Hora *</Label>
          <Input
            id="hora"
            type="time"
            {...register('hora', { required: 'La hora es requerida' })}
          />
          {errors.hora && <p className="text-sm text-red-600">{errors.hora.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="equipo_id">Equipo *</Label>
          <Select onValueChange={(value) => setValue('equipo_id', Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar equipo" />
            </SelectTrigger>
            <SelectContent>
              {equipos.map((equipo) => (
                <SelectItem key={equipo.id} value={equipo.id.toString()}>
                  {equipo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="estado">Estado *</Label>
          <Select onValueChange={(value) => setValue('estado', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="Completado">Completado</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea
          id="observaciones"
          {...register('observaciones')}
          placeholder="Observaciones adicionales del servicio..."
          rows={3}
        />
      </div>

      <DialogFooter>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {submitText}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Servicios</h1>
          <p className="text-gray-600 mt-2">Administra los servicios de limpieza programados</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Servicio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Servicio</DialogTitle>
              <DialogDescription>
                Programa un nuevo servicio de limpieza
              </DialogDescription>
            </DialogHeader>
            <ServicioForm onSubmit={onSubmitAdd} submitText="Crear Servicio" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <CardTitle>Lista de Servicios</CardTitle>
            </div>
            <div className="flex space-x-2">
              <Badge variant="secondary">Total: {servicios.length}</Badge>
              <Badge className="bg-green-100 text-green-800">
                Completados: {servicios.filter(s => s.estado === 'Completado').length}
              </Badge>
              <Badge variant="secondary">
                Pendientes: {servicios.filter(s => s.estado === 'Pendiente').length}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por cliente, tipo de servicio o equipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServicios.map((servicio) => (
                  <TableRow key={servicio.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{servicio.cliente_nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{servicio.tipo_servicio_nombre}</div>
                        {servicio.observaciones && (
                          <div className="text-sm text-gray-500 italic">{servicio.observaciones}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-3 w-3 text-gray-500" />
                          <span className="text-sm">{format(new Date(servicio.fecha), 'dd/MM/yyyy')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="text-sm">{servicio.hora}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{servicio.equipo_nombre}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(servicio.estado)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-600">
                          {formatCurrency(servicio.precio)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(servicio)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente 
                                el servicio para "{servicio.cliente_nombre}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(servicio)}>
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!loading && filteredServicios.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>
                {searchTerm || statusFilter !== 'all'
                  ? 'No se encontraron servicios que coincidan con los filtros'
                  : 'No hay servicios registrados'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Servicio</DialogTitle>
            <DialogDescription>
              Modifica la información del servicio
            </DialogDescription>
          </DialogHeader>
          <ServicioForm onSubmit={onSubmitEdit} submitText="Guardar Cambios" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Servicios;
