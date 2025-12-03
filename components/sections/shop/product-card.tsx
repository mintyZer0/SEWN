import Image from "next/image";
import Link from "next/link";
import { Star } from "react-feather";

type Product = {
  id: string;
  imgSrc: string;
  productName: string;
  sewerName: string;
  price: number;
  rating: number;
  sold: number;
};

export interface ProductCardProps {
  product: Product;
}
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/checkout?id=${product.id}`}
      className="flex flex-col h-160 w-80 bg-primary-light hover:shadow-lg transition-shadow"
    >
      <div className="flex-1 relative">
        <Image
          src={product.imgSrc}
          alt={product.productName}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col h-40">
        <div className="text-center">
          <h4 className="text-2xl font-medium ">{product.productName}</h4>
          <h5 className="text-lg">{product.sewerName}</h5>
          <h6 className="text-md italic text-gray-400">
            ₱
            {typeof product.price === "number"
              ? product.price.toFixed(2)
              : product.price}
          </h6>
        </div>
        <div className="flex flex-1 p-4 gap-2 align-bottom items-end justify-between">
          <div className="flex gap-2">
            <Star fill="fill-primary" stroke="#7b3b7b" />
            <span>{product.rating}</span>
          </div>
          <div>
            <span>{product.sold} sold</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
