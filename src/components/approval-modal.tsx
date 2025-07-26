"use client";

import type React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Import the action
import { updateDonationRequestStatus } from "@/actions/donationScheduleActions";

interface DonationRequest {
  _id: string;
  donor: {
    donorId: string;
    blood_group: string;
  };
  requested_date: string;
  scheduled_time_slot: string;
}

interface ApprovalModalProps {
  request: DonationRequest;
  onClose: () => void;
}

export function ApprovalModal({ request, onClose }: ApprovalModalProps) {
  const [loading, setLoading] = useState(false);
  const [changeSchedule, setChangeSchedule] = useState(false);
  const [newDate, setNewDate] = useState(
    format(new Date(request.requested_date), "yyyy-MM-dd")
  );
  const [newTimeSlot, setNewTimeSlot] = useState(request.scheduled_time_slot);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateDonationRequestStatus({
        requestId: request._id,
        status: "approved",
        rejectionReason: "",
        newDate: changeSchedule ? new Date(newDate) : undefined,
        newTimeSlot: changeSchedule ? newTimeSlot : undefined,
      });

      if (result.success) {
        toast.success("Request Approved", {
          description: result.message,
        });
        onClose();
        // Use router.refresh() instead of window.location.reload()
        router.refresh();
      } else {
        toast.error("Error Approving Request", {
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Error", {
        description: "Failed to approve request",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg bg-green-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            Approve Donation Request
          </DialogTitle>
          <DialogDescription>
            Approve donation request for donor {request.donor.donorId} (
            {request.donor.blood_group})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="change-schedule"
                checked={changeSchedule}
                onCheckedChange={(checked) =>
                  setChangeSchedule(checked as boolean)
                }
              />
              <Label htmlFor="change-schedule" className="text-sm">
                Modify schedule details
              </Label>
            </div>

            {changeSchedule && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <Label htmlFor="new-date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    New Date
                  </Label>
                  <Input
                    id="new-date"
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="new-time-slot"
                    className="flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    New Time Slot
                  </Label>
                  <Input
                    id="new-time-slot"
                    type="text"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    placeholder="e.g., 10:00-11:00"
                    required
                  />
                </div>
              </div>
            )}

            {!changeSchedule && (
              <div className="p-4 border rounded-lg bg-green-50">
                <h4 className="font-medium text-green-800 mb-2">
                  Current Schedule
                </h4>
                <div className="text-sm text-green-700 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(request.requested_date), "PPP")}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {request.scheduled_time_slot}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Approving..." : "Approve Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
