import { Card, CardContent } from "@/components/ui/card";
import { Settings, Code, ScreenShare, Weight, ArrowLeftRight } from "lucide-react";
import { LANGUAGES } from "@/lib/languages";

export default function InformationSection() {
  return (
    <>
      {/* How It Works and Supported Languages */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* How It Works */}
        <Card className="shadow-sm border-border dark:border-muted">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Settings className="text-primary" />
              <span className="ml-2">How It Works</span>
            </h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              {[
                'Language-Specific Tokenization',
                'MOSS Winnowing Algorithm',
                'Weighted Similarity Analysis',
                'Pattern Matching',
              ].map((step, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{step}</div>
                    <div className="text-muted-foreground">
                      {(
                        {
                          0: 'Preserves important syntax structures while normalizing variables',
                          1: 'Creates fingerprints using rolling hash windows',
                          2: 'Prioritizes complex structures over simple syntax',
                          3: 'Identifies renamed identifiers and structural changes',
                        } as Record<number, string>
                      )[idx]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Supported Languages */}
        <Card className="shadow-sm border-border dark:border-muted">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Code className="text-primary mr-2" />
              Supported Languages
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {LANGUAGES.map((lang) => (
                <div
                  key={lang.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg dark:bg-card"
                >
                  <div className="flex items-center space-x-3">
                    <lang.icon className={`text-lg ${lang.color}`} />
                    <span className="font-medium text-foreground">{lang.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {lang.description}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


      </div>

      {/* Features Section */}
      <Card className="shadow-sm border-border dark:border-muted mb-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
            Advanced Detection Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: ArrowLeftRight,
                title: 'Variable Renaming Detection',
                desc: 'Identifies plagiarism even when variable and function names are changed',
                bg: 'bg-primary',
              },
              {
                icon: ScreenShare,
                title: 'Structural Analysis',
                desc: 'Analyzes code structure, control flow, and logical operations',
                bg: 'bg-accent',
              },
              {
                icon: Weight,
                title: 'Weighted Scoring',
                desc: 'Complex structures receive higher importance in similarity calculations',
                bg: 'bg-secondary',
              },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className={`${feature.bg} rounded-lg flex items-center justify-center mx-auto mb-3 w-12 h-12`}>
                  <feature.icon className="text-primary-foreground w-6 h-6" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
