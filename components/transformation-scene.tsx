import type { SlideContent } from '@/lib/presentation';

const scenes = [
  {
    className: 'world-before',
    image: '/assets/personas/david-before-office-wide.png',
    alt: 'David working at a modest desk with handwritten notes, printed pages and folders',
  },
  {
    className: 'world-connected',
    image: '/assets/personas/david-connected-office-wide.png',
    alt: 'The same David at an organized desk with a laptop in a bright modern workspace',
  },
] as const;

export function TransformationScene({ slide }: { slide: SlideContent }) {
  return <div className="transformation-world" aria-label="Illustrative before and with Detelgy professional experience">
    {scenes.map((scene, index) => <figure className={`world-state ${scene.className}`} key={scene.className}>
      <figcaption className="world-state-title">{slide.columns?.[index]}</figcaption>
      <div className="world-scene">
        <img src={scene.image} alt={scene.alt} />
      </div>
      <div className="world-overlay" aria-label={index === 0 ? 'Before conditions' : 'With Detelgy possibilities'}>
        {slide.items.map((item, pair) => <div className="world-comparison" key={item.title} data-pair={pair} tabIndex={0}>
          <span>{index === 0 ? item.title : item.body}</span>
          <span className="world-progress" aria-hidden="true"><span className="world-progress-fill" /></span>
        </div>)}
      </div>
    </figure>)}
    <div className="world-seam" aria-hidden="true"><span /></div>
  </div>;
}
