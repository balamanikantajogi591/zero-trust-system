import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  MapPin, 
  Smartphone, 
  Monitor,
  Zap
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis 
} from 'recharts';

const lineData = [
  { name: '01 May', attacks: 400, blocked: 380 },
  { name: '02 May', attacks: 300, blocked: 290 },
  { name: '03 May', attacks: 600, blocked: 550 },
  { name: '04 May', attacks: 800, blocked: 780 },
  { name: '05 May', attacks: 500, blocked: 495 },
  { name: '06 May', attacks: 900, blocked: 880 },
];

const radarData = [
  { subject: 'Brute Force', A: 120, fullMark: 150 },
  { subject: 'Phishing', A: 98, fullMark: 150 },
  { subject: 'SQLi', A: 86, fullMark: 150 },
  { subject: 'DDoS', A: 99, fullMark: 150 },
  { subject: 'Injections', A: 85, fullMark: 150 },
  { subject: 'Malware', A: 65, fullMark: 150 },
];

const Analytics = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold neon-text mb-2">Security Analytics</h1>
          <p className="text-gray-500">Comprehensive insights into global attack vectors and user behavior</p>
        </div>
        <div className="flex gap-4">
          <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-400 focus:outline-none focus:border-primary/50">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last 24 Hours</option>
          </select>
          <button className="bg-primary hover:bg-primary/80 px-6 py-2 rounded-xl text-sm font-semibold transition-all shadow-glow">
            Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attack Trends */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Attack Prevention Trends
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121214', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Line type="monotone" dataKey="attacks" stroke="#f43f5e" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="blocked" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vector Distribution */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Attack Vectors
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#ffffff10" />
                <PolarAngleAxis dataKey="subject" stroke="#6b7280" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="none" />
                <Radar name="Threats" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121214', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Geo Insights */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Top Access Locations
          </h2>
          <div className="space-y-4">
            {[
              { city: 'New York, USA', count: '4,281', trend: '+12%', icon: MapPin },
              { city: 'London, UK', count: '2,904', trend: '+5%', icon: MapPin },
              { city: 'Berlin, Germany', count: '1,842', trend: '-2%', icon: MapPin },
              { city: 'Tokyo, Japan', count: '1,204', trend: '+18%', icon: MapPin },
            ].map((loc, i) => (
              <div key={i} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl transition-all">
                <div className="flex items-center gap-3">
                  <loc.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{loc.city}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold">{loc.count}</span>
                  <span className={`text-xs font-bold ${loc.trend.includes('+') ? 'text-secondary' : 'text-accent'}`}>
                    {loc.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-primary" />
            Device Intelligence
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                <div className="flex items-center gap-2">
                  <Monitor className="w-3 h-3" /> Desktop (MacOS/Windows)
                </div>
                <span>72%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[72%] shadow-glow"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-3 h-3" /> Mobile (iOS/Android)
                </div>
                <span>24%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[24%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                <div className="flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Other / Unknown
                </div>
                <span>4%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[4%]"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-xs text-gray-400 italic">
              "System identifies a 15% increase in mobile access from non-verified devices this week."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
