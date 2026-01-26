import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  ChevronDown,
  ExternalLink,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManageFlats = () => {
  const navigate = useNavigate();

  /* 🔐 TEMP DATA (future: Redux / API) */
  const [flats, setFlats] = useState([
    { id: 1, number: '101', wing: 'A Wing', block: 'Block 1', status: 'Occupied' },
    { id: 2, number: '102', wing: 'A Wing', block: 'Block 1', status: 'Vacant' },
    { id: 3, number: '305', wing: 'B Wing', block: 'Block 2', status: 'Occupied' },
    { id: 4, number: '401', wing: 'D Wing', block: 'Block 3', status: 'Vacant' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWing, setSelectedWing] = useState('All Wings');
  const [showWingDropdown, setShowWingDropdown] = useState(false);

  const [formData, setFormData] = useState({
    number: '',
    wing: 'A Wing',
    block: ''
  });

  const filteredFlats = flats.filter(f => {
    const matchesSearch =
      f.number.includes(searchQuery) ||
      f.block.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWing =
      selectedWing === 'All Wings' || f.wing === selectedWing;
    return matchesSearch && matchesWing;
  });

  const handleAddFlat = () => {
    setFlats([
      ...flats,
      {
        id: Date.now(),
        ...formData,
        status: 'Vacant'
      }
    ]);
    setShowAddModal(false);
    setFormData({ number: '', wing: 'A Wing', block: '' });
  };

  const StatusBadge = ({ status }) => (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        status === 'Occupied'
          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
          : 'bg-amber-50 text-amber-600 border border-amber-100'
      }`}
    >
      {status}
    </span>
  );

  return (
    <div className="pb-10">
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manage Flats</h1>
          <p className="text-slate-500 mt-1">Track and manage society flats.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold flex gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Flat
        </button>
      </div>

      <div className="flex gap-4 mb-8 relative">
        <input
          placeholder="Search flat or block..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border"
        />

        <button
          onClick={() => setShowWingDropdown(!showWingDropdown)}
          className="px-6 py-4 rounded-2xl bg-indigo-50 text-indigo-600 font-bold"
        >
          {selectedWing} <ChevronDown className="inline w-4 h-4 ml-1" />
        </button>

        {showWingDropdown && (
          <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border z-10">
            {['All Wings', 'A Wing', 'B Wing', 'C Wing', 'D Wing'].map(w => (
              <button
                key={w}
                onClick={() => {
                  setSelectedWing(w);
                  setShowWingDropdown(false);
                }}
                className="block px-6 py-3 hover:bg-slate-50 w-full text-left font-bold"
              >
                {w}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredFlats.map(flat => (
          <div key={flat.id} className="bg-white p-6 rounded-3xl border shadow-sm">
            <div className="flex justify-between mb-4">
              <div className="text-xl font-black">{flat.number}</div>
              <StatusBadge status={flat.status} />
            </div>
            <p className="text-slate-600 font-bold">{flat.wing}</p>
            <p className="text-slate-500 text-sm">{flat.block}</p>

            {flat.status === 'Occupied' && (
              <button
                onClick={() => navigate('/residents')}
                className="mt-4 text-indigo-600 font-bold flex items-center gap-1"
              >
                View Resident <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Add Flat</h2>

            <input
              placeholder="Flat Number"
              value={formData.number}
              onChange={e => setFormData({ ...formData, number: e.target.value })}
              className="w-full mb-4 px-4 py-3 rounded-xl border"
            />
            <input
              placeholder="Block"
              value={formData.block}
              onChange={e => setFormData({ ...formData, block: e.target.value })}
              className="w-full mb-4 px-4 py-3 rounded-xl border"
            />
            <select
              value={formData.wing}
              onChange={e => setFormData({ ...formData, wing: e.target.value })}
              className="w-full mb-6 px-4 py-3 rounded-xl border"
            >
              <option>A Wing</option>
              <option>B Wing</option>
              <option>C Wing</option>
              <option>D Wing</option>
            </select>

            <div className="flex gap-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-xl border font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFlat}
                className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold"
              >
                Create Flat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFlats;
