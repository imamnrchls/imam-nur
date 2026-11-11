/*
  ─────────────────────────────────────────────────────────────
  ALL CONTENT LIVES HERE. Edit, save, refresh.
  ─────────────────────────────────────────────────────────────
  IMAGES   Put your files in  website/images/  and use  "images/my-file.jpg".
           Any full web address (https://...) works too.
  WRITING  Separate paragraphs in "body" with a blank line.
           Lines starting with "## " become sub-headings.
  CODES    The small labels (like "PF-001-1") are decorative archive codes,
           in the spirit of the reference site. Change them freely.
*/
window.SITE = {
  name: ["IMAM", "NURCHOLIS"],          // one entry per line of the big title
  role: "Human capital & driver management",
  location: "Jakarta, Indonesia",
  email: "imam.nurcholis@outlook.com",   // shown on About / Contact
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/imamnurcholis" },
  ],

  // Homepage background (photo by Urban Vintage on Unsplash)
  heroImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=80",
  heroCredit: { label: "Photo: Urban Vintage / Unsplash", url: "https://unsplash.com/photos/landscape-photography-of-mountain-hit-by-sun-rays-78A265wPiO4" },

  // The second title that appears while scrolling (one entry per line)
  indexTitle: ["SELECTED", "INDEX"],

  // The six tiles on the homepage. Each one is a menu entry.
  menu: [
    { label: "Portfolio",  code: "PF-001-1", href: "portfolio.html", image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=900&q=75" },
    { label: "Photos",     code: "PH-118-4", href: "photos.html",    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=75" },
    { label: "Writing",    code: "WR-207-3", href: "writing.html",   image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=900&q=75" },
    { label: "About",      code: "AB-010-7", href: "about.html",     image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=900&q=75" },
    { label: "Archive",    code: "AR-129-2", href: "archive.html",   image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=900&q=75" },
    { label: "Contact",    code: "CT-024-8", href: "about.html#contact", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=75" },
  ],

  about: {
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=75",
    paragraphs: [
      "I'm a sharp, analytical person who keeps looking for patterns and solutions. Curiosity pushes me to understand a problem deeply before I try to fix it.",
      "My work is in human capital: people development, performance management and operational processes. It began with Astra's Human Capital Trainee program and continued at PT Serasi Autoraya and PT Mobilitas Digital Indonesia (MODA), a joint venture of Astra and Toyota.",
      "Today I lead Driver Management at MODA, running the full employee lifecycle for a 350+ person frontline workforce. I'm also working on my interpersonal skills, because strong relationships and clear communication matter as much as good systems.",
    ],
    facts: [
      ["Role", "Driver Management Head, MODA (PT Mobilitas Digital Indonesia)"],
      ["Based in", "Jakarta, Indonesia"],
      ["Education", "B.A. Psychology, Diponegoro University"],
      ["Certified", "Defensive Driving Master Trainer; Astra Leadership Competencies"],
      ["Methods", "ADDIE, PDCA, 8 Steps, DMAIC, DMADV, Design Thinking"],
    ],
  },

  portfolio: [
    {
      id: "driver-management", code: "PF-001-1", title: "Driver Management at MODA", year: "2026", type: "Leadership",
      cover: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1400&q=75",
      summary: "Leading the full employee lifecycle for a 350+ person driver workforce across Toyota, Daihatsu and FMCG accounts.",
      body: "Since January 2026 I have led the Driver Management function at MODA, covering talent acquisition, onboarding, training and development, and performance management.\n\n## What I own\n\nEnd-to-end recruitment strategy, turning client SLA requirements into competency profiles and hiring criteria. This delivered 40+ hires within two months at a 2-day average time-to-hire.\n\nCompetency-based training programs built on the ADDIE framework, plus company onboarding for every new hire.\n\nPerformance management frameworks that turn operational data into reports senior stakeholders can act on.",
      gallery: [],
      url: "",
    },
    {
      id: "driver-development", code: "PF-002-4", title: "Driver Recruitment & Development", year: "2024–2025", type: "Talent & training",
      cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=75",
      summary: "Recruiting and developing drivers for high-value accounts, from first screening to continuous development.",
      body: "As Driver Development Officer (2025) and in the earlier recruitment and development role (2024), I managed the driver lifecycle end to end.\n\n## Talent acquisition\n\nRecruited and onboarded 100+ long-haul drivers within five months using competency-based screening. For the ADM Milkrun logistics scheme I recruited 27 specialized drivers in two months, to Toyota Production System standards.\n\n## Training\n\nFacilitated defensive driving training for 150+ drivers as a certified Master Trainer, and delivered safety and operational training for 100+ drivers across project sites.",
      gallery: [],
      url: "",
    },
    {
      id: "astra-trainee", code: "PF-003-9", title: "Astra Human Capital Trainee", year: "2024", type: "Program",
      cover: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=75",
      summary: "An 11-month rotational program across Astra Group: classroom training with hands-on assignments.",
      body: "A highly competitive program combining two months of in-class training (grade A) with two on-the-job assignments.\n\n## In class\n\nEight core HC modules, from organizational development and recruitment to performance management, culture and industrial relations, plus continuous-improvement methods: 8 Steps, DMAIC, DMADV and Design Thinking.\n\n## PT Serasi Autoraya\n\nBuilt a technical competency assessment framework for 5+ critical fleet management positions. Simplified the competency framework from 13 to 7 core competencies while improving operational alignment. Delivered leadership competency training to 50+ supervisors.\n\n## PT Mobilitas Digital Indonesia\n\nStandardized driver lifecycle SOPs from recruitment to termination, designed a self-learning management system, and ran performance analytics for 30+ drivers with recommendations for customer leadership.",
      gallery: [],
      url: "",
    },
    {
      id: "social-commerce-research", code: "PF-004-6", title: "Customer Engagement & Purchase Intent on TikTok", year: "Research", type: "Publication",
      cover: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1400&q=75",
      summary: "A study of how customer engagement relates to purchase intent in TikTok social commerce among Gen Z in Semarang.",
      body: "Published research, from my Psychology studies at Diponegoro University, on the relationship between customer engagement and product purchase intent in social commerce, focused on Generation Z in Semarang.",
      gallery: [],
      url: "",
    },
  ],

  photos: [
    { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=75", code: "PH-001-2", caption: "Placeholder caption", place: "Somewhere" },
    { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=75", code: "PH-002-7", caption: "Placeholder caption", place: "Somewhere" },
    { src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1400&q=75", code: "PH-003-1", caption: "Placeholder caption", place: "Somewhere" },
    { src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=75", code: "PH-004-5", caption: "Placeholder caption", place: "Somewhere" },
    { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=75", code: "PH-005-3", caption: "Placeholder caption", place: "Somewhere" },
    { src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=75", code: "PH-006-8", caption: "Placeholder caption", place: "Somewhere" },
    { src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=75", code: "PH-007-6", caption: "Placeholder caption", place: "Somewhere" },
    { src: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1400&q=75", code: "PH-008-0", caption: "Placeholder caption", place: "Somewhere" },
    { src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1400&q=75", code: "PH-009-4", caption: "Placeholder caption", place: "Somewhere" },
  ],

  writing: [
    {
      slug: "first-note", code: "WR-001-3", title: "A first note", date: "2026-11-02",
      excerpt: "Placeholder entry. Replace it with your own words.",
      body: "This is a sample entry so you can see how writing looks.\n\n## A sub-heading\n\nA blank line starts a new paragraph. Put the newest entry at the top of the list.",
    },
    {
      slug: "on-looking", code: "WR-002-8", title: "On looking slowly", date: "2026-10-18",
      excerpt: "Another placeholder. Essays, trip logs and short notes all fit here.",
      body: "Another sample entry.\n\nUse this space for essays, trip logs, or anything you want to remember later.",
    },
    {
      slug: "field-notes", code: "WR-003-1", title: "Field notes, autumn", date: "2026-09-30",
      excerpt: "A third placeholder to show how the list reads.",
      body: "A third sample entry.",
    },
  ],
};
