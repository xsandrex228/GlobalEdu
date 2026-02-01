import { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Copy, Check, ChevronRight, Filter } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { toast } from 'sonner';

interface Template {
  id: string;
  title: string;
  recommenderType: string;
  bestFor: string[];
  traitsHighlighted: string[];
  toneIndicator: 'Formal' | 'Balanced' | 'Personal';
  paragraphCount: number;
  structureType: 'Skills-first' | 'Story-first' | 'Growth-first' | 'Achievement-first' | 'Context-first';
  content: string;
  hints: string[];
}

const templates: Template[] = [
  {
    id: '1',
    title: 'STEM Research Supervisor - Achievement-Driven',
    recommenderType: 'Research supervisor / Lab mentor',
    bestFor: ['Research programs', 'STEM scholarships', 'Graduate programs'],
    traitsHighlighted: ['Technical ability', 'Research methodology', 'Problem-solving', 'Independence'],
    toneIndicator: 'Formal',
    paragraphCount: 4,
    structureType: 'Achievement-first',
    content: `To the Selection Committee,

I am writing to recommend [Student Name] for [Program Name]. [He/She/They] worked in my computational biology lab for 18 months, during which [he/she/they] demonstrated research capabilities well beyond the undergraduate level.

[Student's] most significant contribution was developing a novel algorithm for protein folding prediction, which improved our model accuracy by 23%. What distinguished this work was not just the technical execution, but [his/her/their] ability to identify the core limitation in our existing approach—something my graduate students had overlooked. When [he/she/they] proposed testing a hybrid method combining machine learning with thermodynamic constraints, I was skeptical. The results proved me wrong.

Beyond technical skills, [Student Name] demonstrates the intellectual honesty essential for rigorous science. When initial results contradicted [his/her/their] hypothesis, [he/she/they] didn't manipulate parameters—[he/she/they] redesigned the experiment. This integrity, combined with [his/her/their] mathematical fluency and computational expertise, positions [him/her/them] for significant contributions to [field].

I recommend [Student Name] without reservation. [He/She/They] possesses both the technical foundation and scientific mindset your program seeks.

Sincerely,
[Name]
[Title]
[Institution]
[Contact Information]`,
    hints: [
      'Ask your supervisor to include specific metrics or outcomes from your research',
      'Provide them with your research abstract and methodology notes',
      'Remind them of any challenges you solved or novel approaches you took',
      'Share the program description so they can connect your work to its focus'
    ],
  },
  {
    id: '2',
    title: 'Humanities Teacher - Story-Driven',
    recommenderType: 'Humanities teacher (English, History, Philosophy)',
    bestFor: ['Liberal arts programs', 'Writing programs', 'International exchanges'],
    traitsHighlighted: ['Critical thinking', 'Written expression', 'Intellectual curiosity', 'Cultural awareness'],
    toneIndicator: 'Personal',
    paragraphCount: 5,
    structureType: 'Story-first',
    content: `Dear Admissions Committee,

I rarely begin recommendation letters with a specific moment, but [Student Name] earned this exception. Last spring, during our seminar on postcolonial literature, [he/she/they] challenged my interpretation of a Chinua Achebe passage. Not with youthful arrogance, but with a carefully constructed argument drawing on historical context I'd overlooked. The class went silent. I paused, reconsidered, and ultimately had to agree. In 20 years of teaching, few students have made me rethink my own analysis.

This intellectual courage defines [Student's] approach to learning. [He/She/They] doesn't accept ideas simply because they appear in textbooks or come from authority. In [his/her/their] essay on [topic], [he/she/they] wove together [specific example], creating an argument that was simultaneously personal and rigorously analytical. [His/Her/Their] writing possesses a rare quality: it makes complex ideas accessible without oversimplifying them.

What strikes me most is [Student's] genuine curiosity about perspectives different from [his/her/their] own. [He/She/They] sought out texts from authors representing cultures and viewpoints unfamiliar to [him/her/them], not to check a box, but because [he/she/they] recognized the limitations of [his/her/their] own experience.

[Student Name] will contribute meaningfully to any intellectual community. [He/She/They] listens as carefully as [he/she/they] speaks, questions as thoughtfully as [he/she/they] argues, and grows from every challenge.

I give [Student Name] my highest recommendation.

With confidence,
[Name]
[Title]
[Contact Information]`,
    hints: [
      'Remind your teacher of a specific class discussion, paper, or project where you excelled',
      'Share your essay topic or thesis with them',
      'Mention how their class influenced your thinking',
      'Ask them to highlight your analytical or writing skills specifically'
    ],
  },
  {
    id: '3',
    title: 'Internship Supervisor - Impact-Focused',
    recommenderType: 'Workplace supervisor / Internship manager',
    bestFor: ['Business programs', 'Professional internships', 'Leadership programs'],
    traitsHighlighted: ['Work ethic', 'Professional maturity', 'Measurable impact', 'Adaptability'],
    toneIndicator: 'Balanced',
    paragraphCount: 4,
    structureType: 'Achievement-first',
    content: `To Whom It May Concern,

I enthusiastically recommend [Student Name] for [Program Name]. As Marketing Director at [Company], I supervised [Student] during [his/her/their] summer internship, where [he/she/they] delivered results that exceeded our expectations for entry-level contributors.

We assigned [Student Name] what we thought was a straightforward task: analyze our social media engagement metrics. Instead of simply compiling data, [he/she/they] identified a pattern we'd missed—our engagement dropped 40% when we posted during certain hours. [He/She/They] proposed a revised posting schedule and tested it over three weeks. The results: 67% increase in engagement and 23% increase in click-through rates. We implemented [his/her/their] recommendations company-wide, and they remain our standard practice today.

What impressed our team most was how [Student] operated: [he/she/they] asked clarifying questions upfront, delivered work ahead of deadlines, and proactively identified problems before being asked. When our database crashed mid-project, [he/she/they] didn't wait for IT—[he/she/they] found a workaround using alternative tools and kept the project on schedule. This combination of initiative and reliability is rare at any level.

[Student Name] brings both analytical skills and professional maturity. [He/She/They] will make immediate, measurable contributions to your program.

Best regards,
[Name]
[Title]
[Company]
[Contact Information]`,
    hints: [
      'Provide specific metrics or outcomes from your internship projects',
      'Remind your supervisor of problems you solved or improvements you made',
      'Share examples of initiative or going beyond assigned tasks',
      'Connect your work to skills the program values'
    ],
  },
  {
    id: '4',
    title: 'NGO Coordinator - Growth-Focused',
    recommenderType: 'Volunteer coordinator / NGO director',
    bestFor: ['Social impact programs', 'Development programs', 'Service scholarships'],
    traitsHighlighted: ['Empathy', 'Cultural sensitivity', 'Personal growth', 'Community impact'],
    toneIndicator: 'Personal',
    paragraphCount: 5,
    structureType: 'Growth-first',
    content: `Dear Program Directors,

When [Student Name] first joined our refugee education program, [he/she/they] was eager but uncertain. [He/She/They] asked me, "How do I teach English to students who've experienced trauma I can't understand?" This question—its humility and awareness—told me everything about the kind of person [he/she/they] would become.

Over two years, I watched [Student] transform from a nervous volunteer into a confident educator and advocate. [He/She/They] didn't just teach English; [he/she/they] learned [language] to communicate better with students' families. [He/She/They] noticed that our youngest students struggled with homework because their housing had unreliable electricity, so [he/she/they] created a battery-powered study kit and distributed 30 of them using funds [he/she/they] raised independently.

What distinguishes [Student Name] is [his/her/their] ability to see beyond immediate needs to systemic issues. After witnessing how language barriers prevented parents from accessing healthcare, [he/she/they] developed a medical translation guide and trained a team of bilingual student volunteers. This initiative now serves over 200 families monthly.

[Student's] impact extends beyond measurable outcomes. [His/Her/Their] students trust [him/her/them]. Parents seek [his/her/their] guidance. [He/She/They] has become a bridge between our organization and the community we serve—not through authority, but through genuine relationship and earned respect.

[Student Name] possesses the empathy, adaptability, and commitment to create meaningful change. I recommend [him/her/them] with absolute confidence.

Warmly,
[Name]
[Title]
[Organization]
[Contact Information]`,
    hints: [
      'Share specific stories of challenges you faced and how you grew',
      'Provide data on your impact (people served, programs created, funds raised)',
      'Explain what you learned about yourself through this work',
      'Ask your coordinator to emphasize your cultural sensitivity and relationship-building'
    ],
  },
  {
    id: '5',
    title: 'School Counselor - Holistic Perspective',
    recommenderType: 'School counselor / Academic advisor',
    bestFor: ['Undergraduate programs', 'Scholarships', 'Exchange programs'],
    traitsHighlighted: ['Character', 'Resilience', 'Community contribution', 'Academic trajectory'],
    toneIndicator: 'Balanced',
    paragraphCount: 4,
    structureType: 'Context-first',
    content: `To the Admissions Committee,

In my role as counselor at [School Name], I work with over 300 students annually. I am writing this letter because [Student Name] represents the kind of student every educator hopes to support—not because [his/her/their] path has been easy, but because of how [he/she/they] has navigated its challenges.

[Student] came to us in [year] from [context - if relevant]. While many students in similar circumstances might have struggled, [he/she/they] demonstrated remarkable resilience. When [he/she/they] arrived, [his/her/their] English proficiency was limited; within two years, [he/she/they] was scoring in the top 10% on standardized tests. This achievement required not just intelligence, but extraordinary discipline and resourcefulness. [He/She/They] created [his/her/their] own study methods, sought out every available learning opportunity, and never made excuses.

Beyond academics, [Student Name] has given back to our school community in meaningful ways: [specific examples]. What I find most impressive is that [he/she/they] does this not for recognition—[he/she/they] declined several leadership titles—but because [he/she/they] genuinely believes in contributing to something larger than [himself/herself/themselves].

[Student Name] has the intellectual ability, work ethic, and character to excel in [Program Name]. More importantly, [he/she/they] will enrich your community with [his/her/their] perspective and values.

Sincerely,
[Name]
School Counselor
[Contact Information]`,
    hints: [
      'Provide context about your academic journey or any challenges overcome',
      'Share your involvement in school community beyond classes',
      'Explain your growth trajectory over the years',
      'Ask your counselor to speak to your character and potential, not just grades'
    ],
  },
  {
    id: '6',
    title: 'Math/Science Teacher - Analytical Focus',
    recommenderType: 'Mathematics or Science teacher',
    bestFor: ['STEM programs', 'Engineering programs', 'Science scholarships'],
    traitsHighlighted: ['Analytical thinking', 'Mathematical ability', 'Scientific reasoning', 'Persistence'],
    toneIndicator: 'Formal',
    paragraphCount: 3,
    structureType: 'Skills-first',
    content: `Dear Selection Committee,

I recommend [Student Name] for [Program Name] based on [his/her/their] exceptional mathematical reasoning and problem-solving abilities demonstrated across two years in my advanced mathematics courses.

In mathematics, true understanding reveals itself not in memorizing formulas, but in the ability to approach unfamiliar problems systematically. [Student Name] consistently demonstrates this deeper comprehension. In [his/her/their] solution to [specific problem/competition], [he/she/they] employed [specific method], an approach we hadn't covered in class. When I asked where [he/she/they] learned this technique, [he/she/they] explained [he/she/they] had derived it by combining concepts from [topic A] and [topic B]. This ability to synthesize knowledge across domains and create novel approaches distinguishes [him/her/them] from technically proficient students who merely execute learned procedures.

[Student's] performance in [specific course/competition] further evidences [his/her/their] capabilities: [specific achievement with context]. Beyond individual achievement, [he/she/they] regularly assists classmates, explaining concepts with clarity and patience. [His/Her/Their] combination of analytical depth, creative problem-solving, and collaborative spirit positions [him/her/them] for success in rigorous academic environments.

[Student Name] has my strongest recommendation.

Respectfully,
[Name]
[Title]
[Contact Information]`,
    hints: [
      'Remind your teacher of specific problems you solved or approaches you took',
      'Mention any competitions, projects, or advanced topics you studied',
      'Ask them to highlight your problem-solving process, not just correct answers',
      'Provide context on how you help other students or contribute to class discussions'
    ],
  },
  {
    id: '7',
    title: 'Sports Coach - Leadership & Team Dynamics',
    recommenderType: 'Athletic coach / Team advisor',
    bestFor: ['Leadership programs', 'Team-based programs', 'Character-focused scholarships'],
    traitsHighlighted: ['Leadership', 'Resilience', 'Teamwork', 'Dedication'],
    toneIndicator: 'Personal',
    paragraphCount: 4,
    structureType: 'Story-first',
    content: `To the Selection Committee,

Athletic coaches see students differently than classroom teachers do. We see who shows up when they're exhausted. Who encourages teammates after a loss. Who leads not with words, but with consistent action. [Student Name] is this kind of leader.

I've coached [sport] for 15 years, and I can count on one hand the athletes who've transformed a team culture the way [Student] did. When [he/she/they] joined as a [year], our team was talented but fractured—players competed against each other rather than supporting each other. [Student] didn't give speeches about unity. Instead, [he/she/they] started arriving 30 minutes early to help younger players with technique. [He/She/They] stayed late to practice with teammates who were struggling. Within months, others followed [his/her/their] example. By [his/her/their] [year] year, we had become a genuinely cohesive unit, and our performance reflected it: [specific achievement].

What makes [Student] exceptional isn't just [his/her/their] athletic ability—though [he/she/they] earned [specific achievement]. It's [his/her/their] character under pressure. During [specific situation/game], when [challenge occurred], [he/she/they] [specific action]. This composure, combined with [his/her/their] ability to elevate those around [him/her/them], demonstrates leadership maturity rare in students this age.

The lessons [Student Name] learned on the field—resilience, collaboration, strategic thinking—will serve [him/her/them] in any endeavor. I recommend [him/her/them] with enthusiasm.

Sincerely,
[Name]
Coach, [Sport]
[Contact Information]`,
    hints: [
      'Share specific moments that showed your character or leadership',
      'Provide team achievements and your role in them',
      'Explain how you handled setbacks or challenges',
      'Ask your coach to connect athletic lessons to broader life skills'
    ],
  },
  {
    id: '8',
    title: 'Arts Instructor - Creative Portfolio Focus',
    recommenderType: 'Art, Music, or Theater instructor',
    bestFor: ['Arts programs', 'Creative scholarships', 'Design programs'],
    traitsHighlighted: ['Creativity', 'Technical skill', 'Artistic vision', 'Dedication to craft'],
    toneIndicator: 'Balanced',
    paragraphCount: 4,
    structureType: 'Growth-first',
    content: `Dear Admissions Committee,

Artistic talent reveals itself gradually. When [Student Name] first entered my studio three years ago, [his/her/their] technical skills were competent but unremarkable. What set [him/her/them] apart wasn't immediate virtuosity—it was [his/her/their] willingness to fail, learn, and try again.

I watched [Student] evolve from someone who replicated techniques to an artist with a distinct voice. [His/Her/Their] [specific project] exemplifies this growth. Rather than choosing a safe, conventional approach, [he/she/they] experimented with [specific technique/medium], failed spectacularly on [his/her/their] first three attempts, solicited critique, and ultimately produced work that was genuinely original. The piece earned [specific recognition], but more importantly, it demonstrated [his/her/their] artistic maturity—the ability to envision something that doesn't yet exist and persist until it does.

Beyond individual achievement, [Student Name] has enriched our artistic community. [He/She/They] [specific contribution: organized shows, mentored younger students, collaborated on projects]. [His/Her/Their] generosity with knowledge and genuine enthusiasm for others' work creates an environment where creativity flourishes.

[Student's] combination of technical skill, creative vision, and collaborative spirit will make [him/her/them] a valuable addition to your program. [He/She/They] has both the discipline to develop craft and the courage to take creative risks.

With enthusiasm,
[Name]
[Title]
[Contact Information]`,
    hints: [
      'Document your artistic growth with portfolio pieces from different periods',
      'Share your creative process and influences',
      'Mention any exhibitions, performances, or recognition',
      'Ask your instructor to speak to both technical development and artistic vision'
    ],
  },
  {
    id: '9',
    title: 'Program Director - Comprehensive Evaluation',
    recommenderType: 'Program director / Summer program mentor',
    bestFor: ['Competitive programs', 'Research positions', 'Graduate programs'],
    traitsHighlighted: ['Academic excellence', 'Research potential', 'Professional readiness', 'Impact'],
    toneIndicator: 'Formal',
    paragraphCount: 5,
    structureType: 'Context-first',
    content: `To the Selection Committee,

As Director of [Program Name], a highly selective program that admits only 50 students annually from a pool of over 2,000 applicants, I write this letter with the perspective of having worked with exceptionally talented students from around the world. [Student Name] stands out even in this competitive cohort.

During the program, [Student] completed a research project on [topic] under the supervision of [Professor/Researcher]. What distinguished [his/her/their] work was not just the quality of the final product—though [he/she/they] produced publishable results—but [his/her/their] research approach. [He/She/They] formulated [his/her/their] own research question, designed the methodology, and adapted when initial results suggested a need for course correction. This level of independence and scientific thinking is rare in undergraduate researchers.

Beyond research capabilities, [Student Name] demonstrated the professional skills necessary for academic success: [he/she/they] communicated complex ideas clearly in presentations, collaborated effectively with team members from diverse backgrounds, and met deadlines consistently. When faced with [specific challenge], [he/she/they] [specific action and outcome].

I should note that I do not write letters of recommendation frequently—in the past three years, I have written approximately 15 for over 150 program participants. I write this letter because I believe [Student Name] has the potential to make significant contributions to [field].

[Student Name] possesses the intellectual capacity, research skills, and professional maturity to excel in your program. I recommend [him/her/them] without reservation.

Sincerely,
[Name]
Director, [Program Name]
[Institution]
[Contact Information]`,
    hints: [
      'Provide detailed information about the program\'s selectivity and your role in it',
      'Share your research project details, methodology, and outcomes',
      'Mention any unique opportunities or responsibilities you had',
      'Ask the director to provide context about your performance relative to other participants'
    ],
  },
  {
    id: '10',
    title: 'Employer - Professional Skills & Work Ethic',
    recommenderType: 'Employer / Business owner',
    bestFor: ['Professional internships', 'MBA programs', 'Work-study programs'],
    traitsHighlighted: ['Professional skills', 'Reliability', 'Business acumen', 'Initiative'],
    toneIndicator: 'Balanced',
    paragraphCount: 3,
    structureType: 'Skills-first',
    content: `To Whom It May Concern,

[Student Name] worked at [Company] for [duration] as [position]. In our business, we hire many young people for entry-level positions. Most do what's asked. Few anticipate what's needed. [Student] consistently fell into the latter category.

Within weeks, [Student] had learned not only [his/her/their] assigned responsibilities but how [his/her/their] role connected to broader business operations. [He/She/They] noticed inefficiencies others accepted as normal and proposed solutions. For example, when [he/she/they] observed that [specific problem], [he/she/they] suggested [specific solution], which we implemented and which now saves us approximately [metric: time/money/resources] monthly. This wasn't part of [his/her/their] job description. [He/She/They] identified the problem, researched solutions, and presented a proposal because [he/she/they] understood that improving the business benefited everyone.

Equally important was how [Student] interacted with colleagues and customers: with professionalism, respect, and reliability. [He/She/They] never called in sick without legitimate reason, never missed deadlines, and never blamed others when mistakes occurred. When we needed someone to [specific situation], [he/she/they] volunteered immediately and handled it with maturity beyond [his/her/their] years. I would hire [Student Name] again without hesitation, and I recommend [him/her/them] with complete confidence.

Best regards,
[Name]
[Title/Business Owner]
[Company]
[Contact Information]`,
    hints: [
      'Quantify your contributions and impact where possible',
      'Provide examples of initiative or problem-solving',
      'Ask your employer to mention specific situations that showed your professionalism',
      'Connect your work skills to qualities the program values'
    ],
  },
];

export function LetterTemplates() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTone, setSelectedTone] = useState<string>('all');

  const copyToClipboard = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success('Template copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadTemplate = (content: string, title: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Template downloaded!');
  };

  // Extract unique categories
  const categories = Array.from(new Set(templates.map(t => t.recommenderType))).sort();
  const tones = ['Formal', 'Balanced', 'Personal'];

  const filteredTemplates = templates.filter(t => {
    const categoryMatch = selectedCategory === 'all' || t.recommenderType === selectedCategory;
    const toneMatch = selectedTone === 'all' || t.toneIndicator === selectedTone;
    return categoryMatch && toneMatch;
  });

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
          <FileText className="size-8 text-purple-600" />
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
          Letter Templates
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
          {templates.length} professionally crafted templates with distinct voices and structures. Each represents a different recommender perspective and narrative approach.
        </p>
      </motion.div>

      {/* Filters */}
      <Card className="p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="size-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Filter Templates</span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">Recommender Type</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">Tone</label>
            <select 
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Tones</option>
              {tones.map(tone => (
                <option key={tone} value={tone}>{tone}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-gray-600">
            Showing {filteredTemplates.length} of {templates.length} templates
          </p>
          {(selectedCategory !== 'all' || selectedTone !== 'all') && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSelectedCategory('all');
                setSelectedTone('all');
              }}
              className="text-xs"
            >
              Clear filters
            </Button>
          )}
        </div>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                        {template.recommenderType}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.toneIndicator}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.paragraphCount} paragraphs
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.structureType}
                      </Badge>
                    </div>
                  </div>
                  <FileText className="size-5 text-gray-400 flex-shrink-0" />
                </div>

                {/* Metadata Grid */}
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Best Used For:</p>
                    <ul className="space-y-1">
                      {template.bestFor.map((use, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-center gap-1">
                          <ChevronRight className="size-3" />
                          {use}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Traits Highlighted:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.traitsHighlighted.map((trait, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="template" className="mt-4">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="template">Full Template</TabsTrigger>
                  <TabsTrigger value="hints">Usage Guidance</TabsTrigger>
                </TabsList>

                <TabsContent value="template">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4 max-h-[400px] overflow-y-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                      {template.content}
                    </pre>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(template.content, template.id)}
                      className="flex-1"
                    >
                      {copiedId === template.id ? (
                        <>
                          <Check className="size-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="size-4 mr-2" />
                          Copy Template
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadTemplate(template.content, template.title)}
                      className="flex-1"
                    >
                      <Download className="size-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="hints">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-900 mb-3">
                      How to use this template effectively:
                    </p>
                    {template.hints.map((hint, hintIndex) => (
                      <div key={hintIndex} className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                          {hintIndex + 1}
                        </div>
                        <p className="text-sm text-gray-700">{hint}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Educational Info */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Understanding Letter Diversity</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Structure Matters</h4>
            <p className="text-xs text-gray-700">
              Notice how some letters open with context, others with achievements, and some with stories. Different structures suit different recommenders and highlight different strengths.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Voice Variation</h4>
            <p className="text-xs text-gray-700">
              A research supervisor writes differently than an arts teacher. Each template reflects the authentic voice and perspective of its recommender type.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Customization is Key</h4>
            <p className="text-xs text-gray-700">
              These templates provide structure, not scripts. Share them with your recommenders as starting points, then provide the specific details that make your story unique.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}