import React, { useEffect, useState } from 'react';
import { MapPin, Users, Filter, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { createBooking, createResource, getResources } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import BookingModal from '../legacy-booking/components/BookingModal';
import { buildSubmissionPayload } from '../legacy-booking/utils/bookingHelpers';

interface ApiResource {
  id: string;
  name: string;
  type: string;
  capacity?: number;
  location?: string;
  status?: string;
  description?: string;
}

const RESOURCE_TYPE_LABELS: Record<string, string> = {
  LECTURE_HALL: 'Lecture Hall',
  LAB: 'Lab',
  MEETING_ROOM: 'Meeting Room',
  EQUIPMENT: 'Equipment',
};

export default function Resources() {
  const { user } = useAuth();
  const [resources, setResources] = useState<ApiResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [form, setForm] = useState({
    name: '',
    type: 'LECTURE_HALL',
    capacity: '30',
    location: '',
    availableFrom: '08:00',
    availableTo: '18:00',
    status: 'ACTIVE',
    description: '',
  });
  const isEquipmentType = form.type === 'EQUIPMENT';

  const load = async () => {
    setLoading(true);
    try {
      const data = await getResources();
      setResources(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Could not load resources. Is the API running on port 8080?');
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const types = React.useMemo(() => {
    const s = new Set(resources.map((r) => r.type).filter(Boolean));
    return ['all', ...Array.from(s)];
  }, [resources]);

  const filtered =
    filterType === 'all'
      ? resources
      : resources.filter((r) => r.type === filterType);

  const isActive = (r: ApiResource) =>
    String(r.status || '').toUpperCase() === 'ACTIVE';

  const typeLabel = (value?: string) => RESOURCE_TYPE_LABELS[String(value || '')] || value || 'Unknown';

  const handleBookNow = (resourceId: string) => {
    setSelectedResourceId(resourceId);
    setBookingModalOpen(true);
  };

  const handleCreateBooking = async (formValues: Record<string, unknown>) => {
    setBookingSubmitting(true);
    try {
      await createBooking(buildSubmissionPayload(formValues));
      toast.success('Booking request submitted.');
      setBookingModalOpen(false);
      setSelectedResourceId('');
    } catch {
      toast.error('Booking creation failed.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleCreateResource = async (event: React.FormEvent) => {
    event.preventDefault();
    if (user?.role !== 'administrator') {
      toast.error('Only admin can add resources.');
      return;
    }
    setSubmitting(true);
    try {
      await createResource({
        name: form.name.trim(),
        type: form.type,
        capacity: isEquipmentType ? 1 : Number(form.capacity),
        location: isEquipmentType ? 'Equipment Storage' : form.location.trim(),
        availableFrom: form.availableFrom,
        availableTo: form.availableTo,
        status: form.status,
        description: form.description.trim(),
      });
      toast.success('Resource added successfully.');
      setShowAddForm(false);
      setForm({
        name: '',
        type: 'LECTURE_HALL',
        capacity: '30',
        location: '',
        availableFrom: '08:00',
        availableTo: '18:00',
        status: 'ACTIVE',
        description: '',
      });
      await load();
    } catch {
      toast.error('Failed to add resource.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-4 items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#374151] mb-2">Resource Catalog</h1>
          <p className="text-[#9CA3AF]">Data from Spring Boot /api/resources</p>
        </div>
        <div className="flex items-center gap-2">
          {user?.role === 'administrator' && (
            <button
              type="button"
              onClick={() => setShowAddForm((v) => !v)}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {showAddForm ? 'Close Form' : '+ Add Resource'}
            </button>
          )}
          <button
            type="button"
            onClick={() => load()}
            className="inline-flex items-center gap-2 bg-[#1D4ED8] text-white px-4 py-2 rounded-lg hover:bg-[#1E40AF] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {user?.role === 'administrator' && showAddForm && (
        <form onSubmit={handleCreateResource} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h2 className="text-lg font-semibold text-[#374151] mb-4">Add New Resource</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm">
              <span className="text-[#6B7280]">Resource Name</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </label>
            <label className="text-sm">
              <span className="text-[#6B7280]">Type</span>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    type: e.target.value,
                    // Equipment does not use seat capacity; keep a safe backend value.
                    capacity: e.target.value === 'EQUIPMENT' ? '1' : p.capacity,
                    location: e.target.value === 'EQUIPMENT' ? 'Equipment Storage' : p.location,
                  }))
                }
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-white"
              >
                <option value="LECTURE_HALL">Lecture Hall</option>
                <option value="LAB">Lab</option>
                <option value="MEETING_ROOM">Meeting Room</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </label>
            {!isEquipmentType ? (
              <label className="text-sm">
                <span className="text-[#6B7280]">Capacity</span>
                <input
                  required
                  min={1}
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))}
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                />
              </label>
            ) : (
              <div className="text-sm rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-[#6B7280]">
                Equipment selected: seat capacity is not required.
              </div>
            )}
            {!isEquipmentType ? (
              <label className="text-sm">
                <span className="text-[#6B7280]">Location</span>
                <input
                  required
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                />
              </label>
            ) : (
              <div className="text-sm rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-[#6B7280]">
                Equipment selected: location is managed automatically.
              </div>
            )}
            <label className="text-sm">
              <span className="text-[#6B7280]">Available From</span>
              <input
                required
                type="time"
                value={form.availableFrom}
                onChange={(e) => setForm((p) => ({ ...p, availableFrom: e.target.value }))}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </label>
            <label className="text-sm">
              <span className="text-[#6B7280]">Available To</span>
              <input
                required
                type="time"
                value={form.availableTo}
                onChange={(e) => setForm((p) => ({ ...p, availableTo: e.target.value }))}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </label>
            <label className="text-sm md:col-span-2">
              <span className="text-[#6B7280]">Description</span>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </label>
          </div>
          <div className="mt-4">
            <button
              disabled={submitting}
              type="submit"
              className="bg-[#1D4ED8] text-white px-4 py-2 rounded-lg hover:bg-[#1E40AF] disabled:opacity-70"
            >
              {submitting ? 'Saving...' : 'Create Resource'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex items-center space-x-4 flex-wrap gap-2">
          <Filter className="w-4 h-4 text-[#9CA3AF]" />
          {types.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filterType === type
                  ? 'bg-[#1D4ED8] text-white'
                  : 'bg-[#F3F4F6] text-[#9CA3AF] hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'All Resources' : typeLabel(type)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-[#9CA3AF]">Loading resources…</p>
      ) : filtered.length === 0 ? (
        <p className="text-[#9CA3AF]">
          No resources found. Seed some via POST /api/resources or MongoDB.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((resource) => (
            <div
              key={resource.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="h-36 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-2xl font-bold">
                {(resource.name || 'R').slice(0, 2).toUpperCase()}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-[#374151]">{resource.name}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      isActive(resource)
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {resource.status || 'UNKNOWN'}
                  </span>
                </div>
                <span className="inline-block px-2 py-1 bg-[#F3F4F6] text-[#9CA3AF] text-xs rounded-md mb-3">
                  {typeLabel(resource.type)}
                </span>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-sm text-[#9CA3AF]">
                    <MapPin className="w-4 h-4 mr-2 shrink-0" />
                    {resource.location || '—'}
                  </div>
                  <div className="flex items-center text-sm text-[#9CA3AF]">
                    <Users className="w-4 h-4 mr-2 shrink-0" />
                    Capacity: {resource.capacity ?? '—'}
                  </div>
                </div>
                {resource.description ? (
                  <p className="text-sm text-[#6B7280] line-clamp-3">{resource.description}</p>
                ) : null}
                {user?.role === 'student' && isActive(resource) && (
                  <button
                    type="button"
                    onClick={() => handleBookNow(resource.id)}
                    className="mt-4 w-full rounded-lg bg-[#1D4ED8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1E40AF]"
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <BookingModal
        open={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setSelectedResourceId('');
        }}
        onSubmit={handleCreateBooking}
        submitting={bookingSubmitting}
        defaultUserId={user?.id ?? ''}
        defaultResourceId={selectedResourceId}
        resources={resources.filter((resource) => isActive(resource))}
      />
    </div>
  );
}
