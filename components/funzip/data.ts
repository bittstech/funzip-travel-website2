export type Package = {
  name: string
  image: string
  duration: string
  description: string
  highlights: string[]
  price: string
}

export const packages: Package[] = [
  {
    name: "Kashmir 4 Nights / 5 Days",
    image: "/images/dal-lake.png",
    duration: "4 Nights / 5 Days",
    description:
      "The perfect first taste of Kashmir covering Srinagar's lakes, gardens, and gentle valley escapes.",
    highlights: ["Dal Lake Shikara", "Mughal Gardens", "Houseboat Stay"],
    price: "₹12,999",
  },
  {
    name: "Srinagar Gulmarg Pahalgam",
    image: "/images/gulmarg.png",
    duration: "6 Nights / 7 Days",
    description:
      "Our signature circuit linking the meadows of Gulmarg, the valleys of Pahalgam, and Srinagar's charm.",
    highlights: ["Gondola Ride", "Lidder Valley", "Local Sightseeing"],
    price: "₹19,499",
  },
  {
    name: "Kashmir Honeymoon Package",
    image: "/images/honeymoon.png",
    duration: "5 Nights / 6 Days",
    description:
      "A romantic itinerary crafted for couples with candlelight dinners and private shikara rides.",
    highlights: ["Candlelight Dinner", "Private Shikara", "Luxury Stay"],
    price: "₹24,999",
  },
  {
    name: "Gurez Valley Offbeat",
    image: "/images/gurez.png",
    duration: "5 Nights / 6 Days",
    description:
      "Venture beyond the crowds into the untouched beauty of Gurez, framed by Habba Khatoon peak.",
    highlights: ["Habba Khatoon Peak", "Kishanganga River", "Village Walks"],
    price: "₹21,999",
  },
  {
    name: "Kashmir Family Tour",
    image: "/images/family.png",
    duration: "6 Nights / 7 Days",
    description:
      "Comfortable, well-paced travel designed for families with kids and elders in mind.",
    highlights: ["Comfort Hotels", "Easy Sightseeing", "Kid Friendly"],
    price: "₹17,499",
  },
  {
    name: "Luxury Kashmir Holiday",
    image: "/images/luxury.png",
    duration: "7 Nights / 8 Days",
    description:
      "Five-star stays, premium transport, and curated experiences across the entire valley.",
    highlights: ["5-Star Hotels", "Premium Transport", "Curated Dining"],
    price: "₹39,999",
  },
]

export type GalleryItem = {
  category: string
  image: string
  span: string
}

export const galleryItems: GalleryItem[] = [
  { category: "Dal Lake", image: "/images/dal-lake.png", span: "md:row-span-2" },
  { category: "Gulmarg", image: "/images/gulmarg.png", span: "" },
  { category: "Pahalgam", image: "/images/pahalgam.png", span: "" },
  { category: "Sonmarg", image: "/images/sonmarg.png", span: "md:col-span-2" },
  { category: "Gurez Valley", image: "/images/gurez.png", span: "" },
  { category: "Houseboats", image: "/images/houseboat.png", span: "md:row-span-2" },
  { category: "Snow Adventures", image: "/images/snow-adventure.png", span: "" },
  { category: "Kashmir Gardens", image: "/images/gardens.png", span: "" },
]

export type Blog = {
  title: string
  excerpt: string
  date: string
  image: string
  category: string
}

export const blogs: Blog[] = [
  {
    title: "Best Time to Visit Kashmir",
    excerpt:
      "From tulip-filled springs to snowy winters, here's how to choose the perfect season for your trip.",
    date: "May 12, 2025",
    image: "/images/gardens.png",
    category: "Travel Tips",
  },
  {
    title: "Top Places to Visit in Kashmir",
    excerpt:
      "A curated list of the valley's most unforgettable destinations you simply cannot miss.",
    date: "Apr 28, 2025",
    image: "/images/pahalgam.png",
    category: "Destinations",
  },
  {
    title: "Kashmir Honeymoon Travel Guide",
    excerpt:
      "Plan the most romantic getaway with our complete guide to honeymooning in paradise.",
    date: "Apr 15, 2025",
    image: "/images/honeymoon.png",
    category: "Couples",
  },
  {
    title: "Gurez Valley Travel Guide",
    excerpt:
      "Everything you need to know to explore one of Kashmir's most pristine offbeat valleys.",
    date: "Mar 30, 2025",
    image: "/images/gurez.png",
    category: "Offbeat",
  },
  {
    title: "Srinagar to Gulmarg Travel Tips",
    excerpt:
      "Make the scenic journey to the meadow of flowers smooth with these practical pointers.",
    date: "Mar 18, 2025",
    image: "/images/gulmarg.png",
    category: "Travel Tips",
  },
  {
    title: "How to Plan a Budget Kashmir Trip",
    excerpt:
      "Experience the magic of Kashmir without overspending using our smart planning strategies.",
    date: "Mar 02, 2025",
    image: "/images/sonmarg.png",
    category: "Budget",
  },
]

export const faqs = [
  {
    q: "What is the best time to visit Kashmir?",
    a: "Kashmir is beautiful year-round. March to May brings blooming gardens, June to August offers pleasant weather, and December to February is ideal for snow lovers.",
  },
  {
    q: "How many days are enough for a Kashmir trip?",
    a: "We recommend 5 to 7 days to comfortably cover Srinagar, Gulmarg, Pahalgam, and Sonmarg. Offbeat destinations like Gurez may need a day or two more.",
  },
  {
    q: "Is Kashmir safe for tourists?",
    a: "Yes. Kashmir is a popular and welcoming tourist destination. Our local experts monitor conditions and design itineraries to keep you safe and comfortable.",
  },
  {
    q: "Do you provide custom Kashmir packages?",
    a: "Absolutely. Every Funzip itinerary can be personalized around your dates, budget, group size, and interests. Just share your preferences and we'll craft it.",
  },
  {
    q: "Are hotels, transport, and sightseeing included?",
    a: "Our packages include handpicked hotels, private transport, and guided sightseeing. We clearly list inclusions so there are no surprises.",
  },
  {
    q: "Can I book honeymoon or family packages?",
    a: "Yes, we specialize in both. Honeymoon packages include romantic touches, while family packages are paced and arranged for all ages.",
  },
  {
    q: "Do you provide airport pickup and drop?",
    a: "Yes, complimentary airport pickup and drop are included in all our standard and premium Kashmir packages.",
  },
  {
    q: "How do I get a quote from Funzip?",
    a: "Simply fill out the enquiry form, message us on WhatsApp, or call us. Our team will share a personalized quote within hours.",
  },
]
