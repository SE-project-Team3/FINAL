import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function useAuthGuard() {
  const navigate = useNavigate();
  const hasRun = useRef(false); 

  useEffect(() => {
    if (hasRun.current) return; 
    hasRun.current = true;

    const username = localStorage.getItem('user_id');
    if (!username) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/');
    }
  }, [navigate]);
}

export default useAuthGuard;
