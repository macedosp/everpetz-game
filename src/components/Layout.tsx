import React from 'react';
import { APP_NAME } from '../constants';
import { PawPrint } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-orange-50 text-gray-800">
      <header className="w-full max-w-md flex flex-col items-center mb-6">
        <div className="bg-orange-500 p-3 rounded-full shadow-lg mb-3">
            <PawPrint className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
          {APP_NAME}
        </h1>
      </header>
      
      <main className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 relative min-h-[400px] flex flex-col">
        {children}
      </main>

      <footer className="mt-8 text-sm text-gray-500 font-semibold">
        © 2024 Everpetz Marketplace
      </footer>
    </div>
  );
};