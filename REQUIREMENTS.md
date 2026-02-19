# BookLove - Requirements Document

Generated: 2026-02-19

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
| Content Tags | Spice level, mature themes indicators | As a reader, I want to know content intensity so I can choose appropriately | P0 |
| Saved Matches (Chat Log) | List of matched characters/books | As a reader, I want to save my matches so I can revisit them later | P0 |
| Bootycall Section | Pile of passed characters that can be revisited | As a reader, I want to revisit passed characters so nothing is permanently lost | P0 |
| "Already Read" Action | In bootycall section, remove book + all its characters from pool | As a reader, I want to mark books I've read so I don't see those characters again | P0 |
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
2. Optionally sets genre preferences (or skips for all fantasy)
3. Sees first character card (name, traits, hobbies, occupation, prompts, vibe image)
4. Swipes right (interested) → Book reveal appears (cover, title, description, content tags, affiliate link)
5. User can: Purchase on Amazon | Save to Chat Log | Continue Swiping
6. Swipes left (not interested) → Character goes to Bootycall section
7. Continues swiping through characters

### Workflow 2: Revisiting Passed Characters

1. User opens Bootycall section from bottom nav
2. Browses previously passed characters
3. Can swipe right to match (reveals book)
4. Can tap "Already Read" to remove book + all its characters from pool

### Workflow 3: Viewing Saved Matches

1. User opens Chat Log from bottom nav
2. Sees list of matched characters with book info
3. Can tap to view book details and Amazon link
4. Can remove matches from list

### Workflow 4: Account Creation

1. User taps Profile in bottom nav
2. Prompted to create account (email/password)
3. On signup, progress is saved to account
4. On return visit, can log in to restore matches, bootycall list, and preferences

### Workflow 5: Admin Content Management

1. Admin logs into admin panel
2. Creates/edits books (title, author, cover, description, affiliate link, genre, content tags)
3. Creates/edits characters linked to books (name, traits, prompts, image)
4. For series: links character to first book in series
5. Publishes content to make it visible to users

## 5. Data Model

### Entities

**Book**
- id: UUID (primary key)
- title: string
- author: string
- description: text
- cover_image_url: string
- amazon_affiliate_link: string
- genre: string (broad, e.g., "Fantasy")
- sub_genre: string[] (e.g., ["Romantasy", "Epic Fantasy"])
- content_tags: object { spice_level: 1-5, mature_themes: boolean, tags: string[] }
- series_name: string (nullable)
- series_order: integer (nullable)
- created_at: timestamp
- updated_at: timestamp

**Character**
- id: UUID (primary key)
- book_id: UUID (foreign key → Book, first appearance)
- name: string
- traits: string[] (e.g., ["Mysterious", "Protective", "Witty"])
- hobbies: string[]
- occupation: string
- prompts: object[] (e.g., [{ prompt: "The way to win me over is...", answer: "..." }])
- profile_image_url: string (vibe/POV image, no face)
- created_at: timestamp
- updated_at: timestamp

**User** (optional accounts)
- id: UUID (primary key)
- email: string (unique)
- password_hash: string
- genre_preferences: string[]
- created_at: timestamp
- updated_at: timestamp

**UserMatch** (saved matches / chat log)
- id: UUID (primary key)
- user_id: UUID (foreign key → User)
- character_id: UUID (foreign key → Character)
- created_at: timestamp

**UserPass** (bootycall section)
- id: UUID (primary key)
- user_id: UUID (foreign key → User)
- character_id: UUID (foreign key → Character)
- created_at: timestamp

**UserReadBook** (already read, excluded from pool)
- id: UUID (primary key)
- user_id: UUID (foreign key → User)
- book_id: UUID (foreign key → Book)
- created_at: timestamp

### Data Requirements

- **Storage:** Supabase (PostgreSQL)
- **Privacy:** Privacy policy required (see Section 10 - Legal & Compliance)
- **Retention:** Indefinite for user accounts; users can delete account
- **Deletion:** Users can request full data deletion via Profile settings
- **Anonymous users:** Store state in localStorage until account creation

## 6. Technical Architecture

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

- **Performance:** Fast swipe interactions, images optimized for mobile
- **Scalability:** 100 users initially, Supabase free tier sufficient
- **Security:** Supabase RLS for data access, secure auth, no sensitive data exposed
- **SEO:** Basic meta tags, but primary access is direct/social (not search)

## 7. Design Requirements

- **Style:** Hybrid Tinder/Hinge - simple, clean, prompt-focused
- **Aesthetic:** TBD (to be determined in prototype/wireframe phase)
- **Colors:** TBD
- **Responsive:** Mobile-first (iPhone/Android), desktop secondary
- **Accessibility:** TBD (baseline: readable fonts, sufficient contrast)
- **UI Patterns:**
  - Swipe animations on cards
  - Bottom navigation: Discover | Chat Log | Bootycalls | Profile
  - Card-based character profiles (exact layout TBD in prototyping)
- **References:** Tinder (simplicity, swipe UX), Hinge (prompt-focused profiles)

## 8. Project Phases

### Phase 1: MVP

**Scope:**
- Swipe interface with character cards
- Character profiles (name, traits, hobbies, occupation, prompts, image)
- Book reveal on match
- Genre filter (broad fantasy)
- Content tags (spice level, mature themes)
- Saved matches (Chat Log)
- Bootycall section with "Already Read" action
- Optional user accounts
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

## 9. Open Questions

- [x] **Character images:** Stock photos with POV/aesthetic shots (no faces). Free, legally safe, can upgrade later if too generic. **DECIDED**
- [x] **IP/Copyright:** Low risk - transformative use, promotes sales. Add disclaimer + DMCA removal process. **DECIDED** (see Section 11)
- [ ] **AI Chat IP concerns:** If implementing AI character chat, need to understand copyright implications of training on book excerpts. (Post-MVP)
- [x] **Data privacy policy:** Use free generator (Termly/Iubenda) before launch. **DECIDED** (see Section 11)
- [ ] **User acquisition strategy:** How to get first 100 users? BookTok, Reddit, book clubs?
- [ ] **Analytics setup:** Which tool to use for tracking conversions and user behavior?
- [ ] **Content contributor model:** If added later, who owns submitted content? Can they remove it?

## 10. Legal & Compliance

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

## 11. Out of Scope

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
