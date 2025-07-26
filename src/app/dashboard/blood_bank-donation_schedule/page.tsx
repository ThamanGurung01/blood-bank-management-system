import { getBloodBankDonationRequests } from "@/actions/donationScheduleActions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const BloodBankDonationSchedulePage = async () => {
  const session = await getServerSession(authOptions);
  console.log("session", session);

  const { data } = await getBloodBankDonationRequests(
    session?.user.id as string,
    "pending"
  );
  console.log("requestsResult", data);

  return <div>Donation Schedule</div>;
};

export default BloodBankDonationSchedulePage;
