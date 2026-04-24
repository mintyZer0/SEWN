import Image from "next/image";
import Link from "next/link";

type NewProductProps = {
  id: string;
  name: string;
  price: number;
  img_src: string;
  sewist?: string;
  className?: string;
};

export default function NewProductCard({
  id,
  name,
  img_src,
  sewist,
  price,
  className,
}: NewProductProps) {
  return (
    <Link
      href={`/checkout?id=${id}`}
      className={`${className} card group overflow-hidden border border-transparent hover:border-primary transition-all duration-300`}
    >
      <figure className="relative w-full aspect-3/4">
        <Image
          src={img_src}
          alt={name}
          fill
          sizes="320px"
          className="object-cover rounded-md group-hover:scale-105 transition-transform duration-500"
        />
      </figure>

      <div className="flex flex-col items-center px-4 gap-2">
        <h2 className="card-title text-center text-xl sm:text-3xl pt-4">
          {name}
        </h2>

        {sewist && (
          <p className="text-center text-muted text-lg sm:text-2xl">
            {sewist}
          </p>
        )}

        <p className="text-center font-medium text-base">
          ₱{price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
