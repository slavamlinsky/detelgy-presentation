import { WorkloadScene } from "./workload-scene";
import { AudiencePersonas } from "./audience-personas";
import { AmbitionScene } from "./ambition-scene";
import { TransformationScene } from "./transformation-scene";
import { MissionContent, CoopetitionContent } from "./mission-coopetition";
import { GrowPieContent } from "./grow-pie";
import { GrowthFlywheel } from "./growth-flywheel";
import { SuccessPaths } from "./success-paths";
import {
  ArrowUpRight,
  BookOpen,
  BadgeCheck,
  Users,
  UserRound,
  Globe2,
  MessageCircle,
  Compass,
  GraduationCap,
  BriefcaseBusiness,
  Target,
  TrendingUp,
  ScanSearch,
  UsersRound,
} from "lucide-react";
import {
  slideMetadata,
  type Deck,
  type SlideContent,
} from "@/lib/presentation";

function SceneLines({ kind }: { kind: string }) {
  return (
    <svg className="story-lines" viewBox="0 0 1920 1080" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2">
        {kind === "branches" ? (
          <>
            {[370, 610, 840].map((y, i) => (
              <path
                key={y}
                data-branch={i}
                d={`M800 625 C1080 625 1050 ${y} 1290 ${y}`}
              />
            ))}
            <circle cx="800" cy="625" r="22" />
          </>
        ) : kind === "loop" ? (
          <>
            <path
              data-part="loop"
              d="M1380 270 C1760 280 1770 800 1420 840 C1080 880 1020 410 1240 300"
              strokeWidth="4"
            />
            <path d="m1218 293 27 4-12 26" strokeWidth="4" />
          </>
        ) : (
          <>
            {[
              [1170, 300],
              [1660, 240],
              [1780, 600],
              [1470, 850],
              [980, 730],
              [1320, 550],
            ].map(([x, y], i) => (
              <g key={i}>
                <path
                  d={`M1320 550 Q${x} 550 ${x} ${y}`}
                  strokeDasharray={kind === "islands" ? "4 16" : undefined}
                />
                <circle cx={x} cy={y} r={i === 5 ? 85 : 12} />
              </g>
            ))}
          </>
        )}
      </g>
    </svg>
  );
}
export function StorySlide({
  slide: s,
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
  const dark = slideMetadata[index].theme === "dark";
  const icons = [Users, BookOpen, BriefcaseBusiness, BadgeCheck];
  const accentParts = s.accent ? s.title.split(s.accent) : null;
  return (
    <article
      className={`slide v2-slide story-slide story-${s.id} ${dark ? "dark" : "light"}`}
      data-slide={s.id}
      aria-label={`${index + 1}. ${s.title}`}
    >
      <header className="slide-header">
        {brand}
        <span>{ui.visionLabel}</span>
      </header>
      <main className="story-content">
        {s.id !== "mission" && s.id !== "coopetition" && s.id !== "grow-pie" && <div className="story-title" key={s.id === "s09" ? "s09-title" : "story-title"}>
          <h2>
            {s.id === "s09" ? (
              <>
                {s.title.split("\n").slice(0, -1).map((line) => <span className="ecosystem-headline-line" key={line}>{line}</span>)}
                <em>{s.accent}</em>
              </>
            ) : s.id === "s07" && accentParts?.length === 2 ? (
              <>{accentParts[0]}<em>{s.accent}</em>{accentParts[1]}</>
            ) : ["s03", "s04", "s05", "s06", "s08", "s12", "s13"].includes(s.id) ? (
              <>
                {s.id === "s06" ? <span className="barrier-headline-first">{s.title.split("\n")[0]}</span> : s.id === "s08" ? <span className="transformation-headline-first">{s.title.split("\n")[0]}</span> : s.id === "s12" ? <span className="success-headline-first">{s.title.split("\n")[0]}</span> : s.id === "s13" ? <span className="business-headline-first">{s.title.split("\n")[0]}</span> : s.title.split("\n")[0]}
                <em>{s.title.split("\n")[1]}</em>
              </>
            ) : (
              s.title
            )}
          </h2>
          <p>{s.lead}</p>
        </div>}
        {s.id === "mission" && <MissionContent slide={s} />}
        {s.id === "coopetition" && <CoopetitionContent slide={s} />}
        {s.id === "grow-pie" && <GrowPieContent slide={s} />}
        {s.id === "s03" && <AudiencePersonas slide={s} />}
        {s.id === "s04" && (
          <>
            <div className="story-portrait">
              <img
                src="/assets/professional-portrait.png"
                alt={ui.portraitAlt}
              />
              <div>
                <strong>{s.persona?.name}</strong>
                <span>{s.persona?.detail}</span>
                <span className="persona-profession">
                  {s.persona?.profession}
                </span>
              </div>
            </div>
            <div className="persona-tensions">
              {s.displayItems?.map((a, i) => {
                const Icon = [BriefcaseBusiness, Target, TrendingUp][i];
                return <section key={a.title} data-tension={i}>
                  <span>{Icon && <Icon size={25} strokeWidth={1.5} aria-hidden="true" />}{a.title}</span>
                  <h3>{a.body}</h3>
                </section>;
              })}
            </div>
          </>
        )}
        {s.id === "s05" && <WorkloadScene slide={s}/>}
        {s.id === "s06" && (
          <div className="barrier-system" aria-label="Three illustrative barriers to professional growth">
            {s.displayItems?.map((a, i) => {
              const Icon = [ScanSearch, UsersRound, BriefcaseBusiness][i];
              return <section className="barrier-panel" key={a.title} data-barrier={i} tabIndex={0} aria-label={`${a.title}: ${a.body} ${a.detail}`}>
                <div className="barrier-panel-content">
                  <Icon size={44} strokeWidth={1.25} aria-hidden="true" />
                  <span className="barrier-category">{a.title}</span>
                  <h3>{a.body}</h3>
                  <p>{a.detail}</p>
                </div>
              </section>;
            })}
          </div>
        )}
        {s.id === "s07" && <AmbitionScene slide={s} />}
        {s.id === "s08" && <TransformationScene slide={s} />}
        {s.id === "s09" && (
          <>
            <p className="ecosystem-foundation">
              <Globe2 size={23} strokeWidth={1.6} aria-hidden="true" />
              {s.foundation}
            </p>
            <div className="ecosystem-system">
              <svg className="ecosystem-connections" viewBox="0 0 1030 780" preserveAspectRatio="none" aria-hidden="true">
                <path pathLength="1" d="M390 238 C414 261 442 303 467 336" />
                <path pathLength="1" d="M670 285 C640 289 612 310 587 336" />
                <path pathLength="1" d="M700 520 C657 508 614 477 587 444" />
                <path pathLength="1" d="M416 520 C433 507 451 470 467 444" />
              </svg>
              <div className="ecosystem-center" tabIndex={0} aria-label="Professional growth connects all four areas">
                <UserRound size={34} strokeWidth={1.4} aria-hidden="true" />
                <strong>Professional<br />growth</strong>
              </div>
              <div className="ecosystem-pillars">
                {s.items.map((a, i) => {
                  const Icon = icons[i];
                  return (
                    <section className="ecosystem-card" key={a.title} data-pillar={i} tabIndex={0}>
                      <div className="ecosystem-card-heading">
                        <Icon size={32} strokeWidth={1.5} aria-hidden="true" />
                        <h3>{a.title}</h3>
                      </div>
                      <p className="ecosystem-card-built">
                        <span>{ui.status.built}</span><span>{a.body}</span>
                      </p>
                      <p className="ecosystem-card-planned">
                        <span>{ui.status.planned}</span><span>{a.detail}</span>
                      </p>
                    </section>
                  );
                })}
              </div>
            </div>
          </>
        )}
        {s.id === "s11" && (
          <>
            <GrowthFlywheel slide={s} />
            <p className="flywheel-microcopy">{s.microcopy}</p>
          </>
        )}
        {s.id === "s12" && (
          <SuccessPaths slide={s} />
        )}
        {s.id === "s13" && (
          <div className="value-landscape">
            <section className="business-column business-column-value" aria-label={s.columns?.[0]}>
              <h3 className="business-column-heading">{s.columns?.[0]}</h3>
              <div className="business-card-list">
                {s.valueItems?.map((item, i) => (
                  <article className="business-card" key={item.title} data-value-card={i}>
                    <h4>{item.title}</h4>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
            </section>
            <section className="business-column business-column-revenue" aria-label={s.columns?.[1]}>
              <h3 className="business-column-heading">{s.columns?.[1]}</h3>
              <div className="business-card-list">
                {s.items.map((item, i) => (
                  <article className="business-card" key={item.title} data-revenue-card={i}>
                    <div className="business-card-title">
                      <h4>{item.title}</h4>
                    </div>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
        {s.id === "s14" && (
          <>
            <SceneLines kind="network" />
            <div className="finale-words">
              {s.items.map((a, i) => (
                <span key={i} data-outcome={i}>
                  {a.title}
                </span>
              ))}
            </div>
            <div className="finale-invitation">
              <p>{s.closing}</p>
              <span>
                {s.cta}
                <ArrowUpRight size={34} />
              </span>
            </div>
          </>
        )}
      </main>
      <footer className="slide-footer">
        <span className="slide-folio">
          {String(index + 1).padStart(2, "0")}
          <i>/</i>{total}
        </span>
      </footer>
    </article>
  );
}
