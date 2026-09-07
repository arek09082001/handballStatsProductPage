'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { RATGEBER_TOOL_PATHS, type RatgeberTool } from './tools';

/**
 * The hub's tool cards in the reader's language, in the order of
 * `RATGEBER_TOOL_PATHS` and joined on the route rather than on list position.
 */
export function useRatgeberTools(): RatgeberTool[] {
  const t = useTranslations('guidePage.tools');

  return useMemo(() => {
    const byHref = new Map(
      (t.raw('items') as RatgeberTool[]).map((tool) => [tool.href, tool]),
    );

    return RATGEBER_TOOL_PATHS.flatMap((href) => {
      const tool = byHref.get(href);

      return tool ? [tool] : [];
    });
  }, [t]);
}
