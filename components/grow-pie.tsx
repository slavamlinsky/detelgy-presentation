import type { SlideContent } from "@/lib/presentation";

function polar(radius: number, degrees: number) {
  const radians = degrees * Math.PI / 180;
  return `${(Math.cos(radians) * radius).toFixed(2)} ${(Math.sin(radians) * radius).toFixed(2)}`;
}

function MarketDisc({ x, y, radius, className }: { x: number; y: number; radius: number; className: string }) {
  const angles = [-90, -18, 54, 126, 198];
  return <g className={className} transform={`translate(${x} ${y})`}>
    <g className="pie-disc-inner">
      <circle r={radius} className="pie-disc-field" />
      <path className="pie-disc-share" d={`M0 0 L${polar(radius, angles[0])} A${radius} ${radius} 0 0 1 ${polar(radius, angles[1])} Z`} />
      {angles.map(angle => <path key={angle} className="pie-disc-divider" d={`M0 0 L${polar(radius, angle)}`} />)}
      <circle r={radius} className="pie-disc-outline" />
      <circle r={5} className="pie-disc-center" />
    </g>
  </g>;
}

export function GrowPieContent({ slide }: { slide: SlideContent }) {
  const [firstLine, secondLine] = slide.title.split("\n");
  return <div className="pie-composition">
    <span className="pie-eyebrow">{slide.eyebrow}</span>
    <h2><span className="pie-headline-first">{firstLine}</span><em className="pie-headline-second">{secondLine}</em></h2>
    <p className="pie-support">{slide.lead}</p>
    <figure className="pie-visual" role="img" aria-label="Illustrative comparison: a fixed-size existing market and a larger possible market with the same highlighted share proportion. No measured values are shown.">
      <figcaption className="pie-state-label pie-state-existing">Existing market</figcaption>
      <figcaption className="pie-state-label pie-state-growing">Growing market</figcaption>
      <svg viewBox="0 0 1920 1080" aria-hidden="true">
        <MarketDisc x={610} y={737} radius={112} className="pie-disc-left" />
        <path className="pie-expansion-link" d="M760 737 H1090" />
        <path className="pie-expansion-arrow" d="m1076 723 14 14-14 14" />
        <MarketDisc x={1360} y={737} radius={164} className="pie-disc-right" />
      </svg>
    </figure>
    <p className="pie-final">{slide.closing}</p>
  </div>;
}
