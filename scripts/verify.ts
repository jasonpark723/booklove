import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function verify() {
  const { data, error } = await supabase
    .from('characters')
    .select('name, occupation, book:books(title, spice_level)');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('\n📚 Seeded Characters:\n');
  console.log('Name'.padEnd(20) + 'Occupation'.padEnd(35) + 'Book');
  console.log('-'.repeat(80));

  data?.forEach((c: any) => {
    const spice = '🌶️'.repeat(c.book.spice_level);
    console.log(
      c.name.padEnd(20) +
      c.occupation.padEnd(35) +
      c.book.title + ' ' + spice
    );
  });
}

verify();
