# Korea Wedding & Family Trip Planner 2026

A beautiful, premium, interactive single-page web application to plan, visualize, and coordinate our upcoming wedding trip to South Korea (September 26 – October 4, 2026). 

Designed to be shared with family, especially the Bride, to coordinate day trips, packing, and language basics in a clean, visual format.

## Key Features

1. **Elegant Visual Design**: Beautiful Korean-inspired royal aesthetics with full support for Light Mode & Dark Mode.
2. **Interactive Countdown**: Dynamic timer ticking down to the moment we land in Seoul (September 26, 2026 at 5:00 PM KST).
3. **Collapsible Timeline**: A day-by-day breakdown of flights, locations, group sizes, and wedding events, pre-expanded on key days (Day 1, 4, and 8).
4. **Day Trip Planners**: Detailed guides for Gyeongju (historical), Busan (coastal & cultural), and Ulsan (local nature) with driving times, parking tips, and food recommendations.
5. **Vehicle Assignment Tool**: Drag-and-drop or tap-to-cycle allocator to split the 10 family members between Car 1 and Car 2, saving state locally in your browser.
6. **Survival Phrases Card**: Useful Korean words (with phonetic spellings and English meanings) that you can click to copy to your clipboard.
7. **Interactive Packing Checklist**: Category-based checklist (Essentials, Wedding, Tech) that lets you add custom items and checks off items (saves progress automatically on your device).
8. **Print-Friendly Format**: Beautifully styled print/PDF sheet that hides buttons, banners, and interactive states to print clean travel sheets for parents.

## Getting Started

### Option A: Open Directly
Since the app is built using clean, vanilla HTML/CSS/JavaScript with zero dependencies, you can open it directly in any web browser!
1. Double-click [index.html](file:///Users/ruben/.gemini/antigravity/scratch/korea-wedding-trip-planner/index.html) or drag it into your browser.

### Option B: Local Web Server
Serving it via a local server is recommended for the best experience (e.g. correct relative asset paths and localStorage sandbox).

**Using Python:**
In your terminal, navigate to this project folder and run:
```bash
python3 -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000) in your browser.

**Using Node / npx:**
Run:
```bash
npx -y http-server -p 8000
```
Then open [http://localhost:8000](http://localhost:8000) in your browser.

## Customizing the Plan

- **Itinerary Details**: Open [index.html](file:///Users/ruben/.gemini/antigravity/scratch/korea-wedding-trip-planner/index.html) and search for the `<div class="timeline">` tag. You can easily modify the times and event descriptions.
- **Roster & Vehicle Allocator**: Open [app.js](file:///Users/ruben/.gemini/antigravity/scratch/korea-wedding-trip-planner/app.js) and modify the `defaultRoster` array to change names, roles, or group labels.
- **Survival Phrases**: Modify the `survivalPhrases` array inside [app.js](file:///Users/ruben/.gemini/antigravity/scratch/korea-wedding-trip-planner/app.js) to add or change survival words.
