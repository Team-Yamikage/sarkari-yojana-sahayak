

## Plan: Implement 6 New Features

### Overview
Add AI Chatbot, Document Checklist, Scheme Comparison, Bookmarks, WhatsApp Sharing, and Dark Mode to the existing platform. All features will be bilingual (Hindi/English) and responsive.

---

### 1. Dark Mode Toggle
- Create `src/hooks/useTheme.ts` — reads/writes `localStorage`, toggles `.dark` class on `<html>`
- Add Sun/Moon icon button in `Navbar.tsx` next to the language toggle
- CSS dark variables already exist in `index.css` — no CSS changes needed

### 2. Bookmark/Save System
- Create `src/hooks/useBookmarks.ts` — manages bookmarked scheme IDs and job IDs in `localStorage`
- Functions: `toggleBookmark(type, id)`, `isBookmarked(type, id)`, `getBookmarks(type)`
- Add Heart/Bookmark icon on each scheme card in `SchemeExplainer.tsx` and each job card in `GovtJobs.tsx`
- Create `src/pages/SavedItems.tsx` — fetches bookmarked schemes/jobs from Supabase by IDs and displays them
- Add "Saved" nav link in `Navbar.tsx` with a badge count
- Add route `/saved` in `App.tsx`

### 3. WhatsApp Sharing
- Add a Share button on each scheme card (`SchemeExplainer.tsx`) and job card (`GovtJobs.tsx`)
- Generate a pre-formatted message with scheme/job details
- Open `https://wa.me/?text=...` in new tab
- Use the `Share2` icon from lucide-react

### 4. AI Chatbot Widget
- Create `src/components/AIChatbot.tsx` — floating button (bottom-right), expandable chat panel
- Add a new `type: "chat"` branch in the existing `ai-chat` edge function for general Q&A
- Chat maintains message history in component state
- Renders AI responses with `whitespace-pre-wrap` (no external markdown lib needed for simplicity)
- Added to `App.tsx` layout (outside Routes, always visible)
- Update `supabase/config.toml` — no changes needed (ai-chat already configured)

### 5. Document Checklist Generator
- Create `src/pages/DocumentChecklist.tsx`
- User selects a scheme from a dropdown (fetched from Supabase `schemes` table)
- Displays `required_documents` as interactive checkboxes
- Progress bar showing completion percentage
- "Print Checklist" button using `window.print()`
- Add nav link "Documents" and route `/documents` in `App.tsx` and `Navbar.tsx`

### 6. Scheme Comparison Tool
- Create `src/pages/SchemeCompare.tsx`
- Multi-select up to 3 schemes from dropdown
- Side-by-side comparison table: category, eligibility, documents, description, apply link
- Responsive: horizontal scroll on mobile
- Add nav link "Compare" and route `/compare` in `App.tsx` and `Navbar.tsx`

---

### Files to Create
| File | Purpose |
|------|---------|
| `src/hooks/useTheme.ts` | Dark mode toggle logic |
| `src/hooks/useBookmarks.ts` | localStorage bookmark manager |
| `src/components/AIChatbot.tsx` | Floating AI chat widget |
| `src/pages/DocumentChecklist.tsx` | Document checklist page |
| `src/pages/SchemeCompare.tsx` | Scheme comparison page |
| `src/pages/SavedItems.tsx` | Saved bookmarks page |

### Files to Modify
| File | Changes |
|------|---------|
| `src/App.tsx` | Add 3 routes, import AIChatbot |
| `src/components/Navbar.tsx` | Add 3 nav links, dark mode + saved badge |
| `src/pages/SchemeExplainer.tsx` | Add bookmark + WhatsApp share buttons |
| `src/pages/GovtJobs.tsx` | Add bookmark + WhatsApp share buttons |
| `supabase/functions/ai-chat/index.ts` | Add `chat` type handler |

### Edge Function Update
Add a `chat` type to `ai-chat/index.ts` that accepts `messages` array and forwards to the AI gateway with a system prompt for general government scheme Q&A assistance.

### No Database Changes Required
All new features use existing tables (`schemes`, `govt_jobs`) and client-side storage (`localStorage`).

