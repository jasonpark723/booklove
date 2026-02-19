-- BookLove Seed Data
-- Popular Fantasy/Romantasy Books with Character Profiles
-- Run with: supabase db execute --file supabase/seed.sql

-- Clear existing data (optional - comment out if you want to append)
TRUNCATE user_read_books, user_passes, user_matches, characters, books CASCADE;

-- ============================================
-- BOOKS
-- ============================================

INSERT INTO books (id, title, author, description, cover_image_url, amazon_affiliate_link, genre, tags, spice_level, mature_themes, series_name, series_order, is_published)
VALUES
  -- A Court of Thorns and Roses
  (
    'b1000000-0000-0000-0000-000000000001',
    'A Court of Thorns and Roses',
    'Sarah J. Maas',
    'When nineteen-year-old huntress Feyre kills a wolf in the woods, a terrifying creature arrives to demand retribution. Dragged to a treacherous magical land she knows about only from legends, Feyre discovers that her captor is not truly a beast, but one of the lethal, immortal faeries who once ruled her world.',
    'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg',
    'https://www.amazon.com/dp/1635575567?tag=booklove-20',
    'Fantasy',
    ARRAY['enemies-to-lovers', 'fae', 'slow-burn', 'found-family'],
    3,
    true,
    'A Court of Thorns and Roses',
    1,
    true
  ),
  -- Fourth Wing
  (
    'b1000000-0000-0000-0000-000000000002',
    'Fourth Wing',
    'Rebecca Yarros',
    'Twenty-year-old Violet Sorrengail was supposed to enter the Scribe Quadrant, but her commanding general mother has other plans. Violet must join the hundreds of candidates striving to become elite dragon riders.',
    'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1701980900i/61431922.jpg',
    'https://www.amazon.com/dp/1649374046?tag=booklove-20',
    'Fantasy',
    ARRAY['enemies-to-lovers', 'dragons', 'military-academy', 'forced-proximity'],
    3,
    true,
    'The Empyrean',
    1,
    true
  ),
  -- From Blood and Ash
  (
    'b1000000-0000-0000-0000-000000000003',
    'From Blood and Ash',
    'Jennifer L. Armentrout',
    'Chosen from birth to usher in a new era, Poppy''s life has never been her own. The life of the Maiden is solitary. But when Hawke, a golden-eyed guard honor-bound to protect her, enters her life, destiny and duty become tangled.',
    'https://m.media-amazon.com/images/I/719C-isEuzL._AC_UF1000,1000_QL80_.jpg',
    'https://www.amazon.com/dp/1952457009?tag=booklove-20',
    'Fantasy',
    ARRAY['forbidden-love', 'hidden-identity', 'slow-burn', 'protective-hero'],
    3,
    true,
    'Blood and Ash',
    1,
    true
  ),
  -- The Cruel Prince
  (
    'b1000000-0000-0000-0000-000000000004',
    'The Cruel Prince',
    'Holly Black',
    'Jude was seven when her parents were murdered and she and her two sisters were stolen away to live in the treacherous High Court of Faerie. Ten years later, Jude wants nothing more than to belong there, despite her mortality.',
    'https://m.media-amazon.com/images/I/91ZL7X6tReL._SY445_SX342_FMwebp_.jpg',
    'https://www.amazon.com/dp/0316310271?tag=booklove-20',
    'Fantasy',
    ARRAY['enemies-to-lovers', 'fae', 'morally-gray', 'political-intrigue'],
    2,
    true,
    'The Folk of the Air',
    1,
    true
  ),
  -- Kingdom of the Wicked
  (
    'b1000000-0000-0000-0000-000000000005',
    'Kingdom of the Wicked',
    'Kerri Maniscalco',
    'Emilia and her twin sister Vittoria are streghe – witches who live secretly among humans. When Vittoria is murdered, Emilia sets out to find the killer and unwittingly summons one of the Wicked – princes of Hell.',
    'https://m.media-amazon.com/images/I/81MtcJlSRiL._SL1500_.jpg',
    NULL,
    'Fantasy',
    ARRAY['enemies-to-lovers', 'demons', 'witches', 'revenge'],
    2,
    true,
    'Kingdom of the Wicked',
    1,
    true
  );

-- ============================================
-- CHARACTERS
-- ============================================

INSERT INTO characters (id, book_id, name, gender, traits, hobbies, occupation, prompts, profile_image_url, is_published)
VALUES
  -- ACOTAR: Rhysand
  (
    'c1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'Rhysand',
    'male',
    ARRAY['mysterious', 'protective', 'powerful', 'witty', 'devoted'],
    ARRAY['stargazing', 'flying', 'reading', 'ruling the Night Court'],
    'High Lord of the Night Court',
    '[
      {"prompt": "The way to my heart is", "answer": "Through loyalty and a sharp wit. Also, I have a weakness for anyone who can match my sarcasm."},
      {"prompt": "My ideal first date", "answer": "Flying over Velaris at sunset, followed by dinner at my favorite restaurant overlooking the Sidra. I promise the view is worth the vertigo."},
      {"prompt": "I''m looking for someone who", "answer": "Sees beyond the mask I show the world. Someone fierce, brave, and willing to fight beside me—not behind me."}
    ]'::jsonb,
    'https://i.pinimg.com/564x/8c/5e/5e/8c5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e.jpg',
    true
  ),
  -- ACOTAR: Cassian
  (
    'c1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'Cassian',
    'male',
    ARRAY['loyal', 'fierce', 'protective', 'playful', 'brave'],
    ARRAY['training', 'sparring', 'flying', 'teasing friends'],
    'General of the Night Court Armies',
    '[
      {"prompt": "A typical Sunday for me", "answer": "Training until my muscles scream, then convincing my brothers to spar with me. Winner buys drinks at Rita''s."},
      {"prompt": "My love language is", "answer": "Acts of service. I''ll fight your battles, carry your burdens, and always—always—have your back. Also, quality time. Preferably sparring."},
      {"prompt": "I''ll know it''s love when", "answer": "I''d give up my wings for her. And trust me, that''s not something I say lightly."}
    ]'::jsonb,
    'https://i.pinimg.com/564x/7c/4e/4e/7c4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e.jpg',
    true
  ),
  -- Fourth Wing: Xaden Riorson
  (
    'c1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000002',
    'Xaden Riorson',
    'male',
    ARRAY['brooding', 'protective', 'secretive', 'intense', 'loyal'],
    ARRAY['dragon riding', 'combat training', 'keeping secrets', 'shadow wielding'],
    'Wingleader & Dragon Rider',
    '[
      {"prompt": "My biggest green flag", "answer": "I''ll always come for you. Always. Even when you tell me not to. Especially when you tell me not to."},
      {"prompt": "The thing I''m most passionate about", "answer": "Protecting the people I love, even if they hate me for it. Some secrets are worth keeping if it means keeping you safe."},
      {"prompt": "You should NOT go out with me if", "answer": "You can''t handle a little danger. Or a lot of danger. My life comes with shadows, dragons, and a target on my back."}
    ]'::jsonb,
    'https://i.pinimg.com/564x/6d/3e/3e/6d3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e.jpg',
    true
  ),
  -- From Blood and Ash: Hawke/Casteel
  (
    'c1000000-0000-0000-0000-000000000004',
    'b1000000-0000-0000-0000-000000000003',
    'Hawke',
    'male',
    ARRAY['charming', 'dangerous', 'devoted', 'possessive', 'patient'],
    ARRAY['combat training', 'reading', 'horseback riding', 'making you blush'],
    'Royal Guard',
    '[
      {"prompt": "My idea of romance", "answer": "Stolen moments in dark alcoves. Whispered secrets. Fighting anyone who dares to threaten what''s mine."},
      {"prompt": "I''ll brag about you to my friends by saying", "answer": "She''s brave, fierce, and completely unaware of how powerful she truly is. Also, she has a habit of stabbing me, and I find it oddly endearing."},
      {"prompt": "The quickest way to my heart", "answer": "Be yourself. I''ve waited a very, very long time to find you. I''m not interested in masks or pretense. Just you."}
    ]'::jsonb,
    'https://i.pinimg.com/564x/5c/2e/2e/5c2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e.jpg',
    true
  ),
  -- The Cruel Prince: Cardan
  (
    'c1000000-0000-0000-0000-000000000005',
    'b1000000-0000-0000-0000-000000000004',
    'Cardan Greenbriar',
    'male',
    ARRAY['cruel', 'vulnerable', 'beautiful', 'dramatic', 'obsessive'],
    ARRAY['drinking wine', 'poetry', 'scheming', 'dramatic entrances'],
    'High King of Elfhame',
    '[
      {"prompt": "I''m actually a softie when it comes to", "answer": "Her. Only her. Everyone else can burn, but she... she is my undoing and my salvation."},
      {"prompt": "My most controversial opinion", "answer": "Cruelty is just honesty without the pretty wrapping. At least when I''m awful, you know exactly where you stand."},
      {"prompt": "The one thing I''d change about myself", "answer": "The way I hurt her before I understood what she meant to me. I have a lifetime of making amends, and I intend to use every moment."}
    ]'::jsonb,
    'https://i.pinimg.com/564x/4b/1e/1e/4b1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e.jpg',
    true
  ),
  -- Kingdom of the Wicked: Wrath
  (
    'c1000000-0000-0000-0000-000000000006',
    'b1000000-0000-0000-0000-000000000005',
    'Wrath',
    'male',
    ARRAY['commanding', 'protective', 'intense', 'patient', 'devoted'],
    ARRAY['brooding', 'strategic planning', 'cooking', 'collecting rare artifacts'],
    'Prince of Hell',
    '[
      {"prompt": "Don''t be intimidated by", "answer": "The horns. Or the throne in Hell. Or the fact that I''m the physical embodiment of wrath. I can be... surprisingly gentle."},
      {"prompt": "My perfect night in", "answer": "Cooking you an elaborate dinner while you tell me about your day. Then plotting revenge against your enemies together."},
      {"prompt": "I''m weirdly attracted to", "answer": "Stubborn witches who threaten me with amulets and refuse to back down. Your fury is intoxicating."}
    ]'::jsonb,
    'https://i.pinimg.com/564x/3a/0e/0e/3a0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e.jpg',
    true
  );

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify the seed data:
-- SELECT b.title, c.name, c.occupation FROM books b JOIN characters c ON b.id = c.book_id ORDER BY b.title;
