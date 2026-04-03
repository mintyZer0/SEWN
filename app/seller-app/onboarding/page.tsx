import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { upgradeToSewer } from "@/lib/auth-actions";
import Header from "@/global/Header";
import Footer from "@/global/Footer";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.user_type === "seller") {
    redirect("/");
  }

  return (
    <>
      <Header variant="seller" />
      <div className="fixed inset-0 -z-10 bg-[url(/assets/signup-sewer/signup-sewer-bg.png)] bg-cover bg-center bg-no-repeat w-full h-full" />
      
      <div className="flex min-h-screen items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-2xl">
          <Card className="text-third border-0 shadow-xl bg-white/90 backdrop-blur-sm p-8">
            <CardHeader className="flex flex-col items-center gap-2 text-center pb-8">
              <CardTitle className="text-6xl font-normal">Finish your profile</CardTitle>
              <CardDescription className="text-xl text-third/80">
                Welcome back, {profile?.first_name}! Just a few more details to start selling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={upgradeToSewer}>
                <div className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-xl" htmlFor="first-name">First Name</Label>
                      <Input
                        className="rounded-xl h-12 bg-white"
                        id="first-name"
                        name="first-name"
                        defaultValue={profile?.first_name || ""}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xl" htmlFor="last-name">Last Name</Label>
                      <Input
                        className="rounded-xl h-12 bg-white"
                        id="last-name"
                        name="last-name"
                        defaultValue={profile?.last_name || ""}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-xl" htmlFor="company-name">Shop/Company Name (Optional)</Label>
                    <Input
                      className="rounded-xl h-12 bg-white"
                      id="company-name"
                      name="company-name"
                      placeholder="e.g. Maria's Tailoring"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-xl" htmlFor="dti-sec-number">DTI/SEC Number (Optional)</Label>
                    <Input
                      className="rounded-xl h-12 bg-white"
                      id="dti-sec-number"
                      name="dti-sec-number"
                      placeholder="Registration number"
                    />
                  </div>

                  <div className="grid gap-2 pt-4">
                    <Button
                      type="submit"
                      className="w-full h-16 rounded-2xl bg-secondary-gradient-b text-white text-3xl font-semibold shadow-md hover:opacity-90 transition-all active:scale-95 cursor-pointer"
                    >
                      BECOME A SEWER
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer variant="seller" />
    </>
  );
}
