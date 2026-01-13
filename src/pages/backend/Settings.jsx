import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { UserPlus, Shield, Mail, Phone, User } from 'lucide-react';

export default function Settings({ profile }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile.role === 'admin') {
      fetchUsers();
    }
  }, [profile]);

  async function fetchUsers() {
    const { data } = await supabase.from('profiles').select('*');
    if (data) setUsers(data);
    setLoading(false);
  }

  if (profile.role !== 'admin') {
    return (
      <div className="bg-red-50 text-danger p-6 rounded-xl border border-red-100">
        Acces restricționat. Doar administratorii pot accesa această pagină.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Shield className="text-primary" />
            Gestiune Utilizatori Backend
          </h3>
          <button className="bg-success text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition">
            <UserPlus size={20} />
            Adaugă Utilizator
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u) => (
            <div key={u.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-primary font-bold text-lg">
                  {u.first_name?.[0]}{u.last_name?.[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{u.first_name} {u.last_name}</p>
                  <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase font-bold">
                    {u.role?.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  {u.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  {u.phone || 'Nespecificat'}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end gap-2">
                <button className="text-xs font-bold text-primary hover:underline">Editează</button>
                <button className="text-xs font-bold text-danger hover:underline">Dezactivează</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
