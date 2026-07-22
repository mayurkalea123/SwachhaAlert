import { Link } from 'react-router-dom';
import { Leaf, Bot, Truck, MapPin, BarChart3, Shield, Zap, ChevronRight, CheckCircle, Clock, Users } from 'lucide-react';
import heroImg from '@/assets/hero-bg.jpg';

export default function Landing() {
  const stats = [
    { label: 'Reports Resolved', value: '12,400+', icon: CheckCircle, color: 'text-emerald-400' },
    { label: 'AI Dispatches',    value: '2,100+',  icon: Bot,          color: 'text-blue-400' },
    { label: 'Active Cities',    value: '18',       icon: MapPin,       color: 'text-amber-400' },
    { label: 'Avg Response',     value: '23 min',   icon: Clock,        color: 'text-purple-400' },
  ];

  const features = [
    { icon: Bot,       title: 'AI-Powered Auto Dispatch',    desc: 'When 5+ reports arrive from the same location during daytime, our AI automatically dispatches the nearest truck — zero human intervention needed.', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { icon: MapPin,    title: 'Precise Location Tracking',   desc: 'Report garbage with exact ward and area tagging. Our system clusters reports to identify hotspots in real time.', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { icon: BarChart3, title: 'Live Admin Dashboard',        desc: "Admins get a bird's-eye view of all reports, dispatch activity, ward-wise stats, and resolution trends — updated live.", color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { icon: Users,     title: 'Community Upvoting',          desc: 'Citizens can upvote reports they agree with, boosting priority and helping admins focus on the most critical issues.', color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { icon: Truck,     title: 'Truck Tracking',              desc: 'After dispatch, track your assigned garbage truck. Know when it will arrive and get notified upon collection.', color: 'bg-rose-50 text-rose-600 border-rose-200' },
    { icon: Shield,    title: 'Daytime-Only Dispatch',       desc: 'AI dispatches only between 6 AM and 9 PM for safety. Night reports are queued and prioritized at 6 AM the next morning.', color: 'bg-green-50 text-green-600 border-green-200' },
  ];

  const steps = [
    { step: '01', title: 'Spot Garbage',   desc: 'See a garbage pile? Open SwachhaAlert and tap "Report Garbage".' },
    { step: '02', title: 'File a Report',  desc: 'Select waste type, describe the issue, add your location and optionally a photo.' },
    { step: '03', title: 'AI Monitors',    desc: 'Our AI tracks reports per location. When the threshold is hit, dispatch is automatic.' },
    { step: '04', title: 'Truck Arrives',  desc: 'A garbage truck is dispatched and you receive live updates until resolved.' },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Smart city" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-hero opacity-92" />
        </div>

        {/* Decorative rings */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white/5" style={{
              width:  `${100 + i * 70}px`,
              height: `${100 + i * 70}px`,
              top:    `${8 + i * 12}%`,
              left:   `${4 + i * 13}%`,
              animation: `pulseRing ${3.5 + i * 0.5}s ease-out infinite ${i * 0.6}s`,
            }} />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-200 font-semibold">AI-Powered Civic Waste Management</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
              Keep Our City<br />
              <span className="text-emerald-400">Swachh</span> &amp; Smart
            </h1>
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed max-w-xl">
              Report garbage in seconds. When <strong className="text-white">5+ complaints</strong> arrive from the same spot, our AI <strong className="text-white">automatically dispatches a garbage truck</strong>. No calls. No waiting.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl text-lg transition-all hover:scale-105 shadow-xl hover:shadow-emerald-500/40"
              >
                Report Garbage Now
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl text-lg transition-all border border-white/30 backdrop-blur-sm"
              >
                Sign In
              </Link>
            </div>

            {/* Demo credentials */}
            <div className="mt-7 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-4 inline-block">
              <p className="text-emerald-300 text-xs font-bold mb-1.5 uppercase tracking-wide">Demo Credentials</p>
              <div className="text-xs text-white/80 space-y-1">
                <p>👤 Citizen: <code className="text-emerald-300 font-mono">arjun@example.com</code> / <code className="text-emerald-300 font-mono">citizen123</code></p>
                <p>🛡 Admin: <code className="text-emerald-300 font-mono">admin@swachha.gov.in</code> / <code className="text-emerald-300 font-mono">admin123</code></p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating stats — desktop */}
        <div className="absolute bottom-10 right-8 hidden lg:flex gap-3">
          {stats.map(s => (
            <div key={s.label} className="glass-dark rounded-2xl px-4 py-3 text-center min-w-[100px]">
              <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-1`} />
              <p className="text-white font-bold text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>{s.value}</p>
              <p className="text-white/50 text-[10px] leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">Simple Process</span>
            <h2 className="text-4xl font-bold text-foreground mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>How SwachhaAlert Works</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">From report to resolution — powered by AI, built for citizens.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-emerald-300 to-transparent" />
                )}
                <div className="text-center">
                  <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-extrabold text-white/40">{step.step}</span>
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Intelligence Section ── */}
      <section className="py-24 bg-gradient-to-br from-emerald-950 to-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-800 text-emerald-300 rounded-full text-sm font-semibold mb-6">
                <Bot className="w-4 h-4" />AI Intelligence
              </span>
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
                The AI That Never Sleeps<br /><span className="text-emerald-400">(Well, Almost)</span>
              </h2>
              <p className="text-emerald-200 text-lg mb-6 leading-relaxed">
                Our AI engine continuously monitors incoming reports grouped by ward and area. The moment a location hits 5+ active reports, it automatically:
              </p>
              <ul className="space-y-3">
                {[
                  'Identifies the nearest available garbage truck',
                  'Calculates optimal route to the location',
                  'Dispatches truck with driver assignment',
                  'Notifies all reporters in real time',
                  'Updates all report statuses to "Dispatched"',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-emerald-100 text-sm">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-emerald-800/50 border border-emerald-700 rounded-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-300 font-semibold text-sm">Daytime Only Policy</span>
                </div>
                <p className="text-emerald-300 text-sm">Automated dispatch operates <strong className="text-white">6:00 AM – 9:00 PM</strong> only. Night reports are queued and prioritized at 6 AM for safe operations.</p>
              </div>
            </div>

            {/* Visual */}
            <div className="bg-emerald-900/50 border border-emerald-700 rounded-3xl p-6">
              <p className="text-emerald-400 text-sm font-semibold mb-3 text-center">Koramangala 5th Block</p>
              <div className="flex justify-center gap-2 mb-5">
                {[1,2,3,4,5].map(n => (
                  <div key={n} className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border-2 bg-red-500/20 border-red-500 text-red-300">
                    {n}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center mb-5">
                <div className="relative">
                  <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center ai-glow">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-emerald-500 rounded-2xl pulse-ring" />
                </div>
              </div>
              <div className="space-y-2.5">
                {['Truck KA-01-GV-3421 assigned', 'Driver: Ramesh Kumar', 'ETA: 18 minutes', 'Status: En Route ✓'].map(item => (
                  <div key={item} className="flex items-center gap-3 bg-emerald-800/50 rounded-xl px-3 py-2.5">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0" />
                    <span className="text-emerald-200 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">Platform Features</span>
            <h2 className="text-4xl font-bold text-foreground mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>Everything You Need</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className={`bg-white border rounded-2xl p-6 hover:shadow-lg transition-shadow ${f.color.split(' ')[2]}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${f.color.split(' ').slice(0, 2).join(' ')}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 gradient-brand">
        <div className="max-w-3xl mx-auto text-center px-4">
          <Leaf className="w-12 h-12 text-white/80 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>Ready to Make a Difference?</h2>
          <p className="text-emerald-100 text-lg mb-8">Join thousands of citizens keeping their neighbourhoods clean.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-800 font-bold rounded-2xl hover:bg-emerald-50 transition-all shadow-xl text-lg"
          >
            Join SwachhaAlert Free
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-foreground py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>SwachhaAlert</span>
          </div>
          <p className="text-white/40 text-sm">© 2026 SwachhaAlert · Smart Waste Management for Smart Cities.</p>
        </div>
      </footer>
    </div>
  );
}
