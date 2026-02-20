'use client';

import { useState, useEffect } from 'react';
import type { Venue } from '@/types/venue';
import type { VenueCreateInput } from '@/types/venue';

interface VenueFormModalProps {
  venue?: Venue | null;
  onClose: () => void;
  onSubmit: (data: VenueCreateInput) => void;
  isLoading: boolean;
}

export function VenueFormModal({
  venue,
  onClose,
  onSubmit,
  isLoading,
}: VenueFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [capacity, setCapacity] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (venue) {
      setName(venue.name);
      setDescription(venue.description ?? '');
      setAddress(venue.address ?? '');
      setLatitude(String(venue.latitude));
      setLongitude(String(venue.longitude));
      setCapacity(venue.capacity ? String(venue.capacity) : '');
      setImageUrl(venue.imageUrl ?? '');
    } else {
      setName('');
      setDescription('');
      setAddress('');
      setLatitude('21.0285');
      setLongitude('105.8542');
      setCapacity('');
      setImageUrl('');
    }
  }, [venue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lon)) return;

    onSubmit({
      name,
      description: description || undefined,
      address: address || undefined,
      latitude: lat,
      longitude: lon,
      capacity: capacity ? parseInt(capacity, 10) : undefined,
      imageUrl: imageUrl || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900">
          {venue ? 'Edit Venue' : 'Add Venue'}
        </h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Latitude *</label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Longitude *</label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Capacity</label>
            <input
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : venue ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
