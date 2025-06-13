import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Brain, 
  Heart, 
  Star, 
  Sparkles, 
  Zap, 
  Target,
  Users,
  Eye,
  Upload,
  Download,
  MessageCircle,
  Search,
  Play
} from 'lucide-react';

interface AnimatedLoaderProps {
  type?: 'default' | 'ai' | 'upload' | 'search' | 'processing' | 'hearts' | 'dots' | 'pulse' | 'bounce' | 'slide' | 'messaging';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  message?: string;
  subMessage?: string;
  showProgress?: boolean;
  progress?: number;
  className?: string;
}

export const AnimatedLoader: React.FC<AnimatedLoaderProps> = ({
  type = 'default',
  size = 'md',
  color = 'primary',
  message,
  subMessage,
  showProgress = false,
  progress = 0,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'text-purple-600',
    secondary: 'text-blue-600',
    accent: 'text-pink-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const dotVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut" as any
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as any
      }
    }
  };

  const heartVariants = {
    animate: (i: number) => ({
      scale: [0.8, 1.2, 0.8],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        delay: i * 0.2,
        ease: "easeInOut" as any
      }
    })
  };

  const slideVariants = {
    animate: {
      x: [-50, 50, -50],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as any
      }
    }
  };

  const DefaultLoader = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`${sizeClasses[size]} ${colorClasses[color]}`}
    >
      <Loader2 className="w-full h-full" />
    </motion.div>
  );

  const AILoader = () => (
    <div className="flex items-center space-x-3">
      <motion.div
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`${sizeClasses[size]} ${colorClasses[color]}`}
      >
        <Brain className="w-full h-full" />
      </motion.div>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [0.5, 1, 0.5],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            className={`w-2 h-2 rounded-full ${
              color === 'primary' ? 'bg-purple-600' :
              color === 'secondary' ? 'bg-blue-600' :
              color === 'accent' ? 'bg-pink-600' :
              color === 'success' ? 'bg-green-600' :
              color === 'warning' ? 'bg-yellow-600' :
              'bg-red-600'
            }`}
          />
        ))}
      </div>
    </div>
  );

  const UploadLoader = () => (
    <div className="relative">
      <motion.div
        animate={{
          y: [-10, 10, -10]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`${sizeClasses[size]} ${colorClasses[color]}`}
      >
        <Upload className="w-full h-full" />
      </motion.div>
      <motion.div
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-2 -right-2 w-4 h-4"
      >
        <Sparkles className="w-full h-full text-yellow-500" />
      </motion.div>
    </div>
  );

  const SearchLoader = () => (
    <div className="flex items-center space-x-2">
      <motion.div
        animate={{
          rotate: [0, 45, 0, -45, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`${sizeClasses[size]} ${colorClasses[color]}`}
      >
        <Search className="w-full h-full" />
      </motion.div>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
            className="w-1 h-6 bg-gradient-to-t from-purple-600 to-pink-600 rounded-full"
          />
        ))}
      </div>
    </div>
  );

  const ProcessingLoader = () => (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        className={`${sizeClasses[size]} ${colorClasses[color]} opacity-30`}
      >
        <Target className="w-full h-full" />
      </motion.div>
      <motion.div
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute"
      >
        <Zap className={`${sizeClasses[size]} ${colorClasses[color]}`} />
      </motion.div>
    </div>
  );

  const HeartsLoader = () => (
    <motion.div
      variants={containerVariants}
      animate="animate"
      className="flex space-x-2"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          variants={heartVariants}
          custom={i}
          className={`${sizeClasses[size]} text-pink-500`}
        >
          <Heart className="w-full h-full fill-current" />
        </motion.div>
      ))}
    </motion.div>
  );

  const InternalDotsLoader = () => (
    <motion.div
      variants={containerVariants}
      animate="animate"
      className="flex space-x-1"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          variants={dotVariants}
          className={`w-3 h-3 rounded-full ${
            color === 'primary' ? 'bg-purple-600' :
            color === 'secondary' ? 'bg-blue-600' :
            color === 'accent' ? 'bg-pink-600' :
            color === 'success' ? 'bg-green-600' :
            color === 'warning' ? 'bg-yellow-600' :
            'bg-red-600'
          }`}
        />
      ))}
    </motion.div>
  );

  const PulseLoader = () => (
    <motion.div
      variants={pulseVariants}
      animate="animate"
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full border-4 border-current`}
    />
  );

  const BounceLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: [-20, 0, -20]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
          className={`w-4 h-4 rounded-full ${
            color === 'primary' ? 'bg-purple-600' :
            color === 'secondary' ? 'bg-blue-600' :
            color === 'accent' ? 'bg-pink-600' :
            color === 'success' ? 'bg-green-600' :
            color === 'warning' ? 'bg-yellow-600' :
            'bg-red-600'
          }`}
        />
      ))}
    </div>
  );

  const SlideLoader = () => (
    <div className="relative w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        variants={slideVariants}
        animate="animate"
        className={`absolute top-0 left-0 w-4 h-4 rounded-full ${
          color === 'primary' ? 'bg-purple-600' :
          color === 'secondary' ? 'bg-blue-600' :
          color === 'accent' ? 'bg-pink-600' :
          color === 'success' ? 'bg-green-600' :
          color === 'warning' ? 'bg-yellow-600' :
          'bg-red-600'
        }`}
      />
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case 'ai': return <AILoader />;
      case 'upload': return <UploadLoader />;
      case 'search': return <SearchLoader />;
      case 'processing': return <ProcessingLoader />;
      case 'hearts': return <HeartsLoader />;
      case 'dots': return <InternalDotsLoader />;
      case 'pulse': return <PulseLoader />;
      case 'bounce': return <BounceLoader />;
      case 'slide': return <SlideLoader />;
      case 'messaging': return <SearchLoader />; // Use SearchLoader for messaging type
      default: return <DefaultLoader />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {renderLoader()}
      
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-2"
        >
          <p className="font-medium text-gray-900 dark:text-gray-100">{message}</p>
          {subMessage && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{subMessage}</p>
          )}
        </motion.div>
      )}

      {showProgress && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-xs space-y-2"
        >
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`h-full rounded-full ${
                color === 'primary' ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
                color === 'secondary' ? 'bg-gradient-to-r from-blue-600 to-cyan-600' :
                color === 'accent' ? 'bg-gradient-to-r from-pink-600 to-rose-600' :
                color === 'success' ? 'bg-gradient-to-r from-green-600 to-emerald-600' :
                color === 'warning' ? 'bg-gradient-to-r from-yellow-600 to-orange-600' :
                'bg-gradient-to-r from-red-600 to-pink-600'
              }`}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedLoader;

// Standalone DotsLoader component for external use
export const DotsLoader: React.FC<{ color?: AnimatedLoaderProps['color'] }> = ({ 
  color = 'primary' 
}) => {
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const dotVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut" as any
      }
    }
  };

  const colorClasses = {
    primary: 'bg-purple-600',
    secondary: 'bg-blue-600',
    accent: 'bg-pink-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  };

  return (
    <motion.div
      variants={containerVariants}
      animate="animate"
      className="flex space-x-1"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          variants={dotVariants}
          className={`w-3 h-3 rounded-full ${colorClasses[color]}`}
        />
      ))}
    </motion.div>
  );
};

// Specific loader components for common use cases
export const AIThinkingLoader: React.FC<{ message?: string }> = ({ message = "AI is thinking..." }) => (
  <AnimatedLoader
    type="ai"
    size="lg"
    color="primary"
    message={message}
    subMessage="Processing with artificial intelligence"
  />
);

export const UploadingLoader: React.FC<{ progress?: number }> = ({ progress = 0 }) => (
  <AnimatedLoader
    type="upload"
    size="lg"
    color="success"
    message="Uploading your content"
    subMessage="Please wait while we process your files"
    showProgress={true}
    progress={progress}
  />
);

export const SearchingLoader: React.FC<{ query?: string }> = ({ query }) => (
  <AnimatedLoader
    type="search"
    size="md"
    color="secondary"
    message={`Searching${query ? ` for "${query}"` : '...'}`}
    subMessage="Finding the best results for you"
  />
);

export const ProcessingLoader: React.FC<{ operation?: string }> = ({ operation = "Processing" }) => (
  <AnimatedLoader
    type="processing"
    size="xl"
    color="accent"
    message={`${operation}...`}
    subMessage="This may take a few moments"
  />
);

export const HeartLoader: React.FC = () => (
  <AnimatedLoader
    type="hearts"
    size="md"
    message="Loading with love"
    className="text-pink-500"
  />
);

// Page-specific loaders
export const PageLoader: React.FC<{ page?: string }> = ({ page = "page" }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
    <div className="text-center space-y-8 p-8">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
      </motion.div>
      
      <div className="space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Loading {page}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we prepare everything for you
        </p>
      </div>
      
      <DotsLoader />
    </div>
  </div>
);

export const FullScreenLoader: React.FC<{ 
  message?: string; 
  subMessage?: string;
  type?: AnimatedLoaderProps['type'];
}> = ({ 
  message = "Loading...", 
  subMessage = "Please wait",
  type = "ai"
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
    <div className="text-center space-y-6 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4">
      <AnimatedLoader
        type={type}
        size="xl"
        color="primary"
        message={message}
        subMessage={subMessage}
      />
    </div>
  </div>
);