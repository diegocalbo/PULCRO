import React, { useState, useEffect } from 'react';
import { Plus, Wrench, Clock, DollarSign, Trash2, Edit, Search, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { storageService } from '@/services/localStorage';
import { formatCurrencyARS, formatDuration } from '@/lib/formatters';
import { TipoServicio } from '@/types';

const TiposServicio: React.FC = () => {
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<TipoServicio | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    tiempoEstimado: '',
    frecuencia: '',
    categoria: ''
  });

  const frecuencias = [
    'Mensual',
    'Bimensual',
    'Trimestral',
    'Semestral',
    'Anual',
    'Bajo demanda'
  ];

  const categorias = [
    'Básico',
    'Completo',
    'Mantenimiento',
    'Inspección',
    'Especializado',
    'Urgente'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTiposServicio(storageService.getTiposServicio());
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      precio: '',
      descripcion: '',
      tiempoEstimado: '',
      frecuencia: '',
      categoria: ''
    });
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre del servicio es obligatorio",
        variant: "destructive",
      });
      return false;
    }

    const precio = parseFloat(formData.precio);
    if (isNaN(precio) || precio <= 0) {
      toast({
        title: "Error",
        description: "Debe ingresar un precio válido mayor a 0",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.descripcion.trim()) {
      toast({
        title: "Error",
        description: "La descripción es obligatoria",
        variant: "destructive",
      });
      return false;
    }

    const tiempo = parseInt(formData.tiempoEstimado);
    if (isNaN(tiempo) || tiempo <= 0) {
      toast({
        title: "Error",
        description: "Debe ingresar un tiempo estimado válido (en minutos)",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.frecuencia) {
      toast({
        title: "Error",
        description: "La frecuencia es obligatoria",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.categoria) {
      toast({
        title: "Error",
        description: "La categoría es obligatoria",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCreate = () => {
    if (!validateForm()) return;

    const newTipo: TipoServicio = {
      id: Date.now().toString(),
      nombre: formData.nombre.trim(),
      precio: parseFloat(formData.precio),
      descripcion: formData.descripcion.trim(),
      tiempoEstimado: parseInt(formData.tiempoEstimado),
      frecuencia: formData.frecuencia,
      categoria: formData.categoria,
      fechaCreacion: new Date().toISOString()
    };

    const updatedTipos = [...tiposServicio, newTipo];
    setTiposServicio(updatedTipos);
    storageService.saveTiposServicio(updatedTipos);

    toast({
      title: "Éxito",
      description: "Tipo de servicio creado correctamente",
    });

    resetForm();
    setIsCreateDialogOpen(false);
  };

  const handleEdit = () => {
    if (!selectedTipo || !validateForm()) return;

    const updatedTipo: TipoServicio = {
      ...selectedTipo,
      nombre: formData.nombre.trim(),
      precio: parseFloat(formData.precio),
      descripcion: formData.descripcion.trim(),
      tiempoEstimado: parseInt(formData.tiempoEstimado),
      frecuencia: formData.frecuencia,
      categoria: formData.categoria
    };

    const updatedTipos = tiposServicio.map(t => t.id === selectedTipo.id ? updatedTipo : t);
    setTiposServicio(updatedTipos);
    storageService.saveTiposServicio(updatedTipos);

    toast({
      title: "Éxito",
      description: "Tipo de servicio actualizado correctamente",
    });

    resetForm();
    setIsEditDialogOpen(false);
    setSelectedTipo(null);
  };

  const handleDelete = (id: string) => {
    // Check if service type is being used in services
    const servicios = storageService.getServicios();
    const tipoEnUso = servicios.some(s => s.tipoServicioId === id);
    
    if (tipoEnUso) {
      toast({
        title: "Error",
        description: "No se puede eliminar el tipo de servicio porque está siendo usado en servicios existentes",
        variant: "destructive",
      });
      return;
    }

    if (confirm('¿Está seguro de que desea eliminar este tipo de servicio?')) {
      const updatedTipos = tiposServicio.filter(t => t.id !== id);
      setTiposServicio(updatedTipos);
      storageService.saveTiposServicio(updatedTipos);

      toast({
        title: "Éxito",
        description: "Tipo de servicio eliminado correctamente",
      });
    }
  };

  const openEditDialog = (tipo: TipoServicio) => {
    setSelectedTipo(tipo);
    setFormData({
      nombre: tipo.nombre,
      precio: tipo.precio.toString(),
      descripcion: tipo.descripcion,
      tiempoEstimado: tipo.tiempoEstimado.toString(),
      frecuencia: tipo.frecuencia,
      categoria: tipo.categoria
    });
    setIsEditDialogOpen(true);
  };

  const filteredTipos = tiposServicio.filter(tipo =>
    tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tipo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tipo.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getServiciosCount = (tipoId: string) => {
    const servicios = storageService.getServicios();
    return servicios.filter(s => s.tipoServicioId === tipoId).length;
  };

  const getCategoryColor = (categoria: string) => {
    const colors: { [key: string]: string } = {
      'Básico': 'bg-blue-100 text-blue-800',
      'Completo': 'bg-green-100 text-green-800',
      'Mantenimiento': 'bg-yellow-100 text-yellow-800',
      'Inspección': 'bg-purple-100 text-purple-800',
      'Especializado': 'bg-red-100 text-red-800',
      'Urgente': 'bg-orange-100 text-orange-800'
    };
    return colors[categoria] || 'bg-gray-100 text-gray-800';
  };

  const totalServicios = tiposServicio.reduce((sum, tipo) => sum + getServiciosCount(tipo.id), 0);
  const precioPromedio = tiposServicio.length > 0 
    ? tiposServicio.reduce((sum, tipo) => sum + tipo.precio, 0) / tiposServicio.length 
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tipos de Servicio</h1>
          <p className="text-gray-600">Gestión de tipos de servicios y precios</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Tipo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Tipo de Servicio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre del Servicio *</label>
                <Input
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Ej: Limpieza Básica de Campana"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Precio (ARS) *</label>
                <Input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.precio}
                  onChange={(e) => setFormData({...formData, precio: e.target.value})}
                  placeholder="15000"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Descripción *</label>
                <Textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  placeholder="Descripción detallada del servicio..."
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Tiempo Estimado (minutos) *</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.tiempoEstimado}
                  onChange={(e) => setFormData({...formData, tiempoEstimado: e.target.value})}
                  placeholder="120"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Frecuencia Recomendada *</label>
                <Select value={formData.frecuencia} onValueChange={(value) => setFormData({...formData, frecuencia: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    {frecuencias.map(freq => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Categoría *</label>
                <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreate} className="flex-1">
                  Crear Tipo
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
          placeholder="Buscar tipos de servicio..."
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
              <Wrench className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{tiposServicio.length}</p>
                <p className="text-sm text-gray-600">Tipos de Servicio</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{formatCurrencyARS(precioPromedio)}</p>
                <p className="text-sm text-gray-600">Precio Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Tag className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{new Set(tiposServicio.map(t => t.categoria)).size}</p>
                <p className="text-sm text-gray-600">Categorías</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{totalServicios}</p>
                <p className="text-sm text-gray-600">Servicios Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTipos.map((tipo) => {
          const serviciosCount = getServiciosCount(tipo.id);

          return (
            <Card key={tipo.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{tipo.nombre}</CardTitle>
                    <Badge className={getCategoryColor(tipo.categoria)}>
                      {tipo.categoria}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(tipo)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(tipo.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  {tipo.descripcion}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Duración: {formatDuration(tipo.tiempoEstimado)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Tag className="w-4 h-4" />
                  <span>Frecuencia: {tipo.frecuencia}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrencyARS(tipo.precio)}
                  </span>
                  <div className="text-sm text-gray-500">
                    {serviciosCount} servicio{serviciosCount !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Creado: {new Date(tipo.fechaCreacion).toLocaleDateString('es-AR')}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTipos.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay tipos de servicio</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'No se encontraron tipos de servicio que coincidan con la búsqueda.'
              : 'Comience creando un nuevo tipo de servicio.'
            }
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Tipo de Servicio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre del Servicio *</label>
              <Input
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                placeholder="Ej: Limpieza Básica de Campana"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Precio (ARS) *</label>
              <Input
                type="number"
                min="0"
                step="100"
                value={formData.precio}
                onChange={(e) => setFormData({...formData, precio: e.target.value})}
                placeholder="15000"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Descripción *</label>
              <Textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                placeholder="Descripción detallada del servicio..."
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tiempo Estimado (minutos) *</label>
              <Input
                type="number"
                min="1"
                value={formData.tiempoEstimado}
                onChange={(e) => setFormData({...formData, tiempoEstimado: e.target.value})}
                placeholder="120"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Frecuencia Recomendada *</label>
              <Select value={formData.frecuencia} onValueChange={(value) => setFormData({...formData, frecuencia: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  {frecuencias.map(freq => (
                    <SelectItem key={freq} value={freq}>
                      {freq}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Categoría *</label>
              <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default TiposServicio;
