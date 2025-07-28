"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Calendar, Clock, User, Droplet, Search, Check, X, Info, Phone, Mail, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  getBloodBankDonationRequests,
  updateDonationRequestStatus,
  completeDonation,
  getDonationStatistics,
  getAvailableTimeSlots,
} from "@/actions/donationScheduleActions"
import { getStatusColor, formatTimeSlot } from "@/utils/donation-utils"

interface DonationRequest {
  _id: string
  donor: {
    _id: string
    donorId: string
    blood_group: string
    age: number
    contact: string
    user: {
      name: string
      email: string
    }
  }
  requested_date: Date
  scheduled_time_slot: string
  status: "pending" | "approved" | "rejected" | "completed"
  rejection_reason?: string
  createdAt: Date
}

interface Statistics {
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  completedDonations: number
  todayScheduled: number
}

export default function BloodBankDonationRequestsPage() {
  const { data: session } = useSession()
  const [requests, setRequests] = useState<DonationRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<DonationRequest[]>([])
  const [statistics, setStatistics] = useState<Statistics>({} as Statistics)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<DonationRequest | null>(null)
  const [showActionDialog, setShowActionDialog] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | "reschedule">("approve")
  const [availableSlots, setAvailableSlots] = useState<string[]>([])

  // Form state for actions
  const [actionData, setActionData] = useState({
    rejectionReason: "",
    newDate: "",
    newTimeSlot: "",
  })

  //TODO i have to add a check for the session for blood bank id and user role before fetching data
//TODO  i have used session.user.id instead of session.user.bloodBankId 

  useEffect(() => {
    if (session?.user?.id) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    if (!session?.user?.id) return
    setIsLoading(true)
    try {
      const [requestsResult, statsResult] = await Promise.all([
        getBloodBankDonationRequests(session.user.id),
        getDonationStatistics(session.user.id),
      ])

      if (requestsResult.success) {
        setRequests(requestsResult.data!)
        applyFilters(requestsResult.data!, searchTerm, statusFilter)
      }
      if (statsResult.success) {
        setStatistics(statsResult.data!)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = (data: DonationRequest[], search: string, status: string) => {
    let filtered = [...data]

    if (status !== "all") {
      filtered = filtered.filter((request) => request.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (request) =>
          request.donor.user.name.toLowerCase().includes(searchLower) ||
          request.donor.donorId.toLowerCase().includes(searchLower) ||
          request.donor.blood_group.toLowerCase().includes(searchLower),
      )
    }

    setFilteredRequests(filtered)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    applyFilters(requests, value, statusFilter)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    applyFilters(requests, searchTerm, value)
  }

  const handleActionClick = async (request: DonationRequest, action: "approve" | "reject" | "reschedule") => {
    setSelectedRequest(request)
    setActionType(action)
    setActionData({ rejectionReason: "", newDate: "", newTimeSlot: "" })

    if (action === "reschedule") {
      // Fetch available slots for the original date
      const slotsResult = await getAvailableTimeSlots(session!.user!.id!, new Date(request.requested_date))
      if (slotsResult.success) {
        setAvailableSlots(slotsResult.data!)
      }
    }

    setShowActionDialog(true)
  }

  const handleDateChange = async (date: string) => {
    setActionData((prev) => ({ ...prev, newDate: date, newTimeSlot: "" }))

    if (date && session?.user?.id) {
      const slotsResult = await getAvailableTimeSlots(session.user.id, new Date(date))
      if (slotsResult.success) {
        setAvailableSlots(slotsResult.data!)
      }
    }
  }

  const handleSubmitAction = async () => {
    if (!selectedRequest) return

    try {
      const updateData: any = {
        requestId: selectedRequest._id,
        status: actionType === "reject" ? "rejected" : "approved",
      }

      if (actionType === "reject") {
        updateData.rejectionReason = actionData.rejectionReason
      } else if (actionType === "reschedule") {
        updateData.newDate = new Date(actionData.newDate)
        updateData.newTimeSlot = actionData.newTimeSlot
      }

      const result = await updateDonationRequestStatus(updateData)

      if (result.success) {
        setShowActionDialog(false)
        fetchData()
        alert(`Request ${actionType === "reject" ? "rejected" : "approved"} successfully!`)
      } else {
        alert(result.error || "Failed to update request")
      }
    } catch (error) {
      console.error("Error updating request:", error)
      alert("Failed to update request")
    }
  }

  const handleCompleteDonation = async (requestId: string) => {
    if (!confirm("Mark this donation as completed?")) return

    try {
      const result = await completeDonation(requestId, session!.user!.id!)
      if (result.success) {
        fetchData()
        alert("Donation marked as completed!")
      } else {
        alert(result.error || "Failed to complete donation")
      }
    } catch (error) {
      console.error("Error completing donation:", error)
      alert("Failed to complete donation")
    }
  }

  const getStatusBadge = (status: string) => {
    const colorClass = getStatusColor(status)
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      approved: <Check className="w-3 h-3" />,
      rejected: <X className="w-3 h-3" />,
      completed: <Check className="w-3 h-3" />,
    }

    return (
      <Badge className={colorClass}>
        {icons[status as keyof typeof icons]}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading donation requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donation Requests</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and process blood donation requests</p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <Droplet className="h-8 w-8 text-red-600" />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-500">Total Requests</h2>
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{statistics.totalRequests || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-500">Pending</h2>
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{statistics.pendingRequests || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-500">Approved</h2>
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{statistics.approvedRequests || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-500">Completed</h2>
              <Droplet className="h-4 w-4 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{statistics.completedDonations || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-500">Today</h2>
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{statistics.todayScheduled || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search donors..." value={searchTerm} onChange={handleSearchChange} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Requests List */}
      <Card>
        <CardContent className="p-0">
          {filteredRequests.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <div key={request._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <User className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{request.donor.user.name}</h3>
                          <Badge className="bg-red-100 text-red-800">
                            <Droplet className="w-3 h-3 mr-1" />
                            {request.donor.blood_group}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          ID: {request.donor.donorId} • Age: {request.donor.age}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(request.requested_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{formatTimeSlot(request.scheduled_time_slot)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{request.donor.contact}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{request.donor.user.email}</span>
                    </div>
                  </div>

                  {request.rejection_reason && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      <strong>Rejection Reason:</strong> {request.rejection_reason}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {request.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleActionClick(request, "approve")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleActionClick(request, "reschedule")}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Reschedule
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleActionClick(request, "reject")}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {request.status === "approved" && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteDonation(request._id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Mark Completed
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <User className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="mb-1 text-lg font-medium text-gray-900">No requests found</h3>
              <p className="mb-6 text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "No requests match your search criteria."
                  : "No donation requests have been submitted yet."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve"
                ? "Approve Request"
                : actionType === "reject"
                  ? "Reject Request"
                  : "Reschedule Request"}
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded">
                <h4 className="font-medium">{selectedRequest.donor.user.name}</h4>
                <p className="text-sm text-gray-600">
                  {new Date(selectedRequest.requested_date).toLocaleDateString()} at{" "}
                  {formatTimeSlot(selectedRequest.scheduled_time_slot)}
                </p>
              </div>

              {actionType === "reject" && (
                <div>
                  <Label htmlFor="rejectionReason">Rejection Reason</Label>
                  <Textarea
                    id="rejectionReason"
                    value={actionData.rejectionReason}
                    onChange={(e) => setActionData((prev) => ({ ...prev, rejectionReason: e.target.value }))}
                    placeholder="Please provide a reason for rejection..."
                    rows={3}
                  />
                </div>
              )}

              {actionType === "reschedule" && (
                <>
                  <div>
                    <Label htmlFor="newDate">New Date</Label>
                    <Input
                      type="date"
                      id="newDate"
                      value={actionData.newDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newTimeSlot">New Time Slot</Label>
                    <Select
                      value={actionData.newTimeSlot}
                      onValueChange={(value) => setActionData((prev) => ({ ...prev, newTimeSlot: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select new time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {formatTimeSlot(slot)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowActionDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitAction}
                  disabled={
                    (actionType === "reject" && !actionData.rejectionReason) ||
                    (actionType === "reschedule" && (!actionData.newDate || !actionData.newTimeSlot))
                  }
                  className={`flex-1 ${
                    actionType === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : actionType === "reject"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {actionType === "approve" ? "Approve" : actionType === "reject" ? "Reject" : "Reschedule"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Information Card */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Info className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Request Management Guidelines</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Processing Requests</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Review donor eligibility before approval</li>
                    <li>• Check time slot availability</li>
                    <li>• Confirm donor contact information</li>
                    <li>• Provide clear rejection reasons when needed</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Best Practices</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Process requests within 24 hours</li>
                    <li>• Reschedule when possible instead of rejecting</li>
                    <li>• Maintain clear communication with donors</li>
                    <li>• Mark donations as completed promptly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
