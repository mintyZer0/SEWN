import NewProductCard from "@/components/ui/new-product-card";
import { products } from "@/data/products";

export default function NewProducts() {
  const newProducts = products.slice(0, 3);

  return (
    <>
      <div className="flex flex-col justify-center items-center p-4 m-4">
        <h2 className="text-3xl sm:text-5xl text-primary">
          newly added products
        </h2>
      </div>
      <div className="flex justify-center w-auto h-170 mx-30 m-4">
        <div className="grid grid-cols-3 gap-x-30">
          {newProducts.map((product) => (
            <NewProductCard
              key={product.id}
              id={product.id}
              productName={product.productName}
              src={product.imgSrc}
              seller={product.sewerName}
              price={`₱${product.price.toFixed(2)}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
