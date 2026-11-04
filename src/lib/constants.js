/* Static content for StudioSpace — real copy only, no placeholder text. */

export const CATEGORIES = [
  {
    name: "Photo Studio",
    tagline: "Cyc walls, natural light and seamless backdrops",
    icon: "Camera",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Film Stage",
    tagline: "Cinema-ready stages for narrative and commercial shoots",
    icon: "Clapperboard",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Sound Stage",
    tagline: "Large production stages with grid lighting and silent HVAC",
    icon: "Drama",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Podcast Lounge",
    tagline: "Acoustically treated rooms with broadcast-grade microphones",
    icon: "Podcast",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Music Suite",
    tagline: "Tracking rooms, isolation booths and live rooms",
    icon: "Music",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Art Workshop",
    tagline: "Pottery, painting and hands-on maker spaces",
    icon: "Palette",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80",
  },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export const AMENITIES = [
  "Cyc Wall",
  "Blackout Curtains",
  "Green Screen",
  "Ring Lights",
  "4K Cinema Camera",
  "Teleprompter",
  "Green Room",
  "Kitchen Island",
  "Silent HVAC",
  "Acoustic Panels",
  "Neumann Microphones",
  "5.1 Monitoring",
  "DJ Booth",
  "Grand Piano",
  "Drum Kit",
  "Pottery Wheels",
  "Easels & Storage",
  "Sink & Storage",
  "Fast Wi-Fi",
  "On-site Parking",
];

export const HERO_SLIDES = [
  {
    kicker: "Peer-to-peer studio marketplace",
    title: "Book the perfect space for your next shoot",
    text: "Discover hundreds of photo studios, sound stages and creative workshops hosted by creators like you — with transparent hourly pricing and instant booking.",
    image:
      "https://images.unsplash.com/photo-1567443024551-f3e3cc2be870?auto=format&fit=crop&w=1800&q=80",
    primary: { label: "Explore Studios", href: "/studios" },
    secondary: { label: "Host Your Space", href: "/add-studio" },
  },
  {
    kicker: "From podcast booths to cinema stages",
    title: "Sound stages built for big ideas",
    text: "Reserve treated stages, tracking rooms and edit suites by the hour. Check live availability, compare amenities and lock your slot in seconds.",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1800&q=80",
    primary: { label: "Explore Studios", href: "/studios" },
    secondary: { label: "Host Your Space", href: "/add-studio" },
  },
  {
    kicker: "Creators supporting creators",
    title: "Turn your empty studio into steady income",
    text: "List your cyc wall, podcast lounge or art workshop, set your own rates and calendar, and join a community that keeps creative spaces thriving.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=80",
    primary: { label: "Explore Studios", href: "/studios" },
    secondary: { label: "Host Your Space", href: "/add-studio" },
  },
];

export const BOOKING_STEPS = [
  {
    step: "01",
    title: "Discover Spaces",
    text: "Filter by studio category, location, hourly rate and amenities to find the room that fits your production.",
  },
  {
    step: "02",
    title: "Select Shoot Hours",
    text: "Pick your date and start/end times. Your total is calculated live — no hidden service fees at checkout.",
  },
  {
    step: "03",
    title: "Book Instantly",
    text: "Confirm the reservation and it is saved to your bookings with a pending status, ready for the host to lock in.",
  },
  {
    step: "04",
    title: "Create & Produce",
    text: "Show up, plug in and do your best work. Verified hosts and support are one message away.",
  },
];

export const GUARANTEES = [
  {
    icon: "ShieldCheck",
    title: "Liability Protection",
    text: "Every booking includes damage liability coverage so hosts and creators can work with confidence.",
  },
  {
    icon: "BadgeCheck",
    title: "Verified Profiles",
    text: "Host identities and studio details are reviewed before a listing goes live on the marketplace.",
  },
  {
    icon: "Wrench",
    title: "Equipment Safety",
    text: "Gear condition, power loads and safety equipment are checked against each studio's checklist.",
  },
  {
    icon: "Headphones",
    title: "24/7 Host Support",
    text: "Our creator support team answers around the clock, from first message to final invoice.",
  },
];

// export const SORT_OPTIONS = [
//   { value: "newest", label: "Newest first" },
//   { value: "rating", label: "Top rated" },
//   { value: "price_asc", label: "Price: low to high" },
//   { value: "price_desc", label: "Price: high to low" },
// ];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
];

/** Graceful image fallback while a URL loads or when it is broken. */
export const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#292524"/><circle cx="400" cy="270" r="90" fill="none" stroke="#d97706" stroke-width="10"/><circle cx="400" cy="270" r="34" fill="#d97706"/><text x="400" y="440" font-family="Arial" font-size="26" fill="#a8a29e" text-anchor="middle">StudioSpace</text></svg>`
  );
