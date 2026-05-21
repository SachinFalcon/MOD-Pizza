"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Calendar,
  Clock,
  MoreVertical,
  AlertCircle,
  CheckCircle2,
  Users,
  MapPin,
  Search,
  ChevronDown,
  Paperclip,
  Smile,
  AtSign,
  Send,
  Video,
  Image as ImageIcon,
  ExternalLink,
  MessageSquare,
  Trophy,
  Filter
} from "lucide-react";
import { api, Campaign } from "@/services/mock.service";
import { FilterDropdown } from "@/components/atoms/filter-dropdown";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Standard cities coordinates for US map markers
const MAP_MARKERS = [
  { markerOffset: -12, name: "Seattle", coordinates: [-122.33, 47.60] },
  { markerOffset: -12, name: "Los Angeles", coordinates: [-118.24, 34.05] },
  { markerOffset: 15, name: "Denver", coordinates: [-104.99, 39.73] },
  { markerOffset: 15, name: "Dallas", coordinates: [-96.79, 32.77] },
  { markerOffset: -12, name: "Chicago", coordinates: [-87.62, 41.87] },
  { markerOffset: -12, name: "New York", coordinates: [-74.00, 40.71] },
  { markerOffset: 15, name: "Atlanta", coordinates: [-84.38, 33.74] },
  { markerOffset: 15, name: "Miami", coordinates: [-80.19, 25.76] },
];

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = (params?.id as string) || "AD-94821";

  // Tab State
  const [activeTab, setActiveTab] = useState<"overview" | "schedule" | "creatives">("overview");

  // Preview Modal State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Campaign State
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Comments Thread State
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "You",
      role: "",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      time: "2 hours ago",
      text: "The typography on the main banner needs slightly more leading. It feels a bit cramped for an 'editorial' feel."
    },
    {
      id: 2,
      author: "Brandon Septimus",
      role: "PUBLISHER",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      time: "1 hour ago",
      text: "Agreed. Adjusted to 1.6em. I've uploaded a new preview for review."
    },
    {
      id: 3,
      author: "You",
      role: "",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      time: "25 mins ago",
      text: "Campaign targets for EMEA are slightly high. Do we have the additional spend for the Italian market expansion?"
    }
  ]);
  const [newComment, setNewComment] = useState("");

  // Schedule Filter State
  const [scheduleSearch, setScheduleSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [schedulePage, setSchedulePage] = useState(1);

  // Creative Filter State
  const [creativeFilter, setCreativeFilter] = useState("All Types");

  // Fetch Campaign Data
  useEffect(() => {
    async function fetchCampaign() {
      setIsLoading(true);
      try {
        const campaignsData = await api.getCampaigns();
        const found = campaignsData.find(c => c.id === campaignId);
        if (found) {
          setCampaign(found);
        } else {
          // Create high-fidelity details if not in general mock service
          setCampaign({
            id: campaignId,
            name: campaignId === "AD-94821" ? "Holiday Winter Promo" : "Special Pizza Combo",
            creatives: "4 Assets",
            outlets: "149",
            status: "Live",
            runtime: "1,842 mins (30.7 hrs)",
            lastEdit: "2 hrs ago"
          });
        }
      } catch (error) {
        console.error("Failed to load campaign data", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCampaign();
  }, [campaignId]);

  // Add Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added = {
      id: Date.now(),
      author: "You",
      role: "",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      time: "Just now",
      text: newComment
    };

    setComments(prev => [...prev, added]);
    setNewComment("");
  };

  // Mock Outlets for Schedule Tab
  const outletsData = [
    { id: "OUT-1043", name: "Hudson Yards Atrium", city: "New York City, NY", region: "East Coast", status: "Active", startPercent: 0, widthPercent: 80, window: "07:00 - 23:00" },
    { id: "OUT-1044", name: "Times Square Hub", city: "New York City, NY", region: "East Coast", status: "Active", startPercent: 0, widthPercent: 100, window: "00:00 - 24:00" },
    { id: "OUT-1045", name: "Soho Boutique Outlet", city: "New York City, NY", region: "East Coast", status: "Active", startPercent: 10, widthPercent: 90, window: "09:00 - 21:00" },
    { id: "OUT-1046", name: "Union Square Store", city: "New York City, NY", region: "East Coast", status: "Active", startPercent: 0, widthPercent: 80, window: "08:00 - 22:00" },
    { id: "OUT-1047", name: "Santa Monica Pier", city: "Los Angeles, CA", region: "West Coast", status: "Active", startPercent: 30, widthPercent: 70, window: "10:00 - 23:00", startLabel: "STARTS DEC 10" },
    { id: "OUT-1048", name: "Sunset Boulevard", city: "Los Angeles, CA", region: "West Coast", status: "Scheduled", startPercent: 30, widthPercent: 70, window: "08:00 - 22:00" },
    { id: "OUT-1049", name: "Beverly Hills Central", city: "Los Angeles, CA", region: "West Coast", status: "Scheduled", startPercent: 30, widthPercent: 70, window: "09:00 - 23:00" },
    { id: "OUT-1050", name: "Pike Place Market", city: "Seattle, WA", region: "Northwest", status: "Scheduled", startPercent: 40, widthPercent: 60, window: "07:00 - 21:00", startLabel: "STARTS DEC 12" },
    { id: "OUT-1051", name: "Capitol Hill Pizza", city: "Seattle, WA", region: "Northwest", status: "Scheduled", startPercent: 40, widthPercent: 60, window: "08:00 - 23:00" },
    { id: "OUT-1052", name: "University District", city: "Seattle, WA", region: "Northwest", status: "Scheduled", startPercent: 40, widthPercent: 60, window: "10:00 - 22:00" }
  ];

  // Filter Outlets
  const filteredOutlets = useMemo(() => {
    return outletsData.filter(outlet => {
      const matchesSearch = outlet.name.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
        outlet.id.toLowerCase().includes(scheduleSearch.toLowerCase());
      const matchesRegion = regionFilter === "All Regions" || outlet.region === regionFilter;
      const matchesCity = cityFilter === "All Cities" || outlet.city.includes(cityFilter);
      return matchesSearch && matchesRegion && matchesCity;
    });
  }, [scheduleSearch, regionFilter, cityFilter]);

  // Mock Playback Sequence
  const playbackSequence = [
    { index: 1, name: "Summer_Promo_Main.mp4", type: "VIDEO", duration: "15s", resolution: "1920×1080", size: "12.4 MB" },
    { index: 2, name: "Summer_Promo_Main.mp4", type: "VIDEO", duration: "15s", resolution: "1920×1080", size: "12.4 MB" },
    { index: 3, name: "Summer_Promo_Main.mp4", type: "IMAGE", duration: "15s", resolution: "1920×1080", size: "12.4 MB" },
    { index: 4, name: "Summer_Promo_Main.mp4", type: "VIDEO", duration: "15s", resolution: "1920×1080", size: "12.4 MB" }
  ];

  // Mock Assets Grid
  const assetGrid = [
    { title: "Winter Coffee Promo.mp4", type: "Video (MP4)", duration: "15.0s", res: "1920 × 1080", size: "24.5 MB", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop" },
    { title: "Winter Coffee Promo.mp4", type: "Video (MP4)", duration: "15.0s", res: "1920 × 1080", size: "24.5 MB", img: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&h=300&fit=crop" },
    { title: "Winter Coffee Promo.mp4", type: "Video (MP4)", duration: "15.0s", res: "1920 × 1080", size: "24.5 MB", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop" },
    { title: "Winter Coffee Promo.mp4", type: "Video (MP4)", duration: "15.0s", res: "1920 × 1080", size: "24.5 MB", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop" }
  ];

  const filteredAssets = useMemo(() => {
    if (creativeFilter === "All Types") return assetGrid;
    if (creativeFilter === "Video") return assetGrid.filter(a => a.type.includes("Video"));
    if (creativeFilter === "Image") return assetGrid.filter(a => !a.type.includes("Video"));
    return assetGrid;
  }, [creativeFilter]);

  if (isLoading || !campaign) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-modRed"></div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-4">Loading Campaign Details...</p>
      </div>
    );
  }

  return (
    <div className="py-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto overflow-x-hidden px-4 md:px-0 bg-[#F9FAFB]">

      {/* ======================================================== */}
      {/* 1. HEADER & BREADCRUMBS */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] mb-6">

        {/* Navigation row */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 text-[11px] font-bold tracking-widest text-slate-400">
            <Link href="/campaigns" className="hover:text-modRed transition-colors uppercase">CAMPAIGNS</Link>
            <span>&gt;</span>
            <span className="text-modRed uppercase">DETAILS</span>
          </div>
          <Link href="/campaigns" className="h-8 w-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:border-modRed hover:text-modRed hover:bg-red-50/20 transition-all active:scale-90">
            <X size={16} />
          </Link>
        </div>

        {/* Campaign Info header row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-start space-x-4">
            {/* Small image preview of pizza */}
            <div className="h-16 w-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 shadow-sm relative group cursor-pointer" onClick={() => setIsPreviewOpen(true)}>
              <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=120&h=120&fit=crop" alt="Pizza preview" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play size={16} className="text-white fill-white" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">{campaign.name}</h2>
                <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${campaign.status === "Live"
                  ? "bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]"
                  : campaign.status === "Under Modification"
                    ? "bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3]"
                    : "bg-slate-50 text-slate-500 border-slate-200"
                  }`}>
                  {campaign.status === "Live" && <span className="h-1.5 w-1.5 rounded-full bg-[#137333] animate-pulse" />}
                  <span>{campaign.status}</span>
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-2">
                ID: {campaign.id} • Seasonal Promotion • Created by Sarah Jenkins
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-modRed hover:bg-red-750 text-white rounded-xl font-bold text-sm shadow-md shadow-modRed/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Play size={16} className="fill-white" />
            <span>Preview</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex space-x-8 border-t border-slate-100 mt-8 pt-4">
          {[
            { id: "overview", label: "Overview" },
            { id: "schedule", label: "Schedule" },
            { id: "creatives", label: "Creatives" }
          ].map(tab => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative py-2 text-sm font-bold transition-colors cursor-pointer select-none ${isSelected ? "text-modRed" : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                <span>{tab.label}</span>
                {isSelected && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-modRed rounded-full animate-in fade-in zoom-in-50 duration-200" />
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. TAB CONTENTS: OVERVIEW */}
      {/* ======================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-300">

          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1: Outlet Coverage */}
            <div className="bg-white border border-slate-100 rounded-[1.8rem] p-6 shadow-sm flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Outlet Coverage</span>
                <div className="p-2 bg-[#FFF5F5] rounded-xl text-modRed">
                  <MapPin size={18} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-black text-slate-900 tracking-tight">{campaign.outlets} <span className="text-sm font-bold text-slate-500">Outlets</span></p>
                <p className="text-xs font-medium text-slate-400 mt-1 leading-normal">Outlets currently displaying this campaign</p>
              </div>
            </div>

            {/* Card 2: Assigned Team */}
            <div className="bg-white border border-slate-100 rounded-[1.8rem] p-6 shadow-sm flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assigned Team</span>
                <div className="p-2 bg-[#FFF5F5] rounded-xl text-modRed">
                  <Users size={18} />
                </div>
              </div>
              <div className="flex items-center space-x-6 my-auto pt-2">
                <div className="flex items-center space-x-2">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop" alt="Editor Avatar" className="w-8 h-8 rounded-full border border-slate-100" />
                  <div>
                    <span className="text-[10px] font-black text-slate-400 block uppercase leading-none">EDITOR</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">Mike Ross</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" alt="Publisher Avatar" className="w-8 h-8 rounded-full border border-slate-100" />
                  <div>
                    <span className="text-[10px] font-black text-slate-400 block uppercase leading-none">PUBLISHER</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">Sarah Chen</span>
                  </div>
                </div>
              </div>
              <p className="text-xs font-medium text-slate-400 mt-1 leading-none">Responsible for deployment &amp; approvals</p>
            </div>

            {/* Card 3: Campaign Runtime */}
            <div className="bg-white border border-slate-100 rounded-[1.8rem] p-6 shadow-sm flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Campaign Runtime</span>
                <div className="p-2 bg-[#FFF5F5] rounded-xl text-modRed">
                  <Clock size={18} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-black text-slate-900 tracking-tight">{campaign.runtime}</p>
                <p className="text-xs font-medium text-slate-400 mt-1 leading-normal">Total time this campaign has played across all screens</p>
              </div>
            </div>

          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-12 gap-6 items-start">

            {/* Left Column (8 cols): Campaign Details & Geographic Map */}
            <div className="col-span-12 lg:col-span-8 space-y-6">

              {/* Campaign Details Box */}
              <div className="bg-white border border-slate-100 rounded-[1.8rem] p-6 md:p-8 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4 mb-6">
                  <h3 className="text-base font-bold text-slate-800">Campaign Details</h3>
                  <button className="text-xs font-semibold text-modRed hover:underline">Edit Details</button>
                </div>

                <div className="space-y-6">
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    Regional winter promotion focusing on holiday gift sets and seasonal beverage discounts. Target audience includes commuters and weekend shoppers across the Midwest regional cluster. Campaign includes high-brightness video assets and dynamic pricing integrations.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Objective</span>
                      <span className="text-sm font-bold text-slate-800 block mt-1">Increase beverage sales by 25% during winter season</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Campaign Type</span>
                      <span className="text-sm font-bold text-slate-800 block mt-1">Promotion</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Created</span>
                      <span className="text-sm font-bold text-slate-800 block mt-1">Dec 01, 2023 00:00 AM</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Last Modified</span>
                      <span className="text-sm font-bold text-slate-800 block mt-1">Dec 31, 2023 11:59 PM</span>
                    </div>
                  </div>

                  {/* Notes Alert box */}
                  <div className="bg-[#F8F9FA] border border-slate-200/50 rounded-2xl p-5 flex items-start space-x-3 mt-4">
                    <AlertCircle size={18} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1.5">NOTES</span>
                      <p className="text-xs font-semibold text-slate-700 leading-normal">
                        Approved by regional manager. Creative assets verified. Technical sync completed on Feb 8.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Geographic Deployment Box */}
              <div className="bg-white border border-slate-100 rounded-[1.8rem] p-6 md:p-8 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4 mb-6">
                  <h3 className="text-base font-bold text-slate-800">Geographic Deployment</h3>
                  <button className="text-xs font-semibold text-modRed hover:underline">Edit Details</button>
                </div>

                {/* Plain Map with Red Dots */}
                <div className="w-full relative flex items-center justify-center bg-slate-50 rounded-2xl p-4 min-h-[300px]">
                  <ComposableMap projection="geoAlbersUsa" className="w-full h-auto max-h-[350px]">
                    <Geographies geography={geoUrl}>
                      {({ geographies }: { geographies: any[] }) =>
                        geographies.map((geo: any) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="#E5E7EB"
                            stroke="#FFFFFF"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: "none" },
                              hover: { fill: "#D1D5DB", outline: "none" },
                              pressed: { outline: "none" }
                            }}
                          />
                        ))
                      }
                    </Geographies>

                    {MAP_MARKERS.map(({ name, coordinates, markerOffset }) => (
                      <Marker key={name} coordinates={coordinates as any}>
                        <circle r={6} fill="#BD1720" stroke="#FFFFFF" strokeWidth={1.5} className="animate-pulse shadow-md" />
                        <text
                          textAnchor="middle"
                          y={markerOffset}
                          style={{ fontFamily: "sans-serif", fontSize: "8px", fill: "#4B5563", fontWeight: "bold" }}
                        >
                          {name}
                        </text>
                      </Marker>
                    ))}
                  </ComposableMap>
                </div>
              </div>

            </div>

            {/* Right Column (4 cols): Coverage Gauge & Comment Section */}
            <div className="col-span-12 lg:col-span-4 space-y-6">

              {/* Coverage circular chart */}
              <div className="bg-white border border-slate-100 rounded-[1.8rem] p-6 shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest self-start">Campaign Coverage</span>

                {/* SVG Circular Donut Chart */}
                <div className="relative h-40 w-40 flex items-center justify-center my-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#F3F4F6"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    {/* Fill Circle (98.6%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#A61932"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * 98.6) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">98.6%</span>
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-400 max-w-[240px] leading-relaxed mb-2">
                  98.6% percentage of total screens are currently displaying this campaign.
                </p>
              </div>

              {/* Comments Thread Section */}
              <div className="bg-white border border-slate-100 rounded-[1.8rem] p-6 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Comments Thread</span>

                {/* Message items list */}
                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 mb-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl p-4 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <img src={comment.avatar} alt={comment.author} className="w-7 h-7 rounded-full border" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-800">{comment.author}</span>
                              {comment.role && (
                                <span className="bg-red-50 text-modRed border border-red-100 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide">
                                  {comment.role}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-semibold text-slate-400 block leading-none mt-0.5">{comment.time}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{comment.text}</p>
                      <button className="text-[10px] font-bold text-modRed hover:underline mt-2 tracking-wide uppercase">Reply</button>
                    </div>
                  ))}
                </div>

                {/* Comment Form input */}
                <form onSubmit={handleAddComment} className="border border-slate-200 rounded-2xl p-3 flex flex-col space-y-3 bg-white focus-within:ring-2 focus-within:ring-modRed/25 transition-all">
                  <textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none resize-none h-14 bg-transparent"
                  />
                  <div className="flex justify-between items-center border-t border-slate-100 pt-2.5">
                    <div className="flex items-center space-x-2 text-slate-400">
                      <button type="button" className="p-1 hover:text-modRed hover:bg-red-50/20 rounded-md transition-colors"><Paperclip size={14} /></button>
                      <button type="button" className="p-1 hover:text-modRed hover:bg-red-50/20 rounded-md transition-colors"><Smile size={14} /></button>
                      <button type="button" className="p-1 hover:text-modRed hover:bg-red-50/20 rounded-md transition-colors"><AtSign size={14} /></button>
                    </div>
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className={`h-7 w-7 rounded-lg flex items-center justify-center text-white transition-all active:scale-90 cursor-pointer ${newComment.trim() ? "bg-modRed hover:bg-red-750" : "bg-slate-350 cursor-not-allowed"
                        }`}
                    >
                      <Send size={12} className="fill-white" />
                    </button>
                  </div>
                </form>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 3. TAB CONTENTS: SCHEDULE */}
      {/* ======================================================== */}
      {activeTab === "schedule" && (
        <div className="space-y-6 animate-in fade-in duration-300">

          {/* Outlet Schedule Filter Controls */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-modRed transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search by Outlet ID..."
                value={scheduleSearch}
                onChange={(e) => setScheduleSearch(e.target.value)}
                className="w-full bg-[#F8F9FA] border border-slate-150 rounded-xl py-2.5 pl-12 pr-4 text-xs font-semibold focus:ring-2 focus:ring-modRed/10 focus:border-modRed/20 transition-all outline-none text-slate-800 placeholder-slate-400"
              />
            </div>

            <div className="flex w-full md:w-auto gap-3 items-center shrink-0">
              <FilterDropdown
                options={["All Regions", "East Coast", "West Coast", "Northwest"]}
                value={regionFilter}
                onChange={setRegionFilter}
              />
              <FilterDropdown
                options={["All Cities", "New York City", "Los Angeles", "Seattle"]}
                value={cityFilter}
                onChange={setCityFilter}
              />
            </div>
          </div>

          {/* Table list card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/20">
              <h3 className="text-sm font-bold text-slate-800">Outlets Schedule <span className="text-xs text-slate-400 font-semibold ml-1.5">({filteredOutlets.length} Outlets)</span></h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/30 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-6 py-4">OUTLET NAME &amp; ID</th>
                    <th className="px-4 py-4">LOCATION</th>
                    <th className="px-4 py-4">SCHEDULE INDICATOR</th>
                    <th className="px-4 py-4">STATUS</th>
                    <th className="px-6 py-4 text-right">DAILY WINDOW</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOutlets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                        No matching outlets scheduled
                      </td>
                    </tr>
                  ) :
                    filteredOutlets.map((outlet, idx) => (
                      <React.Fragment key={outlet.id}>
                        {/* Starts Date row headers if set */}
                        {outlet.startLabel && (
                          <tr className="bg-red-50/10">
                            <td colSpan={5} className="px-6 py-2.5">
                              <span className="text-[10px] font-black text-modRed tracking-widest uppercase">
                                {outlet.startLabel}
                              </span>
                            </td>
                          </tr>
                        )}

                        <tr className="hover:bg-slate-50/45 transition-colors group">
                          <td className="px-6 py-4">
                            <p className="text-xs font-bold text-slate-800 leading-none">{outlet.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-1">ID: {outlet.id}</p>
                          </td>
                          <td className="px-4 py-4 text-xs font-semibold text-slate-600">{outlet.city}</td>
                          <td className="px-4 py-4 min-w-[200px]">
                            <div className="flex items-center space-x-6">
                              <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">Dec 01</span>

                              {/* Gantt progress visual bar */}
                              <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden relative shrink-0">
                                <div
                                  className="h-full bg-modRed rounded-full transition-all duration-500"
                                  style={{
                                    marginLeft: `${outlet.startPercent}%`,
                                    width: `${outlet.widthPercent}%`
                                  }}
                                />
                              </div>

                              <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">Dec 31</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${outlet.status === "Active"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                              }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${outlet.status === "Active" ? "bg-emerald-600" : "bg-amber-650"}`} />
                              <span>{outlet.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-xs font-semibold text-slate-600">{outlet.window}</td>
                        </tr>
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="px-8 py-4 bg-slate-50/20 flex justify-between items-center border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Showing {filteredOutlets.length} of 122 Outlets</p>
              <div className="flex items-center space-x-2">
                <button className="text-[10px] font-black text-slate-400 hover:text-slate-800 px-2 py-1 transition-colors uppercase tracking-widest">Prev</button>
                <div className="flex items-center space-x-1">
                  <button className="h-7 w-7 rounded bg-modRed text-white shadow shadow-modRed/20 flex items-center justify-center text-xs font-bold">1</button>
                  <span className="text-slate-400 text-xs">...</span>
                  <button className="h-7 w-7 rounded border border-slate-200 text-slate-500 hover:border-slate-400 flex items-center justify-center text-xs font-bold">8</button>
                </div>
                <button className="text-[10px] font-black text-slate-900 px-2 py-1 transition-colors uppercase tracking-widest">Next</button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TAB CONTENTS: CREATIVES */}
      {/* ======================================================== */}
      {activeTab === "creatives" && (
        <div className="space-y-6 animate-in fade-in duration-300">

          {/* Playback sequence table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/20 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">Creative Playback Sequence</h3>
              <span className="bg-red-50 text-modRed border border-red-100 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {playbackSequence.length} Items Total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/30 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-6 py-4 w-12 text-center">#</th>
                    <th className="px-4 py-4">OUTLET NAME &amp; ID</th>
                    <th className="px-4 py-4">LOCATION</th>
                    <th className="px-4 py-4">SCHEDULE INDICATOR</th>
                    <th className="px-4 py-4">STATUS</th>
                    <th className="px-6 py-4 text-right">DAILY WINDOW</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {playbackSequence.map((item) => (
                    <tr key={item.index} className="hover:bg-slate-50/45 transition-colors group">
                      <td className="px-6 py-4 text-center text-xs font-bold text-slate-400">{item.index}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          {/* Thumbnail */}
                          <div className="h-9 w-9 bg-slate-100 rounded-lg overflow-hidden border shrink-0">
                            <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=80&h=80&fit=crop" alt="Pizza" className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 leading-none">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-1">MP4 • {item.resolution} • {item.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${item.type === "VIDEO"
                          ? "bg-blue-50 text-blue-600 border border-blue-100"
                          : "bg-orange-50 text-orange-600 border border-orange-100"
                          }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs font-semibold text-slate-600">{item.duration}</td>
                      <td className="px-4 py-4 text-xs font-semibold text-slate-650">{item.resolution}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setIsPreviewOpen(true)} className="text-xs font-bold text-modRed hover:underline">Preview</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Creative assets grid section */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4 mb-6">
              <h3 className="text-base font-bold text-slate-800">Creative Assets Grid</h3>

              <div className="flex items-center space-x-2">
                <Filter size={14} className="text-slate-400" />
                <FilterDropdown
                  options={["All Types", "Video", "Image"]}
                  value={creativeFilter}
                  onChange={setCreativeFilter}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAssets.map((asset, idx) => (
                <div key={idx} className="bg-white border border-slate-200/50 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-all group">
                  <div className="h-44 bg-slate-100 relative overflow-hidden">
                    <img src={asset.img} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 left-3 bg-black/60 rounded-lg px-2 py-1 text-[9px] font-black text-white uppercase tracking-wider">
                      {asset.type}
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 truncate">{asset.title}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Added Dec 12, 2023</span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 pt-2 border-t border-slate-50">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">TYPE</span>
                        <span className="text-[11px] font-bold text-slate-750 block mt-1">{asset.type}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">DURATION</span>
                        <span className="text-[11px] font-bold text-slate-750 block mt-1">{asset.duration}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">RESOLUTION</span>
                        <span className="text-[11px] font-bold text-slate-750 block mt-1">{asset.res}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">SIZE</span>
                        <span className="text-[11px] font-bold text-slate-750 block mt-1">{asset.size}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsPreviewOpen(true)}
                      className="w-full mt-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer text-center group-hover:bg-[#FFF5F5] group-hover:text-modRed"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 5. INTERACTIVE VIDEO PREVIEW MODAL */}
      {/* ======================================================== */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-in fade-in duration-300">

          {/* Close trigger button */}
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90 border border-white/10 cursor-pointer shadow-lg"
          >
            <X size={24} />
          </button>

          {/* Interactive Pizza Video Loop Container */}
          <div className="w-full max-w-4xl max-h-[85vh] aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-white/5 animate-in zoom-in-95 duration-300 px-4 md:px-0">
            <video
              src="https://assets.mixkit.co/videos/preview/mixkit-delicious-pizza-being-sliced-in-slow-motion-41848-large.mp4"
              controls
              autoPlay
              loop
              className="w-full h-full object-contain"
            />
          </div>

        </div>
      )}

    </div>
  );
}
