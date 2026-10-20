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
        <circle cx="90" cy="39" r="23" />
        <path d="M78 42c5-7 9-10 12-10s7 3 12 10M90 30v18" />
        <path className="ambition-accent-stroke" d="M90 62v24M31 86h118M31 86v17M90 86v17M149 86v17" />
        <rect x="13" y="106" width="36" height="50" rx="4" />
        <path d="M24 106v-5h14v5M21 120h20M21 130h20M21 140h13" />
        <path d="M72 108h36a5 5 0 0 1 5 5v29a5 5 0 0 1-5 5H88l-12 9v-9h-4a5 5 0 0 1-5-5v-29a5 5 0 0 1 5-5Z" />
        <path d="M78 120h24M78 131h18" />
        <circle cx="139" cy="120" r="6" /><circle cx="158" cy="120" r="6" />
        <path d="M128 151c0-11 5-17 11-17s11 6 11 17M147 139c2-3 6-5 11-5 7 0 12 6 12 17" />
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
        <h3>{item.title}</h3>
        <p>{item.body}</p>
      </div>
    </section>)}
  </div>;
}
