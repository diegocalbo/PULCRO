import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar } from '../components/ui/calendar';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { 
  Users, 
  Calendar as CalendarIcon, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Sparkles,
  Activity
} from 'lucide-react';
import { dashboardAPI, calendarioAPI, serviciosAPI, DashboardMetrics, ServicioDetallado } from '../services/api';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [serviciosDelMes, setServiciosDelMes] = useState<ServicioDetallado[]>([]);
  const [todosLosServicios, setTodosLosServicios] = useState<ServicioDetallado[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadCalendarData();
  }, [selectedDate]);

  const loadDashboardData = async () => {
    try {
      const [metricsData, serviciosData] = await Promise.all([
        dashboardAPI.getMetrics(),
        serviciosAPI.getAll()
      ]);
      setMetrics(metricsData);
      setTodosLosServicios(serviciosData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadCalendarData = async () => {
    try {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const serviciosData = await calendarioAPI.getServiciosMes(year, month);
      setServiciosDelMes(serviciosData);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    }
  };

  const getServiciosForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return todosLosServicios.filter(servicio => servicio.fecha === dateStr);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Panel de control y métricas del sistema</p>
        </div>
        <Button 
          onClick={loadDashboardData}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Activity className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Servicios
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {metrics?.total_servicios || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Servicios registrados
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {metrics?.total_clientes || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Clientes activos
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ingresos del Mes
            </CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(metrics?.ingresos_mes || 0)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Facturación mensual
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Eficiencia
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {metrics ? Math.round((metrics.servicios_completados / Math.max(metrics.total_servicios, 1)) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Servicios completados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Servicios Completados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {metrics?.servicios_completados || 0}
            </div>
            <p className="text-gray-600 mt-2">
              Servicios finalizados exitosamente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span>Servicios Pendientes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {metrics?.servicios_pendientes || 0}
            </div>
            <p className="text-gray-600 mt-2">
              Servicios por realizar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar and Services */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <span>Calendario</span>
            </CardTitle>
            <CardDescription>
              Selecciona una fecha para ver los servicios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={es}
              className="rounded-md border"
              modifiers={{
                hasServices: (date) => getServiciosForDate(date).length > 0
              }}
              modifiersStyles={{
                hasServices: {
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                  fontWeight: 'bold'
                }
              }}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span>Servicios del {format(selectedDate, 'dd/MM/yyyy', { locale: es })}</span>
            </CardTitle>
            <CardDescription>
              Lista de servicios programados para la fecha seleccionada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getServiciosForDate(selectedDate).length > 0 ? (
                getServiciosForDate(selectedDate).map((servicio) => (
                  <div key={servicio.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-medium text-gray-900">{servicio.cliente_nombre}</h4>
                        <p className="text-sm text-gray-600">{servicio.tipo_servicio_nombre}</p>
                        <p className="text-sm text-gray-500">
                          Equipo: {servicio.equipo_nombre} • {servicio.hora}
                        </p>
                        {servicio.observaciones && (
                          <p className="text-sm text-gray-500 italic">
                            {servicio.observaciones}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge 
                          variant={
                            servicio.estado === 'Completado' ? 'default' :
                            servicio.estado === 'Pendiente' ? 'secondary' : 'destructive'
                          }
                        >
                          {servicio.estado}
                        </Badge>
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency(servicio.precio)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay servicios programados para esta fecha</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
