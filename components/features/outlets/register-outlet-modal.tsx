"use client";

import React, { useState } from "react";
import { X, Search, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface RegisterOutletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterOutletModal({ isOpen, onClose }: RegisterOutletModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    state: "",
    zipcode: "",
    hoursStart: "08:00 AM",
    hoursEnd: "10:00 AM",
    addressLine1: "",
    addressLine2: "",
    contactPerson: "",
    role: "",
    phone: "",
    email: ""
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {
    toast.success("Outlet registration draft saved");
    onClose();
  };

  const handleRegister = () => {
    if (!formData.name) {
      toast.error("Please fill in the outlet name");
      return;
    }
    toast.success("Outlet registered successfully!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Register New Outlet</h2>
            <p className="text-xs font-medium text-slate-500 mt-1">Add a new outlet to the network and configure its setup</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="space-y-8">
            
            {/* Outlet Information */}
            <section>
              <h3 className="text-base font-bold text-slate-900 mb-4">Outlet Information</h3>
              <div className="space-y-4">
                
                {/* Outlet Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Outlet Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Central Square Mall" 
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all"
                  />
                </div>

                {/* Region & State */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Region *</label>
                    <div className="relative">
                      <select 
                        value={formData.region}
                        onChange={(e) => handleChange('region', e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all text-slate-500"
                      >
                        <option value="">Select Region</option>
                        <option value="Mid West">Mid West</option>
                        <option value="North East">North East</option>
                        <option value="West">West</option>
                        <option value="South">South</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">State *</label>
                    <div className="relative">
                      <select 
                        value={formData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all text-slate-500"
                      >
                        <option value="">Select State</option>
                        <option value="Kansas">Kansas</option>
                        <option value="Wisconsin">Wisconsin</option>
                        <option value="Ohio">Ohio</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Zipcode & Operating Hours */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Zipcode *</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search Zipcode..." 
                        value={formData.zipcode}
                        onChange={(e) => handleChange('zipcode', e.target.value)}
                        className="w-full pl-3 pr-9 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all"
                      />
                      <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Operating Hours *</label>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <input type="text" placeholder="08:00 AM" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all" value={formData.hoursStart} onChange={(e) => handleChange('hoursStart', e.target.value)} />
                      </div>
                      <span className="text-xs text-slate-500 font-medium">to</span>
                      <div className="relative flex-1">
                        <input type="text" placeholder="10:00 AM" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all" value={formData.hoursEnd} onChange={(e) => handleChange('hoursEnd', e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Address *</label>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Line 1" 
                      value={formData.addressLine1}
                      onChange={(e) => handleChange('addressLine1', e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all"
                    />
                    <input 
                      type="text" 
                      placeholder="Line 2" 
                      value={formData.addressLine2}
                      onChange={(e) => handleChange('addressLine2', e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all"
                    />
                  </div>
                </div>

              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Point of Contact */}
            <section>
              <h3 className="text-base font-bold text-slate-900 mb-4">Point of Contact</h3>
              <div className="space-y-4">
                
                {/* Contact Person & Role */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Contact Person</label>
                    <div className="relative">
                      <select 
                        value={formData.contactPerson}
                        onChange={(e) => handleChange('contactPerson', e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all text-slate-500"
                      >
                        <option value="">Select User</option>
                        <option value="user1">Alice Smith</option>
                        <option value="user2">Bob Jones</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Role</label>
                    <div className="relative">
                      <select 
                        value={formData.role}
                        onChange={(e) => handleChange('role', e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all text-slate-500"
                      >
                        <option value="">Select Role</option>
                        <option value="manager">Manager</option>
                        <option value="editor">Editor</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number*</label>
                    <div className="flex">
                      <div className="relative w-20 shrink-0">
                        <select className="w-full pl-8 pr-2 py-2.5 bg-[#F8F8F8] border border-slate-200 border-r-0 rounded-l-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all text-slate-700 font-medium">
                          <option>+1</option>
                        </select>
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-3 bg-[url('https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg')] bg-cover bg-center rounded-sm"></div>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      </div>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address*</label>
                    <input 
                      type="email" 
                      placeholder="abc@gmail.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all"
                    />
                  </div>
                </div>

              </div>
            </section>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-[#FCFAF6] rounded-b-2xl flex items-center justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveDraft}
            className="px-4 py-2 text-sm font-bold text-[#B32626] border border-[#B32626] rounded-lg hover:bg-red-50 transition-colors"
          >
            Save Draft
          </button>
          <button 
            onClick={handleRegister}
            className="px-5 py-2 text-sm font-bold text-white bg-[#B32626] rounded-lg hover:bg-[#921b1b] shadow-md shadow-[#B32626]/20 transition-colors"
          >
            Register Outlet
          </button>
        </div>

      </div>
    </div>
  );
}
