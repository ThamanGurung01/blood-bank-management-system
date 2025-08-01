import { getBloodBankDonationRequests } from "@/actions/donationScheduleActions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DonationScheduleTable from "@/components/donation-schedule-table";

const BloodBankDonationSchedulePage = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return (
        <div className="container mx-auto py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Donation Schedule Management</h1>
            <p className="text-red-600">
              Please log in to view donation requests
            </p>
          </div>
        </div>
      );
    }

    const result = await getBloodBankDonationRequests(
      session.user.id as string,
      "all"
    );

    console.log("data", result.data);

    if (!result.success) {
      return (
        <div className="container mx-auto py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Donation Schedule Management</h1>
            <p className="text-red-600">
              Error loading donation requests: {result.error || "Unknown error"}
            </p>
          </div>
        </div>
      );
    }

    // Data is now already cleaned in the server action
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Donation Schedule Management</h1>
          <p className="text-muted-foreground">
            Review and manage pending donation requests
          </p>
        </div>

        <DonationScheduleTable requests={result.data || []} />
      </div>
    );
  } catch (error) {
    console.error("Error in BloodBankDonationSchedulePage:", error);

    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Donation Schedule Management</h1>
          <p className="text-red-600">
            An unexpected error occurred. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }
};

export default BloodBankDonationSchedulePage;
