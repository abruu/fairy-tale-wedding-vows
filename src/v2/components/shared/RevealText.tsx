import React from 'react';
import { useReveal } from '../../hooks/useReveal';

interface RevealTextProps {
  children: React.ReactNode;
  type?: 'up' | 'scale' | 'left' | 'right' | 'blur' | 'clip';
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Wrapper component that applies scroll-reveal animation to children.
 */
export const RevealText: React.FC<RevealTextProps> = ({
  children,
  type = 'up',
  delay = 0,
  className = '',
  as: Tag = 'div',
}) => {
  const { ref, revealed, className: revealClass } = useReveal<HTMLElement>({
    type,
    delay,
  });

  return (
    // @ts-expect-error - dynamic tag
    <Tag ref={ref} className={`${revealClass} ${revealed ? 'revealed' : ''} ${className}`}>
      {children}
    </Tag>
  );
};

/**
 * Staggered reveal container — children reveal one by one.
 */
export const StaggerReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}> = ({ children, className = '', stagger = 100 }) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, i) => {
        if (!React.isValidElement(child)) return child;
        return (
          <RevealText key={i} delay={i * stagger}>
            {child}
          </RevealText>
        );
      })}
    </div>
  );
};
