export default function MiyagiMatricOptionOnePackaged() {
  const steps = [
    {
      title: "Start with assessment",
      body: "Answer a guided set of questions to understand your current position, subject confidence, habits, and pressure points.",
    },
    {
      title: "Unlock your learner profile",
      body: "See your strengths, risk areas, learning style, and where your focus will have the greatest payoff.",
    },
    {
      title: "Get your study plan",
      body: "Receive a practical weekly plan shaped around your actual profile instead of generic study advice.",
    },
    {
      title: "Generate your timetable",
      body: "Turn the plan into realistic study blocks that fit your school week, energy, and available time.",
    },
    {
      title: "Use matched resources",
      body: "Access revision tools, papers, notes, and drills aligned to your exact subjects and gaps.",
    },
  ];

  const features = [
    {
      title: "Assessment-led",
      body: "The learner is never confused about where to begin. One strong CTA drives the journey.",
    },
    {
      title: "Profile-powered",
      body: "The platform explains why the plan is relevant, which builds trust and motivation.",
    },
    {
      title: "Execution-focused",
      body: "The timetable and resources feel like the outcome of the system, not disconnected add-ons.",
    },
  ];

  const palette = [
    "Obsidian #07070B",
    "Electric Violet #7C3AED",
    "Hot Magenta #FF2DA6",
    "Molten Gold #FFB703",
    "Porcelain #FFF4E8",
  ];

  return (
    <div className="min-h-screen bg-[#05060A] text-[#FFF4E8]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(255,45,166,0.14),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(255,183,3,0.12),transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <header className="mb-8 rounded-[2rem] border border-white/10 bg-black/30 px-6 py-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF2DA6] via-[#7C3AED] to-[#FFB703] text-lg font-bold text-black">
                M
              </div>
              <div>
                <div className="text-lg font-semibold text-white">Miyagi My Matric</div>
                <div className="text-xs uppercase tracking-[0.22em] text-white/45">Option 1 packaged direction</div>
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-3 text-sm text-white/75">
              <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">How it works</button>
              <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">Resources</button>
              <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">Login</button>
              <button className="rounded-2xl bg-gradient-to-r from-[#FF2DA6] via-[#7C3AED] to-[#FFB703] px-4 py-2 font-semibold text-black shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
                Start Assessment
              </button>
            </nav>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-[#FF2DA6]/30 bg-gradient-to-r from-[#FF2DA6]/20 to-[#7C3AED]/20 px-3 py-1 text-xs uppercase tracking-[0.28em] text-[#FFD6EF]">
              premium concept · neon discipline
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
              Discipline your effort. <span className="bg-gradient-to-r from-[#FF2DA6] via-[#C084FC] to-[#FFB703] bg-clip-text text-transparent">Master your matric.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#F3DDD2] md:text-lg">
              Start with one guided assessment. Unlock your learner profile, build a focused study plan, generate a practical timetable, and use matched resources that help you improve with purpose.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button className="rounded-2xl bg-gradient-to-r from-[#FF2DA6] via-[#7C3AED] to-[#FFB703] px-6 py-3 text-sm font-semibold text-black shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
                Start Assessment
              </button>
              <button className="rounded-2xl border border-white/12 bg-white/5 px-6 py-3 text-sm font-medium text-white/90 backdrop-blur">
                See Sample Profile
              </button>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#F3DDD2]">{feature.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#7C3AED] opacity-25 blur-3xl" />
            <div className="absolute -left-6 bottom-0 h-36 w-36 rounded-full bg-[#FF2DA6] opacity-20 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/10 bg-black/25 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="rounded-[1.75rem] border border-white/10 bg-[#09090f] p-5">
                <div className="flex items-center justify-between border-b border-white/8 pb-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-white/45">learner snapshot</div>
                    <div className="mt-1 text-lg font-semibold text-white">Your profile</div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                    74% ready
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Strongest subject", "English Home Language"],
                    ["Priority subject", "Physical Sciences"],
                    ["Study style", "Short focused sessions"],
                    ["Recommended mode", "Guided weekly plan"],
                  ].map(([title, value]) => (
                    <div key={title} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/45">{title}</div>
                      <div className="mt-2 text-sm font-medium text-white">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-white/45">progress path</div>
                      <div className="mt-1 text-sm font-medium text-white">Assessment to execution</div>
                    </div>
                    <div className="rounded-full bg-gradient-to-r from-[#FF2DA6] via-[#7C3AED] to-[#FFB703] px-3 py-1 text-xs font-semibold text-black">
                      Live journey
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-5">
                    {[
                      "Assessment",
                      "Profile",
                      "Study Plan",
                      "Timetable",
                      "Resources",
                    ].map((item, idx) => (
                      <div key={item} className="rounded-xl border border-white/10 bg-black/20 p-3 text-center">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">Step {idx + 1}</div>
                        <div className="mt-1 text-xs font-medium text-white">{item}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/10 bg-black/25 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/60">
              how the platform works
            </div>
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div key={step.title} className="flex gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF2DA6] via-[#7C3AED] to-[#FFB703] text-sm font-semibold text-black">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-base font-semibold text-white">{step.title}</div>
                    <div className="mt-1 text-sm leading-6 text-[#F3DDD2]">{step.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/25 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-white/45">packaged direction summary</div>
                <div className="mt-1 text-2xl font-semibold text-white">Why this option works</div>
              </div>
              <div className="rounded-full border border-[#FFB703]/25 bg-[#FFB703]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#FFD983]">
                chosen route
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold text-white">Positioning</div>
                <p className="mt-2 text-sm leading-6 text-[#F3DDD2]">
                  Feels premium and high-focus without looking like generic school software. It gives the platform confidence and aspiration.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold text-white">Audience fit</div>
                <p className="mt-2 text-sm leading-6 text-[#F3DDD2]">
                  Strong enough for teens to feel energized, but polished enough that parents and schools can trust it.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 md:col-span-2">
                <div className="text-sm font-semibold text-white">Palette package</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-5">
                  {palette.map((p) => (
                    <div key={p} className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-[#F3DDD2]">
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-gradient-to-r from-[#FF2DA6]/12 via-[#7C3AED]/12 to-[#FFB703]/12 p-5">
              <div className="text-lg font-semibold text-white">Recommended next build</div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#F3DDD2]">
                Turn this into a full homepage with final copy, mobile layout, scroll sections, sample profile state, and a stronger conversion path into the assessment.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
