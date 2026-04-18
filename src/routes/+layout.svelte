<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getSupabase } from '$lib/supabase';

  type NavState = 'public' | 'onboarding' | 'active';

  let navState: NavState = 'public';

  onMount(() => {
    const sb = getSupabase();

    async function updateNavState() {
      const { data: { session } } = await sb.auth.getSession();
      if (!session) { navState = 'public'; return; }
      const hasAssessment = !!localStorage.getItem('mmm_assessment_v1');
      const hasTimetable  = !!localStorage.getItem('mmm_timetable_v1');
      navState = (hasAssessment && hasTimetable) ? 'active' : 'onboarding';
    }

    updateNavState();
    sb.auth.onAuthStateChange(() => updateNavState());
  });

  const ONBOARDING_NAV = [
    { href: '/assessment', icon: '🎯', label: 'Setup'     },
    { href: '/dashboard',  icon: '👤', label: 'Profile'   },
    { href: '/resources',  icon: '📚', label: 'Resources' },
  ];

  const ACTIVE_NAV = [
    { href: '/dashboard',  icon: '◈',  label: 'My Plan'   },
    { href: '/timetable',  icon: '📅', label: 'Timetable' },
    { href: '/resources',  icon: '📚', label: 'Resources' },
    { href: '/marks',      icon: '📊', label: 'Progress'  },
    { href: '/assessment', icon: '👤', label: 'Profile'   },
  ];

  $: current = $page.url.pathname;
  $: navItems = navState === 'active' ? ACTIVE_NAV
              : navState === 'onboarding' ? ONBOARDING_NAV
              : [];

  function isActive(href: string): boolean {
    if (href === '/') return current === '/';
    return current === href || current.startsWith(href + '/');
  }
</script>

<div class="layout-wrap">
  <slot />
  {#if navItems.length > 0}
    <nav class="bottom-nav">
      {#each navItems as n}
        <a href={n.href} class="nav-item" class:active={isActive(n.href)}>
          <span class="nav-icon">{n.icon}</span>
          <span class="nav-label">{n.label}</span>
        </a>
      {/each}
    </nav>
  {/if}
</div>

<style>
  .layout-wrap {
    min-height: 100vh;
    padding-bottom: 72px;
  }

  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: rgba(7, 7, 11, 0.92);
    border-top: 1px solid rgba(255, 244, 232, 0.10);
    display: flex;
    align-items: stretch;
    z-index: 100;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    text-decoration: none;
    color: rgba(255, 244, 232, 0.40);
    transition: color 0.15s;
    padding: 6px 0;
  }

  .nav-item:hover { color: rgba(255, 244, 232, 0.80); }

  .nav-item.active {
    color: #FF2DA6;
  }

  .nav-icon {
    font-size: 1.15rem;
    line-height: 1;
  }

  .nav-label {
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-family: 'Space Grotesk', sans-serif;
  }
</style>
