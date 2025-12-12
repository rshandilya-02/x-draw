import React from 'react';
import {
  Github,
  ArrowRight,
  PenTool,
  Zap,
  Lock,
  Share2,
  Code,
  Layers,
  Download,
  Twitter,
  Linkedin
} from 'lucide-react';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-emerald-500/30">

      {/* ==================== ORIGINAL HEADER & HERO ==================== */}

      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <PenTool className="w-5 h-5 text-emerald-500" />
            <span>X-Draw</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <a href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
              <Github className="w-4 h-4" /> <span className="hidden sm:inline">GitHub</span>
            </a>
            <Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link
              href="/auth/register"
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md transition-all border border-zinc-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-20 pb-16 lg:pt-32 flex flex-col lg:flex-row items-center gap-16 border-b border-zinc-800/50">
        {/* Left Content */}
        <div className="lg:w-1/2 space-y-8">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Draw ideas from <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              mind to canvas.
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-md leading-relaxed">
            Open source virtual whiteboard. Sketch diagrams, share ideas, and collaborate in real-time. Minimalist by design.
          </p>

          <div className="flex items-center gap-4">
            <button className="group bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20">
              Start Drawing Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Visual */}
        <div className="lg:w-1/2 w-full">
          <div className="relative rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden group hover:border-zinc-700 transition-colors">
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border-b border-zinc-800">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-800 border border-red-300/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-500/50"></div>
              </div>
              <div className="text-xs text-gray-500 font-mono">canvas — active</div>
              <div className="w-10"></div>
            </div>
            <div className="p-6 font-mono text-sm space-y-4 min-h-[300px] flex flex-col justify-center">
              <div className="flex gap-2">
                <span className="text-emerald-500">➜</span>
                <span className="text-blue-400">~</span>
                <span className="text-gray-300">initializing whiteboard...</span>
              </div>
              <div className="flex gap-2">
                <span className="text-emerald-500">✔</span>
                <span className="text-gray-400">Tools loaded: </span>
                <span className="text-emerald-400">Rect, Circle, Arrow, Scribble</span>
              </div>
              <div className="flex gap-2">
                <span className="text-emerald-500">✔</span>
                <span className="text-gray-400">Connection established: </span>
                <span className="text-emerald-400">ws://canvas-room-882</span>
              </div>
              <div className="pt-4 animate-pulse flex gap-2 items-center">
                <span className="text-emerald-500">➜</span>
                <span className="h-5 w-2 bg-emerald-500"></span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ==================== NEW SECTIONS ADDED BELOW ==================== */}

      {/* 1. Social Proof / Logos */}
      <section className="py-10 border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-sm font-mono text-zinc-500 mb-6">TRUSTED BY DEVELOPERS AT</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
            {['ACME Corp', 'Stark Ind', 'Wayne Ent', 'Cyberdyne', 'Massive Dynamic'].map((company) => (
              <span key={company} className="text-xl font-bold text-zinc-400">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Features Grid */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Everything you need, nothing you don't.</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We stripped away the bloat to focus on the raw speed of ideation.
            Built for developers who prefer keyboard shortcuts over clicking menus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-emerald-500" />}
            title="Lightning Fast"
            desc="Zero lag. 60fps rendering. Optimized for large diagrams and complex system architectures."
          />
          <FeatureCard
            icon={<Share2 className="w-6 h-6 text-emerald-500" />}
            title="Real-time Collab"
            desc="Share a link and code together. Multiplayer cursor support allows you to see who is drawing what."
          />
          <FeatureCard
            icon={<Lock className="w-6 h-6 text-emerald-500" />}
            title="End-to-End Encrypted"
            desc="Your ideas are yours. Canvases are encrypted locally before being sent to the server."
          />
          <FeatureCard
            icon={<Code className="w-6 h-6 text-emerald-500" />}
            title="Export to Code"
            desc="Convert diagrams directly into SVG, PNG, or even React components for your documentation."
          />
          <FeatureCard
            icon={<Layers className="w-6 h-6 text-emerald-500" />}
            title="Infinite Canvas"
            desc="Never run out of space. The canvas grows with your ideas. Pan and zoom without limits."
          />
          <FeatureCard
            icon={<Download className="w-6 h-6 text-emerald-500" />}
            title="Local-First"
            desc="Works offline. Your drawings are saved to your browser automatically. Sync when you're back online."
          />
        </div>
      </section>

      {/* 3. "Code to Canvas" Section (Visual Break) */}
      <section className="py-24 bg-zinc-900/30 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-mono mb-4 border border-emerald-500/20">
              DEVELOPER API
            </div>
            <h2 className="text-3xl font-bold text-white mb-6">Programmatic Drawing</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Don't just draw with your mouse. Use our robust API to generate diagrams from your codebase, database schemas, or infrastructure definitions.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                JSON-based scene data
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                Automated architecture maps
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                Custom UI libraries
              </li>
            </ul>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="bg-[#050505] rounded-lg border border-zinc-800 p-6 font-mono text-xs overflow-hidden shadow-2xl">
              <div className="text-emerald-500 mb-2">// Scene Data Example</div>
              <div className="text-zinc-500">
                {`{`}
                <br />&nbsp;&nbsp;<span className="text-purple-400">"type"</span>: <span className="text-yellow-200">"rectangle"</span>,
                <br />&nbsp;&nbsp;<span className="text-purple-400">"x"</span>: 100,
                <br />&nbsp;&nbsp;<span className="text-purple-400">"y"</span>: 240,
                <br />&nbsp;&nbsp;<span className="text-purple-400">"width"</span>: 120,
                <br />&nbsp;&nbsp;<span className="text-purple-400">"backgroundColor"</span>: <span className="text-yellow-200">"#10b981"</span>,
                <br />&nbsp;&nbsp;<span className="text-purple-400">"fillStyle"</span>: <span className="text-yellow-200">"hachure"</span>
                <br />{`}`}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Simple Testimonials */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <h2 className="text-3xl font-bold text-center text-white mb-16">Community Love</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard
            quote="The minimalist interface allows me to focus purely on the system design. Best whiteboard tool hands down."
            author="Alex D."
            role="Senior Architect"
          />
          <TestimonialCard
            quote="I use X-Draw to sketch out React component hierarchies. The dark mode is easy on the eyes."
            author="Sarah J."
            role="Frontend Dev"
          />
          <TestimonialCard
            quote="Finally, a drawing tool that feels like a code editor. Fast, keyboard-centric, and hackable."
            author="Mike T."
            role="Backend Lead"
          />
        </div>
      </section>

      {/* 5. Bottom CTA */}
      <section className="py-20 text-center px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-b from-zinc-900 to-transparent p-12 rounded-3xl border border-zinc-800">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to visualize your architecture?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join thousands of developers sketching their next big idea.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg shadow-emerald-900/20">
              Get Started for Free
            </button>
            <button className="bg-transparent hover:bg-zinc-800 text-white border border-zinc-700 px-8 py-3 rounded-lg font-medium transition-all">
              Read Documentation
            </button>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="border-t border-zinc-900 bg-[#050505] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <PenTool className="w-5 h-5 text-emerald-500" />
              <span>X-Draw</span>
            </div>
            <p className="text-zinc-500 text-sm">
              The open-source whiteboard for developers. <br />
              © 2024 X-Draw Inc.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li className="hover:text-emerald-400 cursor-pointer">Features</li>
              <li className="hover:text-emerald-400 cursor-pointer">Integrations</li>
              <li className="hover:text-emerald-400 cursor-pointer">Pricing</li>
              <li className="hover:text-emerald-400 cursor-pointer">Changelog</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li className="hover:text-emerald-400 cursor-pointer">Documentation</li>
              <li className="hover:text-emerald-400 cursor-pointer">API Reference</li>
              <li className="hover:text-emerald-400 cursor-pointer">Community</li>
              <li className="hover:text-emerald-400 cursor-pointer">Help Center</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li className="hover:text-emerald-400 cursor-pointer">Privacy Policy</li>
              <li className="hover:text-emerald-400 cursor-pointer">Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center border-t border-zinc-900 pt-8">
          <div className="flex gap-6 text-zinc-600">
            <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <Github className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <Linkedin className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper Components for cleaner code
const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-800 hover:border-emerald-500/30 hover:bg-zinc-900/40 transition-all group">
    <div className="mb-4 bg-zinc-900 p-3 rounded-lg w-fit group-hover:bg-emerald-500/10 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const TestimonialCard = ({ quote, author, role }) => (
  <div className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-800 flex flex-col justify-between">
    <p className="text-gray-300 italic mb-6">"{quote}"</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600"></div>
      <div>
        <div className="text-white font-bold text-sm">{author}</div>
        <div className="text-emerald-500 text-xs">{role}</div>
      </div>
    </div>
  </div>
);

export default Home;