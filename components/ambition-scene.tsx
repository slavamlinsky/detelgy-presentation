import type { SlideContent } from '@/lib/presentation';

function AmbitionIllustration({ kind }: { kind: number }) {
  return <svg viewBox="0 0 180 180" aria-hidden="true" focusable="false">
    <path className="ambition-wash" d="M27 36C45 12 107 8 146 31c35 21 29 80-1 111-28 29-88 33-118 4C2 121 5 67 27 36Z" />
    <g className="ambition-ink" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {kind === 0 && <>
        <path d="M90 66c-18-12-37-15-60-8v75c23-7 42-4 60 8 18-12 37-15 60-8V58c-23-7-42-4-60 8Z" />
        <path d="M90 66v75M43 76c11-2 22 0 33 5M43 94c11-2 22 0 33 5M104 81c11-5 22-7 33-5M104 99c11-5 22-7 33-5" />
        <path className="ambition-accent-stroke" d="M67 40c5-7 13-11 23-11s18 4 23 11M90 18v10" />
      </>}
      {kind === 1 && <>
        <path d="M90 28c31 0 56 25 56 56s-25 56-56 56-56-25-56-56 25-56 56-56Z" />
        <path d="M90 44c22 0 40 18 40 40s-18 40-40 40-40-18-40-40 18-40 40-40Z" />
        <path className="ambition-accent-stroke" d="m90 60 7 16 17 2-13 12 4 17-15-8-15 8 4-17-13-12 17-2 7-16Z" />
        <path d="m53 130-8 32 22-11 16 14 6-25M127 130l8 32-22-11-16 14-6-25" />
      </>}
      {kind === 2 && <>
        <circle cx="56" cy="63" r="16" /><circle cx="124" cy="63" r="16" />
        <path d="M26 120c0-21 13-34 30-34s30 13 30 34M94 120c0-21 13-34 30-34s30 13 30 34" />
        <path className="ambition-accent-stroke" d="M71 51c7-8 16-12 27-12M82 39l16 0-3 16M80 137c17 10 36 10 53 0" />
      </>}
      {kind === 3 && <>
        <circle cx="90" cy="64" r="34" />
        <path className="ambition-accent-stroke" d="M90 42v44M103 49c-6-4-13-5-19-3-13 4-11 17 2 20l8 2c13 3 15 16 2 20-7 2-15 1-21-4" />
        <path d="M42 124c12-11 25-12 38-3l9 6 25-3c16-2 24 5 23 13-1 6-7 10-15 11l-33 7c-9 2-17 1-24-3l-23-12" />
        <path d="M25 118h17v36H25" />
      </>}
    </g>
  </svg>;
}

export function AmbitionScene({ slide }: { slide: SlideContent }) {
  return <div className="ambition-field" aria-label="Four independent dimensions of professional success">
    {slide.items.map((item, index) => <section
      className="ambition"
      key={item.title}
      data-ambition={index}
      tabIndex={0}
      aria-label={`${item.title}: ${item.body}`}
    >
      <div className="ambition-art"><AmbitionIllustration kind={index} /></div>
      <div className="ambition-copy">
        <span className="ambition-index">{String(index + 1).padStart(2, '0')}</span>
        <h3>{item.title}</h3>
        <p>{item.body}</p>
      </div>
    </section>)}
  </div>;
}
