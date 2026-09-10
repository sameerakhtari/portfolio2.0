export type SystemNode = {
  id: string;
  label: string;
  subtitle: string;
  x: number;
  y: number;
  arrival: number;
  description: string;
  tags?: string[];
};
export type SystemEdge = {
  from: string;
  to: string;
  label?: string;
  disabled?: boolean;
};
export const productionNodes: SystemNode[] = [
  {
    id: "client",
    label: "REQUEST",
    subtitle: "browser",
    x: 80,
    y: 210,
    arrival: 0,
    description:
      "A browser first resolves a name, then opens an HTTPS connection. This diagram illustrates a request path; it is not DigitalOcean's internal topology.",
  },
  {
    id: "dns",
    label: "DNS",
    subtitle: "name → address",
    x: 255,
    y: 75,
    arrival: 0.1,
    description:
      "DNS resolution finds an address before the HTTP request. It is a lookup relationship, not a proxy through which application traffic passes.",
  },
  {
    id: "edge",
    label: "EDGE / TLS",
    subtitle: "Cloudflare",
    x: 280,
    y: 230,
    arrival: 0.19,
    description:
      "TLS establishes an encrypted connection. An edge layer can handle traffic before it reaches the origin. Configuration and origin behaviour still matter.",
  },
  {
    id: "proxy",
    label: "NGINX",
    subtitle: "reverse proxy",
    x: 475,
    y: 230,
    arrival: 0.33,
    description:
      "The reverse proxy receives and routes requests. Web-server rules, headers and caching boundaries shape application behaviour.",
  },
  {
    id: "php",
    label: "APACHE / PHP",
    subtitle: "application runtime",
    x: 665,
    y: 230,
    arrival: 0.47,
    description:
      "Application processing uses workers, CPU and memory. Understanding worker behaviour helps connect a slow request to pressure on the host.",
  },
  {
    id: "cache",
    label: "CACHE",
    subtitle: "reused responses",
    x: 475,
    y: 390,
    arrival: 0.49,
    description:
      "Caching can reuse work at several layers. Cache hits, misses and exclusions change how much traffic reaches the runtime and database.",
  },
  {
    id: "db",
    label: "MYSQL",
    subtitle: "persistent data",
    x: 845,
    y: 230,
    arrival: 0.6,
    description:
      "Database queries share resources with the application stack. Query behaviour is one part of a complete performance investigation.",
  },
  {
    id: "logs",
    label: "EVIDENCE",
    subtitle: "logs / metrics",
    x: 735,
    y: 70,
    arrival: 0.65,
    description:
      "Logs and resource measurements connect observations across layers. Root-cause analysis follows that evidence rather than choosing a component in advance.",
  },
];
export const productionEdges: SystemEdge[] = [
  { from: "client", to: "dns", label: "resolve" },
  { from: "client", to: "edge", label: "HTTPS" },
  { from: "edge", to: "proxy" },
  { from: "proxy", to: "php" },
  { from: "php", to: "db" },
  { from: "proxy", to: "cache", label: "cache path" },
  { from: "php", to: "logs" },
  { from: "db", to: "logs" },
];
export const workflowNodes: SystemNode[] = [
  {
    id: "mail",
    label: "MAIL",
    subtitle: "IMAP input",
    x: 90,
    y: 95,
    arrival: 0,
    description:
      "Mail ingestion begins the reporting path. Source messages and account configuration remain private.",
  },
  {
    id: "parse",
    label: "PARSER",
    subtitle: "extract fields",
    x: 310,
    y: 95,
    arrival: 0.12,
    description:
      "Extract the required fields into a structured record before choosing a delivery format.",
  },
  {
    id: "n8n",
    label: "N8N",
    subtitle: "orchestrate",
    x: 530,
    y: 95,
    arrival: 0.25,
    description:
      "The self-hosted workflow connects ingestion, transformation and output stages.",
  },
  {
    id: "browser",
    label: "BROWSER",
    subtitle: "Express + Playwright",
    x: 775,
    y: 95,
    arrival: 0.38,
    description:
      "Local Express services and Playwright/Chromium handle content that needs browser rendering.",
  },
  {
    id: "data",
    label: "DATA",
    subtitle: "structured records",
    x: 775,
    y: 300,
    arrival: 0.5,
    description:
      "The browser and parser outputs become structured data for a consistent reporting stage.",
  },
  {
    id: "sheets",
    label: "SHEETS",
    subtitle: "integration unavailable",
    x: 525,
    y: 410,
    arrival: 1,
    description:
      "The Google Sheets API/OAuth path was unavailable in this environment. The workflow was redesigned around another delivery route.",
  },
  {
    id: "csv",
    label: "CSV",
    subtitle: "portable output",
    x: 525,
    y: 270,
    arrival: 0.64,
    description:
      "Generate a tabular CSV report from the structured records. This preserves a portable output boundary.",
  },
  {
    id: "delivery",
    label: "DELIVERY",
    subtitle: "email report",
    x: 240,
    y: 270,
    arrival: 0.77,
    description:
      "Email delivers the CSV through the documented working route. No company records or recipients are included in this public illustration.",
  },
];
export const workflowEdges: SystemEdge[] = [
  { from: "mail", to: "parse" },
  { from: "parse", to: "n8n" },
  { from: "n8n", to: "browser" },
  { from: "browser", to: "data" },
  { from: "data", to: "csv" },
  { from: "data", to: "sheets", disabled: true },
  { from: "csv", to: "delivery" },
];
