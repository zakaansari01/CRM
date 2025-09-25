import React, { useEffect, useState } from "react";
import { User, Briefcase, Menu, Plus, Users, Building, Settings, Shield, TrendingUp, Clock, Activity, Zap, Eye } from "lucide-react";

const DashboardHome = () => {
  const [userName, setUserName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [menuCount, setMenuCount] = useState(0);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user?.name || "");
        setDepartmentName(user?.departmentName || "");
        setUserEmail(user?.email || "");
        setMenuCount(user?.menulist?.length || 0);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  return (
    <div className="space-y-8 relative">
      {/* Dynamic background with floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Hero Welcome Section */}
      <div className="relative bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 overflow-hidden group">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 transform group-hover:scale-105 transition-transform duration-1000"></div>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center">
          {/* Dynamic icon with glow effect */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="relative w-24 h-24 bg-gradient-to-r from-slate-700 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-12 h-12 text-white drop-shadow-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          
          <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent mb-4 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-500">
            Welcome back, {userName}!
          </h2>
          
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-200/50 mb-4">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-semibold text-slate-700">
              {departmentName} Division
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          
         

          {/* Interactive stats bar */}
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-green-700 font-medium">System Active</span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium">Session: 2h 15m</span>
            </div>
            <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full">
              <Eye className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700 font-medium">Secure Access</span>
            </div>
          </div>
        </div>

        
      </div>

      {/* Dynamic Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Profile Card */}
        <div className="relative bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold tracking-wide">
                ACTIVE
              </div>
            </div>
            
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">User Profile</h3>
            <p className="text-2xl font-bold text-slate-800 mb-1">{userName}</p>
            <p className="text-slate-600 text-sm mb-6 truncate">{userEmail}</p>
            
            
          </div>
        </div>

        {/* Department Card */}
        <div className="relative bg-gradient-to-br from-white/90 to-green-50/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-colors duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600 text-xs font-bold">HIGH</span>
              </div>
            </div>
            
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Department</h3>
            <p className="text-2xl font-bold text-slate-800 mb-1">{departmentName}</p>
            <p className="text-slate-600 text-sm mb-6">Lead Administrator</p>
            
            
          </div>
        </div>

        {/* Menu Access Card */}
        <div className="relative bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-colors duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Menu className="w-8 h-8 text-white" />
              </div>
              <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                FULL ACCESS
              </div>
            </div>
            
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">System Access</h3>
            <p className="text-2xl font-bold text-slate-800 mb-1">{menuCount} Modules</p>
            <p className="text-slate-600 text-sm mb-6">Available Resources</p>
            
            
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="relative bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-600/5 to-blue-600/5"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">Quick Actions</h3>
              <p className="text-slate-600 text-lg">Streamlined access to essential tools</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-slate-700 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
              <Settings className="w-8 h-8 text-white animate-spin" style={{animationDuration: '8s'}} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Plus, label: 'Add Menu', color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
              { icon: Users, label: 'Manage Users', color: 'green', gradient: 'from-green-500 to-emerald-500' },
              { icon: Building, label: 'Company Settings', color: 'purple', gradient: 'from-purple-500 to-pink-500' },
              { icon: Settings, label: 'System Config', color: 'slate', gradient: 'from-slate-500 to-blue-500' }
            ].map((action, index) => (
              <div
                key={action.label}
                className="group relative bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-8 cursor-pointer hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Dynamic background effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <div className="absolute -top-8 -right-8 w-20 h-20 bg-current opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" style={{color: action.color === 'blue' ? '#3b82f6' : action.color === 'green' ? '#10b981' : action.color === 'purple' ? '#8b5cf6' : '#64748b'}}></div>
                
                <div className="relative z-10 text-center">
                  {/* Icon with glow effect */}
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500`}></div>
                    <div className={`relative w-16 h-16 bg-gradient-to-r ${action.gradient} rounded-2xl mx-auto flex items-center justify-center shadow-lg group-hover:scale-125 group-hover:rotate-6 transition-all duration-500`}>
                      <action.icon className="w-8 h-8 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  
                  <p className="text-slate-700 font-semibold text-lg group-hover:text-slate-900 transition-colors duration-300">
                    {action.label}
                  </p>
                  
                  {/* Hover indicator */}
                  <div className="mt-4 w-full h-1 bg-slate-200 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`h-full bg-gradient-to-r ${action.gradient} rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Activity */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold text-slate-800">Live Activity Feed</h4>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Live</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { type: 'login', message: 'Secure authentication completed', time: '2 min ago', color: 'blue' },
              { type: 'update', message: 'System preferences synchronized', time: '1 hour ago', color: 'green' },
              { type: 'security', message: 'Security scan completed successfully', time: '2 hours ago', color: 'purple' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-white/60 rounded-xl border border-white/30 hover:bg-white/80 transition-colors duration-300">
                <div className={`w-3 h-3 rounded-full ${activity.color === 'blue' ? 'bg-blue-500' : activity.color === 'green' ? 'bg-green-500' : 'bg-purple-500'} animate-pulse`}></div>
                <div className="flex-1">
                  <p className="text-slate-700 font-medium">{activity.message}</p>
                  <p className="text-slate-500 text-sm">{activity.time}</p>
                </div>
                <Activity className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-gradient-to-br from-white/90 to-green-50/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
          <h4 className="text-xl font-bold text-slate-800 mb-6">System Health</h4>
          
          <div className="space-y-6">
            {[
              { name: 'Database', status: 'Optimal', value: 98, color: 'green' },
              { name: 'API Services', status: 'Running', value: 100, color: 'blue' },
              { name: 'Security', status: 'Protected', value: 95, color: 'purple' }
            ].map((metric, index) => (
              <div key={metric.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-700 font-medium">{metric.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    metric.color === 'green' ? 'bg-green-100 text-green-700' :
                    metric.color === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {metric.status}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      metric.color === 'green' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                      metric.color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-purple-400 to-purple-600'
                    }`}
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs text-slate-500 mt-1">{metric.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;