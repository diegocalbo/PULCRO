import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Users, Wrench, CheckCircle, Clock, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useDashboard, useServicios } from '@/hooks/useData';
import { CalendarEvent } from '@/types';
import { formatCurrencyARS } from '@/lib/formatters';
import { Link } from 'react-router-dom';

const formatCurrency = formatCurrencyARS;

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getEstadoBadgeVariant = (estado: string) => {
  switch (estado) {
    case 'Completado':
      return 'success';
    case 'En Progreso':
      return 'info';
    case 'Pendiente':
      return 'warning';
    case 'Cancelado':
      return 'destructive';
    case 'Reprogramado':
      return 'secondary';
    default:
      return 'default';
  }
};

const getPrioridadBadgeVariant = (prioridad: string) => {
  switch (prioridad) {
    case 'Urgente':
      return 'destructive';
    case 'Alta':
      return 'warning';
    case 'Media':
      return 'info';
    case 'Baja':
      return 'secondary';
    default:
      return 'default';
  }
};

export const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { metrics, loading: metricsLoading } = useDashboard();
  const { serviciosWithDetails } = useServicios();

  // Calendar events
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return serviciosWithDetails.map(servicio => ({
      id: servicio.id,
      title: `${servicio.clienteNombre} - ${servicio.tipoServicioNombre}`,
      date: servicio.fecha,
      time: servicio.hora,
      clienteNombre: servicio.clienteNombre || '',
      equipoNombre: servicio.equipoNombre || '',
      estado: servicio.estado,
      prioridad: servicio.prioridad
    }));
  }, [serviciosWithDetails]);

  // Today's services
  const todaysServices = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return serviciosWithDetails.filter(servicio => servicio.fecha === today);
  }, [serviciosWithDetails]);

  // Upcoming services (next 7 days)
  const upcomingServices = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return serviciosWithDetails.filter(servicio => {
      const servicioDate = new Date(servicio.fecha);
      return servicioDate >= today && servicioDate <= nextWeek;
    }).sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora));
  }, [serviciosWithDetails]);

  // Services for selected date
  const selectedDateServices = useMemo(() => {
    const dateString = selectedDate.toISOString().split('T')[0];
    return serviciosWithDetails.filter(servicio => servicio.fecha === dateString);
  }, [serviciosWithDetails, selectedDate]);

  // Check if date has services
  const dateHasServices = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return calendarEvents.some(event => event.date === dateString);
  };

  if (metricsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Panel de control y resumen de actividades</p>
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.totalClientes || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Wrench className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Servicios</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.totalServicios || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.serviciosPendientes || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos Mes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics?.ingresosMes || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's services highlight */}
      {todaysServices.length > 0 && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Servicios de Hoy ({todaysServices.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysServices.slice(0, 3).map((servicio) => (
                <div key={servicio.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{servicio.hora}</span>
                      <span className="text-gray-600">{servicio.clienteNombre}</span>
                      <Badge variant={getEstadoBadgeVariant(servicio.estado)}>
                        {servicio.estado}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{servicio.tipoServicioNombre}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(servicio.precio || 0)}</p>
                    <p className="text-xs text-gray-500">{servicio.equipoNombre}</p>
                  </div>
                </div>
              ))}
              {todaysServices.length > 3 && (
                <div className="text-center">
                  <Link to="/servicios">
                    <Button variant="outline" size="sm">
                      Ver todos los servicios de hoy
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendario de Servicios</CardTitle>
            <CardDescription>
              Haz clic en una fecha para ver los servicios programados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border w-full"
                  modifiers={{
                    hasServices: dateHasServices
                  }}
                  modifiersStyles={{
                    hasServices: {
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </div>
              
              {/* Selected date services */}
              <div className="lg:w-80">
                <h3 className="font-medium mb-3">
                  {formatDate(selectedDate.toISOString())}
                </h3>
                
                {selectedDateServices.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedDateServices.map((servicio) => (
                      <div key={servicio.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{servicio.hora}</span>
                          <Badge variant={getEstadoBadgeVariant(servicio.estado)} className="text-xs">
                            {servicio.estado}
                          </Badge>
                        </div>
                        <p className="font-medium text-gray-900">{servicio.clienteNombre}</p>
                        <p className="text-gray-600">{servicio.tipoServicioNombre}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-gray-500">{servicio.equipoNombre}</span>
                          <span className="font-medium">{formatCurrency(servicio.precio || 0)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No hay servicios programados para esta fecha.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming services */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Servicios</CardTitle>
            <CardDescription>
              Servicios programados para los próximos 7 días
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {upcomingServices.length > 0 ? (
                upcomingServices.slice(0, 10).map((servicio) => (
                  <div key={servicio.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {new Date(servicio.fecha).toLocaleDateString('es-ES')} - {servicio.hora}
                      </span>
                      <Badge variant={getPrioridadBadgeVariant(servicio.prioridad)} className="text-xs">
                        {servicio.prioridad}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm">{servicio.clienteNombre}</p>
                    <p className="text-gray-600 text-xs">{servicio.tipoServicioNombre}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-500 text-xs">{servicio.equipoNombre}</span>
                      <Badge variant={getEstadoBadgeVariant(servicio.estado)} className="text-xs">
                        {servicio.estado}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No hay servicios programados para los próximos días.</p>
              )}
            </div>
            
            {upcomingServices.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <Link to="/servicios">
                  <Button variant="outline" size="sm" className="w-full">
                    Ver todos los servicios
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.serviciosCompletados || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Equipos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.equiposActivos || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics?.ingresosTotal || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
