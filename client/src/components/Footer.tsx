import { Code, Database } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Code className="text-white text-xs" />
              </div>
              <span className="font-semibold text-slate-900">Code Plagiarism Detector</span>
            </div>
            <p className="text-sm text-slate-600">
              Advanced plagiarism detection using the MOSS Winnowing algorithm with language-specific optimizations.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Technology</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• MOSS Winnowing Algorithm</li>
              <li>• PostgreSQL Database</li>
              <li>• React + TypeScript</li>
              <li>• Node.js + Express</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Storage</h4>
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Database className="text-accent text-sm" />
                <span className="text-sm font-medium text-accent-800">PostgreSQL Database</span>
              </div>
              <p className="text-xs text-accent-700">
                Analysis results stored persistently in PostgreSQL database
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 mt-8 pt-6 text-center">
          <p className="text-sm text-slate-500">© 2025 Code Plagiarism Detector.</p>
        </div>
      </div>
    </footer>
  );
}
