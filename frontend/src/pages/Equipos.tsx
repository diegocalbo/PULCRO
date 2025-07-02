import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Search, 
  Trash2, 
  UserCheck, 
  Phone, 
  Users, 
  Settings,
  Crown
} from 'lucide-react';
import { equiposAPI, Equipo } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

interface EquipoFormData {
  nombre: string;
  lider?: string;
  telefono?: string;
}

const Equipos: React.FC = () => {
  const { isAdmin } = useAuth();
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [filteredEquipos, setFilteredEquipos] = useState<Equipo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EquipoFormData>();

  useEffect(() => {
    loadEquipos();
  }, []);

  useEffect(() => {
    filterEquipos();
  }, [equipos, searchTerm]);

  const loadEquipos = async () => {
    try {
      const data = await equiposAPI.getAll();
      setEquipos(data);
    } catch (error) {
      console.error('Error loading teams:', error);
      toast.error('Error al cargar los equipos');
    } finally {
      setLoading(false);
    }
  };

  const filterEquipos = () => {
    if (!searchTerm) {
      setFilteredEquipos(equipos);
    } else {
      const filtered = equipos.filter(equipo => 
        equipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipo.lider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipo.telefono?.includes(searchTerm)
      );
      setFilteredEquipos(filtered);
    }
  };

  const onSubmitAdd = async (data: EquipoFormData) => {
    try {
      await equiposAPI.create(data);
      toast.success('Equipo creado exitosamente');
      setIsAddDialogOpen(false);
      reset();
      loadEquipos();
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('Error al crear el equipo');
    }
  };

  const handleDelete = async (equipo: Equipo) => {
    try {
      await equiposAPI.delete(equipo.id);
      toast.success('Equipo eliminado exitosamente');
      loadEquipos();
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error('Error al eliminar el equipo');
    }
  };

  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <CardTitle>Acceso Restringido</CardTitle>
            <CardDescription>
              Solo los administradores pueden gestionar los equipos de trabajo.
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
          <h1 className="text-3xl font-bold text-gray-900">Equipos de Trabajo</h1>
          <p className="text-gray-600 mt-2">Gestiona los equipos y sus integrantes</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Equipo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Equipo de Trabajo</DialogTitle>
              <DialogDescription>
                Define un nuevo equipo con su líder
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmitAdd)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Equipo *</Label>
                <Input
                  id="nombre"
                  {...register('nombre', { required: 'El nombre del equipo es requerido' })}
                  placeholder="Ej: Equipo Alpha"
                />
                {errors.nombre && <p className="text-sm text-red-600">{errors.nombre.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lider">Líder del Equipo</Label>
                <Input
                  id="lider"
                  {...register('lider')}
                  placeholder="Nombre del líder"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono de Contacto</Label>
                <Input
                  id="telefono"
                  {...register('telefono')}
                  placeholder="Número de teléfono"
                />
              </div>

              <DialogFooter>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Crear Equipo
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
              <UserCheck className="h-5 w-5 text-blue-600" />
              <CardTitle>Lista de Equipos</CardTitle>
            </div>
            <Badge variant="secondary" className="text-sm">
              Total: {equipos.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por nombre del equipo, líder o teléfono..."
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
                  <TableHead>Equipo</TableHead>
                  <TableHead>Líder</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipos.map((equipo) => (
                  <TableRow key={equipo.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-cyan-600" />
                        </div>
                        <div>
                          <span className="font-medium">{equipo.nombre}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {equipo.lider ? (
                        <div className="flex items-center space-x-1">
                          <Crown className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium">{equipo.lider}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Sin líder asignado</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {equipo.telefono ? (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{equipo.telefono}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Sin teléfono</span>
                      )}
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
                            <AlertDialogTitle>¿Eliminar equipo?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente 
                              el equipo "{equipo.nombre}" del sistema.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(equipo)}>
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

          {!loading && filteredEquipos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>
                {searchTerm 
                  ? 'No se encontraron equipos que coincidan con la búsqueda'
                  : 'No hay equipos registrados'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Predefined Teams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-600" />
            <span>Equipos Sugeridos</span>
          </CardTitle>
          <CardDescription>
            Configuraciones típicas de equipos para servicios de limpieza
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { nombre: 'Equipo Alpha', lider: 'Juan Pérez', telefono: '11-1234-5678', descripcion: 'Equipo principal para servicios comerciales' },
              { nombre: 'Equipo Beta', lider: 'María González', telefono: '11-2345-6789', descripcion: 'Especialistas en servicios industriales' },
              { nombre: 'Equipo Gamma', lider: 'Carlos López', telefono: '11-3456-7890', descripcion: 'Equipo de emergencias y urgencias' },
              { nombre: 'Equipo Delta', lider: 'Ana Martín', telefono: '11-4567-8901', descripcion: 'Servicios de mantenimiento preventivo' },
              { nombre: 'Equipo Nocturno', lider: 'Roberto Silva', telefono: '11-5678-9012', descripcion: 'Servicios fuera de horario laboral' },
              { nombre: 'Equipo Técnico', lider: 'Laura Torres', telefono: '11-6789-0123', descripcion: 'Inspecciones y certificaciones' }
            ].map((equipo, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-2 mb-2">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium text-gray-900">{equipo.nombre}</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-1">
                    <Crown className="h-3 w-3 text-yellow-600" />
                    <span className="text-gray-600">Líder: {equipo.lider}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-600">{equipo.telefono}</span>
                  </div>
                  <p className="text-gray-500 text-xs">{equipo.descripcion}</p>
                </div>
                <div className="mt-3">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setValue('nombre', equipo.nombre);
                      setValue('lider', equipo.lider);
                      setValue('telefono', equipo.telefono);
                      setIsAddDialogOpen(true);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Crear Equipo
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

export default Equipos;
