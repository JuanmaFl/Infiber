'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, FileText, CreditCard, Ticket, MessageSquare, 
  User, LogOut, Menu, X 
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    router.push('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Panel Principal', href: '/dashboard/cliente' },
    { icon: FileText, label: 'Mi Contrato', href: '/dashboard/cliente/contrato' },
    { icon: CreditCard, label: 'Mis Facturas', href: '/dashboard/cliente/facturas' },
    { icon: CreditCard, label: 'Realizar Pago', href: '/dashboard/cliente/pagos' },
    { icon: Ticket, label: 'Mis Tickets', href: '/dashboard/cliente/tickets' },
    { icon: MessageSquare, label: 'Chat IA', href: '/dashboard/cliente/chat' },
    { icon: User, label: 'Mi Perfil', href: '/dashboard/cliente/perfil' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="fixed left-0 top-0 h-full bg-[#212121] text-white z-50"
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-[#00BCD4]"
            >
              Infiber
            </motion.h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link key={index} href={item.href}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`flex items-center gap-4 px-6 py-3 cursor-pointer transition ${
                    isActive 
                      ? 'bg-[#00BCD4] text-white' 
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <item.icon size={20} />
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            );
          })}

          <motion.div
            whileHover={{ x: 5 }}
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-3 cursor-pointer hover:bg-red-600 transition mt-6"
          >
            <LogOut size={20} />
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Cerrar sesión
              </motion.span>
            )}
          </motion.div>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div
        style={{ marginLeft: sidebarOpen ? 280 : 80 }}
        className="transition-all duration-300"
      >
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#212121]">
              Panel de Cliente
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-[#757575]">Bienvenido</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}