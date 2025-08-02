import { ReactNode, forwardRef } from 'react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  animation?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideInUp';
  delay?: number;
  duration?: number;
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, className, animation = 'fadeInUp', delay = 0, duration = 600 }, ref) => {
    const [elementRef, isVisible] = useScrollAnimation({
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });

    const animationClasses = {
      fadeInUp: isVisible 
        ? 'translate-y-0 opacity-100' 
        : 'translate-y-8 opacity-0',
      fadeInDown: isVisible 
        ? 'translate-y-0 opacity-100' 
        : '-translate-y-8 opacity-0',
      fadeInLeft: isVisible 
        ? 'translate-x-0 opacity-100' 
        : '-translate-x-8 opacity-0',
      fadeInRight: isVisible 
        ? 'translate-x-0 opacity-100' 
        : 'translate-x-8 opacity-0',
      scaleIn: isVisible 
        ? 'scale-100 opacity-100' 
        : 'scale-95 opacity-0',
      slideInUp: isVisible 
        ? 'translate-y-0 opacity-100' 
        : 'translate-y-12 opacity-0',
    };

    const transitionStyle = {
      transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      transitionDelay: `${delay}ms`,
    };

    return (
      <div
        ref={(node) => {
          elementRef.current = node;
          if (ref) {
            if (typeof ref === 'function') {
              ref(node);
            } else {
              ref.current = node;
            }
          }
        }}
        className={cn(
          'transition-all duration-600 ease-out',
          animationClasses[animation],
          className
        )}
        style={transitionStyle}
      >
        {children}
      </div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';

export { AnimatedCard };
