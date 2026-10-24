import type { SlideItem } from '@/lib/presentation';

const personaPortraits = [
  '/assets/personas/emerging-3d.png',
  '/assets/personas/examiner-3d.png',
  '/assets/personas/expert-3d.png',
];

export function JourneySpotlight({ label, moments }: { label: string; moments: SlideItem[] }) {
  return <div className="v2-first-values" aria-label={label}>
    <div className="v2-value-examples">
      {moments.map((moment, index) => <section key={moment.title}>
        <div className="v2-value-persona">
          <span className="v2-persona-marker"><img src={personaPortraits[index]} alt="" /></span>
          <h3>{moment.title}</h3>
        </div>
        <strong>{moment.body}</strong>
        <p>{moment.detail}</p>
      </section>)}
    </div>
  </div>;
}
