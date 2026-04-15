<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';

  const NAV = [
    { href: '/',            icon: '🏠',  label: 'Home'        },
    { href: '/dashboard',   icon: '⬡',  label: 'Dashboard'   },
    { href: '/assessment',  icon: '🎯',  label: 'Assess'      },
    { href: '/timetable',   icon: '📅',  label: 'Timetable'   },
    { href: '/sba',         icon: '✅',  label: 'SBA'         },
    { href: '/pomodoro',    icon: '⏱',  label: 'Timer'       },
  ];

  $: current = $page.url.pathname;

  function isActive(href: string): boolean {
    if (href === '/') return current === '/';
    return current === href || current.startsWith(href + '/');
  }
</script>

<div class="layout-wrap">
  <slot />
  <nav class="bottom-nav">
    {#each NAV as n}
      <a href={n.href} class="nav-item" class:active={isActive(n.href)}>
        <span class="nav-icon">{n.icon}</span>
        <span class="nav-label">{n.label}</span>
      </a>
    {/each}
  </nav>
</div>

<style>
  .layout-wrap {
    min-height: 100vh;
    padding-bottom: 72px; /* space for bottom nav */
  }

  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: rgba(22, 27, 34, 0.96);
    border-top: 1px solid #2d3748;
    display: flex;
    align-items: stretch;
    z-index: 100;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    text-decoration: none;
    color: #8899a6;
    transition: color 0.15s;
    padding: 6px 0;
  }

  .nav-item:hover { color: #f0f4f8; }

  .nav-item.active {
    color: #f6c90e;
  }

  .nav-icon {
    font-size: 1.2rem;
    line-height: 1;
  }

  .nav-label {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-family: 'Syne', sans-serif;
  }
</style>
