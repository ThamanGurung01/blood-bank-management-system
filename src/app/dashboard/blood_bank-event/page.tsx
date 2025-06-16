"use client"
import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, User, Edit, Trash2, Plus, AlertCircle, CheckCircle, PlayCircle } from 'lucide-react';
import { createEvent, getAllEvents, updateEvent } from '@/actions/eventActions';
import { useSession } from 'next-auth/react';
interface User {
  _id: string;
  name: string;
  email: string;
}

interface Event {
  _id: string;
  name: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  type: 'emergency' | 'normal';
  description: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  createdAt: Date;
}

interface EventFormData {
  name: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  type: 'emergency' | 'normal';
  description: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

// const mockEvents: Event[] = [
//   {
//     _id: '1',
//     name: 'Emergency Blood Drive - Hospital Central',
//     startDateTime: new Date('2024-06-15T09:00:00'),
//     endDateTime: new Date('2024-06-15T17:00:00'),
//     location: 'Hospital Central, Main Hall',
//     type: 'emergency',
//     description: 'Urgent need for O- and AB+ blood types due to recent accidents',
//     status: 'upcoming',
//     createdAt: new Date('2024-06-10T10:00:00'),
//   },
//   {
//     _id: '2',
//     name: 'Monthly Community Blood Drive',
//     startDateTime: new Date('2024-06-20T08:00:00'),
//     endDateTime: new Date('2024-06-20T16:00:00'),
//     location: 'Community Center, Downtown',
//     type: 'normal',
//     description: 'Regular monthly blood collection drive for community donors',
//     status: 'ongoing',
//     createdAt: new Date('2024-06-01T10:00:00')
//   },
//   {
//     _id: '3',
//     name: 'University Blood Donation Campaign',
//     startDateTime: new Date('2024-06-05T10:00:00'),
//     endDateTime: new Date('2024-06-05T15:00:00'),
//     location: 'State University, Student Union',
//     type: 'normal',
//     description: 'Annual blood donation event for university students and staff',
//     status: 'completed',
//     createdAt: new Date('2024-05-20T10:00:00'),
//   }
// ];

const page = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
    type: 'normal',
    description: '',
    status: 'upcoming'
  });
  const {data:session}=useSession();
const [creator,setCreator]=useState<string>();
const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

const validateForm = () => {
  const newErrors: typeof errors = {};

  if (!formData.name.trim()) newErrors.name = "Event name is required.";
  if (!formData.startDateTime) newErrors.startDateTime = "Start date & time is required.";
  if (!formData.endDateTime) newErrors.endDateTime = "End date & time is required.";
  else if (new Date(formData.endDateTime) <= new Date(formData.startDateTime)) newErrors.endDateTime = "End time must be after start time.";

  if (!formData.location.trim()) newErrors.location = "Location is required.";
  if (!formData.type) newErrors.type = "Type is required.";
  if (!formData.status) newErrors.status = "Status is required.";
  if (!formData.description.trim()) newErrors.description = "Description is required.";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

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

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      startDateTime: new Date(event.startDateTime).toISOString().slice(0, 16),
      endDateTime: new Date(event.endDateTime).toISOString().slice(0, 16),
      location: event.location,
      type: event.type,
      description: event.description,
      status: event.status
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setFormData({
      name: '',
      startDateTime: '',
      endDateTime: '',
      location: '',
      type: 'normal',
      description: '',
      status: 'upcoming'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async() => {
    if (!validateForm()) return;
   try{
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('startDateTime', new Date(formData.startDateTime).toISOString());
      formDataObj.append('endDateTime', new Date(formData.endDateTime).toISOString());
      formDataObj.append('location', formData.location);
      formDataObj.append('type', formData.type);
      formDataObj.append('description', formData.description);
      formDataObj.append('status', formData.status);
if (editingEvent) {
      const updated = await updateEvent(editingEvent._id, formDataObj);
      if (updated?.success) {
        setEvents(events.map(event =>
          event._id === editingEvent._id ? { ...event, ...updated?.data } : event
        ));
      }
    } else {
      // const creator= session?.user.id;
      if(!creator){ 
        console.log("no creator");
        return;
      }
      formDataObj.append('createdBy',creator);
      const result = await createEvent(formDataObj);
      if (result?.success && result?.data) {
        setEvents([result.data, ...events]);
      }
    }
    setIsModalOpen(false);
   }catch(error){
     console.error("Error submitting event:", error);
   }
  };

  const handleDelete = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event._id !== eventId));
    }
  };

  const filteredEvents = events.filter(event => {
    const statusMatch = filterStatus === 'all' || event.status === filterStatus;
    const typeMatch = filterType === 'all' || event.type === filterType;
    return statusMatch && typeMatch;
  });

  const fetchEvents=async()=>{
    const eventData=await getAllEvents();
    if(!eventData?.success){ console.log("Error")
      return;
    }
    setEvents(eventData.data);
  }

  useEffect(()=>{
if(session){
  setCreator(session.user.id);
}
  fetchEvents();
  },[session,errors])
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Blood Bank Events</h1>
        <button
          onClick={handleAdd}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
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
          <div key={event._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{event.name}</h3>
                    <div className={getTypeBadge(event.type)}>
                      {event.type === 'emergency' && <AlertCircle className="w-3 h-3" />}
                      {event.type.toUpperCase()}
                    </div>
                    <div className={`${getStatusBadge(event.status)} flex gap-1` }>
                      {getStatusIcon(event.status)}
                      {event.status.toUpperCase()}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{event.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
                {/* <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Created by {event.createdBy.name}</span>
                </div> */}
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.startDateTime}
                      onChange={(e) => setFormData({...formData, startDateTime: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  {errors.startDateTime && <p className="text-red-500 text-sm mt-1">{errors.startDateTime}</p>}

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.endDateTime}
                      onChange={(e) => setFormData({...formData, endDateTime: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  {errors.endDateTime && <p className="text-red-500 text-sm mt-1">{errors.endDateTime}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as 'emergency' | 'normal'})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="normal">Normal</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as 'upcoming' | 'ongoing' | 'completed'})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setErrors({});
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;