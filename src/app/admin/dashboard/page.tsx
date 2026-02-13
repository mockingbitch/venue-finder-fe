'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { venuesApi } from '@/services/api';
import { useAuthStore } from '@/stores/auth.store';
import { VENUES_QUERY_KEY } from '@/hooks/useVenues';
import { VenueFormModal } from '@/components/admin/VenueFormModal';
import type { Venue } from '@/types/venue';

export default function AdminDashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, clearAuth } = useAuthStore();
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: venues = [], isLoading } = useQuery({
    queryKey: [VENUES_QUERY_KEY],
    queryFn: () => venuesApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: venuesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VENUES_QUERY_KEY] });
      setIsCreateOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: venuesApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VENUES_QUERY_KEY] });
      setEditingVenue(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: venuesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VENUES_QUERY_KEY] });
    },
  });

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold text-slate-900">
            Venue Finder
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.email}</span>
            <Link
              href="/venues"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              View Venues
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Add Venue
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Location
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {venues.map((venue) => (
                  <tr key={venue.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                      {venue.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {venue.address || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {venue.latitude.toFixed(4)}, {venue.longitude.toFixed(4)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <button
                        type="button"
                        onClick={() => setEditingVenue(venue)}
                        className="text-primary-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Delete this venue?')) {
                            deleteMutation.mutate(venue.id);
                          }
                        }}
                        className="ml-4 text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {venues.length === 0 && (
              <div className="py-12 text-center text-slate-500">
                No venues yet. Add your first venue.
              </div>
            )}
          </div>
        )}
      </div>

      {isCreateOpen && (
        <VenueFormModal
          onClose={() => setIsCreateOpen(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
        />
      )}

      {editingVenue && (
        <VenueFormModal
          venue={editingVenue}
          onClose={() => setEditingVenue(null)}
          onSubmit={(data) =>
            updateMutation.mutate({ id: editingVenue.id, ...data })
          }
          isLoading={updateMutation.isPending}
        />
      )}
    </main>
  );
}
