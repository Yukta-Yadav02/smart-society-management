import React, { useState } from "react";
import Society from './assets/Society.jpg';

const AddVisitor = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    flat: '',
    type: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Visitor Data:", formData);
    alert("Visitor Checked-In Successfully!");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4 relative font-sans"
      style={{
        backgroundImage: `url(${Society})`,
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]"></div>

      <div className="relative z-10 w-full max-w-[95%] sm:max-w-xl md:max-w-3xl bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl p-6 md:p-10 lg:p-12">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Visitor <span className="text-blue-500">Entry Form</span>
          </h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto mt-2 rounded-full"></div>
          <p className="text-gray-400 mt-4 text-sm md:text-base font-medium">
            Enter visitor details for society gate entry
          </p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold mb-2 ml-1">
               Visitor Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold mb-2 ml-1">
              Mobile Number
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold mb-2 ml-1">
              Flat Number
            </label>
            <input
              type="text"
              name="flat"
              value={formData.flat}
              onChange={handleChange}
              placeholder="e.g. A-104"
              className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold mb-2 ml-1">
              Visitor Type
            </label>
            <div className="relative">
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer transition-all appearance-none"
                required
              >
                <option value="" className="bg-slate-900">Select purpose</option>
                <option value="guest" className="bg-slate-900">Guest</option>
                <option value="delivery" className="bg-slate-900">Delivery</option>
                <option value="maintenance" className="bg-slate-900">Maintenance</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                ▼
              </div>
            </div>
          </div>

          <div className="md:col-span-2 mt-6">
            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl tracking-[0.2em] text-sm shadow-xl shadow-blue-900/40 hover:-translate-y-1 active:scale-[0.98] transition-all uppercase"
            >
              Check-In Visitor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVisitor;