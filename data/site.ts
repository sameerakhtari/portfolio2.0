import { profile } from "./profile";

// Set the canonical origin to the domain used by your deployment.
// This public value is configuration, never a credential.
export const site = {
  origin: "https://sameerakhtari.com",
  title: `${profile.name} — Software & Systems Engineer`,
  description: `${profile.role} at ${profile.company}. Software, Linux, cloud infrastructure, networking, Kubernetes and the personal systems that connect them.`,
  socialImage: "/og.png",
  repository: "https://github.com/sameerakhtari/portfolio2.0",
};

export const chapters = [
  { id: "init", name: "Init", index: "00" },
  { id: "foundation", name: "Foundation", index: "01" },
  { id: "practice", name: "Practice", index: "02" },
  { id: "homelab", name: "Homelab", index: "03" },
  { id: "cluster", name: "Cluster", index: "04" },
  { id: "automation", name: "Automation", index: "05" },
  { id: "archive", name: "Archive", index: "06" },
  { id: "connections", name: "Connections", index: "07" },
  { id: "field-notes", name: "Field notes", index: "08" },
  { id: "contact", name: "Contact", index: "09" },
];
