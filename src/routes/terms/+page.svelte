<script lang="ts">
  const EFFECTIVE_DATE = 'April 2026';
  const TERMS_VERSION = 'v1-2026-04';
  const CONTACT_EMAIL = 'legal@miyagimymatric.com';
</script>

<svelte:head>
  <title>Terms of Use — Miyagi My Matric</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
</svelte:head>

<div class="app">
  <header class="page-header">
    <a href="/" class="back-link">← Back to home</a>
    <div class="badge">Terms of Use</div>
    <h1>Terms of Use</h1>
    <p class="subtitle">Effective date: {EFFECTIVE_DATE} · Version: {TERMS_VERSION}</p>
  </header>

  <div class="card">
    <h2>1. About This Service</h2>
    <p>
      Miyagi My Matric ("the Platform", "we", "us") is a free, browser-based study planning tool for
      South African Grade 10–12 learners. The Platform provides self-assessment tools, APS calculators,
      timetable builders, study timers, and related educational resources.
    </p>
    <p>
      The Platform is operated by an individual developer and is not affiliated with the Department of
      Basic Education (DBE), the Independent Examinations Board (IEB), any South African university, or
      any other official educational body.
    </p>
    <p>
      The Platform is provided free of charge. We reserve the right to introduce optional paid features
      in future. Core study tools will remain free.
    </p>
  </div>

  <div class="card">
    <h2>2. Acceptance of Terms</h2>
    <p>
      By creating an account or using this Platform, you agree to be bound by these Terms of Use and our
      <a href="/privacy">Privacy Notice</a>. If you do not agree, do not use the Platform.
    </p>
    <p>
      If you are under 18 years old, your parent or guardian must review and accept these terms on your
      behalf. By creating an account for a minor, the parent or guardian confirms their acceptance.
    </p>
    <p>
      We may update these terms from time to time. We will notify users of material changes via the
      Platform. Continued use after notification constitutes acceptance of updated terms.
    </p>
  </div>

  <div class="card">
    <h2>3. Acceptable Use</h2>
    <p>You agree to use the Platform only for lawful purposes and in accordance with these terms. You must not:</p>
    <ul>
      <li>Use the Platform to cheat in any school assessment, examination, or academic submission</li>
      <li>Attempt to access another user's data or circumvent Row Level Security controls</li>
      <li>Attempt to reverse-engineer, scrape, or systematically extract data from the Platform</li>
      <li>Upload content that is unlawful, defamatory, or infringes third-party intellectual property rights</li>
      <li>Use the Platform in any way that could damage, disable, or impair its infrastructure</li>
      <li>Create accounts for others without their knowledge and consent</li>
      <li>Impersonate any person or entity</li>
    </ul>
    <p>
      We reserve the right to suspend or terminate accounts that violate these terms without prior notice.
    </p>
  </div>

  <div class="card">
    <h2>4. Educational Content — No Guarantee of Results</h2>
    <p>
      The Platform's APS calculations, study recommendations, countdown timers, subject strategies, and
      resource suggestions are provided for informational and planning purposes only.
    </p>
    <p>
      We make no warranty, express or implied, that:
    </p>
    <ul>
      <li>Using this Platform will improve your matric results or APS score</li>
      <li>APS thresholds or university admission requirements displayed are current or accurate</li>
      <li>Exam dates displayed match your school's or province's actual schedule</li>
      <li>Study technique recommendations are appropriate for your individual learning needs</li>
    </ul>
    <p>
      Always verify exam dates with your school, university admission requirements with the institution
      directly, and SBA deadlines with your subject teacher.
    </p>
  </div>

  <div class="card">
    <h2>5. Intellectual Property</h2>
    <p>
      All software code, design, branding, and original content on this Platform is owned by the operator
      and is protected by South African copyright law.
    </p>
    <p>
      The "Mr. Miyagi" and "Karate Kid" references used on this Platform are cultural references used
      under fair use principles. We are not affiliated with Sony Pictures, the Karate Kid franchise, or
      any related rights holders.
    </p>
    <p>
      Your personal data (marks, assessment answers, goals) remains your property. You grant us a limited
      licence to store and process it solely to provide the service.
    </p>
    <p>
      You may not copy, reproduce, or redistribute the Platform's codebase or design without written
      permission from the operator.
    </p>
  </div>

  <div class="card">
    <h2>6. Third-Party Resources</h2>
    <p>
      The Platform links to or references third-party resources including Siyavula, DBE Past Papers,
      Matric Live, Maski, Kevinmathscience, SA Exam Papers, and others. These are provided as a
      convenience to learners.
    </p>
    <p>
      We do not control third-party websites or services and are not responsible for their content,
      availability, accuracy, or privacy practices. Links do not imply endorsement.
    </p>
  </div>

  <div class="card">
    <h2>7. Disclaimer of Warranties</h2>
    <p>
      The Platform is provided "as is" and "as available" without warranties of any kind, either express
      or implied, including but not limited to implied warranties of merchantability, fitness for a
      particular purpose, and non-infringement.
    </p>
    <p>
      We do not warrant that the Platform will be uninterrupted, error-free, or free from viruses or
      other harmful components. We do not warrant the accuracy or completeness of any content.
    </p>
  </div>

  <div class="card">
    <h2>8. Limitation of Liability and Indemnity</h2>
    <p>
      To the maximum extent permitted by South African law, the operator shall not be liable for any:
    </p>
    <ul>
      <li>Direct, indirect, incidental, or consequential loss arising from use of the Platform</li>
      <li>Loss of data, study progress, or account access</li>
      <li>Reliance on APS calculations, exam dates, or study recommendations</li>
      <li>Actions of third-party services linked from the Platform</li>
      <li>Interruptions to service due to hosting provider outages, planned maintenance, or force majeure</li>
    </ul>
    <p>
      You agree to indemnify and hold harmless the operator from any claims, losses, or damages arising
      from your misuse of the Platform or violation of these terms.
    </p>
    <p>
      Nothing in these terms excludes or limits liability for fraud, death or personal injury caused by
      negligence, or any other liability that cannot be excluded under South African law.
    </p>
  </div>

  <div class="card">
    <h2>9. Governing Law and Jurisdiction</h2>
    <p>
      These terms are governed by the laws of the Republic of South Africa. Any disputes arising from
      these terms or use of the Platform shall be subject to the jurisdiction of the South African courts.
    </p>
    <p>
      If any provision of these terms is found to be unenforceable, the remaining provisions will
      continue in full force and effect.
    </p>
  </div>

  <div class="card">
    <h2>10. Contact</h2>
    <p>
      For questions about these terms, contact us at
      <a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a>.
    </p>
    <p>
      For privacy-related enquiries, see our <a href="/privacy">Privacy Notice</a> or contact
      <a href="mailto:privacy@miyagimymatric.com">privacy@miyagimymatric.com</a>.
    </p>
  </div>

  <div class="card acceptance-card">
    <p>
      By creating an account on Miyagi My Matric, you confirm that you have read and agree to these
      Terms of Use.
    </p>
    <div class="footer-links">
      <a href="/">← Home</a>
      <a href="/privacy">Privacy Notice</a>
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
    background: rgba(246,201,14,.12);
    color: var(--accent);
    border: 1px solid rgba(246,201,14,.25);
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

  .acceptance-card {
    background: var(--surface2);
    border-color: rgba(246,201,14,.2);
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
