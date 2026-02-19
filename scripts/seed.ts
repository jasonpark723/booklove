// Seed script for BookLove database
// Run with: npx tsx scripts/seed.ts

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.error('Add SUPABASE_SERVICE_ROLE_KEY to your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const books = [
  {
    id: 'b1000000-0000-0000-0000-000000000001',
    title: 'A Court of Thorns and Roses',
    author: 'Sarah J. Maas',
    description: 'When nineteen-year-old huntress Feyre kills a wolf in the woods, a terrifying creature arrives to demand retribution. Dragged to a treacherous magical land she knows about only from legends, Feyre discovers that her captor is not truly a beast, but one of the lethal, immortal faeries who once ruled her world.',
    cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg',
    amazon_affiliate_link: 'https://www.amazon.com/dp/1635575567?tag=booklove-20',
    genre: 'Fantasy',
    sub_genres: ['Romantasy', 'Fae', 'Romance'],
    spice_level: 3,
    mature_themes: true,
    content_tags: ['enemies-to-lovers', 'fae', 'slow-burn', 'found-family'],
    series_name: 'A Court of Thorns and Roses',
    series_order: 1,
    is_published: true,
  },
  {
    id: 'b1000000-0000-0000-0000-000000000002',
    title: 'Fourth Wing',
    author: 'Rebecca Yarros',
    description: 'Twenty-year-old Violet Sorrengail was supposed to enter the Scribe Quadrant, but her commanding general mother has other plans. Violet must join the hundreds of candidates striving to become elite dragon riders.',
    cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1701980900i/61431922.jpg',
    amazon_affiliate_link: 'https://www.amazon.com/dp/1649374046?tag=booklove-20',
    genre: 'Fantasy',
    sub_genres: ['Romantasy', 'Dragons', 'Academy'],
    spice_level: 3,
    mature_themes: true,
    content_tags: ['enemies-to-lovers', 'dragons', 'military-academy', 'forced-proximity'],
    series_name: 'The Empyrean',
    series_order: 1,
    is_published: true,
  },
  {
    id: 'b1000000-0000-0000-0000-000000000003',
    title: 'From Blood and Ash',
    author: 'Jennifer L. Armentrout',
    description: "Chosen from birth to usher in a new era, Poppy's life has never been her own. The life of the Maiden is solitary. But when Hawke, a golden-eyed guard honor-bound to protect her, enters her life, destiny and duty become tangled.",
    cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1588843906i/52831200.jpg',
    amazon_affiliate_link: 'https://www.amazon.com/dp/1952457009?tag=booklove-20',
    genre: 'Fantasy',
    sub_genres: ['Romantasy', 'Vampires', 'Romance'],
    spice_level: 3,
    mature_themes: true,
    content_tags: ['forbidden-love', 'hidden-identity', 'slow-burn', 'protective-hero'],
    series_name: 'Blood and Ash',
    series_order: 1,
    is_published: true,
  },
  {
    id: 'b1000000-0000-0000-0000-000000000004',
    title: 'The Cruel Prince',
    author: 'Holly Black',
    description: 'Jude was seven when her parents were murdered and she and her two sisters were stolen away to live in the treacherous High Court of Faerie. Ten years later, Jude wants nothing more than to belong there, despite her mortality.',
    cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1587166586i/26032825.jpg',
    amazon_affiliate_link: 'https://www.amazon.com/dp/0316310271?tag=booklove-20',
    genre: 'Fantasy',
    sub_genres: ['Romantasy', 'Fae', 'Dark Romance'],
    spice_level: 2,
    mature_themes: true,
    content_tags: ['enemies-to-lovers', 'fae', 'morally-gray', 'political-intrigue'],
    series_name: 'The Folk of the Air',
    series_order: 1,
    is_published: true,
  },
  {
    id: 'b1000000-0000-0000-0000-000000000005',
    title: 'Kingdom of the Wicked',
    author: 'Kerri Maniscalco',
    description: 'Emilia and her twin sister Vittoria are streghe – witches who live secretly among humans. When Vittoria is murdered, Emilia sets out to find the killer and unwittingly summons one of the Wicked – princes of Hell.',
    cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1587163930i/52379947.jpg',
    amazon_affiliate_link: 'https://www.amazon.com/dp/0316428442?tag=booklove-20',
    genre: 'Fantasy',
    sub_genres: ['Romantasy', 'Witches', 'Demons'],
    spice_level: 2,
    mature_themes: true,
    content_tags: ['enemies-to-lovers', 'demons', 'witches', 'revenge'],
    series_name: 'Kingdom of the Wicked',
    series_order: 1,
    is_published: true,
  },
];

const characters = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    book_id: 'b1000000-0000-0000-0000-000000000001',
    name: 'Rhysand',
    gender: 'male',
    traits: ['mysterious', 'protective', 'powerful', 'witty', 'devoted'],
    hobbies: ['stargazing', 'flying', 'reading', 'ruling the Night Court'],
    occupation: 'High Lord of the Night Court',
    prompts: [
      { prompt: 'The way to my heart is', answer: 'Through loyalty and a sharp wit. Also, I have a weakness for anyone who can match my sarcasm.' },
      { prompt: 'My ideal first date', answer: 'Flying over Velaris at sunset, followed by dinner at my favorite restaurant overlooking the Sidra. I promise the view is worth the vertigo.' },
      { prompt: "I'm looking for someone who", answer: 'Sees beyond the mask I show the world. Someone fierce, brave, and willing to fight beside me—not behind me.' },
    ],
    profile_image_url: null,
    is_published: true,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    book_id: 'b1000000-0000-0000-0000-000000000001',
    name: 'Cassian',
    gender: 'male',
    traits: ['loyal', 'fierce', 'protective', 'playful', 'brave'],
    hobbies: ['training', 'sparring', 'flying', 'teasing friends'],
    occupation: 'General of the Night Court Armies',
    prompts: [
      { prompt: 'A typical Sunday for me', answer: "Training until my muscles scream, then convincing my brothers to spar with me. Winner buys drinks at Rita's." },
      { prompt: 'My love language is', answer: "Acts of service. I'll fight your battles, carry your burdens, and always—always—have your back. Also, quality time. Preferably sparring." },
      { prompt: "I'll know it's love when", answer: "I'd give up my wings for her. And trust me, that's not something I say lightly." },
    ],
    profile_image_url: null,
    is_published: true,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    book_id: 'b1000000-0000-0000-0000-000000000002',
    name: 'Xaden Riorson',
    gender: 'male',
    traits: ['brooding', 'protective', 'secretive', 'intense', 'loyal'],
    hobbies: ['dragon riding', 'combat training', 'keeping secrets', 'shadow wielding'],
    occupation: 'Wingleader & Dragon Rider',
    prompts: [
      { prompt: 'My biggest green flag', answer: "I'll always come for you. Always. Even when you tell me not to. Especially when you tell me not to." },
      { prompt: "The thing I'm most passionate about", answer: 'Protecting the people I love, even if they hate me for it. Some secrets are worth keeping if it means keeping you safe.' },
      { prompt: 'You should NOT go out with me if', answer: "You can't handle a little danger. Or a lot of danger. My life comes with shadows, dragons, and a target on my back." },
    ],
    profile_image_url: null,
    is_published: true,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    book_id: 'b1000000-0000-0000-0000-000000000003',
    name: 'Hawke',
    gender: 'male',
    traits: ['charming', 'dangerous', 'devoted', 'possessive', 'patient'],
    hobbies: ['combat training', 'reading', 'horseback riding', 'making you blush'],
    occupation: 'Royal Guard',
    prompts: [
      { prompt: 'My idea of romance', answer: "Stolen moments in dark alcoves. Whispered secrets. Fighting anyone who dares to threaten what's mine." },
      { prompt: "I'll brag about you to my friends by saying", answer: "She's brave, fierce, and completely unaware of how powerful she truly is. Also, she has a habit of stabbing me, and I find it oddly endearing." },
      { prompt: 'The quickest way to my heart', answer: "Be yourself. I've waited a very, very long time to find you. I'm not interested in masks or pretense. Just you." },
    ],
    profile_image_url: null,
    is_published: true,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    book_id: 'b1000000-0000-0000-0000-000000000004',
    name: 'Cardan Greenbriar',
    gender: 'male',
    traits: ['cruel', 'vulnerable', 'beautiful', 'dramatic', 'obsessive'],
    hobbies: ['drinking wine', 'poetry', 'scheming', 'dramatic entrances'],
    occupation: 'High King of Elfhame',
    prompts: [
      { prompt: "I'm actually a softie when it comes to", answer: 'Her. Only her. Everyone else can burn, but she... she is my undoing and my salvation.' },
      { prompt: 'My most controversial opinion', answer: "Cruelty is just honesty without the pretty wrapping. At least when I'm awful, you know exactly where you stand." },
      { prompt: "The one thing I'd change about myself", answer: 'The way I hurt her before I understood what she meant to me. I have a lifetime of making amends, and I intend to use every moment.' },
    ],
    profile_image_url: null,
    is_published: true,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000006',
    book_id: 'b1000000-0000-0000-0000-000000000005',
    name: 'Wrath',
    gender: 'male',
    traits: ['commanding', 'protective', 'intense', 'patient', 'devoted'],
    hobbies: ['brooding', 'strategic planning', 'cooking', 'collecting rare artifacts'],
    occupation: 'Prince of Hell',
    prompts: [
      { prompt: "Don't be intimidated by", answer: "The horns. Or the throne in Hell. Or the fact that I'm the physical embodiment of wrath. I can be... surprisingly gentle." },
      { prompt: 'My perfect night in', answer: 'Cooking you an elaborate dinner while you tell me about your day. Then plotting revenge against your enemies together.' },
      { prompt: "I'm weirdly attracted to", answer: 'Stubborn witches who threaten me with amulets and refuse to back down. Your fury is intoxicating.' },
    ],
    profile_image_url: null,
    is_published: true,
  },
];

async function seed() {
  console.log('🌱 Starting seed...\n');

  // Clear existing data
  console.log('Clearing existing data...');
  await supabase.from('user_read_books').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('user_passes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('user_matches').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('characters').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('books').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Insert books
  console.log('Inserting books...');
  const { error: booksError } = await supabase.from('books').insert(books);
  if (booksError) {
    console.error('Error inserting books:', booksError);
    process.exit(1);
  }
  console.log(`✓ Inserted ${books.length} books`);

  // Insert characters
  console.log('Inserting characters...');
  const { error: charsError } = await supabase.from('characters').insert(characters);
  if (charsError) {
    console.error('Error inserting characters:', charsError);
    process.exit(1);
  }
  console.log(`✓ Inserted ${characters.length} characters`);

  // Verify
  const { data: bookCount } = await supabase.from('books').select('id', { count: 'exact' });
  const { data: charCount } = await supabase.from('characters').select('id', { count: 'exact' });

  console.log('\n✅ Seed complete!');
  console.log(`   Books: ${bookCount?.length}`);
  console.log(`   Characters: ${charCount?.length}`);
}

seed().catch(console.error);
