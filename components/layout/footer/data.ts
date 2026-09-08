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
      { label: "Energy & Utilities", href: "#" },
      { label: "All sectors", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Leadership", href: "#" },
      { label: "Case studies", href: "#" },
      { label: "Insights", href: "#" },
    ],
  },
  {
    title: "Get in touch",
    links: [
      { label: "Partnership inquiry", href: "#" },
      { label: "Vendor registration", href: "#" },
      { label: "Careers & media", href: "#" },
      { label: "Contact us", href: "#" },
    ],
  },
];

export const legalLinks = [
  { label: "Privacy policy", href: "#" },
  { label: "Company profile", href: "#" },
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

export const socials = [
  { label: "Facebook", href: "#", icon: "linkedin" },
  { label: "Twitter", href: "#", icon: "twitter" },
  { label: "Instagram", href: "#", icon: "" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
];
