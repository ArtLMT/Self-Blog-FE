import { PublicArcResponseDTO } from '@/types/models';

export const mockArcs: PublicArcResponseDTO[] = [
  {
    title: 'The Foundation Era',
    slug: 'the-foundation-era',
    summary: 'The very beginning of everything we built, filled with naivety and endless energy.',
    displayOrder: 1,
    startDate: '2012-01-01T00:00:00Z',
    endDate: '2014-12-31T23:59:59Z',
    chapters: [
      {
        title: 'The Setup',
        slug: 'the-setup',
        quote: '"In the beginning, there was just a blinking cursor and a lot of caffeine."',
        summary: 'Setting up the environments, defining the architecture, and writing the first lines of code.',
        orderIndex: 1,
        readingTimeMinutes: 5,
        publishedAt: '2012-05-10T14:30:00Z',
        arcSlug: 'the-foundation-era',
        episodes: [
          {
            title: 'Choosing the Stack',
            slug: 'choosing-the-stack',
            markdownContent: 'We deliberated for days over the perfect tech stack...',
            renderedContent: '<p>We deliberated for days over the perfect tech stack...</p>',
            orderIndex: 1,
            conclusion: 'We ultimately chose what we knew best, not what was trendiest.',
            eventDate: '2012-01-15T09:00:00Z',
            chapterSlug: 'the-setup',
            marginNotes: []
          },
          {
            title: 'Hello World',
            slug: 'hello-world',
            markdownContent: 'The first successful compile was a moment of pure joy.',
            renderedContent: '<p>The first successful compile was a moment of pure joy.</p>',
            orderIndex: 2,
            conclusion: 'A small step, but a crucial one.',
            eventDate: '2012-02-01T10:00:00Z',
            chapterSlug: 'the-setup',
            marginNotes: []
          }
        ]
      },
      {
        title: 'The First Deployment',
        slug: 'the-first-deployment',
        quote: '"The code is a trace of where we were, not just what we built."',
        summary: 'The chaotic beauty of deploying our MVP at 3:42 AM.',
        orderIndex: 2,
        readingTimeMinutes: 8,
        publishedAt: '2012-10-15T03:42:00Z',
        arcSlug: 'the-foundation-era',
        episodes: [
          {
            title: 'The Pre-flight Check',
            slug: 'the-pre-flight-check',
            markdownContent: 'Everything seemed ready, but we were terrified.',
            renderedContent: '<p>Everything seemed ready, but we were terrified.</p>',
            orderIndex: 1,
            conclusion: 'Nerves are just a sign you care.',
            eventDate: '2012-10-14T23:00:00Z',
            chapterSlug: 'the-first-deployment',
            marginNotes: []
          },
          {
            title: 'Push to Prod',
            slug: 'push-to-prod',
            markdownContent: 'We hit enter. The logs scrolled. We held our breath.',
            renderedContent: '<p>We hit enter. The logs scrolled. We held our breath.</p>',
            orderIndex: 2,
            conclusion: 'It worked. Mostly.',
            eventDate: '2012-10-15T03:42:00Z',
            chapterSlug: 'the-first-deployment',
            marginNotes: []
          }
        ]
      }
    ]
  },
  {
    title: 'The Scaling Years',
    slug: 'the-scaling-years',
    summary: 'When traffic hit and our pristine architecture was put to the ultimate test.',
    displayOrder: 2,
    startDate: '2015-01-01T00:00:00Z',
    endDate: '2018-12-31T23:59:59Z',
    chapters: [
      {
        title: 'Scaling Walls',
        slug: 'scaling-walls',
        quote: '"You don\'t know how your system breaks until a million people use it at once."',
        summary: 'The painful lessons of database locks and caching failures.',
        orderIndex: 1,
        readingTimeMinutes: 12,
        publishedAt: '2015-06-20T09:00:00Z',
        arcSlug: 'the-scaling-years',
        episodes: [
          {
            title: 'The Reddit Hug of Death',
            slug: 'the-reddit-hug-of-death',
            markdownContent: 'We went viral. It was the best and worst day.',
            renderedContent: '<p>We went viral. It was the best and worst day.</p>',
            orderIndex: 1,
            conclusion: 'Traffic is a privilege that comes with consequences.',
            eventDate: '2015-06-15T14:00:00Z',
            chapterSlug: 'scaling-walls',
            marginNotes: []
          }
        ]
      }
    ]
  }
];
