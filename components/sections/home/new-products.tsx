import NewProductCard from "@/components/ui/new-product-card";

export default function NewProducts() {
  return (
    <>
      <div className="flex flex-col justify-center items-center p-4 m-4">
        <h2 className="text-5xl text-primary">newly added products</h2>
      </div>
      <div className="w-full bg-gray-50">
        <div className="grid grid-cols-3 gap-1 w-40 justify-content-center">
          <NewProductCard
            productName="Urban Grace"
            seller="Aling Maria"
            price="P2499.00"
          ></NewProductCard>
          <NewProductCard
            productName="Urban Grace"
            seller="Aling Maria"
            price="P2499.00"
          ></NewProductCard>
          <NewProductCard
            productName="Urban Grace"
            seller="Aling Maria"
            price="P2499.00"
          ></NewProductCard>
        </div>
      </div>
      I
    </>
  );
}
