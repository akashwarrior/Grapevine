'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion, type Transition } from 'motion/react';
import {
  Children,
  cloneElement,
  useState,
  useId,
  type ReactElement,
} from 'react';

export type AnimatedBackgroundProps = {
  children:
  | ReactElement<{ 'data-id': string }>[]
  | ReactElement<{ 'data-id': string }>;
  defaultValue: string;
  onValueChange?: (newActiveId: string) => void;
  className?: string;
  transition?: Transition;
};

export function AnimatedBackground({
  children,
  defaultValue,
  onValueChange,
  className,
  transition = {
    type: 'spring',
    bounce: 0.2,
    duration: 0.3,
  },
}: AnimatedBackgroundProps) {
  const [activeId, setActiveId] = useState<string>(defaultValue);
  const uniqueId = useId();

  const handleSetActiveId = (id: string) => {
    setActiveId(id);

    if (onValueChange) {
      onValueChange(id);
    }
  };

  return Children.map(children, (child: any, index) => {
    const id = child.props['data-id'];

    return cloneElement(
      child,
      {
        key: index,
        className: cn('relative inline-flex', child.props.className),
        'data-checked': activeId === id ? 'true' : 'false',
        onClick: () => handleSetActiveId(id),
      },
      <>
        <AnimatePresence initial={false}>
          {activeId === id && (
            <motion.div
              layoutId={`background-${uniqueId}`}
              className={cn('absolute inset-0', className)}
              transition={transition}
              initial={{ opacity: defaultValue ? 1 : 0 }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            />
          )}
        </AnimatePresence>
        <div className='z-10'>{child.props.children}</div>
      </>
    );
  });
}
