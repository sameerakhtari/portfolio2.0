export type ProjectStatus =
  | "EVOLVING"
  | "BUILT"
  | "IN PROGRESS"
  | "EXPERIMENT"
  | "HISTORICAL";
export type DiagramKind =
  | "lab"
  | "cluster"
  | "workflow"
  | "security"
  | "iot"
  | "network"
  | "storage"
  | "code";
export type CaseSection = { heading: string; body: string };
export type Project = {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  year: string;
  status: ProjectStatus;
  domain: string;
  color: string;
  diagram: DiagramKind;
  summary: string;
  technologies: string[];
  facts: { value: string; label: string }[];
  sections: CaseSection[];
  links?: { label: string; href: string }[];
  image?: string;
};

export const projects: Project[] = [
  {
    slug: "homelab",
    index: "01",
    title: "A lab of my own.",
    subtitle: "Personal infrastructure ecosystem",
    year: "ONGOING",
    status: "EVOLVING",
    domain: "SYSTEMS",
    color: "#356e8e",
    diagram: "lab",
    summary:
      "A side table became a connected environment for networking, Linux, self-hosted services, storage, cameras and automation.",
    technologies: [
      "Linux",
      "pfSense",
      "Docker Compose",
      "Home Assistant",
      "Frigate",
      "Jellyfin",
      "Authelia",
    ],
    facts: [
      { value: "1", label: "dedicated router" },
      { value: "3", label: "separate K8s nodes" },
      { value: "LOCAL", label: "self-hosted services" },
    ],
    sections: [
      {
        heading: "Context",
        body: "The lab is where networking, software and hardware meet. It grew from earlier home-network and NAS experiments into a personal infrastructure environment with separate routing, general-purpose compute and Kubernetes hardware.",
      },
      {
        heading: "Physical design",
        body: "A Lenovo mini PC runs pfSense. Ethernet switching connects a primary Linux server and a separate three-node Kubernetes environment. The hardware lives in a compact side-table setup. The 3D view is a conceptual diagram of these roles, not a scale model of an unverified chassis.",
      },
      {
        heading: "Network & boundaries",
        body: "Routing and firewall policy live at the dedicated router. Reverse proxying and authentication are distinct application-layer responsibilities. Camera, media and automation relationships are shown by semantic names in the explorer.",
      },
      {
        heading: "Compute & containers",
        body: "Docker Compose organizes the general-purpose server's services. The separate Kubernetes lab creates space for cluster and workload experiments without making every home service depend on those experiments.",
      },
      {
        heading: "Storage",
        body: "The Linux host uses mirrored SSD storage, a separate NVMe for container storage, and a media drive. SMB provides file access. A mirror improves disk-failure tolerance; it is not a substitute for backups.",
      },
      {
        heading: "Media, cameras & automation",
        body: "Jellyfin handles local media. Immich manages photo infrastructure. Frigate and camera streams form the local NVR environment, with a Coral TPU available for acceleration. Detection settings vary by experiment; no accuracy or continuously active detection claim is made. Home Assistant connects the smart-home layer.",
      },
      {
        heading: "What is running",
        body: "The service ecosystem includes Portainer, Netdata, Nginx Proxy Manager, Homepage, Snipe-IT and Authelia alongside the media and automation services. This is an evolving personal system, not a live uptime dashboard.",
      },
      {
        heading: "Next iteration",
        body: "Extend observability with Prometheus, Grafana and Loki. That direction remains in progress. Continue documenting changes, improving physical cable management and testing recoverability.",
      },
    ],
  },
  {
    slug: "reclaimed-cluster",
    index: "02",
    title: "Three boards. One cluster.",
    subtitle: "Kubernetes on repurposed hardware",
    year: "2026",
    status: "BUILT",
    domain: "KUBERNETES",
    color: "#2455d7",
    diagram: "cluster",
    summary:
      "Three repurposed laptop motherboards, roughly 48 GB of RAM, and a documented load test with 290 running pods.",
    technologies: [
      "Kubernetes",
      "containerd",
      "Ubuntu",
      "kube-burner",
      "Linux",
      "Ethernet",
    ],
    facts: [
      { value: "3", label: "repurposed boards" },
      { value: "~48 GB", label: "total memory" },
      { value: "290", label: "pods in recorded test" },
    ],
    sections: [
      {
        heading: "The idea",
        body: "Build a physical cluster from hardware already available: three laptop motherboards from different CPU generations, integrated into a custom shared enclosure. Approximately 16 GB of RAM per node gives the lab roughly 48 GB in total.",
      },
      {
        heading: "Architecture",
        body: "Three Linux nodes connect over Ethernet to form a Kubernetes environment. A virtual API endpoint provides cluster access. Public diagrams use K8S-01, K8S-02 and K8S-03 rather than publishing internal addresses.",
      },
      {
        heading: "Historical software snapshot",
        body: "One documented July–August 2026 state used Kubernetes v1.34.9, containerd 2.2.2 and Ubuntu 26.04-era software. These values describe that experiment, not a live version inventory.",
      },
      {
        heading: "The workload experiment",
        body: "A kube-burner v2.8.1 run reached 290 running pods, distributed 99, 93 and 98 across the three nodes. The visualization reproduces those counts. It does not claim a maximum cluster capacity, production benchmark or sustained performance guarantee.",
      },
      {
        heading: "Physical constraints",
        body: "The boards share a compact enclosure and fan. Different CPU generations and a 100 Mbps switch make thermal behaviour and network capacity meaningful constraints to investigate.",
      },
      {
        heading: "Open investigation",
        body: "The metrics API was unavailable during a documented kubectl top check. Thermal monitoring and the metrics pipeline remain areas to validate before drawing conclusions about resource headroom.",
      },
      {
        heading: "Next iteration",
        body: "Make temperature and resource measurements easier to compare with workload placement. Record the conditions of each load test so the next experiment can be assessed against the previous one.",
      },
    ],
  },
  {
    slug: "operational-automation",
    index: "03",
    title: "A constraint became a route.",
    subtitle: "Self-hosted operational reporting",
    year: "2026",
    status: "BUILT",
    domain: "AUTOMATION",
    color: "#ad6c14",
    diagram: "workflow",
    summary:
      "Mail ingestion, browser rendering and structured data become a repeatable CSV reporting workflow.",
    technologies: ["n8n", "IMAP", "Express", "Playwright", "Chromium", "CSV"],
    facts: [
      { value: "IMAP", label: "input" },
      { value: "n8n", label: "orchestration" },
      { value: "CSV", label: "delivery format" },
    ],
    sections: [
      {
        heading: "Problem",
        body: "Recurring operational reporting involved collecting inputs, extracting useful fields and producing a deliverable. The portfolio shows the integration architecture without exposing source records or organization-specific workflows.",
      },
      {
        heading: "Design",
        body: "A self-hosted n8n workflow ingests mail through Rackspace IMAP. Local Express services and Playwright/Chromium handle the browser-rendered portion of the pipeline. Structured records are transformed into CSV output and delivered by email.",
      },
      {
        heading: "The constraint",
        body: "A Google Sheets API/OAuth path was unavailable in the environment. That integration constraint changed the output route rather than ending the project.",
      },
      {
        heading: "The iteration",
        body: "CSV-over-email became the working delivery path. The interactive diagram preserves the unavailable Sheets branch so the design decision remains visible.",
      },
      {
        heading: "Engineering focus",
        body: "This project connects workflow orchestration, parsing, browser automation and data transformation. The important boundary is between extracting a record and deciding how to deliver it.",
      },
      {
        heading: "Scope of the result",
        body: "The documented workflow established the CSV reporting route. Other planned integrations and broader automation work are separate iterations; they are not presented as completed features here.",
      },
    ],
  },
  {
    slug: "observability",
    index: "04",
    title: "Make the system legible.",
    subtitle: "The next observability layer",
    year: "2026",
    status: "IN PROGRESS",
    domain: "SYSTEMS",
    color: "#367483",
    diagram: "network",
    summary:
      "Extending the lab's monitoring direction toward metrics, dashboards and searchable logs.",
    technologies: ["Netdata", "Prometheus", "Grafana", "Loki"],
    facts: [
      { value: "ACTIVE", label: "Netdata" },
      { value: "PLANNED", label: "metrics + log expansion" },
    ],
    sections: [
      {
        heading: "Current state",
        body: "Netdata is part of the homelab service ecosystem. A Prometheus, Grafana and Loki stack is the next observability direction.",
      },
      {
        heading: "Design direction",
        body: "Separate the collection of metrics and logs from their presentation. The goal is to relate service behaviour to host resources and cluster experiments.",
      },
      {
        heading: "Status",
        body: "The expanded stack is in progress. No completed rollout, monitoring coverage or alert reliability is claimed.",
      },
    ],
  },
  {
    slug: "smart-hat",
    index: "05",
    title: "Camera to understanding.",
    subtitle: "Smart Hat",
    year: "EARLIER WORK",
    status: "EXPERIMENT",
    domain: "IoT",
    color: "#527b49",
    diagram: "iot",
    summary:
      "An embedded vision concept connecting camera input to processing and speech for a person with visual impairment.",
    technologies: [
      "ESP32-CAM",
      "C/C++",
      "Python",
      "Image processing",
      "Wireless",
    ],
    facts: [
      { value: "CAMERA", label: "input" },
      { value: "SPEECH", label: "output" },
    ],
    sections: [
      {
        heading: "Intent",
        body: "Smart Hat explored how camera and sensor input could become audio information about a person's surroundings. It connects embedded hardware, image-processing ideas and mobile integration.",
      },
      {
        heading: "Architecture",
        body: "An ESP32-CAM and microcontroller/sensor components provide input. Processing concepts convert visual information into data that can be delivered as speech.",
      },
      {
        heading: "Scope",
        body: "This is a historical experimental concept. Clinical effectiveness, safety as a navigation aid, completed commercial-product status and real-world deployment are not established by the available record.",
      },
      {
        heading: "Engineering connection",
        body: "The same camera → processing → useful output relationship reappears in later local-vision and home-automation experiments.",
      },
    ],
  },
  {
    slug: "encrypted-chat",
    index: "06",
    title: "Messages across trust boundaries.",
    subtitle: "Decentralized encrypted chat · Final-year project",
    year: "2018–2023",
    status: "HISTORICAL",
    domain: "SECURITY",
    color: "#923b4c",
    diagram: "security",
    summary:
      "A university project exploring encrypted communication and decentralized data handling through blockchain concepts.",
    technologies: [
      "Solidity",
      "Ethereum concepts",
      "AES-256",
      "Python",
      "JavaScript",
      "React Native",
    ],
    facts: [
      { value: "FYP", label: "software engineering" },
      { value: "AES-256", label: "encryption explored" },
    ],
    sections: [
      {
        heading: "Context",
        body: "The final-year project at MUET brought application development, cryptography and blockchain concepts into a decentralized encrypted chat application.",
      },
      {
        heading: "Design",
        body: "The project explored encrypted message data and blockchain-backed tamper resistance. Solidity, Python, web technologies, React Native and database components formed the historical technology set.",
      },
      {
        heading: "Trust boundaries",
        body: "Encryption, key handling and distributed state solve different problems. The illustration distinguishes message encryption from propagation through a distributed network; it is a conceptual view, not a new security specification.",
      },
      {
        heading: "Scope",
        body: "AES-256 and decentralized data handling were part of the project exploration. No independent security audit, production deployment or claim of invulnerability is made.",
      },
    ],
  },
  {
    slug: "home-network",
    index: "07",
    title: "The first connections.",
    subtitle: "Home distribution & access network",
    year: "2023",
    status: "HISTORICAL",
    domain: "NETWORKING",
    color: "#267d78",
    diagram: "network",
    summary:
      "pfSense, x64 hardware and multiple interfaces formed an earlier generation of the home network.",
    technologies: ["pfSense", "x64", "Routing", "Firewall", "DNS", "Ethernet"],
    facts: [
      { value: "pfSense", label: "network control" },
      { value: "GEN 01", label: "lab foundation" },
    ],
    sections: [
      {
        heading: "Architecture",
        body: "A distribution/access-layer network used pfSense on x64 hardware with multiple interfaces. Areas included cameras, media, personal systems and wireless connectivity.",
      },
      {
        heading: "Engineering focus",
        body: "Routing, firewall and DNS configuration established boundaries between different uses of the same physical network.",
      },
      {
        heading: "Evolution",
        body: "This project belongs to the lineage of the current homelab. The lab explorer's evolution control follows that growth from a network foundation to containers, Kubernetes and automation.",
      },
    ],
  },
  {
    slug: "nas-media",
    index: "08",
    title: "A home for the data.",
    subtitle: "Home NAS & media server",
    year: "EARLIER WORK",
    status: "HISTORICAL",
    domain: "SYSTEMS",
    color: "#356e8e",
    diagram: "storage",
    summary:
      "An earlier TrueNAS environment combined network storage, media and home-automation experiments.",
    technologies: [
      "TrueNAS",
      "RAID",
      "Network storage",
      "Home Assistant",
      "Frigate",
    ],
    facts: [
      { value: "TrueNAS", label: "earlier platform" },
      { value: "STORAGE", label: "shared foundation" },
    ],
    sections: [
      {
        heading: "First generation",
        body: "An x64 machine and multiple drives became a NAS and media environment. RAID storage, network file access and media streaming shared a home with Home Assistant and Frigate-related experiments.",
      },
      {
        heading: "Iteration",
        body: "The modern Linux and Docker-based home server is a later generation of that idea. The common thread is connecting storage to services while learning the operational tradeoffs.",
      },
      {
        heading: "Storage lesson",
        body: "Redundancy, backup and recovery are separate concerns. This portfolio records the platform evolution without asserting an unverified backup or recovery guarantee.",
      },
    ],
  },
  {
    slug: "diy-security-hardware",
    index: "09",
    title: "At the hardware boundary.",
    subtitle: "USB & Wi-Fi Ducky experiments",
    year: "EARLIER WORK",
    status: "HISTORICAL",
    domain: "SECURITY",
    color: "#923b4c",
    diagram: "security",
    summary:
      "Microcontrollers, custom circuit work and HID behaviour explored through a controlled security experiment.",
    technologies: ["Microcontrollers", "C/C++", "Arduino", "HID", "Wi-Fi"],
    facts: [
      { value: "HID", label: "interface behaviour" },
      { value: "DIY", label: "circuit experimentation" },
    ],
    sections: [
      {
        heading: "The experiment",
        body: "This project combined open-source concepts with microcontroller and circuit work to explore how USB HID and Wi-Fi-controlled embedded functionality behave.",
      },
      {
        heading: "Engineering focus",
        body: "The interesting boundary is between firmware, an interface trusted by the operating system and physical hardware. Public documentation remains at the architecture and learning level.",
      },
      {
        heading: "Source lineage",
        body: "The public Wi-Fi Ducky repository is a fork of an existing open-source project. It is credited as source lineage rather than presented as entirely original software.",
      },
    ],
    links: [
      {
        label: "Open-source fork",
        href: "https://github.com/sameerakhtari/wifi_ducky",
      },
    ],
  },
  {
    slug: "smart-home",
    index: "10",
    title: "Code reaches the room.",
    subtitle: "DIY smart home",
    year: "2021",
    status: "HISTORICAL",
    domain: "IoT",
    color: "#527b49",
    diagram: "iot",
    summary:
      "A network-connected microcontroller experiment for room lighting and fan control.",
    technologies: [
      "Microcontrollers",
      "C/C++",
      "Web services",
      "Google Assistant concepts",
    ],
    facts: [
      { value: "2021", label: "early experiment" },
      { value: "LIGHT + FAN", label: "physical outputs" },
    ],
    sections: [
      {
        heading: "Intent",
        body: "Control room lighting and a fan through network connectivity and a microcontroller. The project explored integration with Google Home and Google Assistant concepts.",
      },
      {
        heading: "The signal path",
        body: "A command crosses the network, reaches the controller and changes a physical output. The diagram makes that software-to-hardware boundary visible.",
      },
      {
        heading: "Connection to the present",
        body: "Later Home Assistant work grows from the same curiosity about connecting services to physical devices. This record does not assert current interoperability for the historical prototype.",
      },
    ],
  },
];
export const projectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);
