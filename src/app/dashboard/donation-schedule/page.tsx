"use client";

import type React from "react";

import { useState, useEffect } from "react";

import {
  CalendarIcon,
  Clock,
  MapPin,
  User,
  Droplet,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  Info,
} from "lucide-react";

interface Appointment {
  id: string;
  donorName: string;
  donorId: string;
  bloodType: string;
  date: string;
  time: string;
  location: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  notes?: string;
}

export default function DonationSchedulePage() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  const mockAppointments: Appointment[] = [
    {
      id: "APT-001",
      donorName: "John Doe",
      donorId: "DON-10001",
      bloodType: "A+",
      date: "2025-05-18",
      time: "09:00",
      location: "Main Blood Center",
      status: "scheduled",
    },
    {
      id: "APT-002",
      donorName: "Jane Smith",
      donorId: "DON-10002",
      bloodType: "O-",
      date: "2025-05-18",
      time: "11:30",
      location: "Mobile Blood Drive - City Hall",
      status: "scheduled",
    },
    {
      id: "APT-003",
      donorName: "Robert Johnson",
      donorId: "DON-10003",
      bloodType: "B+",
      date: "2025-05-19",
      time: "14:00",
      location: "Main Blood Center",
      status: "scheduled",
    },
    {
      id: "APT-004",
      donorName: "Emily Davis",
      donorId: "DON-10006",
      bloodType: "O+",
      date: "2025-05-20",
      time: "10:15",
      location: "Community Hospital",
      status: "scheduled",
    },
    {
      id: "APT-005",
      donorName: "Michael Brown",
      donorId: "DON-10005",
      bloodType: "A-",
      date: "2025-05-15",
      time: "16:30",
      location: "Main Blood Center",
      status: "completed",
      notes: "First-time donor, handled well",
    },
    {
      id: "APT-006",
      donorName: "Sarah Williams",
      donorId: "DON-10004",
      bloodType: "AB+",
      date: "2025-05-16",
      time: "13:45",
      location: "Mobile Blood Drive - University",
      status: "cancelled",
      notes: "Cancelled due to illness",
    },
    {
      id: "APT-007",
      donorName: "David Wilson",
      donorId: "DON-10007",
      bloodType: "B-",
      date: "2025-05-17",
      time: "09:30",
      location: "Community Hospital",
      status: "no-show",
    },
    {
      id: "APT-008",
      donorName: "Jennifer Taylor",
      donorId: "DON-10008",
      bloodType: "AB-",
      date: "2025-05-21",
      time: "15:00",
      location: "Main Blood Center",
      status: "scheduled",
    },
  ];

  useEffect(() => {
    // Simulate API call to fetch appointments
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAppointments(mockAppointments);
        applyFilters(mockAppointments, searchTerm, statusFilter);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const applyFilters = (
    data: Appointment[],
    search: string,
    status: string
  ) => {
    let filtered = [...data];

    // Apply status filter
    if (status !== "all") {
      filtered = filtered.filter((apt) => apt.status === status);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.donorName.toLowerCase().includes(searchLower) ||
          apt.donorId.toLowerCase().includes(searchLower) ||
          apt.location.toLowerCase().includes(searchLower)
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(appointments, value, statusFilter);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    applyFilters(appointments, searchTerm, value);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleScheduleAppointment = () => {
    setShowScheduleForm(true);
  };

  const handleCloseForm = () => {
    setShowScheduleForm(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <Clock className="mr-1 h-3 w-3" />
            Scheduled
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <Check className="mr-1 h-3 w-3" />
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <X className="mr-1 h-3 w-3" />
            Cancelled
          </span>
        );
      case "no-show":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <AlertCircle className="mr-1 h-3 w-3" />
            No Show
          </span>
        );
      default:
        return null;
    }
  };

  // Generate calendar days for the current month view
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek;

    // Calculate total days to show (including days from prev/next month)
    const totalDays = 42; // 6 rows of 7 days

    const days = [];

    // Add days from previous month
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();

    for (
      let i = prevMonthDays - daysFromPrevMonth + 1;
      i <= prevMonthDays;
      i++
    ) {
      days.push({
        date: new Date(year, month - 1, i),
        isCurrentMonth: false,
        appointments: appointments.filter((apt) => {
          const aptDate = new Date(apt.date);
          return (
            aptDate.getDate() === i &&
            aptDate.getMonth() === month - 1 &&
            aptDate.getFullYear() === year
          );
        }),
      });
    }

    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
        appointments: appointments.filter((apt) => {
          const aptDate = new Date(apt.date);
          return (
            aptDate.getDate() === i &&
            aptDate.getMonth() === month &&
            aptDate.getFullYear() === year
          );
        }),
      });
    }

    // Add days from next month
    const remainingDays = totalDays - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        appointments: appointments.filter((apt) => {
          const aptDate = new Date(apt.date);
          return (
            aptDate.getDate() === i &&
            aptDate.getMonth() === month + 1 &&
            aptDate.getFullYear() === year
          );
        }),
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get appointments for selected date
  const selectedDateAppointments = selectedDate
    ? appointments.filter((apt) => {
        const aptDate = new Date(apt.date);
        return (
          aptDate.getDate() === selectedDate.getDate() &&
          aptDate.getMonth() === selectedDate.getMonth() &&
          aptDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : [];

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Donation Schedule
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and schedule blood donation appointments
          </p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <CalendarIcon className="h-8 w-8 text-red-600" />
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setView("calendar")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
              view === "calendar"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 shadow-sm hover:bg-gray-50"
            }`}
          >
            <CalendarIcon className="h-4 w-4" />
            Calendar View
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
              view === "list"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 shadow-sm hover:bg-gray-50"
            }`}
          >
            <Filter className="h-4 w-4" />
            List View
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search donors or locations..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>

          <button
            onClick={handleScheduleAppointment}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            <Plus className="h-4 w-4" />
            New Appointment
          </button>
        </div>
      </div>

      {view === "calendar" ? (
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {currentMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-gray-200">
            {/* Weekday headers */}
            {weekdays.map((day) => (
              <div
                key={day}
                className="bg-gray-100 p-2 text-center text-sm font-medium text-gray-700"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((day, index) => {
              const isToday =
                day.date.getDate() === new Date().getDate() &&
                day.date.getMonth() === new Date().getMonth() &&
                day.date.getFullYear() === new Date().getFullYear();

              const isSelected =
                selectedDate &&
                day.date.getDate() === selectedDate.getDate() &&
                day.date.getMonth() === selectedDate.getMonth() &&
                day.date.getFullYear() === selectedDate.getFullYear();

              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(day.date)}
                  className={`min-h-[100px] cursor-pointer bg-white p-1 hover:bg-gray-50 ${
                    !day.isCurrentMonth ? "opacity-40" : ""
                  } ${isSelected ? "ring-2 ring-red-500" : ""}`}
                >
                  <div className="flex justify-between p-1">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${
                        isToday ? "bg-red-600 text-white" : "text-gray-700"
                      }`}
                    >
                      {day.date.getDate()}
                    </span>
                    {day.appointments.length > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800">
                        {day.appointments.length}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 space-y-1">
                    {day.appointments.slice(0, 2).map((apt, i) => (
                      <div
                        key={i}
                        className={`truncate rounded-md px-2 py-1 text-xs ${
                          apt.status === "scheduled"
                            ? "bg-blue-50 text-blue-700"
                            : apt.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : apt.status === "cancelled"
                            ? "bg-red-50 text-red-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {apt.time} - {apt.donorName}
                      </div>
                    ))}
                    {day.appointments.length > 2 && (
                      <div className="rounded-md bg-gray-100 px-2 py-1 text-center text-xs text-gray-500">
                        +{day.appointments.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedDate && (
            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 text-lg font-medium text-gray-800">
                {formatDate(selectedDate)}
              </h3>
              {selectedDateAppointments.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="rounded-lg bg-white p-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <User className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {apt.donorName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {apt.donorId}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(apt.status)}
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{apt.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Droplet className="h-4 w-4 text-red-500" />
                          <span>{apt.bloodType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{apt.location}</span>
                        </div>
                      </div>
                      {apt.notes && (
                        <div className="mt-2 rounded-md bg-gray-50 p-2 text-xs text-gray-600">
                          <span className="font-medium">Notes:</span>{" "}
                          {apt.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6 text-center">
                  <CalendarIcon className="mb-2 h-8 w-8 text-gray-400" />
                  <h4 className="text-lg font-medium text-gray-900">
                    No appointments scheduled
                  </h4>
                  <p className="mb-4 text-gray-500">
                    There are no donation appointments for this date.
                  </p>
                  <button
                    onClick={handleScheduleAppointment}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    <Plus className="h-4 w-4" />
                    Schedule Appointment
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl bg-white shadow-md">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-800">
              Upcoming Appointments
            </h2>
          </div>
          {filteredAppointments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredAppointments.map((apt) => (
                <div key={apt.id} className="p-4 hover:bg-gray-50 sm:p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <User className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">
                            {apt.donorName}
                          </h3>
                          <div className="flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                            <Droplet className="mr-1 h-3 w-3" />
                            {apt.bloodType}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{apt.donorId}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                          {new Date(apt.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{apt.time}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{apt.location}</span>
                      </div>
                      <div>{getStatusBadge(apt.status)}</div>
                    </div>

                    <div className="flex gap-2">
                      <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                        View Details
                      </button>
                      {apt.status === "scheduled" && (
                        <>
                          <button className="rounded-lg border border-green-300 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100">
                            Check In
                          </button>
                          <button className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100">
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {apt.notes && (
                    <div className="mt-3 flex items-start gap-2 rounded-md bg-gray-50 p-2 text-xs text-gray-600">
                      <Info className="h-4 w-4 text-gray-400" />
                      <span>{apt.notes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <CalendarIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-1 text-lg font-medium text-gray-900">
                No appointments found
              </h3>
              <p className="mb-6 text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "No appointments match your search criteria."
                  : "There are no upcoming donation appointments."}
              </p>
              <button
                onClick={handleScheduleAppointment}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                <Plus className="h-4 w-4" />
                Schedule New Appointment
              </button>
            </div>
          )}
        </div>
      )}

      {/* Schedule Form Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800">
                  Schedule Donation Appointment
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Donor ID
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:ring-red-500"
                      placeholder="Enter donor ID"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Donor Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:ring-red-500"
                      placeholder="Enter donor name"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Blood Type
                    </label>
                    <select className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:ring-red-500">
                      <option value="">Select blood type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Donation Type
                    </label>
                    <select className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:ring-red-500">
                      <option value="">Select donation type</option>
                      <option value="whole_blood">Whole Blood</option>
                      <option value="platelets">Platelets</option>
                      <option value="plasma">Plasma</option>
                      <option value="double_red">Double Red Cells</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:ring-red-500"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <select className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:ring-red-500">
                      <option value="">Select time slot</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="09:30">09:30 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="10:30">10:30 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="11:30">11:30 AM</option>
                      <option value="13:00">01:00 PM</option>
                      <option value="13:30">01:30 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="14:30">02:30 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="15:30">03:30 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="16:30">04:30 PM</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <select className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:ring-red-500">
                      <option value="">Select donation location</option>
                      <option value="Main Blood Center">
                        Main Blood Center
                      </option>
                      <option value="Community Hospital">
                        Community Hospital
                      </option>
                      <option value="Mobile Blood Drive - City Hall">
                        Mobile Blood Drive - City Hall
                      </option>
                      <option value="Mobile Blood Drive - University">
                        Mobile Blood Drive - University
                      </option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:ring-red-500"
                      rows={3}
                      placeholder="Add any additional notes or special requirements"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3 rounded-lg bg-blue-50 p-3 text-blue-800">
                  <Info className="h-5 w-5 text-blue-500" />
                  <div className="text-sm">
                    <p className="font-medium">Eligibility Reminder</p>
                    <p>
                      Donors must be at least 18 years old, weigh at least 110
                      lbs, and not have donated whole blood in the last 56 days.
                    </p>
                  </div>
                </div>
              </form>
            </div>
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={handleCloseForm}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCloseForm}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Schedule Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-xl bg-red-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Info className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Donation Guidelines
            </h3>
            <div className="mt-2 grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-gray-800">
                  Eligibility Requirements
                </h4>
                <ul className="mt-1 space-y-1 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-red-600"></span>
                    Must be at least 18 years old
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-red-600"></span>
                    Must weigh at least 110 lbs (50 kg)
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-red-600"></span>
                    Must be in good general health
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-red-600"></span>
                    Must have valid identification
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">
                  Donation Intervals
                </h4>
                <ul className="mt-1 space-y-1 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-red-600"></span>
                    Whole Blood: Every 56 days
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-red-600"></span>
                    Platelets: Every 7 days (up to 24 times per year)
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-red-600"></span>
                    Plasma: Every 28 days
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-red-600"></span>
                    Double Red Cells: Every 112 days
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
