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
  Edit, 
  Trash2, 
  Users, 
  Building, 
  Phone, 
  Mail, 
  MapPin,
  Hash
} from 'lucide-react';
import { clientesAPI, Cliente } from '../services/api';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

interface ClienteFormData {
  nombre: string;
  empresa?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  cuit?: string;
}

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ClienteFormData>();

  useEffect(() => {
    loadClientes();
  }, []);

  useEffect(() => {
    filterClientes();
  }, [clientes, searchTerm]);

  const loadClientes = async () => {
    try {
      const data = await clientesAPI.getAll();
      setClientes(data);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const filterClientes = () => {
    if (!searchTerm) {
      setFilteredClientes(clientes);
    } else {
      const filtered = clientes.filter(cliente => 
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.telefono?.includes(searchTerm)
      );
      setFilteredClientes(filtered);
    }
  };

  const onSubmitAdd = async (data: ClienteFormData) => {
    try {
      await clientesAPI.create(data);
      toast.success('Cliente creado exitosamente');
      setIsAddDialogOpen(false);
      reset();
      loadClientes();
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Error al crear el cliente');
    }
  };

  const onSubmitEdit = async (data: ClienteFormData) => {
    if (!editingCliente) return;
    
    try {
      await clientesAPI.update(editingCliente.id, data);
      toast.success('Cliente actualizado exitosamente');
      setIsEditDialogOpen(false);
      setEditingCliente(null);
      reset();
      loadClientes();
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Error al actualizar el cliente');
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setValue('nombre', cliente.nombre);
    setValue('empresa', cliente.empresa || '');
    setValue('telefono', cliente.telefono || '');
    setValue('email', cliente.email || '');
    setValue('direccion', cliente.direccion || '');
    setValue('cuit', cliente.cuit || '');
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (cliente: Cliente) => {
    try {
      await clientesAPI.delete(cliente.id);
      toast.success('Cliente eliminado exitosamente');
      loadClientes();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Error al eliminar el cliente');
    }
  };

  const ClienteForm = ({ onSubmit, submitText }: { onSubmit: (data: ClienteFormData) => void, submitText: string }) => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            {...register('nombre', { required: 'El nombre es requerido' })}
            placeholder="Nombre completo"
          />
          {errors.nombre && <p className="text-sm text-red-600">{errors.nombre.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="empresa">Empresa</Label>
          <Input
            id="empresa"
            {...register('empresa')}
            placeholder="Nombre de la empresa"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            {...register('telefono')}
            placeholder="Número de teléfono"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="correo@ejemplo.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion">Dirección</Label>
        <Input
          id="direccion"
          {...register('direccion')}
          placeholder="Dirección completa"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cuit">CUIT</Label>
        <Input
          id="cuit"
          {...register('cuit')}
          placeholder="20-12345678-9"
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-600 mt-2">Administra la información de tus clientes</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Ingresa la información del nuevo cliente
              </DialogDescription>
            </DialogHeader>
            <ClienteForm onSubmit={onSubmitAdd} submitText="Crear Cliente" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <CardTitle>Lista de Clientes</CardTitle>
            </div>
            <Badge variant="secondary" className="text-sm">
              Total: {clientes.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por nombre, empresa, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>CUIT</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{cliente.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {cliente.empresa ? (
                        <div className="flex items-center space-x-1">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span>{cliente.empresa}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {cliente.telefono && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3 text-gray-500" />
                            <span className="text-sm">{cliente.telefono}</span>
                          </div>
                        )}
                        {cliente.email && (
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3 text-gray-500" />
                            <span className="text-sm">{cliente.email}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {cliente.direccion ? (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{cliente.direccion}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {cliente.cuit ? (
                        <div className="flex items-center space-x-1">
                          <Hash className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-mono">{cliente.cuit}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(cliente)}
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
                              <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente 
                                el cliente "{cliente.nombre}" del sistema.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(cliente)}>
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

          {!loading && filteredClientes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>
                {searchTerm 
                  ? 'No se encontraron clientes que coincidan con la búsqueda'
                  : 'No hay clientes registrados'
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
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Modifica la información del cliente
            </DialogDescription>
          </DialogHeader>
          <ClienteForm onSubmit={onSubmitEdit} submitText="Guardar Cambios" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clientes;
