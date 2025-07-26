"use client";

import { useState, useCallback } from "react";
import { format } from "date-fns";
import { Calendar, Clock, User, Phone, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Import modals dynamically to avoid potential circular dependencies
import dynamic from "next/dynamic";

const ApprovalModal = dynamic(() => import("./approval-modal").then(mod => ({ default: mod.ApprovalModal })), {
  ssr: false,
});

const RejectionModal = dynamic(() => import("./rejection-model").then(mod => ({ default: mod.RejectionModal })), {
  ssr: false,
});

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

interface DonationScheduleTableProps {
  requests: DonationRequest[];
}

export default function DonationScheduleTable({
  requests,
}: DonationScheduleTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<DonationRequest | null>(null);
  const [modalType, setModalType] = useState<"approve" | "reject" | null>(null);

  const handleApprove = useCallback((request: DonationRequest) => {
    setSelectedRequest(request);
    setModalType("approve");
  }, []);

  const handleReject = useCallback((request: DonationRequest) => {
    setSelectedRequest(request);
    setModalType("reject");
  }, []);

  const closeModal = useCallback(() => {
    setSelectedRequest(null);
    setModalType(null);
  }, []);

  // Early return for empty requests
  if (!requests || requests.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Droplet className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
          <p className="text-muted-foreground text-center">
            There are no pending donation requests at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {requests.map((request) => {
          // Ensure we have valid data before rendering
          if (!request || !request._id || !request.donor) {
            return null;
          }

          return (
            <Card key={request._id} className="w-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Donation Request #{request.donor.donorId || 'Unknown'}
                  </CardTitle>
                  <Badge variant="secondary" className="capitalize">
                    {request.status || 'pending'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Donor Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Donor Information
                    </h4>

                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={request.donor.profileImage || "/placeholder.svg?height=40&width=40"}
                          alt={`Donor ${request.donor.donorId}`}
                        />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          Donor ID: {request.donor.donorId || 'Unknown'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Age: {request.donor.age || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-red-500" />
                      <span className="font-medium">
                        {request.donor.blood_group || 'Unknown'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{request.donor.contact || 'No contact'}</span>
                    </div>
                  </div>

                  {/* Schedule Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Schedule Details
                    </h4>

                    {request.requested_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {format(new Date(request.requested_date), "PPP")}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {request.scheduled_time_slot || 'No time specified'}
                      </span>
                    </div>

                    {request.createdAt && (
                      <div className="text-xs text-muted-foreground">
                        Requested: {format(new Date(request.createdAt), "PPp")}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-4 border-t">
                  <Button
                    onClick={() => handleApprove(request)}
                    className="flex-1"
                    variant="default"
                  >
                    Approve Request
                  </Button>
                  <Button
                    onClick={() => handleReject(request)}
                    className="flex-1"
                    variant="destructive"
                  >
                    Reject Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modals */}
      {modalType === "approve" && selectedRequest && (
        <ApprovalModal request={selectedRequest} onClose={closeModal} />
      )}

      {modalType === "reject" && selectedRequest && (
        <RejectionModal request={selectedRequest} onClose={closeModal} />
      )}
    </>
  );
}