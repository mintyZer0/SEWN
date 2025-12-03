import ProductCard from "@/components/ui/product-card";

export default function Products() {
  const products = [
    {
      imgSrc: "/assets/shop-grid-products/shop-grid-product1.png",
      productName: "Mint Muse",
      sewerName: "Ysabel Santiago",
      price: "₱1299.00",
      rating: 4.9,
      sold: 63,
    },
    {
      imgSrc: "/assets/shop-grid-products/shop-grid-product2.png",
      productName: "Fantasy Man",
      sewerName: "Ysabel Santiago",
      price: "₱3299.00",
      rating: 4.9,
      sold: 36,
    },
    {
      imgSrc: "/assets/shop-grid-products/shop-grid-product3.png",
      productName: "Walk Rhythm",
      sewerName: "Ysabel Santiago",
      price: "₱1499.00",
      rating: 5.0,
      sold: 15,
    },
  ];

  return (
    <div className="flex flex-col items-center py-16 px-8">
      <h2 className="text-6xl text-primary-dark font-light mb-12">Products</h2>
      <div className="grid grid-cols-3 gap-x-20 mb-8">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      <button className="text-2xl text-primary-dark hover:underline">
        See more
      </button>
    </div>
  );
}
