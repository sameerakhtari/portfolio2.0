import type { DiagramKind } from "@/data/projects";

/** Functional, semantic topologies; also remain available when GPU rendering fails. */
export function MiniDiagram({
  kind,
  color = "currentColor",
}: {
  kind: DiagramKind;
  color?: string;
}) {
  const names: Record<DiagramKind, string[]> = {
    lab: ["ROUTER", "COMPUTE", "SERVICES"],
    cluster: ["K8S-01", "K8S-02", "K8S-03"],
    workflow: ["INPUT", "PROCESS", "DELIVER"],
    security: ["MESSAGE", "ENCRYPT", "RECEIVE"],
    iot: ["SENSOR", "PROCESS", "OUTPUT"],
    network: ["ROUTER", "SWITCH", "NETWORK"],
    storage: ["DISKS", "STORAGE", "SERVICES"],
    code: ["NETWORK", "CPU", "MEMORY"],
  };
  return (
    <svg
      viewBox="0 0 440 240"
      fill="none"
      className="mini-diagram"
      role="img"
      aria-label={names[kind].join(" connects to ")}
    >
      <path
        d="M20 120H80M155 120H185L205 90H265M265 90H285L310 140H330M390 140H425"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M20 170H165L190 190H320V150M35 55H125V83M240 40V58M378 50V105"
        stroke="currentColor"
        opacity=".23"
        strokeDasharray="4 5"
      />
      {names[kind].map((name, i) => {
        const x = [76, 197, 318][i],
          y = [80, 50, 100][i];
        return (
          <g key={name}>
            <rect
              x={x}
              y={y}
              width="82"
              height="72"
              stroke="currentColor"
              fill="var(--paper)"
            />
            <rect
              x={x + 6}
              y={y + 6}
              width="70"
              height="60"
              stroke="currentColor"
              opacity=".18"
            />
            <text
              x={x + 41}
              y={y + 41}
              textAnchor="middle"
              fill="currentColor"
              stroke="none"
              fontSize="12"
              fontFamily="var(--mono)"
            >
              {name}
            </text>
            {[0, 1, 2, 3].map((j) => (
              <path
                key={j}
                d={`M${x + 12 + j * 17} ${y - 6}v6M${x + 12 + j * 17} ${y + 72}v6`}
                stroke="currentColor"
                opacity=".5"
              />
            ))}
          </g>
        );
      })}
      <circle cx="45" cy="120" r="4" fill={color} />
      <circle cx="417" cy="140" r="3" fill={color} />
    </svg>
  );
}
