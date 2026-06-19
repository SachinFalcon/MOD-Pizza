"use client";

import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/services/mock.service";
import { 
  Sliders, 
  Monitor, 
  PlayCircle, 
  Bell, 
  Info,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Save,
  Image,
  Smartphone,
  Check,
  Zap
} from "lucide-react";

// ==========================================
// CUSTOM SELECT COMPONENT
// ==========================================
interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: (string | Option)[];
  className?: string;
}

function CustomSelect({ value, onChange, options, className = "" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const optionList = options.map(opt => typeof opt === "string" ? { value: opt, label: opt } : opt);
  const currentOption = optionList.find(opt => opt.value === value) || { value, label: value };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-[#F1F3F5] hover:bg-[#E9ECEF] border border-slate-200/85 rounded-2xl py-3 px-4 text-sm font-bold text-slate-805 transition-all outline-none cursor-pointer focus:ring-2 focus:ring-modRed/10"
      >
        <span className="truncate">{currentOption.label}</span>
        <ChevronDown size={16} className={`text-slate-500 transition-transform duration-250 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-2 bg-white border border-slate-100 rounded-2xl p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.08)] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto space-y-0.5 custom-scrollbar">
            {optionList.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left py-2.5 px-4 rounded-xl text-sm transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#FDF2F2] text-modRed font-bold font-sans' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold font-sans'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MAIN SETTINGS COMPONENT
// ==========================================
export function EditorSettingsView() {
  const [activeTab, setActiveTab] = useState("campaign");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchSettingsData() {
      try {
        const data = await api.getSettings();
        if (data) {
          setDefaultDuration(data.defaultDuration);
          setDefaultStatus(data.defaultStatus);
          setConflictStrategy(data.conflictStrategy);
          setLoopBehavior(data.loopBehavior);
          setMinPlayTime(data.minPlayTime);
          setMaxAssets(data.maxAssets);
          setOverlapWarning(data.overlapWarning);
          setScreenAssignment(data.screenAssignment);

          setSyncInterval(data.syncInterval);
          setDeviceOfflineTimeout(data.deviceOfflineTimeout);
          setReconnectAttempts(data.reconnectAttempts);
          setOrientation(data.orientation);
          setResolution(data.resolution);
          setVolume(data.volume);

          setAllowedFormats(data.allowedFormats);
          setStartOfWeekLimit(data.startOfWeekLimit);
          setMaxAssetsCampaign(data.maxAssetsCampaign);
          setPlaybackMode(data.playbackMode);
          setScalingMethod(data.scalingMethod);
          setUnsupportedBehavior(data.unsupportedBehavior);
          setOptimizationEngine(data.optimizationEngine);
          setCompressionLevel(data.compressionLevel);

          setEmailAlerts(data.emailAlerts);
          setCriticalAlertsOnly(data.criticalAlertsOnly);
          setLoginAttempts(data.loginAttempts);
          setAlertDelayBuffer(data.alertDelayBuffer);
          setEscalationTime(data.escalationTime);
        }
      } catch (err) {
        console.error("Failed to load settings from API", err);
      }
    }
    fetchSettingsData();
  }, []);

  // Tab IDs
  const tabs = [
    { id: "campaign", label: "Campaign Rules", icon: <Sliders size={18} /> },
    { id: "screens", label: "Screens & Devices", icon: <Monitor size={18} /> },
    { id: "media", label: "Media & Playback", icon: <PlayCircle size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
  ];

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================

  // Campaign Rules
  const [defaultDuration, setDefaultDuration] = useState("30 Days");
  const [defaultStatus, setDefaultStatus] = useState("Draft");
  const [conflictStrategy, setConflictStrategy] = useState("Manual Override");
  const [loopBehavior, setLoopBehavior] = useState("Loop continuously");
  const [minPlayTime, setMinPlayTime] = useState("10 Seconds");
  const [maxAssets, setMaxAssets] = useState("50");
  const [overlapWarning, setOverlapWarning] = useState(true);
  const [screenAssignment, setScreenAssignment] = useState("Manual Override");

  // Screens & Devices
  const [syncInterval, setSyncInterval] = useState("Every 15 minutes");
  const [deviceOfflineTimeout, setDeviceOfflineTimeout] = useState("Every 5 minutes");
  const [reconnectAttempts, setReconnectAttempts] = useState(3);
  const [orientation, setOrientation] = useState("Landscape"); // Landscape | Portrait
  const [resolution, setResolution] = useState("Every 5 minutes"); // mockup displays "Every 5 minutes" as default
  const [volume, setVolume] = useState(0); // slider 0%

  // Media & Playback
  const [allowedFormats, setAllowedFormats] = useState({
    mp4: true,
    mov: true,
    avi: false,
    webm: true,
    jpg: true,
    png: true,
    gif: false,
    svg: false
  });
  const [startOfWeekLimit, setStartOfWeekLimit] = useState("500");
  const [maxAssetsCampaign, setMaxAssetsCampaign] = useState("100");
  const [playbackMode, setPlaybackMode] = useState("Continuous Loop");
  const [scalingMethod, setScalingMethod] = useState("fill"); // fill | fit | stretch
  const [unsupportedBehavior, setUnsupportedBehavior] = useState("Show Fallback Image");
  const [optimizationEngine, setOptimizationEngine] = useState(true);
  const [compressionLevel, setCompressionLevel] = useState("medium"); // low | medium | high

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalAlertsOnly, setCriticalAlertsOnly] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(5);
  const [alertDelayBuffer, setAlertDelayBuffer] = useState("15");
  const [escalationTime, setEscalationTime] = useState("30 Minutes");

  // ==========================================
  // ACTIONS
  // ==========================================

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.saveSettings({
        defaultDuration,
        defaultStatus,
        conflictStrategy,
        loopBehavior,
        minPlayTime,
        maxAssets,
        overlapWarning,
        screenAssignment,
        syncInterval,
        deviceOfflineTimeout,
        reconnectAttempts,
        orientation,
        resolution,
        volume,
        allowedFormats,
        startOfWeekLimit,
        maxAssetsCampaign,
        playbackMode,
        scalingMethod,
        unsupportedBehavior,
        optimizationEngine,
        compressionLevel,
        emailAlerts,
        criticalAlertsOnly,
        loginAttempts,
        alertDelayBuffer,
        escalationTime,
      });
      toast.success("Settings saved successfully!", {
        description: "System configurations have been updated globally.",
        duration: 3000,
      });
    } catch (err) {
      toast.error("Failed to save settings.", {
        description: "An error occurred while saving system configurations.",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      const data = await api.resetSettings();
      if (data) {
        setDefaultDuration(data.defaultDuration);
        setDefaultStatus(data.defaultStatus);
        setConflictStrategy(data.conflictStrategy);
        setLoopBehavior(data.loopBehavior);
        setMinPlayTime(data.minPlayTime);
        setMaxAssets(data.maxAssets);
        setOverlapWarning(data.overlapWarning);
        setScreenAssignment(data.screenAssignment);

        setSyncInterval(data.syncInterval);
        setDeviceOfflineTimeout(data.deviceOfflineTimeout);
        setReconnectAttempts(data.reconnectAttempts);
        setOrientation(data.orientation);
        setResolution(data.resolution);
        setVolume(data.volume);

        setAllowedFormats(data.allowedFormats);
        setStartOfWeekLimit(data.startOfWeekLimit);
        setMaxAssetsCampaign(data.maxAssetsCampaign);
        setPlaybackMode(data.playbackMode);
        setScalingMethod(data.scalingMethod);
        setUnsupportedBehavior(data.unsupportedBehavior);
        setOptimizationEngine(data.optimizationEngine);
        setCompressionLevel(data.compressionLevel);

        setEmailAlerts(data.emailAlerts);
        setCriticalAlertsOnly(data.criticalAlertsOnly);
        setLoginAttempts(data.loginAttempts);
        setAlertDelayBuffer(data.alertDelayBuffer);
        setEscalationTime(data.escalationTime);
      }
      toast.info("Settings reset to defaults", {
        description: "Any unsaved modifications have been discarded.",
        duration: 3000,
      });
    } catch (err) {
      toast.error("Failed to reset settings.");
    }
  };

  const toggleFormat = (key: keyof typeof allowedFormats) => {
    setAllowedFormats(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage system configurations and default</p>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button 
            onClick={handleReset}
            disabled={isSaving}
            className="px-6 py-2.5 bg-white border border-red-205 hover:border-red-300 text-modRed hover:bg-red-50/20 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-modRed hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-modRed/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} className={isSaving ? "animate-spin" : ""} />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3.5 p-4 rounded-2xl transition-all duration-200 group text-left cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-[#FDF2F2] text-modRed font-bold shadow-[0_4px_12px_rgba(169,29,34,0.08)] border border-red-100/50' 
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent font-semibold'
                }`}
              >
                <div className={`${activeTab === tab.id ? 'text-modRed' : 'text-slate-400 group-hover:text-modRed'} transition-colors shrink-0`}>
                  {tab.icon}
                </div>
                <span className="text-[14px] leading-none">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* ======================================================== */}
          {/* CAMPAIGN RULES TAB */}
          {/* ======================================================== */}
          {activeTab === "campaign" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Section Header */}
              <div>
                <h3 className="text-xl font-bold text-slate-900">Campaign Rules</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">Set global constraints for all marketing campaigns across the organization.</p>
              </div>

              {/* Grid 1: Default Duration & Default Campaign Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Default Duration Card */}
                <div className="bg-white border border-slate-200/60 rounded-[1.5rem] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-bold text-slate-800">Default Duration</span>
                  </div>
                  <div className="mt-4">
                    <CustomSelect
                      value={defaultDuration}
                      onChange={setDefaultDuration}
                      options={["15 Days", "30 Days", "45 Days", "60 Days"]}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-400 mt-3 block">Initial duration set for new campaign drafts.</span>
                </div>

                {/* Default Campaign Status Card */}
                <div className="bg-white border border-slate-200/60 rounded-[1.5rem] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-bold text-slate-800">Default Campaign Status</span>
                  </div>
                  <div className="mt-4">
                    <CustomSelect
                      value={defaultStatus}
                      onChange={setDefaultStatus}
                      options={["Draft", "Active", "Scheduled", "Awaiting Approval"]}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-400 mt-3 block">Initial status assigned to newly created campaigns.</span>
                </div>
              </div>

              {/* Conflict Handling Strategy */}
              <div className="bg-white border border-slate-200/60 rounded-[1.5rem] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="max-w-xl">
                  <span className="text-sm font-bold text-slate-800 block">Conflict Handling Strategy</span>
                  <span className="text-xs font-medium text-slate-400 mt-1 block leading-normal">Define how the system should react when two overlapping campaigns target the same audience segment.</span>
                </div>
                <CustomSelect
                  value={conflictStrategy}
                  onChange={setConflictStrategy}
                  options={["Manual Override", "Auto Resolve (Newest)", "Auto Resolve (Oldest)", "Allow Overlap"]}
                  className="w-full md:w-64 shrink-0"
                />
              </div>

              {/* Default Loop Behavior */}
              <div className="bg-white border border-slate-200/60 rounded-[1.5rem] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="max-w-xl">
                  <span className="text-sm font-bold text-slate-800 block">Default Loop Behavior</span>
                  <span className="text-xs font-medium text-slate-400 mt-1 block leading-normal">Defines how the campaign playlist cycles on target screens.</span>
                </div>
                <CustomSelect
                  value={loopBehavior}
                  onChange={setLoopBehavior}
                  options={["Loop continuously", "Play once and hold", "Shuffle playback"]}
                  className="w-full md:w-64 shrink-0"
                />
              </div>

              {/* Grid 2: Minimum Play Time Per Asset & Max Assets Per Campaign */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Minimum Play Time Per Asset */}
                <div className="bg-white border border-slate-200/60 rounded-[1.5rem] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-bold text-slate-800">Minimum Play Time Per Asset</span>
                  </div>
                  <div className="mt-4">
                    <CustomSelect
                      value={minPlayTime}
                      onChange={setMinPlayTime}
                      options={["5 Seconds", "10 Seconds", "15 Seconds", "30 Seconds"]}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-400 mt-3 block leading-normal">Min duration each media asset must display before transitioning.</span>
                </div>

                {/* Max Assets Per Campaign */}
                <div className="bg-white border border-slate-200/60 rounded-[1.5rem] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-bold text-slate-800">Max Assets Per Campaign</span>
                  </div>
                  <div className="mt-4">
                    <CustomSelect
                      value={maxAssets}
                      onChange={setMaxAssets}
                      options={["10", "20", "50", "100"]}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-400 mt-3 block leading-normal">Maximum number of media assets allowed in a single campaign playlist.</span>
                </div>
              </div>

              {/* Section: Scheduling Safety */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-8 mb-4">Scheduling Safety</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Campaign Overlap Warning Card */}
                  <div className="bg-white border border-slate-200/60 rounded-[1.5rem] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-center justify-between gap-4">
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Campaign Overlap Warning</span>
                      <span className="text-xs font-medium text-slate-400 mt-1 block leading-normal">Show a warning when a new campaign schedule conflicts with existing ones.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOverlapWarning(!overlapWarning)}
                      className={`w-12 h-6.5 rounded-full transition-colors relative outline-none shrink-0 cursor-pointer ${
                        overlapWarning ? 'bg-modRed' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${
                          overlapWarning ? 'translate-x-5.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Screen Assignment Rule */}
                  <div className="bg-white border border-slate-200/60 rounded-[1.5rem] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-center justify-between gap-4">
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Screen Assignment Rule</span>
                      <span className="text-xs font-medium text-slate-400 mt-1 block leading-normal">Defines default logic for targeting screens.</span>
                    </div>
                    <CustomSelect
                      value={screenAssignment}
                      onChange={setScreenAssignment}
                      options={["Manual Override", "Auto Assign"]}
                      className="w-36 md:w-40 shrink-0 font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Info Note Banner */}
              <div className="bg-[#FFF5F5] border-l-4 border-modRed rounded-r-[1.5rem] p-5 flex items-start space-x-3.5 mt-6">
                <Info size={20} className="text-modRed shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-red-950/80 leading-relaxed">
                  Note: Changes to Campaign Settings will only apply to new campaigns created after the settings are saved. Active campaigns will maintain their existing configurations unless manually updated.
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SCREENS & DEVICES TAB */}
          {/* ======================================================== */}
          {activeTab === "screens" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Section Header */}
              <div>
                <h3 className="text-xl font-bold text-slate-900">Screens & Devices</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">Configure global parameters for hardware synchronization, health monitoring, and display fallback behaviors.</p>
              </div>

              {/* Card 1: Connectivity & Sync */}
              <div className="bg-white border border-slate-200/60 rounded-[1.8rem] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.015)] relative">
                {/* Header Row with Badge */}
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-bold text-slate-900">Connectivity & Sync</h4>
                  <span className="bg-[#E6F4EA] text-[#137333] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    System Optimal
                  </span>
                </div>

                {/* Rows Grid */}
                <div className="space-y-6">
                  {/* Sync Interval */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-slate-50">
                    <div className="max-w-xl">
                      <span className="text-sm font-bold text-slate-800 block">Sync Interval</span>
                      <span className="text-xs font-medium text-slate-400 mt-1 block leading-normal">Frequency of content update checks</span>
                    </div>
                    <CustomSelect
                      value={syncInterval}
                      onChange={setSyncInterval}
                      options={["Every 5 minutes", "Every 15 minutes", "Every 30 minutes", "Every 1 hour"]}
                      className="w-full md:w-[350px] shrink-0"
                    />
                  </div>

                  {/* Offline Fallback Content */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-slate-50">
                    <div className="max-w-xl">
                      <span className="text-sm font-bold text-slate-800 block">Offline Fallback Content</span>
                      <span className="text-xs font-medium text-slate-400 mt-1 block leading-normal">Default media displayed when a network connection is lost.</span>
                    </div>
                    
                    <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 rounded-2xl p-4 flex items-center justify-between cursor-pointer w-full md:w-[350px] transition-all">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                          <Image size={18} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-700 block">Select fallback media</span>
                          <span className="text-[10px] font-semibold text-slate-400 block mt-0.5 max-w-[220px] truncate">Current: generic_branding_loop_v2.mp4</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-400 shrink-0" />
                    </div>
                  </div>

                  {/* Device Offline Timeout */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-slate-50">
                    <div className="max-w-xl">
                      <span className="text-sm font-bold text-slate-800 block">Device Offline Timeout</span>
                      <span className="text-xs font-medium text-slate-400 mt-1 block leading-normal">It's the waiting time before a screen is considered disconnected.</span>
                    </div>
                    <CustomSelect
                      value={deviceOfflineTimeout}
                      onChange={setDeviceOfflineTimeout}
                      options={["Every 2 minutes", "Every 5 minutes", "Every 10 minutes", "Every 30 minutes"]}
                      className="w-full md:w-[350px] shrink-0"
                    />
                  </div>

                  {/* Reconnect Attempts */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                    <div className="max-w-xl">
                      <span className="text-sm font-bold text-slate-800 block">Reconnect Attempts</span>
                      <span className="text-xs font-medium text-slate-400 mt-1 block leading-normal">Number of retries before marking a device as 'unreachable'.</span>
                    </div>
                    <div className="flex items-center shrink-0 gap-3 w-full md:w-[350px]">
                      <input
                        type="number"
                        min="0"
                        value={reconnectAttempts}
                        onChange={(e) => setReconnectAttempts(Math.max(0, Number(e.target.value)))}
                        className="w-14 bg-[#F1F3F5] border border-slate-200/80 rounded-xl py-2 px-3 text-center text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-modRed/20"
                      />
                      <span className="text-xs font-semibold text-slate-400">Recommended: 3 - 5 attempts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Playback Defaults */}
              <div className="bg-white border border-slate-200/60 rounded-[1.8rem] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                <h4 className="text-lg font-bold text-slate-900 mb-6">Playback Defaults</h4>

                <div className="space-y-8">
                  {/* Grid: Default Orientation & Default Screen Resolution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Default Orientation */}
                    <div>
                      <span className="text-sm font-bold text-slate-800">Default Orientation</span>
                      <div className="bg-[#F1F3F5] rounded-2xl p-1 flex gap-1 border border-slate-100 max-w-[280px] mt-3">
                        <button
                          type="button"
                          onClick={() => setOrientation("Landscape")}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            orientation === "Landscape" 
                              ? 'bg-white text-slate-850 shadow-sm' 
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <Monitor size={14} />
                          <span>Landscape</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrientation("Portrait")}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            orientation === "Portrait" 
                              ? 'bg-white text-slate-850 shadow-sm' 
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <Smartphone size={14} />
                          <span>Portrait</span>
                        </button>
                      </div>
                    </div>

                    {/* Default Screen Resolution */}
                    <div className="flex flex-col justify-between">
                      <span className="text-sm font-bold text-slate-800">Default Screen Resolution</span>
                      <div className="mt-3">
                        <CustomSelect
                          value={resolution}
                          onChange={setResolution}
                          options={["Every 5 minutes", "1920x1080 (1080p)", "3840x2160 (4K UHD)"]}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Volume Level */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-slate-800">Default Volume Level</span>
                      <span className="text-sm font-bold text-slate-800">{volume}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={volume} 
                      onChange={(e) => setVolume(Number(e.target.value))} 
                      className="w-full h-1.5 rounded-full appearance-none accent-modRed outline-none cursor-pointer mt-4" 
                      style={{ background: `linear-gradient(to right, #A61932 ${volume}%, #F1F3F5 ${volume}%)` }}
                    />
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                      <span>Mute</span>
                      <span>Max Volume</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MEDIA & PLAYBACK TAB */}
          {/* ======================================================== */}
          {activeTab === "media" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Section Header */}
              <div>
                <h3 className="text-xl font-bold text-slate-900">Media & Playback</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">Configure global media handling and playback behavior for all enterprise campaigns.</p>
              </div>

              {/* Card 1: Allowed Media Formats */}
              <div className="bg-white border border-slate-200/60 rounded-[1.8rem] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                <span className="text-base font-bold text-slate-900 block">Allowed Media Formats</span>
                <span className="text-xs font-medium text-slate-400 mt-1 block leading-normal">Select the file types that are permitted for upload across the system.</span>

                {/* Checkboxes Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {Object.entries(allowedFormats).map(([key, isChecked]) => {
                    const formattedLabels: Record<string, string> = {
                      mp4: "MP4 Video",
                      mov: "MOV Video",
                      avi: "AVI Legacy",
                      webm: "WebM High- Efficiency",
                      jpg: "JPG Image",
                      png: "PNG Image",
                      gif: "GIF Animated",
                      svg: "SVG Vector"
                    };

                    return (
                      <div
                        key={key}
                        onClick={() => toggleFormat(key as keyof typeof allowedFormats)}
                        className={`rounded-2xl p-4 flex items-center gap-3 cursor-pointer shadow-sm transition-all select-none border-2 ${
                          isChecked 
                            ? 'bg-white border-modRed' 
                            : 'bg-white border-slate-200/80 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                          isChecked 
                            ? 'bg-modRed border-modRed text-white' 
                            : 'bg-white border-slate-350'
                        }`}>
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span className={`text-[11px] font-black tracking-wide leading-tight uppercase ${isChecked ? 'text-slate-800' : 'text-slate-500'}`}>
                          {formattedLabels[key]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Block 2: Usage Limits & Playback Behavior columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Usage Limits Card */}
                <div className="bg-white border border-slate-200/60 rounded-[1.8rem] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col justify-between space-y-6">
                  <h4 className="text-base font-bold text-slate-900">Usage Limits</h4>
                  
                  {/* Start of Week */}
                  <div>
                    <span className="text-sm font-bold text-slate-800">Start of Week</span>
                    <div className="mt-3">
                      <CustomSelect
                        value={startOfWeekLimit}
                        onChange={setStartOfWeekLimit}
                        options={["100", "200", "500", "1000"]}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-400 mt-2 block leading-normal">Global upload limit per asset.</span>
                  </div>

                  {/* Max Assets per Campaign */}
                  <div>
                    <span className="text-sm font-bold text-slate-800">Max Assets per Campaign</span>
                    <div className="mt-3">
                      <CustomSelect
                        value={maxAssetsCampaign}
                        onChange={setMaxAssetsCampaign}
                        options={["20", "50", "100", "200"]}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-400 mt-2 block leading-normal">Limit the number of media files in a single campaign loop.</span>
                  </div>
                </div>

                {/* Playback Behavior Card */}
                <div className="bg-white border border-slate-200/60 rounded-[1.8rem] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.015)] space-y-6">
                  <h4 className="text-base font-bold text-slate-900">Playback Behavior</h4>
                  
                  {/* Default Playback Mode */}
                  <div>
                    <span className="text-sm font-bold text-slate-800">Default Playback Mode</span>
                    <div className="mt-3">
                      <CustomSelect
                        value={playbackMode}
                        onChange={setPlaybackMode}
                        options={["Continuous Loop", "Play Once and Hold", "Shuffle Playlist"]}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-400 mt-2 block leading-normal">Global upload limit per asset.</span>
                  </div>

                  {/* Video Scaling Method */}
                  <div>
                    <span className="text-sm font-bold text-slate-800">Video Scaling Method</span>
                    <div className="mt-3 space-y-2">
                      {[
                        { id: "fill", label: "Aspect Fill (Cover)" },
                        { id: "fit", label: "Aspect Fit (Contain)" },
                        { id: "stretch", label: "Stretch (Distort)" }
                      ].map((opt) => (
                        <label key={opt.id} className="flex items-center space-x-3 cursor-pointer group select-none">
                          <input 
                            type="radio" 
                            name="scaling" 
                            checked={scalingMethod === opt.id} 
                            onChange={() => setScalingMethod(opt.id)} 
                            className="hidden" 
                          />
                          <span className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            scalingMethod === opt.id ? 'border-modRed bg-white' : 'border-slate-300 bg-white group-hover:border-slate-400'
                          }`}>
                            {scalingMethod === opt.id && <span className="w-2.5 h-2.5 rounded-full bg-modRed" />}
                          </span>
                          <span className={`text-xs font-semibold ${scalingMethod === opt.id ? 'text-slate-800 font-bold' : 'text-slate-650'}`}>
                            {opt.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Unsupported Format Behaviour */}
                  <div>
                    <span className="text-sm font-bold text-slate-800">Unsupported Format Behaviour</span>
                    <div className="mt-3">
                      <CustomSelect
                        value={unsupportedBehavior}
                        onChange={setUnsupportedBehavior}
                        options={["Show Fallback Image", "Skip File", "Black Screen"]}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Block 3: Auto-Optimization Engine Banner */}
              <div className="bg-[#FFF5F5] border border-red-100/50 rounded-[1.8rem] p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#FDF2F2] border border-red-100/50 rounded-full flex items-center justify-center text-modRed shrink-0 shadow-sm">
                      <Zap size={18} fill="currentColor" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Auto-Optimization Engine</span>
                      <span className="text-xs font-semibold text-slate-400 mt-0.5 block">Enable real-time transcoding for better edge delivery.</span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setOptimizationEngine(!optimizationEngine)}
                    className={`w-12 h-6.5 rounded-full transition-colors relative outline-none shrink-0 cursor-pointer ${
                      optimizationEngine ? 'bg-modRed' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${
                        optimizationEngine ? 'translate-x-5.5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Content Compression Level Selection */}
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Content Compression Level</span>
                  
                  <div className="bg-[#F1F3F5] rounded-2xl p-1 flex gap-1 border border-slate-100 max-w-[450px]">
                    {["low", "medium", "high"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setCompressionLevel(level)}
                        className={`flex-1 py-2 px-6 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center ${
                          compressionLevel === level 
                            ? 'bg-modRed text-white shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* NOTIFICATIONS TAB */}
          {/* ======================================================== */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Section Header */}
              <div>
                <h3 className="text-xl font-bold text-slate-900">Notifications</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">Configure how the system handles alerts, escalation, and team communication.</p>
              </div>

              {/* Card 1: Alert Preferences */}
              <div className="bg-white border border-slate-200/60 rounded-[1.8rem] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                {/* Header Row with Badge */}
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-bold text-slate-900">Alert Preferences</h4>
                  <span className="bg-[#E6F4EA] text-[#137333] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    System Optimal
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Email Alerts Toggle */}
                  <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-50">
                    <div className="max-w-xl">
                      <span className="text-sm font-bold text-slate-800 block">Email Alerts</span>
                      <span className="text-xs font-medium text-slate-400 mt-1 block leading-normal">
                        Receive automated system health summaries and individual alert details via your primary email.
                      </span>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setEmailAlerts(!emailAlerts)}
                      className={`w-12 h-6.5 rounded-full transition-colors relative outline-none shrink-0 cursor-pointer ${
                        emailAlerts ? 'bg-modRed' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${
                          emailAlerts ? 'translate-x-5.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Critical Alerts Only Toggle */}
                  <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-50">
                    <div className="max-w-xl">
                      <span className="text-sm font-bold text-slate-800 block">Critical Alerts Only</span>
                      <span className="text-xs font-medium text-slate-400 mt-1 block leading-normal">
                        Filter out low-priority and informational messages. Only receive notifications for hardware failure or security breaches.
                      </span>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setCriticalAlertsOnly(!criticalAlertsOnly)}
                      className={`w-12 h-6.5 rounded-full transition-colors relative outline-none shrink-0 cursor-pointer ${
                        criticalAlertsOnly ? 'bg-modRed' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${
                          criticalAlertsOnly ? 'translate-x-5.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Login Attempt Limit Input */}
                  <div className="pt-2 flex flex-col space-y-1">
                    <span className="text-sm font-bold text-slate-800">Login Attempt Limit</span>
                    <span className="text-xs font-medium text-slate-400 mt-1 block leading-normal">Number of failed attempts before temporary lockout.</span>
                    
                    <div className="flex items-center mt-3">
                      <input
                        type="number"
                        min="1"
                        value={loginAttempts}
                        onChange={(e) => setLoginAttempts(Math.max(1, Number(e.target.value)))}
                        className="w-16 bg-[#F1F3F5] border border-slate-200/80 rounded-xl py-2 px-3 text-center text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-modRed/20"
                      />
                      <span className="text-xs font-bold text-slate-400 ml-3 uppercase tracking-wider">Attempts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Response & Escalation */}
              <div className="bg-white border border-slate-200/60 rounded-[1.8rem] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                <h4 className="text-lg font-bold text-slate-900 mb-6">Response & Escalation</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Alert Delay Buffer */}
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">Alert Delay Buffer</span>
                    <span className="text-xs font-medium text-slate-400 mt-1 block leading-normal">Wait time before sending an offline alert.</span>
                    <div className="mt-4">
                      <CustomSelect
                        value={alertDelayBuffer}
                        onChange={setAlertDelayBuffer}
                        options={["5", "10", "15", "30"]}
                      />
                    </div>
                  </div>

                  {/* Escalation Time */}
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">Escalation Time</span>
                    <span className="text-xs font-medium text-slate-400 mt-1 block leading-normal">Time before unresolved issue is sent to next level.</span>
                    <div className="mt-4">
                      <CustomSelect
                        value={escalationTime}
                        onChange={setEscalationTime}
                        options={["15 Minutes", "30 Minutes", "1 Hour", "2 Hours"]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
