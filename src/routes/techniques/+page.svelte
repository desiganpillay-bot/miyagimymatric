<script lang="ts">
  let openCard: string | null = null;

  function toggle(id: string) {
    openCard = openCard === id ? null : id;
  }

  const techniques = [
    {
      id: 'recall',
      icon: '🧠',
      name: 'Active Recall',
      also: 'Blurting',
      badge: 'Most effective',
      badgeColor: 'green',
      summary: 'Study for 20–30 min, then close your notes and write everything from memory.',
      steps: [
        'Read a topic section for 20–30 minutes.',
        'Close your notes completely.',
        'On a blank page, write everything you remember — diagrams, formulae, key points.',
        'Open your notes and check what you missed.',
        'Focus your next session only on the gaps.',
      ],
      why: 'Every time you retrieve information from memory, the neural pathway strengthens. Highlighting and re-reading feel productive but don\'t build retrieval strength.',
      sa: 'Most effective for Maths problems, Life Sciences diagrams, History essay arguments, and Accounting formats.',
    },
    {
      id: 'spaced',
      icon: '📅',
      name: 'Spaced Repetition',
      also: 'Review scheduling',
      badge: 'High retention',
      badgeColor: 'blue',
      summary: 'Review material at increasing intervals: 1 day → 3 days → 7 days → 14 days → 30 days.',
      steps: [
        'After studying a topic, mark it with today\'s date.',
        'Review it tomorrow (1 day later).',
        'Review again after 3 days, then 7, 14, and 30.',
        'If you forget it, reset the interval to 1 day.',
        'Use Anki (free, Android) to automate the scheduling.',
      ],
      why: 'Forgetting is the enemy. Your brain keeps what it uses. The spaced review schedule exploits the "forgetting curve" — review just before you forget to maximise long-term retention.',
      sa: 'Use Anki for vocabulary, formulae, definitions, and dates. Free on Android. Also try Quizlet for shared decks on SA matric topics.',
    },
    {
      id: 'pomodoro',
      icon: '⏱️',
      name: 'Pomodoro Method',
      also: '50/10 format',
      badge: 'SA recommended',
      badgeColor: 'yellow',
      summary: 'Study for 50 minutes, break for 10. After 4 cycles, take a 30-minute break.',
      steps: [
        'Set a timer for 50 minutes. Work on one subject only.',
        'No phone, no interruptions. If a thought comes up, write it down and keep going.',
        'When the timer rings, take a 10-minute break — stand up, drink water, stretch.',
        'After 4 cycles (3h 20m of study), take a 30-minute break.',
        'Aim for 3–4 cycles per day during exam season.',
      ],
      why: 'SA educators surveyed recommend 50/10 over the standard 25/5 for matric — longer focus sessions match the duration of actual exam papers.',
      sa: 'Use the Pomodoro timer on this app. Grade 12 exam papers are 2–3 hours long — building 50-min focus blocks trains your brain for exam conditions.',
    },
    {
      id: 'mindmap',
      icon: '🗺️',
      name: 'Mind Mapping',
      also: 'Visual organisation',
      badge: 'Visual learners',
      badgeColor: 'purple',
      summary: 'Build a visual map of a topic from memory first, then verify against your notes.',
      steps: [
        'Put the main topic in the centre of a blank page.',
        'Without looking at notes, branch out: key concepts, sub-topics, links between ideas.',
        'Use colours: one per branch. Add small diagrams.',
        'Once done from memory, open your notes and add what you missed in a different colour.',
        'Rebuild the map from scratch a week later to test retention.',
      ],
      why: 'The act of building the map forces you to recall and organise — passive maps you copy from notes are far less effective.',
      sa: 'Best for Life Sciences (body systems, ecology), History (causes and effects, timelines), Geography (processes and cycles).',
    },
    {
      id: 'feynman',
      icon: '💬',
      name: 'Feynman Technique',
      also: 'Teach it back',
      badge: 'Finds gaps fast',
      badgeColor: 'orange',
      summary: 'Explain a concept out loud as if teaching a 10-year-old. Where you stumble = your gap.',
      steps: [
        'Pick a concept you think you know.',
        'Explain it out loud in plain language — no jargon, as if to someone who knows nothing.',
        'When you stumble, go back to your notes and study that specific part.',
        'Simplify your explanation until it\'s completely clear.',
        'Use an analogy to make it stick ("a cell membrane is like a bouncer at a club").',
      ],
      why: 'If you can\'t explain it simply, you don\'t truly understand it. This technique forces clarity and reveals exactly where your understanding breaks down.',
      sa: 'Use for Physical Sciences concepts, Life Sciences processes, and anything that requires more than memory — cause and effect, mechanisms, reasoning.',
    },
    {
      id: 'pastpapers',
      icon: '📄',
      name: 'Past Papers',
      also: 'The single most effective tool',
      badge: '#1 SA tool',
      badgeColor: 'red',
      summary: 'Do one past paper per subject per week under timed, exam-like conditions.',
      steps: [
        'Get papers from saexampapers.co.za or the DBE website (education.gov.za) — free.',
        'Sit in a quiet room. Timer on. No notes. Exactly as in the exam.',
        'When done, mark it yourself using the memorandum.',
        'For every wrong answer: understand WHY, not just what the right answer is.',
        'Redo the questions you got wrong two days later without looking at the memo.',
      ],
      why: 'Past papers are consistently ranked #1 by SA learners and educators. They train exam technique, time management, and pattern recognition — the exact skills examiners test.',
      sa: 'SA Exam Papers (saexampapers.co.za) has papers going back to 2008 across 40+ subjects, including IEB and all 9 provincial CAPS papers. DBE Mind the Gap guides are free for every subject.',
    },
    {
      id: 'blurting',
      icon: '✍️',
      name: 'Blurting',
      also: 'Brain dump',
      badge: 'Quick + powerful',
      badgeColor: 'green',
      summary: 'Set a 5-minute timer. Write everything you know about a topic without stopping.',
      steps: [
        'Write the topic at the top of a blank page.',
        'Set a timer for 5 minutes.',
        'Write non-stop — everything you know, in any order.',
        'When the timer ends, check your notes for gaps.',
        'Highlight the gaps in red. Study only those next.',
      ],
      why: 'Blurting is active recall in speed mode. It is particularly good for checking your own knowledge before a test or at the start of a revision session.',
      sa: 'Ideal for History facts, Life Sciences definitions, Business Studies content, and any subject with high content volume.',
    },
  ];

  const badgeStyles: Record<string, string> = {
    green:  'background: rgba(74,222,128,.12); color: #4ade80; border: 1px solid rgba(74,222,128,.25)',
    blue:   'background: rgba(56,189,248,.12); color: #38bdf8; border: 1px solid rgba(56,189,248,.25)',
    yellow: 'background: rgba(246,201,14,.12);  color: #f6c90e; border: 1px solid rgba(246,201,14,.25)',
    purple: 'background: rgba(124,77,255,.12);  color: #a78bfa; border: 1px solid rgba(124,77,255,.25)',
    orange: 'background: rgba(251,146,60,.12);  color: #fb923c; border: 1px solid rgba(251,146,60,.25)',
    red:    'background: rgba(248,113,113,.12); color: #f87171; border: 1px solid rgba(248,113,113,.25)',
  };
</script>

<svelte:head>
  <title>Study Techniques — Miyagi My Matric</title>
</svelte:head>

<div class="app">

  <div class="page-header" style="animation: fadeDown .5s ease both">
    <div class="header-badge">Evidence-based</div>
    <h2>Study Techniques</h2>
    <p class="header-sub">Seven techniques used by top SA matric learners — with practical steps and why each one works.</p>
  </div>

  <div class="techniques-list">
    {#each techniques as t, i}
      <div
        class="technique-card {openCard === t.id ? 'open' : ''}"
        style="animation: fadeUp {0.1 + i * 0.06}s ease both"
      >
        <button class="technique-header" on:click={() => toggle(t.id)}>
          <div class="t-left">
            <span class="t-icon">{t.icon}</span>
            <div class="t-meta">
              <div class="t-name">{t.name}</div>
              <div class="t-also">{t.also}</div>
            </div>
          </div>
          <div class="t-right">
            <span class="t-badge" style={badgeStyles[t.badgeColor]}>{t.badge}</span>
            <span class="t-chevron">{openCard === t.id ? '▲' : '▼'}</span>
          </div>
        </button>

        {#if openCard === t.id}
          <div class="technique-body">
            <p class="t-summary">{t.summary}</p>

            <div class="t-section-label">How to do it</div>
            <ol class="t-steps">
              {#each t.steps as step}
                <li>{step}</li>
              {/each}
            </ol>

            <div class="t-section-label">Why it works</div>
            <p class="t-why">{t.why}</p>

            <div class="t-section-label">SA context</div>
            <p class="t-sa">{t.sa}</p>
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <div class="resource-callout">
    <div class="rc-title">Free past papers — the best SA study resource</div>
    <div class="rc-links">
      <a href="https://www.saexampapers.co.za" target="_blank" rel="noopener" class="rc-link">SA Exam Papers →</a>
      <a href="https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx" target="_blank" rel="noopener" class="rc-link">DBE Past Papers →</a>
      <a href="https://www.ieb.co.za/past-papers/" target="_blank" rel="noopener" class="rc-link">IEB Past Papers →</a>
    </div>
  </div>

</div>

<style>
  .page-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .header-badge {
    display: inline-block;
    background: rgba(56,189,248,.1);
    border: 1px solid rgba(56,189,248,.25);
    color: var(--accent2);
    font-family: var(--font-head);
    font-size: .65rem; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    padding: .3rem .9rem; border-radius: 100px;
    margin-bottom: .8rem;
  }

  h2 {
    font-family: var(--font-head);
    font-size: clamp(1.6rem, 4vw, 2rem);
    font-weight: 800; color: var(--text);
    margin-bottom: .5rem;
  }

  .header-sub {
    font-size: .85rem; color: var(--muted);
    font-weight: 300; line-height: 1.6;
    max-width: 400px; margin: 0 auto;
  }

  .techniques-list {
    display: flex; flex-direction: column; gap: .6rem;
    margin-bottom: 1.5rem;
  }

  .technique-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    transition: border-color .15s;
  }
  .technique-card.open { border-color: rgba(124,77,255,.35); }

  .technique-header {
    width: 100%;
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.2rem;
    background: none; border: none;
    cursor: pointer; text-align: left;
  }

  .t-left { display: flex; align-items: center; gap: .8rem; flex: 1; min-width: 0; }
  .t-icon { font-size: 1.3rem; flex-shrink: 0; }
  .t-meta { min-width: 0; }
  .t-name {
    font-family: var(--font-head);
    font-size: .9rem; font-weight: 700; color: var(--text);
  }
  .t-also { font-size: .72rem; color: var(--muted); font-weight: 300; margin-top: .1rem; }

  .t-right { display: flex; align-items: center; gap: .6rem; flex-shrink: 0; }
  .t-badge {
    font-family: var(--font-head);
    font-size: .6rem; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase;
    padding: .25rem .6rem; border-radius: 100px;
    white-space: nowrap;
  }
  .t-chevron { font-size: .6rem; color: var(--muted); }

  .technique-body {
    padding: 0 1.2rem 1.2rem;
    border-top: 1px solid var(--border);
  }

  .t-summary {
    font-size: .85rem; color: var(--text);
    font-weight: 400; line-height: 1.6;
    margin: .8rem 0;
  }

  .t-section-label {
    font-family: var(--font-head);
    font-size: .62rem; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    color: var(--accent2); margin: .8rem 0 .4rem;
  }

  .t-steps {
    padding-left: 1.2rem; margin: 0;
    display: flex; flex-direction: column; gap: .35rem;
  }
  .t-steps li {
    font-size: .82rem; color: var(--muted);
    font-weight: 300; line-height: 1.5;
  }

  .t-why, .t-sa {
    font-size: .82rem; color: var(--muted);
    font-weight: 300; line-height: 1.6; margin: 0;
  }

  .resource-callout {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.2rem 1.4rem;
    margin-bottom: 2rem;
    animation: fadeUp .5s ease both;
  }
  .rc-title {
    font-family: var(--font-head);
    font-size: .78rem; font-weight: 700;
    color: var(--text); margin-bottom: .7rem;
  }
  .rc-links { display: flex; flex-wrap: wrap; gap: .5rem; }
  .rc-link {
    font-family: var(--font-head);
    font-size: .72rem; font-weight: 700;
    color: var(--accent2); text-decoration: none;
    padding: .35rem .8rem;
    border: 1px solid rgba(56,189,248,.25);
    border-radius: 100px;
    transition: border-color .15s;
  }
  .rc-link:hover { border-color: var(--accent2); }
</style>
