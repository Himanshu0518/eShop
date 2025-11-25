import {prisma} from "../../src/config/db";

const products = [
  // Kids Products
  {
    name: "Kids Rainbow Hoodie",
    description: "Vibrant rainbow-colored hoodie for kids. Soft fleece interior for warmth.",
    price: 34.99,
    discount: 15,
    category: ["Kids"],
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    img: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500&h=600&fit=crop"
  },
  {
    name: "Kids Tutu Skirt",
    description: "Adorable tulle tutu skirt perfect for dance and dress-up. Multiple layers.",
    price: 24.99,
    discount: 10,
    category: ["Kids"],
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
    img: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500&h=600&fit=crop"
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
    img: "https://images.unsplash.com/photo-1519430044529-ae1e42f31c31?w=500&h=600&fit=crop"
  },
  
  // Accessories
  {
    name: "Leather Gloves",
    description: "Premium leather gloves with warm lining. Perfect for winter elegance.",
    price: 44.99,
    discount: 15,
    category: ["Women", "Men", "Accessories"],
    sizes: ["S", "M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1591103833167-182b1e6f6d8b?w=500&h=600&fit=crop"
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

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
    console.log(`✅ Created: ${product.name}`);
  }

  console.log("🎉 Seeding completed successfully!");
  console.log(`📦 Total products added: ${products.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding products:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });