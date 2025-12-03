import ContactCard from "@/components/contacts/contact-card";

export default function ContactsPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-semi-bold text-primary mb-2">
            Contacts
          </h1>
          <p className="text-2xl text-primary">Contact our Representatives</p>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-16 h-150">
          <ContactCard
            title="By Phone"
            subtitle="(Mon to Fri)"
            buttonText="Call Now!"
          >
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-2xl mb-2">Globe</p>
                <p className="text-4xl font-light">092 4628 1844</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mb-2">Smart</p>
                <p className="text-4xl font-light">091 3328 1353</p>
              </div>
            </div>
          </ContactCard>

          <ContactCard title="Email" subtitle="GMAIL" buttonText="Email Now!">
            <div className="space-y-4">
              <p className="text-2xl">sewn@gmail.com</p>
              <p className="text-2xl">sewnOfficial@gmail.com</p>
            </div>
          </ContactCard>

          <ContactCard title="Live Chat" subtitle="." buttonText="Start Chat!">
            <p className="text-4xl text-center">
              Chat now with our customer
              <br />
              support service!
            </p>
          </ContactCard>
        </div>
      </div>
    </div>
  );
}
