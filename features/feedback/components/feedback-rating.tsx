'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FEEDBACK_RATING_VALUES } from '../data/feedback-content';

interface FeedbackRatingProperties {
  value: number;
  onChange: (rating: number) => void;
}

/**
 * The five-star rating field. Built on real radio inputs rather than buttons —
 * arrow keys, tab order and screen-reader announcements come for free that way,
 * and the visible star is just the label. Hovering previews the rating without
 * committing it, the way every rating widget a coach has already used behaves.
 */
export default function FeedbackRating({
  value,
  onChange,
}: FeedbackRatingProperties) {
  const t = useTranslations('feedbackPage');
  const [hovered, setHovered] = useState(0);

  // What the stars show: the hover preview while the pointer is over the row,
  // the committed value otherwise.
  const shown = hovered || value;
  const caption = shown ? t(`ratingLabels.${shown}`) : t('ratingHint');

  return (
    <fieldset className='space-y-2'>
      <legend className='text-sm font-semibold text-ink'>
        {t('ratingLabel')}
      </legend>

      <div
        className='flex items-center gap-1.5'
        onMouseLeave={() => setHovered(0)}>
        {FEEDBACK_RATING_VALUES.map((rating) => {
          const isActive = rating <= shown;

          return (
            <label
              key={rating}
              onMouseEnter={() => setHovered(rating)}
              title={t(`ratingLabels.${rating}`)}
              className='cursor-pointer rounded-lg p-1 transition-transform duration-150 hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-primary/50'>
              <input
                type='radio'
                name='feedback-rating'
                value={rating}
                checked={value === rating}
                onChange={() => onChange(rating)}
                className='sr-only'
              />
              <span className='sr-only'>{t(`ratingLabels.${rating}`)}</span>
              <Star
                aria-hidden
                className={`size-8 transition-colors duration-150 ${
                  isActive
                    ? 'fill-primary text-primary'
                    : 'fill-transparent text-ink/25'
                }`}
              />
            </label>
          );
        })}
      </div>

      <p
        aria-live='polite'
        className='min-h-5 text-[13px] leading-5 text-ink/60'>
        {caption}
      </p>
    </fieldset>
  );
}
