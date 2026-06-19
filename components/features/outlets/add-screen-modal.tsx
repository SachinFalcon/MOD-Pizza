"use client";

import React, { useState } from "react";
import { X, ChevronDown, AlertTriangle, Check } from "lucide-react";
import { toast } from "sonner";

interface AddScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddScreenModal({ isOpen, onClose }: AddScreenModalProps) {
  const [formData, setFormData] = useState({
    deviceId: "",
    screenType: "LED",
    orientation: "Landscape",
    resolution: "1920 x 1080 (16:9)",
    deviceIp: "192.168.1.1",
    interactionType: "Touchscreen (Multi-touch)",
    supportVideo: true,
    supportImage: true,
    audioSupport: true,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {
    toast.success("Screen draft saved");
    onClose();
  };

  const handleAddScreen = () => {
    if (!formData.deviceId) {
      toast.error("Please provide a Device ID");
      return;
    }
    toast.success("New screen added successfully!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-[600px] bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add New Screen</h2>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Register a new display screen for this outlet
            </p>
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
            
            {/* Screen Identity */}
            <section>
              <h3 className="text-base font-bold text-slate-900 mb-4">Screen Identity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Device Id*
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. #SC01"
                    value={formData.deviceId}
                    onChange={(e) => handleChange("deviceId", e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Screen Type
                  </label>
                  <div className="relative">
                    <select
                      value={formData.screenType}
                      onChange={(e) => handleChange("screenType", e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all text-slate-700 font-medium"
                    >
                      <option value="LED">LED</option>
                      <option value="LCD">LCD</option>
                      <option value="OLED">OLED</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Hardware & Orientation */}
              <div className="mt-4 bg-[#FFF5F5] border border-[#FAD4D4] rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-4 text-[#B32626]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                  <h4 className="text-sm font-bold">Hardware & Orientation</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                      ORIENTATION
                    </label>
                    <div className="flex bg-white rounded-lg border border-[#FAD4D4] p-1 shadow-sm">
                      <button
                        onClick={() => handleChange("orientation", "Landscape")}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                          formData.orientation === "Landscape"
                            ? "bg-white text-slate-900 shadow-sm border border-slate-100"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        Landscape
                      </button>
                      <button
                        onClick={() => handleChange("orientation", "Portrait")}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                          formData.orientation === "Portrait"
                            ? "bg-[#FFF1F1] text-[#B32626] shadow-sm border border-[#FAD4D4]"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        Portrait
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                      RESOLUTION
                    </label>
                    <div className="relative shadow-sm">
                      <select
                        value={formData.resolution}
                        onChange={(e) => handleChange("resolution", e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#FAD4D4] rounded-lg text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all text-slate-700 font-medium"
                      >
                        <option value="1920 x 1080 (16:9)">1920 x 1080 (16:9)</option>
                        <option value="1080 x 1920 (9:16)">1080 x 1920 (9:16)</option>
                        <option value="3840 x 2160 (4K)">3840 x 2160 (4K)</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Connectivity & Status */}
            <section>
              <h3 className="text-base font-bold text-slate-900 mb-4">Connectivity & Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Device IP
                  </label>
                  <input
                    type="text"
                    placeholder="192.168.1.1"
                    value={formData.deviceIp}
                    onChange={(e) => handleChange("deviceIp", e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all font-medium text-slate-900"
                  />
                </div>
                
                <div className="bg-[#FFF9EA] border border-[#FDE68A] rounded-lg p-3 flex items-start space-x-3 shadow-sm">
                  <AlertTriangle size={16} className="text-[#D97706] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#92400E] font-medium leading-relaxed">
                    Selecting <span className="font-bold">Offline</span> status will prevent the screen from receiving live updates until it is manually toggled to Online.
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Display Capabilities */}
            <section>
              <h3 className="text-base font-bold text-slate-900 mb-4">Display Capabilities</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Interaction Type
                  </label>
                  <div className="relative">
                    <select
                      value={formData.interactionType}
                      onChange={(e) => handleChange("interactionType", e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all text-slate-700 font-medium"
                    >
                      <option value="Touchscreen (Multi-touch)">Touchscreen (Multi-touch)</option>
                      <option value="Standard Display">Standard Display</option>
                      <option value="Interactive Kiosk">Interactive Kiosk</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Supported Formats
                  </label>
                  <div className="flex space-x-3">
                    <label className="flex-1 flex items-center justify-between px-3 py-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                      <span className="text-sm font-bold text-slate-700">Video</span>
                      <div 
                        className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                          formData.supportVideo ? "bg-[#B32626] border-[#B32626]" : "border-slate-300 bg-white"
                        }`}
                        onClick={(e) => { e.preventDefault(); handleChange("supportVideo", !formData.supportVideo); }}
                      >
                        {formData.supportVideo && <Check size={12} className="text-white" strokeWidth={3} />}
                      </div>
                    </label>
                    <label className="flex-1 flex items-center justify-between px-3 py-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                      <span className="text-sm font-bold text-slate-700">Image</span>
                      <div 
                        className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                          formData.supportImage ? "bg-[#B32626] border-[#B32626]" : "border-slate-300 bg-white"
                        }`}
                        onClick={(e) => { e.preventDefault(); handleChange("supportImage", !formData.supportImage); }}
                      >
                        {formData.supportImage && <Check size={12} className="text-white" strokeWidth={3} />}
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between p-4 border border-slate-200 rounded-xl shadow-sm">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Audio Support</h4>
                  <p className="text-xs text-slate-500 font-medium">Enable integrated speaker output</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.audioSupport}
                  onClick={() => handleChange("audioSupport", !formData.audioSupport)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.audioSupport ? "bg-[#B32626]" : "bg-slate-200"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.audioSupport ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
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
            onClick={handleAddScreen}
            className="px-5 py-2 text-sm font-bold text-white bg-[#B32626] rounded-lg hover:bg-[#921b1b] shadow-md shadow-[#B32626]/20 transition-colors"
          >
            Add Screen
          </button>
        </div>

      </div>
    </div>
  );
}
