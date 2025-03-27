'use client'
import { RootState } from '@/store/persist_store';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../loading/spinner';

const ProtectedRoute = ({ children }: { children: ReactNode; }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push('/');
    }
  }, [user, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>)
  }

  return <>{children}</>;
};

export default ProtectedRoute;
