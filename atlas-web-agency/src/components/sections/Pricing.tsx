export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-blue-950/20 to-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Pricing</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-black">Simple. Transparent. Flat rate.</h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            One price for everything. No hidden fees. No surprises. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="text-xs uppercase tracking-widest text-blue-300 mb-3">Starter</div>
            <div className="text-5xl font-black mb-1">$250</div>
            <div className="text-slate-400 text-sm mb-1">one-time setup</div>
            <div className="text-2xl font-bold text-blue-400 mt-3 mb-1">$14.99<span className="text-base font-normal text-slate-400">/month</span></div>
            <div className="text-xs text-slate-500 mb-6">hosting + maintenance</div>
            <ul className="space-y-3 text-sm text-slate-300 mb-8">
              {['Up to 5 pages', 'Mobile responsive', 'Contact form', 'SSL included', 'Hosting included', 'Domain connection', 'WhatsApp button'].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-blue-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <a
              href="https://wa.me/13137875230?text=Hi!%20I%27m%20interested%20in%20the%20Starter%20website%20plan."
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-3 rounded-xl transition-all"
            >
              Get Started
            </a>
          </div>

          {/* Professional — featured */}
          <div className="bg-blue-600 border border-blue-500 rounded-3xl p-8 relative shadow-2xl shadow-blue-500/20 scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-black px-4 py-1 rounded-full">
              MOST POPULAR
            </div>
            <div className="text-xs uppercase tracking-widest text-blue-100 mb-3">Professional</div>
            <div className="text-5xl font-black mb-1">$250</div>
            <div className="text-blue-200 text-sm mb-1">one-time setup</div>
            <div className="text-2xl font-bold text-white mt-3 mb-1">$49<span className="text-base font-normal text-blue-200">/month</span></div>
            <div className="text-xs text-blue-200 mb-6">hosting + support + edits</div>
            <ul className="space-y-3 text-sm text-white mb-8">
              {['Up to 10 pages', 'Mobile responsive', 'SEO optimization', 'Monthly content edits', 'Google Business setup', 'Priority support', 'WhatsApp + Chat button', 'Blog setup'].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-yellow-300">✓</span> {f}
                </li>
              ))}
            </ul>
            <a
              href="https://wa.me/13137875230?text=Hi!%20I%27m%20interested%20in%20the%20Professional%20website%20plan."
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-white text-blue-700 hover:bg-blue-50 font-bold px-5 py-3 rounded-xl transition-all"
            >
              Get Started
            </a>
          </div>

          {/* Premium */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="text-xs uppercase tracking-widest text-blue-300 mb-3">Premium</div>
            <div className="text-5xl font-black mb-1">$500</div>
            <div className="text-slate-400 text-sm mb-1">one-time setup</div>
            <div className="text-2xl font-bold text-blue-400 mt-3 mb-1">$99<span className="text-base font-normal text-slate-400">/month</span></div>
            <div className="text-xs text-slate-500 mb-6">hosting + full support + SEO</div>
            <ul className="space-y-3 text-sm text-slate-300 mb-8">
              {['Unlimited pages', 'Advanced SEO monthly', 'Booking system', 'E-commerce ready', 'Lead capture forms', 'Analytics dashboard', 'Custom integrations', 'Dedicated support'].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-blue-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <a
              href="https://wa.me/13137875230?text=Hi!%20I%27m%20interested%20in%20the%20Premium%20website%20plan."
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-3 rounded-xl transition-all"
            >
              Get Started
            </a>
          </div>
        </div>

        {/* No hidden fees callout */}
        <div className="mt-10 text-center">
          <p className="text-slate-400 text-sm">
            All plans include: hosting, domain connection, SSL, and customer support.
            <strong className="text-white"> No hidden fees. Cancel anytime.</strong>
          </p>
        </div>
      </div>
    </section>
  )
}
