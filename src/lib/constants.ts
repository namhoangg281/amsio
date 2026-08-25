export const BRAND = {
  name: "AMSIO International",
  fullName: "Alliance for International Mathematics, Science and Computational Intelligence Olympiad",
  slogan: "Empowering Global Education Leaders",
  philosophy: "Empowering Global Education Leaders",
  website: "amsio.org",
  email: "info@amsio.org",
  whatsapp: "(+1) 410 800 6407",
  social: {
    facebook: "https://www.facebook.com/AMSIOInternational/",
    linkedin: "https://www.linkedin.com/company/amsio-international/",
    instagram: "https://instagram.com/amsio.international",
    youtube: "https://youtube.com/@amsio",
    tiktok: "https://tiktok.com/@amsio.international",
  },
} as const;

export const COLORS = {
  navy: "#1B3A5C",
  navyDark: "#0F2440",
  navyLight: "#E8EFF5",
  orange: "#E8590C",
  orangeLight: "#FFF3ED",
  gold: "#E8A817",
  textPrimary: "#1A1A1A",
  textSecondary: "#666666",
  border: "#CCCCCC",
  bgSubtle: "#F8FAFC",
  white: "#FFFFFF",
} as const;

/**
 * Cờ bật/tắt môn thi tiếng Trung (Chinese language track).
 * false = ẩn ký hiệu 文 + các division tiếng Trung khỏi toàn site (chỉ còn English).
 * true  = hiện lại đầy đủ English + Chinese.
 * Lúc nào cần mở lại chỉ cần đổi thành true — không mất nội dung.
 */
export const SHOW_CHINESE: boolean = false;

export const SUBJECT_COLORS = {
  mathematics: "#2563EB",
  science: "#059669",
  language: "#7C3AED",
  ci: "#E8590C",
} as const;

export const SUBJECTS = [
  {
    id: "mathematics",
    name: "Mathematics",
    icon: "∑",
    color: SUBJECT_COLORS.mathematics,
    divisions: 12,
    divisionLabel: "12 Level Divisions — Grades 1 to 12 · varies by grade level",
    duration: "60–90 minutes",
    description:
      "From arithmetic reasoning to advanced problem-solving. Each of the 12 level divisions competes at its own level with questions designed to assess genuine mathematical thinking.",
  },
  {
    id: "science",
    name: "Science",
    icon: "⚛",
    color: SUBJECT_COLORS.science,
    divisions: 6,
    divisionLabel: "6 Level Divisions — Grades 1–2, 3–4, 5–6, 7–8, 9–10, 11–12",
    duration: "60 minutes",
    description:
      "Physics, chemistry, biology, and earth science — integrated assessments that reward scientific thinking and cross-disciplinary reasoning over memorization.",
  },
  {
    id: "language",
    name: "Language",
    icon: SHOW_CHINESE ? "文" : "Aa",
    color: SUBJECT_COLORS.language,
    divisions: SHOW_CHINESE ? 12 : 6,
    divisionLabel: SHOW_CHINESE
      ? "12 Level Divisions — English (6) + Chinese (6)"
      : "6 Level Divisions — English (Grades 1–2, 3–4, 5–6, 7–8, 9–10, 11–12)",
    duration: SHOW_CHINESE ? "60–90 minutes" : "90 minutes",
    description: SHOW_CHINESE
      ? "Comprehension, reasoning, and communication skills in English and Chinese — two of the world's most important languages for young global citizens."
      : "Comprehension, reasoning, and communication skills in English — one of the world's most important languages for young global citizens.",
  },
  {
    id: "ci",
    name: "Computational Intelligence",
    icon: "{}",
    color: SUBJECT_COLORS.ci,
    divisions: 3,
    divisionLabel: "3 Level Divisions — Grades 3–5, 6–9, 10–12+",
    duration: "120 minutes",
    description:
      "Algorithmic thinking, data reasoning, and computational problem-solving — preparing young minds for the AI era. Open to students from Grade 3 through Grade 12+ (including university Year 1–2).",
  },
] as const;

export const ACHIEVEMENT_TIERS = [
  { name: "Gold", percentage: "Top 10%", color: "#E8A817" },
  { name: "Silver", percentage: "Next 20%", color: "#C0C0C0" },
  { name: "Bronze", percentage: "Next 30%", color: "#CD7F32" },
  { name: "Certificate", percentage: "All participants", color: "#1B3A5C" },
] as const;

export const GRAND_FINALS = [
  { year: 2027, city: "San Francisco", country: "USA", flag: "🇺🇸", code: "us" },
  { year: 2028, city: "London", country: "United Kingdom", flag: "🇬🇧", code: "gb" },
  { year: 2029, city: "Singapore", country: "Singapore", flag: "🇸🇬", code: "sg" },
  { year: 2030, city: "Seoul", country: "South Korea", flag: "🇰🇷", code: "kr" },
] as const;

export const GF_MEDALS = {
  gold: { label: "Top performers", color: "#E8A817" },
  silver: { label: "Outstanding achievers", color: "#C0C0C0" },
  bronze: { label: "Exceptional achievers", color: "#CD7F32" },
} as const;

export const ROUNDS = [
  {
    id: "round1",
    name: "Round 1",
    subtitle: "State Qualifier",
    description: "Held at partner schools nationwide. All registered participants compete.",
    icon: "🏫",
    date: "December 2026",
  },
  {
    id: "round2",
    name: "Round 2",
    subtitle: "National Finals",
    description: "Top performers from Round 1 advance to the National Finals.",
    icon: "🏆",
    date: "March 2027",
  },
  {
    id: "grandfinals",
    name: "Global Round",
    subtitle: "International Finals",
    description: "The world's brightest young minds gather to compete for Gold, Silver, and Bronze.",
    icon: "🌍",
    date: "June 2027",
  },
] as const;

// 15 confirmed AMSIO member countries per Handbook 2026 V3
export const COUNTRIES = [
  // Asia-Pacific
  { slug: "cambodia",     name: "Cambodia",      flag: "🇰🇭", code: "KH", email: "info@amsio.org", lat: 12.565,  lng: 104.991  },
  { slug: "china",        name: "China",         flag: "🇨🇳", code: "CN", email: "info@amsio.org", lat: 35.861,  lng: 104.195  },
  { slug: "indonesia",    name: "Indonesia",     flag: "🇮🇩", code: "ID", email: "info@amsio.org", lat: -0.789,  lng: 113.921  },
  { slug: "japan",        name: "Japan",         flag: "🇯🇵", code: "JP", email: "info@amsio.org", lat: 36.204,  lng: 138.253  },
  { slug: "malaysia",     name: "Malaysia",      flag: "🇲🇾", code: "MY", email: "info@amsio.org", lat:  4.21,   lng: 101.975  },
  { slug: "singapore",    name: "Singapore",     flag: "🇸🇬", code: "SG", email: "info@amsio.org", lat:  1.352,  lng: 103.82   },
  { slug: "south-korea",  name: "South Korea",   flag: "🇰🇷", code: "KR", email: "info@amsio.org", lat: 35.907,  lng: 127.767  },
  { slug: "thailand",     name: "Thailand",      flag: "🇹🇭", code: "TH", email: "info@amsio.org", lat: 15.87,   lng: 100.992  },
  { slug: "vietnam",      name: "Vietnam",       flag: "🇻🇳", code: "VN", email: "info@amsio.org", lat: 14.058,  lng: 108.278  },
  // Americas
  { slug: "canada",       name: "Canada",        flag: "🇨🇦", code: "CA", email: "info@amsio.org", lat: 56.130,  lng: -106.347 },
  { slug: "united-states",name: "United States", flag: "🇺🇸", code: "US", email: "info@amsio.org", lat: 37.091,  lng:  -95.713 },
  // Europe
  { slug: "germany",      name: "Germany",       flag: "🇩🇪", code: "DE", email: "info@amsio.org", lat: 51.166,  lng:  10.452  },
  { slug: "poland",       name: "Poland",        flag: "🇵🇱", code: "PL", email: "info@amsio.org", lat: 51.919,  lng:  19.145  },
  { slug: "switzerland",  name: "Switzerland",   flag: "🇨🇭", code: "CH", email: "info@amsio.org", lat: 46.818,  lng:   8.228  },
  { slug: "united-kingdom",name: "United Kingdom",flag:"🇬🇧", code: "GB", email: "info@amsio.org", lat: 55.378,  lng:  -3.436  },
] as const;

export const COMING_SOON_COUNTRIES = [
  { name: "Australia",   slug: "australia",   flag: "🇦🇺", code: "au" },
  { name: "Austria",     slug: "austria",     flag: "🇦🇹", code: "at" },
  { name: "Brazil",      slug: "brazil",      flag: "🇧🇷", code: "br" },
  { name: "Colombia",    slug: "colombia",    flag: "🇨🇴", code: "co" },
  { name: "India",       slug: "india",       flag: "🇮🇳", code: "in" },
  { name: "Italy",       slug: "italy",       flag: "🇮🇹", code: "it" },
  { name: "Philippines", slug: "philippines", flag: "🇵🇭", code: "ph" },
  { name: "Spain",       slug: "spain",       flag: "🇪🇸", code: "es" },
  { name: "Sweden",      slug: "sweden",      flag: "🇸🇪", code: "se" },
  { name: "Taiwan",      slug: "taiwan",      flag: "🇹🇼", code: "tw" },
  { name: "Turkey",      slug: "turkey",      flag: "🇹🇷", code: "tr" },
];

export const ABC_PARTNER = {
  name: "ABC Education Group",
  role: "Academic Partner",
  description: "ABC Education Group serves as the Academic Partner of AMSIO International, supporting examination development and academic quality assurance across all Subject Groups.",
  headquarters: "Boston, USA",
  countries: 22,
  website: "abceducationgroup.com",
  established: 2017,
};

// Expert Reviewers & Assessors — "Expert Reviews and Assessments" section (home).
// photo: place a file in /public/images/experts/<file> to replace the initials avatar.
// Kevin is intentionally listed first (lead academic reviewer).
export const EXPERTS = [
  {
    name: "Kevin Lewis Ferrone",
    role: "Founding Head of School, Polaris Global Academy",
    domain: "Academic Leadership",
    color: COLORS.gold,
    photo: "/images/experts/kevin-ferrone.jpg",
    quote:
      "AMSIO sets a new benchmark for international academic competition. Its commitment to measuring genuine thinking over memorization is exactly what students need to thrive as global learners.",
  },
  {
    name: "Dr. Carrie Frizzell",
    role: "PhD in Mathematics · Scripps College",
    domain: "Mathematics",
    color: SUBJECT_COLORS.mathematics,
    photo: "/images/experts/carrie-frizzell.jpg",
    quote:
      "What impresses me most about AMSIO's mathematics papers is how they reward authentic reasoning. Students aren't drilling formulas — they're learning to think like mathematicians.",
  },
  {
    name: "Grahme Smith",
    role: "M.Ed · Science Educator & Curriculum Designer",
    domain: "Science",
    color: SUBJECT_COLORS.science,
    photo: "/images/experts/grahme-smith.jpg",
    quote:
      "AMSIO's science assessments integrate disciplines the way the real world does. They invite curiosity and reward students who genuinely understand how the world works.",
  },
  {
    name: "Maria D. Munarriz",
    role: "English Dept. Chair (Ret.) · Our Lady of Lourdes Academy",
    domain: "Language",
    color: SUBJECT_COLORS.language,
    photo: "/images/experts/maria-munarriz.jpg",
    quote:
      "The Language division evaluates comprehension and communication with remarkable rigor and fairness — it recognizes clear thinking in every response, never rote answers.",
  },
  {
    name: "Brian Harrod",
    role: "CTE Chair & Computer Science Educator",
    domain: "Computational Intelligence",
    color: SUBJECT_COLORS.ci,
    photo: "/images/experts/brian-harrod.jpg",
    quote:
      "AMSIO's Computational Intelligence track prepares young people for the AI era with problems that build real algorithmic thinking. It's the kind of assessment our classrooms need.",
  },
  {
    name: "Adam Rozalowski",
    role: "Head of Curriculum · Embassy International School",
    domain: "Curriculum & International Education",
    color: COLORS.navy,
    photo: "/images/experts/adam-rozalowski.jpg",
    quote:
      "Across borders and curricula, AMSIO gives every student one fair standard to be measured against. As an educator, that level of integrity is exactly what I look for.",
  },
] as const;

export const NAV_ITEMS = [
  { label: "About", href: "/about" },
  {
    label: "Olympiad",
    href: "/olympiad",
    children: [
      { label: "Mathematics", href: "/olympiad/mathematics", color: SUBJECT_COLORS.mathematics },
      { label: "Science", href: "/olympiad/science", color: SUBJECT_COLORS.science },
      { label: "Language", href: "/olympiad/language", color: SUBJECT_COLORS.language },
      { label: "Computational Intelligence", href: "/olympiad/ci", color: SUBJECT_COLORS.ci },
      { label: "Rounds & Structure", href: "/olympiad/rounds" },
      // Sample Papers + FAQ ẩn theo yêu cầu (mục 22, 23)
    ],
  },
  {
    label: "Countries",
    href: "/countries",
    children: [
      { label: "All Countries", href: "/countries" },
      { label: "Coming Soon", href: "/countries#coming-soon" },
      { label: "Become a Partner", href: "/countries/become-partner" },
    ],
  },
  { label: "Grand Finals", href: "/grand-finals" },
  { label: "Results", href: "/results" },
  // { label: "News", href: "/news" }, // hidden (partner-only phase) — re-enable later
] as const;

// ── Launch phase ───────────────────────────────────────────────────────────
// amsio.org is in PARTNER-ONLY soft launch. Student/School registration CTAs
// are HIDDEN until a later phase. Flip to true to re-enable — nothing is deleted.
export const SHOW_STUDENT_REGISTRATION = true;

// Partner-only phase: hide the member + coming-soon country lists on /countries.
export const SHOW_COUNTRY_LISTINGS = false;
