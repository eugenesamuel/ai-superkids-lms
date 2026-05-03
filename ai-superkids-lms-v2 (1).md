# AI SuperKids LMS — Full Build Instructions
### Digital Scholar | Google Antigravity Build Guide v2
### 2 Roles Only: Parent Login (Kids Access) + Admin (DS Team)

---

## 1. Project Overview

Build a Tag Mango-style Learning Management System for the AI SuperKids program by Digital Scholar. Kids ages 8 to 17 access learning through their parent's login. No separate student account. Two roles only: Parent (kid-facing learning experience) and Admin (DS team manages all content and students).

| Attribute | Value |
|---|---|
| Program | AI SuperKids by Digital Scholar |
| Audience | Kids aged 8-17, accessed through parent login |
| Roles | Parent (learning access) + Admin (DS team only) |
| Campuses | Chennai, Mumbai, Online |
| Trainer | Eugene Samuel |
| Operations | Dev |
| Founder | Rishi Jain, CEO Digital Scholar |

---

## 2. Auth and Role System

> There are only 2 roles. No separate student login. Parents log in and kids use it through the parent account.

### Role 1 — Parent (Kid-Facing Learning)

The parent creates one account at enrollment. The child uses the parent's device and login. The dashboard is designed for kids to use but the account belongs to the parent.

- Login: Email + password OR Google OAuth
- On login: land directly on the Kid Learning Dashboard (Planet Map)
- Parent can toggle to "Parent View" (progress stats, reports) from profile menu
- Kid View is the default after login — optimised for the child to use
- Parent View shows: progress %, sessions done, streak, next class, download report

### Role 2 — Admin (Digital Scholar Team Only)

Full backend control. Only accessible by DS team. Separate login route, same login page, role-based redirect.

- Manage all courses, lessons, videos, activities
- Enroll and manage parent accounts and batches
- Review and approve student activity submissions
- Send announcements to all or specific batches
- View and export all progress reports
- No kid-facing UI — admin is purely operational

### Auth Flow

| Step | What Happens |
|---|---|
| 1 | Parent visits / (landing page) |
| 2 | Clicks Login or Enroll My Child |
| 3 | Logs in with email/password or Google |
| 4 | System checks role: Parent or Admin |
| 5 (Parent) | Redirected to /dashboard — Kid Planet Map view |
| 5 (Admin) | Redirected to /admin — DS control panel |

```
-- Supabase auth roles
users (id, email, role ['parent' | 'admin'], child_name, child_age,
       batch_id, city, avatar_id, created_at, consent_given_at)

-- Role check on login (Next.js middleware)
if (user.role === 'admin') redirect('/admin')
if (user.role === 'parent') redirect('/dashboard')
```

---

## 3. Brand and Design System

### Colors

| Token | Hex | Usage |
|---|---|---|
| DS Orange | #FF6B35 | Primary CTAs, headings, active states |
| Deep Space Navy | #1A1A2E | Dark backgrounds, nav, code blocks |
| Electric Cyan | #00D4FF | Accents, AI buddy, highlights |
| Neon Green | #00E676 | Completion states, badges, success |
| Soft White | #F8F9FF | Light page backgrounds |
| Light Orange | #FFF3EE | Info boxes, callout cards |

### Typography

- Headings and CTAs: **Fredoka One** (Google Fonts) — rounded, futuristic, kid-friendly
- Body text: **Nunito** (Google Fonts) — readable, soft, friendly
- Code blocks: Courier New or JetBrains Mono
- Minimum body font size: 16px. CTA buttons: 18px minimum
- No Arial, no Roboto, no Inter for headings — must be Fredoka One

### DS Branding Rules

- Logo: DS logo top-left on all pages. White version on dark bg. Color on light bg.
- Always use "Explorer" not "Student" in UI copy
- Always use "Mission" not "Lesson" in UI copy
- Always use "Planet" or "World" not "Module" in UI copy
- Call XP "Power Points" everywhere in the UI
- DS Orange (#FF6B35) for all primary actions only
- Success messages must end with an emoji (star, rocket, trophy)

---

## 4. Pages to Build

### Page 1 — Landing / Login (/)

> One login page for both parents and admins. System detects role after login and redirects.

**Design Specs:**
- Full-screen dark hero: space gradient (#1A1A2E to #0D0D1A) with floating CSS star particles
- Floating AI robot mascot animation (Lottie or CSS keyframe — no heavy external dependency)
- Headline in Fredoka One, DS Orange, large: "Become an AI Superhero!"
- One login form: email + password + Google OAuth button
- "Enroll My Child" CTA below form for new parents
- Admin login at same page — role redirects automatically after auth
- DS logo top-left, white version

```
Headline:   Become an AI Superhero!
Subline:    Learn the coolest AI skills. Build real things. Have a blast.
CTA:        Login to Start
Secondary:  Enroll My Child
```

---

### Page 2 — Kid Learning Dashboard (/dashboard) [Parent role]

> Default view when parent logs in. Designed for the kid to use. Planet Map is the hero element.

- Top nav: DS logo left, child's name + avatar right, Power Points bar center
- Welcome card: "Hey [Child Name], ready to build something amazing today?" with animated wave emoji
- **Planet Map (hero section):** visual space map, each week = one planet
  - Completed planet: glowing, full color
  - Current planet: pulsing orange ring animation (infinite)
  - Locked planet: dark/greyed, padlock icon with tooltip
- Quick stats row: Missions Done | Day Streak | Badges Earned | Next Live Class
- Big orange "Continue Mission" button — sticky on mobile
- Recent badges: small scrollable carousel at bottom
- "Switch to Parent View" link in top-right profile dropdown

**Planet Map Structure:**

| Planet | Weeks | Topic |
|---|---|---|
| Planet 1 — AI Explorer | Week 1-2 | Introduction to AI |
| Planet 2 — Prompt Planet | Week 3-4 | Prompt Engineering |
| Planet 3 — Creator Colony | Week 5-6 | Building with AI Tools |
| Planet 4 — Code Galaxy | Week 7-8 | Vibe Coding Basics |
| Planet 5 — Champion Star | Week 9-10 | Final Project and Graduation |

---

### Page 3 — Parent Stats View (/dashboard/parent) [Parent role, toggled]

> Parent switches here from the profile menu. Read-only progress view. No video access from this screen.

- Child's overall progress % with a clean animated progress ring
- Last active: "2 hours ago" timestamp
- Sessions completed this week vs total
- Current streak (days active in a row)
- Upcoming live class: date, time, join link
- Trainer note: weekly update text card from Eugene
- Download Progress Report button (PDF, auto-generated)
- "Back to Learning" button to return to Kid Dashboard

---

### Page 4 — Week / Planet View (/course/[weekId]) [Parent role]

- Dark card layout with glowing orange left border on current mission
- Session list as vertical timeline (not a table)
- Each card: mission number, title, duration, status (Start / Completed / Locked)
- Locked missions: padlock icon, tooltip "Finish the last mission to unlock this!"
- Top: planet name, progress bar (% done), "Back to Map" breadcrumb link

---

### Page 5 — Lesson / Video Player (/lesson/[lessonId]) [Parent role]

- 2-column layout on desktop, stacked on mobile
- LEFT 60%: Protected video embed (Bunny.net or Mux). Child name watermark on video. No download.
- RIGHT 40%: Mission title, "Your Mission Today" checklist, Activity panel, AI Buddy chat widget
- Video auto-marks as watched at 80% completion
- Bottom bar: Back | Mark as Complete | Next Mission
- On completion: confetti burst + Power Points counter animates up (+20 PP)

---

### Page 6 — Activity Page (/activity/[activityId]) [Parent role]

**4 Activity Types:**

| Type | Description | UI Element |
|---|---|---|
| Screenshot Upload | Build in ChatGPT, take screenshot | Drag-and-drop upload, large dotted border |
| Short Answer | 2-3 sentence reflection | Big text area, emoji reactions enabled |
| Quiz (MCQ) | 4 colorful answer cards, tap to pick | Green flash correct, gentle shake wrong |
| Link Submit | Paste Replit or Google Doc link | Input field + URL validate button |

> Quiz rule: Correct = green flash + star burst animation. Wrong = gentle shake + "Try again!" Never show harsh red. No negative language ever.

---

### Page 7 — Achievements (/achievements) [Parent role]

- Header: "Your Superpowers" with sparkle animation
- Badge grid: 3 per row on mobile, 5 per row on desktop
- Locked badges: grayscale + blur overlay
- Unlocked badges: full color + glow on hover + pop animation on unlock
- Click any badge: modal shows name, how earned, date earned

**Badges to Build:**

| Badge | Trigger | Icon |
|---|---|---|
| First Launch | Complete Mission 1 | Rocket |
| Prompt Pro | Complete Planet 2 | Magic Wand |
| Builder Badge | Submit first activity | Hammer |
| Streak Star | 5-day login streak | Flame |
| AI Whiz | Complete all quizzes | Brain |
| Graduation Crown | Finish full program | Crown |
| Speed Learner | 3 missions in one day | Lightning |

---

### Page 8 — Leaderboard (/leaderboard) [Parent role]

- Top 3: Gold / Silver / Bronze animated podium cards
- Rest: ranked list with avatar, child first name only, Power Points, missions done
- Filter tabs: This Week | All Time | My Batch
- Your child's rank always pinned at bottom even if not in top 10
- Privacy: first name + city only. No email. No last name visible to others.

---

### Page 9 — Live Class (/live) [Parent role]

- "Join Live Class" button linking to Zoom or Google Meet
- Countdown timer to next live session
- Past recordings: thumbnail cards by week (topic, date, duration, play button)
- Same video protection as lessons — no download, no sharing

---

### Page 10 — Profile (/profile) [Parent role]

- Avatar selection: 12 AI robot avatars (no real photos required)
- Child display name (first name only)
- City and batch (Chennai / Mumbai / Online)
- Power Points total and current level title
- Streak calendar: GitHub-style activity heatmap (days active = green squares)
- My Projects section: links to things the kid built
- "Switch to Parent View" toggle available on this page too

---

## 5. Admin Panel (/admin) [DS Team Only]

> Completely separate from parent-facing routes. Admin role cannot see kid content. Parent role cannot reach /admin.

### Admin Sections

- **Content Manager:** add, edit, delete courses, weeks, missions, videos, activities
- **Video Upload:** direct upload to Bunny.net or Mux with signed URL generation
- **Student Manager:** view all parent accounts, search by child name, batch, city
- **Batch Manager:** create batches, assign parents/kids, set start dates
- **Bulk Enroll:** CSV upload to create multiple parent accounts at once
- **Submissions Review:** view all activity submissions, approve or request revision
- **Announcements:** send in-app + email to all or specific batches
- **Progress Reports:** filter by batch/city/completion, export CSV or PDF
- **Live Class Manager:** schedule sessions, add Zoom/Meet link, upload recordings

---

## 6. Database Schema (Supabase)

```sql
-- Auth / Users
users (id, email, role ['parent'|'admin'], child_name, child_age,
       child_avatar_id, city, batch_id, consent_given_at, created_at)

-- Courses (Planets)
courses (id, title, week_number, planet_number, is_published)

-- Lessons (Missions)
lessons (id, course_id, title, description, video_url, duration_mins,
         order_index, xp_reward)

-- Progress
progress (id, user_id, lesson_id, completed_at, watch_percent, xp_earned)

-- Activities
activities (id, lesson_id, type ['quiz'|'upload'|'text'|'link'], content_json)

-- Submissions
submissions (id, user_id, activity_id, response_data, submitted_at,
             reviewed_at, status ['pending'|'approved'|'revision'], score)

-- Badges
badges (id, name, description, icon_url, trigger_type, trigger_value)

-- User Badges
user_badges (id, user_id, badge_id, earned_at)

-- Batches
batches (id, name, city, start_date, trainer_id)

-- Live Classes
live_classes (id, batch_id, title, scheduled_at, join_url, recording_url)

-- AI Buddy Logs (safety review)
ai_buddy_logs (id, user_id, lesson_id, message, response, created_at)
```

---

## 7. Power Points and Leveling System

### XP Actions

| Action | Power Points |
|---|---|
| Watch a mission (80%+ complete) | +20 PP |
| Complete an activity | +50 PP |
| Score 100% on quiz | +75 PP |
| Daily login streak | +10 PP per day |
| Submit a project | +100 PP |
| Attend live class | +30 PP |

### Levels

| Level | Title | PP Range |
|---|---|---|
| 1 | AI Rookie | 0 to 200 |
| 2 | AI Learner | 201 to 500 |
| 3 | AI Builder | 501 to 1000 |
| 4 | AI Creator | 1001 to 2000 |
| 5 | AI Innovator | 2001 to 3500 |
| 6 | AI Wizard | 3501 to 5000 |
| 7 | AI Champion | 5001 to 7000 |
| 8 | AI Master | 7001 to 9500 |
| 9 | AI Legend | 9501 to 12000 |
| 10 | AI Superhero | 12001+ |

---

## 8. AI Buddy Widget — Zara (Claude API)

Floating chat widget bottom-right on lesson and activity pages. Kids type questions, Zara answers in kid-friendly language.

### System Prompt for Zara

```
You are Zara, the friendly AI learning assistant for AI SuperKids by Digital Scholar.
You help kids aged 8-17 understand AI in simple, fun, encouraging language.
Use emojis. Keep answers to 2-3 sentences maximum.
Never give full quiz answers — give hints instead.
Always end with an encouraging message.
```

### Widget Rules

- Floating orange robot-face button, bottom-right corner
- Click opens right-side chat drawer with slide animation
- Conversation resets on page refresh — no memory between sessions
- Rate limit: 5 messages per lesson to prevent overuse
- All responses logged to ai_buddy_logs table for DS safety review
- Content filter before displaying Claude output — block off-topic or unsafe responses

---

## 9. Enrollment Flow

| Step | Action |
|---|---|
| 1 | Parent visits / (landing page) |
| 2 | Clicks "Enroll My Child" |
| 3 | Fills form: child name, child age, parent email, parent phone, city, batch preference |
| 4 | Razorpay checkout (course fee in INR) |
| 5 | Payment success: auto-create parent account in Supabase |
| 6 | Send welcome email to parent: login link + PDF quick-start guide |
| 7 | Admin gets Slack webhook notification with enrollment details |

---

## 10. Animation Guidelines

### Use Framer Motion For

- Page transitions: fade + slide up, 300ms
- Badge unlock: scale from 0.5 to 1.2 to 1.0 + confetti burst
- Power Points counter: spring count-up animation
- Planet map: hover scale 1.08, current planet pulse ring (infinite)
- Lesson complete checkmark: SVG draw-on animation

### Use CSS Animations For

- Background stars: infinite drift keyframe (slow, atmospheric)
- Robot mascot: up-down float keyframe, 3s loop
- Button hover: glow pulse with box-shadow
- Loading: skeleton shimmer (not spinners — never spinners)

> Keep all animations under 400ms. Use skeleton screens not spinners. Purposeful motion only — no decorative animations that distract kids from learning.

---

## 11. Mobile-First Rules

- 375px minimum width — design for iPhone SE first
- Bottom navigation bar: Home | My Journey | Achievements | Profile
- All buttons: 48px minimum touch height
- Body text: 16px minimum. Headings: 24px minimum on mobile
- Zero horizontal scroll on any page
- Scale feedback (transform: scale 0.95) on all tappable elements
- Video: full width on mobile, controls always visible

---

## 12. Reusable Component List

```
<PlanetCard />       — week module card on the map (completed / current / locked states)
<MissionCard />      — session list item in week view
<BadgeCard />        — achievement badge (locked / unlocked states)
<PowerPointsBar />   — animated XP progress bar
<ActivityCard />     — activity type renderer (quiz / upload / text / link)
<VideoPlayer />      — protected video wrapper (Bunny/Mux embed + watermark)
<AvatarPicker />     — 12 robot avatar grid
<StreakCalendar />   — GitHub-style activity heatmap
<LeaderboardRow />   — ranked kid row (first name + city + PP)
<QuizOption />       — MCQ answer card (correct / wrong states)
<ConfettiBlast />    — celebration component on mission complete
<AIBuddy />          — Zara chat widget (bottom-right floating drawer)
<ParentStatsCard />  — progress ring + stats for parent view
```

---

## 13. Priority Build Order

### Phase 1 — MVP (Launch Ready)

| # | Feature |
|---|---|
| 1 | Auth: parent login, Google OAuth, admin login, role-based redirect in middleware |
| 2 | Kid Learning Dashboard with Planet Map (parent role, default after login) |
| 3 | Protected video lesson player (Bunny.net or Mux, child name watermark) |
| 4 | Activity submission: all 4 types (upload, text, quiz, link) |
| 5 | Progress tracking: auto-mark complete at 80% video watch |
| 6 | Parent Stats View toggled from profile menu |
| 7 | Admin panel: content management + student management + submission review |

### Phase 2 — Engagement Layer

| # | Feature |
|---|---|
| 8 | Badge system + unlock animations + achievement page |
| 9 | Leaderboard (first name + city only for privacy) |
| 10 | Power Points and level system with animated counter |
| 11 | AI Buddy (Zara) chat widget with Claude API |
| 12 | Live class page + past recordings with same video protection |

### Phase 3 — Scale

| # | Feature |
|---|---|
| 13 | Email automation: welcome, weekly progress, reminders (Resend or SendGrid) |
| 14 | PDF certificate generator for graduation |
| 15 | Mobile PWA or React Native app |
| 16 | Admin analytics dashboard |

---

## 14. Folder Structure

```
/app
  /page.tsx                        (landing / login — one page for both roles)
  /(parent)                        (route group, requires parent role)
    /dashboard/page.tsx             (kid planet map — default after login)
    /dashboard/parent/page.tsx      (parent stats view — toggled from profile)
    /course/[weekId]/page.tsx
    /lesson/[lessonId]/page.tsx
    /activity/[activityId]/page.tsx
    /achievements/page.tsx
    /leaderboard/page.tsx
    /live/page.tsx
    /profile/page.tsx
  /(admin)                         (route group, requires admin role)
    /admin/page.tsx                 (admin home dashboard)
    /admin/courses/page.tsx
    /admin/students/page.tsx
    /admin/batches/page.tsx
    /admin/submissions/page.tsx
    /admin/live/page.tsx
    /admin/announcements/page.tsx
/components
  /ui                              (shadcn base components)
  /lms                             (PlanetCard, MissionCard, BadgeCard, etc.)
  /games                           (QuizOption, ActivityCard, ConfettiBlast)
  /AIBuddy.tsx                     (Zara floating chat widget)
/lib
  /supabase.ts
  /hooks/
  /middleware.ts                   (role-based route protection)
/public
  /avatars/                        (12 robot PNG avatars)
  /badges/                         (badge icon files)
  /ds-logo.svg
```

---

## 15. UI Copy — Kid-Friendly Language

| Generic | AI SuperKids Version |
|---|---|
| Welcome back | Hey [Name], you're back! Let's build something |
| Course / Module | Planet / World |
| Lesson | Mission |
| Submit | Send My Work |
| Error | Oops! Try that again |
| Loading... | Getting your stuff ready... |
| Locked | Finish the last mission to unlock this! |
| Completed | Done! You're crushing it! |
| Assignment | Your Challenge |
| XP / Points | Power Points |
| Student | Explorer |
| Score | Power Points Earned |

---

## 16. Critical Developer Notes

> Read before starting. These rules are non-negotiable for launch.

- **Video DRM:** Use signed URLs only. Never expose direct video URLs in page source or network tab.
- **Privacy:** Kids are minors. Follow COPPA and India DPDP Act. No real photos. No public profiles.
- **Consent:** Store parent consent timestamp in DB at enrollment. Required for compliance.
- **Leaderboard:** First name + city only. No emails, no last names visible to other users ever.
- **AI Safety:** Log all Zara (AI Buddy) outputs. Run content filter before displaying to kids.
- **Middleware:** Protect all /dashboard/* routes with parent role check. Protect all /admin/* routes with admin role check. The two route groups must be completely isolated.
- **Admin invisible to parents:** /admin route and all its children must be completely inaccessible to parent role — return 404 or redirect.
- **Test on:** iPhone SE (375px), iPad (768px), Android 360px, Desktop 1440px
- **Performance:** Lighthouse mobile score 90+. Lazy load all video thumbnails and badge images.

---

*AI SuperKids LMS Build Guide v2*
*Digital Scholar | Rishi Jain | digitalscholar.in | @rrishijain*
*Confidential. For internal use only.*
