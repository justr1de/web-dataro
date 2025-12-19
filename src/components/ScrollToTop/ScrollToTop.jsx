import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que faz scroll automático para o topo da página
 * sempre que a rota (pathname) mudar.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll suave para o topo
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // 'instant' para ser imediato, 'smooth' para animação
    });
  }, [pathname]);

  return null; // Este componente não renderiza nada
};

export default ScrollToTop;
