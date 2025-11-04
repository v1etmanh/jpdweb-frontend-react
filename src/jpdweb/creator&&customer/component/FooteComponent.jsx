export default function FooterComponent() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white w-full mt-auto relative z-10 py-8">
      <div className="max-w-7xl mx-auto px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          {/* About JPD */}
          <div className="pl-0">
            <h5 className="text-xl font-bold mb-4 text-[#06B6D4] text-left">About JPD</h5>
            <ul className="space-y-2 text-left list-none p-0 m-0">
              <li><a href="/about" className="text-sm text-gray-300 hover:text-white transition block no-underline">About</a></li>
              <li><a href="/pricing" className="text-sm text-gray-300 hover:text-white transition block no-underline">Pricing</a></li>
              <li><a href="/contact" className="text-sm text-gray-300 hover:text-white transition block no-underline">Contact</a></li>
              <li><a href="/for-schools" className="text-sm text-gray-300 hover:text-white transition block no-underline">For schools</a></li>
              <li><a href="/testimonials" className="text-sm text-gray-300 hover:text-white transition block no-underline">Testimonials</a></li>
            </ul>
          </div>

          {/* Popular Languages */}
          <div className="pl-0">
            <h5 className="text-xl font-bold mb-4 text-[#F97316] text-left">Popular languages</h5>
            <ul className="space-y-2 text-left list-none p-0 m-0">
              <li><a href="/learn-japanese" className="text-sm text-gray-300 hover:text-white transition block no-underline">Learn Japanese</a></li>
              <li><a href="/learn-english" className="text-sm text-gray-300 hover:text-white transition block no-underline">Learn English</a></li>
              <li><a href="/learn-korean" className="text-sm text-gray-300 hover:text-white transition block no-underline">Learn Korean</a></li>
              <li><a href="/learn-chinese" className="text-sm text-gray-300 hover:text-white transition block no-underline">Learn Chinese</a></li>
              <li><a href="/learn-french" className="text-sm text-gray-300 hover:text-white transition block no-underline">Learn French</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="pl-0">
            <h5 className="text-xl font-bold mb-4 text-[#06B6D4] text-left">Resources</h5>
            <ul className="space-y-2 text-left list-none p-0 m-0">
              <li><a href="/blog" className="text-sm text-gray-300 hover:text-white transition block no-underline">Blog</a></li>
              <li><a href="/forum" className="text-sm text-gray-300 hover:text-white transition block no-underline">Forum</a></li>
              <li><a href="/tutor" className="text-sm text-gray-300 hover:text-white transition block no-underline">Be a tutor</a></li>
              <li><a href="/jobs" className="text-sm text-gray-300 hover:text-white transition block no-underline">Jobs</a></li>
              <li><a href="/proficiency-test" className="text-sm text-gray-300 hover:text-white transition block no-underline">Proficiency test</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="pl-0">
            <h5 className="text-xl font-bold mb-4 text-[#F97316] text-left">Get our App at:</h5>
            <div className="space-y-3 mb-4 text-left">
              <button className="block w-full">
                <div className="bg-[#06B6D4] text-white px-4 py-2 rounded-lg hover:bg-[#0891B2] transition flex items-center gap-2">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="text-xs">Download on the</p>
                    <p className="text-sm font-semibold">App Store</p>
                  </div>
                </div>
              </button>
              <button className="block w-full">
                <div className="bg-[#F97316] text-white px-4 py-2 rounded-lg hover:bg-[#EA580C] transition flex items-center gap-2">
                  <span className="text-2xl">▶️</span>
                  <div>
                    <p className="text-xs">GET IT ON</p>
                    <p className="text-sm font-semibold">Google Play</p>
                  </div>
                </div>
              </button>
            </div>
            <h5 className="text-lg font-bold mb-2 text-[#06B6D4] text-left">Contact</h5>
            <p className="text-sm text-gray-300 text-left">
              Email: <a href="mailto:Mqnyle@gmail.com" className="text-[#F97316] hover:text-[#EA580C] font-semibold no-underline">Mqnyle@gmail.com</a>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-600"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#06B6D4] to-[#0891B2] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">JPD</span>
            </div>
            <span className="font-bold text-lg text-white">JPD</span>
          </div>

          <p className="text-center md:text-left text-sm text-gray-400">
            © 2002-2025 JPD Languages Ltd. All rights reserved.
          </p>

          <div className="flex gap-6 items-center">
            <button className="text-[#06B6D4] hover:text-[#F97316] transition text-2xl">📷</button>
            <button className="text-[#06B6D4] hover:text-[#F97316] transition text-2xl">👤</button>
            <button className="text-[#06B6D4] hover:text-[#F97316] transition text-2xl">✖️</button>
            <button className="text-[#06B6D4] hover:text-[#F97316] transition text-2xl">▶️</button>
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex justify-start gap-6 mt-4">
          <a href="/tos" className="text-sm text-gray-300 hover:text-white transition no-underline">TOS</a>
          <a href="/privacy" className="text-sm text-gray-300 hover:text-white transition no-underline">Privacy</a>
          <a href="/sitemap" className="text-sm text-gray-300 hover:text-white transition no-underline">Sitemap</a>
          <a href="/cookie-policy" className="text-sm text-gray-300 hover:text-white transition no-underline">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}