import React from 'react';
import { LayoutDashboard, FileText, MessageSquare, Bell } from 'lucide-react';

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">Portal Client</h1>
        <div className="flex items-center gap-4">
          <Bell className="text-gray-400 cursor-pointer" />
          <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">C</div>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Bun venit, SC COSI COM PLUS SRL</h2>
          <p className="text-gray-500">Vizualizează situația ta contabilă în timp real.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <FileText className="text-primary mb-4" size={32} />
            <h3 className="font-bold text-lg">Documente Recente</h3>
            <p className="text-sm text-gray-500 mt-1">Ai 3 documente noi de semnat.</p>
            <button className="mt-4 text-primary font-bold text-sm hover:underline">Vezi documente</button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <MessageSquare className="text-success mb-4" size={32} />
            <h3 className="font-bold text-lg">Mesaje Contabil</h3>
            <p className="text-sm text-gray-500 mt-1">Ultimul mesaj primit acum 1 oră.</p>
            <button className="mt-4 text-success font-bold text-sm hover:underline">Deschide chat</button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <LayoutDashboard className="text-danger mb-4" size={32} />
            <h3 className="font-bold text-lg">Situație Plăți</h3>
            <p className="text-sm text-gray-500 mt-1">Toate taxele sunt la zi.</p>
            <button className="mt-4 text-danger font-bold text-sm hover:underline">Vezi detalii</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-lg mb-4">Istoric Facturi</h3>
          <div className="text-center py-12 text-gray-400">
            <p>Nu există facturi încărcate pentru luna curentă.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
