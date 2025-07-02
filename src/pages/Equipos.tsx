import React, { useState, useEffect } from 'react';
import { Plus, Users, Phone, Mail, Wrench, Trash2, Edit, Search, UserCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { storageService } from '@/services/localStorage';
import { formatPhoneAR } from '@/lib/formatters';
import { Equipo } from '@/types';

const Equipos: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState<Equipo | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nombre: '',
    lider: '',
    telefono: '',
    email: '',
    especialidad: '',
    activo: true
  });

  const especialidades = [
    'Limpieza de Campanas',
    'Mantenimiento de Ductos',
    'Inspección y Desengrase',
    'Emergencias',
    'Limpieza Industrial',
    'Mantenimiento Preventivo'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setEquipos(storageService.getEquipos());
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      lider: '',
      telefono: '',
      email: '',
      especialidad: '',
      activo: true
    });
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre del equipo es obligatorio",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.lider.trim()) {
      toast({
        title: "Error",
        description: "El líder del equipo es obligatorio",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.telefono.trim()) {
      toast({
        title: "Error",
        description: "El teléfono es obligatorio",
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

    if (!formData.especialidad) {
      toast({
        title: "Error",
        description: "La especialidad es obligatoria",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCreate = () => {
    if (!validateForm()) return;

    const newEquipo: Equipo = {
      id: Date.now().toString(),
      nombre: formData.nombre.trim(),
      lider: formData.lider.trim(),
      telefono: formatPhoneAR(formData.telefono),
      email: formData.email.trim().toLowerCase(),
      especialidad: formData.especialidad,
      activo: formData.activo,
      fechaCreacion: new Date().toISOString()
    };

    const updatedEquipos = [...equipos, newEquipo];
    setEquipos(updatedEquipos);
    storageService.saveEquipos(updatedEquipos);

    toast({
      title: "Éxito",
      description: "Equipo creado correctamente",
    });

    resetForm();
    setIsCreateDialogOpen(false);
  };

  const handleEdit = () => {
    if (!selectedEquipo || !validateForm()) return;

    const updatedEquipo: Equipo = {
      ...selectedEquipo,
      nombre: formData.nombre.trim(),
      lider: formData.lider.trim(),
      telefono: formatPhoneAR(formData.telefono),
      email: formData.email.trim().toLowerCase(),
      especialidad: formData.especialidad,
      activo: formData.activo
    };

    const updatedEquipos = equipos.map(e => e.id === selectedEquipo.id ? updatedEquipo : e);
    setEquipos(updatedEquipos);
    storageService.saveEquipos(updatedEquipos);

    toast({
      title: "Éxito",
      description: "Equipo actualizado correctamente",
    });

    resetForm();
    setIsEditDialogOpen(false);
    setSelectedEquipo(null);
  };

  const handleDelete = (id: string) => {
    // Check if team is being used in services
    const servicios = storageService.getServicios();
    const equipoEnUso = servicios.some(s => s.equipoId === id);
    
    if (equipoEnUso) {
      toast({
        title: "Error",
        description: "No se puede eliminar el equipo porque tiene servicios asignados",
        variant: "destructive",
      });
      return;
    }

    if (confirm('¿Está seguro de que desea eliminar este equipo?')) {
      const updatedEquipos = equipos.filter(e => e.id !== id);
      setEquipos(updatedEquipos);
      storageService.saveEquipos(updatedEquipos);

      toast({
        title: "Éxito",
        description: "Equipo eliminado correctamente",
      });
    }
  };

  const toggleActivo = (id: string) => {
    const updatedEquipos = equipos.map(e => 
      e.id === id ? { ...e, activo: !e.activo } : e
    );
    setEquipos(updatedEquipos);
    storageService.saveEquipos(updatedEquipos);

    const equipo = equipos.find(e => e.id === id);
    toast({
      title: "Estado actualizado",
      description: `Equipo ${equipo?.activo ? 'desactivado' : 'activado'} correctamente`,
    });
  };

  const openEditDialog = (equipo: Equipo) => {
    setSelectedEquipo(equipo);
    setFormData({
      nombre: equipo.nombre,
      lider: equipo.lider,
      telefono: equipo.telefono,
      email: equipo.email,
      especialidad: equipo.especialidad,
      activo: equipo.activo
    });
    setIsEditDialogOpen(true);
  };

  const filteredEquipos = equipos.filter(equipo =>
    equipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipo.lider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipo.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getServiciosCount = (equipoId: string) => {
    const servicios = storageService.getServicios();
    return servicios.filter(s => s.equipoId === equipoId).length;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipos de Trabajo</h1>
          <p className="text-gray-600">Gestión de equipos de limpieza de campanas</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Equipo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Equipo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre del Equipo *</label>
                <Input
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Ej: Equipo Alpha"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Líder del Equipo *</label>
                <Input
                  value={formData.lider}
                  onChange={(e) => setFormData({...formData, lider: e.target.value})}
                  placeholder="Nombre completo del líder"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Teléfono *</label>
                <Input
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  placeholder="+5411-4567-8901"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="equipo@pulcro.com.ar"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Especialidad *</label>
                <Select value={formData.especialidad} onValueChange={(value) => setFormData({...formData, especialidad: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {especialidades.map(esp => (
                      <SelectItem key={esp} value={esp}>
                        {esp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.activo}
                  onCheckedChange={(checked) => setFormData({...formData, activo: checked})}
                />
                <label className="text-sm font-medium">Equipo activo</label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreate} className="flex-1">
                  Crear Equipo
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
          placeholder="Buscar equipos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{equipos.length}</p>
                <p className="text-sm text-gray-600">Total Equipos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{equipos.filter(e => e.activo).length}</p>
                <p className="text-sm text-gray-600">Equipos Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wrench className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{new Set(equipos.map(e => e.especialidad)).size}</p>
                <p className="text-sm text-gray-600">Especialidades</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{equipos.filter(e => !e.activo).length}</p>
                <p className="text-sm text-gray-600">Equipos Inactivos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipos.map((equipo) => {
          const serviciosCount = getServiciosCount(equipo.id);

          return (
            <Card key={equipo.id} className={`hover:shadow-lg transition-shadow ${!equipo.activo ? 'opacity-75' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {equipo.nombre}
                      {equipo.activo ? (
                        <Badge className="bg-green-100 text-green-800">Activo</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{equipo.especialidad}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(equipo)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(equipo.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span><strong>Líder:</strong> {equipo.lider}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{equipo.telefono}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{equipo.email}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-sm">
                    <span className="text-gray-500">Servicios: </span>
                    <span className="font-semibold text-blue-600">{serviciosCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Activo:</span>
                    <Switch
                      checked={equipo.activo}
                      onCheckedChange={() => toggleActivo(equipo.id)}
                    />
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Creado: {new Date(equipo.fechaCreacion).toLocaleDateString('es-AR')}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredEquipos.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay equipos</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'No se encontraron equipos que coincidan con la búsqueda.'
              : 'Comience creando un nuevo equipo de trabajo.'
            }
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Equipo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre del Equipo *</label>
              <Input
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                placeholder="Ej: Equipo Alpha"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Líder del Equipo *</label>
              <Input
                value={formData.lider}
                onChange={(e) => setFormData({...formData, lider: e.target.value})}
                placeholder="Nombre completo del líder"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Teléfono *</label>
              <Input
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                placeholder="+5411-4567-8901"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="equipo@pulcro.com.ar"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Especialidad *</label>
              <Select value={formData.especialidad} onValueChange={(value) => setFormData({...formData, especialidad: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar especialidad" />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map(esp => (
                    <SelectItem key={esp} value={esp}>
                      {esp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.activo}
                onCheckedChange={(checked) => setFormData({...formData, activo: checked})}
              />
              <label className="text-sm font-medium">Equipo activo</label>
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

export default Equipos;
