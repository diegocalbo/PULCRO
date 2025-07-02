import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, DollarSign, TrendingUp, FileText, MessageSquare, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { storageService } from '@/services/localStorage';
import { formatCurrencyARS, formatDateAR, generateWhatsAppMessage } from '@/lib/formatters';
import { Servicio, Cliente, TipoServicio, Equipo } from '@/types';

const Reportes: React.FC = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('all');
  const [rutaFecha, setRutaFecha] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    // Set default date range (current month)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setFechaInicio(firstDay.toISOString().split('T')[0]);
    setFechaFin(lastDay.toISOString().split('T')[0]);
    setRutaFecha(now.toISOString().split('T')[0]);
  }, []);

  const loadData = () => {
    setServicios(storageService.getServicios());
    setClientes(storageService.getClientes());
    setTiposServicio(storageService.getTiposServicio());
    setEquipos(storageService.getEquipos());
  };

  const getServiciosFiltrados = () => {
    return servicios.filter(servicio => {
      const fechaServicio = new Date(servicio.fecha);
      const inicio = fechaInicio ? new Date(fechaInicio) : new Date('1900-01-01');
      const fin = fechaFin ? new Date(fechaFin) : new Date('2100-12-31');
      
      return fechaServicio >= inicio && 
             fechaServicio <= fin && 
             (equipoSeleccionado === 'all' || servicio.equipoId === equipoSeleccionado);
    });
  };

  const calcularGanancias = () => {
    const serviciosFiltrados = getServiciosFiltrados();
    
    const ganancias = {
      total: 0,
      realizados: 0,
      pendientes: 0,
      cancelados: 0,
      serviciosRealizados: 0,
      serviciosPendientes: 0,
      serviciosCancelados: 0,
      totalServicios: serviciosFiltrados.length
    };

    serviciosFiltrados.forEach(servicio => {
      const tipo = tiposServicio.find(t => t.id === servicio.tipoServicioId);
      const precio = tipo?.precio || 0;
      
      ganancias.total += precio;
      
      switch (servicio.estado) {
        case 'Realizado':
          ganancias.realizados += precio;
          ganancias.serviciosRealizados++;
          break;
        case 'Programado':
        case 'En Curso':
        case 'Pendiente':
          ganancias.pendientes += precio;
          ganancias.serviciosPendientes++;
          break;
        case 'Cancelado':
          ganancias.cancelados += precio;
          ganancias.serviciosCancelados++;
          break;
      }
    });

    return ganancias;
  };

  const getServiciosPorEquipo = () => {
    const serviciosFiltrados = getServiciosFiltrados();
    const equipoStats: { [key: string]: { count: number; ingresos: number; equipo: string } } = {};

    serviciosFiltrados.forEach(servicio => {
      const equipo = equipos.find(e => e.id === servicio.equipoId);
      const tipo = tiposServicio.find(t => t.id === servicio.tipoServicioId);
      const equipoNombre = equipo ? equipo.nombre : 'Equipo no encontrado';
      
      if (!equipoStats[servicio.equipoId]) {
        equipoStats[servicio.equipoId] = {
          count: 0,
          ingresos: 0,
          equipo: equipoNombre
        };
      }
      
      equipoStats[servicio.equipoId].count++;
      if (servicio.estado === 'Realizado') {
        equipoStats[servicio.equipoId].ingresos += tipo?.precio || 0;
      }
    });

    return Object.entries(equipoStats).map(([id, stats]) => ({
      equipoId: id,
      ...stats
    }));
  };

  const generarHojaRuta = () => {
    if (!rutaFecha) {
      toast({
        title: "Error",
        description: "Seleccione una fecha para la hoja de ruta",
        variant: "destructive",
      });
      return;
    }

    const serviciosDelDia = servicios.filter(s => s.fecha === rutaFecha);
    
    if (serviciosDelDia.length === 0) {
      toast({
        title: "Sin servicios",
        description: "No hay servicios programados para la fecha seleccionada",
        variant: "destructive",
      });
      return;
    }

    // Group services by team
    const serviciosPorEquipo = serviciosDelDia.reduce((acc: any, servicio) => {
      const equipoId = servicio.equipoId;
      if (!acc[equipoId]) {
        acc[equipoId] = [];
      }
      acc[equipoId].push(servicio);
      return acc;
    }, {});

    let hojaRuta = `🗓️ *HOJA DE RUTA - ${formatDateAR(rutaFecha)}*\n\n`;
    
    // Generate route for each team
    Object.entries(serviciosPorEquipo).forEach(([equipoId, serviciosEquipo]: [string, any]) => {
      const equipo = equipos.find(e => e.id === equipoId);
      const serviciosOrdenados = serviciosEquipo.sort((a: any, b: any) => a.hora.localeCompare(b.hora));
      
      hojaRuta += `👥 *EQUIPO: ${equipo?.nombre || 'Equipo no encontrado'}*\n`;
      hojaRuta += `📞 *Líder: ${equipo?.lider} - ${equipo?.telefono}*\n\n`;
      
      serviciosOrdenados.forEach((servicio: any, index: number) => {
        const cliente = clientes.find(c => c.id === servicio.clienteId);
        const tipo = tiposServicio.find(t => t.id === servicio.tipoServicioId);
        
        hojaRuta += `📍 *Servicio ${index + 1}*\n`;
        hojaRuta += `⏰ *Hora:* ${servicio.hora}\n`;
        hojaRuta += `🏢 *Cliente:* ${cliente?.nombre || 'Cliente no encontrado'}\n`;
        hojaRuta += `📍 *Dirección:* ${servicio.direccion}\n`;
        hojaRuta += `🔧 *Servicio:* ${tipo?.nombre || 'Tipo no encontrado'}\n`;
        hojaRuta += `📞 *Contacto:* ${cliente?.contacto} - ${cliente?.telefono}\n`;
        if (servicio.observaciones) {
          hojaRuta += `📝 *Obs:* ${servicio.observaciones}\n`;
        }
        hojaRuta += `\n`;
      });
      
      hojaRuta += `📊 *Servicios del equipo: ${serviciosOrdenados.length}*\n\n`;
      hojaRuta += `═══════════════════════\n\n`;
    });

    hojaRuta += `📊 *TOTAL SERVICIOS: ${serviciosDelDia.length}*`;

    // Copy to clipboard
    navigator.clipboard.writeText(hojaRuta).then(() => {
      toast({
        title: "Éxito",
        description: "Hoja de ruta copiada al portapapeles",
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive",
      });
    });
  };

  const exportarExcel = () => {
    const serviciosFiltrados = getServiciosFiltrados();
    
    if (serviciosFiltrados.length === 0) {
      toast({
        title: "Sin datos",
        description: "No hay servicios para exportar en el período seleccionado",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content
    const headers = [
      'Fecha',
      'Hora',
      'Cliente',
      'Tipo de Servicio',
      'Equipo',
      'Estado',
      'Precio',
      'Dirección',
      'Contacto',
      'Teléfono',
      'Observaciones'
    ];

    const csvContent = [
      headers.join(','),
      ...serviciosFiltrados.map(servicio => {
        const cliente = clientes.find(c => c.id === servicio.clienteId);
        const tipo = tiposServicio.find(t => t.id === servicio.tipoServicioId);
        const equipo = equipos.find(e => e.id === servicio.equipoId);
        
        return [
          formatDateAR(servicio.fecha),
          servicio.hora,
          `"${cliente?.nombre || 'N/A'}"`,
          `"${tipo?.nombre || 'N/A'}"`,
          `"${equipo?.nombre || 'N/A'}"`,
          servicio.estado,
          tipo?.precio || 0,
          `"${servicio.direccion}"`,
          `"${cliente?.contacto || 'N/A'}"`,
          `"${cliente?.telefono || 'N/A'}"`,
          `"${servicio.observaciones || ''}"`
        ].join(',');
      })
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_servicios_${fechaInicio}_${fechaFin}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Éxito",
      description: "Reporte exportado correctamente",
    });
  };

  const ganancias = calcularGanancias();
  const equipoStats = getServiciosPorEquipo();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Análisis</h1>
          <p className="text-gray-600">Análisis de ganancias, hojas de ruta y reportes</p>
        </div>
      </div>

      <Tabs defaultValue="ganancias" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ganancias">Análisis de Ganancias</TabsTrigger>
          <TabsTrigger value="equipos">Reportes por Equipo</TabsTrigger>
          <TabsTrigger value="rutas">Hojas de Ruta</TabsTrigger>
        </TabsList>

        <TabsContent value="ganancias" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtros de Período</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium">Fecha Inicio</label>
                  <Input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Fecha Fin</label>
                  <Input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Equipo</label>
                  <Select value={equipoSeleccionado} onValueChange={setEquipoSeleccionado}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los equipos</SelectItem>
                      {equipos.map(equipo => (
                        <SelectItem key={equipo.id} value={equipo.id}>
                          {equipo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={exportarExcel} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrencyARS(ganancias.total)}
                    </p>
                    <p className="text-sm text-gray-600">Facturación Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrencyARS(ganancias.realizados)}
                    </p>
                    <p className="text-sm text-gray-600">Ingresos Confirmados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {formatCurrencyARS(ganancias.pendientes)}
                    </p>
                    <p className="text-sm text-gray-600">Ingresos Pendientes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{ganancias.totalServicios}</p>
                    <p className="text-sm text-gray-600">Total Servicios</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Servicios Realizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cantidad:</span>
                    <span className="font-semibold">{ganancias.serviciosRealizados}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ingresos:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrencyARS(ganancias.realizados)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Promedio:</span>
                    <span className="font-semibold">
                      {formatCurrencyARS(ganancias.serviciosRealizados > 0 ? ganancias.realizados / ganancias.serviciosRealizados : 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-yellow-600">Servicios Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cantidad:</span>
                    <span className="font-semibold">{ganancias.serviciosPendientes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ingresos Est.:</span>
                    <span className="font-semibold text-yellow-600">
                      {formatCurrencyARS(ganancias.pendientes)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Promedio:</span>
                    <span className="font-semibold">
                      {formatCurrencyARS(ganancias.serviciosPendientes > 0 ? ganancias.pendientes / ganancias.serviciosPendientes : 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-red-600">Servicios Cancelados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cantidad:</span>
                    <span className="font-semibold">{ganancias.serviciosCancelados}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pérdidas:</span>
                    <span className="font-semibold text-red-600">
                      {formatCurrencyARS(ganancias.cancelados)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Promedio:</span>
                    <span className="font-semibold">
                      {formatCurrencyARS(ganancias.serviciosCancelados > 0 ? ganancias.cancelados / ganancias.serviciosCancelados : 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="equipos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rendimiento por Equipo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipoStats.map((stat) => (
                  <div key={stat.equipoId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{stat.equipo}</h3>
                      <p className="text-sm text-gray-600">
                        {stat.count} servicio{stat.count !== 1 ? 's' : ''} en el período
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrencyARS(stat.ingresos)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Prom: {formatCurrencyARS(stat.count > 0 ? stat.ingresos / stat.count : 0)}
                      </p>
                    </div>
                  </div>
                ))}
                {equipoStats.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No hay datos para el período seleccionado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rutas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generar Hoja de Ruta para WhatsApp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Fecha para Hoja de Ruta</label>
                    <Input
                      type="date"
                      value={rutaFecha}
                      onChange={(e) => setRutaFecha(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={generarHojaRuta} className="w-full">
                      <Copy className="w-4 h-4 mr-2" />
                      Generar y Copiar Hoja de Ruta
                    </Button>
                  </div>
                </div>
                
                {rutaFecha && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-2">Vista Previa de Servicios del Día:</h4>
                    <div className="space-y-2">
                      {servicios
                        .filter(s => s.fecha === rutaFecha)
                        .sort((a, b) => a.hora.localeCompare(b.hora))
                        .map((servicio) => {
                          const cliente = clientes.find(c => c.id === servicio.clienteId);
                          const tipo = tiposServicio.find(t => t.id === servicio.tipoServicioId);
                          
                          return (
                            <div key={servicio.id} className="flex items-center justify-between text-sm">
                              <span>
                                {servicio.hora} - {cliente?.nombre} ({tipo?.nombre})
                              </span>
                              <Badge>{servicio.estado}</Badge>
                            </div>
                          );
                        })}
                      {servicios.filter(s => s.fecha === rutaFecha).length === 0 && (
                        <p className="text-gray-500">No hay servicios programados para esta fecha</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mensajes Individuales para WhatsApp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {servicios
                  .filter(s => s.fecha >= new Date().toISOString().split('T')[0])
                  .slice(0, 5)
                  .map((servicio) => {
                    const cliente = clientes.find(c => c.id === servicio.clienteId);
                    const tipo = tiposServicio.find(t => t.id === servicio.tipoServicioId);
                    const equipo = equipos.find(e => e.id === servicio.equipoId);
                    
                    if (!cliente || !tipo) return null;

                    const mensaje = generateWhatsAppMessage(servicio, cliente, tipo, equipo);
                    
                    return (
                      <div key={servicio.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">
                            {cliente.nombre} - {formatDateAR(servicio.fecha)}
                          </h4>
                          <Button
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(mensaje);
                              toast({
                                title: "Copiado",
                                description: "Mensaje copiado al portapapeles",
                              });
                            }}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copiar
                          </Button>
                        </div>
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded whitespace-pre-line">
                          {mensaje}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reportes;
