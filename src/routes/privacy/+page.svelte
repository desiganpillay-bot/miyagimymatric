<script lang="ts">
  // No dynamic data — fully static legal page
  const EFFECTIVE_DATE = 'April 2026';
  const TERMS_VERSION = 'v1-2026-04';
  const CONTACT_EMAIL = 'privacy@miyagimymatric.com';
</script>

<svelte:head>
  <title>Privacy Notice — Miyagi My Matric</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
</svelte:head>

<div class="app">
  <header class="page-header">
    <a href="/" class="back-link">← Back to home</a>
    <div class="badge">POPIA Privacy Notice</div>
    <h1>Privacy Notice</h1>
    <p class="subtitle">Effective date: {EFFECTIVE_DATE} · Version: {TERMS_VERSION}</p>
  </header>

  <div class="card">
    <h2>1. Who We Are</h2>
    <p>
      <strong>Miyagi My Matric</strong> ("the Platform", "we", "us") is a free, browser-based study
      planning tool for South African Grade 10–12 learners. The platform is operated by an individual
      developer and is not a registered company. For privacy enquiries, contact us at
      <a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a>.
    </p>
  </div>

  <div class="card">
    <h2>2. What Information We Collect</h2>
    <p>We collect only what is necessary to provide the service:</p>
    <ul>
      <li><strong>Email address</strong> — used solely for authentication (magic link sign-in). We do not send marketing emails.</li>
      <li><strong>Assessment answers</strong> — your grade, exam system (IEB/CAPS), subject selections, and self-rated confidence scores.</li>
      <li><strong>Subject marks</strong> — percentages you enter manually. We do not collect report cards unless you choose to upload one.</li>
      <li><strong>Study sessions</strong> — date, duration, and subject of sessions you log on the platform.</li>
      <li><strong>Goals</strong> — your target university, field of study, and target APS.</li>
      <li><strong>SBA tasks</strong> — task names, due dates, and completion status you enter.</li>
      <li><strong>Device information</strong> — browser type, screen size, and operating system collected automatically for compatibility purposes.</li>
    </ul>
    <p>We do not collect identity documents, home addresses, phone numbers, or financial information.</p>
  </div>

  <div class="card">
    <h2>3. Legal Basis for Processing (POPIA s11)</h2>
    <p>We process your personal information on the following grounds under POPIA section 11:</p>
    <ul>
      <li><strong>Consent</strong> — you provide explicit consent when you check the consent checkbox before creating an account.</li>
      <li><strong>Contract</strong> — processing is necessary to provide the services you have requested (personalised study planning).</li>
      <li><strong>Legitimate interest</strong> — improving the platform's accuracy and usefulness for SA learners generally, where this does not override your interests.</li>
    </ul>
    <p>You may withdraw consent at any time by deleting your account. Withdrawal does not affect the lawfulness of processing before withdrawal.</p>
  </div>

  <div class="card">
    <h2>4. Special Personal Information — Academic Records</h2>
    <p>
      Under POPIA, academic performance data may constitute special personal information. We collect this
      data only with your explicit consent, store it encrypted at rest (via Supabase), and never share it
      with third parties including educational institutions, employers, or advertisers.
    </p>
    <p>
      Your marks and assessment results are visible only to you. No teacher, school, or university can
      access your data on this platform.
    </p>
  </div>

  <div class="card">
    <h2>5. Minor Users (Under 18)</h2>
    <p>
      Most users of this platform are under 18 years old. Under POPIA, processing personal information
      of children requires the consent of a competent person (parent or guardian).
    </p>
    <p>
      By accepting these terms, a parent or guardian confirms they have reviewed and approved their
      child's use of this platform. We recommend parents read this notice with their child before
      account creation.
    </p>
    <p>
      If you are under 18, please show this notice to a parent or guardian before creating an account.
    </p>
  </div>

  <div class="card">
    <h2>6. How We Use Your Information</h2>
    <ul>
      <li>Display personalised study recommendations, APS calculations, and countdown timers</li>
      <li>Track study streaks and award XP to encourage consistent study habits</li>
      <li>Surface upcoming SBA deadlines and exam dates relevant to your exam system</li>
      <li>Improve the platform's recommendations based on anonymised, aggregated usage patterns</li>
    </ul>
    <p>We do not use your information for advertising, profiling for commercial purposes, or automated decision-making that has legal or significant effects on you.</p>
  </div>

  <div class="card">
    <h2>7. Who We Share Your Information With</h2>
    <p>We share your personal information only with the following sub-processors, who are contractually bound to protect it:</p>
    <ul>
      <li><strong>Supabase Inc.</strong> — database and authentication provider. Data stored in West EU (Ireland). Supabase is GDPR-compliant and maintains appropriate safeguards for international transfers.</li>
      <li><strong>Vercel Inc.</strong> — website hosting. Vercel does not have access to your personal data stored in Supabase.</li>
    </ul>
    <p>We do not sell, rent, or trade your personal information to any third party.</p>
  </div>

  <div class="card">
    <h2>8. Security Safeguards</h2>
    <ul>
      <li>All data is encrypted in transit (HTTPS/TLS) and at rest (AES-256 via Supabase).</li>
      <li>Row Level Security (RLS) ensures your data is accessible only by your authenticated session — no other user can query your records.</li>
      <li>Authentication uses email magic links — no passwords are stored. We do not offer SMS authentication (SA prepaid numbers change too often to be reliable).</li>
      <li>Access to the Supabase database is restricted to the operator; no third party has admin access.</li>
    </ul>
    <p>
      While we implement reasonable security measures, no internet service can guarantee absolute security.
      In the event of a data breach affecting your rights, we will notify affected users within 72 hours
      of becoming aware of the breach, as required by POPIA.
    </p>
  </div>

  <div class="card">
    <h2>9. Retention and Deletion</h2>
    <p>
      We retain your personal information for as long as your account is active. If you delete your
      account, all personal information associated with your account will be permanently deleted from
      our databases within 30 days.
    </p>
    <p>
      Anonymised, aggregated data (e.g., "X% of users scored above 60% in Mathematics") may be retained
      indefinitely for platform improvement purposes. This data cannot be linked back to you.
    </p>
    <p>
      To request account deletion, email <a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a> from the
      address associated with your account.
    </p>
  </div>

  <div class="card">
    <h2>10. Your Rights Under POPIA</h2>
    <p>You have the right to:</p>
    <ul>
      <li><strong>Access</strong> — request a copy of the personal information we hold about you</li>
      <li><strong>Correction</strong> — request correction of inaccurate or incomplete information</li>
      <li><strong>Deletion</strong> — request deletion of your personal information</li>
      <li><strong>Objection</strong> — object to the processing of your personal information</li>
      <li><strong>Withdraw consent</strong> — withdraw consent at any time, which will result in account closure</li>
      <li><strong>Complain</strong> — lodge a complaint with the Information Regulator (South Africa) at <a href="mailto:inforeg@justice.gov.za">inforeg@justice.gov.za</a></li>
    </ul>
    <p>To exercise any of these rights, email <a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a>. We will respond within 30 days.</p>
  </div>

  <div class="card">
    <h2>11. Limitation of Liability</h2>
    <p>
      Miyagi My Matric is provided free of charge as a study planning aid. It is not affiliated with the
      Department of Basic Education, IEB, any university, or any other official educational body.
    </p>
    <p>
      To the maximum extent permitted by South African law, the operator shall not be liable for any
      direct, indirect, incidental, or consequential loss arising from use of the platform, reliance on
      its study recommendations, or any data breach beyond the operator's reasonable control.
    </p>
    <p>
      The platform's APS calculations, countdown timers, and study recommendations are provided for
      informational purposes only and should not replace official guidance from schools, universities,
      or the DBE.
    </p>
  </div>

  <div class="card">
    <h2>12. Changes to This Notice</h2>
    <p>
      We may update this Privacy Notice from time to time. When we do, we will update the effective date
      and version number at the top of this page and notify users via the platform. Continued use of the
      platform after changes constitutes acceptance of the updated notice.
    </p>
  </div>

  <div class="card acceptance-card">
    <p>
      By creating an account on Miyagi My Matric, you confirm that you have read, understood, and agree
      to this Privacy Notice, and that you consent to the processing of your personal information as
      described herein.
    </p>
    <div class="footer-links">
      <a href="/">← Home</a>
      <a href="/terms">Terms of Use</a>
    </div>
  </div>
</div>

<style>
  .app {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
    position: relative;
    z-index: 1;
  }

  .page-header {
    text-align: center;
    margin-bottom: 2rem;
    animation: fadeDown 0.5s ease both;
  }

  .back-link {
    display: inline-block;
    color: var(--muted);
    text-decoration: none;
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
    transition: color 0.2s;
  }
  .back-link:hover { color: var(--accent2); }

  .badge {
    display: inline-block;
    background: rgba(255,82,82,.12);
    color: var(--accent);
    border: 1px solid rgba(255,82,82,.25);
    border-radius: 999px;
    padding: 0.3rem 1rem;
    font-family: var(--font-head);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  h1 {
    font-family: var(--font-head);
    font-size: clamp(1.8rem, 5vw, 2.5rem);
    font-weight: 800;
    color: var(--text);
    margin: 0 0 0.5rem;
  }

  .subtitle {
    color: var(--muted);
    font-size: 0.875rem;
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 1.25rem;
    animation: fadeUp 0.4s ease both;
  }

  h2 {
    font-family: var(--font-head);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--accent);
    margin: 0 0 1rem;
  }

  p {
    color: var(--text);
    line-height: 1.7;
    margin: 0 0 0.75rem;
    font-size: 0.95rem;
  }
  p:last-child { margin-bottom: 0; }

  ul {
    color: var(--text);
    line-height: 1.7;
    margin: 0 0 0.75rem 1.25rem;
    font-size: 0.95rem;
  }
  ul:last-child { margin-bottom: 0; }
  li { margin-bottom: 0.5rem; }
  li:last-child { margin-bottom: 0; }

  a {
    color: var(--accent2);
    text-decoration: none;
  }
  a:hover { text-decoration: underline; }

  strong { color: var(--text); }

  .acceptance-card {
    background: var(--surface2);
    border-color: rgba(255,82,82,.2);
    text-align: center;
  }

  .footer-links {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1.25rem;
  }

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>
