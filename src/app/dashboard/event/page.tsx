"use client"
import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, User, AlertCircle, CheckCircle, PlayCircle, X, Info } from 'lucide-react';
import EventDetailsModal from '@/components/EventDetailsModal';
import { getAllEvents } from '@/actions/eventActions';

interface UserType {
  user: {
    name: string;
  };
  blood_bank: string;
}
interface Event {
  _id: string;
  name: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  type: 'emergency' | 'normal';
  description: string;
  createdBy: UserType;
  status: 'upcoming' | 'ongoing' | 'completed';
  createdAt: Date;
}
const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      _id: "674a123456789abcdef12345",
      name: "Emergency Blood Drive - Critical Need",
      startDateTime: new Date("2024-12-20T09:00:00"),
      endDateTime: new Date("2024-12-20T17:00:00"),
      location: "City Hospital, Main Building, Room 201",
      type: "emergency",
      description: "Urgent blood donation drive needed due to critical shortage of O-negative blood type. All eligible donors are encouraged to participate. Medical staff will be available for screening and donation process.",
      createdBy: {
        user: {
          name: "Dr. Sarah Johnson",
        },
        blood_bank: "City Hospital Blood Bank"
      },
      status: "upcoming",
      createdAt: new Date("2024-12-15T10:30:00")
    },
    {
      _id: "674b987654321fedcba98765",
      name: "Monthly Community Blood Drive",
      startDateTime: new Date("2024-12-25T08:00:00"),
      endDateTime: new Date("2024-12-25T16:00:00"),
      location: "Community Center, 123 Main Street",
      type: "normal",
      description: "Regular monthly blood donation event open to all community members. Light refreshments will be provided. Please bring a valid ID and eat a good meal before donating.",
      createdBy: {
        user: {
          name: "Michael Chen",
        },
        blood_bank: "Red Cross Blood Center"
      },
      status: "ongoing",
      createdAt: new Date("2024-12-10T14:15:00")
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'ongoing': return <PlayCircle className="w-4 h-4 text-green-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'upcoming': return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'ongoing': return `${baseClasses} bg-green-100 text-green-800`;
      case 'completed': return `${baseClasses} bg-gray-100 text-gray-800`;
      default: return baseClasses;
    }
  };

  const getTypeBadge = (type: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    return type === 'emergency'
      ? `${baseClasses} bg-red-100 text-red-800 flex items-center gap-1`
      : `${baseClasses} bg-blue-100 text-blue-800`;
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(date));
  };

  const filteredEvents = events.filter(event => {
    const statusMatch = filterStatus === 'all' || event.status === filterStatus;
    const typeMatch = filterType === 'all' || event.type === filterType;
    return statusMatch && typeMatch;
  });

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const fetchEvents = async () => {
    const eventData = await getAllEvents();
    console.log(eventData);
    if (!eventData?.success) {
      console.log("Error")
      return;
    }
    setEvents(eventData.data);
  }

  useEffect(() => {
    fetchEvents();
  }, [])
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Events</h1>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Types</option>
              <option value="normal">Normal</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div
            key={event._id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleEventClick(event)}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{event.name}</h3>
                    <div className={getTypeBadge(event.type)}>
                      {event.type === 'emergency' && <AlertCircle className="w-3 h-3" />}
                      {event.type.toUpperCase()}
                    </div>
                    <div className={`${getStatusBadge(event.status)} flex gap-1`}>
                      {getStatusIcon(event.status)}
                      {event.status.toUpperCase()}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <div>
                    <div>Start: {formatDateTime(event.startDateTime)}</div>
                    <div>End: {formatDateTime(event.endDateTime)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Created by {event.createdBy.blood_bank}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-blue-600 font-medium">Click to view details →</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Try adjusting your filters or add a new event.</p>
        </div>
      )}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default EventsPage;