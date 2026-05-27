import { Phone, Mail, MapPin } from "lucide-react";

interface ContactSewistProps {
  sewistName: string;
  mobileNumber: string;
  email: string;
  location: string;
}

export default function ContactSewist({
  sewistName,
  mobileNumber,
  email,
  location,
}: ContactSewistProps) {
  return (
    <div className="flex flex-col max-w-dvw rounded-lg p-6 sm:p-8 mx-4 sm:mx-10 my-6">
      <h2 className="text-3xl sm:text-4xl md:text-6xl font-light mb-6 text-center text-heading-dark">
        Contact {sewistName}
      </h2>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 flex-wrap text-base sm:text-lg md:text-2xl font-light">
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-gray-700" />
          <span>{mobileNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-600" />
          <span>{email}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-500" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
}
