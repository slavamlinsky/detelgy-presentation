import type { SlideContent } from "@/lib/presentation";
import { checkpointAttributes } from "@/lib/presentation-playback";

function polar(radius: number, degrees: number) {
  const radians = degrees * Math.PI / 180;
  return `${(Math.cos(radians) * radius).toFixed(2)} ${(Math.sin(radians) * radius).toFixed(2)}`;
}

function MarketDisc({ x, y, radius, className, step }: { x: number; y: number; radius: number; className: string; step?: number }) {
  const angles = [-90, -18, 54, 126, 198];
  return <g className={className} transform={`translate(${x} ${y})`} {...(step === undefined ? {} : checkpointAttributes(step))}>
    <g className="pie-disc-inner">
      <circle r={radius} className="pie-disc-field" />
      <path className="pie-disc-share" d={`M0 0 L${polar(radius, angles[0])} A${radius} ${radius} 0 0 1 ${polar(radius, angles[1])} Z`} />
      {angles.map(angle => <path key={angle} className="pie-disc-divider" d={`M0 0 L${polar(radius, angle)}`} />)}
      <circle r={radius} className="pie-disc-outline" />
      <circle r={5} className="pie-disc-center" />
    </g>
  </g>;
}

export function GrowPieContent({ slide, step = 1 }: { slide: SlideContent; step?: 0 | 1 }) {
  const [firstLine, secondLine] = slide.title.split("\n");
  const [closingFirst, closingSecond] = slide.closing?.split("\n") ?? [];
  return <div className="pie-composition" data-pie-step={step}>
    <h2><span className="pie-headline-first">{firstLine}</span><em className="pie-headline-second" {...checkpointAttributes(step)}>{secondLine}</em></h2>
    <p className="pie-support" {...checkpointAttributes(step)}>{slide.lead}</p>
    <figure className="pie-visual" role="img" aria-label={step === 0 ? "Illustrative existing market pie; a second market view will appear on the next advance." : "Illustrative comparison: a smaller existing market and a larger possible market with the same highlighted share proportion. No measured values are shown."}>
      <figcaption className="pie-state-label pie-state-existing">Existing market</figcaption>
      <figcaption className="pie-state-label pie-state-growing" {...checkpointAttributes(step)}>Growing market</figcaption>
      <svg viewBox="0 0 1920 1080" aria-hidden="true">
        <MarketDisc x={610} y={710} radius={112} className="pie-disc-left" />
        <path className="pie-expansion-link" pathLength={1} d="M768 710 H1152" {...checkpointAttributes(step)} />
        <path className="pie-expansion-arrow" d="m1137 697 15 13-15 13" {...checkpointAttributes(step)} />
        <MarketDisc x={1360} y={710} radius={180} className="pie-disc-right" step={step} />
      </svg>
    </figure>
    <p className="pie-final" {...checkpointAttributes(step)}><span>{closingFirst}</span><em>{closingSecond}</em></p>
  </div>;
}
