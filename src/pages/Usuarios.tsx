import React, { useState, useEffect } from 'react';
import { Plus, Users, Shield, User, Trash2, Edit, Search, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { storageService } from '@/services/localStorage';
import { formatDateAR } from '@/lib/formatters';
import { User as UserType } from '@/types';

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<UserType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nombre: '',
    email: '',
    nivel: 'user' as 'admin' | 'user'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsuarios(storageService.getUsers());
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      nombre: '',
      email: '',
      nivel: 'user'
    });
    setShowPassword(false);
    setShowEditPassword(false);
  };

  const validateForm = (isEdit: boolean = false) => {
    if (!formData.username.trim()) {
      toast({
        title: "Error",
        description: "El nombre de usuario es obligatorio",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre completo es obligatorio",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({
        title: "Error",
        description: "Debe ingresar un email válido",
        variant: "destructive",
      });
      return false;
    }

    if (!isEdit && !formData.password.trim()) {
      toast({
        title: "Error",
        description: "La contraseña es obligatoria",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password && formData.password.length < 4) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 4 caracteres",
        variant: "destructive",
      });
      return false;
    }

    // Check if username already exists (for create or different user in edit)
    const existingUser = usuarios.find(u => 
      u.username.toLowerCase() === formData.username.toLowerCase() && 
      (!isEdit || u.id !== selectedUsuario?.id)
    );
    
    if (existingUser) {
      toast({
        title: "Error",
        description: "Ya existe un usuario con ese nombre de usuario",
        variant: "destructive",
      });
      return false;
    }

    // Check if email already exists (for create or different user in edit)
    const existingEmail = usuarios.find(u => 
      u.email.toLowerCase() === formData.email.toLowerCase() && 
      (!isEdit || u.id !== selectedUsuario?.id)
    );
    
    if (existingEmail) {
      toast({
        title: "Error",
        description: "Ya existe un usuario con ese email",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCreate = () => {
    if (!validateForm()) return;

    const newUsuario: UserType = {
      id: Date.now().toString(),
      username: formData.username.trim(),
      password: formData.password,
      nombre: formData.nombre.trim(),
      email: formData.email.trim().toLowerCase(),
      nivel: formData.nivel,
      fechaCreacion: new Date().toISOString()
    };

    const updatedUsuarios = [...usuarios, newUsuario];
    setUsuarios(updatedUsuarios);
    storageService.saveUsers(updatedUsuarios);

    toast({
      title: "Éxito",
      description: "Usuario creado correctamente",
    });

    resetForm();
    setIsCreateDialogOpen(false);
  };

  const handleEdit = () => {
    if (!selectedUsuario || !validateForm(true)) return;

    const updatedUsuario: UserType = {
      ...selectedUsuario,
      username: formData.username.trim(),
      nombre: formData.nombre.trim(),
      email: formData.email.trim().toLowerCase(),
      nivel: formData.nivel,
      // Only update password if provided
      ...(formData.password && { password: formData.password })
    };

    const updatedUsuarios = usuarios.map(u => u.id === selectedUsuario.id ? updatedUsuario : u);
    setUsuarios(updatedUsuarios);
    storageService.saveUsers(updatedUsuarios);

    // Update current user if editing self
    const currentUser = storageService.getCurrentUser();
    if (currentUser && currentUser.id === selectedUsuario.id) {
      storageService.setCurrentUser(updatedUsuario);
    }

    toast({
      title: "Éxito",
      description: "Usuario actualizado correctamente",
    });

    resetForm();
    setIsEditDialogOpen(false);
    setSelectedUsuario(null);
  };

  const handleDelete = (id: string) => {
    const currentUser = storageService.getCurrentUser();
    
    if (currentUser && currentUser.id === id) {
      toast({
        title: "Error",
        description: "No puede eliminar su propio usuario",
        variant: "destructive",
      });
      return;
    }

    const userToDelete = usuarios.find(u => u.id === id);
    if (userToDelete?.username === 'admin') {
      toast({
        title: "Error",
        description: "No se puede eliminar el usuario administrador principal",
        variant: "destructive",
      });
      return;
    }

    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      const updatedUsuarios = usuarios.filter(u => u.id !== id);
      setUsuarios(updatedUsuarios);
      storageService.saveUsers(updatedUsuarios);

      toast({
        title: "Éxito",
        description: "Usuario eliminado correctamente",
      });
    }
  };

  const openEditDialog = (usuario: UserType) => {
    setSelectedUsuario(usuario);
    setFormData({
      username: usuario.username,
      password: '', // Don't prefill password for security
      nombre: usuario.nombre,
      email: usuario.email,
      nivel: usuario.nivel
    });
    setIsEditDialogOpen(true);
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUser = storageService.getCurrentUser();
  const isCurrentUserAdmin = currentUser?.nivel === 'admin';

  // Only show this page if user is admin
  if (!isCurrentUserAdmin) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Acceso Denegado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Solo los administradores pueden gestionar usuarios.
          </p>
        </div>
      </div>
    );
  }

  const adminCount = usuarios.filter(u => u.nivel === 'admin').length;
  const userCount = usuarios.filter(u => u.nivel === 'user').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administración de usuarios del sistema</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre de Usuario *</label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="nombre_usuario"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Contraseña *</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Contraseña"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Nombre Completo *</label>
                <Input
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Nombre y apellido"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="usuario@email.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Nivel de Acceso *</label>
                <Select value={formData.nivel} onValueChange={(value: 'admin' | 'user') => setFormData({...formData, nivel: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="user">Usuario</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreate} className="flex-1">
                  Crear Usuario
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{usuarios.length}</p>
                <p className="text-sm text-gray-600">Total Usuarios</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{adminCount}</p>
                <p className="text-sm text-gray-600">Administradores</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{userCount}</p>
                <p className="text-sm text-gray-600">Usuarios</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsuarios.map((usuario) => {
          const isCurrentUser = currentUser?.id === usuario.id;

          return (
            <Card key={usuario.id} className={`hover:shadow-lg transition-shadow ${isCurrentUser ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {usuario.nombre}
                      {isCurrentUser && (
                        <Badge variant="outline" className="text-xs">Usted</Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600">@{usuario.username}</p>
                    <Badge 
                      className={usuario.nivel === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                      }
                    >
                      {usuario.nivel === 'admin' ? 'Administrador' : 'Usuario'}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(usuario)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {usuario.username !== 'admin' && !isCurrentUser && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(usuario.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <strong>Email:</strong> {usuario.email}
                </div>
                
                <div className="text-xs text-gray-500">
                  Creado: {formatDateAR(usuario.fechaCreacion)}
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-xs text-gray-500">
                    ID: {usuario.id}
                  </span>
                  {usuario.nivel === 'admin' && (
                    <Shield className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredUsuarios.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay usuarios</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'No se encontraron usuarios que coincidan con la búsqueda.'
              : 'Comience creando un nuevo usuario.'
            }
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre de Usuario *</label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="nombre_usuario"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Nueva Contraseña (opcional)</label>
              <div className="relative">
                <Input
                  type={showEditPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Dejar vacío para mantener actual"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                >
                  {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Nombre Completo *</label>
              <Input
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                placeholder="Nombre y apellido"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="usuario@email.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Nivel de Acceso *</label>
              <Select 
                value={formData.nivel} 
                onValueChange={(value: 'admin' | 'user') => setFormData({...formData, nivel: value})}
                disabled={selectedUsuario?.username === 'admin'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="user">Usuario</SelectItem>
                </SelectContent>
              </Select>
              {selectedUsuario?.username === 'admin' && (
                <p className="text-xs text-gray-500 mt-1">
                  No se puede cambiar el nivel del administrador principal
                </p>
              )}
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

export default Usuarios;
