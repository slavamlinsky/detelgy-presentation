import {
  BadgeCheck,
  BriefcaseBusiness,
  Eye,
  PenLine,
  Repeat2,
  TrendingUp,
} from "lucide-react";
import type { SlideContent } from "@/lib/presentation";

const center = { x: 1300, y: 560 };
const radius = 290;
const angles = [-90, -18, 54, 126, 198];
const icons = [PenLine, Eye, BadgeCheck, BriefcaseBusiness, Repeat2];
const labelPositions = [
  { x: 1300, y: 185, anchor: "middle" },
  { x: 1565, y: 390, anchor: "start" },
  { x: 1470, y: 888, anchor: "middle" },
  { x: 1130, y: 888, anchor: "middle" },
  { x: 1050, y: 390, anchor: "end" },
];

function point(angle: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: center.x + radius * Math.cos(radians),
    y: center.y + radius * Math.sin(radians),
  };
}

export function GrowthFlywheel({ slide }: { slide: SlideContent }) {
  const [hubFirst = "Professional", hubSecond = "Growth"] = (
    slide.center ?? "Professional Growth"
  ).split(" ");
  return (
    <svg
      className="growth-flywheel"
      viewBox="0 0 1920 1080"
      role="group"
      aria-label="Illustrative clockwise professional growth loop: Contribute, Gain visibility, Build trust, Find opportunities, Return and share."
    >
      <defs>
        <marker
          id="flywheel-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="9"
          markerHeight="9"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path
            d="M1 1 L8 5 L1 9"
            fill="none"
            stroke="#3f84b4"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>
      {angles.map((angle, index) => {
        const start = point(angle + 12);
        const end = point((index === 4 ? 270 : angles[index + 1]) - 12);
        return (
          <path
            key={index}
            className="flywheel-connector"
            data-connector={index}
            pathLength="1"
            d={`M${start.x.toFixed(1)} ${start.y.toFixed(1)} A${radius} ${radius} 0 0 1 ${end.x.toFixed(1)} ${end.y.toFixed(1)}`}
            markerEnd="url(#flywheel-arrow)"
          />
        );
      })}
      <g
        className="flywheel-hub"
        transform={`translate(${center.x} ${center.y})`}
      >
        <circle r="132" fill="none" stroke="#bcd9eb" strokeWidth="1.5" />
        <circle r="119" fill="#f8fcff" stroke="#b0d2e8" strokeWidth="2" />
        <TrendingUp
          x={-25}
          y={-72}
          width={50}
          height={50}
          color="#2c78a8"
          strokeWidth={1.45}
          aria-hidden="true"
        />
        <text y="14" textAnchor="middle">
          {hubFirst}
        </text>
        <text y="56" textAnchor="middle">
          {hubSecond}
        </text>
      </g>
      {angles.map((angle, index) => {
        const Icon = icons[index];
        const position = point(angle);
        const label = labelPositions[index];
        return (
          <g key={index} className="flywheel-stage" data-flywheel-stage={index}>
            <g
              className="flywheel-node"
              transform={`translate(${position.x.toFixed(1)} ${position.y.toFixed(1)})`}
              tabIndex={0}
              role="img"
              aria-label={slide.items[index]?.title}
            >
              <g className="flywheel-node-visual">
                <circle
                  r="53"
                  fill="#f9fcff"
                  stroke="#639fc8"
                  strokeWidth="2"
                />
                <Icon
                  x={-21}
                  y={-21}
                  width={42}
                  height={42}
                  color="#236995"
                  strokeWidth={1.45}
                  aria-hidden="true"
                />
              </g>
            </g>
            <text
              className="flywheel-stage-label"
              x={label.x}
              y={label.y}
              textAnchor={label.anchor as "start" | "middle" | "end"}
            >
              {slide.items[index]?.title}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
