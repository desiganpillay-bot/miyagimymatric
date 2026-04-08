<script lang="ts">
  import { currentSection, answers, subjectMarks, subjectRatings, apsResult, resetAssessment } from '$lib/stores/assessment';
  import { SUBJECTS, UNIVERSITIES, FIELDS, MARK_RANGES } from '$lib/constants';
  import { scoreClass, barColor, pClass, passLabel } from '$lib/aps';
  import { signInWithMagicLink, signInWithGoogle } from '$lib/auth';

  // ── Type helpers (avoid 'as' casts in template) ───────────
  function str(val: unknown, def = ''): string { return val != null ? String(val) : def; }
  function num(val: unknown, def = 0): number { const n = Number(val); return isNaN(n) || n === 0 ? def : n; }
  function arr(val: unknown): string[] { return Array.isArray(val) ? (val as string[]) : []; }

  // ── Section definitions ───────────────────────────────────
  const sections = [
    {
      id: 'system', label: 'Your Setup',
      questions: [
        { id: 'exam_system', type: 'single', title: 'Which exam system are you writing?', cols: 'grid-3',
          options: [
            { val: 'ieb',    label: 'IEB',       sub: 'Independent Examinations Board' },
            { val: 'caps',   label: 'CAPS / NSC', sub: 'National Senior Certificate' },
            { val: 'unsure', label: 'Not sure',   sub: '' }
          ]
        },
        { id: 'grade', type: 'single', title: 'What grade are you in?', cols: 'grid-3',
          options: [
            { val: '10', label: 'Grade 10' },
            { val: '11', label: 'Grade 11' },
            { val: '12', label: 'Grade 12 (Matric)' }
          ]
        },
        { id: 'goal', type: 'single', title: 'What is your main academic goal?', cols: 'grid-2',
          options: [
            { val: 'bachelor', label: "Bachelor's Pass",   sub: 'University (APS 23+)' },
            { val: 'diploma',  label: 'Diploma Pass',      sub: 'College / diploma route' },
            { val: 'pass',     label: 'Just pass matric',  sub: 'Complete Grade 12' },
            { val: 'top',      label: 'Distinctions',      sub: '80%+ average' }
          ]
        }
      ]
    },
    {
      id: 'career', label: 'Career & University Goals',
      questions: [
        { id: 'field',       type: 'field_select', title: 'What would you like to study?', sub: 'Select the field that interests you most — this sets your APS target.' },
        { id: 'career_note', type: 'text_input',   title: 'What specific career do you have in mind? (optional)', sub: 'e.g. "Chartered Accountant", "Game developer", "Doctor"', placeholder: 'Type your dream career here...' },
        { id: 'universities',type: 'uni_select',   title: 'Which SA universities are you considering?', sub: 'Select up to 4 — we compare your APS to their minimum entry requirements.' }
      ]
    },
    {
      id: 'subjects', label: 'Your Marks & APS',
      questions: [
        { id: 'subject_ratings', type: 'subject_table', title: 'Enter your subject marks and confidence rating', sub: 'Use your most recent marks. APS calculates live. Rate confidence 1–5 (1 = struggling, 5 = strong).' }
      ]
    },
    {
      id: 'learning', label: 'Learning Style',
      questions: [
        { id: 'learning_style', type: 'single', title: 'How do you absorb new information best?', cols: 'grid-2',
          options: [
            { val: 'visual',    label: '👁 Visual',          sub: 'Diagrams, mind maps, colour-coding' },
            { val: 'reading',   label: '📖 Reading/Writing', sub: 'Notes, summaries, blurting' },
            { val: 'listening', label: '🎧 Auditory',        sub: 'YouTube, talking it out' },
            { val: 'doing',     label: '✍️ Doing',           sub: 'Practice problems, past papers' }
          ]
        },
        { id: 'peak_time', type: 'single', title: 'When is your brain sharpest?', cols: 'grid-2',
          options: [
            { val: 'early_morning', label: '🌅 Before 7am' },
            { val: 'morning',       label: '☀️ 7am–12pm' },
            { val: 'afternoon',     label: '🌤 12pm–5pm' },
            { val: 'evening',       label: '🌙 5pm–10pm' }
          ]
        },
        { id: 'focus_duration', type: 'slider', title: 'How long can you genuinely focus before your mind wanders?', sub: 'Be honest — what actually happens, not what you wish.', min: 10, max: 90, step: 5, unit: ' mins', def: 30 }
      ]
    },
    {
      id: 'habits', label: 'Study Habits',
      questions: [
        { id: 'weekly_hours', type: 'slider', title: 'How many hours per week do you currently study outside of school?', min: 0, max: 40, step: 1, unit: ' hrs/week', def: 10 },
        { id: 'past_papers',  type: 'single', title: 'How often do you practise past exam papers?', cols: 'grid-2',
          options: [
            { val: 'never',        label: 'Never',        sub: "Haven't started" },
            { val: 'occasionally', label: 'Occasionally', sub: 'A few times a term' },
            { val: 'regularly',    label: 'Regularly',    sub: 'Every few weeks' },
            { val: 'weekly',       label: 'Weekly',       sub: 'Core routine' }
          ]
        },
        { id: 'sba_attitude', type: 'single', title: 'How do you approach SBA tasks?', sub: 'Assignments, practicals, projects — worth 25% of your final mark.', cols: 'grid-2',
          options: [
            { val: 'strategic',   label: '🎯 Strategically', sub: 'Treat as exam prep AND marks' },
            { val: 'complete',    label: '✅ Just get it done' },
            { val: 'last_minute', label: '⏰ Last minute' },
            { val: 'miss',        label: '⚠️ Sometimes miss them' }
          ]
        },
        { id: 'challenges', type: 'multi', title: 'What are your biggest study challenges?', sub: 'Select all that apply.', cols: 'grid-2',
          options: [
            { val: 'procrastination', label: '😴 Procrastination' },
            { val: 'distraction',     label: '📱 Phone/social media' },
            { val: 'anxiety',         label: '😰 Exam anxiety' },
            { val: 'understanding',   label: '🤔 Content gaps' },
            { val: 'time',            label: '⏱ Not enough time' },
            { val: 'data',            label: '📡 Data/load shedding' },
            { val: 'space',           label: '🏠 No quiet study space' },
            { val: 'motivation',      label: '🔋 Low motivation' }
          ]
        }
      ]
    },
    {
      id: 'wellbeing', label: 'Wellbeing',
      questions: [
        { id: 'sleep', type: 'single', title: 'How many hours of sleep do you get on school nights?', sub: 'The DBE recommends 8 hours for optimal memory consolidation.', cols: 'grid-2',
          options: [
            { val: 'under5', label: 'Under 5 hrs', sub: 'Severely sleep deprived' },
            { val: '5to6',   label: '5–6 hrs',     sub: 'Below recommended' },
            { val: '6to7',   label: '6–7 hrs',     sub: 'Slightly short' },
            { val: '7to8',   label: '7–8 hrs',     sub: 'Good range' },
            { val: 'over8',  label: '8+ hrs',      sub: 'Optimal' }
          ]
        },
        { id: 'stress', type: 'slider', title: 'How stressed do you feel about matric right now?', sub: '1 = calm and confident, 10 = overwhelming anxiety', min: 1, max: 10, step: 1, unit: '/10', def: 5 }
      ]
    }
  ] as const;

  // ── Reactive state ────────────────────────────────────────
  let showResults = false;
  let saveEmail = '';
  let saveStatus: 'idle' | 'sending' | 'sent' | 'error' = 'idle';
  let agreedTerms = false;
  let agreedPrivacy = false;

  // ── Answer helpers ────────────────────────────────────────
  function getA(id: string): unknown { return $answers[id]; }

  function setA(id: string, val: unknown) {
    answers.update(a => ({ ...a, [id]: val }));
  }

  function toggleMulti(id: string, val: string) {
    answers.update(a => {
      const current = arr(a[id]);
      const i = current.indexOf(val);
      const next = [...current];
      if (i === -1) next.push(val); else next.splice(i, 1);
      return { ...a, [id]: next };
    });
  }

  function toggleField(val: string) {
    answers.update(a => ({ ...a, field: a['field'] === val ? null : val }));
  }

  function toggleUni(id: string) {
    answers.update(a => {
      const current = arr(a['universities']);
      const i = current.indexOf(id);
      const next = [...current];
      if (i === -1) { if (next.length < 4) next.push(id); } else next.splice(i, 1);
      return { ...a, universities: next };
    });
  }

  function setSlider(id: string, val: number) {
    answers.update(a => ({ ...a, [id]: val }));
  }

  function setSubjRating(subj: string, r: number) {
    subjectRatings.update(ratings => ({ ...ratings, [subj]: r }));
  }

  function setSubjMark(subj: string, mark: string) {
    subjectMarks.update(marks => ({ ...marks, [subj]: mark }));
  }

  function nextSection() {
    if ($currentSection < sections.length - 1) {
      currentSection.update(n => n + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showResults = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function prevSection() {
    currentSection.update(n => Math.max(0, n - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function restart() {
    resetAssessment();
    showResults = false;
    saveStatus = 'idle';
    saveEmail = '';
    agreedTerms = false;
    agreedPrivacy = false;
  }

  async function handleMagicLink() {
    if (!saveEmail.trim() || !agreedTerms || !agreedPrivacy) return;
    saveStatus = 'sending';
    const { error } = await signInWithMagicLink(saveEmail.trim());
    if (!error) {
      // Store consent intent — written to Supabase profiles on first auth callback
      localStorage.setItem('mmm_consent_v1', JSON.stringify({
        consented_at: new Date().toISOString(),
        terms_version: 'v1-2026-04'
      }));
    }
    saveStatus = error ? 'error' : 'sent';
  }

  // ── Results content ───────────────────────────────────────
  const styleTips: Record<string, string[]> = {
    visual:    ['Colour-code your notes and build topic mind maps entirely from memory', 'Draw labelled diagrams from scratch — Life Sciences and Geography exams require them', 'Create visual timelines for History causes, events and consequences'],
    reading:   ['After every study session, close your notes and blurt everything you remember onto blank paper', 'Summarise each topic in your own words — never copy your textbook verbatim', 'Read your revision summaries aloud before each test'],
    listening: ['Use Kevinmathscience and Mindset Learn videos as your first introduction to new topics', 'Record yourself explaining a concept and listen back on the commute', 'Join a study group where you explain and quiz each other out loud'],
    doing:     ['Past papers are your single most effective tool — do one per subject per week under timed conditions', 'Attempt exam questions before reading theory to find real gaps', 'Use Siyavula for unlimited adaptive Maths and Physical Sciences practice (free, zero-rated)']
  };
  const styleMap: Record<string, string> = { visual: 'Visual Learner', reading: 'Reading/Writing Learner', listening: 'Auditory Learner', doing: 'Kinesthetic Learner' };
  const peakMap:  Record<string, string> = { early_morning: 'before 7am', morning: '7am–12pm', afternoon: '12pm–5pm', evening: '5pm–10pm' };
  const sysTips: Record<string, string[]> = {
    ieb:    ['Spend 60%+ of revision time on application tasks, not memorisation', 'Practise source analysis and timed extended essay writing every week', 'Focus on unfamiliar contexts — the IEB rewards transferable thinking, not regurgitation'],
    caps:   ['Ensure complete CAPS topic coverage — use the official DBE topic checklists per subject', 'Use DBE Mind the Gap guides (free at education.gov.za) for every subject', 'Past papers from 2016 onward are free and zero-rated on the DBE website'],
    unsure: ['Download Mind the Gap guides from education.gov.za — free for all subjects', 'Work through past papers from 2016 onwards', 'Check your school for whether you write IEB or CAPS']
  };

  // Computed results values (derived from answers for use in results view)
  $: a = $answers;
  $: aps = $apsResult.total;
  $: best6 = $apsResult.best6;
  $: resultField = FIELDS.find(f => f.id === a['field']);
  $: resultUnis = arr(a['universities']).map(id => UNIVERSITIES.find(u => u.id === id)).filter((u): u is typeof UNIVERSITIES[0] => !!u);
  $: learningStyle = str(a['learning_style']);
  $: peakTime = str(a['peak_time']);
  $: focusDuration = num(a['focus_duration'], 30);
  $: pomodoroFmt = focusDuration <= 25 ? '25/5' : focusDuration <= 45 ? '45/10' : '50/10';
  $: examSystem = str(a['exam_system'], 'caps');
  $: sleepVal = str(a['sleep']);
  $: stressVal = num(a['stress'], 5);
  $: sleepWarning = ['under5','5to6','6to7'].includes(sleepVal);
  $: highStress = stressVal >= 7;
  $: challenges = arr(a['challenges']);
  $: hasAnxiety = challenges.includes('anxiety') || highStress;
  $: hasProcrastination = challenges.includes('procrastination');
  $: rated = SUBJECTS.map(s => ({ name: s, r: $subjectRatings[s], m: $subjectMarks[s] })).filter(s => s.r > 0 || s.m).sort((x, y) => (x.r || 3) - (y.r || 3));
</script>

<svelte:head>
  <title>{showResults ? 'Your Study Profile' : `Section ${$currentSection + 1} of ${sections.length}`} — Miyagi My Matric</title>
</svelte:head>

<div class="app">

  {#if showResults}
    <!-- ════════════ RESULTS ════════════ -->
    <div class="results-header" style="animation: fadeDown .5s ease both">
      <div class="badge">Your Results</div>
      <h2>Your Study Profile</h2>
      <p>Personalised for your learning style, subjects, and SA university goals.</p>
    </div>

    <!-- APS Target Analysis -->
    {#if resultField && resultUnis.length > 0}
    <div class="result-card" style="animation: fadeUp .3s ease both">
      <h3 class="blue">◆ APS Target Analysis — {resultField.label}{a['career_note'] ? ` (${a['career_note']})` : ''}</h3>
      <div class="aps-display" style="margin-bottom: 1.2rem">
        <div class="aps-score {scoreClass(aps)}" style="font-size: 2.5rem">{aps}</div>
        <div class="aps-denom">/42</div>
        <div style="padding-bottom: 4px; font-size: .82rem; color: var(--muted); margin-left: .5rem">
          Your current APS<br><span style="font-size: .72rem">Best 6 subjects, std. 7-pt scale</span>
        </div>
      </div>
      {#each resultUnis as uni}
        {@const req = resultField.apsReqs[uni.id]}
        {#if !req}
          <div class="target-row close">
            <span class="target-uni">{uni.name} <span style="font-weight:300;font-size:.7rem;color:var(--muted)">{uni.city}</span></span>
            <span class="target-req">Requirements vary by programme</span>
            <span class="target-badge close">CHECK SITE</span>
          </div>
        {:else}
          {@const isUCT = uni.id === 'uct'}
          {@const cAPS  = isUCT ? best6.reduce((s, r) => s + r.pct, 0) : aps}
          {@const diff  = cAPS - req}
          {@const cls   = diff >= 0 ? 'met' : diff >= -4 ? 'close' : 'gap'}
          {@const badge = diff >= 0 ? 'MET ✓' : diff >= -4 ? `${Math.abs(diff)} pts short` : `${Math.abs(diff)} pts below`}
          <div class="target-row {cls}">
            <div style="flex: 1">
              <div class="target-uni">{uni.name} <span style="font-weight:300;font-size:.72rem;color:var(--muted)">{uni.city}</span></div>
              <div class="target-req" style="margin-top: 2px">Min APS for {resultField.label}: <strong>{isUCT ? `${req}/600 (UCT scale)` : `${req}/42`}</strong></div>
            </div>
            <span class="target-badge {cls}">{badge}</span>
          </div>
        {/if}
      {/each}
      <div style="margin-top: .8rem; font-size: .72rem; color: var(--muted); font-weight: 300">⚠ APS requirements shown are indicative for 2025. Always verify directly with each university.</div>
    </div>
    {/if}

    <!-- Learning Profile -->
    <div class="result-card" style="animation: fadeUp .38s ease both">
      <h3 class="yellow">✦ Learning Profile</h3>
      <div class="profile-pill">{styleMap[learningStyle] || 'Mixed Learner'}</div>
      <p class="insight">
        Your peak focus window is <strong>{peakMap[peakTime] || 'flexible'}</strong> — schedule your hardest subjects then.
        Your natural focus span is <strong>{focusDuration} minutes</strong>, so use the
        <strong>{pomodoroFmt} Pomodoro format</strong> to work with your brain, not against it.
      </p>
      <br>
      <ul class="tip-list">
        {#each (styleTips[learningStyle] || styleTips.doing) as tip}
          <li class="tip-item">{tip}</li>
        {/each}
      </ul>
    </div>

    <!-- Subject Priorities -->
    <div class="result-card" style="animation: fadeUp .46s ease both">
      <h3 class="blue">◈ Subject Priorities</h3>
      {#if rated.length === 0}
        <p class="insight">Enter your subject marks in the assessment to see priorities.</p>
      {:else}
        <ul class="priority-list">
          {#each rated.slice(0, 2) as s}
            <li class="priority-item high">
              <span class="priority-badge high">High</span>
              <span>{s.name}{s.m ? ` — currently ${s.m}%` : ''}</span>
            </li>
          {/each}
          {#each rated.slice(2, rated.length - 2) as s}
            <li class="priority-item med">
              <span class="priority-badge med">Medium</span>
              <span>{s.name}</span>
            </li>
          {/each}
          {#each rated.slice(-2).filter(s => !rated.slice(0,2).find(h => h.name === s.name)) as s}
            <li class="priority-item low">
              <span class="priority-badge low">Strong</span>
              <span>{s.name}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </div>

    <!-- Exam System Strategy -->
    <div class="result-card" style="animation: fadeUp .54s ease both">
      <h3 class="green">◉ {examSystem.toUpperCase()} Study Strategy</h3>
      <ul class="tip-list">
        {#each (sysTips[examSystem] || sysTips.caps) as tip}
          <li class="tip-item">{tip}</li>
        {/each}
      </ul>
    </div>

    <!-- Wellbeing Alert -->
    {#if sleepWarning || highStress}
    <div class="result-card" style="animation: fadeUp .58s ease both; border-color: rgba(248,113,113,.3)">
      <h3 class="red">⚠ Wellbeing Check</h3>
      {#if ['under5','5to6'].includes(sleepVal)}
        <p class="insight"><strong>Sleep is your #1 performance tool.</strong> Memory consolidation happens during sleep — studying more and sleeping less is counterproductive. Aim for 7–8 hours tonight.</p>
      {/if}
      {#if highStress}
        <p class="insight" style="margin-top: .8rem"><strong>Your stress level is high.</strong> This is normal in matric — but unmanaged stress hurts performance. SADAG's free helpline: <strong style="color: var(--accent2)">0800 456 789</strong>. Available 24/7.</p>
      {/if}
    </div>
    {/if}

    <!-- Save Profile -->
    <div class="save-card">
      <h3>Save your study profile</h3>
      <p>Your profile is saved in this browser. Enter your email to sync it across devices — no password needed.</p>
      {#if saveStatus === 'sent'}
        <div class="save-success">✓ Check your email — magic link sent. Click it to save your profile.</div>
      {:else}
        <div class="consent-checkboxes">
          <label class="consent-label">
            <input type="checkbox" bind:checked={agreedTerms} />
            <span>I agree to the <a href="/terms" target="_blank">Terms of Use</a></span>
          </label>
          <label class="consent-label">
            <input type="checkbox" bind:checked={agreedPrivacy} />
            <span>I have read the <a href="/privacy" target="_blank">Privacy Notice</a> and consent to processing of my personal information under POPIA</span>
          </label>
          <p class="consent-minor">If you are under 18, please ask a parent or guardian to review these terms before continuing.</p>
        </div>
        <div class="save-form">
          <input
            class="text-input"
            type="email"
            placeholder="your@email.com"
            bind:value={saveEmail}
            disabled={saveStatus === 'sending'}
          />
          <button class="btn btn-next" disabled={saveStatus === 'sending' || !saveEmail.trim() || !agreedTerms || !agreedPrivacy} on:click={handleMagicLink}>
            {saveStatus === 'sending' ? 'Sending…' : 'Save with Email →'}
          </button>
        </div>
        <button class="google-btn" on:click={() => signInWithGoogle()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
        {#if saveStatus === 'error'}
          <p class="save-error">Something went wrong. Try again or use Google.</p>
        {/if}
      {/if}
    </div>

    <div class="next-steps">
      <p class="next-steps-label">Your plan is ready — what do you want to do next?</p>
      <a href="/dashboard" class="btn-timetable">View My Dashboard →</a>
      <a href="/timetable" class="btn-timetable btn-ghost-cta">Build My Timetable →</a>
      <a href="/sba" class="btn-timetable btn-ghost-cta">Track SBA Tasks →</a>
      <a href="/techniques" class="btn-timetable btn-ghost-cta">Study Techniques →</a>
      {#if hasAnxiety || hasProcrastination}
        <div class="challenge-tip">
          {#if hasAnxiety}⚡ Your profile shows exam anxiety — the <strong>Pomodoro 50/10</strong> technique in the techniques guide is proven to lower pre-exam stress.{/if}
          {#if hasProcrastination && !hasAnxiety}🎯 Your profile shows procrastination — try <strong>active recall (blurting)</strong> to make the first 5 minutes feel easy.{/if}
        </div>
      {/if}
    </div>

    <button class="restart-btn" on:click={restart}>↩ Retake Assessment</button>

  {:else}
    <!-- ════════════ ASSESSMENT FORM ════════════ -->
    <div class="header">
      <div class="badge">Matric · SA Learner Self-Assessment</div>
      <h1>Know Your Study Profile</h1>
      <p>Answer honestly — this builds a personalised study strategy, calculates your live APS, and compares it to your target SA universities.</p>
    </div>

    <!-- Progress bar -->
    <div class="progress-wrap">
      <div class="progress-meta">
        <span class="progress-label">Progress</span>
        <span class="progress-count">Section {$currentSection + 1} of {sections.length}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: {(($currentSection + 1) / sections.length) * 100}%"></div>
      </div>
    </div>

    <!-- Live APS panel (visible from section 2 onward) -->
    {#if $currentSection >= 2}
      {@const liveAPS = $apsResult.total}
      {@const liveBest6 = $apsResult.best6}
      {@const livePct = Math.min(100, Math.round((liveAPS / 42) * 100))}
      {@const liveField = FIELDS.find(f => f.id === $answers['field'])}
      {@const liveUnis = arr($answers['universities'])}

      <div class="aps-panel">
        <h3>◈ Your Live APS Score</h3>
        <div class="aps-display">
          <div class="aps-score {scoreClass(liveAPS)}">{liveAPS}</div>
          <div class="aps-denom">/ 42</div>
          <div class="aps-label">{passLabel(liveAPS)}<br><span style="font-size:.72rem;color:var(--border)">Best 6 subjects</span></div>
        </div>
        <div class="aps-bar-wrap">
          <div class="aps-bar-track">
            <div class="aps-bar-fill" style="width: {livePct}%; background: {barColor(liveAPS)}"></div>
          </div>
        </div>
        {#if liveBest6.length > 0}
          <div class="aps-breakdown">
            {#each liveBest6 as r}
              <div class="aps-row">
                <span class="aps-subj">{r.name}</span>
                <span class="aps-pts {pClass(r.aps)}">{r.aps} pts ({$subjectMarks[r.name]}%)</span>
              </div>
            {/each}
          </div>
        {/if}
        {#if liveField && liveUnis.length > 0}
          <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border)">
            <div style="font-family: var(--font-head); font-size: .65rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--accent2); margin-bottom: .7rem">
              APS vs Your Target Universities — {liveField.label}
            </div>
            {#each liveUnis as uid}
              {@const uni = UNIVERSITIES.find(u => u.id === uid)}
              {#if uni}
                {@const req = liveField.apsReqs[uid]}
                {#if !req}
                  <div class="target-row close">
                    <span class="target-uni">{uni.abbr}</span>
                    <span class="target-req">Requirements vary — check university website</span>
                    <span class="target-badge close">CHECK</span>
                  </div>
                {:else}
                  {@const isUCT = uid === 'uct'}
                  {@const cAPS  = isUCT ? liveBest6.reduce((s, r) => s + r.pct, 0) : liveAPS}
                  {@const diff  = cAPS - req}
                  {@const cls   = diff >= 0 ? 'met' : diff >= -4 ? 'close' : 'gap'}
                  {@const badge = diff >= 0 ? 'MET ✓' : diff >= -4 ? `${Math.abs(diff)} pts short` : `${Math.abs(diff)} pts below`}
                  <div class="target-row {cls}">
                    <div style="flex: 1">
                      <div class="target-uni">{uni.abbr} <span style="font-weight:300;font-size:.72rem;color:var(--muted)">{uni.city}</span></div>
                      <div class="target-req">Min for {liveField.label}: <strong>{isUCT ? `${req}/600` : `${req}/42`}</strong></div>
                    </div>
                    <span class="target-badge {cls}">{badge}</span>
                  </div>
                {/if}
              {/if}
            {/each}
          </div>
        {:else if liveField}
          <div style="margin-top: .8rem; font-size: .8rem; color: var(--muted); font-weight: 300">Select universities in Section 2 to compare requirements.</div>
        {/if}
      </div>
    {/if}

    <!-- Section questions -->
    {@const sec = sections[$currentSection]}
    {#each sec.questions as q, qi}
      <div class="card" style="animation-delay: {qi * 0.07}s">
        <div class="section-label">{sec.label}</div>
        <div class="q-title">{q.title}</div>
        {#if 'sub' in q && q.sub}<div class="q-sub">{q.sub}</div>{/if}

        {#if q.type === 'single'}
          <div class="options {'cols' in q ? q.cols : ''}">
            {#each ('options' in q ? q.options : []) as o}
              <button class="opt {$answers[q.id] === o.val ? 'selected' : ''}" on:click={() => setA(q.id, o.val)}>
                <div class="opt-dot"></div>
                <div class="opt-text">
                  <div class="opt-label">{o.label}</div>
                  {#if 'sub' in o && o.sub}<div class="opt-sub">{o.sub}</div>{/if}
                </div>
              </button>
            {/each}
          </div>

        {:else if q.type === 'multi'}
          <div class="options {'cols' in q ? q.cols : ''}">
            {#each ('options' in q ? q.options : []) as o}
              {@const sel = arr($answers[q.id]).includes(o.val)}
              <button class="check-opt {sel ? 'selected' : ''}" on:click={() => toggleMulti(q.id, o.val)}>
                <div class="check-box">{sel ? '✓' : ''}</div>
                <div class="opt-label">{o.label}</div>
              </button>
            {/each}
          </div>

        {:else if q.type === 'slider'}
          {@const sliderVal = num($answers[q.id], 'def' in q ? q.def : 30)}
          <div class="slider-wrap">
            <div class="slider-labels">
              <span>{'min' in q ? q.min : 0}{'unit' in q ? q.unit : ''}</span>
              <span>{'max' in q ? q.max : 100}{'unit' in q ? q.unit : ''}</span>
            </div>
            <input
              type="range"
              min={'min' in q ? q.min : 0}
              max={'max' in q ? q.max : 100}
              step={'step' in q ? q.step : 1}
              value={sliderVal}
              on:input={(e) => setSlider(q.id, Number(e.currentTarget.value))}
            />
            <div class="slider-val">{sliderVal}{'unit' in q ? q.unit : ''}</div>
          </div>

        {:else if q.type === 'field_select'}
          <div class="field-select-grid">
            {#each FIELDS as f}
              <button class="field-btn {$answers['field'] === f.id ? 'selected' : ''}" on:click={() => toggleField(f.id)}>
                <div class="field-icon">{f.icon}</div>
                <div class="field-label">{f.label}</div>
              </button>
            {/each}
          </div>
          {#if FIELDS.find(f => f.id === $answers['field'])}
            {@const fd = FIELDS.find(f => f.id === $answers['field'])}
            {#if fd}
              <div style="font-size: .78rem; color: var(--muted); background: var(--surface2); border-radius: 8px; padding: .6rem .8rem; font-weight: 300">
                ℹ️ <strong style="color: var(--text)">{fd.label}:</strong> {fd.notes}
              </div>
            {/if}
          {/if}

        {:else if q.type === 'uni_select'}
          {@const uniSel = arr($answers['universities'])}
          <div class="uni-grid">
            {#each UNIVERSITIES as u}
              <button class="uni-btn {uniSel.includes(u.id) ? 'selected' : ''}" on:click={() => toggleUni(u.id)}>
                <span class="uni-abbr">{u.abbr}</span>
                <div>
                  <div class="opt-label" style="font-size: .8rem">{u.name}</div>
                  <div class="uni-name">{u.city}</div>
                </div>
              </button>
            {/each}
          </div>
          {#if uniSel.length >= 4}
            <div style="font-size: .75rem; color: var(--muted); margin-top: .5rem; text-align: center">Maximum 4 universities selected</div>
          {/if}

        {:else if q.type === 'text_input'}
          <input
            class="text-input"
            type="text"
            placeholder={'placeholder' in q ? q.placeholder : ''}
            value={str($answers[q.id])}
            on:input={(e) => setA(q.id, e.currentTarget.value)}
          />

        {:else if q.type === 'subject_table'}
          <div class="subject-grid">
            {#each SUBJECTS as s}
              <div class="subj-row">
                <div class="subj-name">{s}</div>
                <div class="rating-dots">
                  {#each [1,2,3,4,5] as i}
                    <div
                      class="dot {i <= $subjectRatings[s] ? `filled lvl-${$subjectRatings[s]}` : ''}"
                      on:click={() => setSubjRating(s, i)}
                      on:keydown={(e) => e.key === 'Enter' && setSubjRating(s, i)}
                      role="button"
                      tabindex="0"
                      aria-label="Rate {s} confidence {i}"
                    ></div>
                  {/each}
                </div>
                <select value={$subjectMarks[s]} on:change={(e) => setSubjMark(s, e.currentTarget.value)}>
                  <option value="">Mark%</option>
                  {#each MARK_RANGES as rng}
                    <option value={rng} selected={$subjectMarks[s] === rng}>{rng}%</option>
                  {/each}
                </select>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/each}

    <!-- Navigation -->
    <div class="nav">
      {#if $currentSection > 0}
        <button class="btn btn-back" on:click={prevSection}>← Back</button>
      {:else}
        <div></div>
      {/if}
      {#if $currentSection < sections.length - 1}
        <button class="btn btn-next" on:click={nextSection}>Continue →</button>
      {:else}
        <button class="btn btn-next btn-finish" on:click={nextSection}>See My Study Profile ✦</button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .header {
    text-align: center;
    margin-bottom: 3rem;
    animation: fadeDown .6s ease both;
  }

  h1 {
    font-family: var(--font-head);
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: .8rem;
    background: linear-gradient(135deg, #fff 0%, #c0d0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .header p {
    color: var(--muted);
    font-size: 1rem;
    font-weight: 300;
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .save-card {
    background: linear-gradient(135deg, rgba(56,189,248,.06), rgba(246,201,14,.04));
    border: 1px solid rgba(56,189,248,.2);
    border-radius: 16px;
    padding: 1.5rem;
    margin-top: 1.5rem;
    animation: fadeUp .6s ease both;
  }

  .save-card h3 {
    font-family: var(--font-head);
    font-size: .85rem;
    font-weight: 700;
    color: var(--accent2);
    margin-bottom: .4rem;
    text-transform: uppercase;
    letter-spacing: .08em;
  }

  .save-card p {
    font-size: .85rem;
    color: var(--muted);
    font-weight: 300;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .save-form {
    display: flex;
    gap: .6rem;
    margin-bottom: .8rem;
    flex-wrap: wrap;
  }

  .save-form .text-input { flex: 1; min-width: 180px; }
  .save-form .btn { white-space: nowrap; }

  .save-success {
    background: rgba(74,222,128,.1);
    border: 1px solid rgba(74,222,128,.3);
    color: var(--accent3);
    border-radius: 8px;
    padding: .75rem 1rem;
    font-size: .85rem;
    font-weight: 500;
  }

  .save-error { font-size: .8rem; color: var(--danger); margin-top: .4rem; }

  .google-btn {
    display: flex;
    align-items: center;
    gap: .6rem;
    background: var(--surface2);
    border: 2px solid var(--border);
    color: var(--text);
    border-radius: 100px;
    padding: .7rem 1.4rem;
    font-family: var(--font-head);
    font-size: .8rem;
    font-weight: 700;
    cursor: pointer;
    transition: all .2s;
    width: 100%;
    justify-content: center;
    margin-top: .5rem;
  }

  .google-btn:hover { border-color: var(--text); }

  .next-steps {
    text-align: center;
    margin-top: 1.5rem;
    animation: fadeUp 0.5s ease both;
  }
  .next-steps-label {
    font-size: 0.82rem;
    color: var(--muted);
    margin-bottom: 0.75rem;
  }
  .btn-timetable {
    display: inline-block;
    background: var(--accent);
    color: #0d1117;
    font-family: var(--font-head);
    font-weight: 700;
    font-size: 0.9rem;
    padding: 0.75rem 2rem;
    border-radius: var(--radius);
    text-decoration: none;
    transition: opacity 0.2s;
  }
  .btn-timetable:hover { opacity: 0.85; }
  .btn-ghost-cta { background: transparent; border: 1px solid var(--border); color: var(--muted); margin-top: 0.5rem; }
  .btn-ghost-cta:hover { border-color: var(--accent2); color: var(--accent2); opacity: 1; }
  .challenge-tip { margin-top: 1rem; padding: .75rem 1rem; background: rgba(246,201,14,.06); border: 1px solid rgba(246,201,14,.18); border-radius: 10px; font-size: .8rem; color: var(--muted); line-height: 1.6; text-align: left; }
  .challenge-tip strong { color: var(--accent); }

  .consent-checkboxes {
    background: rgba(246,201,14,.05);
    border: 1px solid rgba(246,201,14,.15);
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: .8rem;
    display: flex;
    flex-direction: column;
    gap: .6rem;
  }

  .consent-label {
    display: flex;
    align-items: flex-start;
    gap: .6rem;
    cursor: pointer;
    font-size: .82rem;
    color: var(--text);
    line-height: 1.5;
  }

  .consent-label input[type="checkbox"] {
    margin-top: .15rem;
    flex-shrink: 0;
    width: 15px;
    height: 15px;
    accent-color: var(--accent);
    cursor: pointer;
  }

  .consent-label a {
    color: var(--accent2);
    text-decoration: underline;
  }

  .consent-minor {
    font-size: .76rem !important;
    color: var(--muted) !important;
    margin: .25rem 0 0 !important;
    line-height: 1.4 !important;
  }
</style>
