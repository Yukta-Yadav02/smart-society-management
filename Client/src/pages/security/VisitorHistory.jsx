import React, { useState, useEffect } from "react";
import { History, Search, Filter, Calendar, Clock, User, Building, LogOut, LogIn, Download, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiConnector } from '../../services/apiConnector';
import { VISITOR_API } from '../../services/apis';

const VisitorHistory = () => {
    const [visitors, setVisitors] = useState([]);
    const [filteredVisitors, setFilteredVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, IN, OUT
    const [filterDate, setFilterDate] = useState(''); // Date filter

    useEffect(() => {
        fetchVisitorHistory();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, filterStatus, filterDate, visitors]);

    const fetchVisitorHistory = async () => {
        try {
            setLoading(true);
            const res = await apiConnector("GET", VISITOR_API.GET_HISTORY);

            if (res.success) {
                setVisitors(res.data || []);
            } else {
                toast.error('Failed to fetch visitor history');
            }
        } catch (error) {
            console.error('Error fetching visitor history:', error);
            toast.error('Error loading visitor history');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...visitors];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(visitor =>
                visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                visitor.mobile.includes(searchTerm) ||
                (visitor.flat?.flatNumber && visitor.flat.flatNumber.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Status filter
        if (filterStatus !== 'ALL') {
            filtered = filtered.filter(visitor => visitor.status === filterStatus);
        }

        // Date filter
        if (filterDate) {
            filtered = filtered.filter(visitor => {
                const entryDate = new Date(visitor.entryTime).toDateString();
                const selectedDate = new Date(filterDate).toDateString();
                return entryDate === selectedDate;
            });
        }

        setFilteredVisitors(filtered);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const calculateDuration = (entryTime, exitTime) => {
        if (!exitTime) return 'Still Inside';

        const entry = new Date(entryTime);
        const exit = new Date(exitTime);
        const diffMs = exit - entry;

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Mobile', 'Flat', 'Purpose', 'Entry Time', 'Exit Time', 'Duration', 'Status', 'Entered By'];
        const csvData = filteredVisitors.map(v => [
            v.name,
            v.mobile,
            v.flat?.flatNumber || 'N/A',
            v.purpose,
            formatDate(v.entryTime) + ' ' + formatTime(v.entryTime),
            v.exitTime ? formatDate(v.exitTime) + ' ' + formatTime(v.exitTime) : 'N/A',
            calculateDuration(v.entryTime, v.exitTime),
            v.status,
            v.enteredBy?.name || 'N/A'
        ]);

        const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `visitor-history-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.success('History exported successfully!');
    };

    const stats = {
        total: visitors.length,
        active: visitors.filter(v => v.status === 'IN').length,
        exited: visitors.filter(v => v.status === 'OUT').length,
        today: visitors.filter(v => new Date(v.entryTime).toDateString() === new Date().toDateString()).length
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-purple-100 p-2 rounded-lg">
                        <History className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Visitor History</h1>
                </div>
                <p className="text-sm sm:text-base text-slate-600">Complete record of all visitors</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-600">Total Visitors</p>
                            <p className="text-xl font-bold text-slate-800">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <LogIn className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-600">Currently Inside</p>
                            <p className="text-xl font-bold text-slate-800">{stats.active}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-2 rounded-lg">
                            <LogOut className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-600">Exited</p>
                            <p className="text-xl font-bold text-slate-800">{stats.exited}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-600">Today's Visitors</p>
                            <p className="text-xl font-bold text-slate-800">{stats.today}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Search
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, mobile, or flat..."
                                className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Status
                        </label>
                        <div className="relative">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all appearance-none bg-white"
                            >
                                <option value="ALL">All Status</option>
                                <option value="IN">Currently Inside</option>
                                <option value="OUT">Exited</option>
                            </select>
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                    </div>

                    {/* Date Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Date
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                            />
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-4">
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setFilterStatus('ALL');
                            setFilterDate('');
                        }}
                        className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all duration-200 text-sm"
                    >
                        Clear Filters
                    </button>
                    <button
                        onClick={fetchVisitorHistory}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 text-sm"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button
                        onClick={exportToCSV}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Visitor Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
                        <p className="mt-4 text-slate-600">Loading visitor history...</p>
                    </div>
                ) : filteredVisitors.length === 0 ? (
                    <div className="p-12 text-center">
                        <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600 font-semibold">No visitors found</p>
                        <p className="text-sm text-slate-500 mt-2">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Visitor</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Flat</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Purpose</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Entry Time</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Exit Time</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredVisitors.map((visitor) => (
                                    <tr key={visitor._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-slate-800">{visitor.name}</p>
                                                <p className="text-sm text-slate-500">{visitor.mobile}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Building className="w-4 h-4 text-slate-400" />
                                                <span className="font-medium text-slate-700">
                                                    {visitor.flat?.flatNumber || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 max-w-xs truncate">{visitor.purpose}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">{formatDate(visitor.entryTime)}</p>
                                                <p className="text-xs text-slate-500">{formatTime(visitor.entryTime)}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {visitor.exitTime ? (
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700">{formatDate(visitor.exitTime)}</p>
                                                    <p className="text-xs text-slate-500">{formatTime(visitor.exitTime)}</p>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-slate-700">
                                                {calculateDuration(visitor.entryTime, visitor.exitTime)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {visitor.status === 'IN' ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                    <LogIn className="w-3 h-3" />
                                                    Inside
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                                                    <LogOut className="w-3 h-3" />
                                                    Exited
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Results Count */}
            {!loading && filteredVisitors.length > 0 && (
                <div className="mt-4 text-center text-sm text-slate-600">
                    Showing {filteredVisitors.length} of {visitors.length} visitors
                </div>
            )}
        </div>
    );
};

export default VisitorHistory;
