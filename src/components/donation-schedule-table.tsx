"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, User, Phone, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApprovalModal } from "./approval-modal";
import { RejectionModal } from "./rejection-model";

interface DonationRequest {
  _id: string;
  donor: {
    profileImage?: {
      url: string;
    };
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
  const [selectedRequest, setSelectedRequest] =
    useState<DonationRequest | null>(null);
  const [modalType, setModalType] = useState<"approve" | "reject" | null>(null);

  const handleApprove = (request: DonationRequest) => {
    setSelectedRequest(request);
    setModalType("approve");
  };

  const handleReject = (request: DonationRequest) => {
    setSelectedRequest(request);
    setModalType("reject");
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setModalType(null);
  };

  if (requests.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <Droplet className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
        <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
        <p className="text-muted-foreground">
          There are no pending donation requests at the moment.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[200px]">Donor Information</TableHead>
              <TableHead className="w-[120px]">Blood Group</TableHead>
              <TableHead className="w-[80px]">Age</TableHead>
              <TableHead className="w-[120px]">Contact</TableHead>
              <TableHead className="w-[150px]">Requested Date</TableHead>
              <TableHead className="w-[120px]">Time Slot</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px]">Requested On</TableHead>
              <TableHead className="w-[200px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request._id} className="hover:bg-muted/30">
                {/* Donor Information */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          request.donor.profileImage?.url ||
                          "/placeholder.svg?height=40&width=40"
                        }
                        alt={`Donor ${request.donor.donorId}`}
                      />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {request.donor.donorId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: {request.donor._id.slice(-6)}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Blood Group */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-red-500" />
                    <span className="font-medium">
                      {request.donor.blood_group}
                    </span>
                  </div>
                </TableCell>

                {/* Age */}
                <TableCell>
                  <span className="text-sm">{request.donor.age}</span>
                </TableCell>

                {/* Contact */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{request.donor.contact}</span>
                  </div>
                </TableCell>

                {/* Requested Date */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">
                      {format(new Date(request.requested_date), "MMM dd, yyyy")}
                    </span>
                  </div>
                </TableCell>

                {/* Time Slot */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">
                      {request.scheduled_time_slot}
                    </span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {request.status}
                  </Badge>
                </TableCell>

                {/* Requested On */}
                <TableCell>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(request.createdAt), "MMM dd, HH:mm")}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(request)}
                      size="sm"
                      variant="default"
                      className="h-8 px-3 text-xs text-white bg-green-400"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(request)}
                      size="sm"
                      variant="destructive"
                      className="h-8 px-3 text-xs text-white
                       bg-red-500"
                    >
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modals with increased z-index */}
      {modalType === "approve" && selectedRequest && (
        <ApprovalModal request={selectedRequest} onClose={closeModal} />
      )}

      {modalType === "reject" && selectedRequest && (
        <RejectionModal request={selectedRequest} onClose={closeModal} />
      )}
    </>
  );
}
