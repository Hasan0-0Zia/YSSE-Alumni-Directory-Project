/* ==========================================================================
   Constants & Reference Data
   ========================================================================== */
const DEPTS = ['Engineering', 'Business', 'Science', 'Arts & Humanities'];

/* ==========================================================================
   Main Data Collections (Alumni, Talks, Achievements)
   ========================================================================== */
const alumni = [
  {
    id: 1,
    name: 'Nusrat Jahan',
    batch: 2016,
    dept: 'Business',
    role: 'Founder',
    company: 'GreenLoop',
    city: 'Chattogram',
    mentor: true,
    linkedin: '#',
    bio: 'Builds recycling businesses that employ local women.',
    journey: [
      [2016, 'Joined YSSE and led the campus waste project'],
      [2018, 'Started GreenLoop with three collectors'],
      [2023, 'Expanded to 6 districts']
    ],
    achievements: ['Forbes 30 Under 30 (regional)', '120+ jobs created']
  },
  {
    id: 2,
    name: 'Tanvir Ahmed',
    batch: 2017,
    dept: 'Engineering',
    role: 'Software Engineer',
    company: 'Pathao',
    city: 'Dhaka',
    mentor: true,
    linkedin: '#',
    bio: 'Works on logistics systems and mentors first-time developers.',
    journey: [
      [2017, 'Built a volunteer-matching app at YSSE'],
      [2020, 'Joined Pathao as backend engineer']
    ],
    achievements: ['Open-source maintainer', 'Hackathon winner 2019']
  },
  {
    id: 3,
    name: 'Farhana Islam',
    batch: 2015,
    dept: 'Science',
    role: 'Research Associate',
    company: 'icddr,b',
    city: 'Dhaka',
    mentor: false,
    linkedin: '',
    bio: 'Studies community health and nutrition programs.',
    journey: [
      [2015, 'Joined YSSE health outreach'],
      [2019, 'MSc in Public Health'],
      [2021, 'Research Associate']
    ],
    achievements: ['Co-author on a Lancet paper']
  },
  {
    id: 4,
    name: 'Rafiul Karim',
    batch: 2018,
    dept: 'Business',
    role: 'Program Manager',
    company: 'BRAC',
    city: 'Dhaka',
    mentor: true,
    linkedin: '#',
    bio: 'Runs youth skills programs across Bangladesh.',
    journey: [
      [2018, 'Led YSSE fundraising'],
      [2021, 'Joined BRAC']
    ],
    achievements: ['Trained 5,000 youth']
  },
  {
    id: 5,
    name: 'Sadia Rahman',
    batch: 2019,
    dept: 'Arts & Humanities',
    role: 'Documentary Filmmaker',
    company: 'Independent',
    city: 'Sylhet',
    mentor: true,
    linkedin: '#',
    bio: 'Tells stories of social change through film.',
    journey: [
      [2019, 'Made her first short film at YSSE'],
      [2022, 'Premiered a feature documentary']
    ],
    achievements: ['Best Short Film, Dhaka Film Fest']
  },
  {
    id: 6,
    name: 'Imran Hossain',
    batch: 2016,
    dept: 'Engineering',
    role: 'Mechanical Engineer',
    company: 'Walton',
    city: 'Gazipur',
    mentor: false,
    linkedin: '#',
    bio: 'Designs low-cost appliances for rural homes.',
    journey: [
      [2016, 'Joined YSSE'],
      [2020, 'Joined Walton R&D']
    ],
    achievements: ['2 patents filed']
  },
  {
    id: 7,
    name: 'Mim Chowdhury',
    batch: 2020,
    dept: 'Science',
    role: 'Data Analyst',
    company: 'Grameenphone',
    city: 'Dhaka',
    mentor: true,
    linkedin: '#',
    bio: 'Turns messy data into decisions.',
    journey: [
      [2020, 'Joined YSSE data team'],
      [2023, 'Data Analyst at Grameenphone']
    ],
    achievements: ['Kaggle Expert']
  },
  {
    id: 8,
    name: 'Arif Mahmud',
    batch: 2014,
    dept: 'Business',
    role: 'CEO',
    company: 'FreshBazar',
    city: 'Chattogram',
    mentor: true,
    linkedin: '#',
    bio: 'Connects farmers directly to city buyers.',
    journey: [
      [2014, 'Founded the YSSE market club'],
      [2017, 'Launched FreshBazar'],
      [2024, 'Raised seed funding']
    ],
    achievements: ['Seed round: $400K', 'Ashoka Fellow']
  }
];

const talks = [
  { id: 1, speaker: 1, title: 'From campus project to a funded startup', date: '2026-11-08', upcoming: true },
  { id: 2, speaker: 2, title: 'Breaking into software without a CS degree', date: '2026-09-20', upcoming: false },
  { id: 3, speaker: 8, title: 'Selling to Bangladesh: lessons from FreshBazar', date: '2026-08-02', upcoming: false },
  { id: 4, speaker: 5, title: 'Telling true stories on a small budget', date: '2026-12-01', upcoming: true }
];

const achievements = [
  { alum: 8, type: 'Entrepreneurship', year: 2024, title: 'FreshBazar raises seed round', text: 'Arif closed a $400K seed round to expand farm-to-city delivery.' },
  { alum: 5, type: 'Award', year: 2022, title: 'Best Short Film at Dhaka Film Fest', text: 'Sadia won for a short about river erosion and migration.' },
  { alum: 3, type: 'Research', year: 2021, title: 'Co-authored a Lancet paper', text: 'Farhana contributed to a study on child nutrition programs.' },
  { alum: 1, type: 'Impact', year: 2023, title: 'GreenLoop reaches 6 districts', text: 'Over 120 jobs created, mostly for women collectors.' }
];

/* ==========================================================================
   Mutable State & Approvals
   ========================================================================== */
// Profile changes waiting for admin approval. aid = existing alumni id, or null for a new member.
let pending = [
  {
    pid: 1,
    aid: null,
    name: 'Lamia Akter',
    changes: {
      name: 'Lamia Akter',
      batch: 2022,
      dept: 'Engineering',
      role: 'Junior Developer',
      company: 'Brain Station 23',
      city: 'Dhaka',
      mentor: false,
      linkedin: '',
      bio: 'New graduate building web apps.',
      journey: [[2022, 'Joined YSSE']],
      achievements: []
    }
  },
  {
    pid: 2,
    aid: 4,
    name: 'Rafiul Karim',
    changes: { role: 'Senior Program Manager' }
  }
];

/* ==========================================================================
   Module Exports
   ========================================================================== */
// Lets server/db.js reuse this file as seed data (ignored in the browser)
if (typeof module !== 'undefined') module.exports = { alumni, talks, achievements, pending };