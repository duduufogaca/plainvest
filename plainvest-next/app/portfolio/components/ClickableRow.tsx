'use client';

import { useRouter } from 'next/navigation';

export function ClickableRow({ href, className, children }: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <tr
      className={className}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('form, input, button, a, select, textarea')) return;
        router.push(href);
      }}
    >
      {children}
    </tr>
  );
}
