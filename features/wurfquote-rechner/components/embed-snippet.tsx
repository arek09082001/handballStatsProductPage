'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { EMBED_SNIPPET } from '../data/calculator-content';

/**
 * Copy-to-clipboard box for the iframe snippet. The code stays selectable
 * whether or not the Clipboard API is available, so a coach can always grab it
 * by hand.
 * @returns A JSX element rendering the copyable embed snippet.
 */
export default function EmbedSnippet() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMBED_SNIPPET);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className='board-shadow relative overflow-hidden rounded-2xl border border-ink/10 bg-court'>
      <div className='flex items-center justify-between gap-4 border-b border-chalk/10 px-4 py-3'>
        <span className='font-hand text-lg text-chalk/70'>iframe-Code</span>
        <button
          type='button'
          onClick={handleCopy}
          className='inline-flex h-9 items-center gap-2 rounded-lg border border-chalk/25 px-3 text-[13px] font-semibold text-chalk transition-colors hover:border-chalk/45 hover:bg-chalk/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'>
          {copied ? <Check className='size-3.5' /> : <Copy className='size-3.5' />}
          {copied ? 'Kopiert' : 'Kopieren'}
        </button>
      </div>
      <pre className='overflow-x-auto px-4 py-4 text-[13px] leading-6 text-chalk/85'>
        <code>{EMBED_SNIPPET}</code>
      </pre>
    </div>
  );
}
