import type { SlideContent } from '@/lib/presentation';

const scenes = [
  {
    className: 'world-before',
    image: '/assets/personas/david-before-office.png',
    alt: 'David working at a modest desk with handwritten notes, printed pages and folders',
    caption: 'Capable, but constrained',
  },
  {
    className: 'world-connected',
    image: '/assets/personas/david-connected-office.png',
    alt: 'The same David at an organized desk with a laptop in a bright modern workspace',
    caption: 'Same expertise, stronger possibilities',
  },
] as const;

export function TransformationScene({ slide }: { slide: SlideContent }) {
  return <div className="transformation-world" aria-label="Illustrative before and with Detelgy professional experience">
    {scenes.map((scene, index) => <figure className={`world-state ${scene.className}`} key={scene.className}>
      <figcaption className="world-state-title">{slide.columns?.[index]}</figcaption>
      <div className="world-scene">
        <img src={scene.image} alt={scene.alt} />
        <span className="world-scene-caption">{scene.caption}</span>
      </div>
    </figure>)}
    <div className="world-seam" aria-hidden="true"><span /></div>
    <ul className="world-outcomes-accessible">
      {slide.items.map(item => <li key={item.title}>{item.title} becomes {item.body}.</li>)}
    </ul>
  </div>;
}
