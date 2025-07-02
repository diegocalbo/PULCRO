import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Search, 
  Trash2, 
  Settings, 
  User, 
  Shield, 
  Key, 
  ShieldCheck,
  Eye,
  EyeOff,
  Edit
} from 'lucide-react';
import { usuariosAPI, Usuario } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

interface UsuarioFormData {
  username: string;
  password: string;
  nivel: string;
}

interface EditUsuarioFormData {
  password: string;
  nivel: string;
}

const Usuarios: React.FC = () => {
  const { isAdmin } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<UsuarioFormData>();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, setValue: setValueEdit, formState: { errors: errorsEdit } } = useForm<EditUsuarioFormData>();

  useEffect(() => {
    if (isAdmin()) {
      loadUsuarios();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterUsuarios();
  }, [usuarios, searchTerm]);

  const loadUsuarios = async () => {
    try {
      const data = await usuariosAPI.getAll();
      setUsuarios(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const filterUsuarios = () => {
    if (!searchTerm) {
      setFilteredUsuarios(usuarios);
    } else {
      const filtered = usuarios.filter(usuario => 
        usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.nivel.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsuarios(filtered);
    }
  };

  const onSubmitAdd = async (data: UsuarioFormData) => {
    try {
      await usuariosAPI.create({
        username: data.username,
        password: data.password,
        nivel: data.nivel
      });
      toast.success('Usuario creado exitosamente');
      setIsAddDialogOpen(false);
      reset();
      loadUsuarios();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error al crear el usuario');
    }
  };

  const handleDelete = async (usuario: Usuario) => {
    try {
      await usuariosAPI.delete(usuario.id);
      toast.success('Usuario eliminado exitosamente');
      loadUsuarios();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar el usuario');
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUser(usuario);
    setValueEdit('nivel', usuario.nivel);
    setIsEditDialogOpen(true);
  };

  const onSubmitEdit = async (data: EditUsuarioFormData) => {
    if (!editingUser) return;
    
    try {
      await usuariosAPI.update(editingUser.id, {
        username: editingUser.username,
        password: data.password,
        nivel: data.nivel
      });
      toast.success('Usuario actualizado exitosamente');
      setIsEditDialogOpen(false);
      resetEdit();
      setEditingUser(null);
      loadUsuarios();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error al actualizar el usuario');
    }
  };

  const getLevelBadge = (nivel: string) => {
    return nivel === 'admin' ? (
      <Badge className="bg-blue-100 text-blue-800">
        <Shield className="h-3 w-3 mr-1" />
        Administrador
      </Badge>
    ) : (
      <Badge variant="secondary">
        <User className="h-3 w-3 mr-1" />
        Usuario
      </Badge>
    );
  };

  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <CardTitle>Acceso Restringido</CardTitle>
            <CardDescription>
              Solo los administradores pueden gestionar usuarios del sistema.
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-2">Administra los usuarios del sistema y sus permisos</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Usuario</DialogTitle>
              <DialogDescription>
                Crea un nuevo usuario del sistema con sus permisos
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmitAdd)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de Usuario *</Label>
                <Input
                  id="username"
                  {...register('username', { required: 'El nombre de usuario es requerido' })}
                  placeholder="Nombre de usuario"
                />
                {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { 
                      required: 'La contraseña es requerida',
                      minLength: { value: 4, message: 'La contraseña debe tener al menos 4 caracteres' }
                    })}
                    placeholder="Contraseña"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nivel">Nivel de Usuario *</Label>
                <Select onValueChange={(value) => setValue('nivel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Usuario</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>Administrador</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Crear Usuario
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifica la contraseña y permisos de {editingUser?.username}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(onSubmitEdit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre de Usuario</Label>
              <Input
                value={editingUser?.username || ''}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500">El nombre de usuario no se puede modificar</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password">Nueva Contraseña *</Label>
              <div className="relative">
                <Input
                  id="edit-password"
                  type={showEditPassword ? 'text' : 'password'}
                  {...registerEdit('password', { 
                    required: 'La contraseña es requerida',
                    minLength: { value: 4, message: 'La contraseña debe tener al menos 4 caracteres' }
                  })}
                  placeholder="Nueva contraseña"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                >
                  {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errorsEdit.password && <p className="text-sm text-red-600">{errorsEdit.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-nivel">Nivel de Usuario *</Label>
              <Select 
                value={editingUser?.nivel} 
                onValueChange={(value) => setValueEdit('nivel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Usuario</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Administrador</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetEdit();
                  setEditingUser(null);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Actualizar Usuario
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <CardTitle>Lista de Usuarios</CardTitle>
            </div>
            <div className="flex space-x-2">
              <Badge variant="secondary">Total: {usuarios.length}</Badge>
              <Badge className="bg-blue-100 text-blue-800">
                Admins: {usuarios.filter(u => u.nivel === 'admin').length}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por nombre de usuario o nivel..."
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
                  <TableHead>Usuario</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Permisos</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          usuario.nivel === 'admin' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          {usuario.nivel === 'admin' ? (
                            <Shield className="h-4 w-4 text-blue-600" />
                          ) : (
                            <User className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <span className="font-medium">{usuario.username}</span>
                          <div className="text-xs text-gray-500">ID: {usuario.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getLevelBadge(usuario.nivel)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {usuario.nivel === 'admin' ? (
                          <div className="text-sm space-y-1">
                            <div className="flex items-center space-x-1">
                              <ShieldCheck className="h-3 w-3 text-green-600" />
                              <span className="text-green-600">Acceso completo</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Key className="h-3 w-3 text-blue-600" />
                              <span className="text-blue-600">Gestión de usuarios</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>Acceso estándar</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex space-x-2 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(usuario)}
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente 
                                el usuario "{usuario.username}" del sistema.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(usuario)}>
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

          {!loading && filteredUsuarios.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>
                {searchTerm 
                  ? 'No se encontraron usuarios que coincidan con la búsqueda'
                  : 'No hay usuarios registrados'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <span>Información de Seguridad</span>
          </CardTitle>
          <CardDescription>
            Mejores prácticas para la gestión de usuarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Niveles de Usuario:</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Administrador</div>
                    <div className="text-sm text-blue-700">Acceso completo al sistema</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <User className="h-4 w-4 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Usuario</div>
                    <div className="text-sm text-gray-700">Acceso limitado, sin gestión de usuarios</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Recomendaciones:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Use contraseñas seguras de al menos 8 caracteres</li>
                <li>• Limite los usuarios administradores</li>
                <li>• Revise periódicamente los accesos</li>
                <li>• Elimine usuarios inactivos</li>
                <li>• Mantenga un registro de cambios</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Usuarios;
