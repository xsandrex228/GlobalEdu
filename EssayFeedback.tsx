import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, AlertCircle, CheckCircle, Lightbulb, TrendingUp, Target, FileText, ChevronRight, Edit3 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Textarea } from '@/app/components/ui/textarea';
import { Input } from '@/app/components/ui/input';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

type EssayStep = 'prompt' | 'essay' | 'feedback';

interface Suggestion {
  id: string;
  originalText: string;
  correctedText: string;
  type: 'grammar' | 'clarity' | 'structure' | 'impact' | 'tone';
  explanation: string;
}

interface StructuralIssue {
  section: string;
  issue: string;
  suggestion: string;
}

const suggestionTypeConfig = {
  grammar: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: AlertCircle },
  clarity: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Lightbulb },
  structure: { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', icon: TrendingUp },
  impact: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: Sparkles },
  tone: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: CheckCircle },
};

export function EssayFeedback() {
  const [step, setStep] = useState<EssayStep>('prompt');
  const [essayPrompt, setEssayPrompt] = useState('');
  const [wordLimit, setWordLimit] = useState('');
  const [essay, setEssay] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Feedback state
  const [promptType, setPromptType] = useState('');
  const [overallSummary, setOverallSummary] = useState('');
  const [structuralIssues, setStructuralIssues] = useState<StructuralIssue[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [promptAlignment, setPromptAlignment] = useState({ aligned: '', notAligned: '' });
  const [improvementPlan, setImprovementPlan] = useState<string[]>([]);
  const [readinessScore, setReadinessScore] = useState(0);
  const [strengths, setStrenths] = useState<string[]>([]);
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [rewriteSuggestion, setRewriteSuggestion] = useState('');

  const analyzePrompt = () => {
    if (!essayPrompt.trim()) return;
    
    // Simulate prompt analysis
    const mockPromptType = essayPrompt.toLowerCase().includes('why') 
      ? 'Motivational Essay - "Why this program?"'
      : essayPrompt.toLowerCase().includes('leadership')
      ? 'Leadership Experience Essay'
      : essayPrompt.toLowerCase().includes('challenge') || essayPrompt.toLowerCase().includes('obstacle')
      ? 'Personal Challenge / Growth Essay'
      : 'Personal Statement';
    
    setPromptType(mockPromptType);
    setStep('essay');
  };

  const analyzeEssay = () => {
    if (!essay.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate comprehensive AI analysis with dynamic scoring
    setTimeout(() => {
      // Calculate dynamic score based on essay characteristics
      const wordCount = essay.trim().split(/\s+/).length;
      const sentenceCount = essay.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      const avgSentenceLength = wordCount / Math.max(sentenceCount, 1);
      const hasSpecificExamples = /specific|example|instance|experience|project/i.test(essay);
      const hasTransitions = /however|therefore|furthermore|moreover|additionally|consequently/i.test(essay);
      const hasStrongOpening = essay.length > 50 && !/^I am writing|^My name is|^I want to/i.test(essay);
      const hasQuantifiableDetails = /\d+%|\d+ years?|\d+ months?|\d+ students?/i.test(essay);
      
      // Base score calculation (0-100 scale)
      let score = 50; // Start at middle
      
      // Word count assessment
      const targetWordCount = wordLimit ? parseInt(wordLimit) : 500;
      if (wordCount >= targetWordCount * 0.8 && wordCount <= targetWordCount * 1.1) {
        score += 10; // Appropriate length
      } else if (wordCount < targetWordCount * 0.5) {
        score -= 15; // Too short
      }
      
      // Sentence structure
      if (avgSentenceLength > 10 && avgSentenceLength < 25) {
        score += 8; // Good sentence variety
      }
      
      // Content quality
      if (hasSpecificExamples) score += 12;
      if (hasTransitions) score += 8;
      if (hasStrongOpening) score += 10;
      if (hasQuantifiableDetails) score += 7;
      
      // Complexity and depth
      const uniqueWords = new Set(essay.toLowerCase().match(/\b\w+\b/g) || []).size;
      const vocabularyRichness = uniqueWords / wordCount;
      if (vocabularyRichness > 0.5) score += 10;
      
      // Clamp score between 35 and 95 for realism
      score = Math.max(35, Math.min(95, Math.round(score)));
      
      // Generate feedback based on score range
      const isHighScore = score >= 75;
      const isMidScore = score >= 55 && score < 75;
      
      setOverallSummary(
        isHighScore
          ? 'Your essay demonstrates strong personal voice and specific examples that effectively connect your experiences to the program. The structure is clear with smooth transitions. Language is articulate with minimal issues. Overall competitiveness: strong - with minor polish, this essay will stand out in a global applicant pool.'
          : isMidScore
          ? 'Your essay demonstrates genuine interest but could benefit from more specificity in connecting your experiences to the program. The structure is present but transitions need strengthening. Language is generally clear with some areas for improvement. Overall competitiveness: moderate - strategic improvements will significantly boost your chances.'
          : 'Your essay shows potential but needs substantial development. Add specific examples, strengthen your connection to the program, and improve structural flow. Language clarity needs attention. Overall competitiveness: needs work - significant revision required to be competitive.'
      );

      setStructuralIssues([
        {
          section: 'Introduction',
          issue: 'Opens with a generic statement about the field',
          suggestion: 'Replace with a specific moment, observation, or question that sparked your interest. Show the committee who you are in the first sentence.'
        },
        {
          section: 'Body - Experience Section',
          issue: 'Lists activities without showing impact or learning',
          suggestion: 'Choose 1-2 experiences and go deep. What specific problem did you solve? What did you learn? How did it change your thinking?'
        },
        {
          section: 'Transition between paragraphs',
          issue: 'Ideas feel disconnected - jumps from school project to future goals',
          suggestion: 'Add a connecting sentence: "This project revealed my need to understand X, which is why I seek Y in this program."'
        },
        {
          section: 'Conclusion',
          issue: 'Generic statement about "making a difference"',
          suggestion: 'Be specific about what you will contribute and how this program uniquely enables your next steps. Reference specific courses, faculty, or resources.'
        }
      ]);

      setSuggestions([
        {
          id: '1',
          originalText: 'I have always been passionate about science.',
          correctedText: 'When I isolated my first DNA sample in tenth grade, watching the delicate white strands appear in the test tube, I knew I wanted to understand life at the molecular level.',
          type: 'impact',
          explanation: 'Generic statements don\'t show your unique voice. Specific moments create vivid images and reveal genuine passion.'
        },
        {
          id: '2',
          originalText: 'This program will help me achieve my goals because it has good resources.',
          correctedText: 'Dr. Chen\'s research on CRISPR applications in agricultural sustainability directly connects to my goal of developing drought-resistant crops for my region.',
          type: 'clarity',
          explanation: 'Name specific professors, courses, or research that align with your goals. Shows you\'ve done research and have clear reasons for applying.'
        },
        {
          id: '3',
          originalText: 'I think I would be a good fit for this program.',
          correctedText: 'My experience leading our school\'s biotech club and securing funding for lab equipment demonstrates the initiative and resourcefulness your program values.',
          type: 'tone',
          explanation: 'Replace hesitant language ("I think", "maybe", "hopefully") with confident, evidence-based statements.'
        },
        {
          id: '4',
          originalText: 'In todays world, technology is very important and effects everyone.',
          correctedText: 'In today\'s world, technology is critically important and affects everyone.',
          type: 'grammar',
          explanation: 'Common errors: "todays" needs an apostrophe (today\'s), "effects" should be "affects" as a verb, "very" is filler - use stronger adjectives.'
        },
        {
          id: '5',
          originalText: 'I participated in various extracurricular activities including debate, science club, and volunteering.',
          correctedText: 'As debate captain, I developed argument frameworks that I later applied to our science club\'s research presentations, increasing our funding success rate by 40%.',
          type: 'impact',
          explanation: 'Don\'t list activities. Show connections between them and demonstrate measurable outcomes or transferable skills.'
        }
      ]);

      setPromptAlignment({
        aligned: '• Mentions interest in the field\n• References some relevant experience\n• Expresses desire to attend the program',
        notAligned: '• Does NOT explain WHY this specific program (prompt requires this)\n• Does NOT connect past experiences to future contributions\n• Does NOT demonstrate knowledge of program-specific offerings'
      });

      setImprovementPlan([
        'Research the program deeply: identify 2-3 specific courses, professors, or unique resources. Mention them by name in your essay.',
        'Replace your introduction with a specific anecdote or moment that shows (not tells) your passion.',
        'For each experience you mention, add: What specific challenge did you face? What did you learn? How does it connect to this program?',
        'Strengthen your conclusion by stating your specific contribution (not just what you\'ll gain) and naming concrete next steps enabled by the program.',
        'Remove all instances of "I think", "maybe", "hopefully", "try to" - replace with confident, direct statements backed by evidence.'
      ]);

      setReadinessScore(score);
      
      setStrenths([
        'Clear genuine interest in the field',
        'Relevant academic and extracurricular background',
        'Appropriate length and basic structure present'
      ]);

      setRedFlags([
        'Generic language that could apply to any program or applicant',
        'Lacks specific knowledge of the program (weak "Why this program?" answer)',
        'Lists experiences without showing depth, impact, or reflection',
        'Weak transitions make the essay feel disconnected',
        'Grammar errors reduce credibility'
      ]);

      setRewriteSuggestion(
        'Consider this stronger introduction:\n\n' +
        '"When our village\'s harvest failed for the third consecutive year, I didn\'t see a climate crisis—I saw a molecular puzzle. ' +
        'If drought-resistant genes exist in wild wheat varieties, why couldn\'t we engineer them into our local crops? ' +
        'This question drove me to build a makeshift genetics lab in my school and ultimately led me to your program\'s focus on agricultural biotechnology."\n\n' +
        'Why this works:\n' +
        '• Opens with a specific, visual moment\n' +
        '• Shows intellectual curiosity through a question\n' +
        '• Reveals your unique background and perspective\n' +
        '• Creates a clear narrative bridge to the program'
      );

      setIsAnalyzing(false);
      setStep('feedback');
    }, 2500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const resetAnalysis = () => {
    setStep('prompt');
    setEssayPrompt('');
    setWordLimit('');
    setEssay('');
    setPromptType('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="size-8 text-blue-600" />
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
          AI Essay Mentor
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
          Expert feedback tailored to your specific essay prompt. Get strategic guidance from an admissions perspective.
        </p>
      </motion.div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto">
        <div className={`flex items-center gap-2 ${step === 'prompt' ? 'text-blue-600' : step === 'essay' || step === 'feedback' ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'prompt' ? 'bg-blue-100' : step === 'essay' || step === 'feedback' ? 'bg-green-100' : 'bg-gray-100'}`}>
            {step === 'essay' || step === 'feedback' ? <CheckCircle className="size-5" /> : <span className="text-sm font-medium">1</span>}
          </div>
          <span className="text-sm font-medium">Enter Prompt</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-300" />
        <div className={`flex items-center gap-2 ${step === 'essay' ? 'text-blue-600' : step === 'feedback' ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'essay' ? 'bg-blue-100' : step === 'feedback' ? 'bg-green-100' : 'bg-gray-100'}`}>
            {step === 'feedback' ? <CheckCircle className="size-5" /> : <span className="text-sm font-medium">2</span>}
          </div>
          <span className="text-sm font-medium">Submit Essay</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-300" />
        <div className={`flex items-center gap-2 ${step === 'feedback' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'feedback' ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <span className="text-sm font-medium">3</span>
          </div>
          <span className="text-sm font-medium">Get Feedback</span>
        </div>
      </div>

      {/* Step 1: Essay Prompt */}
      <AnimatePresence mode="wait">
        {step === 'prompt' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-8 shadow-md max-w-3xl mx-auto">
              <div className="flex items-start gap-3 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <Target className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Why provide the prompt first?</h3>
                  <p className="text-xs text-gray-700">
                    Different prompts require different structures and strategies. By understanding your specific question, our AI can evaluate whether your essay actually answers what's being asked.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    Essay Prompt / Question <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={essayPrompt}
                    onChange={(e) => setEssayPrompt(e.target.value)}
                    placeholder='e.g., "Why do you want to participate in this program?" or "Describe a challenge you overcame and what you learned."'
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    Word Limit (optional)
                  </label>
                  <Input
                    type="text"
                    value={wordLimit}
                    onChange={(e) => setWordLimit(e.target.value)}
                    placeholder="e.g., 500 words or 3000 characters"
                  />
                </div>

                <Button
                  onClick={analyzePrompt}
                  disabled={!essayPrompt.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Continue to Essay
                  <ChevronRight className="size-4 ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Essay Input */}
        {step === 'essay' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-8 shadow-md max-w-4xl mx-auto">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Your Essay</h3>
                    <p className="text-sm text-gray-600">Paste your essay below for analysis</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setStep('prompt')}>
                    Change Prompt
                  </Button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Prompt Type Detected:</p>
                  <p className="text-sm font-medium text-gray-900">{promptType}</p>
                  {wordLimit && (
                    <p className="text-xs text-gray-600 mt-2">Word Limit: {wordLimit}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <Textarea
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  placeholder="Paste your complete essay here..."
                  className="min-h-[400px] text-sm leading-relaxed"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {essay.split(/\s+/).filter(Boolean).length} words • {essay.length} characters
                  </span>
                </div>
              </div>

              <Button
                onClick={analyzeEssay}
                disabled={essay.length < 100 || isAnalyzing}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="size-5 mr-2" />
                    </motion.div>
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-5 mr-2" />
                    Analyze Essay
                  </>
                )}
              </Button>

              {essay.length < 100 && essay.length > 0 && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Write at least 100 characters for meaningful feedback
                </p>
              )}
            </Card>
          </motion.div>
        )}

        {/* Step 3: Feedback */}
        {step === 'feedback' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Header with score */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="p-6 shadow-md lg:col-span-1">
                <div className="text-center space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Readiness Score</p>
                    <div className={`text-5xl font-bold ${getScoreColor(readinessScore)}`}>
                      {readinessScore}
                      <span className="text-2xl">/100</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Progress value={readinessScore} className="h-2" indicatorClassName={getScoreBgColor(readinessScore)} />
                    <p className="text-xs text-gray-500">
                      {readinessScore >= 80 ? 'Strong essay - minor polish needed' : 
                       readinessScore >= 60 ? 'Good foundation - strategic improvements needed' :
                       'Needs significant revision'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={resetAnalysis} className="w-full">
                    Analyze New Essay
                  </Button>
                </div>
              </Card>

              <div className="lg:col-span-3 space-y-6">
                {/* Overall Summary */}
                <Card className="p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Overall Summary</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{overallSummary}</p>
                </Card>

                {/* Main Tabs */}
                <Card className="p-6 shadow-md">
                  <Tabs defaultValue="structure">
                    <TabsList className="grid w-full grid-cols-5 mb-6">
                      <TabsTrigger value="structure">Structure</TabsTrigger>
                      <TabsTrigger value="language">Language</TabsTrigger>
                      <TabsTrigger value="alignment">Prompt Fit</TabsTrigger>
                      <TabsTrigger value="admissions">Admissions View</TabsTrigger>
                      <TabsTrigger value="action">Action Plan</TabsTrigger>
                    </TabsList>

                    {/* Structure Tab */}
                    <TabsContent value="structure" className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-900">Structural Analysis</h4>
                      {structuralIssues.map((issue, index) => (
                        <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                          <div className="flex items-start gap-2 mb-2">
                            <AlertCircle className="size-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-purple-900">{issue.section}</p>
                              <p className="text-xs text-purple-700 mt-1">Issue: {issue.issue}</p>
                            </div>
                          </div>
                          <div className="mt-3 pl-6 border-l-2 border-purple-300">
                            <p className="text-xs font-medium text-gray-900 mb-1">✓ Suggestion:</p>
                            <p className="text-xs text-gray-700">{issue.suggestion}</p>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    {/* Language Tab */}
                    <TabsContent value="language" className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Inline Corrections & Improvements</h4>
                      <p className="text-xs text-gray-600 mb-4">Click each suggestion to see why the change improves your essay</p>
                      {suggestions.map((suggestion) => {
                        const config = suggestionTypeConfig[suggestion.type];
                        const Icon = config.icon;
                        
                        return (
                          <div key={suggestion.id} className={`p-4 rounded-lg border ${config.bg} ${config.border}`}>
                            <div className="flex items-start gap-2 mb-3">
                              <Icon className={`size-4 ${config.color} mt-0.5 flex-shrink-0`} />
                              <Badge variant="secondary" className={`text-xs ${config.color.replace('text-', 'bg-').replace('600', '100')}`}>
                                {suggestion.type}
                              </Badge>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs font-medium text-gray-600 mb-1">Original:</p>
                                <p className="text-sm text-gray-700 line-through">{suggestion.originalText}</p>
                              </div>
                              
                              <div>
                                <p className="text-xs font-medium text-gray-600 mb-1">Improved:</p>
                                <p className="text-sm text-gray-900 font-medium">{suggestion.correctedText}</p>
                              </div>
                              
                              <div className="pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-600">
                                  <span className="font-medium">Why:</span> {suggestion.explanation}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </TabsContent>

                    {/* Prompt Alignment Tab */}
                    <TabsContent value="alignment" className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-900">Does Your Essay Answer the Prompt?</h4>
                      
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-start gap-2 mb-2">
                          <CheckCircle className="size-5 text-green-600 flex-shrink-0" />
                          <h5 className="text-sm font-semibold text-green-900">What You're Doing Right</h5>
                        </div>
                        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans mt-2">
                          {promptAlignment.aligned}
                        </pre>
                      </div>

                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-start gap-2 mb-2">
                          <AlertCircle className="size-5 text-red-600 flex-shrink-0" />
                          <h5 className="text-sm font-semibold text-red-900">Missing from Your Response</h5>
                        </div>
                        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans mt-2">
                          {promptAlignment.notAligned}
                        </pre>
                      </div>
                    </TabsContent>

                    {/* Admissions Perspective Tab */}
                    <TabsContent value="admissions" className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Strengths (Admissions Committee View)</h4>
                        <ul className="space-y-2">
                          {strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Red Flags / Weaknesses</h4>
                        <ul className="space-y-2">
                          {redFlags.map((flag, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <AlertCircle className="size-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Competitive Analysis</h4>
                        <p className="text-sm text-gray-700">
                          In a global applicant pool, your essay currently ranks in the <strong>middle tier</strong>. 
                          To move to the top tier, focus on specificity, demonstrated impact, and clear program-fit alignment. 
                          Strong essays don't just list achievements—they show intellectual growth and unique perspective.
                        </p>
                      </div>
                    </TabsContent>

                    {/* Action Plan Tab */}
                    <TabsContent value="action" className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Your 5-Step Improvement Plan</h4>
                      {improvementPlan.map((step, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold">{index + 1}</span>
                          </div>
                          <p className="text-sm text-gray-700 flex-1">{step}</p>
                        </div>
                      ))}

                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Example Rewrite: Introduction</h4>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                            {rewriteSuggestion}
                          </pre>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Educational Info */}
      {step !== 'feedback' && (
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 shadow-sm max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <Lightbulb className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">How This Tool Works</h3>
              <ul className="text-xs text-gray-700 space-y-1 mb-3">
                <li>• Our AI identifies the essay type from your prompt (motivational, personal challenge, leadership, etc.)</li>
                <li>• We evaluate your essay against criteria selection committees actually use</li>
                <li>• You get specific, actionable feedback - not vague comments</li>
                <li>• Every suggestion explains WHY it improves your essay</li>
              </ul>
              <div className="mt-3 pt-3 border-t border-purple-200">
                <p className="text-xs text-gray-600">
                  <strong className="text-gray-900">Important:</strong> AI feedback may contain inaccuracies and should be used as guidance, not as an absolute authority. Always review suggestions critically and consider seeking human feedback from teachers or mentors for final review.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}