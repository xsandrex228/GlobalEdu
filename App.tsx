import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, FileText, BookOpen, Newspaper, GraduationCap, SlidersHorizontal, X, Mail, Phone, MapPin, ChevronDown } from 'lucide-react';
import { mockPrograms, mockNews } from '@/app/data/mockData';
import { Program } from '@/app/types/program';
import { FilterPanel, FilterState } from '@/app/components/FilterPanel';
import { ProgramCard } from '@/app/components/ProgramCard';
import { ProgramModal } from '@/app/components/ProgramModal';
import { EssayFeedback } from '@/app/components/EssayFeedback';
import { LetterTemplates } from '@/app/components/LetterTemplates';
import { NewsFeed } from '@/app/components/NewsFeed';
import { OnboardingFlow } from '@/app/components/OnboardingFlow';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Toaster } from '@/app/components/ui/sonner';

type ViewMode = 'programs' | 'essay' | 'letters' | 'news';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('programs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    countries: [],
    formats: [],
    residenceTypes: [],
    fields: [],
    ageRange: [16, 25],
    maxCost: 200,
    hasLowIncomeDiscount: false,
    minAcceptanceRate: 0,
    deadlineRange: 'all',
  });

  // Get unique values for filter options
  const availableCountries = useMemo(() => 
    Array.from(new Set(mockPrograms.map(p => p.country))).sort(),
    []
  );

  const availableFields = useMemo(() => 
    Array.from(new Set(mockPrograms.map(p => p.field))).sort(),
    []
  );

  // Filter programs based on all criteria
  const filteredPrograms = useMemo(() => {
    return mockPrograms.filter(program => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          program.title.toLowerCase().includes(query) ||
          program.institution.toLowerCase().includes(query) ||
          program.country.toLowerCase().includes(query) ||
          program.description.toLowerCase().includes(query) ||
          program.field.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // Country filter
      if (filters.countries.length && !filters.countries.includes(program.country)) {
        return false;
      }

      // Format filter
      if (filters.formats.length && !filters.formats.includes(program.format)) {
        return false;
      }

      // Residence filter
      if (filters.residenceTypes.length && !filters.residenceTypes.includes(program.residence)) {
        return false;
      }

      // Field filter
      if (filters.fields.length && !filters.fields.includes(program.field)) {
        return false;
      }

      // Age range filter
      if (program.ageRange.min > filters.ageRange[1] || program.ageRange.max < filters.ageRange[0]) {
        return false;
      }

      // Max cost filter
      if (program.applicationCost > filters.maxCost) {
        return false;
      }

      // Low income discount filter
      if (filters.hasLowIncomeDiscount && !program.hasLowIncomeDiscount) {
        return false;
      }

      // Acceptance rate filter
      if (program.internationalAcceptanceRate < filters.minAcceptanceRate) {
        return false;
      }

      // Deadline range filter
      if (filters.deadlineRange !== 'all') {
        const daysUntilDeadline = Math.ceil(
          (program.applicationDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        
        const maxDays = {
          '30days': 30,
          '60days': 60,
          '90days': 90,
        }[filters.deadlineRange] || Infinity;

        if (daysUntilDeadline > maxDays || daysUntilDeadline < 0) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, filters]);

  const navigationItems = [
    { id: 'programs', label: 'Discover', icon: Search },
    { id: 'essay', label: 'Essay Mentor', icon: FileText },
    { id: 'letters', label: 'Letter Templates', icon: BookOpen },
    { id: 'news', label: 'Updates', icon: Newspaper },
  ];

  const activeFilterCount = 
    filters.countries.length + 
    filters.formats.length + 
    filters.residenceTypes.length + 
    filters.fields.length +
    (filters.hasLowIncomeDiscount ? 1 : 0) +
    (filters.deadlineRange !== 'all' ? 1 : 0) +
    (filters.minAcceptanceRate > 0 ? 1 : 0);

  return (
    <>
      {showOnboarding && (
        <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
      )}

      <div className="min-h-screen bg-white">
        <Toaster position="top-center" />
        
        {/* Minimal Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-lg bg-white/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewMode('programs')}>
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                  <GraduationCap className="size-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 tracking-tight">GlobalEdu</h1>
                  <p className="text-[10px] text-gray-500 -mt-0.5 hidden sm:block font-medium">Your path to international education</p>
                </div>
              </div>

              {/* Compact Navigation */}
              <nav className="flex items-center gap-1">
                {navigationItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={viewMode === item.id ? 'default' : 'ghost'}
                      onClick={() => setViewMode(item.id as ViewMode)}
                      size="sm"
                      className="gap-1.5 text-xs font-medium"
                    >
                      <Icon className="size-3.5" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </Button>
                  );
                })}
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-20">
          {viewMode === 'programs' && (
            <>
              {/* Hero Section */}
              <div className="bg-gradient-to-b from-blue-50/50 to-white border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
                      Discover Your Future
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 font-medium">
                      Explore international programs designed for ambitious students. 
                      Find opportunities that match your dreams.
                    </p>
                    
                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-6">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search by program, university, or country..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-12 h-12 text-base rounded-full shadow-sm border-gray-200 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Filter Toggle */}
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        className="gap-2 rounded-full"
                      >
                        <SlidersHorizontal className="size-4" />
                        Filters
                        {activeFilterCount > 0 && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 ml-1">
                            {activeFilterCount}
                          </Badge>
                        )}
                        <ChevronDown className={`size-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Collapsible Filters */}
              <AnimatePresence>
                {filtersOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-b border-gray-100 bg-gray-50"
                  >
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">Refine your search</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFiltersOpen(false)}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                      <FilterPanel
                        filters={filters}
                        onFiltersChange={setFilters}
                        availableCountries={availableCountries}
                        availableFields={availableFields}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Programs Feed */}
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                {filteredPrograms.length > 0 ? (
                  <div className="space-y-6">
                    {filteredPrograms.map((program, index) => (
                      <motion.div
                        key={program.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <ProgramCard
                          program={program}
                          onViewDetails={setSelectedProgram}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="size-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No programs found</h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your filters or search terms
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setFilters({
                          countries: [],
                          formats: [],
                          residenceTypes: [],
                          fields: [],
                          ageRange: [16, 25],
                          maxCost: 200,
                          hasLowIncomeDiscount: false,
                          minAcceptanceRate: 0,
                          deadlineRange: 'all',
                        });
                        setSearchQuery('');
                      }}
                      className="rounded-full"
                    >
                      Clear all filters
                    </Button>
                  </motion.div>
                )}
              </div>
            </>
          )}

          {viewMode === 'essay' && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
              <EssayFeedback />
            </div>
          )}
          
          {viewMode === 'letters' && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
              <LetterTemplates />
            </div>
          )}
          
          {viewMode === 'news' && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
              <NewsFeed news={mockNews} />
            </div>
          )}
        </main>

        {/* Trust Footer */}
        <footer className="bg-slate-900 text-white border-t border-slate-800 mt-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <GraduationCap className="size-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">GlobalEdu</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Your trusted international education navigator, helping students discover and apply to programs worldwide.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-4 text-slate-300">Contact Us</h4>
                <div className="space-y-3">
                  <a href="mailto:support@globaledu.com" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                    <Mail className="size-4" />
                    support@globaledu.com
                  </a>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Phone className="size-4" />
                    +1 (555) 123-4567
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-400">
                    <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                    <span>123 Education Street<br />San Francisco, CA 94102</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-4 text-slate-300">Quick Links</h4>
                <div className="space-y-2">
                  <button onClick={() => setViewMode('programs')} className="block text-sm text-slate-400 hover:text-white transition-colors">
                    Discover Programs
                  </button>
                  <button onClick={() => setViewMode('essay')} className="block text-sm text-slate-400 hover:text-white transition-colors">
                    Essay Mentor
                  </button>
                  <button onClick={() => setViewMode('letters')} className="block text-sm text-slate-400 hover:text-white transition-colors">
                    Letter Templates
                  </button>
                  <button onClick={() => setViewMode('news')} className="block text-sm text-slate-400 hover:text-white transition-colors">
                    News & Updates
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800 text-center">
              <p className="text-sm text-slate-500">
                © 2026 GlobalEdu. All rights reserved. Built to help students worldwide.
              </p>
            </div>
          </div>
        </footer>

        {/* Program Detail Modal */}
        {selectedProgram && (
          <ProgramModal
            program={selectedProgram}
            onClose={() => setSelectedProgram(null)}
          />
        )}
      </div>
    </>
  );
}