import Image from "next/image";

interface Step {
  number: number;
  title: string;
  description: string;
  image: string;
  bgColor: "purple" | "yellow";
}

interface ProcessStepsProps {
  steps: Step[];
}

export default function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <div className="w-full">
      {steps.map((step, index) => {
        const isImageFirst = index % 2 === 0;
        const bgColorClass =
          step.bgColor === "purple"
            ? "bg-orchid-vertical-b"
            : "bg-secondary-gradient-b";
        const textColorClass =
          step.bgColor === "purple" ? "text-secondary" : "text-[#7B3B7B]";

        return (
          <div
            key={step.number}
            className={`grid grid-cols-1 md:grid-cols-2 ${
              !isImageFirst ? "md:direction-rtl" : ""
            }`}
          >
            <div
              className={`relative w-full h-64 md:h-150 ${
                isImageFirst ? "md:col-start-1" : "md:col-start-2"
              }`}
            >
              <Image
                src={step.image}
                alt={step.title}
                fill
                className="object-cover"
              />
            </div>

            <div
              className={`${bgColorClass} ${textColorClass} flex flex-col items-center justify-center p-8 md:p-12 ${
                isImageFirst ? "md:col-start-2" : "md:col-start-1"
              } md:row-start-1`}
            >
              <h3 className="text-3xl md:text-6xl font-semibold mb-2">
                Step {step.number}
              </h3>
              <p className="text-sm md:text-3xl opacity-90">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
