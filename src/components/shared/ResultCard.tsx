import React from 'react';

interface ResultCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ children, title, className }) => (
  <div className={`bg-result rounded-xl p-5 border border-primary/10 result-enter ${className || ''}`}>
    {title && <h3 className="text-lg font-semibold text-result-foreground mb-3">{title}</h3>}
    {children}
  </div>
);
