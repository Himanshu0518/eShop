import { prisma } from "../../src/config/db";

const products = [
  {
    name: "test product",
    description: "buy this amazing product with 10% discount",
    price: 399.9,
    discount: 10,
    category: ["men"],
    sizes: ["M"],
    img: "http://res.cloudinary.com/ddcpxgeua/image/upload/v1763994090/gbpcwagwjqls0ovj7h8m.jpg"
  },
  {
    name: "Classic White T-Shirt",
    description: "Premium cotton white t-shirt with a comfortable fit. Perfect for everyday wear.",
    price: 29.99,
    discount: 0,
    category: ["Women", "Men"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop"
  },
  {
    name: "Denim Jacket",
    description: "Timeless denim jacket with a modern fit. Essential wardrobe piece.",
    price: 89.99,
    discount: 15,
    category: ["Women", "Men"],
    sizes: ["S", "M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&h=600&fit=crop"
  },
  {
    name: "Black Leather Boots",
    description: "Genuine leather boots with superior comfort and durability.",
    price: 149.99,
    discount: 20,
    category: ["Women"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    img: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=600&fit=crop"
  },
  {
    name: "Slim Fit Jeans",
    description: "Modern slim fit jeans with stretch comfort. Available in multiple washes.",
    price: 69.99,
    discount: 10,
    category: ["Men"],
    sizes: ["28", "30", "32", "34", "36", "38"],
    img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=600&fit=crop"
  },
  {
    name: "Cotton Hoodie",
    description: "Comfortable cotton hoodie perfect for casual wear. Soft and cozy.",
    price: 49.99,
    discount: 0,
    category: ["Women", "Men"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop"
  },
  {
    name: "Summer Dress",
    description: "Elegant summer dress with floral print. Lightweight and breathable.",
    price: 59.99,
    discount: 25,
    category: ["Women"],
    sizes: ["XS", "S", "M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop"
  },
  {
    name: "Leather Wallet",
    description: "Premium leather wallet with multiple card slots. Compact and stylish.",
    price: 39.99,
    discount: 0,
    category: ["Men", "Accessories"],
    sizes: ["One Size"],
    img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=600&fit=crop"
  },
  {
    name: "Sneakers",
    description: "Comfortable sneakers perfect for everyday activities. Lightweight design.",
    price: 79.99,
    discount: 15,
    category: ["Women", "Men"],
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44"],
    img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop"
  },
  {
    name: "Wool Scarf",
    description: "Soft wool scarf to keep you warm. Available in multiple colors.",
    price: 34.99,
    discount: 10,
    category: ["Women", "Men", "Accessories"],
    sizes: ["One Size"],
    img: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500&h=600&fit=crop"
  },
  {
    name: "Formal Shirt",
    description: "Classic formal shirt for office and special occasions. Wrinkle-free fabric.",
    price: 54.99,
    discount: 0,
    category: ["Men"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=600&fit=crop"
  },
  {
    name: "Yoga Pants",
    description: "Stretchy and comfortable yoga pants. Perfect for workouts and casual wear.",
    price: 44.99,
    discount: 20,
    category: ["Women"],
    sizes: ["XS", "S", "M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1506529082955-511b1aa562c8?w=500&h=600&fit=crop"
  },
  {
    name: "Baseball Cap",
    description: "Adjustable baseball cap with embroidered logo. One size fits all.",
    price: 24.99,
    discount: 0,
    category: ["Women", "Men", "Accessories"],
    sizes: ["One Size"],
    img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=600&fit=crop"
  },
  {
    name: "Running Shorts",
    description: "Lightweight running shorts with moisture-wicking fabric.",
    price: 34.99,
    discount: 15,
    category: ["Men"],
    sizes: ["S", "M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=600&fit=crop"
  },
  {
    name: "Crossbody Bag",
    description: "Stylish crossbody bag with multiple compartments. Perfect for daily use.",
    price: 64.99,
    discount: 10,
    category: ["Women", "Accessories"],
    sizes: ["One Size"],
    img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&h=600&fit=crop"
  },
  {
    name: "Polo Shirt",
    description: "Classic polo shirt with modern fit. Great for casual and smart-casual looks.",
    price: 39.99,
    discount: 0,
    category: ["Men"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    img: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=500&h=600&fit=crop"
  },
  {
    name: "Knit Sweater",
    description: "Cozy knit sweater for cold weather. Soft and warm.",
    price: 69.99,
    discount: 25,
    category: ["Women"],
    sizes: ["XS", "S", "M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&h=600&fit=crop"
  },
  {
    name: "Backpack",
    description: "Durable backpack with laptop compartment. Perfect for work or travel.",
    price: 79.99,
    discount: 15,
    category: ["Women", "Men", "Accessories"],
    sizes: ["One Size"],
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop"
  },
  {
    name: "Chino Pants",
    description: "Versatile chino pants suitable for casual and formal occasions.",
    price: 59.99,
    discount: 10,
    category: ["Men"],
    sizes: ["28", "30", "32", "34", "36", "38"],
    img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=600&fit=crop"
  },
  {
    name: "Sunglasses",
    description: "UV protection sunglasses with stylish frames. Protect your eyes in style.",
    price: 49.99,
    discount: 0,
    category: ["Women", "Men", "Accessories"],
    sizes: ["One Size"],
    img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=600&fit=crop"
  },
  {
    name: "Maxi Skirt",
    description: "Flowing maxi skirt perfect for summer days. Comfortable and stylish.",
    price: 54.99,
    discount: 20,
    category: ["Women"],
    sizes: ["XS", "S", "M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&h=600&fit=crop"
  },
  {
    name: "Running Shorts",
    description: "Lightweight running shorts with moisture-wicking fabric.",
    price: 199.9,
    discount: 0,
    category: ["Women", "Men"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    img: "http://res.cloudinary.com/ddcpxgeua/image/upload/v1764079491/paxnghhqxsgln8zqdhkv.jpg"
  },
  {
    name: "Leather Belt",
    description: "Classic leather belt with elegant buckle. Perfect finishing touch.",
    price: 34.99,
    discount: 0,
    category: ["Men", "Accessories"],
    sizes: ["S", "M", "L", "XL"],
    img: "http://res.cloudinary.com/ddcpxgeua/image/upload/v1764080391/z99lwof40zcxib0tsxxq.jpg"
  },
  {
    name: "Statement Necklace",
    description: "Elegant statement necklace to elevate any outfit. Gold-plated finish.",
    price: 29.99,
    discount: 15,
    category: ["Women", "Accessories"],
    sizes: ["One Size"],
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=600&fit=crop"
  },
  {
    name: "Watch",
    description: "Stylish analog watch with leather strap. Water-resistant design.",
    price: 89.99,
    discount: 20,
    category: ["Women", "Men", "Accessories"],
    sizes: ["One Size"],
    img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&h=600&fit=crop"
  },
  {
    name: "Silk Tie",
    description: "Premium silk tie for formal occasions. Multiple patterns available.",
    price: 24.99,
    discount: 0,
    category: ["Men", "Accessories"],
    sizes: ["One Size"],
    img: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=500&h=600&fit=crop"
  },
  {
    name: "Kids Graphic T-Shirt",
    description: "Fun and colorful graphic t-shirt for kids. Soft cotton material.",
    price: 19.99,
    discount: 10,
    category: ["Kids"],
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&h=600&fit=crop"
  },
  {
    name: "Kids Denim Overalls",
    description: "Adorable denim overalls with adjustable straps. Perfect for playtime.",
    price: 39.99,
    discount: 15,
    category: ["Kids"],
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
    img: "http://res.cloudinary.com/ddcpxgeua/image/upload/v1764079845/yorvzh6jhlspjrbomi12.jpg"
  },
  {
    name: "Kids Sneakers",
    description: "Comfortable and durable sneakers with fun designs. Easy to put on.",
    price: 44.99,
    discount: 20,
    category: ["Kids"],
    sizes: ["25", "26", "27", "28", "29", "30", "31", "32", "33"],
    img: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=500&h=600&fit=crop"
  },
  {
    name: "Kids Winter Jacket",
    description: "Warm and cozy winter jacket with hood. Water-resistant material.",
    price: 59.99,
    discount: 25,
    category: ["Kids"],
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    img: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500&h=600&fit=crop"
  },
  {
    name: "Kids Rainbow Hoodie",
    description: "Vibrant rainbow-colored hoodie for kids. Soft fleece interior for warmth.",
    price: 34.99,
    discount: 15,
    category: ["Kids"],
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    img: "http://res.cloudinary.com/ddcpxgeua/image/upload/v1764079675/wwjtp04nodmxx9sbszdd.jpg"
  },
  {
    name: "Kids Tutu Skirt",
    description: "Adorable tulle tutu skirt perfect for dance and dress-up. Multiple layers.",
    price: 24.99,
    discount: 10,
    category: ["Kids"],
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
    img: "http://res.cloudinary.com/ddcpxgeua/image/upload/v1764080227/f0fo6j18x0bxmg8zqixe.jpg"
  },
  {
    name: "Kids Cargo Shorts",
    description: "Durable cargo shorts with multiple pockets. Perfect for outdoor adventures.",
    price: 27.99,
    discount: 0,
    category: ["Kids"],
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&h=600&fit=crop"
  },
  {
    name: "Kids Rain Boots",
    description: "Waterproof rain boots with fun prints. Keep little feet dry and happy.",
    price: 32.99,
    discount: 20,
    category: ["Kids"],
    sizes: ["24", "25", "26", "27", "28", "29", "30", "31"],
    img: "http://res.cloudinary.com/ddcpxgeua/image/upload/v1764080109/veq2mr5qsp6jv5njz560.avif"
  },
  {
    name: "Fedora Hat",
    description: "Classic fedora hat made from quality felt. Timeless accessory.",
    price: 39.99,
    discount: 0,
    category: ["Women", "Men", "Accessories"],
    sizes: ["S/M", "L/XL"],
    img: "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=500&h=600&fit=crop"
  },
  {
    name: "Hoop Earrings",
    description: "Gold-plated hoop earrings. Modern and versatile design.",
    price: 22.99,
    discount: 10,
    category: ["Women", "Accessories"],
    sizes: ["One Size"],
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=600&fit=crop"
  },
  {
    name: "Leather Gloves",
    description: "Premium leather gloves with warm lining. Perfect for winter elegance.",
    price: 44.99,
    discount: 15,
    category: ["Women", "Men", "Accessories"],
    sizes: ["S", "M", "L", "XL"],
    img: "http://res.cloudinary.com/ddcpxgeua/image/upload/v1764080512/cmpo313c9hnbzr9q361s.jpg"
  },
  {
    name: "Travel Luggage Tag",
    description: "Durable leather luggage tag with name card slot. Travel in style.",
    price: 14.99,
    discount: 0,
    category: ["Accessories"],
    sizes: ["One Size"],
    img: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=500&h=600&fit=crop"
  }
];

async function main() {
  console.log("🌱 Starting to seed products...");

  try {
    // Delete existing products (optional - comment out if you want to keep existing data)
    // await prisma.product.deleteMany({});
    // console.log("🗑️ Cleared existing products");

    for (const product of products) {
      await prisma.product.create({
        data: product,
      });
      console.log(`✅ Created: ${product.name}`);
    }

    console.log("🎉 Seeding completed successfully!");
    console.log(`📦 Total products added: ${products.length}`);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();