export const profile = {
  name: "Sameer Akhtari",
  role: "Engineer I",
  company: "DigitalOcean",
  identity: "Software & systems engineer",
  location: "Karachi, Pakistan",
  statement: "I think in systems.",
  bio: "I build across software, Linux, cloud infrastructure and physical hardware. My work follows the connections: from a packet entering a network to the application, storage and automation behind it.",
  email: "mail@sameerakhtari.com",
  github: "https://github.com/sameerakhtari",
  linkedin: "https://www.linkedin.com/in/sameer-akhtari-386ba295/",
  resumePdf: null as string | null,
};

export const education = {
  degree: "Bachelor of Engineering in Software Engineering",
  shortDegree: "BE Software Engineering",
  institution: "Mehran University of Engineering & Technology",
  shortName: "MUET",
  location: "Jamshoro, Sindh",
  period: "August 2018 — January 2023",
  years: "2018 — 2023",
  cgpa: "3.13",
  description:
    "The foundation: algorithms, data structures, databases and the discipline of turning an idea into working software. A final-year project brought encryption, distributed systems and application development together.",
};

export const experience = [
  {
    year: "2021",
    company: "Interns Pakistan",
    role: "Web development intern",
    period: "July 2021 · Online",
    scope:
      "HTML, CSS, JavaScript, PHP and WordPress. Learning the relationships between a page, its behaviour and the server behind it.",
    domains: ["BROWSER", "CODE"],
    complexity: 1,
  },
  {
    year: "2023",
    company: "Beyond360",
    role: "Internee Engineer",
    period: "September — December 2023 · Karachi",
    scope:
      "Practical web engineering with Java applications, JavaScript, MySQL, WordPress and Shopify.",
    domains: ["WEB APP", "DATABASE", "RUNTIME"],
    complexity: 2,
  },
  {
    year: "2024",
    company: "DigitalOcean",
    role: "Trainee Engineer",
    period: "Journey began February 2024",
    scope:
      "A deeper focus on Linux, cloud infrastructure, virtualization, containers and the systems underneath web applications.",
    domains: ["LINUX", "CLOUD", "CONTAINERS", "NETWORK"],
    complexity: 3,
  },
  {
    year: "NOW",
    company: profile.company,
    role: profile.role,
    period: "Current role",
    scope:
      "Platform operations, incident investigation and production troubleshooting across Linux, DNS, TLS, web servers, PHP, databases and caching. Following evidence across layers to understand the whole system.",
    domains: [
      "PRODUCTION",
      "NETWORK",
      "APPLICATION",
      "DATA",
      "SECURITY",
      "AUTOMATION",
    ],
    complexity: 4,
  },
];

export const certifications = [
  {
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    date: "November 2023",
    domain: "SECURITY",
    connection: "Network boundaries, threats and layered protection.",
  },
  {
    title: "Cybersecurity for Blockchain from Ground Up",
    issuer: "EC-Council",
    date: "June 2023",
    domain: "DISTRIBUTED SYSTEMS",
    connection: "The security questions behind decentralized applications.",
  },
  {
    title: "Ethical Hacking Essentials",
    issuer: "EC-Council",
    date: "January 2023",
    domain: "SECURITY",
    connection: "Security foundations and controlled experimentation.",
  },
  {
    title: "Python Data Structures",
    issuer: "University of Michigan",
    date: "July 2021",
    domain: "AUTOMATION",
    connection: "Organizing data before transforming it.",
  },
  {
    title: "Programming for Everybody",
    issuer: "University of Michigan",
    date: "August 2020",
    domain: "PROGRAMMING",
    connection: "Building a foundation in Python.",
  },
];

export const domains = [
  {
    name: "Linux & systems",
    tools: ["Linux", "Ubuntu", "Bash", "systemd", "Storage"],
    practice: "current",
    note: "Processes, services, logs and the resources they share.",
  },
  {
    name: "Cloud & infrastructure",
    tools: ["DigitalOcean", "Virtualization", "Git"],
    practice: "current",
    note: "The runtime environment behind a working application.",
  },
  {
    name: "Networking",
    tools: ["pfSense", "DNS", "TLS", "Cloudflare", "Ethernet"],
    practice: "current",
    note: "Follow a packet. Understand every boundary it crosses.",
  },
  {
    name: "Containers & Kubernetes",
    tools: ["Docker", "Compose", "containerd", "Kubernetes"],
    practice: "current",
    note: "From one service to workloads distributed over three physical nodes.",
  },
  {
    name: "Web infrastructure",
    tools: ["Nginx", "Apache", "PHP", "MySQL", "Caching"],
    practice: "current",
    note: "Trace the request through the proxy, runtime and data layers.",
  },
  {
    name: "Automation",
    tools: ["Python", "n8n", "Express", "Playwright", "JavaScript"],
    practice: "current",
    note: "Transform recurring operations into observable, repeatable workflows.",
  },
  {
    name: "Security",
    tools: ["Authentication", "Authelia", "Firewalls", "Incident analysis"],
    practice: "current",
    note: "Boundaries and evidence, from the network to the application.",
  },
  {
    name: "IoT & hardware",
    tools: ["Home Assistant", "Frigate", "ESP32", "C/C++", "Coral TPU"],
    practice: "lab",
    note: "Software becomes tangible when it reaches a sensor or a circuit.",
  },
  {
    name: "Observability",
    tools: ["Netdata", "Prometheus", "Grafana", "Loki"],
    practice: "evolving",
    note: "Netdata is part of the lab. The metrics, dashboards and log stack is the next iteration.",
  },
  {
    name: "Software foundations",
    tools: [
      "Python",
      "JavaScript",
      "HTML/CSS",
      "Java",
      "Solidity",
      "React Native",
    ],
    practice: "historical + current",
    note: "Programming foundations that connect university projects to present systems work.",
  },
];
