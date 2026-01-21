'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, CheckCircle, Wifi } from 'lucide-react';

export default function ContratarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Wifi className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Infiber ISP</h1>
            </div>
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contratar Servicio de Internet
          </h1>
          <p className="text-xl text-gray-600">
            Internet de alta velocidad para tu hogar o negocio
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <CheckCircle className="mr-3 text-green-500" />
            Proceso de Contratación
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                  1
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Contáctanos vía WhatsApp</h3>
                <p className="text-gray-600">
                  Envíanos un mensaje con tus datos: nombre completo, dirección exacta y cédula para evaluar cobertura en tu zona.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                  2
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Evaluación de Cobertura</h3>
                <p className="text-gray-600">
                  Verificamos si tu dirección tiene cobertura en nuestras zonas de servicio.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                  3
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Firma de Contrato</h3>
                <p className="text-gray-600">
                  Te enviamos el contrato por WhatsApp. Puedes devolverlo escaneado y firmado por el mismo medio o firmarlo presencialmente en nuestra oficina.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                  4
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Instalación Técnica</h3>
                <p className="text-gray-600">
                  Agendamos la visita técnica para instalar el servicio en tu domicilio.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                  5
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Acceso al Portal Virtual</h3>
                <p className="text-gray-600">
                  Una vez instalado el servicio, creamos tu usuario en el portal y te entregamos tus credenciales para gestionar tu cuenta, pagar facturas y abrir tickets de soporte.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Información de Contacto
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" className="flex items-center p-4 border-2 border-green-500 rounded-lg hover:bg-green-50 transition-colors">
              <Phone className="h-8 w-8 text-green-500 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                <p className="text-gray-600">+57 300 123 4567</p>
              </div>
            </a>

            <a href="mailto:ventas@infiber.com" className="flex items-center p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors">
              <Mail className="h-8 w-8 text-blue-500 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">ventas@infiber.com</p>
              </div>
            </a>

            <div className="flex items-start p-4 border-2 border-purple-500 rounded-lg">
              <MapPin className="h-8 w-8 text-purple-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Oficina</h3>
                <p className="text-gray-600">
                  Calle 123 #45-67, Barrio Example
                  <br />
                  Medellín, Colombia
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 border-2 border-orange-500 rounded-lg">
              <Clock className="h-8 w-8 text-orange-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Horario de Atención</h3>
                <p className="text-gray-600">
                  Lunes a Viernes: 8:00 AM - 6:00 PM
                  <br />
                  Sábados: 9:00 AM - 2:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Planes Disponibles</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Básico</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                $45.000<span className="text-sm text-gray-600 font-normal">/mes</span>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  20 Mbps
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Ideal para navegación
                </li>
              </ul>
            </div>

            <div className="border-2 border-blue-500 rounded-lg p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Recomendado</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Estándar</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                $70.000<span className="text-sm text-gray-600 font-normal">/mes</span>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  50 Mbps
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Streaming HD
                </li>
              </ul>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Premium</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                $95.000<span className="text-sm text-gray-600 font-normal">/mes</span>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  100 Mbps
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Gaming online
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Zonas de Cobertura</h2>
          <div className="flex flex-wrap gap-4">
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">Palmitas</span>
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">San Cristóbal</span>
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">Robledo</span>
          </div>
          <p className="mt-4 text-gray-600">
            ¿Tu zona no aparece? Contáctanos de todas formas, estamos expandiendo nuestra cobertura constantemente.
          </p>
        </div>

        <div className="text-center mt-12">
          <a href="https://wa.me/573001234567?text=Hola,%20quiero%20contratar%20el%20servicio%20de%20internet" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg text-lg transition-colors shadow-lg">
            <Phone className="mr-2" />
            Contactar por WhatsApp
          </a>
        </div>
      </main>

      <footer className="bg-gray-900 text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 Infiber ISP. Todos los derechos reservados.</p>
          <p className="mt-2 text-gray-400">Internet de alta velocidad para Medellín</p>
        </div>
      </footer>
    </div>
  );
}
