interface NewProductProps {
  productName: string;
  seller: string;
  price: string;
}

export default function NewProductCard({
  productName,
  seller,
  price,
}: NewProductProps) {
  return (
    <div className="card bg-base-100 md:w-80 lg:w-80 shadow-sm md:h-[400px] lg:h-[600px] overflow-hidden">
      <figure className="w-full">
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Product"
          className="w-full md:h-[400px] object-cover rounded-md"
        />
      </figure>

      <div className="card-body items-center bg-secondary pt-4 px-4">
        <h2 className="card-title text-center text-3xl">{productName}</h2>
        <p className="text-center  text-muted text-2xl">{seller}</p>
        <p className="text-center font-medium mt-2 text-md">{price}</p>
      </div>
    </div>
  );
}
