import { useId } from "react";
import {
  ArrowUpRight,
  UsersRound,
  ChartNoAxesColumnIncreasing,
  Coins,
  Trophy,
} from "lucide-react";
import type { SlideContent } from "@/lib/presentation";
import { checkpointAttributes } from "@/lib/presentation-playback";
import { detelgyLinks } from "@/lib/detelgy-links";

const dimensions = [
  {
    x: 1470,
    y: 270,
    connector: "M1470 456 C1470 414 1470 380 1470 347",
    Icon: UsersRound,
  },
  {
    x: 1190,
    y: 550,
    connector: "M1376 550 C1334 550 1300 550 1267 550",
    Icon: ChartNoAxesColumnIncreasing,
  },
  {
    x: 1750,
    y: 550,
    connector: "M1564 550 C1606 550 1640 550 1673 550",
    Icon: Coins,
  },
  {
    x: 1470,
    y: 830,
    connector: "M1470 644 C1470 686 1470 720 1470 753",
    Icon: Trophy,
  },
] as const;

// Simplified land silhouettes create an atmospheric globe, not a geographic data map.
const land: number[][][] = [
  [
    [-17, 36],
    [8, 37],
    [32, 31],
    [43, 12],
    [51, 11],
    [42, -10],
    [35, -25],
    [19, -35],
    [10, -28],
    [9, -2],
    [-5, 5],
    [-17, 15],
  ],
  [
    [-10, 36],
    [-10, 58],
    [10, 71],
    [45, 70],
    [90, 76],
    [140, 68],
    [180, 65],
    [178, 45],
    [135, 33],
    [120, 20],
    [110, 0],
    [100, 5],
    [80, 8],
    [70, 25],
    [40, 30],
    [30, 42],
    [10, 42],
  ],
  [
    [-168, 66],
    [-140, 70],
    [-110, 74],
    [-60, 52],
    [-65, 45],
    [-80, 25],
    [-97, 15],
    [-115, 30],
    [-130, 50],
  ],
  [
    [-81, 12],
    [-60, 10],
    [-35, -7],
    [-48, -25],
    [-68, -55],
    [-76, -35],
  ],
  [
    [-55, 59],
    [-24, 72],
    [-30, 83],
    [-62, 82],
  ],
  [
    [113, -21],
    [130, -12],
    [145, -15],
    [153, -28],
    [143, -39],
    [115, -34],
  ],
  [
    [46, -13],
    [50, -17],
    [47, -26],
    [44, -23],
  ],
];
function isLand(lon: number, lat: number) {
  return land.some((polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [x, y] = polygon[i],
        [px, py] = polygon[j];
      if (y > lat !== py > lat && lon < ((px - x) * (lat - y)) / (py - y) + x)
        inside = !inside;
    }
    return inside;
  });
}
const globeDots: { x: number; y: number; depth: number }[] = [];
const svgNumber = (value: number) => Number(value.toFixed(3));
for (let lat = -75; lat <= 80; lat += 4) {
  for (let lon = -180; lon < 180; lon += 4) {
    const a = (lat * Math.PI) / 180,
      b = ((lon - 16) * Math.PI) / 180;
    const depth = Math.cos(a) * Math.cos(b);
    if (depth > 0.08 && isLand(lon, lat))
      globeDots.push({
        x: svgNumber(1470 + 231 * Math.cos(a) * Math.sin(b)),
        y: svgNumber(550 - 231 * Math.sin(a)),
        depth: svgNumber(depth),
      });
  }
}

export function ClosingSlideContent({
  slide,
  step = 1,
}: {
  slide: SlideContent;
  step?: 0 | 1;
}) {
  const id = useId().replaceAll(":", "");
  const [firstLine, secondLine] = slide.title.split("\n");
  return (
    <div className="closing-composition" data-closing-step={step}>
      <div className="closing-intro">
        <h2>
          <span>{firstLine}</span>
          <em>{secondLine}</em>
        </h2>
        <p>{slide.lead}</p>
      </div>
      <figure
        className="closing-ecosystem"
        role="img"
        aria-label="Connect, Grow, Earn and Lead surround the Detelgy symbol over a stylized globe, bringing four dimensions of professional growth into one global community."
      >
        <svg viewBox="0 0 1920 1080" aria-hidden="true">
          <defs>
            <radialGradient id={`${id}-surface`} cx="38%" cy="22%" r="90%">
              <stop offset="0" stopColor="#254e70" />
              <stop offset="0.58" stopColor="#102e4d" />
              <stop offset="1" stopColor="#0b2038" />
            </radialGradient>
            <radialGradient id={`${id}-atmosphere`}>
              <stop offset="0" stopColor="#28618c" stopOpacity=".23" />
              <stop offset=".7" stopColor="#1b507a" stopOpacity=".08" />
              <stop offset="1" stopColor="#0b2038" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g className="closing-orbits">
            <circle
              cx="1470"
              cy="550"
              r="365"
              fill={`url(#${id}-atmosphere)`}
            />
            <g className="closing-globe">
              <circle cx="1470" cy="550" r="232" />
              {[65, 150].map((r) => (
                <ellipse key={r} cx="1470" cy="550" rx={r} ry="232" />
              ))}
              {[85, 170].map((r) => (
                <ellipse key={r} cx="1470" cy="550" rx="232" ry={r} />
              ))}
            </g>
            <g fill="#78b5dc">
              {globeDots.map(({ x, y, depth }, i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={svgNumber(1.2 + depth * 0.65)}
                  opacity={svgNumber(0.12 + depth * 0.3)}
                />
              ))}
            </g>
            <g className="closing-orbit-lines">
              <circle
                cx="1470"
                cy="550"
                r="280"
                className="closing-orbit-main"
              />
              <ellipse
                cx="1470"
                cy="550"
                rx="334"
                ry="145"
                transform="rotate(32 1470 550)"
              />
              <ellipse
                cx="1470"
                cy="550"
                rx="334"
                ry="145"
                transform="rotate(-32 1470 550)"
              />
              <ellipse
                cx="1470"
                cy="550"
                rx="214"
                ry="320"
                className="closing-orbit-dotted"
              />
            </g>
            <g className="closing-orbit-lights">
              {[45, 135, 225, 315].map((angle) => (
                <circle
                  key={angle}
                  cx={svgNumber(1470 + 280 * Math.cos((angle * Math.PI) / 180))}
                  cy={svgNumber(550 + 280 * Math.sin((angle * Math.PI) / 180))}
                  r="5.5"
                />
              ))}
            </g>
            <g className="closing-orbit-travelers">
              <ellipse
                className="closing-orbit-traveler"
                data-orbit="1"
                cx="1470"
                cy="550"
                rx="334"
                ry="145"
                transform="rotate(32 1470 550)"
                pathLength="100"
              />
              <ellipse
                className="closing-orbit-traveler"
                data-orbit="2"
                cx="1470"
                cy="550"
                rx="334"
                ry="145"
                transform="rotate(-32 1470 550)"
                pathLength="100"
              />
            </g>
          </g>
          {dimensions.map(({ x, y, connector, Icon }, index) => (
            <g
              className="closing-dimension"
              data-closing-dimension={index}
              key={slide.items[index].title}
            >
              <path
                className="closing-connector"
                pathLength={1}
                d={connector}
              />
              <g className="closing-node-art">
                <circle
                  className="closing-node"
                  cx={x}
                  cy={y}
                  r="77"
                  fill={`url(#${id}-surface)`}
                />
                <Icon
                  className="closing-node-icon"
                  x={x - 24}
                  y={y - 43}
                  width={48}
                  height={48}
                  strokeWidth={1.5}
                />
                <text x={x} y={y + 35} textAnchor="middle">
                  {slide.items[index].title}
                </text>
              </g>
            </g>
          ))}
          <g className="closing-hub">
            <circle
              className="closing-hub-outer"
              cx="1470"
              cy="550"
              r="94"
              fill={`url(#${id}-surface)`}
            />
            <circle className="closing-hub-inner" cx="1470" cy="550" r="79" />
            <image
              href="/assets/favicon.svg"
              x="1414"
              y="494"
              width="112"
              height="112"
            />
          </g>
        </svg>
      </figure>
      <div
        className="closing-invitation"
        {...checkpointAttributes(step)}
        inert={step === 0}
      >
        <p>{slide.closing}</p>
        <div className="closing-cta-details">
          <div className="closing-support">{slide.cta}</div>
          <div className="closing-actions" data-no-slide-advance>
            <a
              className="closing-primary"
              href={detelgyLinks.requestAccess}
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply to Join
              <ArrowUpRight size={24} strokeWidth={1.7} aria-hidden="true" />
            </a>
            <a
              className="closing-secondary"
              href={detelgyLinks.home}
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore Detelgy
              <ArrowUpRight size={22} strokeWidth={1.7} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
