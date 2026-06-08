import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Clock, FileSearch, ArrowRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  { q: 'What is SCVS?', a: 'The Student Clearance & Verification System digitizes the institutional clearance process, replacing paper-based workflows with a transparent, trackable digital system.' },
  { q: 'How long does clearance take?', a: 'Processing times vary, but the digital system significantly reduces delays. Most clearances are completed within 5-10 business days.' },
  { q: 'What documents do I need?', a: 'You will need your school fees receipt, student ID, faculty slip, hostel clearance proof, and a passport photograph.' },
  { q: 'Can I track my progress?', a: 'Yes! The student dashboard provides real-time tracking of each department\'s approval status.' },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-surface-50 font-sans text-surface-900 selection:bg-primary-500 selection:text-white">
      
      {/* Full-Width Sexy Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <nav className="w-full bg-white/85 backdrop-blur-2xl shadow-[0_4px_30px_rgb(0,0,0,0.05)] border-b border-white/50 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo Segment */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2.5 rounded-full shadow-lg shadow-primary-600/30 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-surface-900 to-surface-600">SCVS</span>
            </div>

            {/* Action Segment */}
            <div className="flex items-center gap-6 sm:gap-10">
              <Link to="/verify" className="text-sm font-bold text-surface-600 hover:text-primary-600 transition-colors duration-300 hidden sm:block">Verify Certificate</Link>
              <Link to="/login" className="text-sm font-bold text-surface-600 hover:text-primary-600 transition-colors duration-300">Sign In</Link>
              <Link to="/register" className="text-sm font-bold text-surface-600 hover:text-primary-600 transition-colors duration-300">Get Started</Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Section (Slideshow Effect) */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-white overflow-hidden">
        {/* Animated Background (Ken Burns) */}
        <div className="absolute inset-0 bg-[url('/university.jpg')] bg-cover bg-center pointer-events-none animate-ken-burns origin-center"></div>
        
        <div className="absolute inset-0 bg-surface-950/80 backdrop-blur-[2px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 pt-20">
          <h1 
            className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter leading-[1.1] mb-8 animate-fade-in drop-shadow-2xl" 
            style={{ animationDelay: '0.2s' }}
          >
            Clearance, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-100">Without the Chaos.</span>
          </h1>
          
          <p 
            className="text-lg md:text-2xl text-surface-200 max-w-3xl mx-auto mb-12 font-light leading-relaxed animate-fade-in drop-shadow-lg" 
            style={{ animationDelay: '0.6s' }}
          >
            Say goodbye to paper trails and endless queues. Submit, track, and receive your final university clearance entirely online.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" 
            style={{ animationDelay: '1.0s' }}
          >
            <Link to="/register" className="w-full sm:w-auto inline-flex justify-center items-center gap-3 bg-primary-600 text-white font-bold text-lg px-10 py-4 rounded-2xl hover:bg-primary-500 transition shadow-xl shadow-primary-600/30 hover:-translate-y-1">
              Start Application <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/verify" className="w-full sm:w-auto inline-flex justify-center items-center gap-3 bg-white/10 text-white font-bold text-lg px-10 py-4 rounded-2xl hover:bg-white/20 transition backdrop-blur-md border border-white/20 shadow-xl hover:-translate-y-1">
              <FileSearch className="w-5 h-5" /> Verify a Certificate
            </Link>
          </div>
        </div>
      </section>

      {/* Workflow Section (Spaced Out Alternating Layout) */}
      <section className="py-[200px] bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-32">
            <h2 className="text-4xl md:text-5xl font-extrabold text-surface-900 mb-6 tracking-tight">How the system works</h2>
            <p className="text-xl text-surface-500">A streamlined three-step process designed to save you weeks of walking between departments.</p>
          </div>

          <div className="space-y-40">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <div className="flex-1 md:order-2">
                <div className="bg-primary-50 rounded-[3rem] p-12 relative shadow-2xl shadow-primary-500/10">
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-primary-600 text-white flex items-center justify-center text-2xl font-bold rounded-2xl shadow-xl">1</div>
                  <FileSearch className="w-32 h-32 text-primary-200" />
                </div>
              </div>
              <div className="flex-1 md:order-1">
                <h3 className="text-3xl font-bold mb-4">Apply & Upload Online</h3>
                <p className="text-lg text-surface-500 leading-relaxed mb-6">Create your account and upload all required documents (receipts, ID cards, faculty slips) directly from your phone or laptop. No more making dozens of photocopies.</p>
                <ul className="space-y-3">
                  {['Secure document upload', 'Auto-fill student data', 'Instant submission'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-medium text-surface-700"><CheckCircle className="w-5 h-5 text-primary-500" /> {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <div className="flex-1">
                <div className="bg-warning-50 rounded-[3rem] p-12 relative shadow-2xl shadow-warning-500/10">
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-warning-500 text-white flex items-center justify-center text-2xl font-bold rounded-2xl shadow-xl">2</div>
                  <Clock className="w-32 h-32 text-warning-200" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-4">Live Department Tracking</h3>
                <p className="text-lg text-surface-500 leading-relaxed mb-6">Watch your application move through the Library, Bursary, Faculty, and other departments in real-time. If a document is rejected, you'll know instantly and can fix it online.</p>
                <ul className="space-y-3">
                  {['Real-time status updates', 'Direct officer feedback', 'Instant resubmission'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-medium text-surface-700"><CheckCircle className="w-5 h-5 text-warning-500" /> {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <div className="flex-1 md:order-2">
                <div className="bg-success-50 rounded-[3rem] p-12 relative shadow-2xl shadow-success-500/10">
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-success-500 text-white flex items-center justify-center text-2xl font-bold rounded-2xl shadow-xl">3</div>
                  <Shield className="w-32 h-32 text-success-200" />
                </div>
              </div>
              <div className="flex-1 md:order-1">
                <h3 className="text-3xl font-bold mb-4">Download Verified Certificate</h3>
                <p className="text-lg text-surface-500 leading-relaxed mb-6">Once all departments have approved your application, your final clearance certificate is automatically generated and ready to download or print.</p>
                <ul className="space-y-3">
                  {['Cryptographically secure', 'QR code verification', 'Printable PDF format'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-medium text-surface-700"><CheckCircle className="w-5 h-5 text-success-500" /> {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ (Side-by-Side Layout) */}
      <section className="py-[200px] bg-surface-50">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-5 sticky top-32">
            <h2 className="text-4xl md:text-5xl font-extrabold text-surface-900 mb-6 tracking-tight">Got questions?</h2>
            <p className="text-xl text-surface-500 mb-8">Everything you need to know about the SCVS platform and your clearance process.</p>
            <p className="text-lg text-surface-900 font-medium flex items-center gap-2 flex-wrap">
              Ready to start?
              <Link to="/register" className="inline-flex items-center gap-1 text-primary-600 font-bold hover:text-primary-700 transition">
                Create an account <ArrowRight className="w-5 h-5" />
              </Link>
            </p>
          </div>
          
          <div className="lg:col-span-7 space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-surface-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)} 
                  className="w-full flex items-center justify-between px-8 py-6 text-left font-bold text-surface-900 text-lg focus:outline-none"
                >
                  {faq.q} 
                  <span className={`flex-shrink-0 ml-4 p-2 rounded-full bg-surface-100 text-surface-500 transition-transform ${openFaq === i ? 'rotate-180 bg-primary-50 text-primary-600' : ''}`}>
                    <ChevronDown className="w-5 h-5" />
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-8 pb-8 text-lg text-surface-600 leading-relaxed border-t border-surface-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-surface-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary-600" />
            <span className="text-xl font-bold tracking-tight text-surface-900">SCVS</span>
          </div>
          <p className="text-surface-500 font-medium">© {new Date().getFullYear()} Student Clearance & Verification System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
