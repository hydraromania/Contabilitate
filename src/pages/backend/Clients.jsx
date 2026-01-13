import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Edit2, Trash2, X, Loader2 } from 'lucide-react';

export default function Clients({ profile }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company_name: '',
    cui: '',
    address: '',
    city: '',
    county: '',
    phone: '',
    role: 'administrator'
  });

  useEffect(() => {
    if (profile) {
      fetchClients();
    }
  }, [profile]);

  async function fetchClients() {
    setLoading(true);
    try {
      let query = supabase.from('clients').select('*');
      
      if (profile.role === 'contabil') {
        query = query.eq('assigned_to', profile.id);
      } else if (profile.role === 'contabil_sef') {
        query = query.or(`created_by.eq.${profile.id},assigned_to.eq.${profile.id}`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) return;

    const { error } = await supabase.from('clients').insert([{
      ...formData,
      created_by: profile.id
    }]);

    if (!error) {
      setIsModalOpen(false);
      fetchClients();
      setFormData({
        first_name: '', last_name: '', email: '', company_name: '',
        cui: '', address: '', city: '', county: '', phone: '', role: 'administrator'
      });
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const filteredClients = clients.filter(c => 
    c.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cui.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Caută după firmă sau CUI..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {(profile.role === 'admin' || profile.role === 'contabil_sef') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Adaugă Client
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="animate-spin mb-2" size={24} />
            <p>Se încarcă clienții...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Societate / CUI</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Reprezentant</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Contact</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Locație</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    Nu s-au găsit clienți.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{client.company_name}</p>
                      <p className="text-xs text-gray-500">CUI: {client.cui}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{client.first_name} {client.last_name}</p>
                      <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full uppercase font-bold">
                        {client.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{client.email}</p>
                      <p className="text-sm text-gray-500">{client.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{client.city}</p>
                      <p className="text-xs text-gray-500">{client.county}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-primary hover:bg-blue-50 rounded-lg transition">
                          <Edit2 size={18} />
                        </button>
                        {profile.role === 'admin' && (
                          <button className="p-2 text-danger hover:bg-red-50 rounded-lg transition">
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Adaugare Client */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold">Adaugă Client Nou</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Nume</label>
                <input required className="w-full p-2 border rounded-lg" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Prenume</label>
                <input required className="w-full p-2 border rounded-lg" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Email</label>
                <input required type="email" className="w-full p-2 border rounded-lg" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Telefon</label>
                <input required className="w-full p-2 border rounded-lg" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-semibold">Societate</label>
                <input required className="w-full p-2 border rounded-lg" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">CUI</label>
                <input required className="w-full p-2 border rounded-lg" value={formData.cui} onChange={e => setFormData({...formData, cui: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Rol Client</label>
                <select className="w-full p-2 border rounded-lg" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="administrator">Administrator</option>
                  <option value="angajat">Angajat</option>
                </select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-semibold">Sediu / Adresă</label>
                <input className="w-full p-2 border rounded-lg" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Localitate</label>
                <input className="w-full p-2 border rounded-lg" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Județ</label>
                <input className="w-full p-2 border rounded-lg" value={formData.county} onChange={e => setFormData({...formData, county: e.target.value})} />
              </div>

              <div className="md:col-span-2 pt-4">
                <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                  Salvează Clientul
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
