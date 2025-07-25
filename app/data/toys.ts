export interface Toy {
  title: string;
  description: string;
  imageUrl: string;
  amazonUrl: string;
  slug: string;
  comment?: string;
  detailedDescription?: string;
  features?: string[];
  specifications?: { [key: string]: string };
  price?: string;
}

export const toys: Toy[] = [
  {
    title: "InnoGear Video Conference Light",
    description: "Professional video conferencing light bar with remote control",
    imageUrl: "/images/toys/innogear-video-bar.jpg",
    amazonUrl: "https://amzn.to/3Ul7tev",
    slug: "innogear-video-conference-light",
    comment: "Game-changer for my home studio setup. The built-in cable management is brilliant.",
    detailedDescription: "The InnoGear Video Conference Light is a professional-grade light bar designed to improve your video quality for meetings and streaming. It features adjustable brightness and color temperature to ensure you always look your best on camera.",
    features: [
      "Adjustable brightness and color temperature",
      "Remote control for easy adjustments",
      "360-degree rotation capability",
      "Easy desk clamp installation"
    ],
    specifications: {
      "Material": "Aluminum Alloy",
      "Power": "10W",
      "Color Temperature": "3200K - 6500K"
    },
    price: "$39.99"
  },
  {
    title: "Opal Tadpole",
    description: "Tiny 4K webcam that clips to your laptop screen",
    imageUrl: "/images/toys/opal-tadpole.jpg",
    amazonUrl: "https://amzn.to/4eO3d0P",
    slug: "opal-tadpole",
    comment: "Tiny but mighty. Perfect for travel and the image quality rivals much larger webcams.",
    detailedDescription: "The Opal Tadpole is a revolutionary ultra-portable webcam that delivers professional 4K video quality in an incredibly compact form factor. Designed by the team behind the acclaimed Opal C1, the Tadpole brings studio-quality video to any laptop or desktop setup.",
    features: [
      "4K video recording at 30fps",
      "Directional microphone with noise cancellation",
      "Ultra-compact and lightweight design",
      "Magnetic attachment system"
    ],
    specifications: {
      "Video Resolution": "4K (3840 x 2160) at 30fps",
      "Connectivity": "USB-C",
      "Weight": "1.2 oz (34g)"
    },
    price: "$175.00"
  },
  {
    title: "Nova Wave 2",
    description: "AI-powered light that adapts to your circadian rhythm",
    imageUrl: "/images/toys/nova-wave-2.jpg",
    amazonUrl: "https://amzn.to/4lrKRoN",
    slug: "nova-wave-2",
    comment: "Crystal clear audio without the cables. The range is impressive and battery life is solid.",
    detailedDescription: "The Nova Wave 2 is a professional-grade wireless microphone system that delivers broadcast-quality audio for content creators, filmmakers, and live performers. With its advanced 2.4GHz digital transmission, it provides crystal-clear audio with minimal latency and maximum reliability.",
    features: [
      "2.4GHz digital wireless transmission",
      "Up to 150ft transmission range",
      "8-hour battery life on transmitter"
    ],
    specifications: {
      "Frequency Response": "20Hz - 20kHz",
      "Latency": "<20ms",
      "Charging": "USB-C fast charging"
    },
    price: "$129.99"
  },
  {
    title: "Focusrite Scarlett 2i2",
    description: "USB audio interface for recording with professional sound quality",
    imageUrl: "/images/toys/focusrite-scarlett-2i2.jpg",
    amazonUrl: "https://amzn.to/4lVDupz",
    slug: "focusrite-scarlett-2i2",
    comment: "The gold standard for home recording. Clean preamps and rock-solid drivers.",
    detailedDescription: "The Focusrite Scarlett 2i2 is one of the world's best-selling USB audio interfaces. The 4th Generation model features high-headroom, low-noise preamps and studio-quality converters for professional sound anytime, anywhere.",
    features: [
      "Two high-headroom instrument inputs",
      "Two 4th-Generation Scarlett mic preamps",
      "Air Mode for brighter, more open vocals"
    ],
    specifications: {
      "Connectivity": "USB-C",
      "Resolution": "Up to 192kHz / 24-bit"
    }
  },
  {
    title: "AIAIAI TMA-2 DJ Wireless Headphones",
    description: "Professional wireless DJ headphones with high isolation",
    imageUrl: "/images/toys/aiaiai-tma2-headphones.jpg",
    amazonUrl: "https://amzn.to/3Tx9jJ5",
    slug: "aiaiai-tma-2-dj-wireless-headphones"
  },
  {
    title: "AKAI Professional LPD8",
    description: "Compact USB MIDI pad controller for beat making",
    imageUrl: "/images/toys/akai-lpd8.jpg",
    amazonUrl: "https://amzn.to/4kAcMSg",
    slug: "akai-professional-lpd8"
  },
  {
    title: "Desk Clamp Power Strip",
    description: "Mountable power strip that clamps to your desk edge",
    imageUrl: "/images/toys/desk-clamp-power-strip.jpg",
    amazonUrl: "https://amzn.to/4liQ1TX",
    slug: "desk-clamp-power-strip"
  },
  {
    title: "Native Instruments Maschine Mikro Mk3",
    description: "Compact drum machine and sampler controller",
    imageUrl: "/images/toys/maschine-mikro-mk3.jpg",
    amazonUrl: "https://amzn.to/44YxbeY",
    slug: "native-instruments-maschine-mikro-mk3"
  },
  {
    title: "Shure MV7i Smart Microphone",
    description: "USB microphone with built-in audio interface for podcasting",
    imageUrl: "/images/toys/shure-mv7i.jpg",
    amazonUrl: "https://amzn.to/4lpE3bl",
    slug: "shure-mv7i-smart-microphone"
  }
];
