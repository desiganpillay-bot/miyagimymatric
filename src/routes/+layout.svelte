<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getSupabase } from '$lib/supabase';
  import { Target, User, BookOpen, Compass, CalendarDays, TrendingUp } from 'lucide-svelte';

  type NavState = 'public' | 'onboarding' | 'active';

  let navState: NavState = 'public';
  let steps = {
    assessment: false,
    timetable:  false,
  };

  onMount(() => {
    const sb = getSupabase();

    function readSteps() {
      steps = {
        assessment: !!localStorage.getItem('mmm_assessment_v1'),
        timetable:  !!localStorage.getItem('mmm_timetable_v1'),
      };
    }

    async function updateNavState() {
      const { data: { session } } = await sb.auth.getSession();
      if (!session) { navState = 'public'; return; }
      readSteps();
      navState = (steps.assessment && steps.timetable) ? 'active' : 'onboarding';
    }

    updateNavState();
    sb.auth.onAuthStateChange(() => updateNavState());
  });

  // Assessment ✓ = mmm_assessment_v1 exists
  // Profile    ✓ = same (profile is assessment output)
  // Study Plan ✓ = same (plan is generated from assessment)
  // Timetable  ✓ = mmm_timetable_v1 exists
  // Resources  = always accessible; "matched" once assessment done
  $: strip = [
    { label: 'Assessment', done: steps.assessment },
    { label: 'Profile',    done: steps.assessment },
    { label: 'Study Plan', done: steps.assessment },
    { label: 'Timetable',  done: steps.timetable  },
    { label: 'Resources',  done: steps.assessment  },
  ];
  $: allDone = strip.every(s => s.done);

  const ONBOARDING_NAV = [
    { href: '/assessment', icon: Target,      label: 'Continue Setup' },
    { href: '/dashboard',  icon: User,        label: 'My Profile'     },
    { href: '/resources',  icon: BookOpen,    label: 'Resources'      },
  ];

  const ACTIVE_NAV = [
    { href: '/dashboard',  icon: Compass,     label: 'My Plan'    },
    { href: '/timetable',  icon: CalendarDays,label: 'Timetable'  },
    { href: '/resources',  icon: BookOpen,    label: 'Resources'  },
    { href: '/marks',      icon: TrendingUp,  label: 'Progress'   },
    { href: '/assessment', icon: User,        label: 'Profile'    },
  ];

  $: current  = $page.url.pathname;
  $: navItems = navState === 'active'     ? ACTIVE_NAV
              : navState === 'onboarding' ? ONBOARDING_NAV
              : [];
  $: showStrip = navState !== 'public';

  function isActive(href: string): boolean {
    if (href === '/') return current === '/';
    return current === href || current.startsWith(href + '/');
  }
</script>

<div class="layout-wrap">

  {#if showStrip}
    <div class="setup-strip" class:all-done={allDone}>
      {#each strip as s, i}
        <div class="strip-step" class:done={s.done} class:next={!s.done && (i === 0 || strip[i-1].done)}>
          <span class="strip-icon">{s.done ? '✓' : (i + 1)}</span>
          <span class="strip-label">{s.label}</span>
        </div>
        {#if i < strip.length - 1}
          <span class="strip-divider">›</span>
        {/if}
      {/each}
    </div>
  {/if}

  <slot />

  {#if navItems.length > 0}
    <nav class="bottom-nav">
      {#each navItems as n}
        <a href={n.href} class="nav-item" class:active={isActive(n.href)}>
          <span class="nav-icon"><svelte:component this={n.icon} size={20} strokeWidth={1.6} /></span>
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

  /* ── Setup progress strip ─────────────────────────────── */
  .setup-strip {
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .35rem;
    padding: .45rem 1rem;
    background: rgba(7, 7, 11, 0.88);
    border-bottom: 1px solid rgba(255, 244, 232, 0.08);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    overflow-x: auto;
    scrollbar-width: none;
    flex-wrap: nowrap;
  }

  .setup-strip::-webkit-scrollbar { display: none; }

  .setup-strip.all-done {
    border-bottom-color: rgba(122, 255, 122, 0.20);
  }

  .strip-step {
    display: flex;
    align-items: center;
    gap: .3rem;
    flex-shrink: 0;
  }

  .strip-icon {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .6rem;
    font-weight: 700;
    font-family: 'Space Grotesk', sans-serif;
    background: rgba(255, 244, 232, 0.08);
    color: rgba(255, 244, 232, 0.30);
    flex-shrink: 0;
  }

  .strip-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: .62rem;
    font-weight: 600;
    letter-spacing: .04em;
    color: rgba(255, 244, 232, 0.30);
    white-space: nowrap;
  }

  /* Next step to complete */
  .strip-step.next .strip-icon {
    background: rgba(255, 82, 82, 0.20);
    color: #FF5252;
  }
  .strip-step.next .strip-label { color: #FF5252; }

  /* Completed step */
  .strip-step.done .strip-icon {
    background: rgba(122, 255, 122, 0.20);
    color: #7AFF7A;
  }
  .strip-step.done .strip-label { color: rgba(255, 244, 232, 0.65); }

  .strip-divider {
    font-size: .6rem;
    color: rgba(255, 244, 232, 0.18);
    flex-shrink: 0;
  }

  /* ── Bottom nav ───────────────────────────────────────── */
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
  .nav-item.active { color: #FF5252; }

  .nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .nav-label {
    font-size: 0.52rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-family: 'Space Grotesk', sans-serif;
    white-space: nowrap;
  }
</style>
