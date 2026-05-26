'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AddPositionForm } from './AddPositionForm';
import type { Lang } from '@/lib/portfolio-i18n';

export function AddPositionModal({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isEN = lang !== 'pt';

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const modal = (
    <div className="add-pos-overlay" onClick={() => setOpen(false)}>
      <div className="add-pos-panel" onClick={e => e.stopPropagation()}>
        <div className="add-pos-header">
          <div>
            <p className="add-pos-eyebrow">{isEN ? 'Portfolio' : 'Portfólio'}</p>
            <h2 className="add-pos-title">{isEN ? 'Add Position' : 'Adicionar Posição'}</h2>
          </div>
          <button className="add-pos-close" onClick={() => setOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="add-pos-body">
          <AddPositionForm lang={lang} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button className="add-position-trigger-btn" onClick={() => setOpen(true)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        {isEN ? 'Add Position' : 'Adicionar'}
      </button>
      {mounted && open && createPortal(modal, document.body)}
    </>
  );
}
