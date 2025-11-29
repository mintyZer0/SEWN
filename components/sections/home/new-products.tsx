import NewProductCard from "@/components/ui/new-product-card";

export default function NewProducts() {
  return (
    <>
      <div className="flex flex-col justify-center items-center p-4 m-4">
        <h2 className="text-3xl sm:text-5xl text-primary">
          newly added products
        </h2>
      </div>
      <div className="flex justify-center w-auto h-170 mx-30 m-4">
        <div className="grid grid-cols-3 gap-x-30">
          <NewProductCard
            productName="Urban Grace"
            src="/assets/newProduct1.jpg"
            seller="Aling Maria"
            price="P2499.00"
          ></NewProductCard>
          <NewProductCard
            productName="Urban Grace"
            src="/assets/newProduct2.jpg"
            seller="Aling Maria"
            price="P2499.00"
          ></NewProductCard>
          <NewProductCard
            productName="Urban Grace"
            src="/assets/newProduct3.jpg"
            seller="Aling Maria"
            price="P2499.00"
          ></NewProductCard>
        </div>
      </div>
    </>
  );
}
