import { getBloodBankDonationRequests } from "@/actions/donationScheduleActions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DonationScheduleTable from "@/components/donation-schedule-table";

const BloodBankDonationSchedulePage = async () => {
  const session = await getServerSession(authOptions);
  console.log("session", session);

  const { data } = await getBloodBankDonationRequests(
    session?.user.id as string,
    "pending"
  );
  console.log("requestsResult", data);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Donation Schedule Management</h1>
        <p className="text-muted-foreground">
          Review and manage pending donation requests
        </p>
      </div>

      <DonationScheduleTable requests={data || []} />
    </div>
  );
};

export default BloodBankDonationSchedulePage;
