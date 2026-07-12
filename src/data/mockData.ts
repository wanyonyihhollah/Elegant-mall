import { Product, Promotion } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // Electronics
  {
    id: 'e1',
    title: 'Apple iPhone 15 Pro Max (Titanium Blue, 512GB)',
    sku: 'AAPL-IP15PM-BLU',
    price: 1399.00,
    description: 'The pinnacle of mobile engineering. Powered by the A17 Pro chip, featuring a lightweight titanium design, a custom Action button, and a professional 5x Telephoto optical zoom camera.',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Electronics',
    rating: 4.8,
    inventory: 15
  },
  {
    id: 'e2',
    title: 'Apple MacBook Pro 16" (M3 Max, 36GB Unified Memory, 1TB SSD)',
    sku: 'AAPL-MBP16M3-OBS',
    price: 3499.00,
    description: 'The ultimate creative powerhouse. Experience a breathtaking Liquid Retina XDR screen, studio-quality six-speaker spatial audio, and unprecedented battery life powered by advanced Apple Silicon.',
    images: [
      'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Electronics',
    rating: 4.9,
    inventory: 8
  },
  {
    id: 'e3',
    title: 'Sony BRAVIA XR A95L 65" 4K QD-OLED Smart TV',
    sku: 'SONY-XR65A95L-QD',
    price: 3299.00,
    description: 'Our brightest and widest colors ever in a QD-OLED panel, powered by the ground-breaking Cognitive Processor XR. Transform your living room into an immersive cinema.',
    images: [
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Electronics',
    rating: 4.6,
    inventory: 5
  },
  // Musicals
  {
    id: 'm1',
    title: 'Martin D-28 Dreadnought Acoustic Guitar',
    sku: 'CFM-D28-NAT',
    price: 3199.00,
    description: 'The standard by which all acoustic guitars are measured. Handcrafted in Nazareth, Pennsylvania, with a solid Sitka spruce top and East Indian rosewood back and sides.',
    images: [
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Musicals',
    rating: 4.7,
    inventory: 10
  },
  {
    id: 'm2',
    title: 'Yamaha Clavinova CLP-735 Digital Console Piano',
    sku: 'YMH-CLP735-BLK',
    price: 2299.00,
    description: 'Features the meticulously sampled voices of the flagship Yamaha CFX and Bösendorfer Imperial grand pianos, with a synthetic ebony and ivory GrandTouch-S keyboard.',
    images: [
      'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Musicals',
    rating: 4.9,
    inventory: 4
  },
  // Household Appliances
  {
    id: 'h1',
    title: 'SMEG FAB32 50s Retro Style Refrigerator (Cream)',
    sku: 'SMEG-FAB32CR-IT',
    price: 2999.00,
    description: 'An iconic Italian masterpiece combining nostalgic mid-century aesthetic on the outside with hyper-efficient multi-flow cooling and touch-screen temperature controls on the inside.',
    images: [
      'https://images.unsplash.com/photo-1571175432267-2703713f36aa?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Household Appliances',
    rating: 4.5,
    inventory: 6
  },
  {
    id: 'h2',
    title: 'Miele W1 Front-Loading Washing Machine with TwinDos',
    sku: 'MIE-W1TD-SIL',
    price: 1499.00,
    description: 'German-engineered washing machine featuring the revolutionary TwinDos automatic liquid detergent dispensing system and an eco-silent wash profile.',
    images: [
      'https://images.unsplash.com/photo-1582730149719-61163445af77?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Household Appliances',
    rating: 4.4,
    inventory: 12
  },
  // Groceries
  {
    id: 'g1',
    title: 'Harry & David Royal Riviera Pears Gourmet Gift Basket',
    sku: 'HDB-RRP-GIFT',
    price: 99.00,
    description: 'Legendary sweet, exceptionally juicy Riviera pears, hand-packed and paired with artisanal cheeses, premium roasted cashews, and rich chocolate truffles.',
    images: [
      'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Groceries',
    rating: 4.9,
    inventory: 50
  },
  {
    id: 'g2',
    title: 'Farm-to-Table Organic Microgreens & Heirloom Greens Harvest',
    sku: 'FTT-ORG-MICRO',
    price: 29.50,
    description: 'Crisp certified-organic heritage lettuces, baby spinach, watercress, edible flowers, and fresh culinary herbs harvested daily from local high-altitude biodynamic farms.',
    images: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Groceries',
    rating: 4.8,
    inventory: 40
  },
  // Beauty & Wellness
  {
    id: 'b1',
    title: 'Maison Francis Kurkdjian Baccarat Rouge 540 Eau de Parfum',
    sku: 'MFK-BR540-EDP',
    price: 325.00,
    description: 'Luminous and sophisticated, Baccarat Rouge 540 lays on the skin like an amber, floral and woody breeze. A poetic alchemy where aerial notes of jasmine and saffron excel.',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Beauty & Wellness',
    rating: 4.8,
    inventory: 20
  },
  // Fashion
  {
    id: 'f1',
    title: 'Loro Piana Sartorial Linen & Silk Summer Blazer',
    sku: 'LP-SLB-NAVY',
    price: 2450.00,
    description: 'Impeccably tailored in Italy from a luxurious blend of hand-selected linen and mulberry silk. Features a soft shoulder, partial lining, and a sophisticated navy hue.',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Fashion',
    rating: 4.6,
    inventory: 15
  },
  {
    id: 'f2',
    title: 'Zimmermann Ginger Floral Embroidered Silk Midi Dress',
    sku: 'ZIM-GINGER-DRS',
    price: 1150.00,
    description: 'Crafted from lightweight silk georgette in an exquisite bohemian silhouette. Adorned with delicate embroidery, placement prints, and a high elegant neckline.',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Fashion',
    rating: 4.7,
    inventory: 14
  },
  // Accessories
  {
    id: 'a1',
    title: 'Rolex Cosmograph Daytona (18kt Yellow Gold & Oysterflex)',
    sku: 'RLX-DAYTONA-18K',
    price: 32500.00,
    description: 'The ultimate luxury racing chronograph. Features a stunning black dial with champagne sub-dials, high-performance Oysterflex strap, and self-winding caliber 4130 movement.',
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Accessories',
    rating: 4.9,
    inventory: 7
  },
  {
    id: 'a2',
    title: 'Saint Laurent Loulou Medium Suede Shoulder Bag',
    sku: 'YSL-LOULOU-SDE',
    price: 2950.00,
    description: 'An iconic French heirloom. Beautifully crafted from supple textured calfskin suede with signature Y-quilted overstitching and interlocking metal YSL initials.',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Accessories',
    rating: 4.5,
    inventory: 9
  }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'p1',
    title: 'BLACK FRIDAY SUPER SALE',
    code: 'BLACKFRIDAY50',
    discount: 50,
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'p2',
    title: 'HOLIDAY SPECTACULAR',
    code: 'HOLIDAYFREE',
    discount: 25,
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'p3',
    title: 'NEW YEAR CELEBRATION',
    code: 'NEWYEAR30',
    discount: 30,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
  }
];

export interface RestaurantItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'Appetizers' | 'Mains' | 'Desserts' | 'Drinks';
}

export const RESTAURANT_ITEMS: RestaurantItem[] = [
  {
    id: 'r1',
    name: 'Sizzling Truffle Burger',
    price: 18.50,
    description: 'Wagyu beef patty, fontina cheese, shaved black truffles, roasted garlic aioli, nested in a warm brioche bun.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    category: 'Mains'
  },
  {
    id: 'r2',
    name: 'Tuscan Cream Salmon Pasta',
    price: 24.00,
    description: 'Fresh grilled Atlantic salmon on a bed of fresh tagliatelle pasta, smothered in creamy garlic, spinach, and sundried tomato sauce.',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=80',
    category: 'Mains'
  },
  {
    id: 'r3',
    name: 'Golden Burrata Salad',
    price: 14.00,
    description: 'Vibrant heirloom tomatoes, creamy burrata cheese, wild rocket, basil oil, and a premium aged balsamic glaze drizzle.',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80',
    category: 'Appetizers'
  },
  {
    id: 'r4',
    name: 'Chocolate Lava Decadence',
    price: 9.50,
    description: 'Rich dark chocolate cake with a molten core, served hot with a scoop of madagascar vanilla bean gelato.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    category: 'Desserts'
  }
];

export const MALL_FAQ_KNOWLEDGE = `
Elegant Mall is located along luxury avenue, Nairobi, Kenya. It features:
- Core stores including high-end fashion, state-of-the-art electronics, local groceries, and musical instruments.
- Elegant Bites Restaurant (the Food Court) with Wagyu burgers, Salmon pasta, Burrata salad, and desserts.
- Fast, secure home delivery across major cities.
- Dynamic Admin panel to add products and track orders.
- Contact phone: +254 712 345 678. Email: support@elegantmall.gmail.com.
- Payment options: M-Pesa STK push, Credit Card (Visa/Mastercard), and PayPal.
- Promotions: Use coupon code 'BLACKFRIDAY50' for 50% off, 'HOLIDAYFREE' for 25% off, and 'NEWYEAR30' for 30% off.
- Opening hours: 8:00 AM - 10:00 PM daily.
`;
