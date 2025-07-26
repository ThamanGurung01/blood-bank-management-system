"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Calendar,
  Clock,
  Droplet,
  Plus,
  Search,
  Check,
  X,
  Info,
  Heart,
  MapPinned,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createDonationRequest,
  getDonorDonationRequests,
  getAvailableTimeSlots,
  cancelDonationRequest,
} from "@/actions/donationScheduleActions";
import { getVerifiedAllBloodBanks } from "@/actions/bloodBankActions";
import { getStatusColor, formatTimeSlot } from "@/utils/donation-utils";

interface DonationRequest {
  _id: string;
  blood_bank: {
    _id: string;
    blood_bank: string;
    location: {
      latitude: number;
      longitude: number;
    };
    address: string;
    contact: string;
  };
  requested_date: Date;
  scheduled_time_slot: string;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  rejection_reason?: string;
  createdAt: Date;
}

interface BloodBank {
  _id: string;
  blood_bank: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  contact: string;
}

export default function DonorDonationSchedulePage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    bloodBankId: "",
    requestedDate: "",
    timeSlot: "",
    notes: "",
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetchData(session?.user?.id);
    }
  }, [session]);

  const fetchData = async (userId: string = "") => {
    setIsLoading(true);
    try {
      const [requestsResult, bloodBanksResult] = await Promise.all([
        userId
          ? getDonorDonationRequests(userId)
          : getDonorDonationRequests(""),
        getVerifiedAllBloodBanks(),
      ]);

      if (requestsResult.success) {
        console.log("Requests:", requestsResult);
        setRequests(requestsResult?.data ?? []);
        console.log("requests", requestsResult?.data);
      }
      if (bloodBanksResult.success) {
        console.log("Blood Banks:", bloodBanksResult.data);
        setBloodBanks(bloodBanksResult.data);
        console.log(bloodBanksResult.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = async (date: string) => {
    setFormData((prev) => ({ ...prev, requestedDate: date, timeSlot: "" }));

    if (date && formData.bloodBankId) {
      const slotsResult = await getAvailableTimeSlots(
        formData.bloodBankId,
        new Date(date)
      );
      if (slotsResult.success) {
        setAvailableSlots(slotsResult.data ?? []);
      }
    }
  };

  const handleBloodBankChange = async (bloodBankId: string) => {
    setFormData((prev) => ({ ...prev, bloodBankId, timeSlot: "" }));

    if (formData.requestedDate && bloodBankId) {
      const slotsResult = await getAvailableTimeSlots(
        bloodBankId,
        new Date(formData.requestedDate)
      );
      if (slotsResult.success) {
        setAvailableSlots(slotsResult.data ?? []);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createDonationRequest({
        donorId: session!.user!.id,
        bloodBankId: formData.bloodBankId,
        requestedDate: new Date(formData.requestedDate),
        timeSlot: formData.timeSlot,
      });

      if (result.success) {
        setShowScheduleForm(false);
        setFormData({
          bloodBankId: "",
          requestedDate: "",
          timeSlot: "",
          notes: "",
        });
        fetchData();
        alert("Donation request submitted successfully!");
      } else {
        alert(result.error || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!confirm("Are you sure you want to cancel this donation request?"))
      return;

    try {
      const result = await cancelDonationRequest(requestId, session!.user!.id);
      if (result.success) {
        fetchData();
        alert("Request cancelled successfully");
      } else {
        alert(result.error || "Failed to cancel request");
      }
    } catch (error) {
      console.error("Error cancelling request:", error);
      alert("Failed to cancel request");
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.blood_bank.blood_bank
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const colorClass = getStatusColor(status);
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      approved: <Check className="w-3 h-3" />,
      rejected: <X className="w-3 h-3" />,
      completed: <Heart className="w-3 h-3" />,
      cancelled: <X className="w-3 h-3" />,
    };

    return (
      <Badge className={colorClass}>
        {icons[status as keyof typeof icons]}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading donation schedule...</p>
        </div>
      </div>
    );
  }

  return (
    // <style dangerouslySetInnerHTML={{ __html: modalStyles }}>
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Donation Schedule
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Schedule new donations and track your requests
          </p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <Calendar className="h-8 w-8 text-red-600" />
        </div>
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search blood banks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={showScheduleForm} onOpenChange={setShowScheduleForm}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Donation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md  z-50 bg-white">
            <DialogHeader>
              <DialogTitle>Schedule New Donation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="bloodBank">Blood Bank</Label>
                <Select
                  value={formData.bloodBankId}
                  onValueChange={handleBloodBankChange}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select blood bank" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white">
                    {bloodBanks.map((bank) => (
                      <SelectItem key={bank._id} value={bank._id}>
                        {bank.blood_bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <Input
                  type="date"
                  value={formData.requestedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="bg-white"
                />
              </div>

              <div>
                <Label htmlFor="timeSlot">Time Slot</Label>
                <Select
                  value={formData.timeSlot}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, timeSlot: value }))
                  }
                  disabled={!formData.requestedDate || !formData.bloodBankId}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white">
                    {availableSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {formatTimeSlot(slot)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="Any special requirements or notes..."
                  rows={3}
                  className="bg-white"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowScheduleForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !formData.bloodBankId ||
                    !formData.requestedDate ||
                    !formData.timeSlot
                  }
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Donation Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequests.length > 0 ? (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request._id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                        <Droplet className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {request.blood_bank.blood_bank}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {request.blood_bank.location.latitude}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(request.requested_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{formatTimeSlot(request.scheduled_time_slot)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPinned className="h-4 w-4" />
                      {/* there was only location which had lat and long address and now i added address some data dont have it so bear with it*/}
                      {/* <span>{request.blood_bank.location.latitude+" , "+request.blood_bank.location.longitude}</span> */}
                      {request.blood_bank.address ?? "Bharatpur-11, Chitwan"}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Info className="h-4 w-4" />
                      <span>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {request.rejection_reason && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      <strong>Rejection Reason:</strong>{" "}
                      {request.rejection_reason}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {request.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelRequest(request._id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Cancel Request
                      </Button>
                    )}
                    {request.status === "approved" && (
                      <Badge className="bg-green-100 text-green-800">
                        <Check className="w-3 h-3 mr-1" />
                        Confirmed - Please arrive on time
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No donation requests found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "No requests match your search criteria."
                  : "You haven't scheduled any donations yet."}
              </p>
              <Button
                onClick={() => setShowScheduleForm(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Your First Donation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="mt-8 bg-red-50 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Info className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Donation Guidelines
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Before Donating
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Get plenty of sleep the night before</li>
                    <li>• Eat a healthy meal before donating</li>
                    <li>• Drink plenty of water</li>
                    <li>• Bring a valid ID</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Eligibility
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Must be at least 18 years old</li>
                    <li>• Must weigh at least 110 lbs</li>
                    <li>• Must be in good health</li>
                    <li>• 56-day waiting period between donations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    // </style>
  );
}
