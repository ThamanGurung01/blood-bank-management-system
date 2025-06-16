import { AlertCircle, Calendar, CheckCircle, Clock, Info, MapPin, PlayCircle, User, X } from "lucide-react";
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
interface EventDetailsModalProps {
    event: Event | null;
    isOpen: boolean;
    onClose: () => void;
}
const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, isOpen, onClose }) => {
    if (!isOpen || !event) return null;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'upcoming': return <Clock className="w-5 h-5 text-blue-500" />;
            case 'ongoing': return <PlayCircle className="w-5 h-5 text-green-500" />;
            case 'completed': return <CheckCircle className="w-5 h-5 text-gray-500" />;
            default: return null;
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
        switch (status) {
            case 'upcoming': return `${baseClasses} bg-blue-100 text-blue-800`;
            case 'ongoing': return `${baseClasses} bg-green-100 text-green-800`;
            case 'completed': return `${baseClasses} bg-gray-100 text-gray-800`;
            default: return baseClasses;
        }
    };

    const getTypeBadge = (type: string) => {
        const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
        return type === 'emergency'
            ? `${baseClasses} bg-red-100 text-red-800 flex items-center gap-1`
            : `${baseClasses} bg-blue-100 text-blue-800`;
    };

    const formatDateTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'full',
            timeStyle: 'short'
        }).format(new Date(date));
    };

    const formatCreatedDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(new Date(date));
    };

    const getDuration = () => {
        const start = new Date(event.startDateTime);
        const end = new Date(event.endDateTime);
        const diffMs = end.getTime() - start.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffHours > 0) {
            return `${diffHours}h ${diffMinutes}m`;
        }
        return `${diffMinutes}m`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Info className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Event Details</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">{event.name}</h1>
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className={getTypeBadge(event.type)}>
                                {event.type === 'emergency' && <AlertCircle className="w-4 h-4" />}
                                {event.type.toUpperCase()}
                            </div>
                            <div className={`${getStatusBadge(event.status)} flex items-center gap-2`}>
                                {getStatusIcon(event.status)}
                                {event.status.toUpperCase()}
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                            {event.description}
                        </p>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <h4 className="font-semibold text-blue-900">Date & Time</h4>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Start:</span>
                                    <div className="text-gray-900">{formatDateTime(event.startDateTime)}</div>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">End:</span>
                                    <div className="text-gray-900">{formatDateTime(event.endDateTime)}</div>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Duration:</span>
                                    <div className="text-gray-900">{getDuration()}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin className="w-5 h-5 text-green-600" />
                                <h4 className="font-semibold text-green-900">Location</h4>
                            </div>
                            <p className="text-gray-900">{event.location}</p>
                        </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <User className="w-5 h-5 text-purple-600" />
                            <h4 className="font-semibold text-purple-900">Event Organizer</h4>
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-900 font-medium">{event.createdBy.blood_bank}</p>
                            <p className="text-sm text-gray-600">Organized by: {event.createdBy.user.name}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Event Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Event ID:</span>
                                <p className="text-gray-600 font-mono text-xs">{event._id}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Created On:</span>
                                <p className="text-gray-600">{formatCreatedDate(event.createdAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EventDetailsModal;