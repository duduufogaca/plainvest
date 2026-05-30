'use client';

export function RefreshButton({ label }: { label: string }) {
  return (
    <button
      className="ae-btn-secondary"
      onClick={() => window.location.reload()}
    >
      {label}
    </button>
  );
}
