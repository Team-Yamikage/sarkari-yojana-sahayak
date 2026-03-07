# 🇮🇳 Sarkari Yojana Mitra AI

> **Your AI-powered guide to Indian Government Schemes** — Built for the people of Bharat who deserve easy access to government welfare programs.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://gram-yojana-samajh.lovable.app)
[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-orange)](https://lovable.dev)

---

## 📖 About

**Sarkari Yojana Mitra AI** is a bilingual (Hindi/English) web application that helps Indian citizens discover, understand, and apply for government schemes. It uses AI to simplify complex government processes and makes welfare programs accessible to everyone — from students and farmers to senior citizens and women.

Built by **Shashank Shekhar Verma**, a 17-year-old Class 12 student from Muzaffarnagar, UP, for the **CodeYogi – Builders of Bharat AI Challenge**.

---

## ✨ Key Features

### 🔍 AI Eligibility Checker
Enter your details (age, income, state, category, occupation) and the AI instantly tells you which government schemes you're eligible for — with step-by-step guidance on how to apply.

### 📚 Scheme Explainer
Search any government scheme and get a clear, simple explanation including purpose, eligibility criteria, required documents, deadlines, and application process.

### ✉️ Letter Generator
Generate professional Hindi application letters for government offices. Just enter your name, reason, and details — the AI creates a ready-to-use formal letter.

### 💼 Government Jobs Finder
Browse the latest government job vacancies with details like age limits, qualifications, fees, registration dates, and direct apply links.

### 📋 Document Checklist Generator
Select a scheme and get an interactive checklist of required documents. Check off documents as you gather them, track progress with a visual bar, and print the checklist.

### ⚖️ Scheme Comparison Tool
Compare up to 3 government schemes side-by-side — categories, eligibility, required documents, and descriptions — to make informed decisions.

### 🤖 AI Chatbot Assistant
A floating chatbot available on every page. Ask questions in Hindi or English about any scheme, eligibility, or application process and get instant AI-powered answers.

### 💾 Bookmark & Save
Save your favorite schemes and jobs for later. Bookmarks are stored locally and accessible from the "Saved Items" page with a badge count in the navbar.

### 📲 WhatsApp Sharing
Share scheme details or job vacancies with family and friends via WhatsApp with one click — essential for rural India where WhatsApp is the primary communication tool.

### 🌙 Dark Mode
Toggle between light and dark themes for comfortable reading in any environment. Your preference is saved automatically.

### 🌐 Bilingual Support
Switch between Hindi (हिंदी) and English with a single click. The entire app — navigation, content, AI responses — adapts to your language preference.

---

## 📸 Screenshots

> 🔗 **[View Live Demo →](https://gram-yojana-samajh.lovable.app)**

### 1. Homepage
The landing page with hero section, target audience cards (Students, Farmers, Low-income families, Senior citizens), and feature overview with saffron-white-green theme.

![Homepage](https://img.shields.io/badge/View-Homepage-orange?style=for-the-badge&logo=google-chrome&logoColor=white)

### 2. AI Eligibility Checker
Smart form with fields for age, income, state, category, and occupation. AI analyzes your profile and recommends eligible government schemes with application steps.

![Eligibility](https://img.shields.io/badge/View-Eligibility_Checker-blue?style=for-the-badge&logo=google-chrome&logoColor=white)

### 3. Government Jobs Finder
Browse latest sarkari naukri vacancies with department, qualifications, age limits, fees by category, registration dates, and direct apply links. Includes WhatsApp sharing.

![Jobs](https://img.shields.io/badge/View-Govt_Jobs-green?style=for-the-badge&logo=google-chrome&logoColor=white)

### 4. Document Checklist & Scheme Comparison
- **Document Checklist**: Select a scheme → get interactive checkbox list → track progress → print
- **Scheme Compare**: Pick up to 3 schemes → side-by-side comparison table

![Tools](https://img.shields.io/badge/View-Tools-purple?style=for-the-badge&logo=google-chrome&logoColor=white)

### 5. AI Chatbot & Dark Mode
Floating AI assistant on every page for instant help. Dark mode toggle for comfortable reading.

![AI Chat](https://img.shields.io/badge/View-AI_Chatbot-red?style=for-the-badge&logo=google-chrome&logoColor=white)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | Frontend framework |
| **TypeScript** | Type-safe development |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | UI component library |
| **Supabase** | Database, Edge Functions, Backend |
| **Lovable AI Gateway** | AI-powered features (Gemini 3 Flash) |
| **React Router** | Client-side routing |
| **TanStack Query** | Server state management |
| **Lucide Icons** | Icon library |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- A Supabase project (for database and edge functions)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sarkari-yojana-mitra-ai

# Install dependencies
npm install
# or
bun install

# Start the development server
npm run dev
# or
bun dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Navbar.tsx      # Navigation with dark mode & language toggle
│   ├── Footer.tsx      # App footer
│   └── AIChatbot.tsx   # Floating AI chat widget
├── contexts/
│   └── LanguageContext.tsx  # Bilingual (Hindi/English) support
├── hooks/
│   ├── useTheme.ts     # Dark mode toggle
│   └── useBookmarks.ts # Bookmark management (localStorage)
├── pages/
│   ├── Index.tsx           # Homepage
│   ├── EligibilityChecker.tsx  # AI eligibility checker
│   ├── SchemeExplainer.tsx     # Scheme details & search
│   ├── LetterGenerator.tsx     # AI letter generator
│   ├── GovtJobs.tsx           # Government jobs listing
│   ├── DocumentChecklist.tsx   # Document checklist generator
│   ├── SchemeCompare.tsx       # Scheme comparison tool
│   ├── SavedItems.tsx         # Saved bookmarks page
│   └── About.tsx              # About the developer
├── integrations/
│   └── supabase/       # Supabase client & types
└── App.tsx             # Main app with routing
```

---

## 🎯 Who Is This For?

- 👨‍🎓 **Students** — Find scholarships and education schemes
- 👨‍🌾 **Farmers** — Discover agricultural subsidies and support programs
- 👨‍👩‍👧‍👦 **Low-income families** — Access welfare and financial aid schemes
- 👴 **Senior citizens** — Learn about pension and healthcare schemes
- 👩 **Women** — Find women-specific empowerment programs
- ♿ **Persons with disabilities** — Discover disability support schemes

---

## 🏆 Built For

**CodeYogi – Builders of Bharat AI Challenge 🇮🇳**

> *Empowering rural India through technology and AI*

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ by <strong>Shashank Shekhar Verma</strong> from Muzaffarnagar, UP 🇮🇳
</p>
