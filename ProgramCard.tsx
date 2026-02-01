import { motion } from 'motion/react';
import { Calendar, MapPin, Home, Clock, DollarSign, Users, CheckCircle2, ArrowRight, Award, Coins } from 'lucide-react';
import { Program, fieldThemes } from '@/app/types/program';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';

interface ProgramCardProps {
  program: Program;
  onViewDetails: (program: Program) => void;
}

// Mock ranking data based on program characteristics
const getRanking = (program: Program): { rank: string; region: string } => {
  const regionMap: Record<string, string> = {
    'USA': 'North America',
    'Canada': 'North America',
    'UK': 'Europe',
    'Germany': 'Europe',
    'France': 'Europe',
    'Netherlands': 'Europe',
    'Switzerland': 'Europe',
    'Ireland': 'Europe',
    'Australia': 'Oceania',
    'New Zealand': 'Oceania',
    'Singapore': 'Asia',
    'Japan': 'Asia',
  };

  // Generate ranking based on acceptance rate and institution prestige
  const prestigeInstitutions = ['Stanford', 'Cambridge', 'Oxford', 'MIT', 'Harvard', 'Tokyo Institute'];
  const isPrestige = prestigeInstitutions.some(inst => program.institution.includes(inst));
  
  let rank = '';
  if (isPrestige || program.internationalAcceptanceRate <= 20) {
    rank = '#1';
  } else if (program.internationalAcceptanceRate <= 30) {
    rank = 'Top 3';
  } else if (program.internationalAcceptanceRate <= 40) {
    rank = 'Top 5';
  } else {
    rank = 'Top 10';
  }

  return {
    rank,
    region: regionMap[program.country] || 'International',
  };
};

export function ProgramCard({ program, onViewDetails }: ProgramCardProps) {
  const theme = fieldThemes[program.field];
  const ranking = getRanking(program);
  
  const daysUntilDeadline = Math.ceil(
    (program.applicationDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const isDeadlineSoon = daysUntilDeadline <= 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow duration-300 relative"
        style={{ 
          borderLeft: `4px solid ${theme.color}`,
          background: `linear-gradient(to bottom, ${theme.lightBg}, white)`
        }}
      >
        <div className="p-6">
          {/* Top Section: Program Direction + Ranking */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              {/* Program Direction - Prominent */}
              <div className="mb-2">
                <Badge 
                  variant="secondary" 
                  className="text-sm font-semibold px-3 py-1"
                  style={{ 
                    backgroundColor: theme.color, 
                    color: 'white',
                    border: 'none'
                  }}
                >
                  {program.field.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Badge>
              </div>
              
              {/* Low-Income Discount - High Visibility */}
              {program.hasLowIncomeDiscount && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 border border-green-300 rounded-md">
                  <Coins className="size-3.5 text-green-700" />
                  <span className="text-xs font-medium text-green-800">Low-Income Discount</span>
                </div>
              )}
            </div>

            {/* Continental Ranking - Right Side */}
            <div className="ml-4 text-right">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                <Award className="size-4 text-amber-600" />
                <div className="text-right">
                  <div className="text-sm font-bold text-amber-900">{ranking.rank}</div>
                  <div className="text-xs text-amber-700 whitespace-nowrap">in {ranking.region}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Program Title & Institution */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-1 text-gray-900">{program.title}</h3>
            <p className="text-sm text-gray-600">{program.institution}</p>
            {program.applicationStatus && (
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <CheckCircle2 className="size-3" />
                <span className="capitalize">{program.applicationStatus.replace('-', ' ')}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
            {program.description}
          </p>

          {/* Key Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="size-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700">{program.country}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Home className="size-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700 capitalize">{program.residence.replace('-', ' ')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="size-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700">{program.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="size-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700">{program.internationalAcceptanceRate}% acceptance</span>
            </div>
          </div>

          {/* Deadline Warning */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-gray-400" />
                <span className="text-gray-600">Application Deadline</span>
              </div>
              <span className={`font-medium ${isDeadlineSoon ? 'text-red-600' : 'text-gray-900'}`}>
                {program.applicationDeadline.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            {isDeadlineSoon && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                <p className="text-xs text-red-700 font-medium">
                  ⏰ {daysUntilDeadline} days remaining - Apply soon!
                </p>
              </div>
            )}
          </div>

          {/* Application Cost */}
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="size-4 text-gray-500" />
              <span className="text-sm text-gray-600">Application Fee</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">${program.applicationCost}</span>
          </div>

          {/* Action Button */}
          <Button 
            onClick={() => onViewDetails(program)}
            className="w-full group"
            style={{ backgroundColor: theme.color }}
          >
            View Full Details
            <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}