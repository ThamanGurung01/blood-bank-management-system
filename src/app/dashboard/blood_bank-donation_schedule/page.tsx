import { getBloodBankDonationRequests } from "@/actions/donationScheduleActions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DonationScheduleTable from "@/components/donation-schedule-table";

// Define the interface to ensure type safety
interface DonationRequest {
  _id: string;
  donor: {
    profileImage?: string;
    _id: string;
    donorId: string;
    blood_group: string;
    age: number;
    contact: string;
  };
  blood_bank: string;
  requested_date: string;
  status: string;
  rejection_reason: string;
  scheduled_time_slot: string;
  createdAt: string;
  updatedAt: string;
}

const BloodBankDonationSchedulePage = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return (
        <div className="container mx-auto py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Donation Schedule Management</h1>
            <p className="text-red-600">Please log in to view donation requests</p>
          </div>
        </div>
      );
    }

    const result = await getBloodBankDonationRequests(
      session.user.id as string,
      "pending"
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

    // Ensure the data is properly serialized and clean
    const cleanedRequests: DonationRequest[] = (result.data || []).map((request: any) => ({
      _id: String(request._id || ''),
      donor: {
        profileImage: request.donor?.profileImage || undefined,
        _id: String(request.donor?._id || ''),
        donorId: String(request.donor?.donorId || ''),
        blood_group: String(request.donor?.blood_group || ''),
        age: Number(request.donor?.age || 0),
        contact: String(request.donor?.contact || ''),
      },
      blood_bank: String(request.blood_bank || ''),
      requested_date: String(request.requested_date || ''),
      status: String(request.status || ''),
      rejection_reason: String(request.rejection_reason || ''),
      scheduled_time_slot: String(request.scheduled_time_slot || ''),
      createdAt: String(request.createdAt || ''),
      updatedAt: String(request.updatedAt || ''),
    }));

    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Donation Schedule Management</h1>
          <p className="text-muted-foreground">
            Review and manage pending donation requests
          </p>
        </div>

        <DonationScheduleTable requests={cleanedRequests} />
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