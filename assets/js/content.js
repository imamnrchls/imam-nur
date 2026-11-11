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
  role: "Photographer, writer & builder",
  location: "Jakarta, Indonesia",
  email: "hello@example.com",           // shown on About / Contact
  links: [
    { label: "Instagram", url: "https://instagram.com/" },
    { label: "LinkedIn", url: "https://linkedin.com/" },
    { label: "GitHub", url: "https://github.com/" },
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
      "Placeholder bio. Write two or three sentences about who you are and what you make.",
      "Say what you are working on now, what you care about, and what kind of work or collaboration you are open to.",
    ],
    facts: [
      ["Based in", "Jakarta, Indonesia"],
      ["Focus", "Photography, writing, digital projects"],
      ["Currently", "Placeholder — what you are doing now"],
    ],
  },

  portfolio: [
    {
      id: "project-one", code: "PF-001-1", title: "Project One", year: "2026", type: "Web / Design",
      cover: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1400&q=75",
      summary: "Placeholder. One sentence describing the project and your role in it.",
      body: "Describe the problem, what you did, and the outcome.\n\nAdd as many paragraphs as you like.",
      gallery: [
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=75",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=75",
      ],
      url: "",
    },
    {
      id: "project-two", code: "PF-002-4", title: "Project Two", year: "2025", type: "Photography",
      cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=75",
      summary: "Placeholder. A photo series, a product, a report — anything you want to show.",
      body: "Write about this project here.",
      gallery: ["https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1400&q=75"],
      url: "",
    },
    {
      id: "project-three", code: "PF-003-9", title: "Project Three", year: "2024", type: "Research",
      cover: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=75",
      summary: "Placeholder. Older or smaller work fits here too.",
      body: "Write about this project here.",
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
