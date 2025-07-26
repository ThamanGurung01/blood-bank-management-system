"use client";

import type React from "react";
import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
}

interface RejectionModalProps {
  request: DonationRequest;
  onClose: () => void;
}

export function RejectionModal({ request, onClose }: RejectionModalProps) {
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rejectionReason.trim()) {
      toast.warning("Rejection Reason Required", {
        description: "Please provide a reason for rejecting this request.",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await updateDonationRequestStatus({
        requestId: request._id,
        status: "rejected",
        rejectionReason: rejectionReason.trim(),
      });

      if (result.success) {
        toast.success("Request Rejected", {
          description: result.message,
        });
        onClose();
        // Use router.refresh() instead of window.location.reload()
        router.refresh();
      } else {
        toast.error("Error Rejecting Request", {
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Error", {
        description: "Failed to reject request",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <X className="h-5 w-5 text-red-600" />
            Reject Donation Request
          </DialogTitle>
          <DialogDescription>
            Reject donation request for donor {request.donor.donorId} (
            {request.donor.blood_group})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-800">
              This action cannot be undone. Please provide a clear reason for
              rejection.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rejection-reason">
              Reason for Rejection <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a detailed reason for rejecting this donation request..."
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              This reason will be communicated to the donor.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={loading || !rejectionReason.trim()}
            >
              {loading ? "Rejecting..." : "Reject Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
