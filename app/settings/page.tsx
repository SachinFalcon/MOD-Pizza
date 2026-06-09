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
  Zap,
  Settings,
  Shield,
  Database,
  ShieldCheck,
  X,
  Plus,
  ArrowRight
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
        className="w-full flex items-center justify-between bg-[rgba(255,255,255,0.75)] hover:bg-[#E9ECEF] border border-slate-200/85 rounded-md py-3 px-4 text-sm font-bold text-slate-805 transition-all outline-none cursor-pointer focus:ring-2 focus:ring-modRed/10"
      >
        <span className="truncate">{currentOption.label}</span>
        <ChevronDown size={16} className={`text-slate-500 transition-transform duration-250 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-2 bg-white border border-slate-100 rounded-md p-1.5 shadow-[(0,0,0,0.18)] animate-in fade-in slide-in-from-top-2 duration-200">
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
                  className={`w-full text-left py-2.5 px-4 rounded-md text-sm transition-all cursor-pointer ${
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
export default function SettingsPage() {
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

  const tabs = [
    { id: "platform", label: "Platform Defaults", icon: <Settings size={18} /> },
    { id: "campaign", label: "Campaign Rules", icon: <Sliders size={18} /> },
    { id: "screens", label: "Screens & Devices", icon: <Monitor size={18} /> },
    { id: "media", label: "Media & Playback", icon: <PlayCircle size={18} /> },
    { id: "security", label: "Security & Permissions", icon: <Shield size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "storage", label: "Storage", icon: <Database size={18} /> },
    { id: "approvals", label: "Approvals", icon: <ShieldCheck size={18} /> },
  ];

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================

  // Platform Defaults
  const [timezone, setTimezone] = useState("(GMT-08:00) Pacific Time (US & Canada)");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useState("12-hour (AM/PM)");
  const [platformStartOfWeek, setPlatformStartOfWeek] = useState("Monday");
  const [systemLanguage, setSystemLanguage] = useState("English (US)");
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [namingConvention, setNamingConvention] = useState("MTAS_Global_{ID}");

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
  const [resolution, setResolution] = useState("1920x1080 (1080p)");
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

  // Security & Permissions
  const [loginAttemptLimit, setLoginAttemptLimit] = useState("5");
  const [lockoutDuration, setLockoutDuration] = useState("30 Minutes");
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: true,
    specialSymbol: true,
    number: true,
    upperCase: true
  });
  const [requireOtp, setRequireOtp] = useState(true);
  const [approvalMode, setApprovalMode] = useState("Standard Single Confirmation");
  const [enableAuditLogs, setEnableAuditLogs] = useState(true);
  const [ipRestriction, setIpRestriction] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState(["192.168.1.1", "10.0.0.45", "203.0.113.195"]);

  // Storage
  const [storageMaxUploadSize, setStorageMaxUploadSize] = useState("500");
  const [autoDeleteOldAssets, setAutoDeleteOldAssets] = useState(true);
  const [storageCompression, setStorageCompression] = useState("Balanced");

  // Approvals
  const [approvalRequiredFor, setApprovalRequiredFor] = useState({
    campaignPublish: true,
    campaignEdit: true,
    screenAssignment: false,
    mediaUpload: true
  });
  const [defaultApprovalType, setDefaultApprovalType] = useState("Single Approval");
  const [slaLimitValue, setSlaLimitValue] = useState("24");
  const [slaLimitUnit, setSlaLimitUnit] = useState("Hours");

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
        lockoutDuration,
        passwordPolicy,
        requireOtp,
        approvalMode,
        enableAuditLogs,
        ipRestriction,
        ipWhitelist,
        storageMaxUploadSize,
        autoDeleteOldAssets,
        storageCompression,
        timezone,
        dateFormat,
        timeFormat,
        platformStartOfWeek,
        systemLanguage,
        sessionTimeout,
        namingConvention,
        approvalRequiredFor,
        defaultApprovalType,
        slaLimitValue,
        slaLimitUnit,
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
            className="px-6 py-2.5 bg-[rgba(255,255,255,0.75)] border border-red-205 hover:border-red-300 text-modRed hover:bg-red-50/20 rounded-md text-sm font-bold transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-modRed hover:bg-red-700 text-white rounded-md text-sm font-bold shadow-lg shadow-modRed/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} className={isSaving ? "animate-spin" : ""} />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="col-span-12 lg:col-span-4 bg-[rgba(255,255,255,0.75)] border border-slate-100 rounded-md p-6">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3.5 p-4 rounded-md transition-all duration-200 group text-left cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-[#FDF2F2] text-modRed font-bold shadow-[(0,0,0,0.18)] border border-red-100/50' 
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
                <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-6 -[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between">
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
                <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-6 -[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between">
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
              <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-6 -[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-6 -[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-6 -[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between">
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
                <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-6 -[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between">
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
                  <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-6 -[0_2px_8px_rgba(0,0,0,0.01)] flex items-center justify-between gap-4">
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
                        className={`absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-[rgba(255,255,255,0.75)] transition-transform ${ overlapWarning ? 'translate-x-5.5' : 'translate-x-0' }`}
                      />
                    </button>
                  </div>

                  {/* Screen Assignment Rule */}
                  <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-6 -[0_2px_8px_rgba(0,0,0,0.01)] flex items-center justify-between gap-4">
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
              <div className="bg-[#FFF5F5] border-l-4 border-modRed rounded-r-md p-5 flex items-start space-x-3.5 mt-6">
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
              <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-8 -[0_2px_12px_rgba(0,0,0,0.015)] relative">
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
                    
                    <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 rounded-md p-4 flex items-center justify-between cursor-pointer w-full md:w-[350px] transition-all">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-[rgba(255,255,255,0.75)] border border-slate-100 rounded-md flex items-center justify-center text-slate-400 shrink-0">
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
                        className="w-14 bg-[rgba(255,255,255,0.75)] border border-slate-200/80 rounded-md py-2 px-3 text-center text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-modRed/20"
                      />
                      <span className="text-xs font-semibold text-slate-400">Recommended: 3 - 5 attempts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Playback Defaults */}
              <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-8 -[0_2px_12px_rgba(0,0,0,0.015)]">
                <h4 className="text-lg font-bold text-slate-900 mb-6">Playback Defaults</h4>

                <div className="space-y-8">
                  {/* Grid: Default Orientation & Default Screen Resolution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Default Orientation */}
                    <div>
                      <span className="text-sm font-bold text-slate-800">Default Orientation</span>
                      <div className="bg-[rgba(255,255,255,0.75)] rounded-md p-1 flex gap-1 border border-slate-100 max-w-[280px] mt-3">
                        <button
                          type="button"
                          onClick={() => setOrientation("Landscape")}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-xs font-bold transition-all cursor-pointer ${ orientation === "Landscape" ? ' bg-[rgba(255,255,255,0.75)] text-slate-850 ' : 'text-slate-500 hover:text-slate-800' }`}
                        >
                          <Monitor size={14} />
                          <span>Landscape</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrientation("Portrait")}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-xs font-bold transition-all cursor-pointer ${ orientation === "Portrait" ? ' bg-[rgba(255,255,255,0.75)] text-slate-850 ' : 'text-slate-500 hover:text-slate-800' }`}
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
                          options={["1280x720 (720p)", "1920x1080 (1080p)", "3840x2160 (4K UHD)"]}
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
                      style={{ background: `linear-gradient(to right, #A61932 ${volume}%, rgba(255,255,255,0.75) ${volume}%)` }}
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
              <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-8 -[0_2px_12px_rgba(0,0,0,0.015)]">
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
                        className={`rounded-md p-4 flex items-center gap-3 cursor-pointer transition-all select-none border-2 ${ isChecked ? 'bg-[rgba(255,255,255,0.75)] border-modRed' : ' bg-[rgba(255,255,255,0.75)] border-slate-200/80 hover:border-slate-300' }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${ isChecked ? 'bg-modRed border-modRed text-white' : ' bg-[rgba(255,255,255,0.75)] border-slate-350' }`}>
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
                <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-8 -[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col justify-between space-y-6">
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
                <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-8 -[0_2px_12px_rgba(0,0,0,0.015)] space-y-6">
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
                          <span className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${ scalingMethod === opt.id ? 'border-modRed bg-[rgba(255,255,255,0.75)]' : 'border-slate-300 bg-[rgba(255,255,255,0.75)] group-hover:border-slate-400' }`}>
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
              <div className="bg-[#FFF5F5] border border-red-100/50 rounded-md p-8 shadow-sm space-y-6">
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
                      className={`absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-[rgba(255,255,255,0.75)] transition-transform ${ optimizationEngine ? 'translate-x-5.5' : 'translate-x-0' }`}
                    />
                  </button>
                </div>

                {/* Content Compression Level Selection */}
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Content Compression Level</span>
                  
                  <div className="bg-[rgba(255,255,255,0.75)] rounded-md p-1 flex gap-1 border border-slate-100 max-w-[450px]">
                    {["low", "medium", "high"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setCompressionLevel(level)}
                        className={`flex-1 py-2 px-6 rounded-md text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center ${
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
              <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-8 -[0_2px_12px_rgba(0,0,0,0.015)]">
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
                        className={`absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-[rgba(255,255,255,0.75)] transition-transform ${ emailAlerts ? 'translate-x-5.5' : 'translate-x-0' }`}
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
                        className={`absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-[rgba(255,255,255,0.75)] transition-transform ${ criticalAlertsOnly ? 'translate-x-5.5' : 'translate-x-0' }`}
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
                        className="w-14 bg-[rgba(255,255,255,0.75)] border border-slate-200/80 rounded-md py-2 px-3 text-center text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-modRed/20"
                      />
                      <span className="text-xs font-bold text-slate-400 ml-3 uppercase tracking-wider">Attempts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Response & Escalation */}
              <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-8 -[0_2px_12px_rgba(0,0,0,0.015)]">
                <h4 className="text-lg font-bold text-slate-900 mb-6">Response & Escalation</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Alert Delay Buffer */}
                  <div className="flex flex-col justify-between h-full space-y-4">
                    <div>
                      <span className="text-sm font-bold text-slate-800">Alert Delay Buffer (minutes)</span>
                      <div className="mt-3">
                        <CustomSelect
                          value={alertDelayBuffer}
                          onChange={setAlertDelayBuffer}
                          options={["5", "10", "15", "30"]}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400 block leading-normal">
                      Wait period before triggering a repeat notification for the same issue.
                    </span>
                  </div>

                  {/* Escalation Time */}
                  <div className="flex flex-col justify-between h-full space-y-4">
                    <div>
                      <span className="text-sm font-bold text-slate-800">Escalation Time</span>
                      <div className="mt-3">
                        <CustomSelect
                          value={escalationTime}
                          onChange={setEscalationTime}
                          options={["15 Minutes", "30 Minutes", "1 Hour", "2 Hours"]}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400 block leading-normal">
                      Time to wait for acknowledgement before escalating to secondary administrators.
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Note Banner */}
              <div className="bg-[#FFF5F5] border-l-4 border-modRed rounded-r-md p-5 flex items-start space-x-3.5 mt-6">
                <Info size={20} className="text-modRed shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-red-950 block">Active Notification Profile</span>
                  <span className="text-xs font-semibold text-red-900/80 leading-relaxed mt-0.5 block">
                    You are currently receiving notifications for 12 active infrastructure nodes. Changes made here will take effect immediately across all linked devices.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PLATFORM DEFAULTS TAB */}
          {/* ======================================================== */}
          {activeTab === "platform" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Section Header */}
              <div>
                <h3 className="text-xl font-bold text-slate-900">Platform Defaults</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">Configure global localization and environment variables used across all modules.</p>
              </div>

              {/* Grid 1: 2-column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Timezone */}
                <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                  <span className="text-sm font-bold text-slate-800 block mb-3">Timezone</span>
                  <CustomSelect
                    value={timezone}
                    onChange={setTimezone}
                    options={["(GMT-08:00) Pacific Time (US & Canada)", "(GMT-05:00) Eastern Time", "(GMT+00:00) London"]}
                  />
                  <span className="text-[11px] font-medium text-slate-400 mt-2 block">Standard system time for scheduling reports</span>
                </div>

                {/* Date Format */}
                <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                  <span className="text-sm font-bold text-slate-800 block mb-3">Date Format</span>
                  <CustomSelect
                    value={dateFormat}
                    onChange={setDateFormat}
                    options={["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]}
                  />
                  <span className="text-[11px] font-medium text-slate-400 mt-2 block">Applied to all dashboards and logs</span>
                </div>

                {/* Time Format */}
                <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                  <span className="text-sm font-bold text-slate-800 block mb-3">Time Format</span>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setTimeFormat("12-hour (AM/PM)")}>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${timeFormat === "12-hour (AM/PM)" ? 'border-modRed' : 'border-slate-300'}`}>
                        {timeFormat === "12-hour (AM/PM)" && <div className="w-2 h-2 rounded-full bg-modRed"></div>}
                      </div>
                      <span className="text-[13px] font-bold text-slate-700">12-hour (AM/PM)</span>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setTimeFormat("24-hour")}>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${timeFormat === "24-hour" ? 'border-modRed' : 'border-slate-300'}`}>
                        {timeFormat === "24-hour" && <div className="w-2 h-2 rounded-full bg-modRed"></div>}
                      </div>
                      <span className="text-[13px] font-bold text-slate-700">24-hour</span>
                    </div>
                  </div>
                </div>

                {/* Start of Week */}
                <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                  <span className="text-sm font-bold text-slate-800 block mb-3">Start of Week</span>
                  <CustomSelect
                    value={platformStartOfWeek}
                    onChange={setPlatformStartOfWeek}
                    options={["Monday", "Sunday"]}
                  />
                </div>

                {/* System Language */}
                <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                  <span className="text-sm font-bold text-slate-800 block mb-3">System Language</span>
                  <CustomSelect
                    value={systemLanguage}
                    onChange={setSystemLanguage}
                    options={["English (US)", "Spanish", "French"]}
                  />
                </div>

                {/* Session Timeout */}
                <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                  <span className="text-sm font-bold text-slate-800 block mb-3">Session Timeout (minutes)</span>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="w-16 bg-[rgba(255,255,255,0.75)] border border-slate-200/80 rounded-md py-2.5 px-3 text-center text-sm font-bold text-slate-800 focus:outline-none"
                    />
                    <span className="text-[11px] font-medium text-slate-400">Inactivity period before logout</span>
                  </div>
                </div>
              </div>

              {/* Naming Convention */}
              <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                <span className="text-sm font-bold text-slate-800 block mb-3">Naming Convention</span>
                <CustomSelect
                  value={namingConvention}
                  onChange={setNamingConvention}
                  options={["MTAS_Global_{ID}", "Asset_{YYYYMMDD}", "{Brand}_{Campaign}_{ID}"]}
                />
                <span className="text-[11px] font-medium text-slate-400 mt-2 block">Prefix and suffix used for new assets</span>
              </div>

              {/* Bottom Note Banner */}
              <div className="bg-[#FFF5F5] border border-red-100 rounded-md p-5 flex items-start space-x-3.5 mt-6 shadow-sm">
                <Info size={20} className="text-modRed shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-slate-600 leading-relaxed mt-0.5 block">
                  Changes to Platform Defaults may take up to 15 minutes to propagate across all edge nodes. Some localized dashboards might require a manual refresh for the date and time format changes to take effect immediately.
                </span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECURITY & PERMISSIONS TAB */}
          {/* ======================================================== */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Section Header */}
              <div>
                <h3 className="text-xl font-bold text-slate-900">Security & Permissions</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">Manage global security protocols, session management, and network access restrictions for the MTAS environment.</p>
              </div>

              {/* Card 1: Authentication Section */}
              <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-8 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-bold text-slate-900">Authentication Section</h4>
                  <span className="bg-[#E6F4EA] text-[#137333] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    System Optimal
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <span className="text-sm font-bold text-slate-800">Login Attempt Limit</span>
                    <div className="mt-3">
                      <CustomSelect
                        value={loginAttemptLimit}
                        onChange={setLoginAttemptLimit}
                        options={["3", "5", "10", "Unlimited"]}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-400 mt-2 block">Maximum failed attempts before account lock.</span>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800">Lockout Duration (minutes)</span>
                    <div className="mt-3">
                      <CustomSelect
                        value={lockoutDuration}
                        onChange={setLockoutDuration}
                        options={["15 Minutes", "30 Minutes", "1 Hour", "24 Hours"]}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-bold text-slate-800 mb-4 block">Password Policy</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: "minLength", label: "Minimum length (12 characters)" },
                      { key: "number", label: "Require number (0-9)" },
                      { key: "specialSymbol", label: "Require special symbol (@, #, $)" },
                      { key: "upperCase", label: "Require uppercase letter" }
                    ].map((policy) => (
                      <div key={policy.key} className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setPasswordPolicy(prev => ({ ...prev, [policy.key]: !prev[policy.key as keyof typeof passwordPolicy] }))}
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all cursor-pointer ${ passwordPolicy[policy.key as keyof typeof passwordPolicy] ? 'bg-modRed border-modRed text-white' : ' bg-[rgba(255,255,255,0.75)] border-slate-350' }`}
                        >
                          {passwordPolicy[policy.key as keyof typeof passwordPolicy] && <Check size={12} strokeWidth={3} />}
                        </button>
                        <span className="text-[13px] font-medium text-slate-700">{policy.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Protection & Monitoring */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Action Protection */}
                <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-8 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                  <h4 className="text-lg font-bold text-slate-900 mb-6">Action Protection</h4>
                  
                  <div className="flex items-center justify-between gap-4 mb-8">
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Require OTP for Sensitive Actions</span>
                      <span className="text-xs font-medium text-slate-400 mt-1 block">Prompt for 2FA on deletion or bulk exports</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRequireOtp(!requireOtp)}
                      className={`w-12 h-6.5 rounded-full transition-colors relative outline-none shrink-0 cursor-pointer ${
                        requireOtp ? 'bg-modRed' : 'bg-slate-200'
                      }`}
                    >
                      <span className={`absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-[rgba(255,255,255,0.75)] transition-transform ${ requireOtp ? 'translate-x-5.5' : 'translate-x-0' }`} />
                    </button>
                  </div>

                  <div>
                    <span className="text-sm font-bold text-slate-800 mb-3 block">Approval Confirmation Mode</span>
                    <CustomSelect
                      value={approvalMode}
                      onChange={setApprovalMode}
                      options={["Standard Single Confirmation", "Dual Authentication", "Manager Review"]}
                    />
                  </div>
                </div>

                {/* Monitoring */}
                <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-8 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                  <h4 className="text-lg font-bold text-slate-900 mb-6">Monitoring</h4>
                  
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Enable Audit Logs</span>
                      <span className="text-xs font-medium text-slate-400 mt-1 block">Track all administrative changes</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEnableAuditLogs(!enableAuditLogs)}
                      className={`w-12 h-6.5 rounded-full transition-colors relative outline-none shrink-0 cursor-pointer ${
                        enableAuditLogs ? 'bg-modRed' : 'bg-slate-200'
                      }`}
                    >
                      <span className={`absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-[rgba(255,255,255,0.75)] transition-transform ${ enableAuditLogs ? 'translate-x-5.5' : 'translate-x-0' }`} />
                    </button>
                  </div>

                  <div className="bg-[#FFF5F5] border border-red-100/50 rounded-md p-4 mt-auto">
                    <p className="text-[11px] font-semibold text-red-950/80 leading-relaxed">
                      <span className="text-modRed font-bold">Pro-Tip:</span> Audit logs are retained for 365 days by default. You can change this in the <span className="underline decoration-modRed/30 underline-offset-2 hover:decoration-modRed cursor-pointer transition-colors text-modRed font-bold">General Settings</span>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Network Access Section */}
              <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-8 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-bold text-slate-900">Network Access Section</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">IP Restriction</span>
                    <button
                      type="button"
                      onClick={() => setIpRestriction(!ipRestriction)}
                      className={`w-10 h-5 rounded-full transition-colors relative outline-none shrink-0 cursor-pointer ${
                        ipRestriction ? 'bg-modRed' : 'bg-slate-200'
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-[rgba(255,255,255,0.75)] transition-transform ${ ipRestriction ? 'translate-x-5' : 'translate-x-0' }`} />
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-bold text-slate-800 mb-3 block">IP Whitelist</span>
                  <div className={`min-h-[100px] bg-slate-50 border border-slate-200 rounded-md p-3 flex flex-wrap gap-2 ${!ipRestriction ? 'opacity-50 pointer-events-none' : ''}`}>
                    {ipWhitelist.map((ip, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded px-2.5 py-1.5 shadow-sm">
                        <span className="text-xs font-bold text-slate-700">{ip}</span>
                        <button 
                          onClick={() => setIpWhitelist(ipWhitelist.filter(i => i !== ip))}
                          className="text-slate-400 hover:text-modRed transition-colors ml-1 cursor-pointer"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                      </div>
                    ))}
                    <input 
                      type="text" 
                      placeholder="Add IP address..." 
                      className="bg-transparent border-none outline-none text-xs text-slate-600 font-medium placeholder:text-slate-400 min-w-[120px] flex-1 py-1 px-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          setIpWhitelist([...ipWhitelist, e.currentTarget.value]);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                  <div className="flex justify-end mt-3">
                    <button className="text-[11px] font-bold text-modRed hover:text-red-700 transition-colors uppercase tracking-wider cursor-pointer">
                      + Add My Current IP
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STORAGE TAB */}
          {/* ======================================================== */}
          {activeTab === "storage" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Section Header */}
              <div>
                <h3 className="text-xl font-bold text-slate-900">Storage</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">Configure global storage parameters, retention policies, and asset optimization for the MTAS environment.</p>
              </div>

              {/* Storage Usage */}
              <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-8 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Storage Usage</h4>
                    <span className="text-xs font-medium text-slate-400 mt-0.5 block">Real-time enterprise disk consumption</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900 tracking-tight">1.2TB</span>
                    <span className="text-xs font-medium text-slate-400 block mt-0.5">of 1.5 TB total</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-modRed rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>

              {/* Limits and Optimization */}
              <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-8 shadow-[0_2px_12px_rgba(0,0,0,0.015)] space-y-8">
                
                {/* Max Upload Size */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-100">
                  <div className="max-w-xl">
                    <span className="text-sm font-bold text-slate-800 block">Max Upload Size</span>
                    <span className="text-xs font-medium text-slate-400 mt-1 block">Set the maximum file size allowed for individual uploads.</span>
                  </div>
                  <div className="flex items-center shrink-0 w-full md:w-auto">
                    <input 
                      type="number"
                      value={storageMaxUploadSize}
                      onChange={(e) => setStorageMaxUploadSize(e.target.value)}
                      className="w-24 bg-[rgba(255,255,255,0.75)] border border-slate-200/80 border-r-0 rounded-l-md py-2.5 px-4 text-center text-sm font-bold text-slate-800 focus:outline-none"
                    />
                    <div className="bg-slate-50 border border-slate-200/80 rounded-r-md py-2.5 px-4 text-sm font-bold text-slate-500">
                      MB
                    </div>
                  </div>
                </div>

                {/* Auto Delete Old Assets */}
                <div className="flex items-center justify-between gap-4 pb-8 border-b border-slate-100">
                  <div className="max-w-xl">
                    <span className="text-sm font-bold text-slate-800 block">Auto Delete Old Assets</span>
                    <span className="text-xs font-medium text-slate-400 mt-1 block">Automatically remove assets that haven't been accessed for over 180 days.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoDeleteOldAssets(!autoDeleteOldAssets)}
                    className={`w-12 h-6.5 rounded-full transition-colors relative outline-none shrink-0 cursor-pointer ${
                      autoDeleteOldAssets ? 'bg-modRed' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-[rgba(255,255,255,0.75)] transition-transform ${ autoDeleteOldAssets ? 'translate-x-5.5' : 'translate-x-0' }`} />
                  </button>
                </div>

                {/* Compression Level */}
                <div>
                  <span className="text-sm font-bold text-slate-800 block">Compression Level</span>
                  <span className="text-xs font-medium text-slate-400 mt-1 block">Adjust the trade-off between file size and processing speed for stored assets.</span>
                  
                  <div className="mt-8 relative px-2">
                    {/* Visual Track */}
                    <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-slate-100 -translate-y-1/2 rounded-full z-0"></div>
                    
                    {/* The slider steps */}
                    <div className="relative z-10 flex justify-between items-center w-full">
                      {[
                        { id: "Fast (No Compression)", align: "text-left" },
                        { id: "Balanced", align: "text-center" },
                        { id: "Maximum Compression", align: "text-right" }
                      ].map((step, idx) => {
                        const isSelected = storageCompression === step.id;
                        return (
                          <div 
                            key={step.id} 
                            onClick={() => setStorageCompression(step.id)}
                            className="flex flex-col items-center cursor-pointer group"
                            style={{ width: '120px' }}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center bg-white ${isSelected ? 'border-modRed shadow-md shadow-modRed/20' : 'border-slate-300 group-hover:border-slate-400'}`}>
                              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-modRed"></div>}
                            </div>
                            <span className={`absolute top-8 text-[11px] font-bold w-24 ${step.align} ${isSelected ? 'text-modRed' : 'text-slate-400 group-hover:text-slate-600'}`}>
                              {step.id}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="h-10"></div> {/* Spacing for absolute text */}
                </div>
              </div>

              {/* Bottom Note Banner */}
              <div className="bg-[#FFF5F5] border-l-4 border-modRed rounded-r-md p-5 flex items-start space-x-3.5 mt-6">
                <Info size={20} className="text-modRed shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-red-950 block">Note on Asset Lifecycle</span>
                  <span className="text-xs font-semibold text-red-900/80 leading-relaxed mt-0.5 block">
                    Changes to compression levels will only apply to new uploads. Existing assets must be manually re-indexed to apply new compression settings.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* APPROVALS TAB */}
          {/* ======================================================== */}
          {activeTab === "approvals" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Section Header */}
              <div>
                <h3 className="text-xl font-bold text-slate-900">Approval</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">Define how requests are routed and validated across the organization.</p>
              </div>

              {/* Card 1: Approval Scope */}
              <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-8 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                <h4 className="text-lg font-bold text-slate-900 mb-6">Approval Scope</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Approval Required For */}
                  <div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-4">Approval Required For</span>
                    <div className="space-y-3">
                      {[
                        { key: "campaignPublish", label: "Campaign publish" },
                        { key: "campaignEdit", label: "Campaign edit" },
                        { key: "screenAssignment", label: "Screen assignment" },
                        { key: "mediaUpload", label: "Media upload" }
                      ].map((item) => {
                        const isChecked = approvalRequiredFor[item.key as keyof typeof approvalRequiredFor];
                        return (
                          <div key={item.key} className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setApprovalRequiredFor(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof approvalRequiredFor] }))}
                              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all cursor-pointer ${ isChecked ? 'bg-modRed border-modRed text-white' : ' bg-white border-slate-300' }`}
                            >
                              {isChecked && <Check size={14} strokeWidth={3} />}
                            </button>
                            <span className="text-[14px] font-semibold text-slate-900">{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Default Approval Type */}
                  <div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-4">Default Approval Type</span>
                    <div className="space-y-3">
                      {[
                        { id: "Single Approval", desc: "Any one assigned user can approve" },
                        { id: "Multi-Approval", desc: "All assigned users must approve" },
                        { id: "Sequential Approval", desc: "Must follow the defined step order" }
                      ].map((type) => {
                        const isSelected = defaultApprovalType === type.id;
                        return (
                          <div 
                            key={type.id} 
                            onClick={() => setDefaultApprovalType(type.id)}
                            className={`flex items-start gap-4 p-4 rounded-md border cursor-pointer transition-all ${isSelected ? 'border-modRed/20 bg-white' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                          >
                            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-modRed' : 'border-slate-400'}`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-modRed"></div>}
                            </div>
                            <div>
                              <span className="text-[14px] font-bold text-slate-900 block leading-tight">{type.id}</span>
                              <span className="text-[12px] font-medium text-slate-500 mt-1 block">{type.desc}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Approval Chain Configuration */}
              <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-8 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-lg font-bold text-slate-900">Approval Chain Configuration</h4>
                  <button className="bg-modRed hover:bg-red-800 text-white text-xs font-bold py-2.5 px-4 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer">
                    <Plus size={14} strokeWidth={3} />
                    Add Step
                  </button>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 overflow-x-auto pb-4 custom-scrollbar">
                  {/* Step 1 */}
                  <div className="relative min-w-[240px] bg-white border-2 border-dashed border-slate-200 rounded-md p-6 flex flex-col items-center justify-center text-center">
                    <button className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"><X size={14} /></button>
                    <div className="w-8 h-8 rounded-full bg-modRed text-white text-sm font-bold flex items-center justify-center mb-3">1</div>
                    <span className="text-[15px] font-bold text-slate-900 block">Outlet Manager</span>
                    <span className="text-[12px] font-medium text-slate-500 mt-1 block">Local Site Approval</span>
                  </div>
                  
                  <ArrowRight className="text-slate-300 shrink-0 hidden md:block" size={24} />

                  {/* Step 2 */}
                  <div className="relative min-w-[240px] bg-white border-2 border-dashed border-slate-200 rounded-md p-6 flex flex-col items-center justify-center text-center">
                    <button className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"><X size={14} /></button>
                    <div className="w-8 h-8 rounded-full bg-modRed text-white text-sm font-bold flex items-center justify-center mb-3">2</div>
                    <span className="text-[15px] font-bold text-slate-900 block">Regional Manager</span>
                    <span className="text-[12px] font-medium text-slate-500 mt-1 block">Territory Compliance</span>
                  </div>
                  
                  <ArrowRight className="text-slate-300 shrink-0 hidden md:block" size={24} />

                  {/* Step 3 */}
                  <div className="relative min-w-[240px] bg-[#FFF5F5] border border-modRed/30 rounded-md p-6 flex flex-col items-center justify-center text-center">
                    <button className="absolute top-2 right-2 text-red-300 hover:text-red-500 transition-colors cursor-pointer"><X size={14} /></button>
                    <div className="w-8 h-8 rounded-full bg-modRed text-white text-sm font-bold flex items-center justify-center mb-3">3</div>
                    <span className="text-[15px] font-bold text-modRed block">System Admin</span>
                    <span className="text-[12px] font-medium text-red-400 mt-1 block">Final Oversight</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Auto-Approval Rules */}
              <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[15px] font-bold text-slate-900 block">Auto-Approval Rules</span>
                  <span className="text-xs font-medium text-slate-400 mt-1 block">Configure conditional logic to automatically approve requests that meet pre-defined safety criteria.</span>
                </div>
                <button className="bg-slate-100 hover:bg-slate-200 border border-slate-200/60 text-slate-900 text-xs font-bold py-2.5 px-6 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer">
                  Configure Rules
                </button>
              </div>

              {/* Card 4: SLA Response Limit */}
              <div className="bg-[rgba(255,255,255,0.75)] border border-slate-200/60 rounded-md p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[15px] font-bold text-slate-900 block">SLA Response Limit</span>
                  <span className="text-xs font-medium text-slate-400 mt-1 block">Maximum time allowed for an approver to act before the request is escalated or flagged.</span>
                </div>
                <div className="flex items-center shrink-0">
                  <input 
                    type="number"
                    value={slaLimitValue}
                    onChange={(e) => setSlaLimitValue(e.target.value)}
                    className="w-16 bg-[rgba(255,255,255,0.75)] border border-slate-200/80 border-r-0 rounded-l-md py-2.5 px-4 text-center text-sm font-bold text-slate-800 focus:outline-none"
                  />
                  <div className="w-28">
                    <CustomSelect
                      value={slaLimitUnit}
                      onChange={setSlaLimitUnit}
                      options={["Hours", "Days", "Minutes"]}
                      className="[&>button]:rounded-l-none [&>button]:py-2.5"
                    />
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
