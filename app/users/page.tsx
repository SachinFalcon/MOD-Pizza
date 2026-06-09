"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Users, 
  Shield, 
  Filter, 
  Search, 
  ChevronDown, 
  ExternalLink, 
  MoreVertical,
  Plus,
  ArrowLeft,
  X,
  Check,
  CircleAlert,
  RotateCcw,
  Eye,
  Edit2,
  Key,
  UserMinus,
  UserX,
  Database,
  Store,
  Map,
  Building2,
  ChevronRight,
  ChevronUp,
  Lock,
  TriangleAlert
} from "lucide-react";

// Mock Data
const rolesData = [
  { id: "1", name: "Campaign Manager", desc: "Create & manage campaigns", users: 12, permissions: 28, scope: "Regional", status: "ACTIVE" },
  { id: "2", name: "Outlet Manager", desc: "Manage outlet screens", users: 12, permissions: 28, scope: "Outlet", status: "ACTIVE" },
  { id: "3", name: "Viewer", desc: "Read-only access", users: 12, permissions: 28, scope: "Global", status: "INACTIVE" },
];

const usersData = Array(10).fill({
  id: "011", name: "John Doe", email: "john@example.com", role: "EDITOR", scope: "Outlet 042, West Region ...", status: "ACTIVE"
}).map((u, i) => ({
  ...u,
  id: `01${i + 1}`,
  role: i % 3 === 0 ? "EDITOR" : i % 3 === 1 ? "VIEWER" : "MANAGER",
  status: i === 4 ? "INACTIVE" : "ACTIVE"
}));

// Components
function CustomDropdown({ value, options }: { value: string, options: string[] }) {
  return (
    <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-md py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
      {value}
      <ChevronDown size={14} className="text-slate-400" />
    </button>
  );
}

function UserActionDropdown({ user, onViewDetails }: { user: any, onViewDetails: () => void }) {
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

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} 
        className="p-1 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors focus:outline-none"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); onViewDetails(); }}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 font-medium transition-colors"
          >
            <Eye size={15} className="text-slate-400" /> View Details
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 font-medium transition-colors"
          >
            <Edit2 size={15} className="text-slate-400" /> Edit User
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 font-medium transition-colors"
          >
            <Key size={15} className="text-slate-400" /> Reset Password
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 font-medium transition-colors"
          >
            {user.status === "ACTIVE" ? (
              <><UserMinus size={15} className="text-slate-400" /> Deactivate</>
            ) : (
              <><Check size={15} className="text-slate-400" /> Activate</>
            )}
          </button>
          <div className="border-t border-slate-100 mt-1"></div>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-modRed hover:bg-red-50 flex items-center gap-3 font-medium transition-colors"
          >
            <UserX size={15} /> Remove User
          </button>
        </div>
      )}
    </div>
  );
}

// Modals

function AssignedScopeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col overflow-hidden relative slide-in-from-bottom-8 duration-300 max-h-[85vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-modRed flex items-center justify-center"><Check size={20} /></div>
            <h2 className="text-xl font-black text-slate-900">Assigned Scope</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-500" /></button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="relative mb-6">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search scopes (e.g. Region, Outlet)..." className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-modRed focus:ring-1 focus:ring-modRed" />
          </div>
          <p className="text-sm font-bold text-slate-500 mb-4">12 total scopes assigned</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-modRed/30 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-red-50 text-modRed flex items-center justify-center"><Store size={20} /></div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-modRed transition-colors">Outlet 042</div>
                  <div className="text-xs font-medium text-slate-500">Commercial Retail Space • ID: 4421</div>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-modRed transition-colors" />
            </div>
            <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-modRed/30 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-red-50 text-modRed flex items-center justify-center"><Map size={20} /></div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-modRed transition-colors">West Region</div>
                  <div className="text-xs font-medium text-slate-500">California, Nevada, Oregon Area</div>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-modRed transition-colors" />
            </div>
            <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-modRed/30 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-red-50 text-modRed flex items-center justify-center"><Building2 size={20} /></div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-modRed transition-colors">Regional HQ</div>
                  <div className="text-xs font-medium text-slate-500">Administrative Hub • Main Campus</div>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-modRed transition-colors" />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-modRed bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">Close</button>
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-white bg-modRed rounded-lg hover:bg-red-800 transition-colors shadow-lg shadow-modRed/20">Apply Selection</button>
        </div>
      </div>
    </div>
  );
}

function CreateUserModal({ onClose, onOpenScope }: { onClose: () => void, onOpenScope: () => void }) {
  const [scopeExpanded, setScopeExpanded] = useState(true);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl flex flex-col overflow-hidden relative slide-in-from-bottom-8 duration-300 max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-2xl font-black text-slate-900">Create New User</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-500" /></button>
        </div>
        <div className="p-8 flex-1 overflow-y-auto space-y-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Personal Information</h3>
            <div className="h-0.5 w-10 bg-modRed mb-5"></div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input type="text" placeholder="e.g. Jane Doe" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-modRed focus:ring-1 focus:ring-modRed" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                  <input type="text" placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-modRed focus:ring-1 focus:ring-modRed" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                  <input type="email" placeholder="jane@company.com" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-modRed focus:ring-1 focus:ring-modRed" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Role & Permissions</h3>
            <div className="h-0.5 w-10 bg-modRed mb-5"></div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Assign Role</label>
                <div className="relative">
                  <select className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 appearance-none bg-white focus:outline-none focus:border-modRed focus:ring-1 focus:ring-modRed cursor-pointer">
                    <option>Regional Manager</option>
                    <option>Campaign Manager</option>
                    <option>Outlet Manager</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="bg-[#FFF5F5] border border-red-100 rounded-lg p-5">
                <h4 className="text-sm font-bold text-modRed mb-3">Permissions for Regional Manager</h4>
                <div className="grid grid-cols-2 gap-y-3">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-modRed text-white flex items-center justify-center"><Check size={12} /></div><span className="text-sm font-medium text-slate-800">View Dashboard</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-modRed text-white flex items-center justify-center"><Check size={12} /></div><span className="text-sm font-medium text-slate-800">Manage Users</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-modRed text-white flex items-center justify-center"><Check size={12} /></div><span className="text-sm font-medium text-slate-800">View Financial Reports</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-white border border-slate-300"></div><span className="text-sm font-medium text-slate-500">Edit System Settings</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-white border border-slate-300"></div><span className="text-sm font-medium text-slate-500">Delete Records</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-modRed text-white flex items-center justify-center"><Check size={12} /></div><span className="text-sm font-medium text-slate-800">Export Data</span></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Scope of Access</h3>
            <div className="h-0.5 w-10 bg-modRed mb-5"></div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Select Assigned Regions & Outlets</label>
              <div className="border border-red-100 rounded-lg overflow-hidden">
                <div 
                  className="bg-[#FFF5F5] p-4 flex items-center justify-between cursor-pointer border-b border-red-100"
                  onClick={() => setScopeExpanded(!scopeExpanded)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded border border-slate-300 bg-white"></div>
                    <span className="text-sm font-bold text-slate-900">West</span>
                  </div>
                  {scopeExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </div>
                {scopeExpanded && (
                  <div className="bg-white p-4 space-y-3 pl-11">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded border border-slate-300"></div>
                        <span className="text-sm font-semibold text-slate-700">California</span>
                      </div>
                      <ChevronUp size={16} className="text-slate-400" />
                    </div>
                    <div className="pl-7 flex items-center justify-between cursor-pointer group" onClick={onOpenScope}>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded bg-modRed text-white flex items-center justify-center"><Check size={12} /></div>
                        <span className="text-sm font-bold text-slate-900 group-hover:text-modRed transition-colors">Outlet 042</span>
                      </div>
                      <span className="text-[10px] font-bold text-modRed uppercase tracking-wider bg-red-50 px-2 py-1 rounded">View Details</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-white bg-modRed rounded-lg hover:bg-red-800 transition-colors shadow-lg shadow-modRed/20">Create User</button>
        </div>
      </div>
    </div>
  );
}

function RoleUsersModal({ roleName, onClose }: { roleName: string, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl flex flex-col overflow-hidden relative slide-in-from-bottom-8 duration-300 max-h-[85vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900">Users with {roleName} Role</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-500" /></button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="relative mb-6">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search users..." className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-modRed focus:ring-1 focus:ring-modRed" />
          </div>
          <p className="text-sm font-bold text-slate-500 mb-4">4 total users</p>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Scope</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: "Sarah Connor", email: "sarah.c@mtashq.com", scope: "Global", status: "ACTIVE" },
                { name: "Michael Chang", email: "m.chang@mtashq.com", scope: "Regional", status: "ACTIVE" },
                { name: "John Doe", email: "john.d@mtashq.com", scope: "Outlet", status: "ACTIVE" },
                { name: "Emily Ross", email: "emily.r@mtashq.com", scope: "Global", status: "INACTIVE" },
              ].map((u, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${u.name}`} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{u.name}</div>
                        <div className="text-[11px] font-medium text-slate-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 font-bold text-[11px] rounded-md">{u.scope}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${u.status === 'ACTIVE' ? 'bg-[#E6F4EA] text-[#137333]' : 'bg-slate-100 text-slate-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-[#137333]' : 'bg-slate-400'}`}></div>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-1 hover:text-slate-600 text-slate-400 transition-colors"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-slate-100 flex justify-end bg-slate-50">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-modRed bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

function CreateRoleModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl flex flex-col overflow-hidden relative slide-in-from-bottom-8 duration-300 max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-2xl font-black text-slate-900">Create New Role</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-500" /></button>
        </div>
        <div className="p-8 flex-1 overflow-y-auto space-y-8">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-6">Define permissions and access levels for the new administrative role.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Role Name</label>
                <input type="text" placeholder="e.g. Content Manager" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-modRed focus:ring-1 focus:ring-modRed" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Add Base Template (Optional)</label>
                <div className="relative">
                  <select className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 appearance-none bg-white focus:outline-none focus:border-modRed focus:ring-1 focus:ring-modRed cursor-pointer">
                    <option>Select a template</option>
                    <option>Viewer Template</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Permissions Configuration</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#FFF5F5] border border-red-100 rounded-lg p-5">
                <h4 className="text-sm font-bold text-modRed mb-4">Page Access</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800">Dashboard</span>
                    <div className="w-10 h-5 bg-modRed rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Content Management</span>
                    <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">User Management</span>
                    <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">System Settings</span>
                    <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div></div>
                  </div>
                </div>
              </div>
              <div className="bg-[#FFF5F5] border border-red-100 rounded-lg p-5">
                <h4 className="text-sm font-bold text-modRed mb-4">Action-level Permissions</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Create Content</span>
                    <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Edit Content</span>
                    <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Publish Content</span>
                    <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Delete Records</span>
                    <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-white bg-modRed rounded-lg hover:bg-red-800 transition-colors shadow-lg shadow-modRed/20">Save Role</button>
        </div>
      </div>
    </div>
  );
}

function RolePermissionsModal({ roleName, onClose }: { roleName: string, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col overflow-hidden relative slide-in-from-bottom-8 duration-300 max-h-[85vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900">Permissions – {roleName}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-500" /></button>
        </div>
        <div className="p-8 flex-1 overflow-y-auto space-y-8">
          
          <div>
            <div className="flex items-center gap-2 text-modRed mb-4 uppercase tracking-widest text-[11px] font-black">
              <Database size={14} /> CAMPAIGNS
            </div>
            <div className="space-y-4 ml-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800">Create Campaign</span>
                <div className="w-5 h-5 rounded bg-modRed text-white flex items-center justify-center"><Check size={14} /></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800">Edit Campaign</span>
                <div className="w-5 h-5 rounded bg-modRed text-white flex items-center justify-center"><Check size={14} /></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Schedule Campaign</span>
                <div className="w-5 h-5 rounded border border-slate-300 bg-white"></div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-modRed mb-4 uppercase tracking-widest text-[11px] font-black">
              <Store size={14} /> CONTENT
            </div>
            <div className="space-y-4 ml-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800">Upload Assets</span>
                <div className="w-5 h-5 rounded bg-modRed text-white flex items-center justify-center"><Check size={14} /></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800">Edit Assets</span>
                <div className="w-5 h-5 rounded bg-modRed text-white flex items-center justify-center"><Check size={14} /></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Delete Assets</span>
                <div className="w-5 h-5 rounded border border-slate-300 bg-white"></div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-modRed mb-4 uppercase tracking-widest text-[11px] font-black">
              <Map size={14} /> ANALYTICS
            </div>
            <div className="space-y-4 ml-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800">View Reports</span>
                <div className="w-5 h-5 rounded bg-modRed text-white flex items-center justify-center"><Check size={14} /></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Export Data</span>
                <div className="w-5 h-5 rounded border border-slate-300 bg-white"></div>
              </div>
            </div>
          </div>

        </div>
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-modRed bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">Close</button>
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-white bg-modRed rounded-lg hover:bg-red-800 transition-colors shadow-lg shadow-modRed/20">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<"users" | "roles">("roles");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [profileTab, setProfileTab] = useState<"overview" | "permissions">("permissions");

  // Modal states
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [rolePermissionsModal, setRolePermissionsModal] = useState<string | null>(null);
  const [roleUsersModal, setRoleUsersModal] = useState<string | null>(null);
  const [isAssignedScopeOpen, setIsAssignedScopeOpen] = useState(false);

  const closeProfile = () => {
    setSelectedUser(null);
    setProfileTab("overview");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto pb-10">
      {!selectedUser ? (
        <div className="space-y-6">
          {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">User Management</h2>
        <p className="text-sm font-medium text-slate-500 mt-1">Control access across hierarchy, locations, and modules</p>
      </div>

      <div className="flex justify-between items-end border-b border-slate-200">
        <div className="flex space-x-6">
          <button 
            onClick={() => setActiveTab("users")}
            className={`pb-3 flex items-center gap-2 font-bold text-sm transition-colors relative ${activeTab === "users" ? "text-modRed" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Users size={18} />
            Users
            {activeTab === "users" && <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-modRed"></div>}
          </button>
          <button 
            onClick={() => setActiveTab("roles")}
            className={`pb-3 flex items-center gap-2 font-bold text-sm transition-colors relative ${activeTab === "roles" ? "text-modRed" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Shield size={18} />
            Roles
            {activeTab === "roles" && <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-modRed"></div>}
          </button>
        </div>
        <div className="pb-3">
          <button 
            onClick={() => activeTab === "roles" ? setIsCreateRoleOpen(true) : setIsCreateUserOpen(true)}
            className="bg-modRed hover:bg-red-800 text-white text-sm font-bold py-2.5 px-5 rounded-md shadow-lg shadow-modRed/20 transition-all flex items-center gap-2 cursor-pointer">
            <Plus size={16} strokeWidth={3} />
            {activeTab === "roles" ? "Create New Role" : "Create New User"}
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="p-2 border border-slate-200 rounded-md bg-white hover:bg-slate-50 text-slate-500 transition-colors">
            <Filter size={16} />
          </button>
          <CustomDropdown value="West Region" options={["West Region", "East Region"]} />
          <button 
            onClick={() => setIsAssignedScopeOpen(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 rounded-md py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Scope
            <ChevronDown size={14} className="text-slate-400" />
          </button>
          <CustomDropdown value="Roles" options={["Roles", "Admin", "Manager"]} />
          <CustomDropdown value="Status" options={["Status", "Active", "Inactive"]} />
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search...." 
            className="w-[300px] pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-modRed/10 transition-all"
          />
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="bg-white border border-slate-100 rounded-md shadow-sm">
        {activeTab === "roles" && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F3F1EC] text-[11px] font-black text-slate-600 uppercase tracking-widest">
                <th className="py-4 px-6 w-12"><input type="checkbox" className="rounded border-slate-300" /></th>
                <th className="py-4 px-4">Name / ID</th>
                <th className="py-4 px-4">Description</th>
                <th className="py-4 px-4 text-center">Users</th>
                <th className="py-4 px-4 text-center">Permissions</th>
                <th className="py-4 px-4 text-center">Scope</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rolesData.map((role, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6"><input type="checkbox" className="rounded border-slate-300" /></td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-modRed">
                        {idx === 0 ? <Shield size={14} /> : idx === 1 ? <Database size={14} /> : <Search size={14} />}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{role.name}</div>
                        <div className="text-[11px] font-semibold text-slate-400 mt-0.5">ID:011</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-slate-600">{role.desc}</td>
                  <td className="py-4 px-4 text-center">
                    <button onClick={() => setRoleUsersModal(role.name)} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-md transition-colors cursor-pointer">
                      {role.users} <ExternalLink size={12} />
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button onClick={() => setRolePermissionsModal(role.name)} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-600 font-bold text-xs rounded-md transition-colors cursor-pointer">
                      {role.permissions} <ExternalLink size={12} />
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 font-bold text-[11px] rounded-md">
                      {role.scope}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${role.status === 'ACTIVE' ? 'bg-[#E6F4EA] text-[#137333]' : 'bg-slate-100 text-slate-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${role.status === 'ACTIVE' ? 'bg-[#137333]' : 'bg-slate-400'}`}></div>
                      {role.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-slate-400">
                    <button className="p-1 hover:text-slate-600 transition-colors"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "users" && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F3F1EC] text-[11px] font-black text-slate-600 uppercase tracking-widest">
                <th className="py-4 px-6 w-12"><input type="checkbox" className="rounded border-slate-300" /></th>
                <th className="py-4 px-4">User Name / ID</th>
                <th className="py-4 px-4">Email</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Scope</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersData.map((user, idx) => (
                <tr key={idx} onClick={() => setSelectedUser(user)} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                  <td className="py-4 px-6" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded border-slate-300" /></td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-200 group-hover:border-modRed/30 transition-colors">
                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}${idx}`} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 group-hover:text-modRed transition-colors">{user.name}</div>
                        <div className="text-[11px] font-semibold text-slate-400 mt-0.5">EmpId: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-slate-600">{user.email}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase 
                      ${user.role === 'ADMIN' ? 'bg-red-50 text-modRed' : 
                        user.role === 'EDITOR' ? 'bg-blue-50 text-blue-600' : 
                        user.role === 'VIEWER' ? 'bg-green-50 text-green-600' : 
                        'bg-purple-50 text-purple-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs font-semibold text-slate-600">{user.scope}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${user.status === 'ACTIVE' ? 'bg-[#E6F4EA] text-[#137333]' : 'bg-slate-100 text-slate-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-[#137333]' : 'bg-slate-400'}`}></div>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-slate-400" onClick={e => e.stopPropagation()}>
                    <UserActionDropdown user={user} onViewDetails={() => setSelectedUser(user)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 bg-white">
          <span>Showing {activeTab === "roles" ? "3 of 3" : "1 to 10 of 42"}</span>
          <div className="flex items-center gap-2">
            <button className="hover:text-slate-800 transition-colors">Prev</button>
            <button className="w-6 h-6 rounded bg-modRed text-white flex items-center justify-center">1</button>
            {activeTab === "users" && (
              <>
                <span>...</span>
                <button className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center transition-colors">8</button>
              </>
            )}
            <button className="hover:text-slate-800 transition-colors">Next</button>
          </div>
        </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#FCFAF6] flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-300 rounded-2xl shadow-sm border border-slate-200 min-h-[calc(100vh-8rem)] relative">
            {/* Top right close button */}
            <button onClick={closeProfile} className="absolute top-6 right-6 p-2 rounded-full bg-white shadow-md hover:bg-slate-50 transition-colors z-10 cursor-pointer">
              <X size={20} className="text-slate-600" />
            </button>

            {/* Profile Header Block */}
            <div className="bg-gradient-to-br from-white via-white to-red-50 p-8 pb-0 border-b border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="hover:text-slate-600 cursor-pointer" onClick={closeProfile}>Users</span>
                <ChevronDown size={12} className="-rotate-90" />
                <span className="text-modRed">{selectedUser.name}</span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-200">
                      <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedUser.name}`} alt={selectedUser.name} className="w-full h-full object-cover" />
                    </div>
                    <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white ${selectedUser.status === 'ACTIVE' ? 'bg-[#137333]' : 'bg-slate-400'}`}></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedUser.name}</h2>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${selectedUser.status === 'ACTIVE' ? 'bg-[#E6F4EA] text-[#137333]' : 'bg-slate-100 text-slate-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedUser.status === 'ACTIVE' ? 'bg-[#137333]' : 'bg-slate-400'}`}></div>
                        {selectedUser.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-600 mt-1 capitalize">{selectedUser.role.toLowerCase()} (Emp ID: {selectedUser.id})</p>
                    <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                      <span className="opacity-70">✉</span> {selectedUser.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="px-5 py-2.5 bg-white border border-red-200 text-modRed rounded-md text-sm font-bold shadow-sm hover:bg-red-50 transition-colors flex items-center gap-2">
                    <RotateCcw size={16} /> Reset Password
                  </button>
                  <button className="px-5 py-2.5 bg-modRed text-white rounded-md text-sm font-bold shadow-lg shadow-modRed/20 hover:bg-red-800 transition-colors flex items-center gap-2">
                    <Plus size={16} /> Edit Profile
                  </button>
                </div>
              </div>

              {/* Profile Tabs */}
              <div className="flex space-x-8">
                <button 
                  onClick={() => setProfileTab("overview")}
                  className={`pb-4 font-bold text-[15px] transition-colors relative ${profileTab === "overview" ? "text-modRed" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Overview
                  {profileTab === "overview" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-modRed rounded-t-md"></div>}
                </button>
                <button 
                  onClick={() => setProfileTab("permissions")}
                  className={`pb-4 font-bold text-[15px] transition-colors relative ${profileTab === "permissions" ? "text-modRed" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Permissions
                  {profileTab === "permissions" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-modRed rounded-t-md"></div>}
                </button>
              </div>
            </div>

            {/* Profile Content Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                     {profileTab === "permissions" && (
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column */}
                    <div className="w-full lg:w-1/3 space-y-5">
                      {/* Role Definition */}
                      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Role Definition</h3>
                        <hr className="border-slate-100 mb-4" />
                        <p className="text-[13px] font-medium text-slate-600 leading-relaxed capitalize">
                          The <strong className="text-slate-900">{selectedUser.role.toLowerCase()}</strong> role is designed for content creators and managers. It allows users to manage digital assets, schedule deployments, and view analytics without full administrative system control.
                        </p>
                      </div>

                      {/* Effective Level */}
                      <div className="bg-[#FCF5F6] border border-red-100/50 rounded-xl p-6 shadow-sm relative">
                        <h3 className="text-[12px] font-black text-[#B02A30] uppercase tracking-widest mb-4">Effective Level</h3>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[14px] font-semibold text-slate-800">Group Inherited</span>
                          <span className="bg-[#B02A30] text-white text-[10px] font-black px-2 py-1 rounded tracking-wider">LEVEL 3</span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 mt-2">Based on MTAS-HQ Publisher Policy v2.4</p>
                      </div>

                      {/* Active Overrides */}
                      <div className="bg-[#FFF9F0] border border-orange-100/60 rounded-xl p-5 shadow-sm flex gap-3">
                        <TriangleAlert size={18} className="text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-[13px] font-bold text-[#A65B17] mb-1">Active Overrides</h3>
                          <p className="text-[11px] font-medium text-[#B86B1E] leading-relaxed">
                            This user has 2 manual overrides that differ from the group policy. These are marked with a highlight in the matrix.
                          </p>
                        </div>
                      </div>

                      {/* Request Access Change */}
                      <div className="bg-[#FAFAFA] border border-slate-300/60 border-dashed rounded-xl p-6">
                        <h3 className="text-[14px] font-bold text-slate-900 mb-2">Request Access Change</h3>
                        <p className="text-[12px] font-medium text-slate-500 leading-relaxed mb-6">
                          Submit a ticket to update this user's permissions level or add temporary overrides.
                        </p>
                        <button className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[13px] font-bold py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2">
                          <ExternalLink size={14} /> Open Request
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Access Matrix */}
                    <div className="w-full lg:w-2/3">
                      <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-[16px] font-bold text-slate-900">Access Matrix</h3>
                        <div className="flex items-center gap-4 text-[12px] font-medium">
                          <span className="flex items-center gap-1.5 text-slate-500"><div className="w-3.5 h-3.5 rounded-full bg-[#137333] text-white flex items-center justify-center"><Check size={8} strokeWidth={4} /></div> Granted</span>
                          <span className="flex items-center gap-1.5 text-slate-500"><div className="w-3.5 h-3.5 rounded-full bg-[#B02A30] text-white flex items-center justify-center"><X size={8} strokeWidth={4} /></div> Denied</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Layer 1 */}
                        <div className="bg-white border border-slate-100 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                          <div className="px-6 pt-5 pb-3">
                            <h4 className="text-[15px] font-bold text-slate-900">Layer 1: View & Navigation</h4>
                          </div>
                          
                          <hr className="mx-6 border-slate-100" />
                          
                          {/* Row 1 */}
                          <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div>
                              <div className="text-[13px] font-bold text-slate-900">Dashboard Access</div>
                              <div className="text-[12px] font-medium text-slate-500 mt-0.5">View primary analytics and summary reports</div>
                            </div>
                            <div className="w-4 h-4 rounded-full bg-[#137333] text-white flex items-center justify-center"><Check size={10} strokeWidth={4} /></div>
                          </div>
                          
                          <hr className="mx-6 border-slate-100" />
                          
                          {/* Row 2 (Override) */}
                          <div className="px-6 py-4 flex items-center justify-between bg-[#FFFCF5] hover:bg-[#FFF9EA] transition-colors">
                            <div>
                              <div className="text-[13px] font-bold text-slate-900">User Administration</div>
                              <div className="text-[12px] font-medium text-slate-500 mt-0.5">Manage account creation and password resets</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] font-bold text-orange-600 bg-orange-100/50 px-2 py-0.5 rounded uppercase tracking-wider">Override</span>
                              <div className="w-4 h-4 rounded-full bg-[#B02A30] text-white flex items-center justify-center"><X size={10} strokeWidth={4} /></div>
                            </div>
                          </div>
                          
                          <hr className="mx-6 border-slate-100" />
                          
                          {/* Row 3 */}
                          <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div>
                              <div className="text-[13px] font-bold text-slate-900">System Logs</div>
                              <div className="text-[12px] font-medium text-slate-500 mt-0.5">Access to background process logs and debug info</div>
                            </div>
                            <div className="w-4 h-4 rounded-full bg-[#B02A30] text-white flex items-center justify-center"><X size={10} strokeWidth={4} /></div>
                          </div>
                          
                          <hr className="mx-6 border-slate-100" />
                          
                          {/* Row 4 */}
                          <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div>
                              <div className="text-[13px] font-bold text-slate-900">Media Library</div>
                              <div className="text-[12px] font-medium text-slate-500 mt-0.5">Browse and view uploaded content files</div>
                            </div>
                            <div className="w-4 h-4 rounded-full bg-[#137333] text-white flex items-center justify-center"><Check size={10} strokeWidth={4} /></div>
                          </div>
                        </div>

                        {/* Layer 2 */}
                        <div className="bg-white border border-slate-100 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                          <div className="px-6 pt-5 pb-3">
                            <h4 className="text-[15px] font-bold text-slate-900">Layer 2: Functional Actions</h4>
                          </div>
                          
                          <hr className="mx-6 border-slate-100" />
                          
                          {/* Row 1 */}
                          <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div>
                              <div className="text-[13px] font-bold text-slate-900">Upload Creatives</div>
                              <div className="text-[12px] font-medium text-slate-500 mt-0.5">Create new assets and upload multimedia files</div>
                            </div>
                            <div className="w-4 h-4 rounded-full bg-[#137333] text-white flex items-center justify-center"><Check size={10} strokeWidth={4} /></div>
                          </div>
                          
                          <hr className="mx-6 border-slate-100" />
                          
                          {/* Row 2 (Override) */}
                          <div className="px-6 py-4 flex items-center justify-between bg-[#FFFCF5] hover:bg-[#FFF9EA] transition-colors">
                            <div>
                              <div className="text-[13px] font-bold text-slate-900">API Key Rotation</div>
                              <div className="text-[12px] font-medium text-slate-500 mt-0.5">Generate and rotate integration secrets</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] font-bold text-orange-600 bg-orange-100/50 px-2 py-0.5 rounded uppercase tracking-wider">Override</span>
                              <div className="w-4 h-4 rounded-full bg-[#137333] text-white flex items-center justify-center"><Check size={10} strokeWidth={4} /></div>
                            </div>
                          </div>
                          
                          <hr className="mx-6 border-slate-100" />
                          
                          {/* Row 3 */}
                          <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div>
                              <div className="text-[13px] font-bold text-slate-900">Force Deploy</div>
                              <div className="text-[12px] font-medium text-slate-500 mt-0.5">Bypass queue to push content immediately</div>
                            </div>
                            <div className="w-4 h-4 rounded-full bg-[#B02A30] text-white flex items-center justify-center"><X size={10} strokeWidth={4} /></div>
                          </div>
                          
                          <hr className="mx-6 border-slate-100" />
                          
                          {/* Row 4 */}
                          <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div>
                              <div className="text-[13px] font-bold text-slate-900">Schedule Reports</div>
                              <div className="text-[12px] font-medium text-slate-500 mt-0.5">Configure automated email delivery of data</div>
                            </div>
                            <div className="w-4 h-4 rounded-full bg-[#137333] text-white flex items-center justify-center"><Check size={10} strokeWidth={4} /></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full text-[12px] font-medium text-slate-500 flex items-center gap-2 mt-10">
                    <Lock size={14} className="opacity-60" />
                    <span>Note: Most permissions shown above are automatically inherited from the <strong className="font-bold text-slate-700 underline decoration-slate-300 underline-offset-2 capitalize">{selectedUser.role.toLowerCase()} group policy</strong>. Manual overrides are restricted to authorized administrators and require an audit trail entry.</span>
                  </div>
                </div>
              )}

              {profileTab === "overview" && (
                <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
                  {/* Left Column */}
                  <div className="w-full lg:w-[55%] space-y-6">
                    {/* General Information */}
                    <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm">
                      <h3 className="text-[15px] font-bold text-slate-900 mb-6">General Information</h3>
                      <div className="grid grid-cols-2 gap-y-6">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Campaign</div>
                          <div className="text-sm font-bold text-slate-900">Marketing</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</div>
                          <div className="text-sm font-bold text-slate-900">New York, USA</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date Added</div>
                          <div className="text-sm font-bold text-slate-900">Marketing</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Login</div>
                          <div className="text-sm font-bold text-slate-900">2 hours ago</div>
                        </div>
                      </div>
                    </div>

                    {/* Role & Access */}
                    <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[15px] font-bold text-slate-900">Role & Access</h3>
                        <button className="text-sm font-bold text-modRed hover:underline">Change Role</button>
                      </div>
                      
                      <div className="bg-[#FFF5F5] border border-red-100 rounded-md p-4 flex gap-4 mb-6">
                        <div className="w-10 h-10 rounded-md bg-modRed text-white flex items-center justify-center shrink-0">
                          <Shield size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 capitalize">{selectedUser.role.toLowerCase()}</div>
                          <div className="text-xs font-medium text-slate-500 mt-0.5">Assigned scope: {selectedUser.scope}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-900 mb-3">Effective Permissions</h4>
                        <ul className="space-y-2 mb-4">
                          <li className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                            <div className="w-4 h-4 rounded-full border border-[#137333] text-[#137333] flex items-center justify-center"><Check size={10} strokeWidth={3} /></div>
                            Create Campaigns
                          </li>
                          <li className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                            <div className="w-4 h-4 rounded-full border border-[#137333] text-[#137333] flex items-center justify-center"><Check size={10} strokeWidth={3} /></div>
                            Edit Own Content
                          </li>
                          <li className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                            <div className="w-4 h-4 rounded-full border border-[#137333] text-[#137333] flex items-center justify-center"><Check size={10} strokeWidth={3} /></div>
                            Access Analytics Dashboard
                          </li>
                        </ul>
                        <button className="text-[13px] font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                          View All 12 Permissions
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="w-full lg:w-[45%] space-y-6">
                    {/* Performance Summary */}
                    <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm">
                      <h3 className="text-[15px] font-bold text-slate-900 mb-6">Performance Summary</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                            <span>Campaigns Created</span>
                            <span className="font-bold">85/100</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full w-[85%]"></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                            <span>Ad Approval Rate</span>
                            <span className="font-bold">98%</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#137333] rounded-full w-[98%]"></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                            <span>Response Time</span>
                            <span className="font-bold">1.2h Average</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full w-[45%]"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Latest Activity */}
                    <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm">
                      <h3 className="text-[15px] font-bold text-slate-900 mb-6">Latest Activity</h3>
                      
                      <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                        {/* Event 1 */}
                        <div className="relative">
                          <div className="absolute -left-[30px] top-0.5 w-5 h-5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center ring-4 ring-white z-10">
                            <Search size={10} />
                          </div>
                          <div className="flex justify-between items-start gap-4">
                            <p className="text-[13px] font-medium text-slate-700 leading-snug">
                              Created new campaign <strong className="text-slate-900 font-bold">"Summer Sale 2024"</strong>
                            </p>
                            <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">2h ago</span>
                          </div>
                        </div>

                        {/* Event 2 */}
                        <div className="relative">
                          <div className="absolute -left-[30px] top-0.5 w-5 h-5 rounded-full bg-green-50 text-[#137333] border border-green-100 flex items-center justify-center ring-4 ring-white z-10">
                            <Check size={10} strokeWidth={3} />
                          </div>
                          <div className="flex justify-between items-start gap-4">
                            <p className="text-[13px] font-medium text-slate-700 leading-snug">
                              Ad creative approved by <strong className="text-slate-900 font-bold">Creative Lead</strong>
                            </p>
                            <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">5h ago</span>
                          </div>
                        </div>

                        {/* Event 3 */}
                        <div className="relative">
                          <div className="absolute -left-[30px] top-0.5 w-5 h-5 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-100 flex items-center justify-center ring-4 ring-white z-10">
                            <Plus size={10} strokeWidth={3} />
                          </div>
                          <div className="flex justify-between items-start gap-4">
                            <p className="text-[13px] font-medium text-slate-700 leading-snug">
                              Modified budget for <strong className="text-slate-900 font-bold">"Brand Awareness"</strong>
                            </p>
                            <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">Yesterday</span>
                          </div>
                        </div>

                        {/* Event 4 */}
                        <div className="relative">
                          <div className="absolute -left-[30px] top-0.5 w-5 h-5 rounded-full bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center ring-4 ring-white z-10">
                            <Users size={10} />
                          </div>
                          <div className="flex justify-between items-start gap-4">
                            <p className="text-[13px] font-medium text-slate-700 leading-snug">
                              Joined <strong className="text-slate-900 font-bold">"Q4 Revenue Strategy"</strong> team
                            </p>
                            <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">2 days ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>
      )}

      {/* New Modals */}
      {isAssignedScopeOpen && <AssignedScopeModal onClose={() => setIsAssignedScopeOpen(false)} />}
      {isCreateUserOpen && <CreateUserModal onClose={() => setIsCreateUserOpen(false)} onOpenScope={() => setIsAssignedScopeOpen(true)} />}
      {roleUsersModal && <RoleUsersModal roleName={roleUsersModal} onClose={() => setRoleUsersModal(null)} />}
      {isCreateRoleOpen && <CreateRoleModal onClose={() => setIsCreateRoleOpen(false)} />}
      {rolePermissionsModal && <RolePermissionsModal roleName={rolePermissionsModal} onClose={() => setRolePermissionsModal(null)} />}
    </div>
  );
}
