'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, FileText, CreditCard, Ticket, 
  Settings, LogOut, Menu, X, BarChart 
} from 'lucide-react';

export default function AdminLayout({ children }) {
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
    { icon: LayoutDashboard, label: 'Panel Admin', href: '/dashboard/admin' },
    { icon: Users, label: 'Gestión Clientes', href: '/dashboard/admin/clientes' },
    { icon: FileText, label: 'Gestión Contratos', href: '/dashboard/admin/contratos' },
    { icon: CreditCard, label: 'Gestión Facturas', href: '/dashboard/admin/facturas' },
    { icon: Ticket, label: 'Gestión Tickets', href: '/dashboard/admin/tickets' },
    { icon: BarChart, label: 'Reportes', href: '/dashboard/admin/reportes' },
    { icon: Settings, label: 'Configuración', href: '/dashboard/admin/configuracion' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="fixed left-0 top-0 h-full bg-[#212121] text-white z-50"
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h1 className="text-2xl font-bold text-[#00BCD4]">Infiber</h1>
              <p className="text-xs text-gray-400">Panel Admin</p>
            </motion.div>
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
              Panel de Administración
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-[#757575]">Admin</span>
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