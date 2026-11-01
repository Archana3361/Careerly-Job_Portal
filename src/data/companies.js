export const companies = [
  {
    id: 1,
    name: "TechNova",
    industry: "Software & Technology",
    size: "500–1,000 employees",
    location: "Bangalore, India",
    openPositions: 14,
    description:
      "TechNova is a product-led software company building the next generation of enterprise tools. We believe in shipping great software, fast.",
    initials: "TN",
    color: "#5A315D",
  },
  {
    id: 2,
    name: "Orbit Systems",
    industry: "Cloud & Data Analytics",
    size: "1,000–5,000 employees",
    location: "Hyderabad, India",
    openPositions: 9,
    description:
      "Orbit Systems is a leader in cloud infrastructure and data analytics, serving Fortune 500 clients across Asia-Pacific and Europe.",
    initials: "OS",
    color: "#2E6B5E",
  },
  {
    id: 3,
    name: "PixelCraft",
    industry: "Design & Creative Technology",
    size: "50–200 employees",
    location: "Mumbai, India",
    openPositions: 6,
    description:
      "PixelCraft is a design-first product studio that crafts exceptional digital products for startups and global brands.",
    initials: "PC",
    color: "#9B4F2D",
  },
  {
    id: 4,
    name: "Nexora",
    industry: "B2B SaaS & Growth",
    size: "200–500 employees",
    location: "Delhi, India",
    openPositions: 11,
    description:
      "Nexora is one of India's fastest-growing B2B SaaS companies, helping businesses scale with intelligent automation and analytics.",
    initials: "NX",
    color: "#1D4E7A",
  },
  {
    id: 5,
    name: "CloudPeak",
    industry: "Cloud Infrastructure",
    size: "100–500 employees",
    location: "Pune, India",
    openPositions: 8,
    description:
      "CloudPeak builds cloud-native DevOps tools and managed infrastructure services for engineering teams of all sizes.",
    initials: "CP",
    color: "#3D2C6B",
  },
  {
    id: 6,
    name: "FinEdge",
    industry: "Fintech & Financial Services",
    size: "200–500 employees",
    location: "Mumbai, India",
    openPositions: 5,
    description:
      "FinEdge is a fintech platform providing next-generation financial management, investment analytics, and corporate treasury solutions.",
    initials: "FE",
    color: "#1B5E3B",
  },
];

export const getCompanyById = (id) =>
  companies.find((c) => c.id === parseInt(id));
