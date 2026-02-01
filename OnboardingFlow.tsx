import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const steps = [
  {
    title: 'Welcome to Your International Program Navigator',
    description: 'We help ambitious students like you find and apply to programs worldwide. Let\'s get started!',
    image: '🌍',
  },
  {
    title: 'Discover Programs That Match Your Goals',
    description: 'Use our smart filters to find programs by country, field, deadline, and more. Get personalized suggestions based on your profile.',
    image: '🔍',
  },
  {
    title: 'Get AI-Powered Essay Feedback',
    description: 'Our AI mentor analyzes your application essays and provides specific suggestions to make them more compelling.',
    image: '✨',
  },
  {
    title: 'Track Your Application Progress',
    description: 'Keep track of deadlines, essay drafts, and requirements. We\'ll remind you when deadlines are approaching.',
    image: '📊',
  },
  {
    title: 'You\'re All Set!',
    description: 'Start exploring programs and take the first step towards your international education journey.',
    image: '🚀',
  },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 shadow-2xl relative">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="size-5 text-gray-400" />
        </button>

        <div className="mb-8">
          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-blue-600'
                    : index < currentStep
                    ? 'w-2 bg-blue-400'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative h-[300px] overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0 flex flex-col items-center text-center"
              >
                <div className="text-7xl mb-6">{steps[currentStep].image}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {steps[currentStep].title}
                </h2>
                <p className="text-gray-600 max-w-md">
                  {steps[currentStep].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="text-gray-600"
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {currentStep < steps.length - 1 && (
              <Button variant="ghost" onClick={handleSkip} className="text-gray-600">
                Skip
              </Button>
            )}
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
              {currentStep === steps.length - 1 ? (
                <>
                  Get Started
                  <Check className="size-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="size-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
