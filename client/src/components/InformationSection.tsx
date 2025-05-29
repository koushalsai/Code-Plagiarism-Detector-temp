import { Card, CardContent } from "@/components/ui/card";
import { Settings, Code, Cog, ScreenShare, Weight, ArrowLeftRight } from "lucide-react";
import { LANGUAGES } from "@/lib/languages";

export default function InformationSection() {
  return (
    <>
      {/* How It Works and Supported Languages */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* How It Works */}
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Settings className="text-primary mr-2" />
              How It Works
            </h3>
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <div className="font-medium text-slate-900">Language-Specific Tokenization</div>
                  <div>Preserves important syntax structures while normalizing variables</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <div className="font-medium text-slate-900">MOSS Winnowing Algorithm</div>
                  <div>Creates fingerprints using rolling hash windows</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <div className="font-medium text-slate-900">Weighted Similarity Analysis</div>
                  <div>Prioritizes complex structures over simple syntax</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                <div>
                  <div className="font-medium text-slate-900">Pattern Matching</div>
                  <div>Identifies renamed identifiers and structural changes</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supported Languages */}
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Code className="text-primary mr-2" />
              Supported Languages
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {LANGUAGES.map((lang) => (
                <div key={lang.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <lang.icon className={`text-lg ${lang.color}`} />
                    <span className="font-medium text-slate-900">{lang.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">{lang.description}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <Card className="shadow-sm border-slate-200 mb-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-6 text-center">Advanced Detection Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                <ArrowLeftRight className="text-white w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Variable Renaming Detection</h4>
              <p className="text-sm text-slate-600">
                Identifies plagiarism even when variable and function names are changed
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                <ScreenShare className="text-white w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Structural Analysis</h4>
              <p className="text-sm text-slate-600">
                Analyzes code structure, control flow, and logical operations
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-3">
                <Weight className="text-white w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Weighted Scoring</h4>
              <p className="text-sm text-slate-600">
                Complex structures receive higher importance in similarity calculations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
