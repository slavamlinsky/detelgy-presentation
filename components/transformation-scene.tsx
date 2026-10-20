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
    </figure>)}
    <div className="world-seam" aria-hidden="true"><span /></div>
    <div className="world-comparisons" aria-label="Three possible professional transformations">
      {slide.items.map((item, index) => <div className="world-comparison" key={item.title} data-pair={index} tabIndex={0}>
        <span className="world-comparison-before">
          <span>{item.title}</span>
          <span className="world-progress" aria-hidden="true"><span className="world-progress-fill" /></span>
        </span>
        <span className="world-comparison-arrow" aria-label="to">→</span>
        <span className="world-comparison-after">
          <span>{item.body}</span>
          <span className="world-progress" aria-hidden="true"><span className="world-progress-fill" /></span>
        </span>
      </div>)}
    </div>
  </div>;
}
