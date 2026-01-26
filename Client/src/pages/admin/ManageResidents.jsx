import React, { useState } from 'react';
import {
    Users,
    Plus,
    Search,
    Mail,
    Phone,
    Building2,
    Trash2,
    Edit,
    X,
    MoreVertical,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';

const ManageResidents = () => {

    // 🔹 TEMP DATA (Branch-2 only)
    const [residents, setResidents] = useState([
        {
            id: 1,
            name: 'Atmaram Bhide',
            email: 'bhide@gokuldham.com',
            phone: '9876543210',
            wing: 'A',
            flat: '101',
            block: '1',
            type: 'Owner'
        },
        {
            id: 2,
            name: 'Anita Bhabhi',
            email: 'anita@gmail.com',
            phone: '9123456789',
            wing: 'B',
            flat: '305',
            block: '2',
            type: 'Tenant'
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        wing: 'A',
        flat: '',
        block: '',
        type: 'Owner'
    });

    const filteredResidents = residents.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.flat.includes(searchQuery)
    );

    const openAddModal = () => {
        setIsEditing(false);
        setFormData({
            name: '',
            email: '',
            phone: '',
            wing: 'A',
            flat: '',
            block: '',
            type: 'Owner'
        });
        setShowModal(true);
    };

    const openEditModal = (res) => {
        setIsEditing(true);
        setSelectedId(res.id);
        setFormData(res);
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            setResidents(prev =>
                prev.map(r =>
                    r.id === selectedId ? { ...formData, id: selectedId } : r
                )
            );
        } else {
            setResidents(prev => [
                ...prev,
                { ...formData, id: Date.now() }
            ]);
        }

        setShowModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Remove this resident?')) {
            setResidents(prev => prev.filter(r => r.id !== id));
        }
    };

    return (
        <div className="pb-10">
            <div className="flex justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Residents Directory</h1>
                    <p className="text-slate-500 mt-1">Manage and view all registered society members.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold flex gap-2"
                >
                    <Plus className="w-5 h-5" /> Add Resident
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Stat label="Total Residents" value={residents.length} icon={Users} />
                <Stat label="Owners" value={residents.filter(r => r.type === 'Owner').length} icon={ShieldCheck} />
                <Stat label="Tenants" value={residents.filter(r => r.type === 'Tenant').length} icon={Building2} />
            </div>

            {/* Search */}
            <div className="bg-white p-2 rounded-2xl border mb-10">
                <input
                    placeholder="Search by name, email or flat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 rounded-xl bg-slate-50"
                />
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredResidents.map(res => (
                    <div key={res.id} className="bg-white rounded-3xl border p-2">
                        <div className="p-6 bg-slate-50 rounded-2xl">
                            <div className="flex justify-between mb-6">
                                <div>
                                    <h3 className="font-black text-lg">{res.name}</h3>
                                    <span className="text-xs font-bold text-indigo-600">{res.type}</span>
                                </div>
                                <MoreVertical className="w-5 h-5 text-slate-300" />
                            </div>

                            <p className="text-sm font-bold text-slate-600">
                                Wing {res.wing} - Flat {res.flat} | Block {res.block}
                            </p>
                            <p className="text-xs mt-2">{res.email}</p>
                            <p className="text-xs">{res.phone}</p>
                        </div>

                        <div className="p-4 flex gap-2">
                            <button
                                onClick={() => openEditModal(res)}
                                className="flex-1 border rounded-xl py-3 text-sm font-bold"
                            >
                                <Edit className="inline w-4 h-4" /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(res.id)}
                                className="flex-1 border rounded-xl py-3 text-sm font-bold text-rose-500"
                            >
                                <Trash2 className="inline w-4 h-4" /> Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-10 rounded-3xl w-full max-w-xl"
                    >
                        <h2 className="text-2xl font-black mb-6">
                            {isEditing ? 'Edit Resident' : 'Add Resident'}
                        </h2>

                        {['name','email','phone','flat','block'].map(field => (
                            <input
                                key={field}
                                placeholder={field.toUpperCase()}
                                value={formData[field]}
                                onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                                className="w-full mb-4 px-4 py-3 rounded-xl border"
                            />
                        ))}

                        <select
                            value={formData.wing}
                            onChange={e => setFormData({ ...formData, wing: e.target.value })}
                            className="w-full mb-4 px-4 py-3 rounded-xl border"
                        >
                            <option>A</option><option>B</option><option>C</option><option>D</option>
                        </select>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="flex-1 border py-3 rounded-xl font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold"
                            >
                                {isEditing ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

const Stat = ({ label, value, icon: Icon }) => (
    <div className="bg-white p-6 rounded-2xl border flex justify-between">
        <div>
            <p className="text-xs font-bold text-slate-400">{label}</p>
            <p className="text-3xl font-black text-indigo-600">{value}</p>
        </div>
        <Icon className="w-8 h-8 text-indigo-300" />
    </div>
);

export default ManageResidents;
