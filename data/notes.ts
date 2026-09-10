export const labNotes = [
  {
    slug: "reclaimed-displays",
    number: "001",
    date: "2026",
    domain: "HARDWARE",
    title: "A screen with a second life.",
    summary:
      "Repurposing constrained Android TV hardware for an always-on interface.",
    entries: [
      {
        label: "Problem",
        text: "Use existing display hardware for a self-hosted MagicMirror-style interface and camera viewing.",
      },
      {
        label: "Hardware",
        text: "An older Android TV box, a television and a self-hosted web interface.",
      },
      {
        label: "Constraint",
        text: "The device's aging WebView and browser could not handle the same web features as a modern desktop browser.",
      },
      {
        label: "Experiment",
        text: "Test kiosk software and simplify the display path. Fully Kiosk was used as part of the exploration.",
      },
      {
        label: "Observation",
        text: "A working server is only half the system. The client's browser engine is part of the application boundary.",
      },
      {
        label: "Next step",
        text: "Continue testing long-running camera display behaviour and choose a stable rendering path for the hardware.",
      },
    ],
    link: {
      label: "MagicMirror source fork",
      href: "https://github.com/sameerakhtari/MagicMirror",
    },
  },
  {
    slug: "metrics-before-conclusions",
    number: "002",
    date: "July–August 2026",
    domain: "KUBERNETES",
    title: "Running pods are one observation.",
    summary:
      "A 290-pod snapshot and the measurements still needed to interpret it.",
    entries: [
      {
        label: "Experiment",
        text: "A kube-burner run reached 290 running pods across three repurposed nodes: 99, 93 and 98.",
      },
      {
        label: "Constraint",
        text: "The metrics API was unavailable in a documented kubectl top check. The boards also shared a compact enclosure and fan.",
      },
      {
        label: "Observation",
        text: "Pod state alone does not describe CPU headroom, temperature, latency or sustained capacity.",
      },
      {
        label: "Next step",
        text: "Validate metrics collection and thermal readings, then record them alongside the next workload test.",
      },
    ],
  },
  {
    slug: "a-different-output-path",
    number: "003",
    date: "2026",
    domain: "AUTOMATION",
    title: "Change the route, keep the goal.",
    summary:
      "When a Sheets integration was unavailable, CSV became the delivery boundary.",
    entries: [
      {
        label: "Problem",
        text: "Produce a recurring operational report from ingested and processed inputs.",
      },
      {
        label: "Constraint",
        text: "The intended Google Sheets API/OAuth integration was unavailable in the environment.",
      },
      {
        label: "Iteration",
        text: "Keep the parsing and structured-data stages, then generate CSV and deliver it by email.",
      },
      {
        label: "Result",
        text: "The documented reporting workflow used the alternative CSV delivery route.",
      },
      {
        label: "Next step",
        text: "Keep extraction separate from delivery so future integrations do not require redesigning the entire workflow.",
      },
    ],
  },
];
