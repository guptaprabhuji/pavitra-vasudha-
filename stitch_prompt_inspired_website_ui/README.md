# पवित्र वसुथा (Pavitra Vasutha) - Integrated Waste Management Portal 🌿🇮🇳
### Official Civic Technology Ecosystem (MoHUA & Urban Local Bodies)

A modern, institutional civic technology platform that establishes transparent, bi-directional communication between citizens, municipal field sanitation workers, and urban governance administrators.

---

## 🌟 Key Functional Capabilities

1. **AI-Powered 1-Click Waste Reporting (`#report-waste`)**
   - **Machine Vision Classification:** Upload or capture photo; simulated AI vision classifies waste type (e.g., Overflowing Public Dumpster, Open Dumpsite, C&D Debris), predicts confidence score (96.8%), volume (~2.4 m³), and organic decay smell risk.
   - **Precise Geolocation:** Automatically detects municipal ward coordinates (Ward 28, Delhi) with high-accuracy satellite fix (±2.4m) and interactive map pin.
   - **Instant Ticket & Karma Award:** Generates real tracking reference ID (e.g., `#SBM-2026-9824`), starts a 4-hour SLA resolution clock, and credits **+25 Green Karma** to the citizen wallet.

2. **Doorstep Waste Pickup Scheduler (`#pickup-request`)**
   - **Stream-Specific Segregation:** Book dedicated zero-emission EV trucks for domestic E-Waste (CPCB recycler authorized), bulky furniture, renovation C&D debris, and garden cuttings.
   - **Quarterly Citizen Quota:** Tracks free quota (2 of 2 free pickups per quarter).
   - **Printable Municipal Receipt:** Generates printable/downloadable collection receipt with QR code, assigned EV tipper registration, and driver details.

3. **Live Grievance Tracking & SLA Timeline (`#track-complaint`)**
   - **4-Stage Milestone Stepper:** Live visual tracking from *Complaint Logged* &rarr; *Driver Dispatched* &rarr; *In-Progress / On-Site Action* &rarr; *AI Verified Cleaned*.
   - **Vehicle Radar & Telemetry:** Shows vehicle registration (`DL-1VC-8402`), driver contact with quick Call/SMS simulation, and dynamic ETA.
   - **Before & After Visual Proof:** Side-by-side photographic inspection comparing reported waste with inspector-verified clean site.
   - **Emergency SLA Escalation:** One-click escalation modal notifying the Zonal Joint Commissioner with priority flag.

4. **Swachhata Cleanliness Points & Green Karma (`#green-karma-rewards`)**
   - **Live Civic Wallet:** Tracks available Green Karma points balance (1,450+ pts) and progress meter toward *Gold Civic Guardian* status.
   - **Redemption Catalog:** Instant redemption for 10% Municipal Property Tax rebates, ₹100 Delhi Metro smart card balance, Home Composting kits, and Solar Garden lights with unique digital voucher codes.
   - **Passbook History:** Real-time audit ledger of all credits and debits with transaction IDs and dates.

5. **3-Bin Segregation Guide & Quick Finder (`#awareness-guide`)**
   - **The 3-Bin Formula:** Color-coded guide for Green (Wet/Biodegradable), Blue (Dry/Recyclable), and Red/Orange (Domestic Hazardous & Sanitary).
   - **Live Search Classifier:** Real-time search engine matching 50+ household items (e.g. *Pizza Box*, *Expired Medicine*, *Eggshells*, *Lithium Batteries*, *Tetra Paks*) with disposal tips.
   - **DIY Home Composting Walkthrough:** 4-step interactive guide to turning kitchen scraps into organic humus in 30 days.

6. **Municipal Command & Control Console (`#admin-portal`)**
   - **Ward 28 Telemetry:** Real-time tracking of 184 active vehicles, daily waste tonnage (1,840 MT), and SLA compliance (98.2%).
   - **Hotspot Heatmap:** Interactive map with hotspot markers and quick dispatch options.
   - **Live Triage Queue:** Inspect incoming complaints, dispatch fleet trucks, escalate urgency, and mark tickets as resolved. Actions immediately sync with citizen tracking!

7. **Bilingual Engine (English & Hindi)**
   - Includes official Government bilingual modal (`अपनी भाषा चुनें / Select Language`) and instant header switcher (`EN` / `हिन्दी`).
   - Persists language preference in `localStorage`.

8. **Dual-Role Citizen & Municipal Admin Login Portal (`#login` / `/login.html`)**
   - **Citizen Mobile & OTP Authentication**: Mobile verification with SMS countdown timer, auto-fill demo OTP (`123456`), auto-ward assignment, and 1-click citizen demo login (`Aarav Sharma - Ward 28`).
   - **Municipal Officer Credentials**: ULB corporation selector (North DMC, NDMC, MCD), officer email (`rajesh.ias@delhi.gov.in`), PIN password, and NIC Parichay 2FA token with 1-click officer authorization (`Rajesh Kumar, IAS - Joint Commissioner`).
   - **Interactive User Profile Dropdown**: Dynamic header badge showing active role (Citizen vs Officer), account status, quick switch, and secure session logout.

---

## 🚀 How to Run the Website

### Option 1: Direct in Any Web Browser (Offline-Ready)
Simply double-click or open `index.html` in Chrome, Edge, Firefox, or Safari:
```
file:///path/to/stitch_prompt_inspired_website_ui/index.html
```

### Option 2: Local Web Server (Node.js)
Double-click `start.bat` or run:
```bash
node server.js
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗺️ Interactive GIS Maps
The portal features 3 fully interactive Leaflet GIS maps with local asset bundling:
1. **Live Municipal Hotspot Radar (`#home`)**: Live street-level map of Ward 28 (Karol Bagh) displaying real-time grievance status markers, density tolerance zones, and EV Tipper telemetry with 1-click tracking.
2. **Citizen Pinpoint Geolocation (`#report-waste`)**: Draggable pin & click-to-place map updating GPS coordinates and municipal ward data in real time.
3. **Live Vehicle Route Telemetry (`#track-complaint`)**: Dynamic map plotting the grievance location, dispatched collection vehicle, and dashed route polyline with driver ETA.

---

## 📁 Project Architecture

```
stitch_prompt_inspired_website_ui/
├── index.html                   # Master Application Shell (SPA with 8 Views)
├── login.html                   # Standalone Route: Citizen & Admin Login
├── report-waste.html            # Standalone Route: Lodge Waste Issue
├── pickup-request.html          # Standalone Route: Doorstep Pickup
├── track-complaint.html         # Standalone Route: Grievance Tracking
├── green-karma-rewards.html     # Standalone Route: Rewards & Passbook
├── awareness-guide.html         # Standalone Route: 3-Bin Classifier
├── admin-dashboard.html         # Standalone Route: Admin Console
├── server.js                    # Built-in zero-dependency Node.js HTTP server
├── start.bat                    # One-click Windows launcher
├── package.json                 # Project configuration & npm scripts
├── css/
│   ├── styles.css               # Design tokens, laser scan animations, toasts, leaflet styles
│   ├── leaflet.css              # Local Leaflet 1.9.4 CSS
│   └── images/                  # Marker and layer icons for offline-ready maps
├── js/
│   ├── store.js                 # Central reactive state manager & localStorage
│   ├── i18n.js                  # English & Hindi translation engine
│   ├── leaflet.js               # Local Leaflet 1.9.4 JavaScript library
│   └── app.js                   # UI router, Leaflet map controllers, simulated AI engine
└── civic_waste_portal/
    └── DESIGN.md                # Official Government Design System specifications
```

---

## 🎨 Design System Specifications

- **Primary Eco-Green:** `#00652c` / `#15803d` (Signifying environmental health & verified resolution)
- **Civic Navy Dark:** `#0A1B2C` (Institutional authority, structural integrity)
- **Status Progress:** `#0284C7` (Vehicle dispatched / en route)
- **Alert Amber:** `#D97706` (Triage / High severity)
- **Status Critical:** `#DC2626` (Overdue SLA / Bio hazard)
- **Waste Stream Triad:**
  - Wet Waste: `#16A34A`
  - Dry Waste: `#2563EB`
  - Hazardous Waste: `#EA580C`
- **Typography:** `Plus Jakarta Sans` (Headlines, large counters) & `Inter` (Body, labels, data tables)
