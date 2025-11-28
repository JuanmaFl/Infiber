'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Send, Bot, User } from 'lucide-react';
import { chat } from '@/lib/api';

export default function ChatIA() {
  const [mensajes, setMensajes] = useState([
    {
      rol: 'asistente',
      contenido: '¡Hola! Soy el asistente virtual de Infiber. ¿En qué puedo ayudarte hoy?',
      tiempo: new Date()
    }
  ]);
  const [inputMensaje, setInputMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensajes]);

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!inputMensaje.trim() || enviando) return;

    const nuevoMensaje = {
      rol: 'usuario',
      contenido: inputMensaje,
      tiempo: new Date()
    };

    setMensajes([...mensajes, nuevoMensaje]);
    setInputMensaje('');
    setEnviando(true);

    try {
      const respuesta = await chat(inputMensaje);
      
      const mensajeAsistente = {
        rol: 'asistente',
        contenido: respuesta.respuesta || respuesta.error || 'Lo siento, no pude procesar tu mensaje.',
        tiempo: new Date()
      };

      setMensajes(prev => [...prev, mensajeAsistente]);
    } catch (error) {
      const mensajeError = {
        rol: 'asistente',
        contenido: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.',
        tiempo: new Date()
      };
      setMensajes(prev => [...prev, mensajeError]);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-12rem)]">
        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#00BCD4] rounded-full flex items-center justify-center">
                <Bot className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#212121]">Asistente Virtual Infiber</h2>
                <p className="text-sm text-[#757575]">● En línea</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            {mensajes.map((mensaje, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${mensaje.rol === 'usuario' ? 'justify-end' : 'justify-start'}`}
              >
                {mensaje.rol === 'asistente' && (
                  <div className="w-8 h-8 bg-[#00BCD4] rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="text-white" size={16} />
                  </div>
                )}

                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    mensaje.rol === 'usuario'
                      ? 'bg-[#00BCD4] text-white'
                      : 'bg-[#E3F2FD] text-[#212121]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{mensaje.contenido}</p>
                  <p className={`text-xs mt-2 ${
                    mensaje.rol === 'usuario' ? 'text-white/70' : 'text-[#757575]'
                  }`}>
                    {mensaje.tiempo.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {mensaje.rol === 'usuario' && (
                  <div className="w-8 h-8 bg-[#757575] rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="text-white" size={16} />
                  </div>
                )}
              </motion.div>
            ))}

            {enviando && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 bg-[#00BCD4] rounded-full flex items-center justify-center">
                  <Bot className="text-white" size={16} />
                </div>
                <div className="bg-[#E3F2FD] p-4 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#00BCD4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-[#00BCD4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-[#00BCD4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleEnviar} className="p-6 border-t border-gray-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMensaje}
                onChange={(e) => setInputMensaje(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={enviando}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-full focus:border-[#00BCD4] focus:outline-none transition text-[#212121] disabled:opacity-50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!inputMensaje.trim() || enviando}
                className="w-12 h-12 bg-[#00BCD4] text-white rounded-full hover:bg-[#00ACC1] transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}