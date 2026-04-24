<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { User, Compass, CalendarDays, TrendingUp, BarChart2 } from 'lucide-svelte';
  import { getSession } from '$lib/auth';
  import { getSupabase } from '$lib/supabase';

  const NAV_ITEMS = [
    { href: '/dashboard',  icon: Compass,      label: 'My Plan'   },
    { href: '/timetable',  icon: CalendarDays, label: 'Timetable' },
    { href: '/sba',        icon: TrendingUp,   label: 'SBA'       },
    { href: '/marks',      icon: BarChart2,    label: 'Marks'     },
    { href: '/assessment', icon: User,         label: 'Profile'   },
  ];

  const PAGE_TITLES: Record<string, string> = {
    '/dashboard':  'My Plan',
    '/timetable':  'Timetable',
    '/sba':        'SBA Tracker',
    '/marks':      'Marks',
    '/subjects':   'Subjects',
    '/techniques': 'Techniques',
    '/resources':  'Resources',
    '/pomodoro':   'Pomodoro',
    '/panic':      '🚨 Panic Mode',
    '/share':      'My APS Card',
    '/assessment': 'Assessment',
  };

  // Routes that never show nav or top bar
  const UTILITY = ['/auth/callback', '/privacy', '/terms', '/how-it-works'];
  // Routes that are public (no auth redirect)
  const PUBLIC = ['/', '/assessment', '/auth/callback', '/privacy', '/terms', '/how-it-works', '/panic', '/resources'];

  let authed    = false;
  let localAPS  = 0;
  let userEmail = '';

  onMount(async () => {
    // Read local APS for top bar chip
    try {
      const raw = localStorage.getItem('mmm_assessment_v1');
      if (raw) {
        const state = JSON.parse(raw);
        localAPS = state.apsTotal ?? 0;
      }
    } catch {}

    // Check auth
    try {
      const session = await getSession();
      authed = !!session;
      userEmail = session?.user?.email ?? '';

      // Listen for auth state changes
      const sb = getSupabase();
      if (sb) {
        sb.auth.onAuthStateChange((_event, s) => {
          authed = !!s;
          userEmail = s?.user?.email ?? '';
        });
      }
    } catch (e) {
      console.warn('Auth check failed:', e);
      authed = false;
    }

    // Gate protected routes — redirect to home if not authed
    const path = $page.url.pathname;
    const isPublic = PUBLIC.some(p => path === p || path.startsWith(p + '/'));
    if (!isPublic && !authed) {
      goto('/');
    }
  });

  $: path       = $page.url.pathname;
  $: isUtility  = UTILITY.some(r => path.startsWith(r));
  $: isLanding  = path === '/';
  $: isAssess   = path.startsWith('/assessment');

  $: showNav    = authed && !isUtility && !isLanding;
  $: showTopBar = authed && !isUtility && !isLanding && !isAssess;
  $: pageTitle  = PAGE_TITLES[path] ?? '';

  function isActive(href: string): boolean {
    if (href === '/') return path === '/';
    return path === href || path.startsWith(href + '/');
  }
</script>

<div class="layout-wrap" class:has-nav={showNav} class:has-topbar={showTopBar}>

  {#if showTopBar}
    <header class="top-bar">
      <a href="/" class="top-logo">
        <span class="logo-m">M</span>
      </a>

      <span class="top-title">{pageTitle}</span>

      {#if localAPS > 0}
        <a href="/dashboard" class="aps-chip">
          <span class="aps-chip-val">{localAPS}</span>
          <span class="aps-chip-label">APS</span>
        </a>
      {:else}
        <a href="/dashboard" class="top-plan-btn">My Plan</a>
      {/if}
    </header>
  {/if}

  <slot />

  {#if showNav}
    <nav class="bottom-nav">
      {#each NAV_ITEMS as n}
        <a href={n.href} class="nav-item" class:active={isActive(n.href)}>
          <span class="nav-icon">
            <svelte:component this={n.icon} size={20} strokeWidth={1.6} />
          </span>
          <span class="nav-label">{n.label}</span>
        </a>
      {/each}
    </nav>
  {/if}
</div>

<style>
  .layout-wrap { min-height: 100vh; }
  .layout-wrap.has-nav    { padding-bottom: 60px; }
  .layout-wrap.has-topbar { padding-top: 52px; }

  /* ── Top bar ─────────────────────────────────────────────── */
  .top-bar {
    position: fixed; top: 0; left: 0; right: 0; height: 52px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.1rem;
    background: rgba(13, 10, 24, 0.92);
    border-bottom: 1px solid rgba(255, 244, 232, 0.07);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    z-index: 100;
  }

  .top-logo {
    width: 30px; height: 30px; border-radius: 8px;
    background: var(--grad-cta);
    display: flex; align-items: center; justify-content: center;
    text-decoration: none; flex-shrink: 0;
  }
  .logo-m {
    font-family: 'Space Grotesk', sans-serif;
    font-size: .85rem; font-weight: 800; color: #0D0A18; line-height: 1;
  }

  .top-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: .82rem; font-weight: 700;
    color: rgba(255, 244, 232, 0.75); letter-spacing: .02em;
    position: absolute; left: 50%; transform: translateX(-50%);
  }

  .aps-chip {
    display: flex; align-items: center; gap: 3px;
    background: rgba(124, 77, 255, 0.15);
    border: 1px solid rgba(124, 77, 255, 0.35);
    border-radius: 100px; padding: .25rem .65rem;
    text-decoration: none; transition: background .15s;
  }
  .aps-chip:hover { background: rgba(124, 77, 255, 0.25); }
  .aps-chip-val {
    font-family: 'Space Grotesk', sans-serif;
    font-size: .78rem; font-weight: 800; color: var(--accent); line-height: 1;
  }
  .aps-chip-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: .58rem; font-weight: 600;
    color: rgba(124, 77, 255, 0.7); letter-spacing: .06em;
  }

  .top-plan-btn {
    font-family: 'Space Grotesk', sans-serif;
    font-size: .72rem; font-weight: 700;
    color: rgba(255, 244, 232, 0.45);
    text-decoration: none; letter-spacing: .04em; transition: color .15s;
  }
  .top-plan-btn:hover { color: var(--text); }

  /* ── Bottom nav ──────────────────────────────────────────── */
  .bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0; height: 60px;
    background: rgba(13, 10, 24, 0.94);
    border-top: 1px solid rgba(255, 244, 232, 0.08);
    display: flex; align-items: stretch;
    z-index: 100;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  }

  .nav-item {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 3px;
    text-decoration: none;
    color: rgba(255, 244, 232, 0.30);
    transition: color 0.15s; padding: 6px 0;
    -webkit-tap-highlight-color: transparent;
  }
  .nav-item:hover  { color: rgba(255, 244, 232, 0.70); }
  .nav-item.active { color: var(--accent); }

  .nav-icon { display: flex; align-items: center; justify-content: center; line-height: 1; }

  .nav-label {
    font-size: 0.50rem; font-weight: 700;
    letter-spacing: 0.05em; text-transform: uppercase;
    font-family: 'Space Grotesk', sans-serif; white-space: nowrap;
  }
</style>
