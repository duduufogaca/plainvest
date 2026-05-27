'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
};

export function SubmitButton({ children, pendingText = 'Please wait...', className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button className={className} type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? pendingText : children}
    </button>
  );
}
