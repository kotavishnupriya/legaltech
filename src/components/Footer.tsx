import { Scale, ShieldCheck, BookOpen, FileText } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Scale className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">LandNyaya</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-driven statutory dispute intelligence, title risk scoring, and automated legal drafting for Indian Land & Revenue Jurisdictions.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                State Revenue Codes Ready
              </span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Covered Acts & Reforms
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-emerald-400 transition-colors">Maharashtra Land Revenue Code, 1966</li>
              <li className="hover:text-emerald-400 transition-colors">Karnataka Land Revenue Act, 1964</li>
              <li className="hover:text-emerald-400 transition-colors">UP Revenue Code, 2006</li>
              <li className="hover:text-emerald-400 transition-colors">Telangana & AP RoR / Dharani Act</li>
              <li className="hover:text-emerald-400 transition-colors">Transfer of Property Act, 1882</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Legal Artifacts Generated
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-emerald-400 transition-colors">Record of Rights (RoR) Mutation Petition</li>
              <li className="hover:text-emerald-400 transition-colors">RTI Act 2005 Form A for Land Records</li>
              <li className="hover:text-emerald-400 transition-colors">Advocate Legal Notice (15-Day Demand)</li>
              <li className="hover:text-emerald-400 transition-colors">Tatkal Demarcation (F-Line Survey) Petition</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Statutory Disclaimer
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              LandNyaya AI is an assistive legal tech agent designed to synthesize statutory provisions, identify title risks, and prepare baseline legal drafts. It does not replace professional legal representation before a court of law.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} LandNyaya AI. Built with Next.js 15, TypeScript & Google Gemini.</p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-emerald-400 hover:underline">
              Launch Dispute Dashboard
            </Link>
            <span>•</span>
            <span className="text-slate-400">Indian Legal Tech Innovation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
