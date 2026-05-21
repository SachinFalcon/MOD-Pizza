import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Search,
  ChevronDown,
  Plus,
  ArrowRight,
  Check,
  Calendar,
  Monitor,
  Trash2,
  RefreshCw,
  FolderOpen,
  MapPin,
  Play,
  Zap,
  Image as ImageIcon,
  Film,
  CloudUpload,
  GripVertical,
  Rocket,
  Folder,
  Eye,
  LayoutGrid,
  Palette,
  Smartphone,
  CheckCircle2,
  Shuffle,
  Lock,
  Activity,
  Globe,
  Clock
} from "lucide-react";
import { SingleDateTimePickerPopover } from "@/components/ui/single-date-time-picker-popover";
import { useRbac } from "@/hooks/use-rbac";

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated: (name: string) => void;
}

export function CreateCampaignModal({ isOpen, onClose, onCampaignCreated }: CreateCampaignModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignName, setCampaignName] = useState("");
  const [isLaunching, setIsLaunching] = useState(false);

  // Dynamic Form State
  const [targeting, setTargeting] = useState({
    region: "Region",
    state: "State",
    locality: "Locality"
  });
  const [selectedOutlets, setSelectedOutlets] = useState<string[]>(["OUT-1043-1", "OUT-1043-2", "OUT-1043-3"]);
  const [mediaType, setMediaType] = useState("Image/Video");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [campaignType, setCampaignType] = useState("Global");
  const [playbackPriority, setPlaybackPriority] = useState("Medium");
  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false);
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false);

  const steps = [
    { id: 1, name: "Basics" },
    { id: 2, name: "Targeting" },
    { id: 3, name: "Media" },
    { id: 4, name: "Review" },
  ];

  if (!isOpen) return null;

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onCampaignCreated(campaignName || "Summer Promotion 2026");
      onClose();
      setCurrentStep(1);
      setCampaignName("");
    } catch (error) {
      alert("Failed to launch campaign.");
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative bg-white w-full max-w-sm md:max-w-2xl lg:max-w-5xl rounded-[1.5rem] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden">

          {/* Header */}
          <div className="px-4 md:px-8 pt-6 md:pt-8 pb-4 flex justify-between items-start bg-white z-10 relative gap-4">
            <div className="flex-1">
              <h2 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight">Create a New Campaign</h2>
              <p className="text-xs md:text-sm font-medium text-slate-500 mt-1">Configure campaign details and publish across selected screens</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Some notification bell or avatar in the header if it was global, but in modal we just need X */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Steps Progress */}
          <div className="px-4 md:px-8 lg:px-16 py-4 md:py-6 bg-white z-10 relative">
            <div className="relative flex justify-between">
              {/* Progress Lines */}
              <div className="absolute top-[1.35rem] left-0 w-full h-[3px] bg-slate-100 -z-10" />
              <div
                className="absolute top-[1.35rem] left-0 h-[3px] bg-[#991b1b] transition-all duration-500 -z-10"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />

              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center bg-white px-0.5 md:px-2">
                  <div
                    className={`w-8 md:w-11 h-8 md:h-11 rounded-full flex items-center justify-center font-bold text-xs md:text-[15px] transition-all duration-300
                    ${currentStep >= step.id ? 'bg-[#991b1b] text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}
                  >
                    {step.id}
                  </div>
                  <span className={`mt-1 md:mt-2 text-[10px] md:text-[13px] font-black tracking-tight transition-colors duration-300
                  ${currentStep >= step.id ? 'text-[#991b1b]' : 'text-slate-400'}`}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Body - Scrollable */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 bg-white custom-scrollbar relative z-0">
            {currentStep === 1 && (
              <StepBasics
                name={campaignName}
                setName={setCampaignName}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                campaignType={campaignType}
                setCampaignType={setCampaignType}
                playbackPriority={playbackPriority}
                setPlaybackPriority={setPlaybackPriority}
                isStartCalendarOpen={isStartCalendarOpen}
                setIsStartCalendarOpen={setIsStartCalendarOpen}
                isEndCalendarOpen={isEndCalendarOpen}
                setIsEndCalendarOpen={setIsEndCalendarOpen}
              />
            )}
            {currentStep === 2 && (
              <StepTargeting
                targeting={targeting}
                setTargeting={setTargeting}
                selectedOutlets={selectedOutlets}
                setSelectedOutlets={setSelectedOutlets}
              />
            )}
            {currentStep === 3 && (
              <StepMedia
                mediaType={mediaType}
                setMediaType={setMediaType}
                selectedAssets={selectedAssets}
                setSelectedAssets={setSelectedAssets}
              />
            )}
            {currentStep === 4 && (
              <StepReview
                name={campaignName}
                outletsCount={selectedOutlets.length}
                mediaType={mediaType}
                assetsCount={4}
                targeting={targeting}
                startDate={startDate}
                endDate={endDate}
                campaignType={campaignType}
                playbackPriority={playbackPriority}
              />
            )}
          </div>

          {/* Footer */}
          <div className="px-4 md:px-8 py-4 md:py-5 bg-white border-t border-slate-100 flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0 shrink-0 z-10 relative">
            <button
              onClick={onClose}
              className="w-full md:w-auto px-4 md:px-6 py-2.5 text-xs md:text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>

            <div className="flex flex-col md:flex-row gap-2 md:gap-3 md:items-center w-full md:w-auto">
              {currentStep < 4 ? (
                <>
                  <button className="w-full md:w-auto px-4 md:px-6 py-2.5 text-xs md:text-sm font-bold text-[#991b1b] hover:bg-red-50 transition-all rounded-lg">
                    Save Draft
                  </button>
                  {currentStep > 1 && (
                    <button
                      onClick={prevStep}
                      className="w-full md:w-auto flex items-center justify-center md:justify-start space-x-2 px-4 md:px-8 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-xs md:text-sm font-bold hover:bg-slate-50 transition-all active:scale-95"
                    >
                      <ArrowRight size={14} className="rotate-180 md:hidden" />
                      <ArrowRight size={16} className="rotate-180 hidden md:block" />
                      <span>Back</span>
                    </button>
                  )}
                  <button
                    onClick={nextStep}
                    className="w-full md:w-auto flex items-center justify-center space-x-2 px-4 md:px-8 py-2.5 bg-[#991b1b] text-white rounded-lg text-xs md:text-sm font-bold hover:bg-red-800 transition-all active:scale-95 shadow-md shadow-red-900/20"
                  >
                    <span>Continue</span>
                    <ArrowRight size={14} className="md:hidden" />
                    <ArrowRight size={16} className="hidden md:block" />
                  </button>
                </>
              ) : (
                <>
                  <button className="w-full md:w-auto px-4 md:px-6 py-2.5 border border-[#991b1b] rounded-lg text-xs md:text-sm font-bold text-[#991b1b] hover:bg-red-50 transition-all">
                    Save Draft
                  </button>
                  <button
                    onClick={prevStep}
                    className="w-full md:w-auto flex items-center justify-center md:justify-start space-x-2 px-4 md:px-8 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-xs md:text-sm font-bold hover:bg-slate-50 transition-all active:scale-95"
                  >
                    <ArrowRight size={14} className="rotate-180 md:hidden" />
                    <ArrowRight size={16} className="rotate-180 hidden md:block" />
                    <span>Back</span>
                  </button>
                  <button className="w-full md:w-auto px-4 md:px-6 py-2.5 bg-red-50 rounded-lg text-xs md:text-sm font-bold text-[#991b1b] hover:bg-red-100 transition-all">
                    Preview
                  </button>
                  <button
                    onClick={handleLaunch}
                    disabled={isLaunching}
                    className={`w-full md:w-auto flex items-center justify-center space-x-2 px-4 md:px-8 py-2.5 bg-[#991b1b] text-white rounded-lg text-xs md:text-sm font-bold shadow-md shadow-red-900/20 hover:bg-red-800 transition-all active:scale-95 ${isLaunching ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isLaunching ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Submiting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit</span>
                        <Rocket size={16} />
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <SingleDateTimePickerPopover
        isOpen={isStartCalendarOpen}
        onClose={() => setIsStartCalendarOpen(false)}
        initialDate={startDate}
        onApply={(date) => {
          setStartDate(date);
          setIsStartCalendarOpen(false);
        }}
        onClear={() => {
          setStartDate(undefined);
          setIsStartCalendarOpen(false);
        }}
      />

      <SingleDateTimePickerPopover
        isOpen={isEndCalendarOpen}
        onClose={() => setIsEndCalendarOpen(false)}
        initialDate={endDate}
        onApply={(date) => {
          setEndDate(date);
          setIsEndCalendarOpen(false);
        }}
        onClear={() => {
          setEndDate(undefined);
          setIsEndCalendarOpen(false);
        }}
      />
    </>
  );
}

interface StepBasicsProps {
  name: string;
  setName: (val: string) => void;
  startDate: Date | undefined;
  setStartDate: (val: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (val: Date | undefined) => void;
  campaignType: string;
  setCampaignType: (val: string) => void;
  playbackPriority: string;
  setPlaybackPriority: (val: string) => void;
  isStartCalendarOpen: boolean;
  setIsStartCalendarOpen: (val: boolean) => void;
  isEndCalendarOpen: boolean;
  setIsEndCalendarOpen: (val: boolean) => void;
}

function StepBasics({
  name,
  setName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  campaignType,
  setCampaignType,
  playbackPriority,
  setPlaybackPriority,
  isStartCalendarOpen,
  setIsStartCalendarOpen,
  isEndCalendarOpen,
  setIsEndCalendarOpen,
}: StepBasicsProps) {
  const { role } = useRbac();
  const isEditor = role === "editor";

  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);

  const typeRef = useRef<HTMLDivElement>(null);
  const priorityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setIsTypeOpen(false);
      }
      if (priorityRef.current && !priorityRef.current.contains(event.target as Node)) {
        setIsPriorityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const typeOptions = [
    { value: "Global - Locked", icon: <Lock size={16} className="text-[#991b1b]" /> },
    { value: "Regional", icon: <MapPin size={16} className="text-slate-500" /> }
  ];

  const priorityOptions = [
    { value: "High", icon: <Zap size={16} className="text-amber-500" /> },
    { value: "Medium", icon: <Activity size={16} className="text-[#991b1b]" /> },
    { value: "Low", icon: <Clock size={16} className="text-slate-500" /> }
  ];

  const formatDateTime = (date?: Date) => {
    if (!date) return "";
    const datePart = date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    let hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = String(hours).padStart(2, "0");
    const minutesStr = String(date.getMinutes()).padStart(2, "0");
    return `${datePart}, ${hoursStr}:${minutesStr} ${ampm}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-4">
      {/* Template Shortcut */}
      <div className="bg-[#FFFDF5] border border-[#FDE68A] p-5 rounded-xl flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center text-[#D97706]">
            <LayoutGrid size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-[14px]">Start from Template</h4>
            <p className="text-[12px] font-medium text-[#D97706]">Quick start with pre-configured settings</p>
          </div>
        </div>
        <button className="px-6 py-2 bg-[#F59E0B] text-white rounded-md font-bold text-[13px] shadow-sm hover:bg-[#D97706] transition-all">
          Choose Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {/* Campaign Name */}
        <div className="col-span-full space-y-1.5">
          <label className="text-[13px] font-bold text-slate-700">Campaign Name (Required)</label>
          <input
            type="text"
            placeholder="e.g. Summer Promotion 2026"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-[#991b1b]/20 focus:border-[#991b1b] transition-all outline-none"
          />
        </div>

        {/* Campaign Code & Tags */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-slate-700">Campaign Code (Auto)</label>
          <input
            type="text"
            placeholder="CAM-88291-SR24"
            readOnly
            className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-500 outline-none"
          />
        </div>

        {/* <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-slate-700">End Date & Time</label>
          <input
            type="text"
            placeholder="#MODPIZZA"
            className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-[#991b1b]/20 focus:border-[#991b1b] transition-all outline-none"
          />
        </div> */}
        {/* Dropdowns */}
        <div ref={typeRef} className="space-y-1.5 relative">
          <label className="text-[13px] font-bold text-slate-700">Campaign Type</label>
          <div className="relative">
            <button
              type="button"
              disabled={isEditor}
              onClick={() => setIsTypeOpen(!isTypeOpen)}
              className={`w-full flex items-center justify-between border rounded-lg py-2.5 px-4 text-sm font-medium transition-all outline-none text-left
                ${isEditor
                  ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-white border-slate-200 text-slate-700 focus:ring-2 focus:ring-[#991b1b]/20 focus:border-[#991b1b]"}`}
            >
              <div className="flex items-center space-x-2">
                {typeOptions.find(o => o.value === campaignType)?.icon}
                <span>{campaignType}</span>
              </div>
              {!isEditor ? (
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isTypeOpen ? "rotate-180" : ""}`} />
              ) : (
                <Lock size={14} className="text-slate-400" />
              )}
            </button>

            {!isEditor && isTypeOpen && (
              <div className="absolute left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-[60] animate-in fade-in slide-in-from-top-2 duration-150">
                {typeOptions.map((opt) => {
                  const isSelected = opt.value === campaignType;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setCampaignType(opt.value);
                        setIsTypeOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2 px-4 py-2.5 text-sm transition-colors text-left cursor-pointer
                        ${isSelected ? "bg-red-50 text-[#991b1b] font-bold" : "text-slate-700 hover:bg-slate-50 font-medium"}`}
                    >
                      {opt.icon}
                      <span>{opt.value}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {/* Dates */}
        <div className="space-y-1.5 relative">
          <label className="text-[13px] font-bold text-slate-700">Start Date & Time</label>
          <div className="relative">
            <input
              type="text"
              value={formatDateTime(startDate)}
              placeholder="MM/DD/YYYY, --:-- --"
              readOnly
              onClick={() => setIsStartCalendarOpen(true)}
              className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-[#991b1b]/20 focus:border-[#991b1b] transition-all outline-none cursor-pointer"
            />
            <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5 relative">
          <label className="text-[13px] font-bold text-slate-700">End Date & Time</label>
          <div className="relative">
            <input
              type="text"
              value={formatDateTime(endDate)}
              placeholder="MM/DD/YYYY, --:-- --"
              readOnly
              onClick={() => setIsEndCalendarOpen(true)}
              className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-[#991b1b]/20 focus:border-[#991b1b] transition-all outline-none cursor-pointer"
            />
            <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>



        <div ref={priorityRef} className="space-y-1.5 relative">
          <label className="text-[13px] font-bold text-slate-700">Playback Priority</label>
          <div className="relative">
            <button
              type="button"
              disabled={isEditor}
              onClick={() => setIsPriorityOpen(!isPriorityOpen)}
              className={`w-full flex items-center justify-between border rounded-lg py-2.5 px-4 text-sm font-medium transition-all outline-none text-left
                ${isEditor
                  ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-white border-slate-200 text-slate-700 focus:ring-2 focus:ring-[#991b1b]/20 focus:border-[#991b1b]"}`}
            >
              <div className="flex items-center space-x-2">
                {priorityOptions.find(o => o.value === playbackPriority)?.icon}
                <span>{playbackPriority}</span>
              </div>
              {!isEditor ? (
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isPriorityOpen ? "rotate-180" : ""}`} />
              ) : (
                <Lock size={14} className="text-slate-400" />
              )}
            </button>

            {!isEditor && isPriorityOpen && (
              <div className="absolute left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-[60] animate-in fade-in slide-in-from-top-2 duration-150">
                {priorityOptions.map((opt) => {
                  const isSelected = opt.value === playbackPriority;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setPlaybackPriority(opt.value);
                        setIsPriorityOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2 px-4 py-2.5 text-sm transition-colors text-left cursor-pointer
                        ${isSelected ? "bg-red-50 text-[#991b1b] font-bold" : "text-slate-700 hover:bg-slate-50 font-medium"}`}
                    >
                      {opt.icon}
                      <span>{opt.value}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>


        {/* Content Type Selector */}
        <div className="col-span-full space-y-1.5 mt-2">
          <label className="text-[13px] font-bold text-slate-700">Content Type</label>
          <div className="grid grid-cols-3 gap-4">
            <TypeOption icon={<Film size={20} />} label="Video" />
            <TypeOption icon={<ImageIcon size={20} />} label="Static Image" />
            <TypeOption icon={<Palette size={20} />} label="Mixed" active />
          </div>
        </div>

        {/* Screen Orientation Selector */}
        <div className="col-span-full space-y-1.5 mt-2">
          <label className="text-[13px] font-bold text-slate-700">Screen Orientation</label>
          <div className="grid grid-cols-3 gap-4">
            <TypeOption icon={<Smartphone size={20} />} label="Portrait" sublabel="9:16" />
            <TypeOption icon={<Monitor size={20} />} label="Landscape" sublabel="16:9" active />
            <TypeOption icon={<div className="flex space-x-1 items-end"><Smartphone size={16} /><Monitor size={20} /></div>} label="Both" sublabel="Adaptive" />
          </div>
        </div>

        {/* Publisher & Checklist */}
        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700">Publisher Context</label>
            <div className="bg-white border border-slate-100 p-0 rounded-lg flex items-center shadow-sm">
              <div className="flex-1 py-3 px-1">
                <div className="text-[13px] font-medium text-slate-700 flex items-center">
                  Alina Sophia (Regional Publisher)
                  <div className="ml-2 w-4 h-4 bg-black rounded-full flex items-center justify-center text-white">
                    <Check size={10} strokeWidth={4} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FFF5F5] border border-red-100 p-4 rounded-lg space-y-3 relative">
            <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Compliance Checklist</h5>
            <div className="grid grid-cols-2 gap-x-2 gap-y-3">
              <ChecklistItem label="Brand-approved" checked />
              <ChecklistItem label="Pricing verified" checked />
              <ChecklistItem label="No Copyright Issues" checked />
              <ChecklistItem label="Legal disclaimer ok" checked />
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="col-span-full space-y-1.5 mt-2">
          <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest">NOTE</label>
          <textarea
            placeholder="Add editorial notes for the publisher..."
            className="w-full bg-white border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-[#991b1b]/20 focus:border-[#991b1b] transition-all outline-none h-20 resize-none text-slate-400"
          />
        </div>
      </div>
    </div>
  );
}

function TypeOption({ icon, label, sublabel, active = false }: { icon: React.ReactNode, label: string, sublabel?: string, active?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center py-4 rounded-lg border transition-all cursor-pointer group
      ${active ? 'bg-[#FFF5F5] border-[#991b1b] text-[#991b1b]' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}>
      <div className={`mb-1 transition-transform group-hover:scale-110 ${active ? 'text-[#991b1b]' : 'text-slate-400'}`}>{icon}</div>
      <span className="text-[13px] font-bold">{label}</span>
      {sublabel && <span className="text-[10px] font-medium text-slate-400">{sublabel}</span>}
    </div>
  );
}

function ChecklistItem({ label, checked = false }: { label: string, checked?: boolean }) {
  return (
    <div className="flex items-center space-x-2">
      <div className={`h-4 w-4 rounded-sm flex items-center justify-center shrink-0 ${checked ? 'bg-[#991b1b] text-white' : 'border border-slate-300'}`}>
        {checked && <Check size={12} strokeWidth={4} />}
      </div>
      <span className="text-[11px] font-bold text-slate-700">{label}</span>
    </div>
  );
}

// USA geographic data for cascading dropdowns
const USA_GEO_DATA: Record<string, Record<string, string[]>> = {
  "Northeast": {
    "New York": ["New York City", "Brooklyn", "Buffalo", "Albany", "Syracuse"],
    "New Jersey": ["Newark", "Jersey City", "Hoboken", "Trenton", "Edison"],
    "Pennsylvania": ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading"],
    "Massachusetts": ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell"],
    "Connecticut": ["Bridgeport", "New Haven", "Hartford", "Stamford", "Waterbury"],
  },
  "Southeast": {
    "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"],
    "Georgia": ["Atlanta", "Savannah", "Augusta", "Columbus", "Macon"],
    "North Carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem"],
    "South Carolina": ["Columbia", "Charleston", "Greenville", "Myrtle Beach", "Rock Hill"],
    "Virginia": ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Arlington"],
  },
  "Midwest": {
    "Illinois": ["Chicago", "Aurora", "Naperville", "Rockford", "Springfield"],
    "Ohio": ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"],
    "Michigan": ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor"],
    "Indiana": ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel"],
    "Minnesota": ["Minneapolis", "Saint Paul", "Rochester", "Bloomington", "Duluth"],
  },
  "Southwest": {
    "Texas": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth"],
    "Arizona": ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale"],
    "New Mexico": ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell"],
    "Oklahoma": ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Lawton"],
    "Nevada": ["Las Vegas", "Henderson", "Reno", "Paradise", "Sparks"],
  },
  "West Coast": {
    "California": ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Fresno"],
    "Washington": ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue"],
    "Oregon": ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro"],
    "Colorado": ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood"],
    "Utah": ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem"],
  },
};

// Static outlet data grouped by USA region for the table
const USA_OUTLET_GROUPS = [
  {
    group: "NORTHEAST / NEW YORK",
    outlets: [
      { id: "OUT-1043", name: "Hudson Yards Atrium", loc: "New York City, NY", active: true, screens: "6 Screen", checked: true },
      { id: "OUT-1044", name: "Times Square Hub", loc: "New York City, NY", active: true, screens: "12 Screen", checked: true },
      { id: "OUT-1045", name: "Soho Boutique Outlet", loc: "New York City, NY", active: true, screens: "4 Screen", checked: true },
    ]
  },
  {
    group: "WEST COAST / LOS ANGELES",
    outlets: [
      { id: "OUT-1046", name: "Beverly Hills Central", loc: "Los Angeles, CA", active: true, screens: "8 Screen", checked: false },
      { id: "OUT-1047", name: "Santa Monica Pier", loc: "Los Angeles, CA", active: false, screens: "5 Screen", checked: false },
    ]
  },
  {
    group: "MIDWEST / CHICAGO",
    outlets: [
      { id: "OUT-1049", name: "Wacker Drive", loc: "Chicago, IL", active: true, screens: "7 Screen", checked: false },
      { id: "OUT-1050", name: "Magnificent Mile", loc: "Chicago, IL", active: true, screens: "5 Screen", checked: false },
    ]
  },
  {
    group: "SOUTHEAST / FLORIDA",
    outlets: [
      { id: "OUT-1051", name: "Midtown Atlanta", loc: "Atlanta, GA", active: true, screens: "6 Screen", checked: false },
      { id: "OUT-1052", name: "South Beach Plaza", loc: "Miami, FL", active: false, screens: "4 Screen", checked: false },
    ]
  },
  {
    group: "SOUTHWEST / TEXAS",
    outlets: [
      { id: "OUT-1053", name: "Deep Ellum", loc: "Dallas, TX", active: true, screens: "5 Screen", checked: false },
      { id: "OUT-1054", name: "River Walk Center", loc: "San Antonio, TX", active: true, screens: "3 Screen", checked: false },
    ]
  },
];

function StepTargeting({
  targeting,
  setTargeting,
  selectedOutlets,
  setSelectedOutlets
}: {
  targeting: any,
  setTargeting: any,
  selectedOutlets: string[],
  setSelectedOutlets: any
}) {
  const [searchText, setSearchText] = useState("");
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isLocalityOpen, setIsLocalityOpen] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const localityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (regionRef.current && !regionRef.current.contains(event.target as Node)) setIsRegionOpen(false);
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) setIsStateOpen(false);
      if (localityRef.current && !localityRef.current.contains(event.target as Node)) setIsLocalityOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const regions = Object.keys(USA_GEO_DATA);
  const selectedRegion = targeting.region !== "Region" ? targeting.region : null;
  const states = selectedRegion ? Object.keys(USA_GEO_DATA[selectedRegion] || {}) : [];
  const selectedState = targeting.state !== "State" ? targeting.state : null;
  const localities = selectedRegion && selectedState ? (USA_GEO_DATA[selectedRegion]?.[selectedState] || []) : [];

  const handleRegionSelect = (region: string) => {
    setTargeting({ region, state: "State", locality: "Locality" });
    setIsRegionOpen(false);
  };
  const handleStateSelect = (state: string) => {
    setTargeting({ ...targeting, state, locality: "Locality" });
    setIsStateOpen(false);
  };
  const handleLocalitySelect = (locality: string) => {
    setTargeting({ ...targeting, locality });
    setIsLocalityOpen(false);
  };

  // Filter groups by active region filter
  const visibleGroups = USA_OUTLET_GROUPS.filter(g => {
    if (selectedRegion) {
      return g.group.toLowerCase().startsWith(selectedRegion.toLowerCase());
    }
    return true;
  });

  const totalOutlets = visibleGroups.reduce((sum, g) => sum + g.outlets.length, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-4">

      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by Outlet ID...."
            className="w-full bg-[#F8FAFC] border border-slate-200 rounded-full py-2.5 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#991b1b]/20 focus:border-[#991b1b] transition-all outline-none"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {/* Region dropdown */}
          <div ref={regionRef} className="relative">
            <button
              type="button"
              onClick={() => { setIsRegionOpen(!isRegionOpen); setIsStateOpen(false); setIsLocalityOpen(false); }}
              className="bg-white border border-slate-200 rounded-full py-2.5 pl-4 pr-8 text-sm font-medium text-slate-700 outline-none flex items-center gap-1 hover:border-slate-300 transition-all"
            >
              <span className={selectedRegion ? "text-[#991b1b] font-bold" : ""}>{targeting.region}</span>
              <ChevronDown size={14} className={`absolute right-3 text-slate-400 transition-transform ${isRegionOpen ? "rotate-180" : ""}`} />
            </button>
            {isRegionOpen && (
              <div className="absolute left-0 mt-1 min-w-[180px] bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-[60] animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  type="button"
                  onClick={() => handleRegionSelect("Region")}
                  className="w-full text-left px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 font-medium"
                >All Regions</button>
                {regions.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRegionSelect(r)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${targeting.region === r ? "bg-red-50 text-[#991b1b] font-bold" : "text-slate-700 hover:bg-slate-50 font-medium"
                      }`}
                  >{r}</button>
                ))}
              </div>
            )}
          </div>

          {/* State dropdown */}
          <div ref={stateRef} className="relative">
            <button
              type="button"
              onClick={() => { if (selectedRegion) { setIsStateOpen(!isStateOpen); setIsRegionOpen(false); setIsLocalityOpen(false); } }}
              className={`bg-white border border-slate-200 rounded-full py-2.5 pl-4 pr-8 text-sm font-medium outline-none flex items-center gap-1 transition-all ${selectedRegion ? "text-slate-700 hover:border-slate-300 cursor-pointer" : "text-slate-400 cursor-not-allowed opacity-60"
                }`}
            >
              <span className={selectedState ? "text-[#991b1b] font-bold" : ""}>{targeting.state}</span>
              <ChevronDown size={14} className={`absolute right-3 text-slate-400 transition-transform ${isStateOpen ? "rotate-180" : ""}`} />
            </button>
            {isStateOpen && selectedRegion && (
              <div className="absolute left-0 mt-1 min-w-[200px] bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-[60] animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  type="button"
                  onClick={() => { setTargeting({ ...targeting, state: "State", locality: "Locality" }); setIsStateOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 font-medium"
                >All States</button>
                {states.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleStateSelect(s)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${targeting.state === s ? "bg-red-50 text-[#991b1b] font-bold" : "text-slate-700 hover:bg-slate-50 font-medium"
                      }`}
                  >{s}</button>
                ))}
              </div>
            )}
          </div>

          {/* Locality dropdown */}
          <div ref={localityRef} className="relative">
            <button
              type="button"
              onClick={() => { if (selectedState) { setIsLocalityOpen(!isLocalityOpen); setIsRegionOpen(false); setIsStateOpen(false); } }}
              className={`bg-white border border-slate-200 rounded-full py-2.5 pl-4 pr-8 text-sm font-medium outline-none flex items-center gap-1 transition-all ${selectedState ? "text-slate-700 hover:border-slate-300 cursor-pointer" : "text-slate-400 cursor-not-allowed opacity-60"
                }`}
            >
              <span className={targeting.locality !== "Locality" ? "text-[#991b1b] font-bold" : ""}>{targeting.locality}</span>
              <ChevronDown size={14} className={`absolute right-3 text-slate-400 transition-transform ${isLocalityOpen ? "rotate-180" : ""}`} />
            </button>
            {isLocalityOpen && selectedState && (
              <div className="absolute right-0 mt-1 min-w-[200px] bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-[60] animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  type="button"
                  onClick={() => { setTargeting({ ...targeting, locality: "Locality" }); setIsLocalityOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 font-medium"
                >All Localities</button>
                {localities.map(l => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => handleLocalitySelect(l)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${targeting.locality === l ? "bg-red-50 text-[#991b1b] font-bold" : "text-slate-700 hover:bg-slate-50 font-medium"
                      }`}
                  >{l}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-[13px] font-medium border-b border-slate-100 pb-2">
        <div className="text-slate-600">Selected: <span className="font-bold">{selectedOutlets.length}</span> Outlets</div>
        <button
          onClick={() => setSelectedOutlets([])}
          className="text-slate-500 hover:text-slate-700 flex items-center"
        >
          <X size={14} className="mr-1" /> Clear Selection
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F8FAFC] border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 w-12">
                <input type="checkbox" className="rounded border-slate-300 text-[#991b1b] focus:ring-[#991b1b]" />
              </th>
              <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Outlet Name & ID</th>
              <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Location</th>
              <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Screens</th>
              <th className="px-6 py-3 text-right text-[11px] font-bold text-slate-500 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleGroups.map((group) => (
              <React.Fragment key={group.group}>
                <tr>
                  <td colSpan={6} className="px-6 py-3 bg-slate-50/50 text-[11px] font-bold text-slate-600 tracking-widest border-t border-slate-100 first:border-t-0">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400" />
                      {group.group}
                    </div>
                  </td>
                </tr>
                {group.outlets
                  .filter(o => !searchText || o.name.toLowerCase().includes(searchText.toLowerCase()) || o.id.toLowerCase().includes(searchText.toLowerCase()))
                  .map(o => (
                    <TargetingRow
                      key={o.id}
                      id={o.id}
                      name={o.name}
                      loc={o.loc}
                      active={o.active}
                      screens={o.screens}
                      checked={selectedOutlets.includes(o.id)}
                    />
                  ))
                }
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-slate-200 flex justify-between items-center text-[12px] font-medium text-slate-500">
          <div>Showing {totalOutlets} of 142 Outlets</div>
          <div className="flex items-center space-x-1">
            <span className="px-2">Prev</span>
            <div className="w-6 h-6 bg-[#991b1b] text-white rounded flex items-center justify-center font-bold">1</div>
            <span className="px-1">...</span>
            <div className="w-6 h-6 hover:bg-slate-100 rounded flex items-center justify-center cursor-pointer">8</div>
            <span className="px-2 text-slate-900 font-bold">Next</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TargetingRow({ id, name, loc, active, screens, checked }: { id: string, name: string, loc: string, active: boolean, screens: string, checked: boolean }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
        <input type="checkbox" checked={checked} readOnly className="rounded border-slate-300 text-[#991b1b] focus:ring-[#991b1b] accent-[#991b1b]" />
      </td>
      <td className="px-4 py-4">
        <p className="font-bold text-slate-900 text-[13px]">{name}</p>
        <p className="text-[12px] text-slate-500 mt-0.5">ID: {id.split('-').slice(0, 2).join('-')}</p>
      </td>
      <td className="px-4 py-4 text-[13px] text-slate-600 font-medium">{loc}</td>
      <td className="px-4 py-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
          ${active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          <div className={`h-1.5 w-1.5 rounded-full mr-1.5 ${active ? 'bg-emerald-500' : 'bg-red-500'}`} />
          {active ? 'ACTIVE' : 'INACTIVE'}
        </span>
      </td>
      <td className="px-4 py-4 text-[13px] font-medium text-slate-600">{screens}</td>
      <td className="px-6 py-4 text-right">
        <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 shadow-sm">
          <Eye size={16} />
        </button>
      </td>
    </tr>
  );
}

function StepMedia({
  mediaType,
  setMediaType,
  selectedAssets,
  setSelectedAssets
}: {
  mediaType: string,
  setMediaType: any,
  selectedAssets: string[],
  setSelectedAssets: any
}) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-4">
      <div className="text-[14px] font-bold text-slate-900 mb-2">Upload Media Assets</div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-[#FCA5A5] bg-[#FEF2F2] rounded-2xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-white/50"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-red-100">
            <CloudUpload size={24} className="text-[#991b1b]" />
          </div>
          <h4 className="text-[#991b1b] font-bold text-[16px] mb-2">Drag & Drop Files Here</h4>
          <p className="text-slate-500 text-[13px] mb-6">Supports MP4, PNG, JPG. Max file size 200MB.<br />Recommended resolution 1920x1080.</p>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-[#991b1b] text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-800 transition-colors shadow-sm">
              <span>Import from Global Library</span>
              <div className="bg-white/20 rounded-full p-0.5"><Plus size={14} /></div>
            </button>
            <button className="px-5 py-2.5 bg-white border border-[#FCA5A5] text-[#991b1b] rounded-lg text-sm font-bold hover:bg-red-50 transition-colors">
              Browse Files
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <h3 className="text-sm font-bold text-slate-900">Uploaded Assets (4)</h3>
          <button className="flex items-center text-[12px] font-medium text-slate-500 hover:text-slate-700">
            <Shuffle size={14} className="mr-1.5" /> Shuffle
          </button>
        </div>

        <div className="space-y-2">
          <MediaItem id="1" title="Summer_Promo_Main.mp4" meta="MP4 • 1920x1080 • 12.4 MB" type="folder" time="00:15" status="check" img="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop" />
          <MediaItem id="2" title="Tech_Innovation_Loop.mp4" meta="MP4 • 1920x1080 • 12.4 MB" type="video" time="00:15" status="check" img="https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=100&h=100&fit=crop" />
          <MediaItem id="3" title="Global_Reach_Static.png" meta="MP4 • 1920x1080 • 12.4 MB" type="video" time="00:15" status="refresh" img="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop" />
          <MediaItem id="4" title="Closing_Sequence.mp4" meta="MP4 • 1920x1080 • 12.4 MB" type="folder" time="00:15" status="check" img="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&h=100&fit=crop" />
        </div>
      </div>

      {/* Playlist duration banner */}
      <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg p-3 flex items-center text-[#047857] text-[13px] font-medium">
        <CheckCircle2 size={16} className="mr-2 shrink-0 text-[#10B981]" />
        Total Playlist Duration: 01:20:00 • Playlist perfectly fills the current loop cycle
      </div>
    </div>
  );
}

function MediaItem({ id, title, meta, type, time, status, img }: any) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-colors group">
      <GripVertical size={16} className="text-slate-300 cursor-grab shrink-0" />
      <span className="text-[13px] font-medium text-slate-400 w-4 text-center shrink-0">{id}</span>
      <img src={img} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-slate-900 truncate">{title}</p>
        <p className="text-[11px] text-slate-500 truncate mt-0.5">{meta}</p>
      </div>
      <div className="flex items-center gap-4 shrink-0 px-2">
        {type === 'folder' ? <Folder size={16} className="text-slate-400" /> : <Film size={16} className="text-slate-400" />}
        <span className="text-[13px] font-medium text-slate-600">{time}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {status === 'check' ? (
          <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center text-white">
            <Check size={14} />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#3B82F6]">
            <RefreshCw size={18} />
          </div>
        )}
        <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

function StepReview({
  name,
  outletsCount,
  mediaType,
  assetsCount,
  targeting,
  startDate,
  endDate,
  campaignType,
  playbackPriority
}: {
  name: string,
  outletsCount: number,
  mediaType: string,
  assetsCount: number,
  targeting: any,
  startDate: Date | undefined,
  endDate: Date | undefined,
  campaignType: string,
  playbackPriority: string
}) {
  const formatDateTimeRange = (start?: Date, end?: Date) => {
    if (!start || !end) return "MM/DD/YYYY, --:-- -- - MM/DD/YYYY, --:-- --";
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };

    const formatSingle = (date: Date) => {
      const datePart = date.toLocaleDateString("en-US", options);
      let hours = date.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const hoursStr = String(hours).padStart(2, "0");
      const minutesStr = String(date.getMinutes()).padStart(2, "0");
      return `${datePart}, ${hoursStr}:${minutesStr} ${ampm}`;
    };

    return `${formatSingle(start)} - ${formatSingle(end)}`;
  };

  const calculateDuration = (start?: Date, end?: Date) => {
    if (!start || !end) return "0 Days";
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} Day${diffDays > 1 ? "s" : ""}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-4">
      <div className="flex justify-between items-center">
        <h4 className="text-[15px] font-bold text-slate-900">Campaign Summary</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campaign Details */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 flex-1">
            <div className="text-[14px] font-bold text-slate-900 mb-4">Campaign Details</div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Campaign Name</span>
                <p className="text-[15px] font-bold text-slate-900">{name || "Summer Sale 2026"}</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded flex items-center gap-1.5">
                    {campaignType === "Global - Locked" && <Lock size={12} className="text-emerald-600" />}
                    {campaignType === "Global - Editable" && <Globe size={12} className="text-emerald-600" />}
                    {campaignType === "Regional" && <MapPin size={12} className="text-emerald-600" />}
                    <span>{campaignType.toUpperCase()}</span>
                  </span>
                  <span className="bg-red-50 text-[#991b1b] text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded flex items-center gap-1.5">
                    {playbackPriority.includes("High") && <Zap size={12} className="text-[#991b1b]" />}
                    {playbackPriority.includes("Medium") && <Activity size={12} className="text-[#991b1b]" />}
                    {playbackPriority.includes("Low") && <Clock size={12} className="text-[#991b1b]" />}
                    <span>{playbackPriority.toUpperCase()}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 pt-4 border-t border-slate-50">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Date</span>
                  <p className="text-[13px] font-bold text-slate-900">{formatDateTimeRange(startDate, endDate)}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Duration</span>
                  <p className="text-[13px] font-bold text-slate-900">{calculateDuration(startDate, endDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Targeting Summary */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col">
          <div className="p-5 flex-1 flex flex-col">
            <div className="text-[14px] font-bold text-slate-900 mb-4">Targeting Summary</div>
            <div className="grid grid-cols-3 gap-3 mb-6 flex-1">
              <SummaryStat value="24" label="Outlets" />
              <SummaryStat value="186" label="Screens" />
              <SummaryStat value="6" label="Regions" />
            </div>
            <button className="w-full py-2.5 border border-red-100 rounded-lg text-[#991b1b] font-bold text-sm flex items-center justify-center group hover:bg-red-50 transition-all">
              View Selected Outlets <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Media Preview */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-[14px] font-bold text-slate-900">Media Preview</h4>
          <button className="text-[13px] font-medium text-slate-500 hover:text-[#991b1b] transition-colors">Edit Media</button>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-lg aspect-video rounded-xl overflow-hidden relative group cursor-pointer shadow-sm">
            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=450&fit=crop" alt="Main Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-all group-hover:bg-black/30">
              <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
                <Play size={24} className="ml-1" fill="currentColor" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <PreviewThumb num="01" img="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=120&fit=crop" active />
            <PreviewThumb num="02" img="https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=200&h=120&fit=crop" />
            <PreviewThumb num="03" img="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=120&fit=crop" />
            <PreviewThumb num="04" img="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=120&fit=crop" />
          </div>
        </div>

      </div>

      {/* Confirmation */}
      <div className="bg-[#F8FAFC] border border-slate-100 p-4 rounded-xl mt-4">
        <label className="flex items-start space-x-3 cursor-pointer group">
          <div className="mt-0.5">
            <input type="checkbox" className="rounded border-slate-300 text-[#991b1b] focus:ring-[#991b1b] w-4 h-4 accent-[#991b1b]" />
          </div>
          <span className="text-[13px] font-medium text-slate-600 leading-snug">I acknowledge that this campaign follows the corporate compliance guidelines for public screen broadcasts.</span>
        </label>
      </div>
    </div>
  );
}

function PreviewThumb({ num, img, active }: { num: string, img: string, active?: boolean }) {
  return (
    <div className={`relative w-28 h-16 rounded-lg overflow-hidden border-2 cursor-pointer ${active ? 'border-[#991b1b]' : 'border-transparent'}`}>
      <img src={img} className="w-full h-full object-cover" alt={`Thumb ${num}`} />
      <div className="absolute top-0 left-0 bg-[#991b1b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg">
        {num}
      </div>
    </div>
  );
}

function SummaryStat({ value, label }: { value: string, label: string }) {
  return (
    <div className="bg-[#FFF5F5] rounded-xl flex flex-col items-center justify-center py-4">
      <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">{value}</p>
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2">{label}</p>
    </div>
  );
}
