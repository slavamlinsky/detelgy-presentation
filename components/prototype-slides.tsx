import {
  ArrowUpRight,
  BriefcaseBusiness,
  BadgeCheck,
  Compass,
  Globe2,
  GraduationCap,
  MapPin,
  MessageCircle,
  Monitor,
  Sprout,
  UserRound,
  UserRoundPlus,
  Users,
} from "lucide-react";
import type { Deck, SlideContent } from "@/lib/presentation";
import { JourneySpotlight } from "./journey-spotlight";

function GrowthGraphic() {
  // Deliberate size progression remains visible when the slide is scaled to a laptop.
  const nodes = [
    { t: 0, radius: 18, label: "Start", Icon: null },
    { t: 0.32, radius: 25, label: "Profile", Icon: UserRound },
    { t: 0.62, radius: 32, label: "Connections", Icon: Users },
    { t: 0.83, radius: 39, label: "Opportunities", Icon: BriefcaseBusiness },
    { t: 1, radius: 48, label: "Growth", Icon: ArrowUpRight },
  ];
  return (
    <svg
      className="v2-growth"
      viewBox="0 0 1920 1080"
      role="group"
      aria-label="An ascending professional journey from identity through connections and opportunities to growth."
    >
      <path
        className="growth-trajectory"
        data-part="growth-trajectory"
        pathLength="1"
        d="M1100 850 Q1500 820 1750 260"
        fill="none"
        stroke="#91c5ed"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {nodes.map(({ t, radius, label, Icon }, i) => {
        const x = 1100 + 800 * t - 150 * t * t,
          y = 850 - 60 * t - 530 * t * t;
        const iconSize = i === 4 ? 40 : 22 + i * 4;
        return (
          <g
            className="growth-node"
            key={label}
            data-milestone={i}
            tabIndex={0}
            role="img"
            aria-label={label}
            transform={`translate(${x} ${y})`}
          >
            <g className={`growth-node-reveal growth-node-${i}`}>
              <circle
                className="growth-halo"
                r={radius + 9}
                fill="none"
                stroke="#b9dffa"
                strokeWidth="1"
              />
              <circle
                className="growth-node-surface"
                r={radius}
                fill={i === 4 ? "#b9dffa" : "#08182e"}
                stroke="#7da8c8"
                strokeWidth="1.5"
              />
              {Icon && (
                <Icon
                  className="growth-node-icon"
                  x={-iconSize / 2}
                  y={-iconSize / 2}
                  width={iconSize}
                  height={iconSize}
                  color={i === 4 ? "#08182e" : "#c5e2f7"}
                  strokeWidth={1.3}
                />
              )}
              <text
                className="growth-node-label"
                x={-radius - 22}
                y="0"
                dy=".35em"
                textAnchor="end"
                aria-hidden="true"
              >
                {label}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
const fragments = [
  { angle: -135, Icon: Monitor },
  { angle: -45, Icon: BriefcaseBusiness },
  { angle: 135, Icon: Users },
  { angle: 45, Icon: GraduationCap },
];
function FragmentGraphic({ slide }: { slide: SlideContent }) {
  return <svg className="v2-constellation fragment-scene" viewBox="0 0 1920 1080" role="group" aria-label={slide.diagramAlt}>
    <g className="fragment-globe" aria-hidden="true" transform="translate(1400 545) rotate(-16)" fill="none" stroke="#235784" strokeWidth="1.8" opacity="0.20" pointerEvents="none">
      <circle r="365" />
      <g className="fragment-meridians">
        {[0, 1, 2].map(i => <path key={i} className="fragment-meridian" d="M0-365 A365 365 0 0 1 0 365" />)}
      </g>
      <ellipse rx="365" ry="120" />
      <path d="M-320-175 Q0-95 320-175 M-320 175 Q0 95 320 175" />
    </g>
    <g className="fragment-expert" data-node="professional" tabIndex={0} role="img" aria-label={slide.center} transform="translate(1380 535)">
      <g className="fragment-center-reveal">
        <g className="fragment-center-emphasis">
          <circle className="fragment-center-halo" r="104" fill="none" stroke="#91b7d4" strokeWidth="2"/>
          <circle r="90" fill="#01255a" />
          <UserRound x={-37} y={-39} width={74} height={74} color="#d8ecfa" strokeWidth={1.2}/>
        </g>
        <text y="133" textAnchor="middle" fontSize="27" fill="#235784">{slide.center}</text>
      </g>
    </g>
    {fragments.map(({angle,Icon},i)=>{
      const radians=angle*Math.PI/180;
      const point=(radius:number)=>`${1380+radius*Math.cos(radians)} ${535+radius*Math.sin(radians)}`;
      const x=1380+350*Math.cos(radians), y=535+350*Math.sin(radians);
      const link=`M${point(115)} L${point(180)} M${point(225)} L${point(285)}`;
      const item=slide.displayItems?.[i];
      const delay=`${650+i*150}ms`;
      return <g className="fragment-unit" data-fragment={i} key={i}>
        <path className="fragment-link" data-link={i} pathLength="1" d={link} fill="none" stroke="#c4d5e2" strokeWidth="2" strokeLinecap="round" style={{animationDelay:delay}}/>
        <g className="fragment-node" tabIndex={0} role="img" aria-label={`${item?.title}: ${item?.body}`} transform={`translate(${x} ${y})`}>
          <g className="fragment-upright">
          <g className="fragment-node-reveal" style={{animationDelay:delay}}>
            <circle className="fragment-halo" r="60" fill="none" stroke="#91b7d4" strokeWidth="1.5"/>
            <circle className="fragment-surface" r="49" fill="#eaf1f7" />
            <Icon x={-23} y={-23} width={46} height={46} strokeWidth={1.3} color="#49789b"/>
            <text y="97" textAnchor="middle" fill="#14243b" fontSize="37" fontWeight="500">{item?.title}</text>
            <text className="fragment-detail" y="135" textAnchor="middle" fontSize="23" fill="#49789b" aria-hidden="true">{item?.body}</text>
          </g>
          </g>
        </g>
      </g>;
    })}
  </svg>;
}
const stagePositions = [
  [170, 720],
  [510, 690],
  [870, 640],
  [1270, 570],
  [1710, 490],
];
const stageIcons = [Compass, UserRoundPlus, BadgeCheck, Users, Sprout];
function JourneyGraphic({ slide }: { slide: SlideContent }) {
  return (
    <svg
      className="v2-route"
      viewBox="0 0 1920 1080"
      role="img"
      aria-label={slide.diagramAlt}
    >
      {[
        "M112 720 C140 720 150 720 170 720",
        "M170 720 C350 720 360 690 510 690",
        "M510 690 C700 690 710 640 870 640",
        "M870 640 C1075 640 1095 570 1270 570",
        "M1270 570 C1510 570 1520 490 1710 490",
      ].map((d, i) => <path
        key={i}
        data-segment={i}
        className="journey-segment"
        pathLength="1"
        d={d}
        fill="none"
        stroke="#a3c4dc"
        strokeWidth="3"
        strokeLinecap="round"
      />)}
      <path className="journey-value-branch" d="M870 705 C870 730 870 746 870 769" fill="none" stroke="#c0d8e9" strokeWidth="2" />
      <path
        className="journey-arrow"
        d="M1710 490 H1775 m-17 -11 18 11-18 11"
        fill="none"
        stroke="#235784"
        strokeWidth="3"
      />
      {stagePositions.map(([x, y], i) => {
        const Icon = stageIcons[i];
        return (
          <g data-stage={i} key={i} transform={`translate(${x} ${y})`}>
            {i === 2 && (
              <circle className="journey-focus-ring" r="61" fill="#d9ecf765" stroke="#9bc7e4" strokeWidth="2" />
            )}
            <g className="journey-node-interactive" tabIndex={0} role="img" aria-label={slide.stages?.[i]}>
              <circle
                r={i === 2 ? 43 : i < 2 ? 30 : 27}
                fill={i === 2 ? "#01255a" : "#faf9f6"}
                stroke={i === 2 ? "#01255a" : i < 2 ? "#4d8fbd" : "#759fbe"}
                strokeWidth="2"
              />
              <Icon
                x={-15}
                y={-15}
                width={30}
                height={30}
                color={i === 2 ? "#fff" : "#235784"}
                strokeWidth={1.5}
              />
            </g>
            <text
              y={i === 2 ? -98 : -66}
              textAnchor="middle"
              fill={i === 2 ? "#01255a" : i < 2 ? "#244a69" : "#34546e"}
              fontSize={i === 2 ? 47 : 38}
              fontWeight={i < 3 ? "560" : "500"}
            >
              {slide.stages?.[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
export function PrototypeSlide({
  slide,
  index,
  ui,
  brand,
  total,
}: {
  slide: SlideContent;
  index: number;
  ui: Deck["ui"];
  brand: React.ReactNode;
  total: number;
}) {
  const cover = slide.id === "s01";
  return (
    <article
      className={`slide v2-slide v2-${slide.id} ${cover ? "dark" : "light"}`}
      data-slide={slide.id}
      aria-label={`${index + 1}. ${slide.title}`}
    >
      <header className="slide-header">
        {brand}
      </header>
      {cover ? (
        <>
          <GrowthGraphic />
          <main className="v2-cover-copy">
            <h2>
              {slide.title.slice(0, slide.title.indexOf(slide.accent))}
              <em>{slide.accent}.</em>
            </h2>
            <p>{slide.lead}</p>
          </main>
          <p className="v2-cover-signoff">
            {slide.footer}
            <ArrowUpRight size={30} strokeWidth={1.5} />
          </p>
        </>
      ) : slide.id === "s02" ? (
        <>
          <main className="v2-fragment-copy">
            <h2>
              {slide.title.split("\n")[0]}
              <em>{slide.title.split("\n")[1]}</em>
            </h2>
            <p>{slide.lead}</p>

          </main>
          <FragmentGraphic slide={slide} />
        </>
      ) : (
        <>
          <main className="v2-journey-copy">
            <h2><span>{slide.title.split("\n")[0]}</span><em>{slide.accent}</em></h2>
            <p>{slide.lead}</p>
          </main>
          <JourneyGraphic slide={slide} />
          <JourneySpotlight label={slide.momentsLabel ?? "First Value examples"} moments={slide.moments ?? []} />
        </>
      )}
      <footer className="slide-footer">
        <span className="slide-folio">
          {String(index + 1).padStart(2, "0")}
          <i>/</i>{total}
        </span>
      </footer>
    </article>
  );
}
