'use client';

import { cloneElement, isValidElement, startTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type RequestType = 'project' | 'analysis';

interface ContactDialogProps {
  children: React.ReactElement;
  defaultSubject?: string;
  title?: string;
}

const getRequestType = (defaultSubject?: string, title?: string): RequestType => {
  const value = `${defaultSubject ?? ''} ${title ?? ''}`.toLowerCase();

  return value.includes('analyse') || value.includes('analysis')
    ? 'analysis'
    : 'project';
};

export default function ContactDialog({
  children,
  defaultSubject = '',
  title = '',
}: ContactDialogProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleActivate = () => {
    const requestType = getRequestType(defaultSubject, title);
    const finalCtaForm = document.getElementById('final-cta-form');

    if (finalCtaForm) {
      window.dispatchEvent(
        new CustomEvent('landing-page:request-type', {
          detail: { requestType },
        })
      );

      finalCtaForm.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      window.setTimeout(() => {
        document.getElementById('cta-name')?.focus();
      }, 450);

      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('requestType', requestType);
      currentUrl.hash = 'final-cta-form';

      window.history.replaceState(
        null,
        '',
        `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`
      );
      return;
    }

    startTransition(() => {
      router.push(`/?requestType=${requestType}#final-cta-form`);
    });
  };

  if (!isValidElement(children)) {
    return null;
  }

  const child = children as React.ReactElement<{
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  }>;

  return cloneElement(child, {
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      child.props.onClick?.(event);

      if (event.defaultPrevented) {
        return;
      }

      handleActivate();
    },
  });
}
