"use client";

import React, { useState, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface DeactivateOutletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeactivateOutletModal({ isOpen, onClose }: DeactivateOutletModalProps) {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [reason, setReason] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isDeactivating, setIsDeactivating] = useState(false);

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const handleSendOtp = () => {
    setIsOtpSent(true);
    toast.success("OTP sent to admin@mod-hq.com");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance focus
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleDeactivate = () => {
    if (confirmation.trim().toUpperCase() !== "DEACTIVATE") return;
    
    setIsDeactivating(true);
    
    // Simulate network delay
    setTimeout(() => {
      toast.success("Outlet successfully deactivated");
      setIsDeactivating(false);
      onClose();
      // Reset state after close
      setTimeout(() => {
        setIsOtpSent(false);
        setOtp(["", "", "", "", "", ""]);
        setReason("");
        setConfirmation("");
      }, 300);
    }, 1500);
  };

  if (!isOpen) return null;

  const isDeactivateEnabled = 
    confirmation.trim().toUpperCase() === "DEACTIVATE" && 
    isOtpSent &&
    otp.every(val => val.trim() !== "") &&
    reason.trim().length > 0;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-xl flex flex-col p-8 animate-in zoom-in-95 duration-200">
        
        {/* Header Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertTriangle size={24} className="text-[#B32626]" />
          </div>
          <h3 className="text-base font-medium text-slate-600">Are you sure you want to deactivate this outlet?</h3>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          
          {/* Step 1: Email */}
          <div className={!isOtpSent ? "opacity-100" : "opacity-70"}>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-5 h-5 rounded-full bg-[#B32626] text-white flex items-center justify-center text-xs font-bold">1</div>
              <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">EMAIL VERIFICATION</h4>
            </div>
            <div className="pl-7 space-y-2">
              <label className="block text-xs font-medium text-slate-700">Confirm Your Email</label>
              <div className="flex items-center space-x-3">
                <input 
                  type="email" 
                  defaultValue="admin@mod-hq.com"
                  readOnly={isOtpSent}
                  className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all shadow-sm"
                />
                <button 
                  onClick={handleSendOtp}
                  disabled={isOtpSent}
                  className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  {isOtpSent ? "OTP SENT" : "SEND OTP"}
                </button>
              </div>
            </div>
          </div>

          {/* Step 2: OTP */}
          <div className={isOtpSent ? "opacity-100" : "opacity-40 pointer-events-none"}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-[#B32626] text-white flex items-center justify-center text-xs font-bold">2</div>
                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">VERIFICATION CODE</h4>
              </div>
              {isOtpSent && <span className="bg-[#E6F6EC] text-[#00B060] text-[10px] font-bold px-2 py-0.5 rounded uppercase">OTP SENT</span>}
            </div>
            <div className="pl-7 space-y-3">
              <label className="block text-xs font-medium text-slate-500">Enter 6-digit verification code</label>
              <div className="flex items-center justify-between space-x-2">
                {otp.map((val, idx) => (
                  <input
                    key={idx}
                    ref={otpRefs[idx]}
                    type="text"
                    value={val}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className={`w-11 h-11 text-center text-lg font-bold bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all
                      ${val ? "border-[#B32626] text-[#B32626]" : "border-slate-200 text-slate-400"}
                    `}
                    maxLength={1}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center text-[10px] pt-1">
                <span className="text-slate-500">Valid for 01:42 minutes.</span>
                <div className="space-x-3 font-bold">
                  <button onClick={() => toast.success("OTP Resent")} className="text-[#B32626] hover:underline">Resend OTP</button>
                  <button onClick={() => setIsOtpSent(false)} className="text-slate-600 hover:underline">Change Email</button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Reason */}
          <div className={isOtpSent ? "opacity-100" : "opacity-40 pointer-events-none"}>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-5 h-5 rounded-full bg-[#B32626] text-white flex items-center justify-center text-xs font-bold">3</div>
              <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">REASON</h4>
            </div>
            <div className="pl-7 space-y-2">
              <label className="block text-xs font-medium text-slate-700">Write your reason</label>
              <textarea 
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Finalize */}
          <div className={`pt-2 ${isOtpSent ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              To finalize, type <span className="text-[#B32626] font-bold">DEACTIVATE</span>
            </label>
            <input 
              type="text" 
              placeholder="Type DEACTIVATE"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="w-full px-3 py-3 bg-white border border-slate-200 rounded-lg text-sm text-center tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-modRed/20 focus:border-modRed transition-all shadow-sm"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end items-center space-x-4">
          <button 
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleDeactivate}
            disabled={!isDeactivateEnabled || isDeactivating}
            className={`px-6 py-3 text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center justify-center min-w-[160px]
              ${isDeactivateEnabled && !isDeactivating ? "bg-[#B32626] hover:bg-[#921b1b] cursor-pointer" : "bg-[#E5B5B5] cursor-not-allowed"}
            `}
          >
            {isDeactivating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deactivating...
              </>
            ) : (
              "Deactivate Outlet"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
