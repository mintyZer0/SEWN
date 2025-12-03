"use client";

interface AddressStepProps {
  onSubmit: (data: AddressFormData) => void;
}

export interface AddressFormData {
  email: string;
  phoneNumber: string;
  fullName: string;
  address: string;
}

export default function AddressStep({ onSubmit }: AddressStepProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: AddressFormData = {
      email: formData.get("email") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      fullName: formData.get("fullName") as string,
      address: formData.get("address") as string,
    };
    onSubmit(data);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-4xl  text-primary mb-8">Address</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number *
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Full Address *
          </label>
          <textarea
            id="address"
            name="address"
            required
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Confirm Address
        </button>

        <p className="text-center text-xs text-gray-600">
          By continuing, you agree to our Terms and Conditions
        </p>
      </form>
    </div>
  );
}
