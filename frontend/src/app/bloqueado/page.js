'use client';
import { useEffect, useState } from 'react';
import UsuarioBloqueado from '@/components/UsuarioBloqueado';
import { useRouter } from 'next/navigation';

export default function BloqueadoPage() {
  const router = useRouter();
  const [infoBloqueo, setInfoBloqueo] = useState(null);

  useEffect(() => {
    const info = localStorage.getItem('usuario_bloqueado');
    if (info) {
      setInfoBloqueo(JSON.parse(info));
    } else {
      // Si no hay info de bloqueo, redirigir al login
      router.push('/login');
    }
  }, [router]);

  if (!infoBloqueo) {
    return null;
  }

  return (
    <UsuarioBloqueado
      mensaje={infoBloqueo.mensaje}
      instrucciones={infoBloqueo.instrucciones}
      opciones={infoBloqueo.opciones}
      nota={infoBloqueo.nota}
    />
  );
}