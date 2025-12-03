import Image from "next/image";
import Link from "next/link";
import { Star } from "react-feather";

type Product = {
  imgSrc: string;
  productName: string;
  sewerName: string;
  price: string;
  rating: number;
  sold: number;
};

export interface ProductCardProps {
  product: Product;
}
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="flex flex-col h-160 w-80 bg-primary-light justify-center">
      <div className="flex-1 relative">
        <Link href="">
          <Image
            src={product.imgSrc}
            alt={product.productName}
            fill
            className="object-cover"
          />
        </Link>
      </div>
      <div className="flex flex-col h-40">
        <div className="text-center">
          <h4 className="text-2xl font-medium ">{product.productName}</h4>
          <h5 className="text-lg">{product.sewerName}</h5>
          <h6 className="text-md italic text-gray-400">{product.price}</h6>
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
    </div>
  );
}
