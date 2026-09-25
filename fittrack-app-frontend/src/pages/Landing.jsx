import React from 'react'
import Navbar from '../components/Navbar'

const FeatureCard = ({ icon, title, desc, accent }) => (
  <div className="relative p-6 rounded-2xl bg-surface border border-border hover:border-primary/40 transition group overflow-hidden">
    <div
      className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition ${
        accent === 'lime' ? 'bg-primary' : 'bg-accent'
      }`}
    />
    <div className="relative">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{desc}</p>
    </div>
  </div>
)

const Step = ({ number, title, desc }) => (
  <div className="flex gap-4">
    <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-bg">
      {number}
    </div>
    <div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-muted leading-relaxed">{desc}</p>
    </div>
  </div>
)

const Landing = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-bg text-white">
      <Navbar variant="landing" onLogin={onLogin} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Powered by AI
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight mb-6">
              Track. Improve.{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Evolve.
              </span>
            </h1>

            <p className="text-lg text-muted leading-relaxed mb-8 max-w-lg">
              FitTrack AI is your personal fitness companion — log workouts,
              set goals, and get real-time AI coaching tailored to your body
              and habits.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={onLogin}
                className="px-6 py-3 rounded-xl bg-primary text-bg font-semibold hover:bg-primary/90 transition shadow-glow"
              >
                Start Tracking Free →
              </button>
              <a
                href="#how"
                className="px-6 py-3 rounded-xl border border-border text-white/90 hover:border-white/40 transition"
              >
                See How It Works
              </a>
            </div>

            <div className="flex items-center gap-6 mt-10 text-sm text-muted">
              <div className="flex items-center gap-2">
                <span className="text-primary text-lg">✓</span> No credit card
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary text-lg">✓</span> Free forever
              </div>
            </div>
          </div>

          {/* Right: mock dashboard */}
          <div className="relative animate-fade-up">
            <div className="relative p-6 rounded-3xl bg-surface border border-border shadow-2xl animate-float">
              {/* fake chart header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-muted">This week</p>
                  <p className="text-2xl font-bold">
                    1,880 <span className="text-sm text-muted font-normal">kcal</span>
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  +12%
                </div>
              </div>

              {/* fake bars */}
              <div className="flex items-end justify-between gap-3 h-40 mb-6">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-lg bg-gradient-to-t from-primary/30 to-primary"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              {/* stat pills */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Activities', value: '7' },
                  { label: 'Duration', value: '285m' },
                  { label: 'Score', value: '84' },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-xl bg-bg/60 border border-border">
                    <p className="text-[10px] uppercase tracking-wide text-muted">{s.label}</p>
                    <p className="text-lg font-bold">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* AI bubble */}
              <div className="mt-4 p-3 rounded-xl bg-accent/10 border border-accent/30 flex items-start gap-3">
                <span className="text-xl">🤖</span>
                <p className="text-xs text-accent-foreground/90 text-white/80 leading-relaxed">
                  "Great pace today! Try adding 5 min of stretching to improve recovery."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Everything you need to stay on track
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Three powerful tools working together to keep you moving forward.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon="📊"
            title="Smart Tracking"
            desc="Log any workout — running, cycling, yoga — in seconds. We handle the metrics."
            accent="lime"
          />
          <FeatureCard
            icon="🎯"
            title="Goal Setting"
            desc="Set targets for activities, duration, or calories. Watch your progress build up."
            accent="cyan"
          />
          <FeatureCard
            icon="🤖"
            title="AI Coach"
            desc="Get personalized advice based on your real activity data. Recommendations after every workout."
            accent="lime"
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">How it works</h2>
          <p className="text-muted">Three steps to a fitter you.</p>
        </div>

        <div className="space-y-8">
          <Step
            number="1"
            title="Log your activity"
            desc="Pick a type, enter duration and calories. Done in under 15 seconds."
          />
          <Step
            number="2"
            title="Set a goal"
            desc="Choose a target — 20 workouts this month, burn 5,000 kcal, or run 100 km."
          />
          <Step
            number="3"
            title="Get AI coaching"
            desc="Our AI analyzes your activity history and delivers actionable, personalized advice."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="relative rounded-3xl p-12 text-center bg-gradient-to-br from-primary/20 via-surface to-accent/20 border border-border overflow-hidden">
          <div className="absolute inset-0 bg-bg/40 backdrop-blur-sm" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to level up?
            </h2>
            <p className="text-muted mb-8 max-w-lg mx-auto">
              Join FitTrack AI and let your data drive your progress.
            </p>
            <button
              onClick={onLogin}
              className="px-8 py-3 rounded-xl bg-primary text-bg font-semibold hover:bg-primary/90 transition shadow-glow"
            >
              Get Started Now →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
          <p>© {new Date().getFullYear()} FitTrack AI. All rights reserved.</p>
          <p>Built with ❤️ for people who move.</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing