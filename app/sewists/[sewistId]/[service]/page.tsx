import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import CommissionForm from "@/components/service/commission-form";
import Image from "next/image";
import SeparatorX from "@/components/ui/separator-x";
import ProcessSteps from "@/components/service/process-steps";

interface ServicePageProps {
  params: Promise<{
    sewistId: string;
    service: string;
  }>;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { sewistId, service } = await params;
  
  const supabase = await createClient();
  const { data: user, error } = await supabase
    .from("users")
    .select(`
      id,
      first_name,
      last_name,
      user_type,
      user_avatars (avatar_url),
      sewist_settings (accepting_alterations, accepting_repairs, accepting_commissions)
    `)
    .eq("id", sewistId)
    .single();

  if (error || !user || user.user_type !== "sewist") {
    notFound();
  }

  const settingsArray = Array.isArray(user.sewist_settings) ? user.sewist_settings : [user.sewist_settings].filter(Boolean);
  const settings = settingsArray[0];
  const servicesOffered: ("repair" | "alteration" | "commission")[] = [];
  if (settings?.accepting_repairs) servicesOffered.push("repair");
  if (settings?.accepting_alterations) servicesOffered.push("alteration");
  if (settings?.accepting_commissions) servicesOffered.push("commission");

  const normalizedService = service.toLowerCase();
  const serviceMap: { [key: string]: string } = {
    commission: "Commission",
    repair: "Repair",
    alteration: "Alteration",
  };

  const serviceType = serviceMap[normalizedService];

  if (
    !serviceType ||
    !servicesOffered.includes(normalizedService as any)
  ) {
    notFound();
  }
  
  const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Anonymous Sewist";
  const avatar = user.user_avatars?.[0]?.avatar_url || "/assets/sewist-photos/1.jpg";

  const renderServiceContent = () => {
    switch (normalizedService) {
      case "commission":
        const commissionSteps = [
          {
            number: 1,
            title: "Step 1",
            description: "choose a sewist",
            image: "/assets/commision-steps/commision-step-1.jpg",
            bgColor: "purple" as const,
          },
          {
            number: 2,
            title: "Step 2",
            description: "choose a fabric",
            image: "/assets/commision-steps/commision-step-2.jpg",
            bgColor: "yellow" as const,
          },
          {
            number: 3,
            title: "Step 3",
            description: "get measurements",
            image: "/assets/commision-steps/commision-step-3.jpg",
            bgColor: "purple" as const,
          },
          {
            number: 4,
            title: "Step 4",
            description: "fill up the form",
            image: "/assets/commision-steps/commision-step-4.jpg",
            bgColor: "yellow" as const,
          },
        ];

        return (
          <div className="min-h-screen ">
            <div className="relative h-100 w-full">
              <Image
                src="/assets/services-bento-bg/bento-commision.jpg"
                alt="Commission a Sewist"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-5xl md:text-6xl font-light text-white drop-shadow-lg">
                  Commission a Sewist
                </h1>
              </div>
            </div>

            <div className="max-w-300 mx-auto text-center py-12 px-4">
              <h2 className="text-6xl font-semibold text-heading mb-3">
                Here at SEWN
              </h2>
              <p className="text-2xl">
                we value efficiency above all,
                <br />
                commissioning a sewist is so easy!
              </p>
            </div>
            <SeparatorX />
            <CommissionForm sewistName={name} sewistImage={avatar} sewistId={sewistId} serviceType="commission" />
            <ProcessSteps steps={commissionSteps} />
          </div>
        );

      case "repair":
        const repairSteps = [
          {
            number: 1,
            title: "Step 1",
            description: "choose a sewist",
            image: "/assets/repair-steps/repair-step-1.jpg",
            bgColor: "purple" as const,
          },
          {
            number: 2,
            title: "Step 2",
            description: "specify repair details",
            image: "/assets/repair-steps/repair-step-2.jpg",
            bgColor: "yellow" as const,
          },
          {
            number: 3,
            title: "Step 3",
            description: "fill up the form",
            image: "/assets/repair-steps/repair-step-3.jpg",
            bgColor: "purple" as const,
          },
        ];

        return (
          <div className="min-h-screen ">
            <div className="relative h-100 w-full">
              <Image
                src="/assets/repair-steps/repair-hero.jpg"
                alt="Commission a Sewist"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-5xl md:text-6xl font-medium text-black  drop-shadow-lg">
                  Repair
                </h1>
              </div>
            </div>

            <div className="max-w-300 mx-auto text-center py-12 px-4">
              <h2 className="text-6xl font-semibold text-heading mb-3">
                Here at SEWN
              </h2>
              <p className="text-2xl">
                we value efficiency above all,
                <br />
                commissioning a sewist is so easy!
              </p>
            </div>
            <SeparatorX />
            <CommissionForm
              sewistName={name}
              sewistImage={avatar}
              sewistId={sewistId}
              serviceType="repair"
              disableFabric={true}
              disableMeasurements={true}
              orderDetailsLabel="Repair Details"
            />
            <ProcessSteps steps={repairSteps} />
          </div>
        );

      case "alteration":
        const alterationSteps = [
          {
            number: 1,
            title: "Step 1",
            description: "choose a sewist",
            image: "/assets/alteration-steps/alteration-step-1.jpg",
            bgColor: "purple" as const,
          },
          {
            number: 2,
            title: "Step 2",
            description: "specify alteration details",
            image: "/assets/alteration-steps/alteration-step-2.jpg",
            bgColor: "yellow" as const,
          },
          {
            number: 3,
            title: "Step 3",
            description: "fill up the form",
            image: "/assets/alteration-steps/alteration-step-3.jpg",
            bgColor: "purple" as const,
          },
        ];

        return (
          <div className="min-h-screen ">
            <div className="relative h-100 w-full">
              <Image
                src="/assets/services-bento-bg/bento-commision.jpg"
                alt="Commission a Sewist"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-5xl md:text-6xl font-light text-white drop-shadow-lg">
                  Commission a Sewist
                </h1>
              </div>
            </div>

            <div className="max-w-300 mx-auto text-center py-12 px-4">
              <h2 className="text-6xl font-semibold text-heading mb-3">
                Here at SEWN
              </h2>
              <p className="text-2xl">
                we value efficiency above all,
                <br />
                commissioning a sewist is so easy!
              </p>
            </div>
            <SeparatorX />
            <CommissionForm sewistName={name} sewistImage={avatar} sewistId={sewistId} serviceType="alteration" />
            <ProcessSteps steps={alterationSteps} />
          </div>
        );

      default:
        return notFound();
    }
  };

  return renderServiceContent();
}
