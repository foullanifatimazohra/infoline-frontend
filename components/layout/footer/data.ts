interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Solutions",
    links: [
      { label: "CX & BPO", href: "#" },
      { label: "Technology & Enterprise", href: "#" },
      { label: "People & Finance", href: "#" },
      { label: "All services", href: "#" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Government", href: "#" },
      { label: "Telecom", href: "#" },
      { label: "Healthcare", href: "#" },
      { label: "Energy & Utilities", href: "#" },
      { label: "BFSI · Retail · Travel", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Certifications", href: "#" },
      { label: "Leadership", href: "#" },
      { label: "Case studies", href: "#" },
      { label: "Insights", href: "#" },
    ],
  },
  {
    title: "Get in touch",
    links: [
      { label: "Partnership inquiry", href: "#" },
      { label: "Support", href: "#" },
      { label: "Careers & media", href: "#" },
      { label: "Client portal", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
];

export const legalLinks = [
  { label: "Privacy policy", href: "#" },
  { label: "Terms of use", href: "#" },
  { label: "Accessibility", href: "#" },
];

export const heroStats = [
  {
    value: "22",
    suffix: "yrs",
    caption: "In continuous operation since 2003.",
    flagged: true,
  },
  {
    value: "1,200+",
    suffix: "",
    caption: "Seats across delivery centres.",
    flagged: true,
  },
  {
    value: "7",
    suffix: "",
    caption: "Industries served, from government to travel.",
    flagged: false,
  },
];

export const certifications = ["ISO 9001", "COPC"];
