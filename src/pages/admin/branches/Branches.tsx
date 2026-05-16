import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Branches: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin/settings?tab=campuses', { replace: true });
  }, [navigate]);

  return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground font-medium italic">Redirecting to Campuses Settings...</div>
    </div>
  );
};
