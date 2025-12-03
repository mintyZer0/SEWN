export interface Product {
  id: string;
  imgSrc: string;
  productName: string;
  sewerName: string;
  price: number;
  rating: number;
  sold: number;
  description?: string;
  details?: string[];
}

export const products: Product[] = [
  {
    id: "1",
    imgSrc: "/assets/shop-grid-products/shop-grid-product1.png",
    productName: "Handmade Tote Bag",
    sewerName: "Jane Smith",
    price: 29.99,
    rating: 4.5,
    sold: 127,
    description:
      "Carry your essentials in style with this versatile handmade tote bag, where sustainability meets sophisticated design. Crafted from premium organic cotton canvas and featuring meticulously reinforced stitching, this eco-friendly companion is built to withstand daily adventures while making a positive environmental impact. The spacious interior easily accommodates your laptop, books, groceries, or gym essentials, while the thoughtfully placed interior pocket keeps your smaller items organized and within reach. Whether you're heading to the office, the farmers market, or a weekend getaway, this timeless piece combines functionality with effortless style, proving that conscious choices can be both practical and beautiful.",
    details: [
      "Material: 100% organic cotton canvas",
      'Dimensions: 15" W x 16" H x 5" D',
      "Features: Interior pocket, reinforced handles",
      "Care: Machine washable, air dry",
    ],
  },
  {
    id: "2",
    imgSrc: "/assets/shop-grid-products/shop-grid-product2.png",
    productName: "Custom Dress",
    sewerName: "Alice Brown",
    price: 89.99,
    rating: 5.0,
    sold: 45,
    description:
      "Experience the luxury of truly personalized fashion with this beautifully tailored dress, crafted to your exact measurements for a perfect fit that celebrates your unique shape. This elegant piece features a universally flattering silhouette that drapes gracefully, accentuating your best features while providing all-day comfort. Choose from a curated palette of sophisticated colors to match your personal style and occasion needs. The premium cotton blend fabric offers just the right amount of stretch, moving with you throughout your day while maintaining its refined structure. Whether you're attending a special celebration, an important business meeting, or simply want to feel extraordinary in your everyday life, this custom creation ensures you'll always look and feel your absolute best.",
    details: [
      "Material: Premium cotton blend with subtle stretch",
      "Fit: Custom-tailored to your measurements",
      "Available in multiple colors",
      "Features: Side zipper, fully lined",
      "Care: Dry clean recommended",
    ],
  },
  {
    id: "3",
    imgSrc: "/assets/shop-grid-products/shop-grid-product3.png",
    productName: "Embroidered Pillow",
    sewerName: "Maria Garcia",
    price: 34.99,
    rating: 4.8,
    sold: 203,
    description:
      "Transform your living space with this exquisite embroidered decorative pillow, where centuries-old artisan traditions meet contemporary home design. Each piece is a labor of love, featuring intricate hand-stitched patterns that showcase traditional embroidery techniques carefully preserved and passed down through generations of skilled craftspeople. The delicate threadwork creates stunning visual texture and depth, catching the light beautifully from every angle and adding a sophisticated focal point to any room. Crafted on a luxurious linen blend base, this pillow seamlessly blends heritage craftsmanship with modern comfort. Whether gracing your sofa, adorning your bed, or accenting a favorite reading chair, this artisanal treasure brings warmth, character, and a story worth telling to your home.",
    details: [
      "Material: Soft linen blend with hand embroidery",
      'Size: 18" x 18"',
      "Features: Hidden zipper, removable cover",
      "Fill: Premium polyester insert included",
      "Care: Spot clean only",
    ],
  },
  {
    id: "4",
    imgSrc: "/assets/shop-grid-products/shop-grid-product4.png",
    productName: "Quilted Blanket",
    sewerName: "Sarah Johnson",
    price: 79.99,
    rating: 4.9,
    sold: 89,
    description:
      "Wrap yourself in timeless warmth and comfort with this handcrafted quilted blanket, a true heirloom piece that celebrates the art of traditional quilting. Each quilt is meticulously constructed using authentic patchwork techniques, with every stitch placed by skilled hands to create a durable, beautiful textile that tells its own unique story. The carefully selected cotton fabrics are arranged in thoughtful patterns that create visual interest while maintaining perfect balance, and the plush polyester batting provides just the right weight for cozy comfort in any season. The reversible design offers two distinct looks in one, allowing you to refresh your bedroom's aesthetic with a simple flip. More than just a blanket, this quilted masterpiece becomes a cherished part of your home, ready to provide warmth during movie nights, add beauty to your bed, and eventually become a treasured family keepsake.",
    details: [
      "Material: 100% cotton with polyester batting",
      'Dimensions: 60" x 80" (Queen size)',
      "Features: Hand-quilted, reversible design",
      "Weight: Medium-weight, perfect for all seasons",
      "Care: Machine washable on gentle cycle",
    ],
  },
  {
    id: "5",
    imgSrc: "/assets/shop-grid-products/shop-grid-product5.png",
    productName: "Linen Apron",
    sewerName: "Emma Davis",
    price: 24.99,
    rating: 4.3,
    sold: 156,
    description:
      "Elevate your culinary experience with this practical yet stylish linen apron, designed for passionate home cooks and professional chefs who appreciate both form and function. Crafted from 100% natural linen renowned for its breathability and durability, this apron keeps you cool and comfortable even during intense cooking sessions. The fabric's beautiful characteristic is that it softens with each wash, becoming more supple and comfortable over time while maintaining its strength. Thoughtfully designed with adjustable neck and waist ties to ensure a perfect fit for all body types, and featuring two generously sized front pockets that keep your essential tools, recipe cards, and phone within easy reach. The timeless design and natural texture bring an elegant, professional look to your kitchen, making every cooking session feel special whether you're preparing a weeknight dinner or hosting an elaborate feast.",
    details: [
      "Material: 100% natural linen",
      'Length: 34", adjustable neck and waist ties',
      "Features: Two front pockets, reinforced stitching",
      "Available in natural, charcoal, and sage colors",
      "Care: Machine washable, tumble dry low",
    ],
  },
  {
    id: "6",
    imgSrc: "/assets/shop-grid-products/shop-grid-product6.png",
    productName: "Cotton Table Runner",
    sewerName: "Michael Chen",
    price: 32.99,
    rating: 4.6,
    sold: 98,
    description:
      "Elevate every dining experience with this elegant handwoven table runner, a versatile piece that effortlessly transitions from casual weeknight family dinners to sophisticated formal gatherings. The premium 100% cotton is carefully handwoven using time-honored techniques, creating a durable fabric with beautiful texture and visual depth. The classic striped pattern adds contemporary flair while remaining timeless enough to complement any décor style, from modern minimalist to traditional farmhouse aesthetics. Decorative fringed edges on both ends provide a refined finishing touch that elevates the overall design. This table runner serves as the perfect foundation for your centerpieces, protects your table surface, and creates an inviting atmosphere that makes every meal feel special. Whether you're hosting a holiday celebration, enjoying Sunday brunch, or simply want to add daily elegance to your dining space, this handcrafted piece brings warmth, style, and artisan quality to your table.",
    details: [
      "Material: Premium 100% cotton",
      'Dimensions: 72" L x 14" W',
      "Features: Handwoven with decorative fringed edges",
      "Pattern: Classic striped design",
      "Care: Machine washable, iron on medium heat",
    ],
  },
  {
    id: "7",
    imgSrc: "/assets/shop-grid-products/shop-grid-product7.png",
    productName: "Denim Jacket",
    sewerName: "Lisa Martinez",
    price: 119.99,
    rating: 4.7,
    sold: 67,
    description:
      "Rediscover a timeless wardrobe essential reimagined through the lens of artisan craftsmanship and personalized style. This custom-fitted denim jacket combines the classic appeal of premium indigo denim with meticulous construction techniques that ensure both durability and exceptional comfort. The fabric features a subtle stretch that moves with you while maintaining its structured silhouette, and the premium stitching demonstrates attention to detail in every seam. What truly sets this piece apart is the opportunity for personalization—add custom embroidery, meaningful patches, or decorative elements that tell your unique story and transform this jacket into a one-of-a-kind statement piece. The versatile design pairs effortlessly with everything from casual jeans and t-shirts to dresses and skirts, making it an invaluable addition to your wardrobe that you'll reach for season after season, year after year.",
    details: [
      "Material: 100% premium denim with slight stretch",
      "Fit: Classic fit with customization available",
      "Features: Button closure, chest and side pockets",
      "Color: Classic indigo blue",
      "Care: Machine wash cold, hang to dry",
    ],
  },
  {
    id: "8",
    imgSrc: "/assets/shop-grid-products/shop-grid-product8.png",
    productName: "Silk Scarf",
    sewerName: "David Wilson",
    price: 45.99,
    rating: 4.4,
    sold: 142,
    description:
      "Drape yourself in luxury with this exquisite hand-rolled silk scarf, a wearable work of art that celebrates rich cultural heritage through contemporary design. Crafted from 100% pure mulberry silk renowned for its lustrous sheen and incredibly soft texture, this accessory feels like a gentle whisper against your skin. The intricate patterns draw inspiration from traditional Filipino designs, featuring motifs that tell stories of heritage, nature, and artisan traditions passed down through generations. The hand-rolled edges demonstrate exceptional craftsmanship, ensuring durability while adding a refined finishing touch. This versatile piece transforms any outfit—wear it traditionally around your neck, style it as a headband, tie it to your handbag for a pop of color, or even frame it as art. Whether you're treating yourself or searching for the perfect thoughtful gift, this silk scarf delivers timeless elegance and cultural significance in equal measure.",
    details: [
      "Material: 100% pure mulberry silk",
      'Dimensions: 35" x 35" square',
      "Features: Hand-rolled edges, vibrant prints",
      "Pattern: Exclusive Filipino-inspired designs",
      "Care: Dry clean or hand wash in cold water",
    ],
  },
  {
    id: "9",
    imgSrc: "/assets/shop-grid-products/shop-grid-product9.png",
    productName: "Canvas Backpack",
    sewerName: "Sophia Lee",
    price: 59.99,
    rating: 4.8,
    sold: 201,
    description:
      "Meet your new everyday companion—a durable and stylish canvas backpack expertly designed for modern life's adventures, whether you're navigating urban commutes, exploring new cities, or venturing into the great outdoors. The heavy-duty waxed canvas exterior provides excellent weather resistance while developing a beautiful patina over time, ensuring your backpack looks even better with age. Premium leather accents add sophisticated contrast and enhanced durability at key stress points. The thoughtfully organized interior features multiple compartments including a padded laptop sleeve that safely accommodates devices up to 15 inches, while various pockets keep your phone, wallet, water bottle, and other essentials neatly organized and easily accessible. Padded shoulder straps with adjustable sternum strap distribute weight evenly for comfortable all-day wear, even when fully loaded. The timeless design bridges the gap between rugged functionality and refined style, making this backpack appropriate for the office, classroom, trail, or anywhere your journey takes you.",
    details: [
      "Material: Heavy-duty waxed canvas with leather accents",
      'Capacity: 20L with laptop sleeve (fits up to 15")',
      "Features: Multiple pockets, padded shoulder straps",
      "Hardware: Antique brass buckles and zippers",
      "Care: Spot clean with damp cloth",
    ],
  },
  {
    id: "10",
    imgSrc: "/assets/shop-grid-products/shop-grid-product10.png",
    productName: "Velvet Cushion Cover",
    sewerName: "James Taylor",
    price: 28.99,
    rating: 4.5,
    sold: 175,
    description:
      "Introduce instant luxury and sophisticated comfort to your living space with this sumptuous velvet cushion cover, where opulent texture meets thoughtful design. The premium crushed velvet fabric catches and reflects light beautifully, creating depth and visual interest that changes throughout the day as natural light shifts across your room. The rich, jewel-toned colors—available in stunning emerald, sapphire, and ruby—add dramatic elegance while remaining versatile enough to complement various design aesthetics from contemporary chic to classic traditional. The plush texture invites you to sink in and relax, making your seating areas irresistibly cozy and welcoming. Practical design features include a discreet hidden zipper that maintains clean lines and piped edges that provide structural definition and a polished, couture finish. Whether you're refreshing your current décor, preparing for a special occasion, or simply indulging in a touch of everyday luxury, this cushion cover elevates any space with effortless sophistication.",
    details: [
      "Material: Premium crushed velvet",
      'Size: 20" x 20" (fits standard cushion)',
      "Features: Hidden zipper closure, piped edges",
      "Available in jewel tones: emerald, sapphire, ruby",
      "Care: Dry clean recommended for best results",
    ],
  },
  {
    id: "11",
    imgSrc: "/assets/shop-grid-products/shop-grid-product11.png",
    productName: "Wool Coat",
    sewerName: "Olivia Anderson",
    price: 189.99,
    rating: 5.0,
    sold: 34,
    description:
      "Invest in timeless elegance with this impeccably tailored wool coat, a masterpiece of craftsmanship that combines superior materials with expert construction to create an heirloom-quality garment. The luxurious fabric blend of 80% wool and 20% cashmere provides exceptional warmth without weight, offering unparalleled comfort during cold weather while maintaining a refined, sophisticated drape. Every detail reflects meticulous attention to quality—from the precisely placed double-breasted buttons that create a flattering silhouette to the quilted satin lining that provides additional insulation and slides smoothly over other layers. The classic tailored cut features thoughtful proportions that flatter various body types, with the option for custom sizing to ensure your perfect fit. Interior pockets keep valuables secure, while the structured shoulders and expertly placed seams create a polished, confident look. This coat transcends seasonal trends, becoming a wardrobe cornerstone that you'll reach for year after year, making it a true investment in both style and quality.",
    details: [
      "Material: 80% wool, 20% cashmere blend",
      "Fit: Tailored silhouette with custom sizing available",
      "Features: Double-breasted buttons, interior pockets",
      "Lining: Quilted satin for extra warmth",
      "Care: Professional dry clean only",
    ],
  },
  {
    id: "12",
    imgSrc: "/assets/shop-grid-products/shop-grid-product12.png",
    productName: "Cotton Pajama Set",
    sewerName: "Robert Thomas",
    price: 54.99,
    rating: 4.6,
    sold: 112,
    description:
      "Experience the ultimate in nighttime comfort with this thoughtfully designed cotton pajama set, where quality construction meets luxurious softness for the sleep you deserve. Crafted from 100% long-staple cotton prized for its exceptional durability and breathability, this set gets remarkably softer with each wash while maintaining its structural integrity—the rare combination of getting better over time. The relaxed fit button-up top features a convenient chest pocket perfect for reading glasses or your phone, while the drawstring pants with elastic waistband ensure personalized comfort that accommodates perfectly whether you're settling in for sleep or lounging through a leisurely weekend morning. The breathable natural fabric regulates temperature effectively, keeping you cool in summer and cozy in winter without the sweaty discomfort of synthetic materials. Available in both classic prints and sophisticated solid colors, this versatile set looks put-together enough for answering the door yet feels relaxed enough for deep, restful sleep. Invest in better rest and more comfortable mornings with this essential sleepwear upgrade.",
    details: [
      "Material: 100% long-staple cotton",
      "Set includes: Button-up top and drawstring pants",
      "Features: Chest pocket, elastic waistband",
      "Available in classic prints and solid colors",
      "Care: Machine washable, tumble dry low",
    ],
  },
  {
    id: "13",
    imgSrc: "/assets/shop-grid-products/shop-grid-product13.png",
    productName: "Leather Wallet",
    sewerName: "Emily White",
    price: 39.99,
    rating: 4.7,
    sold: 189,
    description:
      "Carry your essentials with timeless sophistication in this handcrafted leather wallet, where traditional leatherworking techniques meet modern functionality. Made from premium full-grain vegetable-tanned leather—the highest quality leather available—this wallet showcases the natural beauty of genuine leather with its rich texture and authentic character marks that make each piece truly unique. Every stitch is placed by hand with meticulous precision, ensuring exceptional durability that withstands years of daily use while the quality construction prevents stretching and maintains the wallet's refined shape. The thoughtful interior layout provides six dedicated card slots, two spacious bill compartments, and a clear ID window, keeping your essentials organized and easily accessible. As you use this wallet, it develops a distinctive patina that deepens and enriches the leather's color, creating a one-of-a-kind piece that tells the story of your journeys and becomes more beautiful with age. This is more than an accessory—it's an investment in quality craftsmanship that serves you well for decades.",
    details: [
      "Material: Full-grain vegetable-tanned leather",
      'Dimensions: 4.5" W x 3.5" H when closed',
      "Features: 6 card slots, 2 bill compartments, ID window",
      "Hardware: Snap button closure",
      "Care: Condition with leather cream periodically",
    ],
  },
  {
    id: "14",
    imgSrc: "/assets/shop-grid-products/shop-grid-product14.png",
    productName: "Knit Sweater",
    sewerName: "Daniel Harris",
    price: 69.99,
    rating: 4.9,
    sold: 78,
    description:
      "Embrace cozy comfort without sacrificing style with this beautifully hand-knit sweater, a labor of love that showcases intricate cable patterns and traditional craftsmanship. Each sweater is carefully knit by skilled artisans who bring decades of experience to every stitch, creating the complex cable patterns that add visual texture and structural interest to this classic design. The premium merino wool blend combines 70% luxuriously soft merino wool with 30% durable acrylic, creating the perfect balance of warmth, breathability, and easy care. This thoughtful fiber blend ensures the sweater maintains its shape through countless wears while providing temperature regulation that keeps you comfortable indoors and out. The timeless crew neck design and regular fit make this piece incredibly versatile—layer it over a collared shirt for a smart-casual look, wear it alone with jeans for relaxed weekends, or dress it up with tailored trousers for dinner out. Ribbed cuffs and hem provide a snug, comfortable fit that stays in place. Available in carefully curated neutral tones and rich winter colors, this sweater becomes a foundational piece in your cold-weather wardrobe.",
    details: [
      "Material: 70% merino wool, 30% acrylic blend",
      "Fit: Regular fit with ribbed cuffs and hem",
      "Features: Hand-knit cable pattern, crew neck",
      "Available in neutral tones and winter colors",
      "Care: Hand wash cold, lay flat to dry",
    ],
  },
  {
    id: "15",
    imgSrc: "/assets/shop-grid-products/shop-grid-product15.png",
    productName: "Bohemian Maxi Skirt",
    sewerName: "Ava Martin",
    price: 64.99,
    rating: 4.4,
    sold: 145,
    description:
      "Channel your inner free spirit with this flowing bohemian maxi skirt, a feminine and romantic piece that captures the essence of wanderlust and carefree style. The lightweight rayon fabric with its subtle sheen drapes beautifully, creating graceful movement with every step while the tiered layers add volume and visual interest that flatters all body types. Each skirt features exclusive bohemian-inspired floral prints that draw from global textile traditions, combining vibrant colors and intricate patterns that feel both timeless and contemporary. The comfortable elastic waistband ensures a perfect fit without any fussiness, making this piece as practical as it is beautiful—simply pull it on and go. The full-length maxi cut is universally flattering, elongating your silhouette while providing comfortable coverage. This versatile skirt transitions effortlessly from beach days to music festivals, from farmer's market mornings to romantic dinner dates. Pair it with sandals and a simple tank for laid-back summer style, or dress it up with heels and statement jewelry for evening elegance. More than just a skirt, this piece adds a touch of wanderlust and bohemian charm to your wardrobe.",
    details: [
      "Material: Lightweight rayon with subtle sheen",
      'Length: Full length maxi (approximately 38")',
      "Features: Elastic waistband, tiered layers",
      "Pattern: Exclusive bohemian floral prints",
      "Care: Machine wash cold, hang to dry",
    ],
  },
  {
    id: "16",
    imgSrc: "/assets/shop-grid-products/shop-grid-product16.png",
    productName: "Corduroy Pants",
    sewerName: "William Garcia",
    price: 74.99,
    rating: 4.6,
    sold: 93,
    description:
      "Rediscover a classic fabric reimagined for modern life with these impeccably crafted corduroy pants that bridge vintage charm and contemporary style. The premium cotton corduroy features the iconic wide-wale texture that provides visual interest and tactile appeal, while a touch of elastane ensures comfortable stretch that moves with you throughout your day without losing shape. The mid-rise waist sits comfortably at your natural waistline, creating a flattering silhouette that pairs well with both tucked and untucked tops, while the straight leg cut provides a timeless, versatile shape that never goes out of style. Practical five-pocket design mirrors classic denim construction, providing ample storage while maintaining clean lines. These pants excel at versatility—dress them down with sneakers and a casual tee for weekend errands, elevate them with loafers and a button-down for the office, or style them with boots and a blazer for dinner out. Available in a curated selection of earth tones and classic colors that coordinate effortlessly with your existing wardrobe, these corduroy pants become a reliable go-to piece that delivers both comfort and style season after season.",
    details: [
      "Material: 98% cotton corduroy, 2% elastane for stretch",
      "Fit: Straight leg with mid-rise waist",
      "Features: Five-pocket design, belt loops, zip fly",
      "Available in earth tones and classic colors",
      "Care: Machine wash cold, tumble dry low",
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}
