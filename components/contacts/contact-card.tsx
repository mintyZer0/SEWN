interface ContactCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  buttonText: string;
  onButtonClick?: () => void;
}

export default function ContactCard({
  title,
  subtitle,
  children,
  buttonText,
  onButtonClick,
}: ContactCardProps) {
  return (
    <div className="bg-orchid-vertical-b rounded-3xl p-6 sm:p-8 text-secondary flex flex-col items-center justify-start">
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">{title}</h3>
      <p className="text-base sm:text-xl md:text-2xl mb-6 opacity-90">{subtitle}</p>
      <div className="border-b border-secondary w-3/4 mb-8"></div>
      <div className="flex-1 flex flex-col  mb-8">{children}</div>
      <button
        onClick={onButtonClick}
        className="bg-[#FFE374] text-heading text-xl sm:text-2xl md:text-4xl px-6 sm:px-8 py-3 sm:py-4 rounded-2xl hover:opacity-90 transition-opacity w-full sm:w-auto"
      >
        {buttonText}
      </button>
    </div>
  );
}
