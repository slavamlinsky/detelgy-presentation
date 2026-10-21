import { WorkloadScene } from "./workload-scene";
import { AudiencePersonas } from "./audience-personas";
import { AmbitionScene } from "./ambition-scene";
import { TransformationScene } from "./transformation-scene";
import {
  ArrowUpRight,
  BookOpen,
  BadgeCheck,
  Users,
  Sprout,
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
        ) : kind === "ecosystem" ? (
          <>
            {[
              [1060, 350],
              [1570, 350],
              [1060, 720],
              [1570, 720],
            ].map(([x, y], i) => (
              <path
                key={i}
                data-connection={i}
                d={`M1320 550 Q${x} 550 ${x} ${y}`}
              />
            ))}
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
}: {
  slide: SlideContent;
  index: number;
  ui: Deck["ui"];
  brand: React.ReactNode;
}) {
  const dark = slideMetadata[index].theme === "dark";
  const icons = [Users, BookOpen, BadgeCheck, BriefcaseBusiness];
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
        <div className="story-title">
          <h2>
            {s.id === "s07" && accentParts?.length === 2 ? (
              <>{accentParts[0]}<em>{s.accent}</em>{accentParts[1]}</>
            ) : ["s03", "s04", "s05", "s06", "s08"].includes(s.id) ? (
              <>
                {s.id === "s06" ? <span className="barrier-headline-first">{s.title.split("\n")[0]}</span> : s.id === "s08" ? <span className="transformation-headline-first">{s.title.split("\n")[0]}</span> : s.title.split("\n")[0]}
                <em>{s.title.split("\n")[1]}</em>
              </>
            ) : (
              s.title
            )}
          </h2>
          <p>{s.lead}</p>
        </div>
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
            <SceneLines kind="ecosystem" />
            <div className="ecosystem-center">
              <UserRound size={55} strokeWidth={1.2} />
            </div>
            <div className="ecosystem-pillars">
              {s.items.map((a, i) => {
                const Icon = icons[i];
                return (
                  <section key={a.title} data-pillar={i}>
                    <Icon size={36} strokeWidth={1.3} />
                    <h3>{a.title}</h3>
                    <p>
                      <span>{ui.status.built}</span>
                      {a.body}
                    </p>
                    <p>
                      <span>{ui.status.planned}</span>
                      {a.detail}
                    </p>
                  </section>
                );
              })}
            </div>
            <p className="ecosystem-foundation">
              <Globe2 size={28} />
              {s.foundation}
            </p>
          </>
        )}
        {s.id === "s11" && (
          <>
            <SceneLines kind="loop" />
            <div className="loop-center">
              <Sprout size={56} strokeWidth={1.3} />
              <h3>{s.center}</h3>
            </div>
            <div className="loop-labels">
              {s.items.map((a, i) => (
                <h3 key={i} data-phase={i}>
                  {a.title}
                </h3>
              ))}
            </div>
          </>
        )}
        {s.id === "s12" && (
          <>
            <SceneLines kind="branches" />
            <div className="branch-paths">
              {s.items.map((a, i) => (
                <section key={i} data-path={i}>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                  <span>{a.steps?.join(" → ")}</span>
                </section>
              ))}
            </div>
          </>
        )}
        {s.id === "s13" && (
          <div className="value-landscape">
            <p className="value-label">{s.columns?.[0]}</p>
            <p className="revenue-label">{s.columns?.[1]}</p>
            {s.items.map((a, i) => (
              <section key={i} data-value={i}>
                <p>{a.title}</p>
                <ArrowUpRight size={45} strokeWidth={1.2} />
                <div>
                  <h3>{a.body}</h3>
                  <span>{a.detail}</span>
                </div>
              </section>
            ))}
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
          <i>/</i>14
        </span>
      </footer>
    </article>
  );
}
