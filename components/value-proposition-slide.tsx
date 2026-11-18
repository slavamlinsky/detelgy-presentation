import { Fragment } from 'react';
import { Brand } from './brand';
import type { SlideContent, SlideItem } from '@/lib/presentation';
import styles from './value-proposition-slide.module.css';

const themes: Record<string, string> = {
  'vp-01': 'hero dark',
  'vp-02': 'tinted',
  'vp-03': 'soft',
  'vp-04': 'expert dark',
  'vp-05': 'tinted',
  'vp-07': 'soft',
  'vp-08': 'dark',
  'vp-09': 'final dark',
};

function Cards({ items, variant, labelClass, arrows = false }: {
  items: SlideItem[];
  variant: string;
  labelClass: string;
  arrows?: boolean;
}) {
  return items.map(({ title, body, label }, index) => (
    <Fragment key={title}>
      {arrows && index > 0 && <span className="arrow" aria-hidden="true">→</span>}
      <div className={variant}>
        <div className={labelClass}>{label}</div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </Fragment>
  ));
}

function ValueSlideBody({ slide }: { slide: SlideContent }) {
  const { id, items, footer, prompt, microcopy, stages } = slide;
  switch (id) {
    case 'vp-01':
      return <ul className="hero-pills">{items.map(item =>
        <li className="pill darkpill" key={item.title}>{item.title}</li>
      )}</ul>;
    case 'vp-02':
      return <div className="two-side">{items.map(({ title, body, label, outcome }, index) => (
        <Fragment key={title}>
          {index === 1 && <div className="linkcircle" aria-hidden="true">
            <span className="node">↔</span>
          </div>}
          <div className={index === 0 ? 'side' : 'side customer'}>
            <span className={index === 0 ? 'pill' : 'pill mint'}>{label}</span>
            <h3>{title}</h3><p>{body}</p><div className="outcome">{outcome}</div>
          </div>
        </Fragment>
      ))}</div>;
    case 'vp-03':
      return <>
        <div className="frictions">{items.map(({ title, steps }) => (
          <div className="frictionbox" key={title}>
            <h3>{title}</h3>
            <ul>{steps?.map(step => <li className="friction-item" key={step}>
              <span className="mark" aria-hidden="true">×</span>{step}
            </li>)}</ul>
          </div>
        ))}</div>
        <p className="bottomline">{footer}</p>
      </>;
    case 'vp-04':
      return <>
        <div className="featuregrid"><Cards items={items} variant="feature" labelClass="index" /></div>
        <p className="outcomeline">{footer}</p>
      </>;
    case 'vp-05':
      return <>
        <div className="steps"><Cards items={items} variant="step" labelClass="step-num" /></div>
        <p className="aftersteps">{footer}</p>
      </>;
    case 'vp-06':
      return <div className="private-wrap">
        <div className="private-question">
          <h3>{prompt}</h3>
          <p className="request-chip"><span className="accent" aria-hidden="true">↗</span>{microcopy}</p>
        </div>
        <ul className="private-list">{items.map(({ title }) => (
          <li className="item" key={title}><span className="check" aria-hidden="true">✓</span>{title}</li>
        ))}</ul>
      </div>;
    case 'vp-07':
      return <>
        <div className="path"><Cards items={items} variant="path-card" labelClass="path-tag" arrows /></div>
        <p className="path-note">{footer}</p>
      </>;
    case 'vp-08':
      return <div className="comparison">
        <ul className="alternatives">{items.map(({ title, body }) => (
          <li className="alternative" key={title}><strong>{title}</strong><span>{body}</span></li>
        ))}</ul>
        <div className="detelgybox">
          <h3>{prompt}</h3>
          <ul className="stack">{stages?.map(stage => <li key={stage}>{stage}</li>)}</ul>
          <small>{footer}</small>
        </div>
      </div>;
    case 'vp-09':
      return <>
        <div className="promise">{items.map(({ title, body }) => (
          <div key={title}><b>{title}</b><span>{body}</span></div>
        ))}</div>
        <p className="closing">{footer}</p>
      </>;
  }
}

export function ValuePropositionSlide({ slide, index, total }: {
  slide: SlideContent;
  index: number;
  total: number;
}) {
  const isCover = slide.id === 'vp-01';
  const hasOrbit = isCover || slide.id === 'vp-09';
  const theme = themes[slide.id] ?? '';

  return <section className="slide" data-slide-id={slide.id}>
    <header className={`slide-header ${styles.slideBrand}`}>
      <Brand dark={theme.split(' ').includes('dark')} />
    </header>
    <div className={`${styles.canvas} ${theme}`}>
      {hasOrbit && <div className="hero-orbit" aria-hidden="true" />}
      {isCover && <><span className="hero-dot one" /><span className="hero-dot two" /></>}
      {slide.id === 'vp-02' && <div className="watermark" aria-hidden="true" />}
      <div className={hasOrbit ? 'statement' : 'toprow'}>
        <h2 className="heading">{slide.title.split('\n').map(line => (
          <span className={line === slide.accent ? 'accent' : undefined} key={line}>{line}</span>
        ))}</h2>
        <p className="subtitle">{slide.lead}</p>
      </div>
      <ValueSlideBody slide={slide} />
      <div className="folio">
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>
    </div>
  </section>;
}
