import type { SlideContent } from '@/lib/presentation';
import { Eye, UsersRound, Wallet } from 'lucide-react';
import { checkpointAttributes } from '@/lib/presentation-playback';

const comparisonIcons = [Eye, UsersRound, Wallet] as const;

const scenes = [
  {
    className: 'world-before',
    image: '/assets/personas/david-before-office-wide.png',
    alt: 'Dmytro working at a modest desk with handwritten notes, printed pages and folders',
  },
  {
    className: 'world-connected',
    image: '/assets/personas/david-connected-office-wide.png',
    alt: 'Dmytro at an organized desk with a laptop in a bright modern workspace',
  },
] as const;

export function TransformationScene({ slide, step = 1 }: { slide: SlideContent; step?: number }) {
  return <div className="transformation-world" aria-label="Illustrative before and with Detelgy professional experience">
    {scenes.map((scene, index) => <figure className={`world-state ${scene.className}`} key={scene.className} {...(index === 1 ? checkpointAttributes(step) : {})} inert={index === 1 && step < 1}>
      <figcaption className="world-state-title">{slide.columns?.[index]}</figcaption>
      <div className="world-scene">
        <img src={scene.image} alt={scene.alt} />
      </div>
      <div className="world-overlay" aria-label={index === 0 ? 'Before conditions' : 'With Detelgy possibilities'}>
        {slide.items.map((item, pair) => {
          const Icon = comparisonIcons[pair];
          return <div className="world-comparison" key={item.title} data-pair={pair} tabIndex={0}>
            <span className="world-comparison-label"><Icon aria-hidden="true" size={16} strokeWidth={1.75} /><span>{index === 0 ? item.title : item.body}</span></span>
            <span className="world-progress" aria-hidden="true"><span className="world-progress-fill" /></span>
          </div>;
        })}
      </div>
    </figure>)}
    <div className="world-seam" {...checkpointAttributes(step)} aria-hidden="true"><span /></div>
  </div>;
}
