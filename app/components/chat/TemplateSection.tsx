import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { cn } from '~/utils/cn';
import type { ShowcaseTemplate, TemplateCategory } from '~/types/showcase-template';
import { loadShowcaseTemplates } from '~/utils/showcase-templates';

const CATEGORY_BADGE_COLORS: Record<string, { text: string; bg: string }> = {
  'landing-page': { text: '#22d3ee', bg: 'rgba(34, 211, 238, 0.12)' },
  portfolio: { text: '#818cf8', bg: 'rgba(129, 140, 248, 0.12)' },
  'online-store': { text: '#4ade80', bg: 'rgba(74, 222, 128, 0.12)' },
  dashboard: { text: '#fb923c', bg: 'rgba(251, 146, 60, 0.12)' },
  saas: { text: '#c084fc', bg: 'rgba(192, 132, 252, 0.12)' },
  'ai-app': { text: '#f472b6', bg: 'rgba(244, 114, 182, 0.12)' },
  fraud: { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' },
  api: { text: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
  bot: { text: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  compliance: { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
};

const CATEGORY_LABELS: Record<string, string> = {
  'landing-page': 'Landing Page',
  portfolio: 'Portfolio',
  'online-store': 'Online Store',
  dashboard: 'Dashboard',
  saas: 'SaaS',
  'ai-app': 'AI App',
  fraud: 'Fraud Detection',
  api: 'API Gateway',
  bot: 'Trading Bot',
  compliance: 'Compliance',
};

function getCategoryBadge(category: TemplateCategory) {
  const colors = CATEGORY_BADGE_COLORS[category] ?? { text: '#9ca3af', bg: 'rgba(156,163,175,0.12)' };
  const label = CATEGORY_LABELS[category] ?? category;

  return { colors, label };
}

interface TemplateSectionProps {
  orientation?: 'horizontal' | 'vertical';
}

const HORIZONTAL_CARD_WIDTH = 180;
const VERTICAL_CARD_WIDTH = 200;
const CARD_HEIGHT = 120;
const GAP = 12;

/** Pixels per second for the auto-scroll */
const SCROLL_SPEED_PX_PER_SEC = 20;

export const TemplateSection: React.FC<TemplateSectionProps> = ({ orientation = 'horizontal' }) => {
  const isVertical = orientation === 'vertical';
  const cardWidth = isVertical ? VERTICAL_CARD_WIDTH : HORIZONTAL_CARD_WIDTH;
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<ShowcaseTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadShowcaseTemplates()
      .then((data) => {
        const withUrl = data.filter((t) => t.vercelUrl?.trim());
        const withoutUrl = data.filter((t) => !t.vercelUrl?.trim());

        setTemplates([...withUrl, ...withoutUrl]);
      })
      .catch(() => {
        setTemplates([]);
      })
      .finally(() => setLoading(false));
  }, []);

  /* Total size of one set of cards (used for animation distance) */
  const totalSize = useMemo(() => {
    if (templates.length === 0) {
      return 0;
    }

    const cardDimension = isVertical ? CARD_HEIGHT : cardWidth;

    return templates.length * (cardDimension + GAP);
  }, [templates, isVertical, cardWidth]);

  /* Duration to traverse one full set at the chosen speed */
  const durationSec = totalSize > 0 ? totalSize / SCROLL_SPEED_PX_PER_SEC : 0;

  if (loading) {
    return (
      <div className="w-full max-w-chat mx-auto mt-4 px-4">
        <div className="flex items-center justify-center py-4">
          <div className="i-svg-spinners:90-ring-with-bg text-lg text-devonz-elements-loader-progress" />
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return null;
  }

  /* Render two copies so CSS translateX can loop seamlessly */
  const displayItems = [...templates, ...templates];

  return (
    <div
      className={cn('mx-auto px-4', {
        'w-full max-w-chat mt-32': !isVertical,
        'w-[240px] h-full flex flex-col pt-16 pb-20': isVertical,
      })}
      style={{ minWidth: 0 }}
    >
      {isVertical && (
        <div className="flex flex-col items-center gap-3 mb-6 px-2">
          <div className="flex items-center gap-3 w-full">
            <div
              className="flex-1 h-px"
              style={{ background: 'linear-gradient(to right, transparent, var(--devonz-elements-borderColor))' }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-devonz-elements-textTertiary whitespace-nowrap">
              Templates
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: 'linear-gradient(to left, transparent, var(--devonz-elements-borderColor))' }}
            />
          </div>
        </div>
      )}

      {/* Carousel viewport — clips overflow */}
      <div
        className={cn('relative', {
          'overflow-hidden': true,
          'h-full': isVertical,
        })}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Sliding track — two copies side by side, translated via CSS */}
        <div
          ref={trackRef}
          className={cn('flex pb-2', {
            'flex-nowrap': !isVertical,
            'flex-col': isVertical,
          })}
          style={{
            gap: GAP,
            width: isVertical ? '100%' : 'max-content',
            height: isVertical ? 'max-content' : 'auto',
            animation: `template-marquee-${orientation} ${durationSec}s linear infinite`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {displayItems.map((template, idx) => {
            const { colors, label } = getCategoryBadge(template.category);

            return (
              <button
                key={`${template.id}-${idx}`}
                type="button"
                onClick={() => navigate(`/templates?selected=${template.id}`)}
                className="rounded-2xl overflow-hidden bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl transition-all duration-300 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#E68D7B]/20 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  flex: isVertical ? `0 0 ${CARD_HEIGHT}px` : `0 0 ${cardWidth}px`,
                  width: isVertical ? '100%' : `${cardWidth}px`,
                  height: isVertical ? `${CARD_HEIGHT}px` : '120px',
                  position: 'relative',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 4px 20px -10px rgba(0,0,0,0.1)',
                }}
                aria-label={`Open ${template.name} template`}
              >
                {/* Screenshot thumbnail */}
                <img
                  src={`/screenshots/${template.id}.png`}
                  alt={`${template.name} preview`}
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';

                    const fallback = target.nextElementSibling as HTMLElement | null;

                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />

                {/* Fallback icon (hidden by default) */}
                <div
                  className={cn('items-center justify-center surface-2', {
                    'text-3xl': !isVertical,
                    'text-4xl': isVertical,
                  })}
                  style={{
                    display: 'none',
                    position: 'absolute',
                    inset: 0,
                  }}
                  aria-hidden="true"
                >
                  <span>{template.icon}</span>
                </div>

                {/* Category badge — top-right */}
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full z-10"
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: colors.text,
                    backgroundColor: colors.bg,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {label}
                </span>

                {/* Name overlay — bottom */}
                <div
                  className={cn('px-3 z-10', {
                    'py-2': !isVertical,
                    'py-3': isVertical,
                  })}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
                  }}
                >
                  <span
                    className={cn('font-bold text-white truncate block drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]', {
                      'text-xs': !isVertical,
                      'text-[13px]': isVertical,
                    })}
                  >
                    {template.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Keyframes + scrollbar-hide */}
      <style>{`
        @keyframes template-marquee-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${totalSize}px); }
        }
        @keyframes template-marquee-vertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-${totalSize}px); }
        }
        .template-carousel::-webkit-scrollbar { display: none; }
      `}</style>

      {/* View all button — below carousel */}
      {!isVertical && (
        <div className="flex justify-center mt-5">
          <Link
            to="/templates"
            prefetch="intent"
            className="text-xs font-bold px-6 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 group bg-[var(--devonz-elements-button-secondary-background)] hover:bg-[var(--devonz-elements-button-secondary-backgroundHover)] backdrop-blur-md text-devonz-elements-textSecondary hover:text-devonz-elements-textPrimary shadow-sm hover:shadow-md no-underline border border-devonz-elements-borderColor active:scale-95"
          >
            View All Templates
            <div className="i-ph:arrow-right text-xs transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </div>
  );
};
