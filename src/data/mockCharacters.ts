import type { CharacterWithBook } from '@/types/character';

export const mockCharacters: CharacterWithBook[] = [
  {
    id: '1',
    book_id: '1',
    name: 'Aurora Winters',
    gender: 'female',
    occupation: 'Ice Queen Heir',
    opening_line: "If you can handle the cold, I promise the warmth underneath is worth it.",
    traits: ['Cold Exterior', 'Secretly Soft', 'Protective'],
    hobbies: ['Ice Skating', 'Reading'],
    prompts: [
      {
        prompt: "Don't let the ice fool you",
        answer:
          'Behind every cold glare is someone who feels too deeply and hides it even deeper.',
      },
      {
        prompt: 'What melts my walls',
        answer:
          'Persistence without pressure. Show up, but give me space to come to you.',
      },
      {
        prompt: 'Worth the wait because',
        answer: "Once I let you in, I'd freeze the world to keep you safe.",
      },
    ],
    images: [
      {
        url: 'https://picsum.photos/seed/aurora1/400/600',
        is_primary: true,
        sort_order: 0,
      },
      {
        url: 'https://picsum.photos/seed/aurora2/400/400',
        is_primary: false,
        sort_order: 1,
      },
    ],
    is_published: true,
    is_deleted: false,
    deleted_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    book: {
      id: '1',
      title: 'Frozen Hearts Thaw',
      author: 'Melody Frost',
      description: 'A story of love melting the coldest heart.',
      cover_image_url: 'https://picsum.photos/seed/bookfrozen/300/450',
      amazon_affiliate_link: null,
      genre: 'Romance',
      tags: ['enemies-to-lovers', 'slow-burn'],
      spice_level: 2,
      mature_themes: false,
      series_name: null,
      series_order: null,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: '2',
    book_id: '2',
    name: 'Marcus Chen',
    gender: 'male',
    occupation: 'CEO & Former Street Racer',
    opening_line: "I don't do second chances. But for you? I'd make an exception.",
    traits: ['Brooding', 'Loyal', 'Secretly Romantic'],
    hobbies: ['Restoring Classic Cars', 'Late Night Drives'],
    prompts: [
      {
        prompt: 'My love language is',
        answer:
          "Acts of service. I'll fix your car at 2am without you asking, then pretend it was nothing.",
      },
      {
        prompt: 'Green flag about me',
        answer:
          "I remember every detail you've ever told me. Your coffee order. Your favorite song. The way you laugh.",
      },
      {
        prompt: 'Looking for someone who',
        answer:
          "Sees past the suits and the silence. Someone who isn't afraid to race into the unknown with me.",
      },
    ],
    images: [
      {
        url: 'https://picsum.photos/seed/marcus1/400/600',
        is_primary: true,
        sort_order: 0,
      },
    ],
    is_published: true,
    is_deleted: false,
    deleted_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    book: {
      id: '2',
      title: 'Midnight in Monaco',
      author: 'Vivian Blake',
      description: 'When the CEO falls for his rival on the underground racing circuit.',
      cover_image_url: 'https://picsum.photos/seed/bookmonaco/300/450',
      amazon_affiliate_link: null,
      genre: 'Romance',
      tags: ['billionaire', 'rivals-to-lovers'],
      spice_level: 3,
      mature_themes: false,
      series_name: 'Racing Hearts',
      series_order: 1,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: '3',
    book_id: '3',
    name: 'Sage Thornwood',
    gender: 'non-binary',
    occupation: 'Bookshop Owner & Hedge Witch',
    opening_line: "The cards said someone interesting would walk through my door today.",
    traits: ['Mysterious', 'Nurturing', 'Fiercely Independent'],
    hobbies: ['Herbalism', 'Tarot', 'Baking'],
    prompts: [
      {
        prompt: 'First thing I noticed about you',
        answer:
          "The way you lingered in the poetry section. People who read poetry have interesting souls.",
      },
      {
        prompt: 'Our perfect date',
        answer:
          'Tea in my garden at sunset, surrounded by lavender. I read your cards while you tell me your secrets.',
      },
      {
        prompt: 'The magic I believe in',
        answer:
          "Finding someone who feels like coming home. That's the only spell worth casting.",
      },
    ],
    images: [
      {
        url: 'https://picsum.photos/seed/sage1/400/600',
        is_primary: true,
        sort_order: 0,
      },
      {
        url: 'https://picsum.photos/seed/sage2/400/400',
        is_primary: false,
        sort_order: 1,
      },
    ],
    is_published: true,
    is_deleted: false,
    deleted_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    book: {
      id: '3',
      title: 'Spelled by You',
      author: 'Rowan Ellis',
      description: 'A cozy fantasy romance where magic blooms in unexpected places.',
      cover_image_url: 'https://picsum.photos/seed/bookspell/300/450',
      amazon_affiliate_link: null,
      genre: 'Fantasy',
      tags: ['cozy-fantasy', 'small-town', 'found-family'],
      spice_level: 1,
      mature_themes: false,
      series_name: null,
      series_order: null,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: '4',
    book_id: '4',
    name: 'Dante Moretti',
    gender: 'male',
    occupation: 'Ex-Military Bodyguard',
    opening_line: "I don't usually talk much. But something tells me you're worth the words.",
    traits: ['Protective', 'Scarred', 'Touch-Starved'],
    hobbies: ['Boxing', 'Cooking Italian Food'],
    prompts: [
      {
        prompt: "What I can't hide",
        answer:
          'The way I look at you when you\'re not watching. Like you\'re the first sunrise I\'ve seen in years.',
      },
      {
        prompt: 'My biggest fear',
        answer:
          "That I'm too broken to be loved. But you make me want to try anyway.",
      },
      {
        prompt: 'I show love by',
        answer:
          'Standing between you and anything that could hurt you. Always.',
      },
    ],
    images: [
      {
        url: 'https://picsum.photos/seed/dante1/400/600',
        is_primary: true,
        sort_order: 0,
      },
    ],
    is_published: true,
    is_deleted: false,
    deleted_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    book: {
      id: '4',
      title: 'Guarding Her Heart',
      author: 'Stella Romano',
      description: 'He was hired to protect her body. Falling for her was never part of the plan.',
      cover_image_url: 'https://picsum.photos/seed/bookguard/300/450',
      amazon_affiliate_link: null,
      genre: 'Thriller',
      tags: ['bodyguard', 'forced-proximity', 'he-falls-first'],
      spice_level: 3,
      mature_themes: true,
      series_name: 'Moretti Security',
      series_order: 1,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: '5',
    book_id: '5',
    name: 'Lily Park',
    gender: 'female',
    occupation: 'Pastry Chef & Reluctant Heiress',
    opening_line: "Fair warning: I communicate primarily through baked goods and sarcasm.",
    traits: ['Sunshine Personality', 'Stubborn', 'Secretly Anxious'],
    hobbies: ['Baking', 'K-Drama Marathons', 'Plant Collecting'],
    prompts: [
      {
        prompt: 'Recipe for winning me over',
        answer:
          'Show up with coffee. Stay for the chaos. Laugh when I accidentally set off the smoke alarm (again).',
      },
      {
        prompt: 'Unpopular opinion',
        answer:
          "Money doesn't buy happiness, but homemade croissants at 3am might. I've tested this theory extensively.",
      },
      {
        prompt: 'Looking for my',
        answer:
          'Someone who sees the real me, not the family name. Bonus points if you can handle my competitive side in board games.',
      },
    ],
    images: [
      {
        url: 'https://picsum.photos/seed/lily1/400/600',
        is_primary: true,
        sort_order: 0,
      },
      {
        url: 'https://picsum.photos/seed/lily2/400/400',
        is_primary: false,
        sort_order: 1,
      },
    ],
    is_published: true,
    is_deleted: false,
    deleted_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    book: {
      id: '5',
      title: 'Sweet on You',
      author: 'Jamie Song',
      description: 'A sweet rom-com about finding love in the most unexpected ingredient.',
      cover_image_url: 'https://picsum.photos/seed/booksweet/300/450',
      amazon_affiliate_link: null,
      genre: 'Romance',
      tags: ['rom-com', 'grumpy-sunshine', 'foodie'],
      spice_level: 0,
      mature_themes: false,
      series_name: null,
      series_order: null,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];
