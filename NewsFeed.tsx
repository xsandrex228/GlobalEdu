import { motion } from 'motion/react';
import { Calendar, TrendingUp, Lightbulb, Clock, ArrowRight, PenTool } from 'lucide-react';
import { NewsItem } from '@/app/types/program';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';

interface NewsFeedProps {
  news: NewsItem[];
}

const newsTypeConfig = {
  deadline: { 
    icon: Clock, 
    color: 'text-red-600', 
    bg: 'bg-red-50', 
    badge: 'bg-red-100 text-red-700',
    label: 'Deadline Alert'
  },
  announcement: { 
    icon: TrendingUp, 
    color: 'text-blue-600', 
    bg: 'bg-blue-50', 
    badge: 'bg-blue-100 text-blue-700',
    label: 'Announcement'
  },
  'essay-tip': { 
    icon: PenTool, 
    color: 'text-purple-600', 
    bg: 'bg-purple-50', 
    badge: 'bg-purple-100 text-purple-700',
    label: 'Essay Writing Tip'
  },
};

export function NewsFeed({ news }: NewsFeedProps) {
  const getDaysAgo = (date: Date) => {
    const days = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days <= 3) return `${days} days ago`;
    return `${days} days ago`;
  };

  const isRecent = (date: Date) => {
    const days = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return days <= 3;
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
          <Calendar className="size-8 text-gray-700" />
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
          Latest Updates
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
          Stay informed with deadline alerts, program updates, and expert essay writing tips.
        </p>
        <Badge variant="secondary" className="bg-green-100 text-green-700 mt-4">
          Updated today
        </Badge>
      </motion.div>

      {/* News Items */}
      <div className="space-y-4">
        {news.map((item, index) => {
          const config = newsTypeConfig[item.type];
          const Icon = config.icon;
          const recent = isRecent(item.date);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className={`p-5 shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${config.bg} ${recent ? 'ring-2 ring-offset-2 ring-blue-200' : ''}`}
                style={{ borderLeftColor: config.color.replace('text-', '#') }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${config.bg}`}>
                    <Icon className={`size-5 ${config.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className={`text-xs ${config.badge}`}>
                            {config.label}
                          </Badge>
                          {recent && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              New
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {getDaysAgo(item.date)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">
                      {item.description}
                    </p>

                    {item.programId && item.type !== 'essay-tip' && (
                      <Button variant="ghost" size="sm" className="text-xs -ml-2">
                        View Program
                        <ArrowRight className="size-3 ml-1" />
                      </Button>
                    )}

                    {item.type === 'essay-tip' && (
                      <Button variant="ghost" size="sm" className="text-xs -ml-2 text-purple-600 hover:text-purple-700">
                        Try AI Essay Mentor
                        <ArrowRight className="size-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info Section */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
        <div className="flex items-start gap-3">
          <Lightbulb className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Stay Informed, Stay Ahead</h3>
            <p className="text-xs text-gray-700 mb-3">
              This feed updates daily with deadline reminders, requirement changes, and expert essay tips. Check back regularly to stay on track.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}