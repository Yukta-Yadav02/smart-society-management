import React from 'react';
import Society from './assets/Society.jpg';

const ExitVisitor = () => {
  const visitors = [
    { id: 1, name: "Arjun Mehta", flat: "A-502", time: "09:45 AM", type: "Guest", color: "from-blue-600 to-blue-400" },
    { id: 2, name: "Suresh Raina", flat: "B-104", time: "10:20 AM", type: "Delivery", color: "from-indigo-600 to-indigo-400" },
    { id: 3, name: "Kavita Iyer", flat: "D-901", time: "11:05 AM", type: "Work", color: "from-cyan-600 to-cyan-400" },
    { id: 4, name: "Vikram Singh", flat: "C-202", time: "11:45 AM", type: "Guest", color: "from-blue-700 to-blue-500" },
  ];
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed relative selection:bg-blue-500/30"
      style={{
        backgroundImage: `url(${Society})`,
      }}
    >
      
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[4px]"></div>

      <div className="relative z-10 p-4 sm:p-8 md:p-12 max-w-7xl mx-auto pt-32">

        {/* Header Section */}
        <div className="mb-10 border-l-4 border-blue-600 pl-6 animate-in fade-in slide-in-from-left-4 duration-700">
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
            Active <span className="text-blue-500">Visitors</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <p className="text-gray-400 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
              Live Society Status
            </p>
          </div>
        </div>

        {/* Visitors Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visitors.map((v) => (
            <div
              key={v.id}
              className="group relative bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[2rem] p-6 transition-all duration-500 hover:bg-slate-900/60 hover:border-blue-500/40 hover:-translate-y-2 shadow-2xl overflow-hidden"
                                               >
              {/* Background Glow Effect */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-600/10 blur-3xl group-hover:bg-blue-600/20 transition-all duration-500"></div>

              <div className="flex flex-col items-center relative z-10">
                {/* Avatar with Gradient */}
                <div className={`w-16 h-16 bg-gradient-to-br ${v.color} rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-[0_10px_20px_rgba(0,0,0,0.3)] mb-4 ring-4 ring-white/5 group-hover:scale-110 transition-transform duration-500`}>
                  {v.name.charAt(0)}
                </div>

                <h3 className="text-lg font-extrabold text-white tracking-tight text-center w-full group-hover:text-blue-400 transition-colors">
                  {v.name}
                </h3>
                <p className="text-blue-500/80 text-xs font-black mt-1 uppercase tracking-widest">
                  {v.flat}
                </p>
                {/* Info Badges */}
                <div className="mt-6 grid grid-cols-2 gap-2 w-full">
                  <div className="bg-white/5 border border-white/5 px-2 py-2 rounded-xl text-center">
                    <p className="text-[8px] text-gray-500 uppercase">Purpose</p>
                    <p className="text-[10px] text-gray-200 font-bold">{v.type}</p>
                  </div>
                  <div className="bg-blue-600/10 border border-blue-500/10 px-2 py-2 rounded-xl text-center">
                    <p className="text-[8px] text-blue-400 uppercase">Entry</p>
                    <p className="text-[10px] text-blue-200 font-bold">{v.time}</p>
                  </div>
                </div>
                {/* Action Button */}
                <button className="mt-6 w-full py-3 bg-white/5 hover:bg-red-500 text-gray-300 hover:text-white rounded-xl font-black transition-all duration-300 text-[10px] 
                uppercase tracking-widest border
                 border-white/10 hover:border-red-500 shadow-lg active:scale-95 flex items-center justify-center gap-2">
                  Mark Exit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExitVisitor;