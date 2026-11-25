export const site = 'https://www.forsythbarnes.com'
export const route = (path) => new URL(path, site).href
export const media = (file) => `${import.meta.env.BASE_URL}media/${file}`

export const sectors = [
  ['eTail', '/etail'],
  ['FinTech', '/fintech'],
  ['Sports & Entertainment', '/sports'],
]

export const navigation = [
  ['Solutions', '/solutions', [['Key Hire', '/key-hire'], ['Multi Hire', '/multihire'], ['Purpose', '/purpose'], ['Contract', '/contract']]],
  ['Sectors', '/sectors', sectors],
  ['About us', '/about-us', [['Meet the team', '/team'], ['Join our team', '/join-our-team'], ['Sustainability', '/sustainability'], ['DEI', '/dei']]],
  ['Job search', '/jobs', [['FinTech jobs', '/jobs?sector=fintech'], ['eTail jobs', '/jobs?sector=etail'], ['Sports jobs', '/jobs?sector=sports']]],
]

export const metrics = [
  ['98%', 'of job searches filled'],
  ['99%', 'of shortlists delivered by agreed timelines'],
  ['780K+', 'client and candidate reach'],
  ['41%', 'average diverse shortlist'],
  ['97%', 'of candidates stay in post for over two years'],
]

export const awards = [
  'Recruitment Agency of the Year 2026',
  'Most Effective Back Office Operation 2026',
  'Financial Times Fastest Growing Companies',
  '11th Best Start-up in the UK',
  'EMC Entrepreneur of the Year',
  'Multiple EMC awards, including Best Use of Tech',
]

export const salaryGuide = 'https://resources.forsythbarnes.com/?utm_source=website&utm_medium=redirect&utm_campaign=salary_guide_2026'
export const social = [
  ['LinkedIn', 'https://www.linkedin.com/company/forsythbarnes/'],
  ['Instagram', 'https://www.instagram.com/forsythbarnes'],
  ['YouTube', 'https://www.youtube.com/channel/UCddP4PoPZ-f9Pi2j5a9X_FA'],
  ['X', 'https://twitter.com/ForsythBarnes'],
]

export const heroVideo = route('/app/public/images/videos/first-video.mp4')

export const solutions = [
  {
    title: 'Key Hire',
    path: '/key-hire',
    description: 'This is designed to find the best talent for your priority role.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80',
    alt: 'Two senior professionals celebrating a successful partnership in an office',
  },
  {
    title: 'Multi Hire',
    path: '/multihire',
    description: 'As a talent partner, we work with you to scale your team with multiple positions on a single campaign.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80',
    alt: 'Corporate team gathered around a boardroom table during a presentation',
  },
  {
    title: 'Purpose',
    path: '/purpose',
    description: 'Enabling you to rapidly scale your business with your goals in mind.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80',
    alt: 'Team mapping business goals and strategy on a planning wall',
  },
  {
    title: 'Contract',
    path: '/contract',
    description: 'We can contract out a whole team for a long-term project or a single individual for a short-term campaign.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
    alt: 'Project specialists working together on laptops at a shared table',
  },
]

export const navigationImages = {
  '/solutions': 'team-70.jpg',
  '/key-hire': 'video-3.jpg',
  '/multihire': 'team-69.jpg',
  '/purpose': 'team-68.jpg',
  '/contract': 'team-70.jpg',
  '/sectors': 'team-65.jpg',
  '/etail': 'video-4.jpg',
  '/fintech': 'team-70.jpg',
  '/sports': 'team-67.jpg',
  '/about-us': 'team-65.jpg',
  '/team': 'team-68.jpg',
  '/join-our-team': 'video-6.jpg',
  '/sustainability': 'video-5.jpg',
  '/dei': 'video-2.jpg',
  '/jobs': 'team-70.jpg',
  '/jobs?sector=fintech': 'team-68.jpg',
  '/jobs?sector=etail': 'video-8.jpg',
  '/jobs?sector=sports': 'video-0.jpg',
}
