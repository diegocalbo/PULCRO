import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Search, 
  Trash2, 
  Wrench, 
  DollarSign,
  FileText,
  Settings
} from 'lucide-react';
import { tiposServicioAPI, TipoServicio } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

interface TipoServicioFormData {
  nombre: string;
  precio: number;
  descripcion?: string;
}

const TiposServicio: React.FC = () => {
  const { isAdmin } = useAuth();
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]);
  const [filteredTipos, setFilteredTipos] = useState<TipoServicio[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TipoServicioFormData>();

  useEffect(() => {
    loadTiposServicio();
  }, []);

  useEffect(() => {
    filterTipos();
  }, [tiposServicio, searchTerm]);

  const loadTiposServicio = async () => {
    try {
      const data = await tiposServicioAPI.getAll();
      setTiposServicio(data);
    } catch (error) {
      console.error('Error loading service types:', error);
      toast.error('Error al cargar los tipos de servicio');
    } finally {
      setLoading(false);
    }
  };

  const filterTipos = () => {
    if (!searchTerm) {
      setFilteredTipos(tiposServicio);
    } else {
      const filtered = tiposServicio.filter(tipo => 
        tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tipo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTipos(filtered);
    }
  };

  const onSubmitAdd = async (data: TipoServicioFormData) => {
    try {
      await tiposServicioAPI.create({
        nombre: data.nombre,
        precio: Number(data.precio),
        descripcion: data.descripcion
      });
      toast.success('Tipo de servicio creado exitosamente');
      setIsAddDialogOpen(false);
      reset();
      loadTiposServicio();
    } catch (error) {
      console.error('Error creating service type:', error);
      toast.error('Error al crear el tipo de servicio');
    }
  };

  const handleDelete = async (tipo: TipoServicio) => {
    try {
      await tiposServicioAPI.delete(tipo.id);
      toast.success('Tipo de servicio eliminado exitosamente');
      loadTiposServicio();
    } catch (error) {
      console.error('Error deleting service type:', error);
      toast.error('Error al eliminar el tipo de servicio');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <CardTitle>Acceso Restringido</CardTitle>
            <CardDescription>
              Solo los administradores pueden gestionar los tipos de servicio.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tipos de Servicio</h1>
          <p className="text-gray-600 mt-2">Gestiona los tipos de servicio y sus precios</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Tipo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Tipo de Servicio</DialogTitle>
              <DialogDescription>
                Define un nuevo tipo de servicio con su precio
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmitAdd)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  {...register('nombre', { required: 'El nombre es requerido' })}
                  placeholder="Ej: Limpieza de campanas"
                />
                {errors.nombre && <p className="text-sm text-red-600">{errors.nombre.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="precio">Precio *</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  {...register('precio', { 
                    required: 'El precio es requerido',
                    min: { value: 0, message: 'El precio debe ser mayor a 0' }
                  })}
                  placeholder="0.00"
                />
                {errors.precio && <p className="text-sm text-red-600">{errors.precio.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  {...register('descripcion')}
                  placeholder="Descripción del servicio..."
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Crear Tipo
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              <CardTitle>Lista de Tipos de Servicio</CardTitle>
            </div>
            <Badge variant="secondary" className="text-sm">
              Total: {tiposServicio.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
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
                  <TableHead>Servicio</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTipos.map((tipo) => (
                  <TableRow key={tipo.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <Wrench className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <span className="font-medium">{tipo.nombre}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {tipo.descripcion ? (
                        <div className="flex items-center space-x-1">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{tipo.descripcion}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Sin descripción</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-600">
                          {formatCurrency(tipo.precio)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar tipo de servicio?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente 
                              el tipo de servicio "{tipo.nombre}" del sistema.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(tipo)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!loading && filteredTipos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>
                {searchTerm 
                  ? 'No se encontraron tipos de servicio que coincidan con la búsqueda'
                  : 'No hay tipos de servicio registrados'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Predefined Service Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-green-600" />
            <span>Tipos de Servicio Comunes</span>
          </CardTitle>
          <CardDescription>
            Tipos de servicio típicos para empresas de limpieza de campanas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { nombre: 'Limpieza de Campanas Básica', precio: 15000, descripcion: 'Limpieza estándar de sistema de extracción' },
              { nombre: 'Limpieza de Campanas Premium', precio: 25000, descripcion: 'Limpieza completa con desengrase profundo' },
              { nombre: 'Mantenimiento de Filtros', precio: 8000, descripcion: 'Limpieza y reemplazo de filtros' },
              { nombre: 'Limpieza de Ductos', precio: 35000, descripcion: 'Limpieza completa del sistema de ductos' },
              { nombre: 'Inspección y Certificación', precio: 12000, descripcion: 'Inspección técnica y emisión de certificado' },
              { nombre: 'Servicio de Emergencia', precio: 40000, descripcion: 'Atención urgente fuera de horario' }
            ].map((servicio, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2">{servicio.nombre}</h4>
                <p className="text-sm text-gray-600 mb-2">{servicio.descripcion}</p>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-medium">{formatCurrency(servicio.precio)}</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setValue('nombre', servicio.nombre);
                      setValue('precio', servicio.precio);
                      setValue('descripcion', servicio.descripcion);
                      setIsAddDialogOpen(true);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Usar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TiposServicio;
