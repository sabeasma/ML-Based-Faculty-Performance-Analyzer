import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children }) {
  const { role, user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto flex max-w-[1600px] gap-5">
        <Sidebar role={role} />
        <main className="w-full">
          <Navbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            userName={user?.fullName || 'User'}
            onLogout={logout}
          />
          {children}
        </main>
      </div>
    </div>
  );
}
