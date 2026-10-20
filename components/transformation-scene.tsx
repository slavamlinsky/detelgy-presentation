import type { SlideContent } from '@/lib/presentation';

const davidImage = '/assets/personas/david-workload.png';

function OutcomeGlyph({ kind }: { kind: number }) {
  return <svg viewBox="0 0 52 52" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {kind === 0 && <>
      <circle cx="26" cy="19" r="6" /><path d="M15 37c0-7 4-11 11-11s11 4 11 11M9 13V8h6M37 8h6v5M9 39v5h6M37 44h6v-5" />
    </>}
    {kind === 1 && <>
      <circle cx="17" cy="19" r="5" /><circle cx="35" cy="19" r="5" /><path d="M7 38c0-8 4-12 10-12s10 4 10 12M25 38c0-8 4-12 10-12s10 4 10 12" />
    </>}
    {kind === 2 && <>
      <circle cx="26" cy="12" r="5" /><path d="M26 17v12M11 29h30M11 29v7M26 29v7M41 29v7" /><circle cx="11" cy="40" r="4" /><circle cx="26" cy="40" r="4" /><circle cx="41" cy="40" r="4" />
    </>}
  </svg>;
}

function WorldState({ slide, connected }: { slide: SlideContent; connected: boolean }) {
  return <section className={`world-state ${connected ? 'world-connected' : 'world-before'}`} aria-label={connected ? 'With Detelgy: connected professional experience' : 'Before: fragmented professional experience'}>
    <span className="world-state-title">{connected ? slide.columns?.[1] : slide.columns?.[0]}</span>
    <div className="world-atmosphere" aria-hidden="true" />
    <svg className="world-lines" viewBox="0 0 790 480" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      {connected ? <>
        <path pathLength="1" d="M394 245C265 270 80 245 36 163" />
        <path pathLength="1" d="M394 245C510 280 570 240 593 158" />
        <path pathLength="1" d="M394 245C480 265 560 310 593 353" />
      </> : <>
        <path d="M76 160c34 5 68 16 98 32" />
        <path d="M625 160c-28 9-50 23-77 39" />
        <path d="M625 348c-35-7-54-17-78-33" />
      </>}
    </svg>
    <div className="world-person">
      <img src={davidImage} alt={connected ? 'David in a connected professional ecosystem' : 'David in an isolated professional setting'} />
    </div>
    {slide.items.map((item, index) => <div className="world-node" data-outcome={index} key={item.title}>
      <span className="world-node-icon"><OutcomeGlyph kind={index} /></span>
      <span className="world-node-label">{connected ? item.body : item.title}</span>
    </div>)}
  </section>;
}

export function TransformationScene({ slide }: { slide: SlideContent }) {
  return <div className="transformation-world" aria-label="Illustrative before and with Detelgy professional experience">
    <WorldState slide={slide} connected={false} />
    <div className="world-seam" aria-hidden="true"><span /></div>
    <WorldState slide={slide} connected />
  </div>;
}
