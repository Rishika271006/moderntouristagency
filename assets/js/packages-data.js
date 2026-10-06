/**
 * MORDEN TOURIST (mordentourist.com) - Packages Data & Management System
 * Shared state between Public Pages and Admin Panel
 */

const DEFAULT_PACKAGES = [
  {
    id: "pkg-yas-island",
    title: "Yas Island Thrills & Marina",
    location: "Abu Dhabi Archipelago, UAE",
    category: "family arabian luxury",
    badge: "Theme Park Capital",
    badgeClass: "highlight",
    rating: 4.9,
    price: 48999,
    priceFormatted: "₹48,999",
    priceUnit: "/person",
    image: "assets/images/destinations/yas-island.jpg",
    description: "Home to Ferrari World, Warner Bros. World™, Yas Waterworld, SeaWorld Abu Dhabi, and the famous Yas Marina Formula 1 circuit.",
    features: [
      { icon: "fa-car-burst", text: "F1 Circuit" },
      { icon: "fa-water", text: "Waterworld" },
      { icon: "fa-hotel", text: "Luxury Resorts" }
    ],
    inclusions: ["3 Nights 4-Star / 5-Star Stay", "2-Day Multi-Park Access Pass", "Private Airport & Island Transfers", "Daily Buffet Breakfast"],
    status: "active"
  },
  {
    id: "pkg-saadiyat-island",
    title: "Saadiyat Island Cultural Sanctuary",
    location: "Cultural District, Abu Dhabi",
    category: "culture luxury arabian",
    badge: "Cultural Haven",
    badgeClass: "",
    rating: 4.95,
    price: 64500,
    priceFormatted: "₹64,500",
    priceUnit: "/person",
    image: "assets/images/destinations/saadiyat-island.jpg",
    description: "Pristine white sand shores home to Hawksbill turtles, alongside world-renowned Louvre Abu Dhabi and ultra-luxurious private beachfront suites.",
    features: [
      { icon: "fa-monument", text: "Louvre Museum" },
      { icon: "fa-sun", text: "White Sands" },
      { icon: "fa-champagne-glasses", text: "5-Star Beach Clubs" }
    ],
    inclusions: ["4 Nights St. Regis / Jumeirah Stay", "Skip-the-line Louvre Passes", "Exclusive Beach Club Day Access", "Private Chauffeur Service"],
    status: "active"
  },
  {
    id: "pkg-sir-bani-yas",
    title: "Sir Bani Yas Island Wildlife Safari",
    location: "Al Dhafra Region, UAE",
    category: "adventure luxury arabian",
    badge: "Royal Nature Reserve",
    badgeClass: "highlight",
    rating: 4.88,
    price: 78000,
    priceFormatted: "₹78,000",
    priceUnit: "/person",
    image: "assets/images/destinations/sir-bani-yas.jpg",
    description: "One of the region's largest natural reserves. Safari across rugged valleys with free-roaming Arabian Oryx, cheetahs, giraffes, and luxury tented villas.",
    features: [
      { icon: "fa-paw", text: "Wildlife Safari" },
      { icon: "fa-horse", text: "Equestrian Center" },
      { icon: "fa-sailboat", text: "Seaplane Access" }
    ],
    inclusions: ["3 Nights Anantara Luxury Villa", "2 Guided Wildlife Safari 4x4 Drives", "Island Ferry Transfers", "Archery & Nature Walk Experience"],
    status: "active"
  },
  {
    id: "pkg-jubail-mangroves",
    title: "Jubail Island Mangrove Park",
    location: "Jubail Island, Abu Dhabi",
    category: "adventure arabian",
    badge: "Eco-Reserve",
    badgeClass: "",
    rating: 4.85,
    price: 32000,
    priceFormatted: "₹32,000",
    priceUnit: "/person",
    image: "assets/images/destinations/jubail-mangroves.jpg",
    description: "Meandering wooden boardwalks, kayak excursions through lush tidal estuaries, bird watching, and serene stargazing under clear desert-island skies.",
    features: [
      { icon: "fa-person-kayaking", text: "Night Kayaking" },
      { icon: "fa-shoe-prints", text: "Boardwalk Trail" },
      { icon: "fa-leaf", text: "Eco Education" }
    ],
    inclusions: ["Guided Sunset Kayaking Tour", "Boardwalk Priority Passes", "Return Hotel Transfers", "Specialist Naturalist Guide"],
    status: "active"
  },
  {
    id: "pkg-havelock-island",
    title: "Havelock & Neil Island Paradise",
    location: "Andaman & Nicobar, India",
    category: "luxury adventure tropical",
    badge: "Top Tropical Gem",
    badgeClass: "highlight",
    rating: 4.92,
    price: 38500,
    priceFormatted: "₹38,500",
    priceUnit: "/person",
    image: "assets/images/destinations/havelock-island.jpg",
    description: "Asia's best Radhanagar beach, live coral reef scuba diving, bioluminescent night kayaking, and tranquil private beach cottages surrounded by rainforest.",
    features: [
      { icon: "fa-fish", text: "Scuba Diving" },
      { icon: "fa-ship", text: "Catamaran Cruise" },
      { icon: "fa-umbrella-beach", text: "Radhanagar Beach" }
    ],
    inclusions: ["5 Nights Beach Cottage Stays", "Makruzz High-Speed Cruise Ferry", "PADI Discover Scuba Dive Session", "All Forest Entry Permits"],
    status: "active"
  },
  {
    id: "pkg-bangaram-atoll",
    title: "Bangaram & Agatti Coral Lagoon",
    location: "Lakshadweep Archipelago, India",
    category: "luxury adventure tropical",
    badge: "Untouched Atoll",
    badgeClass: "",
    rating: 4.97,
    price: 42000,
    priceFormatted: "₹42,000",
    priceUnit: "/person",
    image: "assets/images/destinations/bangaram-atoll.jpg",
    description: "Breathtaking turquoise lagoons, teardrop-shaped coral atolls, deep-sea snorkeling, and exclusive eco-resorts with hassle-free permits handled by our team.",
    features: [
      { icon: "fa-passport", text: "Permits Handled" },
      { icon: "fa-mask-snorkel", text: "Snorkeling" },
      { icon: "fa-wind", text: "Speedboat Rides" }
    ],
    inclusions: ["4 Nights Beachfront Villa", "Government Island Entry Permits", "Airport to Island Speedboat Boat", "All Meals & Snorkel Gear"],
    status: "active"
  },
  {
    id: "pkg-al-maya",
    title: "Al Maya Island Resort",
    location: "Abu Dhabi Private Island",
    category: "luxury arabian",
    badge: "Private Beach Retreat",
    badgeClass: "",
    rating: 4.82,
    price: 39000,
    priceFormatted: "₹39,000",
    priceUnit: "/person",
    image: "assets/images/destinations/al-maya.jpg",
    description: "Accessible via private boat transfer, Al Maya offers exclusive beach cabanas, crystal swimming pools, gazelles on the coastline, and sunset weekend vibes.",
    features: [
      { icon: "fa-ship", text: "Boat Cruise" },
      { icon: "fa-umbrella-beach", text: "Private Cabanas" },
      { icon: "fa-martini-glass", text: "Pool Club" }
    ],
    inclusions: ["Private Boat Cruise Transfers", "Dedicated Sunbed & Cabana", "Complimentary Welcome Drink", "Resort Pool Access"],
    status: "active"
  },
  {
    id: "pkg-dalma-island",
    title: "Dalma Island Heritage Experience",
    location: "Historical Western Archipelago",
    category: "culture adventure arabian",
    badge: "Heritage & History",
    badgeClass: "",
    rating: 4.79,
    price: 35000,
    priceFormatted: "₹35,000",
    priceUnit: "/person",
    image: "assets/images/destinations/dalma-island.jpg",
    description: "One of the oldest permanently inhabited islands in the UAE, famous for historic pearling routes, ancient Islamic architecture, and quiet date farms.",
    features: [
      { icon: "fa-monument", text: "Pearl Museum" },
      { icon: "fa-mosque", text: "Historic Mosques" },
      { icon: "fa-ferry", text: "Scenic Ferry" }
    ],
    inclusions: ["Guided Historical Tour", "Ferry Booking & Land Transport", "Traditional Emirati Lunch", "Museum Entrance Passes"],
    status: "active"
  },
  {
    id: "pkg-nurai-island",
    title: "Zaya Nurai Ultra-Luxury Island",
    location: "Arabian Gulf, Abu Dhabi",
    category: "luxury arabian",
    badge: "VIP Exclusive",
    badgeClass: "highlight",
    rating: 4.98,
    price: 95000,
    priceFormatted: "₹95,000",
    priceUnit: "/person",
    image: "assets/images/destinations/nurai-island.jpg",
    description: "Often nicknamed the Maldives of the Middle East. Features palatial overwater ocean villas, private infinity plunge pools, and world-class beachfront dining.",
    features: [
      { icon: "fa-water-ladder", text: "Infinity Pool" },
      { icon: "fa-spa", text: "Floating Spa" },
      { icon: "fa-utensils", text: "Fine Dining" }
    ],
    inclusions: ["Speedboat Charter from Saadiyat", "Overwater Villa Day Stays", "3-Course Seaside Lunch", "Complimentary Spa Credit"],
    status: "active"
  },
  {
    id: "pkg-al-maryah",
    title: "Al Maryah Island Lifestyle & Promenade",
    location: "Central Business Bay, Abu Dhabi",
    category: "culture luxury arabian",
    badge: "Urban Waterfront",
    badgeClass: "",
    rating: 4.86,
    price: 45000,
    priceFormatted: "₹45,000",
    priceUnit: "/person",
    image: "assets/images/destinations/al-maryah.jpg",
    description: "The capital's premium financial and lifestyle destination, boasting luxury retail at The Galleria, four Seasons and Rosewood stays, and waterfront dining.",
    features: [
      { icon: "fa-bag-shopping", text: "The Galleria Mall" },
      { icon: "fa-hotel", text: "Four Seasons Hotel" },
      { icon: "fa-champagne-glasses", text: "Michelin Dining" }
    ],
    inclusions: ["3 Nights 5-Star Hotel Stay", "Fine Dining Dinner Voucher", "VIP Shopping Concierge Access", "Executive Airport Transfers"],
    status: "active"
  },
  {
    id: "pkg-grand-island-goa",
    title: "Grand Island Scuba & Dolphin Excursion",
    location: "Goa Coastal Archipelago, India",
    category: "adventure tropical",
    badge: "Marine Adventure",
    badgeClass: "",
    rating: 4.81,
    price: 24500,
    priceFormatted: "₹24,500",
    priceUnit: "/person",
    image: "assets/images/destinations/grand-island.jpg",
    description: "Goa's premier underwater adventure hub. Snorkel with colorful reef fishes, watch playful wild dolphins, and enjoy a seaside BBQ on pristine shores.",
    features: [
      { icon: "fa-fish-fins", text: "Dolphin Spotting" },
      { icon: "fa-mask-snorkel", text: "Reef Diving" },
      { icon: "fa-fire-burner", text: "Island BBQ" }
    ],
    inclusions: ["Catamaran Cruise to Grand Island", "Guided Scuba Diving with Video", "Goan Beach BBQ & Refreshments", "Hotel Pickup & Drop"],
    status: "active"
  },
  {
    id: "pkg-st-marys-island",
    title: "St. Mary's Geological Columnar Isle",
    location: "Malpe Coast, Karnataka, India",
    category: "adventure culture tropical",
    badge: "Geological Wonder",
    badgeClass: "",
    rating: 4.78,
    price: 22000,
    priceFormatted: "₹22,000",
    priceUnit: "/person",
    image: "assets/images/destinations/st-marys.jpg",
    description: "Famous for hexagonal volcanic basalt columns formed millions of years ago. A rare UNESCO-recognized natural monument surrounded by blue waters.",
    features: [
      { icon: "fa-volcano", text: "Basalt Columns" },
      { icon: "fa-camera", text: "Photo Hotspot" },
      { icon: "fa-ferry", text: "Malpe Ferry" }
    ],
    inclusions: ["Return Ferry Tickets from Malpe", "Geological Guided Walk", "Coastal Karnataka Lunch", "Beach Leisure Time"],
    status: "active"
  }
];

const STORAGE_KEY = "morden_tourist_packages";
const INQUIRIES_KEY = "morden_tourist_inquiries";
const SETTINGS_KEY = "morden_tourist_settings";

const PackagesManager = {
  // Get all packages
  getAll() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep category definitions synchronized for default items
          let modified = false;
          parsed.forEach(item => {
            const def = DEFAULT_PACKAGES.find(d => d.id === item.id);
            if (def && item.category !== def.category && !item.isCustom) {
              item.category = def.category;
              modified = true;
            }
          });
          if (modified) {
            this.saveAll(parsed);
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read from localStorage, using defaults", e);
    }
    // Initialize with defaults if empty
    this.saveAll(DEFAULT_PACKAGES);
    return DEFAULT_PACKAGES;
  },

  // Save all packages to localStorage
  saveAll(packages) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
      return true;
    } catch (e) {
      console.error("Could not write packages to localStorage", e);
      return false;
    }
  },

  // Get a single package by ID
  getById(id) {
    const list = this.getAll();
    return list.find(pkg => pkg.id === id) || null;
  },

  // Add new package
  add(packageData) {
    const list = this.getAll();
    if (!packageData.id) {
      const slug = packageData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      packageData.id = "pkg-" + slug + "-" + Date.now().toString(36);
    }
    // Normalize format
    if (!packageData.priceFormatted) {
      packageData.priceFormatted = "₹" + Number(packageData.price).toLocaleString("en-IN");
    }
    if (!packageData.priceUnit) {
      packageData.priceUnit = "/person";
    }
    if (!packageData.rating) {
      packageData.rating = 4.9;
    }
    list.unshift(packageData); // Add to beginning
    this.saveAll(list);
    return packageData;
  },

  // Update existing package
  update(id, updatedFields) {
    const list = this.getAll();
    const index = list.findIndex(pkg => pkg.id === id);
    if (index === -1) return false;

    // Recalculate formatted price if numeric price changed
    if (updatedFields.price && (!updatedFields.priceFormatted || updatedFields.priceFormatted.startsWith("₹"))) {
      updatedFields.priceFormatted = "₹" + Number(updatedFields.price).toLocaleString("en-IN");
    }

    list[index] = { ...list[index], ...updatedFields };
    this.saveAll(list);
    return list[index];
  },

  // Delete package
  delete(id) {
    const list = this.getAll();
    const filtered = list.filter(pkg => pkg.id !== id);
    if (filtered.length === list.length) return false;
    this.saveAll(filtered);
    return true;
  },

  // Reset to original 12 packages
  resetToDefault() {
    this.saveAll(DEFAULT_PACKAGES);
    return DEFAULT_PACKAGES;
  },

  // Export JSON
  exportJSON() {
    return JSON.stringify(this.getAll(), null, 2);
  },

  // Import JSON
  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed) && parsed.length > 0) {
        this.saveAll(parsed);
        return { success: true, count: parsed.length };
      }
      return { success: false, error: "Invalid JSON format: Expected array of packages" };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // Render cards into a public container
  renderToGrid(containerSelector, activeFilter = "all") {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    if (!container.classList.contains("destination-slider-track")) {
      container.classList.add("destination-slider-track");
    }

    const packages = this.getAll().filter(p => p.status !== "draft");
    container.innerHTML = "";

    if (packages.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: #FFF; border-radius: 12px; border: 1px dashed var(--color-border); width: 100%;">
          <i class="fa-solid fa-umbrella-beach" style="font-size: 3rem; color: var(--color-accent-teal); margin-bottom: 16px;"></i>
          <h3>No Packages Available Currently</h3>
          <p style="color: var(--color-text-muted);">Please check back soon or contact our travel desk to curate a custom itinerary.</p>
          <a href="tel:8351917891" class="btn btn-primary" style="margin-top: 14px;"><i class="fa-solid fa-phone"></i> Call 8351917891</a>
        </div>
      `;
      return;
    }

    packages.forEach(pkg => {
      const isVisible = activeFilter === "all" || pkg.category.includes(activeFilter);
      const card = document.createElement("article");
      card.className = "destination-card";
      card.setAttribute("data-category", pkg.category);
      card.setAttribute("data-id", pkg.id);
      if (!isVisible) {
        card.style.display = "none";
      }

      // Feature pills
      const featuresHTML = (pkg.features || [])
        .map(f => `<span class="feature-pill"><i class="fa-solid ${f.icon || 'fa-check'}"></i> ${f.text}</span>`)
        .join("");

      // Badges
      const badgeHTML = pkg.badge 
        ? `<span class="badge-tag ${pkg.badgeClass || ''}">${pkg.badge}</span>` 
        : "";

      card.innerHTML = `
        <div class="card-media-wrap">
          <img src="${pkg.image || 'assets/images/destinations/yas-island.jpg'}" alt="${pkg.title}" loading="lazy" onerror="this.src='assets/images/destinations/yas-island.jpg'">
          <div class="card-badges">
            ${badgeHTML}
            <span class="badge-rating"><i class="fa-solid fa-star"></i> ${pkg.rating || 4.9}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="card-location"><i class="fa-solid fa-location-dot"></i> ${pkg.location || 'Exotic Island'}</div>
          <h3 class="card-title">${pkg.title}</h3>
          <p class="card-desc">${pkg.description || ''}</p>
          <div class="card-features">
            ${featuresHTML}
          </div>
          <div class="card-footer">
            <div class="price-box">
              <span class="price-label">Starting from</span>
              <span class="price-val">${pkg.priceFormatted || ('₹' + pkg.price)} <small>${pkg.priceUnit || '/person'}</small></span>
            </div>
            <button class="btn btn-outline open-booking-modal" data-dest="${pkg.title}">
              Book Now
            </button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    // Rebind booking modal buttons for dynamically added cards
    if (typeof window.bindBookingModalButtons === 'function') {
      window.bindBookingModalButtons();
    }

    // Initialize destination slider
    if (typeof window.initDestinationSlider === 'function') {
      window.initDestinationSlider();
    }
  }
};

// Inquiry & Lead Tracker Helper
const InquiriesManager = {
  getAll() {
    try {
      const stored = localStorage.getItem(INQUIRIES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },
  log(inquiry) {
    try {
      const list = this.getAll();
      inquiry.id = "inq-" + Date.now();
      inquiry.timestamp = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
      list.unshift(inquiry);
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(list));
      return inquiry;
    } catch (e) {
      console.warn("Could not log inquiry", e);
      return null;
    }
  },
  clear() {
    localStorage.removeItem(INQUIRIES_KEY);
  }
};

// Make available globally
window.PackagesManager = PackagesManager;
window.InquiriesManager = InquiriesManager;
window.DEFAULT_PACKAGES = DEFAULT_PACKAGES;
