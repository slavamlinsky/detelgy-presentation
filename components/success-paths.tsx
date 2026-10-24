import { BookOpen, BriefcaseBusiness, Compass, UsersRound } from "lucide-react";
import type { SlideContent } from "@/lib/presentation";

const paths = [
  "M 911 638 C 1015 638 1000 305 1190 305",
  "M 911 638 C 1015 638 1020 545 1190 545",
  "M 911 638 C 1015 638 1020 785 1190 785",
];
const icons = [BriefcaseBusiness, BookOpen, UsersRound];

export function SuccessPaths({ slide }: { slide: SlideContent }) {
  return (
    <div className="success-branch-scene" aria-label="Three equally valid professional ambitions branch from your ambition">
      <svg className="success-path-lines" viewBox="0 0 1920 1080" aria-hidden="true">
        {paths.map((path, index) => (
          <path key={index} data-success-line={index} d={path} pathLength="1" />
        ))}
      </svg>
      <div className="success-path-origin" tabIndex={0} role="img" aria-label="Your ambition">
        <span className="success-path-origin-mark">
          <Compass size={33} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <strong>Your ambition</strong>
      </div>
      <div className="success-path-destinations">
        {slide.items.map((item, index) => {
          const Icon = icons[index];
          return (
            <section
              className="success-path-card"
              data-success-path={index}
              key={item.title}
              tabIndex={0}
            >
              <span className="success-path-icon">
                <Icon size={44} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <div className="success-path-copy">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <span>{item.steps?.join(" → ")}</span>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
