# BookLove - Requirements Document

Generated: 2026-02-19
Last Updated: 2026-02-19

## 1. Executive Summary

- **Project Name:** BookLove
- **Problem Statement:** Book readers struggle to discover their next read without encountering spoilers or going in blind. Existing solutions (Goodreads, BookTok, recommendations) often reveal too much about the plot or provide insufficient information to make a decision.
- **Solution:** A dating app-style experience where users swipe on male book characters presented as dating profiles (Hinge/Tinder style). Characters are introduced through personality traits, hobbies, and prompts—without plot spoilers. When users "match" with a character, the book is revealed with a purchase link.
- **Target Users:** Female book readers interested in fantasy (expandable to romance and other genres)
- **Success Criteria:** User acquisition (100 users), affiliate link conversion rate, revenue generation

## 2. User Personas

### Primary: The Reader

- **Role:** Core user discovering books
- **Demographics:** Female, any age, casual to heavy reader
- **Goals:**
  - Find their next book to read without spoilers
  - Enjoy a fun, gamified discovery experience
  - Connect with characters before committing to a book
- **Pain Points:**
  - Reviews and recommendations often contain spoilers
  - Going in blind leads to abandoned books
  - Overwhelmed by choice
- **Technical Level:** Comfortable with mobile apps, familiar with dating app mechanics
- **Access:** Mobile-first (iOS/Android browser), occasional desktop

### Secondary: Admin (You)

- **Role:** Content curator, platform manager
- **Goals:**
  - Add and manage character profiles
  - Monitor affiliate performance
  - Curate quality content
- **Technical Level:** Fullstack developer

### Future: Content Contributor (Post-MVP, Maybe)

- **Role:** Community member submitting character profiles
- **Goals:** Share favorite characters, gain recognition
- **Technical Level:** Basic (form submission)
- **Note:** May not implement this feature

## 3. Feature Requirements

### MVP (Must Have)

| Feature | Description | User Story | Priority |
|---------|-------------|------------|----------|
| Swipe Interface | Tinder-style card swiping (right = like, left = pass) | As a reader, I want to swipe through characters so I can quickly browse options | P0 |
| Character Profiles | Name, traits, hobbies, occupation, Hinge-style prompts, vibe image (no face) | As a reader, I want to see character personality without spoilers so I can judge interest | P0 |
| Book Reveal | On match, show book cover, title, description, Amazon affiliate link | As a reader, I want to discover which book the character is from so I can purchase it | P0 |
| Genre Filter | Filter characters by fantasy sub-genre | As a reader, I want to filter by sub-genre so I see relevant characters | P0 |
| Content Tags | Spice level (0-3), mature themes indicators | As a reader, I want to know content intensity so I can choose appropriately | P0 |
| Saved Matches (Chat Log) | List of matched characters/books | As a reader, I want to save my matches so I can revisit them later | P0 |
| Pass Pile (name TBD: "The Slow Burn Shelf" or "The Maybe Pile") | Pile of passed characters that can be revisited | As a reader, I want to revisit passed characters so nothing is permanently lost | P0 |
| "Already Read" Action | In pass pile, remove book + all its characters from pool | As a reader, I want to mark books I've read so I don't see those characters again | P0 |
| Optional Account | Email/password auth to save progress, prevent repeat profiles | As a reader, I want to optionally create an account so my progress is saved | P1 |
| Admin Panel | CRUD for books and character profiles | As an admin, I want to manage content so I can curate the experience | P0 |
| Amazon Affiliate Links | Properly formatted affiliate links for each book | As the owner, I want affiliate links so I can monetize the platform | P0 |

### Post-MVP

| Feature | Description | Target Phase |
|---------|-------------|--------------|
| Browse by Book | Search/browse books directly, then see characters | v1.0 |
| Improved Filtering | More granular filters (tropes, spice level, etc.) | v1.0 |
| "Did You Like It?" Feedback | After marking "already read," capture rating for future recommendations | v1.0 |
| Personalized Recommendations | Use feedback to improve character suggestions | v1.0 |
| AI Character Chat | Chat with characters trained on book excerpts (with IP considerations) | v2.0 |
| Content Contributors | User submissions with approval workflow | v2.0 (maybe) |
| Genre Expansion | Romance, dark romance, paranormal, etc. | v1.0+ |

## 4. User Workflows

### Workflow 1: First-Time Discovery

1. User lands on BookLove homepage
2. Taps "Get Started"
3. **Onboarding**: Selects preferences (genres + spicy) in single multi-select step
4. Sees first character card (name, traits, hobbies, occupation, prompts, vibe image)
5. Swipes right (interested) → Book reveal appears (cover, title, description, content tags, affiliate link)
6. User can: Purchase on Amazon | Save to Chat Log | Continue Swiping
7. Swipes left (not interested) → Character goes to Pass Pile
8. Continues swiping through characters

### Workflow 2: Revisiting Passed Characters

1. User opens Pass Pile (name TBD) from bottom nav
2. Browses previously passed characters
3. Can swipe right to match (reveals book)
4. Can tap "Already Read" to remove book from read pool (characters from same book/series still visible for fun browsing)

### Workflow 3: Viewing Saved Matches

1. User opens Chat Log from bottom nav
2. Sees list of matched characters with book info
3. Can tap to view book details and Amazon link
4. Can remove matches from list

### Workflow 4: Account Creation

1. User taps Profile in bottom nav
2. Prompted to create account (email/password)
3. On signup, localStorage data migrates to database
4. On return visit, can log in to restore matches, bootycall list, and preferences

### Workflow 5: Admin Content Management

1. Admin logs into admin panel
2. Creates/edits books (title, author, cover, description, affiliate link, genre, content tags)
3. Creates/edits characters linked to books (name, traits, prompts, image)
4. For series: links character to first book in series
5. Publishes content to make it visible to users

### Workflow 6: Reset Passed Characters

1. User has swiped through all available characters
2. System shows "No more characters" with option to reset
3. Reset clears passed characters (Pass Pile) back to pool
4. Matched characters remain in Chat Log and are NOT shown again
5. User can continue swiping on previously passed characters

## 5. Data Model

### Entities

**Book**
- id: UUID (primary key)
- title: string (required)
- author: string (required)
- description: text
- cover_image_url: string
- amazon_affiliate_link: string (required)
- genre: string (broad, e.g., "Fantasy")
- sub_genres: string[] (e.g., ["Romantasy", "Epic Fantasy"])
- spice_level: integer (0-3, see Spice Level Scale below)
- mature_themes: boolean
- content_tags: string[] (tropes, themes)
- series_name: string (nullable)
- series_order: integer (nullable)
- is_published: boolean (default false)
- created_at: timestamp
- updated_at: timestamp

**Spice Level Scale**
| Level | Label | Description |
|-------|-------|-------------|
| 0 | Clean | No spicy content, fade to black or less |
| 1 | Mild | Light steam, closed door with tension |
| 2 | Moderate | Open door, some explicit scenes |
| 3 | Spicy | Explicit content throughout |

**Character**
- id: UUID (primary key)
- book_id: UUID (foreign key → Book, required, NOT NULL)
- name: string (required)
- gender: string (default 'male', enum: male/female/non-binary/other)
- traits: string[] (e.g., ["Mysterious", "Protective", "Witty"])
- hobbies: string[]
- occupation: string
- prompts: object[] (e.g., [{ prompt: "The way to win me over is...", answer: "..." }])
- images: object[] (e.g., [{ url: "...", is_primary: true, sort_order: 0 }]) - 1 primary + up to 2 additional images, uploaded to Supabase Storage
- is_published: boolean (default false)
- is_deleted: boolean (default false) - soft delete flag
- deleted_at: timestamp (nullable) - when soft deleted
- created_at: timestamp
- updated_at: timestamp

**User Profile** (extends Supabase auth.users)
- id: UUID (primary key, references auth.users)
- genre_preferences: string[]
- prefers_spicy: boolean (null = no preference)
- is_admin: boolean (default false)
- created_at: timestamp
- updated_at: timestamp

> **Note:** Email is NOT stored in user_profiles. Access via auth.users join to avoid duplication.

**UserMatch** (saved matches / chat log)
- id: UUID (primary key)
- user_id: UUID (foreign key → User)
- character_id: UUID (foreign key → Character)
- created_at: timestamp
- UNIQUE(user_id, character_id)

**UserPass** (bootycall section)
- id: UUID (primary key)
- user_id: UUID (foreign key → User)
- character_id: UUID (foreign key → Character)
- created_at: timestamp
- UNIQUE(user_id, character_id)

**UserReadBook** (already read, for user reference)
- id: UUID (primary key)
- user_id: UUID (foreign key → User)
- book_id: UUID (foreign key → Book)
- created_at: timestamp
- UNIQUE(user_id, book_id)

### Guest User State (localStorage)

For users without accounts, state is stored in browser localStorage:

```typescript
interface GuestState {
  visitorId: string;              // Generated UUID for this browser
  genrePreferences: string[];     // Selected genre tags
  prefersSpicy: boolean | null;   // null = no preference
  matchedCharacterIds: string[];  // Swiped right → Chat Log
  passedCharacterIds: string[];   // Swiped left → Bootycall
  readBookIds: string[];          // Marked as already read
  currentCharacterId: string | null; // Character user was viewing (for resume)
  lastVisit: string;              // ISO timestamp for "welcome back"
}
```

**Key Design Decision:** We do NOT track "seen" characters separately. A character is only considered "seen" when the user actually swipes on it (matched or passed). Characters that were pre-fetched but not swiped on are not tracked - if the user leaves and returns, they may see those characters again, which is acceptable behavior.

**Behavior:**
- Data persists until browser data is cleared
- Private/Incognito: Data lost on browser close (accepted limitation)
- On account creation: localStorage data migrates to database, then cleared
- On return visit: Resume from `currentCharacterId` if available

### Data Requirements

- **Storage:** Supabase (PostgreSQL)
- **Privacy:** Privacy policy required (see Section 10 - Legal & Compliance)
- **Retention:** Indefinite for user accounts; users can delete account
- **Deletion:** Users can request full data deletion via Profile settings
- **Anonymous users:** Store state in localStorage until account creation

## 6. Matching Algorithm

### Overview

Characters are shown semi-randomly with priority given to user preferences. This mimics dating app matching while ensuring variety and discovery.

### Algorithm: Batched Weighted Selection

**Ratio:** 70% preferred / 30% discovery

For each batch of 10 characters:
- 7 characters from preferred genres/spice level (random selection)
- 3 characters from other genres (random discovery)
- Shuffle the 10 together

### Preference Matching

**Genre matching:**
- User selects genre preferences in onboarding
- Characters from books matching those genres are prioritized
- No preferences = pure random selection (all genres equal)

**Spice matching (soft filter):**
- If user prefers spicy: prioritize characters from books with spice_level >= 2
- If user prefers non-spicy: prioritize characters from books with spice_level <= 1
- No preference: show all spice levels equally
- This is a SOFT preference, not a hard filter - users still see variety

### Exclusion Rules

Characters are excluded from the fetch if:
1. Character is in user's `matchedCharacterIds` (already matched/swiped right)
2. Character is in user's `passedCharacterIds` (already passed/swiped left)
3. Character's `is_published` = false
4. Character's book `is_published` = false

**Note:** Characters from "already read" books are NOT excluded. Users may want to see other character profiles from books they've read for fun.

**Note:** We do NOT track "seen" separately. A character is only excluded once the user actually swipes on it. Pre-fetched characters that weren't swiped on may reappear on the next session - this is intentional and acceptable UX.

### Pre-fetching Strategy

To ensure smooth swiping without loading delays:

```
Initial load: Fetch 10 characters into pool (React state)
User swipes through pool...
When user reaches index 7 (threshold):
  → Background fetch next 10 characters
  → Exclude: [...matchedCharacterIds, ...passedCharacterIds, ...currentPoolIds]
  → Append to pool
User never waits for loading
```

The pool exists only in React state (not persisted). On page refresh or return visit:
- Matched/passed characters are restored from localStorage
- A fresh pool is fetched (excluding matched + passed)
- `currentCharacterId` is used to resume if available

### Resume on Return

When user returns to the app:
1. Check `currentCharacterId` in localStorage
2. If exists and character is still published:
   - Fetch that character first
   - Place at front of new pool
   - User resumes where they left off
3. If not available (deleted/unpublished):
   - Start with fresh pool

### Reset Behavior

When user has swiped through all available characters:
1. Show "No more characters" message
2. Offer "Reset & Discover Again" option
3. On reset:
   - Clear `passedCharacterIds` (Pass Pile emptied)
   - Keep `matchedCharacterIds` intact (Chat Log preserved)
   - Clear `currentCharacterId`
   - Matched characters still excluded from new pool
4. User can re-swipe on previously passed characters

## 7. Technical Architecture

### Recommended Stack

- **Frontend:** Next.js (React)
- **Backend:** Next.js API routes
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Hosting:** Netlify (free tier, commercial use allowed)
- **Key Libraries:**
  - react-tinder-card or similar for swipe animations
  - Tailwind CSS for styling
  - Supabase JS client

### Integrations

- [x] Supabase (database + auth)
- [x] Amazon Associates (affiliate links - manual)
- [ ] Analytics (TBD - consider Plausible, PostHog, or Vercel Analytics)

### Non-Functional Requirements

- **Performance:** Fast swipe interactions, images optimized for mobile, pre-fetching for seamless experience
- **Scalability:** 100 users initially, Supabase free tier sufficient
- **Security:** Supabase RLS for data access, secure auth, no sensitive data exposed
- **SEO:** Basic meta tags, but primary access is direct/social (not search)

## 8. Design Requirements

- **Style:** Hybrid Tinder/Hinge - simple, clean, prompt-focused
- **Aesthetic:** TBD (to be determined in prototype/wireframe phase)
- **Colors:** TBD
- **Responsive:** Mobile-first (iPhone/Android), desktop secondary
- **Accessibility:** TBD (baseline: readable fonts, sufficient contrast)
- **UI Patterns:**
  - Swipe animations on cards
  - Bottom navigation: Discover | Chat Log | Pass Pile (name TBD) | Profile
  - Card-based character profiles (exact layout TBD in prototyping)
- **References:** Tinder (simplicity, swipe UX), Hinge (prompt-focused profiles)

### Onboarding Flow

Single-step preference selection after "Get Started":

```
┌─────────────────────────────────────┐
│  What are you in the mood for?      │
│                                     │
│  [Fantasy] [Romantasy] [Dark]       │
│  [Sci-Fi] [Paranormal] [Horror]     │
│  [🌶️ Spicy]                         │
│                                     │
│  Select all that apply, or skip     │
│  to see everything                  │
│                                     │
│         [ Start Swiping ]           │
│         [ Skip for now ]            │
└─────────────────────────────────────┘
```

- Genre tags and "Spicy" are all selectable chips
- Multi-select allowed
- Skip = no preferences = random selection
- Preferences can be changed later in Profile

### Sign-up Prompting

- **First prompt:** After 3 matches
- **Message:** "You've got 3 matches! Sign up to save them forever"
- **Frequency:** Once after first 3 matches (TBD for additional prompts)
- **Style:** Dismissible modal with "Maybe later" option

## 9. Project Phases

### Phase 1: MVP

**Scope:**
- Swipe interface with character cards
- Character profiles (name, traits, hobbies, occupation, prompts, image)
- Book reveal on match
- Genre filter (broad fantasy)
- Content tags (spice level 0-3, mature themes)
- Saved matches (Chat Log)
- Pass Pile (name TBD: "The Slow Burn Shelf" or "The Maybe Pile") with "Already Read" action
- Optional user accounts
- Guest state persistence (localStorage)
- Admin panel for content management
- Amazon affiliate links
- 20 books, ~30-50 characters

**Target:** When ready (no hard deadline)

### Phase 2: v1.0 Enhancement

**Scope:**
- Browse by book option
- Improved filtering (tropes, spice level, etc.)
- "Did you like it?" feedback on already-read books
- Personalized recommendations based on feedback
- Genre expansion (romance, paranormal, etc.)

**Target:** Post-MVP based on user feedback

### Phase 3: v2.0 Advanced Features

**Scope:**
- AI character chat (trained on book excerpts)
- Content contributor submissions with approval workflow (maybe)

**Target:** After validating core concept

## 10. Open Questions

- [x] **Character images:** Stock photos with POV/aesthetic shots (no faces). Free, legally safe, can upgrade later if too generic. **DECIDED**
- [x] **IP/Copyright:** Low risk - transformative use, promotes sales. Add disclaimer + DMCA removal process. **DECIDED** (see Section 11)
- [ ] **AI Chat IP concerns:** If implementing AI character chat, need to understand copyright implications of training on book excerpts. (Post-MVP)
- [x] **Data privacy policy:** Use free generator (Termly/Iubenda) before launch. **DECIDED** (see Section 11)
- [ ] **User acquisition strategy:** How to get first 100 users? BookTok, Reddit, book clubs?
- [ ] **Analytics setup:** Which tool to use for tracking conversions and user behavior?
- [ ] **Content contributor model:** If added later, who owns submitted content? Can they remove it?
- [x] **Matching algorithm:** 70/30 weighted random with genre priority. **DECIDED**
- [x] **Guest user state:** localStorage with migration on signup. **DECIDED**
- [x] **Spice level scale:** 0-3 (clean/mild/moderate/spicy). **DECIDED**
- [x] **Sign-up prompting:** After 3 matches, once for now. **DECIDED**
- [x] **Seen vs swiped tracking:** Only track matched/passed (actual swipes), not "seen". Pre-fetched but unswiped characters may reappear. **DECIDED**
- [x] **Resume on return:** Store `currentCharacterId` in localStorage to resume where user left off. **DECIDED**
- [ ] **Pass pile naming:** "The Slow Burn Shelf" or "The Maybe Pile" - TBD

## 11. Legal & Compliance

### IP/Copyright Strategy

**Risk Assessment:** Low risk - BookLove is transformative (dating profile format), promotes book sales, and uses minimal content (names/traits, no plot/text).

**Required Disclaimer (site footer):**
> "BookLove is a fan-made book discovery platform. All characters belong to their respective authors and publishers. We are not affiliated with any publishers. BookLove is intended to help readers discover new books."

**DMCA/Removal Process:**
- Provide contact email for takedown requests
- Respond to any author/publisher removal request within 48 hours
- Remove requested content immediately, no questions asked
- Document all requests and responses

**Best Practices:**
- Keep character profiles as original interpretations, not direct book quotes
- Focus on personality traits, not plot details
- Frame as book promotion/discovery tool

### Privacy Policy Requirements

**Data Collected:**
- Email address (optional accounts)
- Genre preferences
- Match/pass history
- Usage analytics (if implemented)

**Privacy Policy Must Include:**
1. What data is collected and why
2. How data is stored (Supabase)
3. Third-party services (Supabase, Netlify, Amazon affiliate)
4. User rights (view, export, delete data)
5. Cookie usage (if any)
6. Contact information for privacy concerns
7. GDPR rights for EU users
8. CCPA rights for California users

**Implementation:**
- Use free generator: [Termly](https://termly.io) or [Iubenda](https://www.iubenda.com)
- Add privacy policy link in footer
- Add cookie consent banner if using analytics
- Implement account deletion in Profile section

### Pre-Launch Compliance Checklist

- [ ] Add disclaimer to site footer
- [ ] Create contact email for legal/DMCA requests
- [ ] Generate privacy policy using Termly/Iubenda
- [ ] Add privacy policy page and footer link
- [ ] Add cookie consent banner (if using analytics)
- [ ] Implement "Delete my account" feature in Profile
- [ ] Sign up for Amazon Associates program
- [ ] Test affiliate links are working

## 12. Out of Scope

Items explicitly NOT included in this project:

- Native mobile apps (iOS/Android) - web only for MVP
- Social features (following users, sharing profiles publicly)
- User reviews or ratings of books
- Direct book purchasing (redirect to Amazon only)
- Multiple affiliate programs (Amazon only for MVP)
- Internationalization / multiple languages
- Audio book or e-book format filtering
- Author accounts or publisher partnerships (MVP)
- Paid tiers or premium features (free only, affiliate monetization)
