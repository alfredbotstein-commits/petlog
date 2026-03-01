# PetLog — Design Specification
**Version:** 1.0
**Date:** 2026-03-01
**Designer:** Raphael, Design Director — Loopspur
**Division:** Apps
**QV Score:** 7.5/10

---

## 1. Product Identity

**Name:** PetLog
**Tagline:** "All your pet's info. One tap away."
**Target audience:** Pet owners (25–55) frustrated by bloated, buggy pet care apps. 11Pets at 3.4★ validates the quality vacuum.
**Key differentiator:** Clean, fast, reliable. Multi-pet support. Vet visit PDF export.

### Brand Personality
Warm, friendly, trustworthy. Not clinical, not cutesy. Think "your best friend who's also really organized." The app should feel like a family photo album meets a well-kept notebook.

---

## 2. Color System

### Primary Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `brand-primary` | `#E8764B` | Warm terracotta — primary actions, FAB, active states |
| `brand-secondary` | `#4A9B8E` | Sage teal — secondary actions, health/vet accent |
| `brand-accent` | `#F2C94C` | Soft gold — highlights, stars, premium badge |

### Neutral Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-900` | `#1A1A2E` | Primary text |
| `neutral-700` | `#4A4A5A` | Secondary text |
| `neutral-500` | `#8E8E9A` | Tertiary text, placeholders |
| `neutral-200` | `#E8E8EE` | Dividers, borders |
| `neutral-100` | `#F5F4F0` | Card backgrounds (warm tint) |
| `neutral-50` | `#FAFAF8` | Screen background (warm white) |
| `white` | `#FFFFFF` | Cards, sheets |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#4CAF82` | Completed, healthy, on-track |
| `warning` | `#F2994A` | Due soon, attention |
| `error` | `#EB5757` | Overdue, missed, delete |
| `info` | `#4A9B8E` | Same as secondary — informational |

### Pet Type Accent Colors
Each pet type gets a subtle accent for visual distinction on cards:
| Pet Type | Accent | Hex |
|----------|--------|-----|
| Dog | Warm brown | `#A67B5B` |
| Cat | Soft purple | `#9B8EC4` |
| Bird | Sky blue | `#6BB5D9` |
| Fish | Ocean teal | `#4DBFB5` |
| Reptile | Olive green | `#8BA86B` |
| Small Animal | Peach | `#E8A087` |
| Other | Neutral gray | `#9E9EA8` |

### Dark Mode
- Background: `#121218`
- Card: `#1E1E2A`
- Elevated: `#28283A`
- Primary text: `#F0F0F2`
- brand-primary stays `#E8764B` (passes 4.5:1 on dark)
- All semantic colors lightened 10% for dark surfaces

---

## 3. Typography

**Font Family:** System default (SF Pro on iOS, Roboto on Android) — fastest render, zero load time, familiar.

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `display` | 28px | Bold (700) | 34px | Screen titles ("My Pets") |
| `heading-1` | 22px | Semibold (600) | 28px | Section headers |
| `heading-2` | 18px | Semibold (600) | 24px | Card titles, pet names |
| `body` | 16px | Regular (400) | 22px | Primary content |
| `body-bold` | 16px | Semibold (600) | 22px | Emphasized body text |
| `caption` | 14px | Regular (400) | 18px | Timestamps, secondary info |
| `caption-bold` | 14px | Medium (500) | 18px | Labels, tags |
| `micro` | 12px | Medium (500) | 16px | Badges, metadata |

**Minimum touch target:** 44×44pt (iOS HIG), 48×48dp (Material).

---

## 4. Iconography

**Style:** Rounded line icons, 2px stroke, 24×24 base grid. Consistent with Loopspur design language.

**Custom icons needed:**
- Paw print (navigation, brand mark)
- Each pet type silhouette (dog, cat, bird, fish, reptile, hamster, question mark)
- Syringe (vaccination)
- Pill (medication)
- Scale (weight)
- Bowl (food)
- Scissors (grooming)
- Stethoscope (vet visit)
- Walking figure (activity/walk)
- Camera (photo)
- Calendar (reminders)
- PDF/export icon

---

## 5. Navigation

### Bottom Tab Bar (4 tabs)
```
[ 🐾 My Pets ]  [ 📋 Timeline ]  [ 🔔 Reminders ]  [ ⚙️ Settings ]
```

| Tab | Icon | Label | Screen |
|-----|------|-------|--------|
| 1 | Paw | My Pets | Pet grid/list — home screen |
| 2 | List | Timeline | Unified activity feed across all pets |
| 3 | Bell | Reminders | Upcoming reminders, due/overdue |
| 4 | Gear | Settings | Preferences, premium, export, about |

**FAB (Floating Action Button):** Terracotta circle with `+` icon, anchored bottom-right above tab bar. Triggers quick-add sheet.

---

## 6. Screen Specifications

### 6.1 My Pets (Home)

**Purpose:** At-a-glance view of all pets with quick status.

**Layout:** Grid (default, 2 columns) or List (toggle in top-right).

**Grid Card:**
```
┌─────────────────────┐
│  ┌───────────────┐   │
│  │  Pet Photo     │   │
│  │  (circle crop) │   │
│  └───────────────┘   │
│  Luna 🐕              │
│  3y 2m · 28 lbs      │
│  ✅ All up to date    │
└─────────────────────┘
```

- **Pet photo:** 80×80pt circle, with fallback silhouette for pet type
- **Name:** `heading-2`, truncate at 16 chars
- **Subtitle:** Age + weight (if tracked)
- **Status chip:** Green "All up to date" / Orange "2 reminders due" / Red "Overdue"
- **Pet type accent:** 3px left border in pet type color
- **Card:** White, 12px radius, subtle shadow (`0 2px 8px rgba(0,0,0,0.06)`)
- **Tap:** → Pet Detail

**List View Card:**
```
┌──────────────────────────────────────┐
│ (photo) Luna 🐕     All up to date ✅ │
│          3y 2m · 28 lbs   Last: Fed 2h│
└──────────────────────────────────────┘
```

**Empty state:** Illustration of a happy pet + "Add your first pet" CTA button. Warm, inviting.

**Top bar:** "My Pets" (display), grid/list toggle icon (top-right).

**Premium gate:** Free users see a soft banner after 2 pets: "Upgrade to add unlimited pets — $2.99 one-time."

### 6.2 Pet Detail

**Purpose:** Full profile + care timeline for a single pet.

**Layout:** Scrollable, single-column.

```
┌──────────────────────────────┐
│ ← Back              ✏️ Edit  │
│                              │
│     ┌──────────┐             │
│     │  Photo   │             │
│     │ (large)  │             │
│     └──────────┘             │
│     Luna                     │
│     Golden Retriever · Dog   │
│     Born: Mar 15, 2023       │
│     3y · 28 lbs · Female     │
│                              │
│ ┌──────────────────────────┐ │
│ │ Quick Actions            │ │
│ │ [🍕Fed] [🚶Walked]       │ │
│ │ [✂️Groomed] [💊Med]      │ │
│ └──────────────────────────┘ │
│                              │
│ ── Care Timeline ──          │
│                              │
│ Today                        │
│  🍕 Fed — 8:32 AM           │
│  🚶 Walked — 7:15 AM (30m)  │
│                              │
│ Yesterday                    │
│  💉 Vaccination — Rabies     │
│     Dr. Smith, Happy Paws    │
│  🍕 Fed — 8:45 AM           │
│  🍕 Fed — 5:30 PM           │
│                              │
│ [View full history →]        │
└──────────────────────────────┘
```

**Hero section:**
- Photo: 120×120pt circle, tap to view full / change
- Name: `display`
- Breed + type: `body`, neutral-700
- Stats row: Age, weight, sex — `caption`, pills/chips

**Quick Actions bar:**
- Horizontal scroll of action chips
- Each chip: icon + label, rounded pill, neutral-100 bg
- Tap → logs the activity NOW with timestamp (toast confirmation)
- Long-press → opens detail entry (notes, duration, amount)
- Actions: Fed, Walked, Groomed, Medication, Weighed, Custom

**Care Timeline:**
- Grouped by date (Today, Yesterday, date headers)
- Each entry: icon + activity type + time + optional detail
- Vet visits get expanded card treatment (clinic name, doctor, notes)
- Infinite scroll with lazy loading

**Tabs below hero (optional segmented control):**
```
[ Timeline | Health | Photos ]
```
- **Timeline:** Default, all activities
- **Health:** Filtered to vet visits, vaccinations, medications, weight
- **Photos:** Photo journal grid (Premium)

### 6.3 Add / Edit Pet

**Purpose:** Create or edit a pet profile.

**Layout:** Single-column form, scrollable.

**Fields:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Photo | Image picker | No | Camera or gallery. Circle crop preview. |
| Name | Text input | Yes | Max 30 chars |
| Species | Picker (segmented) | Yes | Dog, Cat, Bird, Fish, Reptile, Small Animal, Other |
| Breed | Text input + autocomplete | No | Breed database per species. Free text fallback. |
| Birthday | Date picker | No | Or "Approximate age" toggle → age in years/months |
| Sex | Segmented: Male / Female / Unknown | No | |
| Weight | Number + unit toggle (lbs/kg) | No | |
| Color/Markings | Text input | No | |
| Microchip # | Text input | No | |
| Notes | Multiline text | No | Allergies, special needs, etc. |

**Validation:** Name required. All else optional. Save enabled once name + species selected.

**UX:** Species picker shows pet-type icons in a horizontal row — tap to select, selected gets terracotta ring. Feels playful, not form-like.

### 6.4 Vet Visit Log

**Access:** Pet Detail → Timeline → tap vet entry, OR Pet Detail → Health tab → "Add Vet Visit" button.

**Form Fields:**
| Field | Type | Required |
|-------|------|----------|
| Date | Date picker | Yes (defaults today) |
| Clinic Name | Text + autocomplete (from history) | No |
| Vet Name | Text + autocomplete | No |
| Reason | Picker: Checkup, Vaccination, Illness, Injury, Surgery, Dental, Other | Yes |
| Vaccinations given | Multi-select chips | No |
| Weight at visit | Number | No |
| Diagnosis | Multiline text | No |
| Prescriptions | Repeatable: Med name + dosage + frequency + duration | No |
| Follow-up date | Date picker | No |
| Notes | Multiline text | No |
| Documents | File/photo attach (up to 5) | No |

**Vaccination presets per species:**
- Dog: Rabies, DHPP, Bordetella, Leptospirosis, Lyme, Canine Influenza
- Cat: Rabies, FVRCP, FeLV, FIV
- Bird: Polyomavirus, PBFD
- Others: "Custom" free text

**PDF Export (Premium):** Button at bottom of any vet visit → generates clean PDF with pet info header + visit details. Also available in Settings → "Export All Vet Records" per pet.

### 6.5 Reminders

**Purpose:** Never miss a vet appointment, medication, or care task.

**Layout:**
```
┌──────────────────────────────┐
│ Reminders                    │
│                              │
│ ⚠️ OVERDUE (1)               │
│ ┌──────────────────────────┐ │
│ │ 💊 Luna — Heartworm pill │ │
│ │    Due: Feb 28 (1d ago)  │ │
│ │    [Give Now] [Snooze]   │ │
│ └──────────────────────────┘ │
│                              │
│ 📅 TODAY (2)                  │
│ ┌──────────────────────────┐ │
│ │ 🏥 Max — Annual checkup  │ │
│ │    10:30 AM · Happy Paws │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ ✂️ Luna — Grooming appt  │ │
│ │    2:00 PM               │ │
│ └──────────────────────────┘ │
│                              │
│ 📆 UPCOMING                   │
│  Mar 5 — Max · Flea/tick med │
│  Mar 12 — Luna · Vet follow  │
│  Apr 1 — Luna · Rabies boost │
└──────────────────────────────┘
```

**Sections:** Overdue (red bg tint) → Today → Upcoming (next 30 days) → Later

**Reminder card:** Pet photo (small, 32pt) + pet name + activity + due date/time + action buttons

**Actions:**
- "Done" / "Give Now" → logs activity, clears reminder
- "Snooze" → picker: 1h, 3h, Tomorrow, Custom
- Tap card → full detail

**Add Reminder form:**
| Field | Type |
|-------|------|
| Pet | Picker (from your pets) |
| Type | Medication, Vet Appointment, Vaccination, Grooming, Feeding, Custom |
| Title | Auto-filled from type, editable |
| Date & Time | DateTime picker |
| Repeat | None, Daily, Weekly, Monthly, Custom interval |
| Notes | Multiline |

**Premium gate:** Free users get basic reminders (manual only). Premium unlocks medication reminders with auto-repeat scheduling and push notifications.

### 6.6 Settings

**Sections:**
```
ACCOUNT
  Premium — Upgrade / Manage
  
PREFERENCES  
  Units — lbs / kg
  Date format — MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
  Default pet view — Grid / List
  Theme — Light / Dark / System
  
DATA
  Export Vet Records (PDF) [Premium]
  Export All Data (JSON)
  Import Data
  
ABOUT
  Help & FAQ
  Contact Support
  Rate PetLog
  Privacy Policy
  Terms of Service
  Version 1.0.0
```

### 6.7 Quick-Add Sheet (FAB)

**Trigger:** Tap FAB from any screen.

**Layout:** Bottom sheet, slides up.

```
┌──────────────────────────────┐
│ ── Quick Add ──              │
│                              │
│ Which pet?                   │
│ [🐕 Luna] [🐱 Max] [+ Add]  │
│                              │
│ What happened?               │
│ [🍕 Fed]  [🚶 Walked]        │
│ [✂️ Groomed] [💊 Medication] │
│ [⚖️ Weighed] [🏥 Vet Visit] │
│ [📸 Photo]  [✏️ Custom]      │
│                              │
│ [Cancel]                     │
└──────────────────────────────┘
```

**Flow:**
1. Select pet (defaults to last-used pet if only one, or shows picker)
2. Tap activity → logged immediately with current timestamp + toast
3. For activities needing detail (vet visit, medication, weight) → opens detail form
4. Sheet dismisses automatically after logging

**This is the killer UX.** Two taps to log anything. Competitors require 5-7 taps for the same action.

---

## 7. Data Model

### Pet
```
Pet {
  id: UUID
  name: String (required)
  species: Enum [dog, cat, bird, fish, reptile, small_animal, other]
  breed: String?
  birthday: Date?
  approximateAge: { years: Int, months: Int }?
  sex: Enum [male, female, unknown]?
  weight: { value: Float, unit: Enum [lbs, kg] }?
  color: String?
  microchipId: String?
  photoUri: String?
  notes: String?
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Activity (care timeline entry)
```
Activity {
  id: UUID
  petId: UUID (FK → Pet)
  type: Enum [fed, walked, groomed, medication, weighed, vet_visit, vaccination, photo, custom]
  timestamp: DateTime
  duration: Int? (minutes, for walks/activities)
  notes: String?
  
  // Type-specific data (nullable, used per type)
  weight: { value: Float, unit: Enum }?          // weighed
  medicationName: String?                          // medication
  medicationDosage: String?                        // medication
  foodType: String?                                // fed
  foodAmount: String?                              // fed
  photoUri: String?                                // photo
  vetVisitId: UUID?                                // links to VetVisit
  
  createdAt: DateTime
}
```

### VetVisit
```
VetVisit {
  id: UUID
  petId: UUID (FK → Pet)
  date: Date
  clinicName: String?
  vetName: String?
  reason: Enum [checkup, vaccination, illness, injury, surgery, dental, other]
  vaccinations: [String]?
  weightAtVisit: { value: Float, unit: Enum }?
  diagnosis: String?
  prescriptions: [{ name, dosage, frequency, duration }]?
  followUpDate: Date?
  notes: String?
  documents: [{ uri: String, name: String }]?
  createdAt: DateTime
}
```

### Reminder
```
Reminder {
  id: UUID
  petId: UUID (FK → Pet)
  type: Enum [medication, vet_appointment, vaccination, grooming, feeding, custom]
  title: String
  dateTime: DateTime
  repeat: Enum [none, daily, weekly, monthly, custom]?
  repeatInterval: Int? (days, for custom)
  notes: String?
  completed: Boolean
  completedAt: DateTime?
  snoozedUntil: DateTime?
  createdAt: DateTime
}
```

### Storage
- **Local-first:** SQLite via `expo-sqlite` or WatermelonDB
- **No cloud sync for MVP** — keeps it simple, private, fast
- **Photo storage:** Local filesystem, referenced by URI
- **Export:** JSON for full data, PDF for vet records

---

## 8. Premium Gates

**Price:** $2.99 one-time (lifetime) via RevenueCat.

| Feature | Free | Premium |
|---------|------|---------|
| Number of pets | 2 | Unlimited |
| Activity logging | ✅ | ✅ |
| Care timeline | ✅ | ✅ |
| Vet visit log | ✅ | ✅ |
| Basic reminders | ✅ | ✅ |
| Medication auto-reminders | ❌ | ✅ |
| Push notification reminders | ❌ | ✅ |
| Vet visit PDF export | ❌ | ✅ |
| Photo journal | ❌ | ✅ |
| Weight charts | ❌ | ✅ |
| Data export (JSON) | ✅ | ✅ |

**Gate presentation:**
- Soft, non-intrusive. Never block core functionality.
- When user hits a gate: bottom sheet with feature preview + "Unlock PetLog Premium — $2.99" CTA
- Premium badge: small gold paw icon next to gated features in UI
- Settings → Premium page: feature comparison list + purchase button + restore purchases

---

## 9. Onboarding

**3 screens, swipeable, skippable:**

1. **Welcome** — PetLog logo + illustration of pets. "All your pet's info. One tap away." [Get Started]
2. **Add Your Pet** — Inline mini-form: name + species + photo (optional). "You can add more later." [Continue]
3. **Quick Actions** — Animation showing 2-tap logging. "Log meals, walks, and vet visits in seconds." [Start Using PetLog]

**No signup required. No account creation. Pure local-first.**

---

## 10. Microinteractions & Motion

| Action | Animation |
|--------|-----------|
| Quick-add logged | Toast slides up with checkmark + pet name. Subtle haptic. |
| Add pet | Card animates into grid with scale-up (0.8 → 1.0, 200ms ease-out) |
| Delete pet | Card fades + shrinks. Confirmation dialog first. |
| FAB tap | Sheet springs up (spring damping 0.8). FAB morphs to X. |
| Pet photo tap | Expand to full-screen with shared element transition |
| Reminder completed | Strikethrough + slide left to "completed" section |
| Tab switch | Crossfade, 150ms |
| Pull to refresh | Custom paw-print spinner |

**Philosophy:** Quick, purposeful, never blocking. Every animation < 300ms. User should never wait for an animation to finish before tapping.

---

## 11. Accessibility

| Requirement | Implementation |
|-------------|---------------|
| **Min contrast** | 4.5:1 for all text. 3:1 for large text and icons. Verified against both themes. |
| **Touch targets** | Minimum 44×44pt (iOS) / 48×48dp (Android). Quick-action chips: 48pt tall. |
| **Screen reader** | All images get alt text. Pet photos: "{Pet name}, {species}". Icons: descriptive labels. |
| **VoiceOver/TalkBack** | Logical reading order. Cards announce: "{Name}, {species}, {status}". |
| **Dynamic type** | Support iOS Dynamic Type and Android font scaling up to 200%. Layouts reflow, don't clip. |
| **Reduce motion** | Respect `prefers-reduced-motion`. Replace animations with instant transitions. |
| **Color independence** | Status never conveyed by color alone. Always icon + text + color. |
| **Focus indicators** | Visible focus rings on all interactive elements in keyboard/switch navigation. |

---

## 12. Component Library

### Buttons
- **Primary:** Terracotta bg, white text, 12px radius, 48pt height, full-width or auto
- **Secondary:** Outlined, terracotta border + text, transparent bg
- **Tertiary:** Text-only, terracotta color
- **Destructive:** Error-red bg, white text (delete actions only)

### Cards
- **Pet Card:** White bg, 12px radius, shadow, 3px left accent border (pet type color)
- **Activity Card:** Minimal — icon + text + timestamp. No heavy borders.
- **Reminder Card:** White bg, left accent (green/orange/red by status)

### Inputs
- **Text field:** 48pt height, 12px radius, neutral-200 border, neutral-100 bg on focus
- **Picker:** Native picker or custom bottom sheet for species/type selectors
- **Date picker:** Native platform date picker

### Chips
- **Quick-action chip:** Pill shape, neutral-100 bg, icon + label, 40pt height
- **Filter chip:** Smaller pill, toggleable, terracotta when active
- **Tag chip:** Micro text, colored bg per category

### Bottom Sheet
- **Standard:** White bg, 16px top radius, drag handle (40×4 bar, neutral-300)
- **Max height:** 85% of screen
- **Backdrop:** Black at 40% opacity

### Toast
- **Position:** Bottom center, above tab bar
- **Style:** Rounded pill, neutral-900 bg, white text, icon left
- **Duration:** 2 seconds, swipe to dismiss

---

## 13. App Icon

**Concept:** A paw print inside a rounded square, using the terracotta-to-gold gradient. Clean, recognizable at any size.

- Background: Warm gradient (`#E8764B` → `#F2C94C`, 135°)
- Foreground: White paw print, slightly stylized (rounded toes)
- No text in icon
- Works at 1024×1024 down to 29×29

---

## 14. Store Presence

### Screenshots (8 required)
1. **My Pets grid** — "All your pets, one screen"
2. **Pet Detail** — "Everything about Luna"
3. **Quick-Add** — "Log care in 2 taps"
4. **Care Timeline** — "Complete care history"
5. **Vet Visit Log** — "Never forget a vet visit"
6. **Reminders** — "Smart reminders, on time"
7. **Weight Chart** (Premium) — "Track health over time"
8. **PDF Export** (Premium) — "Share records with any vet"

**Screenshot style:** Device mockup (iPhone 15 / Pixel 8), warm neutral background (`#F5F4F0`), bold caption top, app screen below. Consistent with Loopspur screenshot language.

### App Store Description (draft)
> **PetLog — All your pet's info. One tap away.**
>
> Finally, a pet care app that just works. No bloat. No bugs. No subscriptions.
>
> 🐾 **Multi-pet support** — Dogs, cats, birds, fish, reptiles, and more
> ⚡ **2-tap logging** — Fed, walked, groomed — logged in seconds
> 🏥 **Vet visit tracking** — Vaccinations, medications, diagnoses
> 🔔 **Smart reminders** — Never miss a med or appointment
> 📊 **Weight & health charts** — See trends over time
> 📄 **PDF export** — Share vet records with any clinic
>
> **Free forever for up to 2 pets.** Unlock unlimited pets + premium features for a one-time $2.99.
>
> Your pet's care shouldn't be harder than it needs to be. PetLog keeps it simple.

---

## 15. Technical Notes for Ezra

- **Framework:** React Native + Expo (consistent with Loopspur stack)
- **State:** Zustand for global state, SQLite for persistence
- **Navigation:** Expo Router (file-based), bottom tabs + stack
- **Payments:** RevenueCat for premium IAP
- **PDF generation:** `react-native-pdf-lib` or `expo-print` → share sheet
- **Notifications:** `expo-notifications` for reminders (Premium)
- **Image handling:** `expo-image-picker` + local filesystem storage
- **Charts:** `react-native-chart-kit` or `victory-native` for weight charts
- **Target:** iOS first, Android second. Universal app.
- **Min OS:** iOS 15+, Android 10+

---

*— Raphael, Design Director, Loopspur*
*"Warm, fast, reliable. Two taps. Done."*
