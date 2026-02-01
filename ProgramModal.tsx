import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Calendar, Home, Clock, DollarSign, Users, GraduationCap, Award, CheckCircle2 } from 'lucide-react';
import { Program, fieldThemes } from '@/app/types/program';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

interface ProgramModalProps {
  program: Program | null;
  onClose: () => void;
}

export function ProgramModal({ program, onClose }: ProgramModalProps) {
  if (!program) return null;

  const theme = fieldThemes[program.field];
  
  const daysUntilDeadline = Math.ceil(
    (program.applicationDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with colored background */}
          <div 
            className="p-8 rounded-t-2xl relative"
            style={{ 
              background: `linear-gradient(135deg, ${theme.lightBg} 0%, ${theme.bgColor} 100%)`
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              <X className="size-5 text-gray-600" />
            </button>

            <div className="flex items-start gap-4">
              <div 
                className="p-4 rounded-xl shadow-md"
                style={{ backgroundColor: 'white' }}
              >
                <GraduationCap className="size-8" style={{ color: theme.color }} />
              </div>

              <div className="flex-1">
                <Badge 
                  variant="secondary" 
                  className="mb-3"
                  style={{ 
                    backgroundColor: 'white', 
                    color: theme.color,
                    border: 'none'
                  }}
                >
                  {program.field.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Badge>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{program.title}</h2>
                <p className="text-lg text-gray-700">{program.institution}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Key Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <MapPin className="size-5 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Country</p>
                <p className="text-sm font-semibold text-gray-900">{program.country}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="size-5 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <p className="text-sm font-semibold text-gray-900">{program.duration}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Home className="size-5 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Residence</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">
                  {program.residence.replace('-', ' ')}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="size-5 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Acceptance</p>
                <p className="text-sm font-semibold text-gray-900">
                  {program.internationalAcceptanceRate}%
                </p>
              </div>
            </div>

            {/* Deadline Alert */}
            {daysUntilDeadline <= 30 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="size-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-red-900">
                      Application Deadline: {program.applicationDeadline.toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                    <p className="text-xs text-red-700">
                      Only {daysUntilDeadline} days remaining - Apply soon!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 h-auto">
                <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">Overview</TabsTrigger>
                <TabsTrigger value="requirements" className="text-xs sm:text-sm py-2">Requirements</TabsTrigger>
                <TabsTrigger value="benefits" className="text-xs sm:text-sm py-2">Benefits</TabsTrigger>
                <TabsTrigger value="costs" className="text-xs sm:text-sm py-2">Costs</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Program</h3>
                  <p className="text-gray-700 leading-relaxed">{program.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Program Details</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                        Format: <span className="capitalize">{program.format}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                        Age Range: {program.ageRange.min} - {program.ageRange.max} years
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                        Program Start: {program.programStart.toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Financial Aid</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        {program.hasLowIncomeDiscount ? (
                          <>
                            <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                            Low-income discount available
                          </>
                        ) : (
                          <>
                            <X className="size-4 text-gray-400 flex-shrink-0" />
                            No low-income discount
                          </>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Requirements</h3>
                <div className="space-y-2">
                  {program.requirements.map((req, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{req}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="benefits" className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Benefits</h3>
                <div className="space-y-2">
                  {program.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                      <Award className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="costs" className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="size-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">Application Fee</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">${program.applicationCost}</span>
                  </div>

                  {program.hasLowIncomeDiscount && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-900 font-medium mb-1">💰 Financial Assistance Available</p>
                      <p className="text-xs text-green-700">
                        This program offers application fee waivers or discounts for students from low-income families. 
                        Contact the admissions office for more information.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
              <Button 
                className="flex-1"
                style={{ backgroundColor: theme.color }}
              >
                Save Program
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                style={{ 
                  borderColor: theme.color,
                  color: theme.color
                }}
              >
                Visit Website
              </Button>
            </div>

            {/* Official Program Link */}
            <div className="mt-6 pt-6 border-t border-gray-200 bg-gray-50 -mx-8 -mb-8 px-8 py-6 rounded-b-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Official Program Information</h4>
                  <p className="text-xs text-gray-600">
                    Visit the official program website for complete details and application requirements
                  </p>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                  onClick={() => window.open(`https://${program.institution.toLowerCase().replace(/\s+/g, '')}.edu/programs/${program.id}`, '_blank')}
                >
                  Official Site →
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}