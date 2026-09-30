/**
 * Civic Waste Management Store
 * Centralized reactive state manager with localStorage persistence.
 */

const STORAGE_KEYS = {
  USER: 'swachh_user_profile',
  COMPLAINTS: 'swachh_complaints_v1',
  PICKUPS: 'swachh_pickups_v1',
  PASSBOOK: 'swachh_passbook_v1',
  FLEET: 'swachh_fleet_v1',
  LANGUAGE: 'swachh_portal_lang'
};

const DEFAULT_USER = {
  isLoggedIn: true,
  role: "citizen",
  name: "Aarav Sharma",
  phone: "9876543210",
  email: "aarav.sharma@gmail.com",
  ward: "Ward 28 - Central Karol Bagh",
  city: "New Delhi",
  designation: "Citizen Guardian",
  employeeId: null,
  zone: "Zone 04 - Karol Bagh",
  ulb: "North Delhi Municipal Corporation (North DMC)",
  karmaBalance: 1450,
  freePickupsRemaining: 2,
  tier: "Level 3: Swachhata Champion",
  tierRank: "Top 5% in Ward 28",
  reportsFiled: 34,
  reportsResolved: 31
};

const DEFAULT_ADMIN_USER = {
  isLoggedIn: true,
  role: "admin",
  name: "Rajesh Kumar, IAS",
  phone: "+91 98110 54321",
  email: "rajesh.ias@delhi.gov.in",
  ward: "Ward 28 - Central Karol Bagh",
  city: "New Delhi",
  designation: "Joint Commissioner (Solid Waste Management)",
  employeeId: "MCD-ADM-2024-09",
  zone: "Zone 04 - Karol Bagh",
  ulb: "North Delhi Municipal Corporation (North DMC)",
  department: "Department of Environment & Waste Governance",
  karmaBalance: 5200,
  freePickupsRemaining: 10,
  tier: "Zonal Administrator",
  tierRank: "Executive Leadership",
  reportsFiled: 142,
  reportsResolved: 139
};

const DEFAULT_COMPLAINTS = [
  {
    id: "SBM-2026-9812",
    title: "Overflowing Public Bin & Garbage Spillover near Community Park",
    category: "Overflowing Bin",
    wasteType: "Mixed Municipal Solid Waste",
    ward: "Sector 14, Main Avenue, Urban Ward 28, New Delhi",
    severity: "High",
    status: "in_progress",
    statusLabel: "In Progress",
    stage: 3,
    loggedAt: "Today, 08:15 AM",
    slaDeadline: "Today, 12:30 PM",
    slaRemaining: "01 hr 45 min remaining",
    slaStatus: "Within SLA",
    assignedVehicle: "DL-1VC-8402 (EV Tipper)",
    assignedDriver: "Ramesh Kumar",
    driverPhone: "+91 98101 23456",
    driverEta: "14 mins",
    aiConfidence: "96.4%",
    aiVolume: "High (~2.4 m³)",
    decayRisk: "Moderate",
    latitude: 28.6139,
    longitude: 77.2090,
    beforeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuADdUw6ZLKowCGVxMj0mLFHf1vjVq5V6M_dXw5gL0rGIn5WY1o2b8HDcqURN0-Qk22pqprSr822ZLDstKNpk9RwtYYnu4i7FEgAjTTiRoPgy0FZnsmwFMOG-bLzM6rXX_9rag_SMd3NVtr_FEkDT-VPc7IDZGFRU9xopnFlvLwvecJoRnLPA_Frh-56EfdwPSn4--LfTPklLE5RbBKE2k8PFHifwb5bavxmYefXXk3SehG55pPOBM-r",
    afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxSJYZ8Fzx4GcM1737iUpLp-dgcnMiLDYNcMfvbRXqBGmsilyMnhIJyUUsPMye6XCm6yVaFg9PQfkhZ1XCGn6bOQ-8mSR-5ZaFNuWLa5b8GreGy_ZWKdQrNBkaKjsv10126ewXcug9Wfr3J6s4Gfe9dwOMSRYHIUwA3iTVXf4_jBAKWcHK2HR8hZXtFKrEPipX6lIkko6gnCIcw1tEr8Pg_qTttteJGftcQdaJqSSTZoq8xJqRVfxw",
    escalated: false,
    history: [
      {
        step: 1,
        title: "Complaint Logged",
        time: "08:15 AM • Today",
        desc: "Grievance submitted by citizen with photographic evidence and GPS location. AI geo-tagging validation completed.",
        badge: "AI Vision Scan: 96% Bin Overflow",
        done: true
      },
      {
        step: 2,
        title: "Assigned & Vehicle Dispatched",
        time: "08:32 AM • Today",
        desc: "Zonal supervisor routed EV Tipper DL-1VC-8402. Driver Ramesh Kumar en route with 3 field sanitation workers.",
        badge: "Telemetry: Driver Ack 08:33 AM",
        done: true
      },
      {
        step: 3,
        title: "In-Progress / On-Site Action",
        time: "09:05 AM • Today",
        desc: "Sanitation crew arrived at site. Mechanical bin lifting, perimeter washing and disinfectant spraying active.",
        badge: "Live GPS Tracking Active",
        done: true
      },
      {
        step: 4,
        title: "Cleared & AI Verified",
        time: "Expected by 12:30 PM",
        desc: "Post-cleaning photo verification by Sanitary Inspector and citizen feedback confirmation.",
        badge: "Pending Final Inspection",
        done: false
      }
    ]
  },
  {
    id: "SBM-2026-9799",
    title: "Dump cleared at Kailash Market Gate 2",
    category: "Open Dumpsite",
    wasteType: "Market Organic Scraps & Cardboard",
    ward: "Ward 04, Kailash Colony Market, New Delhi",
    severity: "Normal",
    status: "resolved",
    statusLabel: "Resolved & Verified",
    stage: 4,
    loggedAt: "Yesterday, 04:30 PM",
    slaDeadline: "Yesterday, 08:30 PM",
    slaRemaining: "Completed in 2.1 hrs",
    slaStatus: "SLA Met",
    assignedVehicle: "DL-1CD-5120",
    assignedDriver: "Suresh Pal",
    driverPhone: "+91 98111 88765",
    driverEta: "Resolved",
    aiConfidence: "98.1%",
    aiVolume: "Moderate (~1.8 m³)",
    decayRisk: "Low",
    latitude: 28.5529,
    longitude: 77.2412,
    beforeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHr2G2k-86qIiXLMqBpWxAroFmYNHE09M5vwze30olj6sExdAu0pxF4by19ojGbN7c6jbLIlmmR9SGp1ek7aKH9zd_cBRukHMRasbfnN3_csvGdWtgUz5btgpAgAvUnXCSgkxMoewNJcIO8rO773nYSXpX33Yw7igTAOYXRNf0OVLVu7Z9tz7ECEG5KKfYU3x4hP4SdiAQdpoCKeOX-vbnx_4pWcXWN2Fd0Vs3H5Sw3BeUM-Z7sIK6",
    afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxSJYZ8Fzx4GcM1737iUpLp-dgcnMiLDYNcMfvbRXqBGmsilyMnhIJyUUsPMye6XCm6yVaFg9PQfkhZ1XCGn6bOQ-8mSR-5ZaFNuWLa5b8GreGy_ZWKdQrNBkaKjsv10126ewXcug9Wfr3J6s4Gfe9dwOMSRYHIUwA3iTVXf4_jBAKWcHK2HR8hZXtFKrEPipX6lIkko6gnCIcw1tEr8Pg_qTttteJGftcQdaJqSSTZoq8xJqRVfxw",
    escalated: false,
    history: [
      {
        step: 1,
        title: "Complaint Logged",
        time: "04:30 PM • Yesterday",
        desc: "Citizen uploaded photographic record of market dump.",
        badge: "AI Vision Confidence: 98.1%",
        done: true
      },
      {
        step: 2,
        title: "Assigned & Vehicle Dispatched",
        time: "04:45 PM • Yesterday",
        desc: "Sanitation Compactor DL-1CD-5120 dispatched.",
        badge: "Driver Dispatched",
        done: true
      },
      {
        step: 3,
        title: "In-Progress / On-Site Action",
        time: "05:20 PM • Yesterday",
        desc: "Debris lifted and sanitization spray applied.",
        badge: "Mechanical Clearance Done",
        done: true
      },
      {
        step: 4,
        title: "Cleared & AI Verified",
        time: "06:40 PM • Yesterday",
        desc: "Sanitary inspector AI photo match verified 100% clean. Spot reopened for public.",
        badge: "Resolution Verified (+25 Karma)",
        done: true
      }
    ]
  },
  {
    id: "SBM-2026-9804",
    title: "Construction Debris blocking Ring Road pedestrian walkway",
    category: "Construction Debris",
    wasteType: "Concrete, Plaster & Brick Rubble",
    ward: "Ward 19, Lajpat Nagar Ring Road, New Delhi",
    severity: "Urgent",
    status: "pending",
    statusLabel: "Triage / Pending",
    stage: 1,
    loggedAt: "Today, 09:40 AM",
    slaDeadline: "Today, 01:40 PM",
    slaRemaining: "03 hr 30 min remaining",
    slaStatus: "Within SLA",
    assignedVehicle: "Unassigned",
    assignedDriver: "Triage In-Progress",
    driverPhone: "N/A",
    driverEta: "Queue #02",
    aiConfidence: "91.2%",
    aiVolume: "High (~3.5 m³)",
    decayRisk: "Low",
    latitude: 28.5684,
    longitude: 77.2435,
    beforeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHr2G2k-86qIiXLMqBpWxAroFmYNHE09M5vwze30olj6sExdAu0pxF4by19ojGbN7c6jbLIlmmR9SGp1ek7aKH9zd_cBRukHMRasbfnN3_csvGdWtgUz5btgpAgAvUnXCSgkxMoewNJcIO8rO773nYSXpX33Yw7igTAOYXRNf0OVLVu7Z9tz7ECEG5KKfYU3x4hP4SdiAQdpoCKeOX-vbnx_4pWcXWN2Fd0Vs3H5Sw3BeUM-Z7sIK6",
    afterImage: "",
    escalated: false,
    history: [
      {
        step: 1,
        title: "Complaint Logged",
        time: "09:40 AM • Today",
        desc: "C&D rubble reported by pedestrian. Geo-tagged at Ring Road footbridge.",
        badge: "AI Tag: C&D Debris",
        done: true
      },
      {
        step: 2,
        title: "Assigned & Vehicle Dispatched",
        time: "In Triage",
        desc: "Awaiting heavy loader truck assignment.",
        badge: "Triage Pending",
        done: false
      },
      {
        step: 3,
        title: "In-Progress / On-Site Action",
        time: "Pending",
        desc: "Crew lifting construction materials.",
        badge: "Pending",
        done: false
      },
      {
        step: 4,
        title: "Cleared & AI Verified",
        time: "Pending",
        desc: "Pedestrian walkway cleared.",
        badge: "Pending",
        done: false
      }
    ]
  }
];

const DEFAULT_PICKUPS = [
  {
    id: "EV-PICK-2026-8814",
    category: "E-Waste",
    items: "2 Laptops, 1 CRT Television, Old Chargers & Batteries",
    slot: "Tomorrow Morning (09:00 AM - 12:00 PM)",
    date: "Tomorrow",
    address: "Flat 402, Block B, Silver Crest Apartments, Sector 14",
    ward: "Ward 28 - Central Karol Bagh",
    status: "Confirmed",
    vehicle: "DL-EV-0982 (Zero Emission EV Van)",
    driver: "Anita Devi",
    driverPhone: "+91 98199 44321",
    quotaUsed: "1 Free Quota",
    bookedAt: "Today, 10:15 AM",
    karmaAwarded: 35
  }
];

const DEFAULT_PASSBOOK = [
  {
    id: "TXN-8841",
    type: "credit",
    amount: 25,
    title: "Waste report verified (#SBM-2026-9799)",
    desc: "AI visual verification confirmed clean resolution by municipal inspector.",
    date: "Yesterday 06:40 PM",
    ref: "#SBM-2026-9799"
  },
  {
    id: "TXN-8819",
    type: "credit",
    amount: 35,
    title: "Doorstep E-waste recycling pickup",
    desc: "CPCB certified responsible recycler safely collected 14 kg e-waste.",
    date: "2 days ago",
    ref: "#EV-PICK-2026-8814"
  },
  {
    id: "TXN-8762",
    type: "credit",
    amount: 50,
    title: "7-Day 100% Home Waste Segregation streak",
    desc: "Verified by ward sanitation tipper scanner during morning round.",
    date: "5 days ago",
    ref: "STREAK-W28"
  },
  {
    id: "TXN-8701",
    type: "debit",
    amount: -100,
    title: "Redeemed for ₹100 Delhi Metro Smart Card Recharge",
    desc: "Voucher DMRC-SBM-9182 applied successfully to metro smart card.",
    date: "1 week ago",
    ref: "REDEEM-METRO-100"
  },
  {
    id: "TXN-8650",
    type: "credit",
    amount: 100,
    title: "Ward 28 Community Cleanliness Drive participation",
    desc: "Participated in Karol Bagh neighborhood park rehabilitation campaign.",
    date: "2 weeks ago",
    ref: "DRIVE-KB-OCT"
  }
];

const DEFAULT_FLEET = [
  {
    id: "DL-1VC-8402",
    type: "EV Tipper Truck",
    driver: "Ramesh Kumar",
    phone: "+91 98101 23456",
    battery: "82%",
    capacity: 78,
    status: "En Route",
    location: "Sector 14 Main Road",
    assignedTicket: "SBM-2026-9812",
    lat: 28.6145,
    lng: 77.2085
  },
  {
    id: "DL-1CD-5120",
    type: "Heavy Compactor",
    driver: "Suresh Pal",
    phone: "+91 98111 88765",
    battery: "64%",
    capacity: 92,
    status: "Offloading",
    location: "Karol Bagh Transfer Station",
    assignedTicket: "None",
    lat: 28.6500,
    lng: 77.1900
  },
  {
    id: "DL-3EV-1109",
    type: "E-Cart Doorstep",
    driver: "Anita Devi",
    phone: "+91 98199 44321",
    battery: "91%",
    capacity: 45,
    status: "Doorstep Pickup",
    location: "Sector 14 Block C",
    assignedTicket: "EV-PICK-2026-8814",
    lat: 28.6150,
    lng: 77.2070
  },
  {
    id: "DL-1VB-9014",
    type: "Mechanical Road Sweeper",
    driver: "Mohan Lal",
    phone: "+91 98122 77654",
    battery: "74%",
    capacity: 60,
    status: "Sweeping Active",
    location: "Karol Bagh Main Market",
    assignedTicket: "None",
    lat: 28.6520,
    lng: 77.1950
  },
  {
    id: "DL-2EV-4031",
    type: "Bio-Hazard EV Van",
    driver: "Vikram Singh",
    phone: "+91 98144 55667",
    battery: "88%",
    capacity: 20,
    status: "Standby Depot",
    location: "Civil Lines Station",
    assignedTicket: "None",
    lat: 28.6700,
    lng: 77.2200
  },
  {
    id: "DL-1VC-3321",
    type: "EV Tipper Truck",
    driver: "Sunil Verma",
    phone: "+91 98177 33221",
    battery: "55%",
    capacity: 84,
    status: "En Route",
    location: "Patel Nagar East",
    assignedTicket: "SBM-2026-9804",
    lat: 28.6480,
    lng: 77.1700
  }
];

const WASTE_ITEMS_DB = [
  // Wet Waste (Green)
  { name: "Vegetable Peels & Scraps", bin: "green", binLabel: "Green Bin (Wet)", tip: "100% compostable. Keep unbagged or use compostable liner.", icon: "nutrition" },
  { name: "Used Tea Leaves & Coffee Grounds", bin: "green", binLabel: "Green Bin (Wet)", tip: "Excellent for garden composting. Rich in nitrogen.", icon: "coffee" },
  { name: "Fruit Rinds & Seeds", bin: "green", binLabel: "Green Bin (Wet)", tip: "Citrus peels take longer; chop into smaller pieces for faster composting.", icon: "eco" },
  { name: "Eggshells", bin: "green", binLabel: "Green Bin (Wet)", tip: "Crush finely to enrich compost soil with calcium carbonate.", icon: "egg" },
  { name: "Cooked Food Leftovers", bin: "green", binLabel: "Green Bin (Wet)", tip: "Drain excess liquids/gravy before putting into wet bin.", icon: "restaurant" },
  { name: "Bread, Roti & Rice", bin: "green", binLabel: "Green Bin (Wet)", tip: "Biodegradable organic matter. Great for home composting.", icon: "bakery_dining" },
  { name: "Chicken Bones & Fish Bones", bin: "green", binLabel: "Green Bin (Wet)", tip: "Wet waste for municipal biogas and central composting digesters.", icon: "set_meal" },
  { name: "Garden Grass Cuttings & Fallen Leaves", bin: "green", binLabel: "Green Bin (Wet)", tip: "Dry leaves can be stored as brown carbon layer for composting.", icon: "yard" },
  { name: "Coconut Shells & Husks", bin: "green", binLabel: "Green Bin (Wet)", tip: "Slow to decompose, but organic. Can be used for mulching.", icon: "nature" },
  { name: "Flowers & Puja Offerings (Nirmalya)", bin: "green", binLabel: "Green Bin (Wet)", tip: "Deposit in green bin or dedicated temple compost collection bins.", icon: "local_florist" },
  
  // Dry Waste (Blue)
  { name: "Clean Pizza Box (Top Lid)", bin: "blue", binLabel: "Blue Bin (Dry)", tip: "Tear off clean cardboard lid for recycling. Greasy bottom goes to wet waste!", icon: "local_pizza" },
  { name: "Aluminum Beverage Cans", bin: "blue", binLabel: "Blue Bin (Dry)", tip: "100% infinitely recyclable. Rinse lightly and crush to save space.", icon: "local_drink" },
  { name: "Plastic Water & Soda Bottles (PET)", bin: "blue", binLabel: "Blue Bin (Dry)", tip: "Empty, rinse, crush, and keep the cap on for recycling.", icon: "water_bottle" },
  { name: "Milk & Juice Tetra Paks", bin: "blue", binLabel: "Blue Bin (Dry)", tip: "Rinse inside and flatten. High-grade paper pulp & polymer recovery.", icon: "inventory_2" },
  { name: "Newspapers & Magazines", bin: "blue", binLabel: "Blue Bin (Dry)", tip: "Keep clean and dry. Avoid bundling with non-recyclable tape.", icon: "menu_book" },
  { name: "Cardboard Delivery Boxes", bin: "blue", binLabel: "Blue Bin (Dry)", tip: "Remove plastic shipping tape and flatten cardboard before disposal.", icon: "package_2" },
  { name: "Glass Bottles & Jars", bin: "blue", binLabel: "Blue Bin (Dry)", tip: "Rinse food residue. Do not break; broken glass requires wrapping.", icon: "liquor" },
  { name: "Aluminum Foil (Clean)", bin: "blue", binLabel: "Blue Bin (Dry)", tip: "Roll clean foil into a ball of at least 5cm diameter so sorting machines catch it.", icon: "lunch_dining" },
  { name: "Plastic Shampoo & Detergent Bottles", bin: "blue", binLabel: "Blue Bin (Dry)", tip: "High Density Polyethylene (HDPE). Wash residue before binning.", icon: "soap" },
  { name: "Tin Cans & Metal Bottle Caps", bin: "blue", binLabel: "Blue Bin (Dry)", tip: "Valuable scrap metal. Rinse and dry.", icon: "circle" },
  { name: "Polythene Bags & Shrink Wrap", bin: "blue", binLabel: "Blue Bin (Dry)", tip: "Dry clean plastic film. Bundle together for municipal recycling.", icon: "shopping_bag" },

  // Domestic Hazardous & Sanitary (Red/Orange)
  { name: "Lithium & Alkaline AA/AAA Batteries", bin: "hazardous", binLabel: "Red Bin (Hazardous)", tip: "Tape battery terminals to prevent short-circuit fire hazard. Drop in e-waste bin.", icon: "battery_alert" },
  { name: "Expired Medicines & Syrup Bottles", bin: "hazardous", binLabel: "Red Bin (Hazardous)", tip: "Do NOT flush down drains. Put blister packs in red domestic hazard bin.", icon: "medication" },
  { name: "Sanitary Napkins & Baby Diapers", bin: "hazardous", binLabel: "Red Bin (Hazardous)", tip: "Wrap securely in newspaper with a red dot mark for sanitary incinerators.", icon: "health_and_safety" },
  { name: "CFL & Fluorescent Tubelights", bin: "hazardous", binLabel: "Red Bin (Hazardous)", tip: "Contains toxic mercury vapor. Wrap in cardboard to prevent breakage.", icon: "lightbulb" },
  { name: "Aerosol Insecticide & Deodorant Cans", bin: "hazardous", binLabel: "Red Bin (Hazardous)", tip: "Do not puncture or incinerate. Flammable pressurized hazard.", icon: "cleaning_services" },
  { name: "Paint Cans & Chemical Thinner", bin: "hazardous", binLabel: "Red Bin (Hazardous)", tip: "Hazardous domestic waste. Let leftover paint dry or hand to special pickup.", icon: "format_paint" },
  { name: "Syringes, Needles & Lancet Pins", bin: "hazardous", binLabel: "Red Bin (Hazardous)", tip: "Place in puncture-proof plastic bottle before placing in red bin.", icon: "vaccines" },
  { name: "Broken Glass & Mirrors", bin: "hazardous", binLabel: "Red Bin (Hazardous)", tip: "Wrap in newspaper and label clearly to protect municipal sanitation workers' hands.", icon: "warning" },
  { name: "Old Thermometer (Mercury)", bin: "hazardous", binLabel: "Red Bin (Hazardous)", tip: "Toxic heavy metal. Keep unbroken and hand directly to e-waste collector.", icon: "device_thermostat" }
];

class WasteStore {
  constructor() {
    this.user = this.load(STORAGE_KEYS.USER, DEFAULT_USER);
    this.complaints = this.load(STORAGE_KEYS.COMPLAINTS, DEFAULT_COMPLAINTS);
    this.pickups = this.load(STORAGE_KEYS.PICKUPS, DEFAULT_PICKUPS);
    this.passbook = this.load(STORAGE_KEYS.PASSBOOK, DEFAULT_PASSBOOK);
    this.fleet = this.load(STORAGE_KEYS.FLEET, DEFAULT_FLEET);
    this.language = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
    this.listeners = [];
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn("Error reading localStorage", key, e);
      return fallback;
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(this.complaints));
      localStorage.setItem(STORAGE_KEYS.PICKUPS, JSON.stringify(this.pickups));
      localStorage.setItem(STORAGE_KEYS.PASSBOOK, JSON.stringify(this.passbook));
      localStorage.setItem(STORAGE_KEYS.FLEET, JSON.stringify(this.fleet));
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, this.language);
    } catch (e) {
      console.warn("Error saving to localStorage", e);
    }
    this.notify();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(this); } catch (e) { console.error(e); }
    });
  }

  setLanguage(lang) {
    this.language = lang;
    this.save();
  }

  // --- Complaint Operations ---
  getComplaint(id) {
    if (!id) return this.complaints[0];
    const cleanId = id.trim().toUpperCase().replace('#', '');
    return this.complaints.find(c => c.id.replace('#', '') === cleanId) || null;
  }

  addComplaint(data) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `SBM-2026-${randomSuffix}`;
    
    // SLA calculation: 4 hours from now
    const now = new Date();
    const slaTime = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    const timeStr = slaTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newComplaint = {
      id: newId,
      title: data.title || `${data.category || 'Waste'} reported at ${data.ward || 'Ward 28'}`,
      category: data.category || "Overflowing Bin",
      wasteType: data.wasteType || "Mixed Municipal Waste",
      ward: data.ward || "Sector 14, Urban Ward 28, New Delhi",
      severity: data.severity || "Normal",
      status: "pending",
      statusLabel: "Triage / Pending",
      stage: 1,
      loggedAt: "Just now",
      slaDeadline: `Today, ${timeStr}`,
      slaRemaining: "04 hr 00 min remaining",
      slaStatus: "Within SLA",
      assignedVehicle: "Unassigned (Auto-Routing)",
      assignedDriver: "Zonal Dispatch in Progress",
      driverPhone: "+91 98100 11969",
      driverEta: "15-20 mins",
      aiConfidence: data.aiConfidence || "95.2%",
      aiVolume: data.aiVolume || "Moderate (~1.5 m³)",
      decayRisk: data.decayRisk || "Low",
      latitude: data.latitude || 28.6139,
      longitude: data.longitude || 77.2090,
      beforeImage: data.photoUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuADdUw6ZLKowCGVxMj0mLFHf1vjVq5V6M_dXw5gL0rGIn5WY1o2b8HDcqURN0-Qk22pqprSr822ZLDstKNpk9RwtYYnu4i7FEgAjTTiRoPgy0FZnsmwFMOG-bLzM6rXX_9rag_SMd3NVtr_FEkDT-VPc7IDZGFRU9xopnFlvLwvecJoRnLPA_Frh-56EfdwPSn4--LfTPklLE5RbBKE2k8PFHifwb5bavxmYefXXk3SehG55pPOBM-r",
      afterImage: "",
      escalated: false,
      history: [
        {
          step: 1,
          title: "Complaint Logged",
          time: "Just now",
          desc: "Grievance submitted by citizen with photographic evidence and GPS location. AI geo-tagging validation completed.",
          badge: `AI Scan: ${data.category || 'Waste'} (${data.aiConfidence || '95%'})`,
          done: true
        },
        {
          step: 2,
          title: "Assigned & Vehicle Dispatched",
          time: "Pending Dispatch",
          desc: "Zonal dispatcher is routing the nearest available EV Tipper van.",
          badge: "Queue Position #1",
          done: false
        },
        {
          step: 3,
          title: "In-Progress / On-Site Action",
          time: "Pending",
          desc: "Sanitation crew will clean, lift waste, and wash perimeter.",
          badge: "Pending",
          done: false
        },
        {
          step: 4,
          title: "Cleared & AI Verified",
          time: `Expected by ${timeStr}`,
          desc: "Sanitary Inspector verifies clean site before closing grievance.",
          badge: "Pending Inspection",
          done: false
        }
      ]
    };

    this.complaints.unshift(newComplaint);
    
    // Reward points
    this.user.karmaBalance += 25;
    this.user.reportsFiled += 1;

    // Add passbook record
    this.passbook.unshift({
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: "credit",
      amount: 25,
      title: `Waste report logged (#${newId})`,
      desc: `Geo-verified report for ${newComplaint.category} at ${newComplaint.ward}.`,
      date: "Just now",
      ref: `#${newId}`
    });

    this.save();
    return newComplaint;
  }

  updateComplaintStatus(id, newStatus, newStage, vehicleInfo) {
    const comp = this.getComplaint(id);
    if (!comp) return false;

    comp.status = newStatus;
    comp.stage = newStage;
    if (newStatus === 'in_progress') {
      comp.statusLabel = "In Progress";
      if (vehicleInfo) {
        comp.assignedVehicle = vehicleInfo.vehicle || comp.assignedVehicle;
        comp.assignedDriver = vehicleInfo.driver || comp.assignedDriver;
        comp.driverPhone = vehicleInfo.phone || comp.driverPhone;
      }
      comp.history[1].done = true;
      comp.history[1].time = "Updated just now";
      comp.history[2].done = true;
      comp.history[2].time = "Active now";
    } else if (newStatus === 'resolved') {
      comp.statusLabel = "Resolved & Verified";
      comp.stage = 4;
      comp.slaStatus = "SLA Met";
      comp.slaRemaining = "Resolved within target SLA";
      comp.afterImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuBxSJYZ8Fzx4GcM1737iUpLp-dgcnMiLDYNcMfvbRXqBGmsilyMnhIJyUUsPMye6XCm6yVaFg9PQfkhZ1XCGn6bOQ-8mSR-5ZaFNuWLa5b8GreGy_ZWKdQrNBkaKjsv10126ewXcug9Wfr3J6s4Gfe9dwOMSRYHIUwA3iTVXf4_jBAKWcHK2HR8hZXtFKrEPipX6lIkko6gnCIcw1tEr8Pg_qTttteJGftcQdaJqSSTZoq8xJqRVfxw";
      comp.history.forEach(h => h.done = true);
      comp.history[3].time = "Completed just now";
      this.user.reportsResolved += 1;
    }

    this.save();
    return true;
  }

  escalateComplaint(id, reason) {
    const comp = this.getComplaint(id);
    if (!comp) return false;

    comp.escalated = true;
    comp.severity = "Critical Hotspot";
    comp.slaRemaining = "Priority Escalation: Zonal Alert Sent";
    comp.statusLabel = "Escalated to Zonal Officer";
    this.save();
    return true;
  }

  // --- Doorstep Pickup Operations ---
  addPickup(data) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `EV-PICK-2026-${randomSuffix}`;

    const newPickup = {
      id: newId,
      category: data.category || "E-Waste",
      items: data.items || "Household bulk recyclables",
      slot: data.slot || "Tomorrow Morning (09:00 AM - 12:00 PM)",
      date: data.date || "Tomorrow",
      address: data.address || "Sector 14, Ward 28, New Delhi",
      ward: data.ward || "Ward 28 - Central Karol Bagh",
      status: "Confirmed",
      vehicle: "DL-EV-0982 (Zero Emission EV Van)",
      driver: "Anita Devi",
      driverPhone: "+91 98199 44321",
      quotaUsed: "1 Free Quota",
      bookedAt: "Just now",
      karmaAwarded: 35
    };

    if (this.user.freePickupsRemaining > 0) {
      this.user.freePickupsRemaining -= 1;
    }

    this.user.karmaBalance += 35;
    this.pickups.unshift(newPickup);

    this.passbook.unshift({
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: "credit",
      amount: 35,
      title: `Special Doorstep Pickup Booked (#${newId})`,
      desc: `Special collection scheduled for ${newPickup.category}. Free quota applied.`,
      date: "Just now",
      ref: `#${newId}`
    });

    this.save();
    return newPickup;
  }

  // --- Rewards Redemption ---
  redeemReward(rewardId, pointsCost, title) {
    if (this.user.karmaBalance < pointsCost) {
      return { success: false, message: "Insufficient Green Karma balance" };
    }

    this.user.karmaBalance -= pointsCost;
    const voucherCode = `SBM-${rewardId.toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    this.passbook.unshift({
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: "debit",
      amount: -pointsCost,
      title: `Redeemed: ${title}`,
      desc: `Voucher Code: ${voucherCode}. Valid for 90 days.`,
      date: "Just now",
      ref: voucherCode
    });

    this.save();
    return { success: true, voucherCode, balance: this.user.karmaBalance };
  }

  // --- Auth Simulation ---
  login(name, phone, ward) {
    return this.loginCitizen({ name, phone, ward });
  }

  loginCitizen(data = {}) {
    this.user = {
      ...this.user,
      ...DEFAULT_USER,
      ...data,
      isLoggedIn: true,
      role: "citizen"
    };
    this.save();
    return this.user;
  }

  loginAdmin(data = {}) {
    this.user = {
      ...this.user,
      ...DEFAULT_ADMIN_USER,
      ...data,
      isLoggedIn: true,
      role: "admin"
    };
    this.save();
    return this.user;
  }

  switchRole(role) {
    if (role === 'admin') {
      return this.loginAdmin();
    } else {
      return this.loginCitizen();
    }
  }

  logout() {
    this.user.isLoggedIn = false;
    this.save();
  }

  isAdmin() {
    return !!(this.user && this.user.isLoggedIn && this.user.role === 'admin');
  }

  isCitizen() {
    return !!(this.user && this.user.isLoggedIn && this.user.role === 'citizen');
  }
}

// Global window singleton
window.wasteStore = new WasteStore();
window.WASTE_ITEMS_DB = WASTE_ITEMS_DB;
