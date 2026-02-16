<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { 
    Github, ArrowRight, Terminal, Cpu, Activity, Zap, 
    ShieldCheck, CheckCircle2, Layers, Code2, 
    Database, Lock, Rocket, XCircle, FileCode, GitFork
  } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  
  let mounted = $state(false);

  onMount(() => {
    mounted = true;
  });

  // Smooth scroll to section
  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  function handleAction() {
      goto('/signup');
  }
</script>

<div class="relative w-full h-full overflow-y-auto overflow-x-hidden bg-zinc-950 scroll-smooth selection:bg-indigo-500/30">
  
  <!-- Navigation (Sticky) -->
  <nav class="sticky top-0 z-50 w-full px-6 py-4 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 flex items-center justify-between">
    <div class="flex items-center gap-3">
       <div class="w-3 h-3 bg-white rotate-45"></div>
       <span class="font-bold text-zinc-100 tracking-wide text-sm">Keystone</span>
    </div>
    <div class="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
        <button onclick={() => scrollTo('architecture')} class="hover:text-white transition-colors">Architecture</button>
        <button onclick={() => scrollTo('philosophy')} class="hover:text-white transition-colors">Philosophy</button>
        <button onclick={() => scrollTo('pricing')} class="hover:text-white transition-colors">Pricing</button>
    </div>
    <button 
        onclick={handleAction}
        class="hidden md:flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-100 text-zinc-950 text-xs font-bold hover:bg-white hover:shadow-lg transition-all"
    >
        <Github size={14} />
        <span>Connect GitHub</span>
    </button>
  </nav>

  <!-- 🏆 HERO SECTION -->
  <section class="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 pt-20 pb-32">
    
    <!-- Status Badge -->
    <div 
        in:fly={{ y: 20, duration: 800, delay: 200, easing: cubicOut }}
        class="mb-8 flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800"
    >
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span class="text-xs font-medium text-zinc-400">v1.0.4 Stable Release</span>
    </div>

    <!-- Main Title -->
    <h1 class="text-5xl md:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.1] relative z-10">
        Production-Ready<br/>
        <span class="relative inline-block">
            <span class="text-[#ff3e00]">SvelteKit</span>
            <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[100px] md:text-[140px] font-black text-[#ff3e00] opacity-10 -z-10 pointer-events-none select-none leading-none">5</span>
        </span>
        <span class="text-blue-500">Blueprints.</span>
    </h1>

    <p class="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
        Stop stitching together half-baked templates. Get a complete, opinionated, and type-safe foundation for your next SaaS.
    </p>

    <div class="flex flex-col items-center gap-4 mb-16">
        <button 
            onclick={handleAction}
            class="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-semibold text-lg rounded-md hover:bg-zinc-200 transition-all duration-200"
        >
            <Terminal size={20} />
            <span>Generate Blueprint</span>
            <ArrowRight size={20} class="group-hover:translate-x-1 transition-transform" />
        </button>
        <div class="flex items-center gap-6 text-sm text-zinc-500">
            <span class="flex items-center gap-2"><CheckCircle2 size={14} class="text-emerald-500" /> You own the code</span>
            <span class="flex items-center gap-2"><CheckCircle2 size={14} class="text-emerald-500" /> No lock-in</span>
            <span class="flex items-center gap-2"><CheckCircle2 size={14} class="text-emerald-500" /> MIT License</span>
        </div>
    </div>

    <!-- Terminal Preview (Trust Signal) -->
    <div class="w-full max-w-3xl mx-auto bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 shadow-2xl text-left">
        <div class="px-4 py-2 border-b border-zinc-800 bg-zinc-900 flex items-center gap-2">
            <div class="flex gap-1.5">
                <div class="w-3 h-3 rounded-full bg-zinc-700"></div>
                <div class="w-3 h-3 rounded-full bg-zinc-700"></div>
                <div class="w-3 h-3 rounded-full bg-zinc-700"></div>
            </div>
            <span class="text-xs text-zinc-500 font-mono ml-2">preview — -zsh</span>
        </div>
        <div class="p-4 font-mono text-xs md:text-sm leading-6 text-zinc-400">
            <p><span class="text-green-400">➜</span> <span class="text-white">tree src/lib</span></p>
            <p class="text-zinc-500">├── auth.ts <span class="text-zinc-600">// BetterAuth configuration</span></p>
            <p class="text-zinc-500">├── convex/ <span class="text-zinc-600">// Real-time backend</span></p>
            <p class="text-zinc-500">│   ├── schema.ts</p>
            <p class="text-zinc-500">│   └── users.ts</p>
            <p class="text-zinc-500">└── components/ <span class="text-zinc-600">// Shadcn-Svelte UI</span></p>
            <p class="text-zinc-500">&nbsp;&nbsp;&nbsp;&nbsp;├── ui/</p>
            <p class="text-zinc-500">&nbsp;&nbsp;&nbsp;&nbsp;└── marketing/</p>
        </div>
    </div>
  </section>

  <!-- 🏗️ ARCHITECTURE SECTION -->
  <section id="architecture" class="py-24 px-6 border-t border-zinc-900 bg-zinc-950">
    <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
            <h2 class="text-sm font-semibold text-indigo-400 uppercase tracking-wide mb-3">The Stack</h2>
            <h3 class="text-3xl md:text-4xl font-bold text-white mb-4">Opinionated for Speed</h3>
            <p class="text-zinc-400 max-w-2xl mx-auto">We made the hard choices so you can focus on your product logic.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="p-8 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div class="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-6">
                    <Layers class="text-white" size={20} />
                </div>
                <h4 class="text-lg font-bold text-white mb-2">SvelteKit 5</h4>
                <p class="text-sm text-zinc-400 leading-relaxed">
                    Built on the latest Runes API. Fine-grained reactivity, zero-config SSR, and type-safety from end to end.
                </p>
            </div>

            <!-- Feature 2 -->
            <div class="p-8 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div class="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-6">
                    <Database class="text-white" size={20} />
                </div>
                <h4 class="text-lg font-bold text-white mb-2">Convex</h4>
                <p class="text-sm text-zinc-400 leading-relaxed">
                    Real-time database that acts as your backend. Functions run at the edge. Automatic caching and subscription updates.
                </p>
            </div>

            <!-- Feature 3 -->
            <div class="p-8 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div class="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-6">
                    <ShieldCheck class="text-white" size={20} />
                </div>
                <h4 class="text-lg font-bold text-white mb-2">Better Auth</h4>
                <p class="text-sm text-zinc-400 leading-relaxed">
                    Secure, self-hostable authentication. pre-configured with GitHub OAuth, Email/Password, and Session management.
                </p>
            </div>
        </div>
    </div>
  </section>

  <!-- 💡 PHILOSOPHY SECTION -->
  <section id="philosophy" class="py-24 px-6 border-t border-zinc-900 bg-zinc-900/20">
    <div class="max-w-4xl mx-auto">
        <div class="flex flex-col md:flex-row gap-12 items-start">
            <div class="flex-1">
                <h3 class="text-2xl font-bold text-white mb-6">Why Keystone?</h3>
                <div class="space-y-8">
                    <div class="flex gap-4">
                        <div class="mt-1"><GitFork class="text-zinc-500" size={20} /></div>
                        <div>
                            <h4 class="font-bold text-zinc-200 mb-2">It's a Repo, Not a Platform</h4>
                            <p class="text-sm text-zinc-400">
                                When you initialize Keystone, you get a clean git repository. You can deploy it to Vercel, Netlify, or a VPS. We don't host your code.
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <div class="mt-1"><FileCode class="text-zinc-500" size={20} /></div>
                        <div>
                            <h4 class="font-bold text-zinc-200 mb-2">Code You Can Read</h4>
                            <p class="text-sm text-zinc-400">
                                No hidden npm packages with black-box logic. All business logic sits in your `src` folder. If you don't like a part, change it.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-6">
                <h4 class="text-sm font-mono text-zinc-500 uppercase tracking-wide mb-4">The "Anti-Boilerplate" Promise</h4>
                <ul class="space-y-4">
                    <li class="flex items-center gap-3 text-sm text-zinc-300">
                        <CheckCircle2 size={16} class="text-indigo-400" />
                        <span>No proprietary CLI lock-in</span>
                    </li>
                    <li class="flex items-center gap-3 text-sm text-zinc-300">
                        <CheckCircle2 size={16} class="text-indigo-400" />
                        <span>Standard TypeScript & Tailwind</span>
                    </li>
                    <li class="flex items-center gap-3 text-sm text-zinc-300">
                        <CheckCircle2 size={16} class="text-indigo-400" />
                        <span>0 runtime dependencies on us</span>
                    </li>
                    <li class="flex items-center gap-3 text-sm text-zinc-300">
                        <CheckCircle2 size={16} class="text-indigo-400" />
                        <span>You own your data</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  </section>

  <!-- 💰 PRICING SECTION -->
  <section id="pricing" class="py-24 px-6 border-t border-zinc-900 bg-zinc-950">
    <div class="max-w-5xl mx-auto">
        <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-white mb-4">Simple Pricing</h2>
            <p class="text-zinc-400">The code is yours forever. Updates are optional.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            <!-- FREE TIER -->
            <div class="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40">
                <h4 class="font-bold text-white mb-2">Community</h4>
                <div class="text-3xl font-bold text-zinc-100 mb-4">$0</div>
                <p class="text-sm text-zinc-500 mb-6 pb-6 border-b border-zinc-800">
                    Open source core. Perfect for hobby projects.
                </p>
                <ul class="space-y-3 mb-8 text-sm text-zinc-400">
                    <li class="flex items-center gap-2"><CheckCircle2 size={14} /> Basic Archetypes</li>
                    <li class="flex items-center gap-2"><CheckCircle2 size={14} /> Community Support</li>
                    <li class="flex items-center gap-2"><CheckCircle2 size={14} /> MIT License</li>
                </ul>
                <button onclick={handleAction} class="w-full py-2.5 rounded border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-800 hover:text-white transition-colors">Start Free</button>
            </div>

            <!-- PRO TIER -->
            <div class="p-6 rounded-xl border border-zinc-700 bg-zinc-900 relative">
                <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white text-black text-[10px] font-bold uppercase tracking-wider rounded-full">One-time</div>
                <h4 class="font-bold text-white mb-2">Pro License</h4>
                <div class="text-3xl font-bold text-white mb-4">$149</div>
                <p class="text-sm text-zinc-400 mb-6 pb-6 border-b border-zinc-800">
                    Lifetime access to all premium archetypes.
                </p>
                <ul class="space-y-3 mb-8 text-sm text-zinc-300">
                    <li class="flex items-center gap-2"><CheckCircle2 size={14} class="text-indigo-400" /> All Archetypes (B2B, SaaS)</li>
                    <li class="flex items-center gap-2"><CheckCircle2 size={14} class="text-indigo-400" /> Lifetime Updates</li>
                    <li class="flex items-center gap-2"><CheckCircle2 size={14} class="text-indigo-400" /> Private Discord Access</li>
                    <li class="flex items-center gap-2"><CheckCircle2 size={14} class="text-indigo-400" /> Commercial Use</li>
                </ul>
                <button onclick={handleAction} class="w-full py-2.5 rounded bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-colors">Buy License</button>
            </div>

             <!-- TEAM TIER -->
            <div class="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40">
                <h4 class="font-bold text-white mb-2">Agency</h4>
                <div class="text-3xl font-bold text-zinc-100 mb-4">$499</div>
                <p class="text-sm text-zinc-500 mb-6 pb-6 border-b border-zinc-800">
                    For teams shipping multiple products.
                </p>
                <ul class="space-y-3 mb-8 text-sm text-zinc-400">
                    <li class="flex items-center gap-2"><CheckCircle2 size={14} /> Unlimited Projects</li>
                    <li class="flex items-center gap-2"><CheckCircle2 size={14} /> Priority Support</li>
                    <li class="flex items-center gap-2"><CheckCircle2 size={14} /> Custom Integrations</li>
                </ul>
                <button onclick={handleAction} class="w-full py-2.5 rounded border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-800 hover:text-white transition-colors">Contact Sales</button>
            </div>

        </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-12 px-6 border-t border-zinc-900 text-center md:text-left bg-black">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-2">
           <div class="w-3 h-3 bg-white rotate-45"></div>
           <span class="font-bold text-zinc-500 tracking-wide text-xs">Keystone © 2026</span>
        </div>
        <div class="flex items-center gap-6 text-zinc-600 text-sm">
            <a href="#" class="hover:text-zinc-400 transition-colors">Docs</a>
            <a href="#" class="hover:text-zinc-400 transition-colors">GitHub</a>
            <a href="#" class="hover:text-zinc-400 transition-colors">Twitter</a>
        </div>
    </div>
  </footer>

</div>
