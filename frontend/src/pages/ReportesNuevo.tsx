import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { 
  FileText, 
  Download, 
  Calendar, 
  Database, 
  Users, 
  DollarSign,
  BarChart3,
  MessageSquare,
  Truck,
  Copy,
  FileSpreadsheet,
  Archive,
  Clock
} from 'lucide-react';
import { reportesAPI, clientesAPI, serviciosAPI, equiposAPI } from '../services/api';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  generarHojaRutaWhatsApp, 
  generarReporteGananciasTexto, 
  copiarAlPortapapeles, 
  generarExcelClientes, 
  generarExcelGanancias 
} from '../utils/reportUtils';

const Reportes: React.FC = () => {
  const [fechaDesde, setFechaDesde] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [fechaHasta, setFechaHasta] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const [fechaHojaRuta, setFechaHojaRuta] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('');
  const [hojaRutaTexto, setHojaRutaTexto] = useState('');
  const [reporteTexto, setReporteTexto] = useState('');
  const [loading, setLoading] = useState(false);
  const [equipos, setEquipos] = useState<any[]>([]);

  useEffect(() => {
    cargarEquipos();
  }, []);

  const cargarEquipos = async () => {
    try {
      const equiposData = await equiposAPI.getAll();
      setEquipos(equiposData);
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  // Generar hoja de ruta para WhatsApp
  const generarHojaRuta = async () => {
    if (!equipoSeleccionado || !fechaHojaRuta) {
      toast.error('Selecciona un equipo y una fecha');
      return;
    }

    setLoading(true);
    try {
      const servicios = await serviciosAPI.getAll();
      const textoHojaRuta = generarHojaRutaWhatsApp(servicios, equipoSeleccionado, fechaHojaRuta);
      setHojaRutaTexto(textoHojaRuta);
      toast.success('Hoja de ruta generada');
    } catch (error) {
      console.error('Error generating route sheet:', error);
      toast.error('Error al generar la hoja de ruta');
    } finally {
      setLoading(false);
    }
  };

  // Copiar hoja de ruta al portapapeles
  const copiarHojaRuta = async () => {
    if (!hojaRutaTexto) {
      toast.error('Primero genera una hoja de ruta');
      return;
    }

    try {
      await copiarAlPortapapeles(hojaRutaTexto);
      toast.success('¡Hoja de ruta copiada! Ya puedes pegarla en WhatsApp');
    } catch (error) {
      toast.error('Error al copiar al portapapeles');
    }
  };

  // Generar reporte de ganancias en texto
  const generarReporteTexto = async () => {
    if (!fechaDesde || !fechaHasta) {
      toast.error('Selecciona las fechas del reporte');
      return;
    }

    if (new Date(fechaDesde) > new Date(fechaHasta)) {
      toast.error('La fecha desde no puede ser mayor a la fecha hasta');
      return;
    }

    setLoading(true);
    try {
      const datos = await reportesAPI.generarReporteFechas(fechaDesde, fechaHasta);
      const textoReporte = generarReporteGananciasTexto(datos);
      setReporteTexto(textoReporte);
      toast.success('Reporte generado en formato texto');
    } catch (error) {
      console.error('Error generating text report:', error);
      toast.error('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  // Copiar reporte al portapapeles
  const copiarReporte = async () => {
    if (!reporteTexto) {
      toast.error('Primero genera un reporte');
      return;
    }

    try {
      await copiarAlPortapapeles(reporteTexto);
      toast.success('Reporte copiado al portapapeles');
    } catch (error) {
      toast.error('Error al copiar al portapapeles');
    }
  };

  // Generar backup de clientes en Excel
  const backupClientesExcel = async () => {
    setLoading(true);
    try {
      const clientes = await clientesAPI.getAll();
      generarExcelClientes(clientes);
      toast.success('Backup de clientes descargado en Excel');
    } catch (error) {
      console.error('Error backing up clients:', error);
      toast.error('Error al hacer backup de clientes');
    } finally {
      setLoading(false);
    }
  };

  // Generar reporte de ganancias en Excel
  const reporteGananciasExcel = async () => {
    if (!fechaDesde || !fechaHasta) {
      toast.error('Selecciona las fechas del reporte');
      return;
    }

    setLoading(true);
    try {
      const datos = await reportesAPI.generarReporteFechas(fechaDesde, fechaHasta);
      generarExcelGanancias(datos);
      toast.success('Reporte de ganancias descargado en Excel');
    } catch (error) {
      console.error('Error generating Excel report:', error);
      toast.error('Error al generar el reporte Excel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Hojas de Ruta</h1>
          <p className="text-gray-600 mt-2">Genera reportes, hojas de ruta y backups del sistema</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          <div>Fecha: {format(new Date(), 'dd/MM/yyyy', { locale: es })}</div>
          <div>Hora: {format(new Date(), 'HH:mm:ss')}</div>
        </div>
      </div>

      {/* Hoja de Ruta para WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            <span>Hoja de Ruta para WhatsApp</span>
          </CardTitle>
          <CardDescription>
            Genera una hoja de ruta diaria para enviar a los equipos de trabajo (sin precios)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaHojaRuta">Fecha del Servicio</Label>
              <Input
                id="fechaHojaRuta"
                type="date"
                value={fechaHojaRuta}
                onChange={(e) => setFechaHojaRuta(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipoHojaRuta">Equipo de Trabajo</Label>
              <Select value={equipoSeleccionado} onValueChange={setEquipoSeleccionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un equipo" />
                </SelectTrigger>
                <SelectContent>
                  {equipos.map((equipo) => (
                    <SelectItem key={equipo.id} value={equipo.nombre}>
                      {equipo.nombre} - {equipo.lider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={generarHojaRuta}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Truck className="h-4 w-4 mr-2" />
                {loading ? 'Generando...' : 'Generar Hoja de Ruta'}
              </Button>
            </div>
          </div>

          {hojaRutaTexto && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Hoja de Ruta Generada:</Label>
                <Button
                  onClick={copiarHojaRuta}
                  variant="outline"
                  size="sm"
                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar para WhatsApp
                </Button>
              </div>
              <Textarea
                value={hojaRutaTexto}
                readOnly
                className="h-48 font-mono text-sm"
                placeholder="La hoja de ruta aparecerá aquí..."
              />
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                💡 <strong>Tip:</strong> Haz clic en "Copiar para WhatsApp" y luego pega directamente en el chat del equipo. 
                La hoja no incluye precios para mantener la confidencialidad.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reportes de Ganancias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Reportes de Ganancias</span>
          </CardTitle>
          <CardDescription>
            Genera reportes detallados de ingresos en formato texto o Excel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaDesde">Fecha Desde</Label>
              <Input
                id="fechaDesde"
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaHasta">Fecha Hasta</Label>
              <Input
                id="fechaHasta"
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={generarReporteTexto}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Reporte Texto
              </Button>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={reporteGananciasExcel}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Reporte Excel
              </Button>
            </div>
          </div>

          {reporteTexto && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Reporte de Ganancias:</Label>
                <Button
                  onClick={copiarReporte}
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Reporte
                </Button>
              </div>
              <Textarea
                value={reporteTexto}
                readOnly
                className="h-64 font-mono text-sm"
                placeholder="El reporte aparecerá aquí..."
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup y Exportaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-purple-600" />
            <span>Backup y Exportaciones</span>
          </CardTitle>
          <CardDescription>
            Realiza copias de seguridad y exportaciones en formato Excel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-2 border-dashed border-gray-200 hover:border-purple-300 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Backup de Clientes</span>
                </CardTitle>
                <CardDescription>
                  Exporta todos los clientes a formato Excel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={backupClientesExcel}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Descargar Excel
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                  <span>Backup de Servicios</span>
                </CardTitle>
                <CardDescription>
                  Exporta servicios y ganancias a Excel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => {
                    setFechaDesde('2020-01-01');
                    setFechaHasta(format(new Date(), 'yyyy-MM-dd'));
                    setTimeout(() => reporteGananciasExcel(), 100);
                  }}
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Backup Completo
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <Archive className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900">Información sobre Exportaciones</h4>
                <ul className="text-sm text-amber-800 mt-2 space-y-1">
                  <li>• Los archivos Excel son compatibles con Microsoft Excel y Google Sheets</li>
                  <li>• Las hojas de ruta para WhatsApp no incluyen precios por seguridad</li>
                  <li>• Los reportes de texto pueden copiarse directamente</li>
                  <li>• Realiza backups periódicos para proteger la información</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accesos Rápidos */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100" 
              onClick={() => {
                setFechaDesde(format(new Date(), 'yyyy-MM-01'));
                setFechaHasta(format(new Date(), 'yyyy-MM-dd'));
              }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Mes Actual</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">
              Configurar fechas para el mes en curso
            </p>
            <Badge variant="secondary" className="mt-2 bg-blue-200 text-blue-800">
              {format(new Date(), 'MMMM yyyy', { locale: es })}
            </Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100"
              onClick={() => {
                const today = new Date();
                const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                setFechaDesde(format(firstDayLastMonth, 'yyyy-MM-dd'));
                setFechaHasta(format(lastDayLastMonth, 'yyyy-MM-dd'));
              }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <span>Mes Anterior</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700">
              Configurar fechas para el mes pasado
            </p>
            <Badge variant="secondary" className="mt-2 bg-green-200 text-green-800">
              Reporte mensual
            </Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100"
              onClick={() => {
                setFechaHojaRuta(format(new Date(), 'yyyy-MM-dd'));
              }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <span>Hoy</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-700">
              Hoja de ruta para el día de hoy
            </p>
            <Badge variant="secondary" className="mt-2 bg-purple-200 text-purple-800">
              {format(new Date(), 'dd/MM/yyyy', { locale: es })}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reportes;
