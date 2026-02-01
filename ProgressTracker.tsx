import { motion } from 'motion/react';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';

interface ApplicationStep {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'not-started';
  deadline?: Date;
}

interface ProgressTrackerProps {
  programTitle: string;
  steps: ApplicationStep[];
  overallProgress: number;
}

export function ProgressTracker({ programTitle, steps, overallProgress }: ProgressTrackerProps) {
  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const totalSteps = steps.length;

  const getStatusIcon = (status: ApplicationStep['status']) => {
    if (status === 'completed') {
      return <CheckCircle className="size-5 text-green-600" />;
    }
    if (status === 'in-progress') {
      return <Clock className="size-5 text-blue-600" />;
    }
    return <Circle className="size-5 text-gray-300" />;
  };

  const getStatusColor = (status: ApplicationStep['status']) => {
    if (status === 'completed') return 'border-green-200 bg-green-50';
    if (status === 'in-progress') return 'border-blue-200 bg-blue-50';
    return 'border-gray-200 bg-white';
  };

  return (
    <Card className="p-6 shadow-md">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{programTitle}</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {completedSteps}/{totalSteps} steps
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-semibold text-gray-900">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-start gap-3 p-3 rounded-lg border ${getStatusColor(step.status)} transition-colors`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getStatusIcon(step.status)}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${step.status === 'completed' ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                {step.title}
              </p>
              {step.deadline && step.status !== 'completed' && (
                <p className="text-xs text-gray-500 mt-1">
                  Due: {step.deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
