import Image from "next/image";
import Link from "next/link";

interface NewProductProps {
  id: string;
  productName: string;
  src: string;
  seller: string;
  price: string;
}

export default function NewProductCard({
  id,
  productName,
  src,
  seller,
  price,
}: NewProductProps) {
  return (
    <Link
      href={`/checkout?id=${id}`}
      className="card group overflow-hidden border border-transparent hover:border-primary transition-all duration-300 w-100"
    >
      <figure className="relative w-full aspect-3/4">
        <Image
          src={src}
          alt="Product"
          fill
          sizes="320px"
          className="object-cover rounded-md group-hover:scale-105 transition-transform transform duration-500"
        />
      </figure>

      <div className="flex flex-col items-center px-4 gap-2">
        <h2 className="card-title text-center text-xl sm:text-3xl pt-4">
          {productName}
        </h2>
        <p className="text-center text-muted text-lg sm:text-2xl">{seller}</p>
        <p className="text-center font-medium text-base">{price}</p>
      </div>
    </Link>
  );
}
