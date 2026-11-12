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
  role: "People person, hiker & music lover",
  location: "Jakarta, Indonesia",
  email: "imam.nurcholis@outlook.com",   // shown on About / Contact
  links: [
    { label: "Instagram", url: "https://www.instagram.com/imamnrchls/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/imamnurcholis" },
  ],

  // Homepage background. Put a photo credit in heroCredit ({ label, url }) or leave it empty to hide it.
  heroImage: "images/hero.jpg",
  heroCredit: null,

  // Footer: the line on the homepage, and the picture behind it (put your own in images/)
  footer: {
    cta: "Up for a hike, a good album or a long conversation",
    ctaLink: "say hello",
    art: "images/footer-mountain.png",
  },

  // The second title that appears while scrolling (one entry per line)
  indexTitle: ["WHAT DO YOU", "WANT TO SEE?"],

  // The six tiles on the homepage. Each one is a menu entry.
  menu: [
    { label: "About",      code: "AB-010-7", href: "about.html",     image: "https://images.unsplash.com/photo-1544502062-f82887f03d1c?auto=format&fit=crop&w=900&q=75" },
    { label: "Gallery",    code: "GA-118-4", href: "photos.html",    image: "https://images.unsplash.com/photo-1512390225428-a9d51c817f94?auto=format&fit=crop&w=900&q=75" },
    { label: "Writing",    code: "WR-207-3", href: "writing.html",   image: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&w=900&q=75" },
    { label: "Portfolio",  code: "PF-001-1", href: "portfolio.html", image: "https://images.unsplash.com/photo-1575318634028-6a0cfcb60c59?auto=format&fit=crop&w=900&q=75" },
    { label: "Music",      code: "MU-129-2", href: "music.html",     image: "https://images.unsplash.com/photo-1616714109948-c74fe5029a4d?auto=format&fit=crop&w=900&q=75" },
    { label: "Contact",    code: "CT-024-8", href: "about.html#contact", image: "https://images.unsplash.com/photo-1637597384611-0c33cef6ec03?auto=format&fit=crop&w=900&q=75" },
  ],

  about: {
    image: "images/portrait.jpg",
    paragraphs: [
      "I'm Imam, a psychology graduate from Diponegoro University, living in Jakarta. I'm curious by nature: I like to understand how things, and people, work before I try to change them.",
      "Outside work you'll most likely find me outdoors: on a mountain trail with a heavy pack, camping above the clouds, or on a road trip with friends. On ordinary days it's the gym, a run or a ride. There's usually music in my ears (Pink Floyd, The Smashing Pumpkins, Oasis) and a camera somewhere nearby. Now and then I write too: short poems, essays and notes, some of them under Writing.",
      "By day I work in human capital. I lead Driver Management at MODA, a joint venture of Astra and Toyota, looking after a 350+ person frontline workforce, after starting out in Astra's Human Capital Trainee program. The work and the rest share a root: I like people, and I like watching them grow.",
    ],
    // "Off the clock": the things I like. One [label, value] pair per row.
    likes: [
      ["Outdoors", "Hiking, camping, road trips"],
      ["Moving", "Gym, running, cycling"],
      ["Music", "Alternative & indie rock, psychedelic, Britpop"],
      ["Films", "Drama, romance, psychological thrillers, horror"],
      ["Also", "Photography, writing, good conversations"],
    ],
    // "At work"
    facts: [
      ["Role", "Driver Management Head, MODA (PT Mobilitas Digital Indonesia)"],
      ["Studied", "B.A. Psychology, Diponegoro University"],
      ["Certified", "Defensive Driving Master Trainer; Astra Leadership Competencies"],
      ["Methods", "ADDIE, PDCA, 8 Steps, DMAIC, DMADV, Design Thinking"],
    ],
  },

  // Add  cover: "images/your-cover.jpg"  to a project to show an image for it (and a hover preview in the list).
  portfolio: [
    {
      id: "driver-management", code: "PF-001-1", title: "Driver Management at MODA", year: "2026", type: "Leadership",
      summary: "Leading the full employee lifecycle for a 350+ person driver workforce across Toyota, Daihatsu and FMCG accounts.",
      body: "Since January 2026 I have led the Driver Management function at MODA, covering talent acquisition, onboarding, training and development, and performance management.\n\n## What I own\n\nEnd-to-end recruitment strategy, turning client SLA requirements into competency profiles and hiring criteria. This delivered 40+ hires within two months at a 2-day average time-to-hire.\n\nCompetency-based training programs built on the ADDIE framework, plus company onboarding for every new hire.\n\nPerformance management frameworks that turn operational data into reports senior stakeholders can act on.",
      gallery: [],
      url: "",
    },
    {
      id: "driver-development", code: "PF-002-4", title: "Driver Recruitment & Development", year: "2024–2025", type: "Talent & training",
      summary: "Recruiting and developing drivers for high-value accounts, from first screening to continuous development.",
      body: "As Driver Development Officer (2025) and in the earlier recruitment and development role (2024), I managed the driver lifecycle end to end.\n\n## Talent acquisition\n\nRecruited and onboarded 100+ long-haul drivers within five months using competency-based screening. For the ADM Milkrun logistics scheme I recruited 27 specialized drivers in two months, to Toyota Production System standards.\n\n## Training\n\nFacilitated defensive driving training for 150+ drivers as a certified Master Trainer, and delivered safety and operational training for 100+ drivers across project sites.",
      gallery: [],
      url: "",
    },
    {
      id: "astra-trainee", code: "PF-003-9", title: "Astra Human Capital Trainee", year: "2024", type: "Program",
      summary: "An 11-month rotational program across Astra Group: classroom training with hands-on assignments.",
      body: "A highly competitive program combining two months of in-class training (grade A) with two on-the-job assignments.\n\n## In class\n\nEight core HC modules, from organizational development and recruitment to performance management, culture and industrial relations, plus continuous-improvement methods: 8 Steps, DMAIC, DMADV and Design Thinking.\n\n## PT Serasi Autoraya\n\nBuilt a technical competency assessment framework for 5+ critical fleet management positions. Simplified the competency framework from 13 to 7 core competencies while improving operational alignment. Delivered leadership competency training to 50+ supervisors.\n\n## PT Mobilitas Digital Indonesia\n\nStandardized driver lifecycle SOPs from recruitment to termination, designed a self-learning management system, and ran performance analytics for 30+ drivers with recommendations for customer leadership.",
      gallery: [],
      url: "",
    },
    {
      id: "social-commerce-research", code: "PF-004-6", title: "Customer Engagement & Purchase Intent on TikTok", year: "Research", type: "Publication",
      summary: "A study of how customer engagement relates to purchase intent in TikTok social commerce among Gen Z in Semarang.",
      body: "Published research, from my Psychology studies at Diponegoro University, on the relationship between customer engagement and product purchase intent in social commerce, focused on Generation Z in Semarang.",
      gallery: [],
      url: "",
    },
  ],

  // Your own photographs. Add entries like the one below (put the file in images/). While the list is empty the Gallery page says so.
  //   { src: "images/my-photo.jpg", code: "PH-001-2", caption: "A short caption", place: "Where it was taken" },
  // Codes: PH-### for photos, VD-### for videos, each numbered on its own.
  // Music: favourite albums. "url" is the Apple Music link (Share → Copy Link). "picks" lists the track numbers
  // you recommend most; they get the + mark in the tracklist. "note" (optional) is a line on why you love the record.
  music: [
    {
      url: "https://music.apple.com/id/album/the-dark-side-of-the-moon-50th-anniversary-remastered/1665303755",
      title: "The Dark Side of the Moon", artist: "Pink Floyd", kind: "Album", year: "1973",
      cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/49/86/18/49861852-877b-0992-fa27-58b25fa032b5/196589805232.jpg/600x600bb.jpg",
      picks: [4, 5, 6, 7, 10],   // track numbers you recommend, e.g. [2, 5]
      tracks: [["Speak to Me", "1:11"], ["Breathe (In the Air)", "2:46"], ["On the Run", "3:34"], ["Time", "7:06"], ["The Great Gig In the Sky", "4:44"], ["Money", "6:22"], ["Us and Them", "7:50"], ["Any Colour You Like", "3:26"], ["Brain Damage", "3:50"], ["Eclipse", "2:07"]],
    },
    {
      url: "https://music.apple.com/id/album/the-stone-roses-remastered-2009/322969529",
      title: "The Stone Roses", artist: "The Stone Roses", kind: "Album", year: "1989",
      cover: "https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/de/bd/71/debd715a-d49b-1ec8-6b4d-bf3f25e0e90b/dj.rldpqukx.jpg/600x600bb.jpg",
      picks: [1, 8, 10, 11],   // track numbers you recommend, e.g. [2, 5]
      tracks: [["I Wanna Be Adored", "4:53"], ["She Bangs the Drums", "3:52"], ["Waterfall", "4:39"], ["Don't Stop", "5:21"], ["Bye Bye Bad Man", "4:04"], ["Elizabeth My Dear", "0:53"], ["(Song for My) Sugar Spun Sister", "3:27"], ["Made of Stone", "4:15"], ["Shoot You Down", "4:13"], ["This Is the One", "4:59"], ["I Am the Resurrection", "8:13"], ["Fools Gold", "9:54"]],
    },
    {
      url: "https://music.apple.com/id/album/siamese-dream/721207206",
      title: "Siamese Dream", artist: "The Smashing Pumpkins", kind: "Album", year: "1993",
      cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3a/dc/08/3adc08b0-e98c-b5dd-943e-a37c7ed06205/13UABIM03615.rgb.jpg/600x600bb.jpg",
      picks: [3, 7, 9, 10, 13],   // track numbers you recommend, e.g. [2, 5]
      tracks: [["Cherub Rock", "4:57"], ["Quiet", "3:43"], ["Today", "3:21"], ["Hummer", "6:56"], ["Rocket", "4:06"], ["Disarm", "3:17"], ["Soma", "6:38"], ["Geek U.S.A.", "5:13"], ["Mayonaise", "5:49"], ["Spaceboy", "4:27"], ["Silverfuck", "8:43"], ["Sweet Sweet", "1:39"], ["Luna", "3:20"]],
    },
    {
      url: "https://music.apple.com/id/album/ok-computer/1097861387",
      title: "OK Computer", artist: "Radiohead", kind: "Album", year: "1997",
      cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
      picks: [1, 2, 4, 5, 6, 10],   // track numbers you recommend, e.g. [2, 5]
      tracks: [["Airbag", "4:48"], ["Paranoid Android", "6:27"], ["Subterranean Homesick Alien", "4:28"], ["Exit Music (For a Film)", "4:27"], ["Let Down", "5:00"], ["Karma Police", "4:24"], ["Fitter Happier", "1:57"], ["Electioneering", "3:51"], ["Climbing Up the Walls", "4:45"], ["No Surprises", "3:49"], ["Lucky", "4:19"], ["The Tourist", "5:27"]],
    },
    {
      url: "https://music.apple.com/id/album/be-here-now/207010732",
      title: "Be Here Now", artist: "Oasis", kind: "Album", year: "1997",
      cover: "https://is1-ssl.mzstatic.com/image/thumb/Music/ef/d6/2c/mzi.cokrlcna.jpg/600x600bb.jpg",
      picks: [4, 8, 10],   // track numbers you recommend, e.g. [2, 5]
      tracks: [["D'You Know What I Mean?", "7:42"], ["My Big Mouth", "5:03"], ["Magic Pie", "7:19"], ["Stand By Me", "5:57"], ["I Hope, I Think, I Know", "4:22"], ["The Girl In the Dirty Shirt", "5:47"], ["Fade In-Out", "6:52"], ["Don't Go Away", "4:49"], ["Be Here Now", "5:13"], ["All Around the World", "9:20"], ["It's Gettin' Better (Man!!)", "7:00"], ["All Around the World (Reprise)", "2:08"]],
    },
    {
      url: "https://music.apple.com/id/album/american-football-25th-anniversary-edition/1754429576",
      title: "American Football", artist: "American Football", kind: "Album", year: "1999",
      cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3c/f1/00/3cf10033-6c61-ff25-5c3f-3b1e01dc3bf7/644110049995.png/600x600bb.jpg",
      picks: [1, 2, 6],   // track numbers you recommend, e.g. [2, 5]
      tracks: [["Never Meant", "4:29"], ["The Summer Ends", "4:45"], ["Honestly?", "6:07"], ["For Sure", "3:16"], ["You Know I Should Be Leaving Soon", "3:41"], ["But the Regrets Are Killing Me", "3:54"], ["I'll See You When We're Both Not so Emotional", "3:44"], ["Stay Home", "8:11"], ["The One with the Wurlitzer", "2:45"]],
    },
    {
      url: "https://music.apple.com/id/album/submarine-ep/422325910",
      title: "Submarine", artist: "Alex Turner", kind: "EP", year: "2011",
      cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/fa/a6/00/faa60001-c7aa-d51e-70a8-0b092f810d24/mzi.iylunwbj.jpg/600x600bb.jpg",
      picks: [2, 4, 5],   // track numbers you recommend, e.g. [2, 5]
      tracks: [["Stuck On the Puzzle (Intro)", "0:54"], ["Hiding Tonight", "3:07"], ["Glass In the Park", "4:00"], ["It's Hard to Get Around the Wind", "4:07"], ["Stuck On the Puzzle", "3:31"], ["Piledriver Waltz", "3:25"]],
    },
    {
      url: "https://music.apple.com/id/album/peripheral-vision/1493926962",
      title: "Peripheral Vision", artist: "Turnover", kind: "Album", year: "2015",
      cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/66/74/26/667426e1-00ac-10d7-ad69-9f6d66f23b0b/67530.jpg/600x600bb.jpg",
      picks: [1, 3, 8, 10],   // track numbers you recommend, e.g. [2, 5]
      tracks: [["Cutting My Fingers Off", "3:16"], ["New Scream", "4:12"], ["Humming", "3:58"], ["Hello Euphoria", "3:46"], ["Dizzy On the Comedown", "4:16"], ["Diazepam", "3:19"], ["Like Slow Disappearing", "3:56"], ["Take My Head", "3:14"], ["Threshold", "1:28"], ["I Would Hate You If I Could", "4:03"], ["Intrapersonal", "3:46"]],
    },
    {
      url: "https://music.apple.com/id/album/currents/1440838039",
      title: "Currents", artist: "Tame Impala", kind: "Album", year: "2015",
      cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/a8/2e/b4/a82eb490-f30a-a321-461a-0383c88fec95/15UMGIM23316.rgb.jpg/600x600bb.jpg",
      picks: [1, 4, 5, 13],   // track numbers you recommend, e.g. [2, 5]
      tracks: [["Let It Happen", "7:47"], ["Nangs", "1:48"], ["The Moment", "4:15"], ["Yes I'm Changing", "4:31"], ["Eventually", "5:19"], ["Gossip", "0:55"], ["The Less I Know the Better", "3:39"], ["Past Life", "3:48"], ["Disciples", "1:48"], ["'Cause I'm a Man", "4:02"], ["Reality In Motion", "4:13"], ["Love/Paranoia", "3:06"], ["New Person, Same Old Mistakes", "6:02"]],
    },
    {
      url: "https://music.apple.com/id/album/blonde/1146195596",
      title: "Blonde", artist: "Frank Ocean", kind: "Album", year: "2016",
      cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bb/45/68/bb4568f3-68cd-619d-fbcb-4e179916545d/BlondCover-Final.jpg/600x600bb.jpg",
      picks: [3, 7, 14, 16],   // track numbers you recommend, e.g. [2, 5]
      tracks: [["Nikes", "5:14"], ["Ivy", "4:09"], ["Pink + White", "3:05"], ["Be Yourself", "1:27"], ["Solo", "4:17"], ["Skyline To", "3:05"], ["Self Control", "4:10"], ["Good Guy", "1:07"], ["Nights", "5:07"], ["Solo (Reprise)", "1:19"], ["Pretty Sweet", "2:38"], ["Facebook Story", "1:09"], ["Close to You", "1:26"], ["White Ferrari", "4:09"], ["Seigfried", "5:35"], ["Godspeed", "2:58"], ["Futura Free", "9:24"]],
    },
    {
      url: "https://music.apple.com/id/album/the-new-abnormal/1498121188",
      title: "The New Abnormal", artist: "The Strokes", kind: "Album", year: "2020",
      cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/62/a6/ff/62a6ff2a-95c9-5302-31f4-2dcca9e40323/886448281085.jpg/600x600bb.jpg",
      picks: [1, 2, 6, 8, 9],   // track numbers you recommend, e.g. [2, 5]
      tracks: [["The Adults Are Talking", "5:09"], ["Selfless", "3:42"], ["Brooklyn Bridge To Chorus", "3:56"], ["Bad Decisions", "4:53"], ["Eternal Summer", "6:15"], ["At The Door", "5:10"], ["Why Are Sundays So Depressing", "4:36"], ["Not The Same Anymore", "5:37"], ["Ode To The Mets", "5:52"]],
    },
    {
      url: "https://music.apple.com/id/album/getting-killed/1818548779",
      title: "Getting Killed", artist: "Geese", kind: "Album", year: "2025",
      cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/0b/b8/f1/0bb8f1d7-1df0-20c0-9539-51d08058eeb1/5400863191436_Cover.jpg/600x600bb.jpg",
      picks: [2, 8, 10],   // track numbers you recommend, e.g. [2, 5]
      tracks: [["Trinidad", "3:45"], ["Cobra", "3:05"], ["Husbands", "4:08"], ["Getting Killed", "4:45"], ["Islands of Men", "5:54"], ["100 Horses", "3:46"], ["Half Real", "3:22"], ["Au Pays du Cocaine", "3:31"], ["Bow Down", "3:28"], ["Taxes", "3:18"], ["Long Island City Here I Come", "6:37"]],
    },
  ],

  // A video entry uses "video" instead of "src" (autoplays muted in the grid, plays with controls in the viewer).
  photos: [
    { src: "images/photos/photo-01.jpg", code: "PH-001-2", caption: "Standing on the slope", place: "" },
    { src: "images/photos/photo-02.jpg", code: "PH-002-6", caption: "On the ridge trail", place: "" },
    { src: "images/photos/photo-03.jpg", code: "PH-003-1", caption: "Heading down above the clouds", place: "" },
    { src: "images/photos/photo-04.jpg", code: "PH-004-5", caption: "Along the hillside path", place: "" },
    { src: "images/photos/photo-05.jpg", code: "PH-005-9", caption: "Ridgeline over the clouds", place: "" },
    { src: "images/photos/photo-06.jpg", code: "PH-006-3", caption: "Clouds and campsite below", place: "" },
    { video: "images/photos/photo-07.mp4", code: "VD-001-8", caption: "On the move", place: "" },
    { src: "images/photos/photo-08.jpg", code: "PH-007-4", caption: "Koi in the pond", place: "" },
  ],

  writing: [
    {
      "slug": "please",
      "code": "WR-008-2",
      "title": "Mindless Dream",
      "date": "2021-09-06",
      "tags": [],
      "excerpt": "as she slowly let my hands go, i speak to her “i know i made a mistake, but if by some miracle you found yourself in a position where you ready to…",
      "source": "https://imamnrchls.github.io/2021/09/06/Please/",
      "body": "as she slowly let my hands go, i speak to her “i know i made a mistake, but if by some miracle you found yourself in a position where you ready to fall in love again, fall in love with me…” We both freezing, i see her hand is trembling “…you’re still my favorite person, and always will be” i continued. Then she finally releases me, walk away without even needing a response. I see her back fading followed by our world that currently crumbling."
    },
    {
      "slug": "sungai-temaram",
      "code": "WR-007-5",
      "title": "Sungai Temaram",
      "date": "2021-06-12",
      "tags": [
        "poet"
      ],
      "excerpt": "Dalam renungan, sungai temaram. Hulu dan hilir, di antaranya terdapat cerita. Cerita di mana ada kita di dalamnya. Tak lepas dari gelombang, tetapi…",
      "source": "https://imamnrchls.github.io/2021/06/12/sungai-temaram/",
      "body": "Dalam renungan, sungai temaram. Hulu dan hilir, di antaranya terdapat cerita. Cerita di mana ada kita di dalamnya. Tak lepas dari gelombang, tetapi juga terdapat tenang. Tenang yang sangat menenangkan. Derai ombak membawa syahdu, alirannya mendorong kita maju. Beribu kata tersusun merdu, mengalir layaknya air sungai itu. Membilas duka, membawa tawa.\n\nDalam renungan, sungai temaram. Disertainya beribu kata yang tak teralirkan. Di antaranya terbentang jarak, membuat kapal-kapal itu hanya bisa tertambat. Tak ada beda dengan rindu yang tertahan, diam tak tersampaikan. Hilir yang meluap, ego yang melahap. Debur ombak, guruh gelombang, geramnya memecah tenang. Tak kuasa, dibuatnya kita tak berdaya.\n\nSesak di dada mu, dan keruh dalam pikir ku. Sepi yang menusuk, harap yang tak terpupuk. Hilir yang penuh gelombang, kapal-kapal yang karam."
    },
    {
      "slug": "penolakan-psikologi-sebagai-ilmu",
      "code": "WR-006-8",
      "title": "Penolakan Terhadap Psikologi Sebagai Ilmu",
      "date": "2020-06-23",
      "tags": [
        "karangan",
        "artikel"
      ],
      "excerpt": "Di zaman modern ini, psikologi merupakan salah satu ilmu pengetahuan yang banyak dipelajari oleh kalangan pelajar dan akademisi. Pokok bahasannya…",
      "source": "https://imamnrchls.github.io/2020/06/23/penolakan-psikologi-sebagai-ilmu/",
      "body": "Di zaman modern ini, psikologi merupakan salah satu ilmu pengetahuan yang banyak dipelajari oleh kalangan pelajar dan akademisi. Pokok bahasannya yang berfokus pada proses mental dan tingkah laku manusia membuat ilmu ini digemari oleh banyak orang untuk dipelajari dan diteliti lebih mendalam. Sebagai salah satu cabang ilmu, saat ini psikologi dianggap telah mampu memenuhi sifat-sifat yang wajib dimiliki oleh ilmu pengetahuan. Yaitu, psikologi memiliki objek kajian yang jelas, kemudian psikologi juga memiliki metode penelitian tertentu, psikologi memiliki riwayat sejarah, dan tentunya psikologi memiliki sistematika yang teratur sebagai hasil pendekatan terhadap objeknya. Dengan terpenuhinya sifat wajib ilmu tersebut tentunya menunjukkan bahwa psikologi saat ini dapat dikategorikan sebagai salah satu cabang ilmu. Sama seperti fisika, kimia, biologi, dan sosiologi.\n\nMeski pun saat ini psikologi sudah diakui sebagai salah satu cabang ilmu oleh banyak orang. Akan tetapi, tidak sedikit pula orang-orang yang masih beranggapan bahwa psikologi merupakan pseudoscience atau ilmu semu. Untuk mengetahui mengapa masih ada orang yang menganggap bahwa psikologi merupakan ilmu semu, maka kita perlu memahami pengertian dari psikologi terlebih dahulu. Psikologi dalam sejarahnya memiliki banyak sekali pengertian. Pengertian pertama dikemukakan oleh Wilhelm Wundt yang merupakan bapak psikologi. Wundt dianggap sebagai bapak psikologi karena ia lah yang pertama kali mendirikan laboratorium psikologi di dunia. Menurutnya, psikologi merupakan ilmu tentang kesadaran manusia (the science of human consciousness).\n\nDari pengertian tersebut, muncul banyak kritik terhadap psikologi yang menganggap bahwa psikologi merupakan ilmu semu. Hal itu didasari oleh adanya syarat ilmu yang menyebutkan bahwa objek dan pokok studi dari suatu ilmu harus merupakan sesuatu yang jelas dan tidak abstrak. Sementara dalam pengertian yang dikemukakan oleh Wundt, objek psikologi merupakan kesadaran manusia yang dianggap masih terlalu abstak untuk dijadikan objek kajian suatu ilmu pengetahuan. Akibatnya muncul pengertian-pengertian lain dari psikologi. Seperti yang dikemukakan oleh Branca dalam bukunya yang berjudul Psychology: The Science of Behavior, Branca mengartikan psikologi sebagai ilmu yang mempelajari tentang perilaku. Selain pengertian dari Branca tersebut, ada juga pengertian yang dikemukakan oleh Woodworth dan Marquis yang mengajukan pendapat bahwa psikologi merupakan ilmu tentang aktivitas individu.\n\nApabila dilihat dari sejarahnya, psikologi memang sering ditolak untuk menjadi salah satu bagian dari ilmu pengetahuan. Penolakan tersebut khususnya ditujukan pada aliran psikologi eksperimental, fungsionalisme, dan strukturalisme yang fokus penelitiannya berupa elemen kesadaran, struktur isi kesadaran, dan fungsi kesadaran. Ketika aliran tersebut sering mendapat penolakan karena dianggap terlalu abstrak untuk dijadikan fokus utama dari penelitian suatu ilmu. Penolakan yang pertama berasal dari Immanuel Kant yang merupakan seorang filsuf besar dan pemikirannya sangat berpengaruh terhadap filsuf-filsuf lain setelahnya. Dalam pandangannya, Kant berpendapat bahwa psikologi tidak dapat menjadi ilmu yang rasional dan empiris apabila psikologi terus berfokus pada hal metafisik seperti jiwa atau menggunakan metode introspeksi terhadap pengalaman subjektif yang tidak pasti. Menurutnya, apabila psikologi ingin menjadi ilmu pengetahuan yang rasional dan empiris, maka psikologi harus memiliki penelitian yang dapat diukur; dan agar bisa diukur, objek dari penelitian psikologi harus memiliki stabilitas dan ketetapan.\n\nPenolakan lain diutarakan oleh Auguste Comte yang merupakan penggagas dari positivisme. Ia beranggapan bahwa ilmu-ilmu alam telah mencapai tahap positivis, yaitu tahap di mana ilmu tersebut mampu dijelaskan secara ilmiah. Sementara ilmu sosial ia anggap belum mampu mencapai tahap tersebut. Kemudian, Comte membagi ilmu pengetahuan menjadi enam golongan yang bersifat hierarkis. Yang termasuk ke dalam enam golongan tersebut yaitu matematika, astronomi, fisika, kimia, fisiologi, biologi, dan sosiologi. Ia tidak memasukkan psikologi ke dalam hierarki tersebut karena beranggapan bahwa psikologi tidak cukup memadai untuk dianggap sebagai ilmu. Karena psikologi kurang menggunakan metode eksperimen dan lebih banyak menggunakan metode introspeksi yang bersifat subjektif sebagai metode penelitiannya. Selain itu, ia juga menganggap bahwa kombinasi dari biologi dan sosiologi sudah mampu mencakup bahasan yang menjadi fokus dari psikologi.\n\nSelain berasal dari kalangan luar psikologi seperti Kant dan Comte, penolakan terhadap ilmu psikologi yang berfokus pada kepribadian yang dianggap abstrak juga datang dari kalangan dalam psikologi itu sendiri. Salah satu kritik terhadap fokus psikologi pada kesadaran tersebut berasal dari kalangan behavioris. Sejalan dengan Kant dan Comte, para ilmuan behavioris ini juga berpendapat bahwa seharusnya psikologi tidak menggunakan hal yang abstrak seperti kesadaran sebagai fokus kajiannya. Mereka beranggapan bahwa psikologi seharusnya lebih berfokus pada perilaku dan bagaimana stimulus dari luar manusia membentuk manusia melalui proses belajar karena hal tersebut dapat diukur dan diamati secara objektif. Salah satu tokoh  aliran behaviorisme yaitu Ivan Pavlov. Pavlov sangat anti terhadap psikologi karena psikologi dianggapnya kurang ilmiah. Penolakan Pavlov terhadap psikologi sangatlah jelas. Bahkan ia tidak mau disebut sebagai ahli psikologi. Dalam penelitian-penelitiannya pun ia selalu berusaha menghindari konsep-konsep maupun istilah-istilah psikologi.\n\nTokoh psikologi lain yang mengkritik fokus psikologi yang kurang ilmiah adalah J. B. Watson. Ia memiliki pemikiran yang hampir sama dengan Immanuel Kant. Watson beranggapan jika psikologi ingin mendapatkan status ilmiah,  maka psikologi perlu meninggalkan kesadaran dan hal yang kurang saintifik lainnya sebagai fokus penelitian serta introspeksi sebagai metodenya. Maka dari itu, Watson dan ilmuan behavioris lainnya mulai mengubah fokus dari kajian psikologi yang awalnya adalah kesadaran menjadi berfokus pada perilaku. Akibat usaha tersebut, psikologi mulai dapat lebih diterima sebagai ilmu yang saintifik karena metodenya yang objektif dan fokus kajiannya yang tidak lagi bersifat abstrak.\n\nMeski pun psikologi sudah dapat diterima sebagai ilmu oleh lebih banyak orang setelah adanya behaviorisme, bukan berarti psikologi saat ini sudah terbebas dari kritik dan penolakan dari kalangan akademis. Munculnya aliran-aliran baru dalam psikologi setelah behaviorisme seperti psikoanalisis, psikologi humanistik, dan psikologi transpersonal juga memunculkan kritik-kritik baru terhadap psikologi. Salah satu contoh kritik terhadap ilmu psikologi saat ini berasal dari Alex Berezow. Ia merupakan seorang penulis saintifik profesional yang sering mengkritik ilmu yang ia anggap kurang saintifik.\n\nSalah satu opini Berezow yang mempertanyakan keabsahan ilmu psikologi adalah pertanyaannya megenai bagaimana psikologi dapat meneliti kebahagiaan yang bersifat subjektif. Menurutnya kebahagiaan memiliki arti yang berbeda pada tiap orang dan terlebih lagi pada budaya yang berbeda. Apa yang membuat orang Amerika Bahagia belum tentu akan membuat orang Cina bahagia. Ia mempertanyakan bagaimana psikologi dapat mendefinisikan hal seperti itu. Oleh karena itu, ia menganggap psikologi merupakan ilmu yang kurang saintifik.\n\nBerezow mengungkapkan mengapa ia dapat secara definitif mengatakan psikologi bukan ilmu karena psikologi sering tidak memenuhi lima persyaratan dasar untuk menjadi suatu bidang keilmuan. Kelima persyaratan tersebut meliputi: terminologi yang jelas, kuantitas, kondisi eksperimental yang sangat terkontrol, reproduktifitas, dan prediktabilitas serta testabilitas.\n\nAkan tetapi, kemajuan teknologi yang sangat pesat saat ini dapat membantu ilmu psikologi untuk menjawab dan mematahkan kritikan-kritikan yang diterima. Penggunaan teknologi dalam penelitian psikologi seperti contohnya penggunaan alat yang dapat melakukan pemindaian otak dan system neuron membuat psikologi diharapkan mampu mencapai tahap positivis di mana kajiannya dapat dijelaskan dan dibuktikan secara ilmiah.\n\nSebagai salah satu ilmu pengetahuan, tentunya psikologi tidak akan pernah luput dari kritik. Karena justru dengan adanya kritik tersebut psikologi dapat menjadi ilmu yang lebih baik dan lebih mampu menjelaskan fokus kajiannya secara ilmiah. Selain itu, psikologi juga masih tergolong ilmu baru jika dibandingkan dengan ilmu lain seperti fisika dan ilmu-ilmu lainnya. Sehingga, masih banyak bagian dari ilmu psikologi yang memerlukan peningkatan. Psikologi masih akan membutuhkan waktu yang sedikit lama agar mampu mendapat pengakuan dari ilmu-ilmu lainnya.\n\nReferensi\n\nIs psychology a \"real\" science? Does it really matter?. (2013, August 13). Retrieved June 23, 2020, from https://blogs.scientificamerican.com/the-curious-wavefunction/is-psychology-a-e2809creale2809d-science-does-it-really-matter/\n\nWhy Psychology and Statistics Are Not Science. (2015, November 06). Retrieved June 23, 2020, from https://www.alexberezow.com/why-psychology-and-statistics-are-not-science/\n\nWalgito, B. (2004). Pengantar psikologi umum.\n\nRahman, A. A. (2017). Sejarah Psikologi: Dari Klasik Hingga Modern. Jakarta: Raja Grafindo Persada."
    },
    {
      "slug": "bakat",
      "code": "WR-005-1",
      "title": "Bakat",
      "date": "2019-12-24",
      "tags": [
        "esai"
      ],
      "excerpt": "Dasar (kepandaian, sifat, dan pembawaan) yang dibawa sejak lahir bakat /ba·kat /n Seperti yang saya kutip dari Kamus Besar Bahasa Indonesia, bakat…",
      "source": "https://imamnrchls.github.io/2019/12/24/bakat/",
      "body": "> Dasar (kepandaian, sifat, dan pembawaan) yang dibawa sejak lahir\n> bakat /ba·kat /n\n\nSeperti yang saya kutip dari Kamus Besar Bahasa Indonesia, bakat merupakan kepandaian yang telah manusia bawa sejak lahir. Saya sendiri tidak sepenuhnya setuju dengan konsep bakat. Meski pun saya tidak setuju dengan konsep bakat, bukan berarti saya menolak atau bahkan tidak mengindahkan fakta bahwa tiap manusia pasti memiliki bakat yang telah mereka bawa sejak lahir.\n\nSaya kurang setuju dengan konsep bakat karena dengan adanya konsep ini muncullah pemikiran bahwa keahlian atau sesuatu yang telah dicapai oleh seseorang itu hanya dikarenakan oleh bakatnya, sehingga terkadang orang-orang akan kurang mengapresiasi usaha yang telah dilakukan oleh seseorang. Sebagai contoh, ketika seseorang mampu menggambar dengan baik, orang-orang akan berkata “Wah gambarnya bagus ya, udah pasti sih kamu kan punya bakat gambar.” Sangat jarang orang berkata “Wah gambarmu bagus, kamu pasti berlatih dengan giat jadinya bisa gambar sebagus ini.”\n\nSelain itu dengan adanya konsep bakat orang-orang yang merasa kalah bersaing dengan orang yang berbakat ini cenderung akan mudah menyerah dan akan menggunakan alasan bahwa saingannya berbakat sehingga ia tidak mampu bersaing. Kita ambil contoh ketika ada sebuah kompetisi bernyanyi, orang yang juara 2 biasanya akan berkata bahwa sang juara 1 memang sangat berbakat dalam bernyanyi sehingga tidak mungkin bagi si juara 2 untuk menyainginya. Padahal sebenarnya kata “bakat” yang ia sematkan kepada si juara 1 itu hanya bentuk ketidakmauannya untuk mengakui bahwa usaha yang telah dilakukan oleh si juara 1 ini lebih keras dan lebih baik darinya.\n\nNamun, saya juga tidak bisa mengesampingkan fakta bahwa ada orang-orang dengan bakat hebat yang mampu melakukan suatu hal tanpa perlu adanya usaha yang keras. Dan terkadang akan sangat sulit bagi seseorang yang kurang berbakat untuk menyaingi orang tersebut dalam bidang yang menjadi bakatnya. Yang saya tekankan adalah ketidaksetujuan saya dengan orang-orang yang menjadikan alasan bakat sebagai penghambat mereka untuk maju dan berkembang. Kebanyakan orang saat gagal atau tidak mampu dalam suatu hal akan berdalih bahwa mereka memang tidak memiliki bakat dalam hal tersebut. Sehingga, mereka akan menyerah dan cenderung malas untuk memperbaiki ketidakmampuan mereka.\n\nSebenarnya semua orang mampu untuk melakukan apa pun yang mereka inginkan, asalkan mereka mau berusaha. Yang menjadi pembeda antara orang yang berbakat dan tidak berbakat di suatu bidang, mungkin adalah kecepatan mereka dalam mempelajari bidang tersebut. Seseorang dengan bakat cenderung lebih cepat dalam mempelajari sesuatu yang memang menjadi bakatnya. Sementara orang yang tidak berbakat dalam suatu bidang akan memerlukan waktu lebih untuk mempelajari bidang tersebut."
    },
    {
      "slug": "masalah-tani",
      "code": "WR-004-4",
      "title": "Masalah Pertanian",
      "date": "2019-09-25",
      "tags": [
        "esai"
      ],
      "excerpt": "Pangan merupakan kebutuhan dasar bagi manusia. Salah satu sumber pangan tersebut berasal dari hasil pertanian dan perkebunan. Indonesia yang…",
      "source": "https://imamnrchls.github.io/2019/09/25/masalah-tani/",
      "body": "Pangan merupakan kebutuhan dasar bagi manusia. Salah satu sumber pangan tersebut berasal dari hasil pertanian dan perkebunan. Indonesia yang merupakan negara agraris seharusnya dapat menjadi pemasok komoditas hasil pertanian dan perkebunan ke dunia internasional. Atau setidaknya mampu mewujudkan kedaulatan pangan negara. Selain itu, diharapkan pula negara mampu menciptakan sistem pertanian yang modern, efisien serta negara juga telah dapat menjamin kesejahteraan hidup bagi para petani. Namun, pada kenyataannya kondisi pertanian di Indonesia masih sangat tertinggal jika dibandingkan dengan negara agraris lainnya. Makin berkurangnya lahan, adanya konflik agraria, sistem pertanian yang masih tergolong kuno, serta semakin minimnya minat generasi muda untuk menjadi petani merupakan masalah serius yang sedang dihadapi oleh Indonesia saat ini.\n\nMasalah serius di bidang pertanian yang tengah dihadapi oleh Indonesia saat ini adalah pengurangan lahan. Pengurangan lahan yang terjadi di Indonesia saat ini, sebagian besar merupakan akibat dari pembangunan yang sedang gencar-gencarnya dilakukan oleh pemerintah. Baik itu pembangunan di bidang industri, perumahan, atau pun di bidang infrastruktur. Dengan berkurangnya lahan maka jumlah hasil produksi tani dalam negeri akan berkurang. Selain itu, apabila daerah yang mulanya merupakan kawasan pertanian digunakan sebagai kawasan industri, maka akan menimbulkan masalah lain yaitu rusaknya lingkungan sekitar karena limbah hasil alat-alat produksi yang digunakan oleh industri. Hal tersebut juga diperparah dengan minimnya kesadaran beberapa pihak akan pentingnya pembangunan berkelanjutan bagi negara indonesia.\n\nSadar akan hal tersebut, saat ini banyak masyarakat yang mulai menolak adanya alih fungsi lahan dari kawasan pertanian menjadi kawasan industri. Akan tetapi, banyak dari masyarakat yang menolak pembangunan kawasan industri tersebut dikriminalisasi atau pun mendapat kekerasan dari oknum tertentu. Masalah ini seringkali disebut sebagai konflik agraria. Salah satu konflik agraria yang terjadi saat ini berada di Kulon Progo, Daerah Istimewa Yogyakarta. Di Kulon Progo sejak 2017, sebagian warga lokal serta petani menolak rencana pemerintah membangun bandara internasional di kawasan mereka. Konflik tersebut tidak hanya melibatkan petani dan PT Angkasa Pura I saja, namun juga melibatkan aparat kepolisian dan militer. Tak jarang kekerasan terjadi dalam konflik agraria tersebut. Contoh lain dari konflik agraria di Indonesia adalah konflik pendirian pabrik semen di Kendeng yang telah mengakibatkan salah seorang aktivis yang bernama Bu Patmi meninggal dunia.\n\nProblematika lain yang menjadi PR pemerintah adalah sistem pertanian di Indonesia yang masih sangat konvesional. Mayoritas petani di Indonesia masih menggunakan cara tradisional dalam mengolah lahan pertanian mereka. Selain itu, kebijakan pertanian di Indonesia juga dirasa masih kurang mendukung para petani. Jika dibandingkan dengan Thailand dan Vietnam, Indonesia dapat dikatakan telah kalah telak di bidang kebijakan dan teknologi tani. Di Vietnam pemerintahnya menjamin petani pasti akan mendapat untung sekurang-kurangnya 30 persen dari total biaya produksi. Sementara di Thailand telah memiliki 27 pusat penelitian beras yang bertujuan menciptakan bibit unggul yang memiliki kualitas dan daya tahan yang lebih baik dibanding bibit beras biasa.\n\nDengan semakin berkurangnya lahan serta minimnya perhatian pemerintah di bidang pertanian maka tak mengherankan apabila minat generasi muda untuk menjadi petani semakin berkurang dari waktu ke waktu. Selain itu anggapan bahwa menjadi petani tidak dapat menjamin kehidupan yang makmur juga merupakan salah satu faktor pemicu masalah ini. Memang anggapan tersebut tidak dapat kita bantah untuk saat ini. Mengingat harga komoditas tani yang sangat tidak stabil serta tidak adanya jaminan bahwa hasil panen akan selalu memuaskan dan dapat menutup modal tanam merupakan kenyataan yang ada di masyarakat.\n\nMasalah di bidang pertanian telah menjadi masalah klasik di Indonesia. Sudah saatnya pemerintah mengambil tindakan nyata untuk mengatasi masalah ini agar cita-cita bangsa mewujudkan kedaulatan pangan dapat dicapai kembali. Serta agar tidak akan ada lagi alasan bagi generasi muda untuk berkata dengan bangga bahwa ia bercita-cita menjadi seorang petani."
    },
    {
      "slug": "bisik-pohon-pinus",
      "code": "WR-003-7",
      "title": "Bisik Pohon Pinus",
      "date": "2019-03-29",
      "tags": [
        "cerpen"
      ],
      "excerpt": "Aku tidak bisa tidur malam itu karena angin sedang bertiup kencang di luar. Terlebih lagi rumahku yang berada dekat dengan hutan pinus, membuatku…",
      "source": "https://imamnrchls.github.io/2019/03/29/bisik-pohon-pinus/",
      "body": "Aku tidak bisa tidur malam itu karena angin sedang bertiup kencang di luar. Terlebih lagi rumahku yang berada dekat dengan hutan pinus, membuatku semakin susah untuk memasukki alam mimpiku. Setiap kali aku mencoba memejamkan mata aku selalu mendengar sebuah bisikan yang memanggil nama ku. Akhirnya setelah terjaga beberapa lama aku dapat tidur dengan lelap karena angin kencang itu sudah berhenti berhembus. Saat tertidur aku bermimpi bertemu dengan seorang anak kecil seumuranku, saat aku temui ia sedang menangis. Tanpa pikir panjang lagi aku pun menghampirinya. Alangkah terkejutnya aku. Saat ia menoleh, ternyata ia adalah seorang anak keturunan Belanda, “Kenapa kau menangis?” tanyaku pada anak laki-laki berumur 12 tahun itu.\n\n“Aku kesepian, aku tidak punya teman,” jawabnya.\n\nMendengar jawaban itu sontak aku pun merasa kasihan padanya. Oleh karena itu, aku menanyainya maukah ia jadi temanku. Ia mengangguk setuju. Namun, saat kutanya siapa namanya ia hanya tersenyum. Aku pun bingung mengapa dia seperti itu. Lalu saat aku akan bertanya di mana ia tinggal, ia hanya menjawab, “Datanglah ke hutan pinus jika kau mau menemuiku.” Setelah itu tiba-tiba aku terbagun dari tidurku.\n\nPagi itu tanpa pikir panjang lagi aku berlari menuju ke hutan pinus yang berada tak jauh dari rumahku untuk menemuinya. Sebenarnya aku sedikit heran kenapa dia memintaku menemuinya di tempat itu. Sesampainya di sana aku tidak dapat menemukan siapa-siapa. Yang ada hanyalah pohon pinus yang mengelilingiku. Tak berselang lama, tiba-tiba datang seorang anak kecil dari balik pohon pinus. Saat kulihat ia dengan cermat ternyata ia adalah anak kecil yang aku temui di mimpiku malam itu.\n\nIa melambaikan tangannya padaku sambil memanggil nama ku, “Lingga… Lingga.” Aku pun kaget karena aku sama sekali belum memberitahukan namaku padanya. Lalu aku pun menghampirinya. Lalu kami berjalan-jalan menyusuri hutan pinus itu. Aku terperangah saat melihat betapa indahnya pemandangan yang ada di sana. Tak berasa waktu  sudah beranjak petang. Aku pun berpamitan dengannya untuk pulang, ia hanya mengangguk dan berkata, “Besok datanglah ke sini lagi!”.\n\n“Baiklah!” jawabku.\n\nHari-hari selanjutnya kami selalu bermain bersama hingga akhirnya kakakku bertanya padaku, “Akhir-akhir ini kamu sering sekali keluar rumah, ke mana sebenarnya kau pergi?”.\n\nAku hanya menjawab bahwa aku hanya bermain dengan temanku di hutan pinus. Mendengar hal itu kakakku lalu memarahiku, “Apa? Hutan pinus? Kenapa kau main ke sana? Di sana berbahaya. Bagaimana jika kau tersesat atau bertemu dengan hewan buas!”.\n\nAku pun menjelaskan bahwa di sana ada seorang anak kecil yang membutuhkan teman sehingga aku menemaninya agar ia tidak kesepian. Mendengar hal itu kakakku sedikit mengerti akan hal yang aku lakukan, lalu ia bertanya siapa nama anak itu. Mendengar pertanyaan itu aku hanya bisa terdiam karena aku belum pernah diberi tahu nama temanku itu.\n\nMengetahui hal itu kakakku lalu mengajakku pergi ke hutan itu lagi untuk menemui temanku. Ternyata temanku telah menunggu di tempat biasa kami bertemu. Saat melihatnya, kakakku tiba-tiba meneteskan air matanya sembari terperangah heran. Lalu ia menarikku dan mengajakku untuk pulang ke rumah. Sesampainya di rumah kakakku menjelaskan apa yang terjadi. Ia bercerita bahwa anak kecil itu juga merupakan teman masa kecilnya. Ia muncul pertama kali dalam mimpinya sama seperti yang aku alami. Namun, ia sudah tidak pernah bermain dengannya  lagi semenjak SMA karena kesibukkannya sekolah. Aku pun hanya heran dan takut mendengar cerita dari kakakku. Dalam hati kecilku bertanya, “Siapa dia? Mau apa dia?”\n\nLalu aku dan kakaku pergi menemui kakek kami. Kami pun menceritakan apa yang tengah kami alami. Setelah mendengar cerita kami, kakek lalu memberi kami saran. Ia menyuruh kami untuk mencari tahu siapa nama anak itu, lalu memanggil namanya saat kami menemuinya, kakek kami menyuruh kami melakukan hal itu agar ia dapat pergi dengan tenang. Ia memberi tahu kami bahwa anak itu adalah roh kesepian yang lupa namanya sehingga ia tidak dapat meninggalkan hutan pinus itu.\n\nKami pun mencari namanya ke berbagai tempat hingga akhirnya saat kami mencarinya di perpustakaan desa, kami menemukan sebuah buku yang terdapat foto keluarga di dalamnya. Dalam foto tersebut terdapat seorang anak kecil yang sangat mirip teman kami. Saat kami melihat sisi belakang foto itu akhirnya kami mengetahui nama anak itu. Tanpa pikir panjang kami lalu pergi ke hutan pinus untuk menemuinya. Sesampainya di sana seperti biasa ia melambaikan tangan dan berkata, “Oeeyyy, Lingga! Rangga! Ayo kita bermain!”\n\n“Terima kasih! Terima kasih untuk ajakannya, kami sangat senang dapat bermain denganmu, Edward!” Teriakku dan kakakku.\n\nSetelah kami menyebutkan namanya seketika kehadiran Edward di hadapan kami semakin memudar. Sebelum ia benar-benar menghilang dari pandangan kami, kami berlari ke arahnya dan memeluknya. Saat itu kami melihat ia menangis. Lalu Edward berkata, “Terima kasih! Aku sangat senang dapat memiliki teman. Aku harap kalian tidak akan pernah melupakanku.”\n\nMendengar hal itu aku dan kakakku menangis. Hingga akhirnya keberadaan Edward benar-benar hilang dari hadapan kami.\n\nHari-hari selanjutnya aku sering diajak kakakku pergi ke hutan pinus itu untuk mengenang Edward, sahabat masa kecil kami yang sangat kami sayangi."
    },
    {
      "slug": "comment-section-jekyll",
      "code": "WR-002-0",
      "title": "Menambah Kolom Komentar di Jekyll",
      "date": "2018-12-13",
      "tags": [
        "coding"
      ],
      "excerpt": "Setelah beberapa hari dibuat pusing oleh bagaimana caranya menambah kolom komentar pada github page, akhirnya saya menemukan cara yang cukup simple…",
      "source": "https://imamnrchls.github.io/2018/12/13/comment-section-jekyll/",
      "body": "Setelah beberapa hari dibuat pusing oleh bagaimana caranya menambah kolom komentar pada github page, akhirnya saya menemukan cara yang cukup simple untuk mengatasi masalah tersebut. Dengan cara ini kalian tidak perlu lagi mencari page url dan page identifier seperti kebanyakan metode yang ada di google. Oke langsung saja kita ke tutorialnya.\n\nPertama-tama buat akun [Disqus](https://disqus.com/profile/signup/) terlebih dahulu. Apabila kalian sudah mempunyai akun Disqus cukup lewati langkah ini.\n\nSelanjutnya buka file _config.yml dan tambahkan kode berikut\n\n```\n#Disqus\ndisqus_shortname: shortname\n```\n\nGanti shortname dengan [Disqus Shortname](https://help.disqus.com/installation/whats-a-shortname) milik kamu.\n\nSekarang buka folder _include dan buat file baru dengan nama comments.html kemudian tambahkan kode berikut di dalamnya.\n\n```\n<div class=\"container\">\n<div class=\"row\">\n<div class=\"col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1\" id=\"disqus_thread\">\n\n</div>\n</div>\n</div>\n<script type=\"text/javascript\">\n    /* * * CONFIGURATION VARIABLES * * */\n    var disqus_shortname = '{{ site.disqus_shortname }}';\n    \n    /* * * DON'T EDIT BELOW THIS LINE * * */\n    (function() {\n        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;\n        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';\n        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);\n    })();\n</script>\n<noscript>Please enable JavaScript to view the <a href=\"https://disqus.com/?ref_noscript\" rel=\"nofollow\">comments powered by Disqus.</a></noscript>\n```\n\nTerakhir buka post.html yang terdapat di folder _layouts lalu tambahkan kode berikut.\n\n```\n{% include comments.html %}\n```\n\nDone!."
    },
    {
      "slug": "tips-stage-photography",
      "code": "WR-001-3",
      "title": "Tips Stage Photography",
      "date": "2018-12-11",
      "tags": [
        "fotografi"
      ],
      "excerpt": "Hobi fotografi konser atau stage photography merupakan hobi yang cukup unik dan diperlukan beberapa teknik khusus agar dapat menghasilkan foto yang…",
      "source": "https://imamnrchls.github.io/2018/12/11/tips-stage-photography/",
      "body": "Hobi fotografi konser atau stage photography merupakan hobi yang cukup unik dan diperlukan beberapa teknik khusus agar dapat menghasilkan foto yang baik. Berikut adalah tips-tips stage photography yang admin kutip dari instagram [@keelesson](https://www.instagram.com/keelesson/) agar hasil foto konser kalian lebih ciamik dan tentunya instagramable banget.\n\n## Persiapan\n\nSebagai awal persiapan memotret adalah susunan acara. Dengan mengetahui susunan acara kita bisa lebih santai dalam memotret. Selain itu, kita juga bisa mengatur waktu kapan kita harus mendekat atau berada di panggung dan kapan kita bisa leluasa menjauh. Persiapan kedua adalah membawa peralatan fotografi seperlunya saja. Dengan barang bawaan yang sedikit, kita bisa bebas bergerak dan tidak mudah capek. Selain itu kita juga harus mengetahui susunan panggung, tema, denah panggung, dan kalau bisa mengikuti gladi bersih.\n\n## Pengaturan Pada Kamera\n\nSaat memotret kita bisa menggunakan mode manual (M) atau juga bisa menggunakan aperture priority (A). Mode M sebaiknya digunakan saat kondisi cahaya kurang baik. Untuk lebih mudahnya sangat disarankan menggunakan mode A agar perubahan cahaya bisa diukur secara otomatis oleh kamera. Metode matering saat menggunakan mode M sebaiknya spot, sedangkan pada mode A sebaiknya matrix. Karena pencahayaan panggung yang sering berubah maka jangan berharap semua foto selalu tepat materingnya.\n\n## Gunakan Auto White Balance:\n\nAgar lebih efisien sangat disarankan menggunakan setting white balance auto karena cahaya warna-warni pada acara panggung biasanya sering berganti.\n\nJika kamu punya banyak waktu, kamu dapat menggunakan WB Daylight atau yang lainnya untuk mendapatkan hasil foto sesuai yang kamu inginkan.\n\nHasil terbaik bisa kamu dapatkan dengan menyimpan hasil foto dalam format RAW dan mengatur warna di komputer sesuai kebutuhan.\n\n## Pengaturan ISO:\n\nBiasanya acara panggung yang menarik untuk difoto diadakan pada malam hari dengan pencahayaan yang minim. Maka dari itu gunakan settingan ISO pada kamera untuk mendapatkan kecepatan rana yang cepat.\n\n## Gunakan Lensa Tercepat dan Bukaan Terlebar\n\nJika menggunakan lensa bukaan lebar kita bisa meminimalkan ISO serendah mungkin agar dapat terhindar dari noise. Dengan kombinasi lensa cepat dan ISO tinggi, kita bisa menangkan momen-momen bagus dengan kualitas yang tajam.\n\n## Bermain dengan Exposure Compensation\n\nCahaya panggung yang tidak merata membuat matering kamera susah mendapatkan exposure yang tepat. Gunakan tombol kompensasi (+/-) pada kamera. Kompensasi minus dilakukan jika latar belakang panggung lebih gelap daripada latar depan, begitu juga sebaliknya.\n\n## Jangan Lupakan Komposisi\n\nRule of third sangat penting saat mengatur komposisi foto panggung. Yang paling penting adalah kamu berada di posisi terbaik. Jangan datang terlambat jika ingin mendapatkan foto yang bagus.\n\nNah itu dia tips-tips saat melakukan stage photography, semoga membantu!.\n\nSumber : [@keelesson](https://www.instagram.com/p/BqZkgYqgfAM/)"
    }
  ],
};
