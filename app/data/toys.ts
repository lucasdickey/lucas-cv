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
    title: "Quntis Computer Monitor Lamp",
    description: "Space-saving monitor light bar with asymmetric optical design",
    imageUrl: "/images/toys/quntis-monitor-lamp.jpg",
    amazonUrl: "https://amzn.to/46DKpyG",
    slug: "quntis-computer-monitor-lamp",
    comment: "Perfect lighting solution that doesn't take up desk space. The asymmetric design eliminates screen glare beautifully.",
    detailedDescription: "The Quntis Computer Monitor Lamp features an innovative asymmetric optical design that illuminates your workspace while preventing screen glare. This space-saving solution clamps directly to your monitor, providing excellent task lighting without occupying valuable desk real estate.",
    features: [
      "Asymmetric optical design prevents screen glare",
      "Stepless dimming and color temperature adjustment",
      "Touch and remote control options",
      "USB-C powered for convenience",
      "Tool-free installation with weighted clamp"
    ],
    specifications: {
      "Power": "15W",
      "Color Temperature": "3000K - 6500K",
      "Lumens": "1200",
      "Compatibility": "Monitors 0.5-1.6 inches thick"
    },
    price: "$89.99"
  },
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
  },
  {
    title: "HUANUO Dual Monitor Stand",
    description: "Full adjustable monitor desk mount with swivel Vesa bracket",
    imageUrl: "/images/toys/HUANUO-Dual-Monitor-Stand.jpg",
    amazonUrl: "https://amzn.to/3HqrZHM",
    slug: "huanuo-dual-monitor-stand",
    comment: "Perfect for dual monitor setups. The adjustability is fantastic and it freed up so much desk space.",
    detailedDescription: "The HUANUO Dual Monitor Stand is a versatile monitor mounting solution that allows you to position two monitors flexibly on your desk. With both C-clamp and grommet mounting options, it accommodates various desk types and thicknesses.",
    features: [
      "Full adjustable monitor desk mount",
      "Swivel Vesa bracket for optimal positioning",
      "C Clamp and Grommet mounting base options",
      "Compatible with 13 to 32 inch computer screens",
      "Each arm can hold 4.4 to 19.8 lbs"
    ],
    specifications: {
      "Screen Size Compatibility": "13-32 inches",
      "Weight Capacity": "4.4 - 19.8 lbs per arm",
      "Mounting Options": "C-clamp or Grommet base"
    }
  },
  {
    title: "Dell 27 Plus 4K USB-C Monitor - S2725QC",
    description: "27-inch 4K display with 120Hz refresh rate and USB-C connectivity",
    imageUrl: "/images/toys/dell-monitorjpg.jpg",
    amazonUrl: "https://amzn.to/4mQIv3d",
    slug: "dell-27-plus-4k-usb-c-monitor",
    comment: "Stunning 4K clarity with smooth 120Hz. The USB-C hub functionality is a huge convenience bonus.",
    detailedDescription: "The Dell 27 Plus 4K USB-C Monitor delivers professional-grade visual performance with its 4K resolution and high refresh rate. Designed for users seeking sharp image quality and smooth motion, it combines premium display technology with convenient connectivity features.",
    features: [
      "27-inch 4K (3840 x 2160) display",
      "120Hz refresh rate for smooth motion",
      "AMD FreeSync Premium technology",
      "sRGB 99% color coverage",
      "Comfortview Plus for reduced eye strain",
      "Integrated speakers"
    ],
    specifications: {
      "Screen Size": "27 inches",
      "Resolution": "4K (3840 x 2160)",
      "Refresh Rate": "120Hz",
      "Aspect Ratio": "16:9",
      "Contrast Ratio": "1500:1",
      "Color": "Ash White"
    }
  }
];
