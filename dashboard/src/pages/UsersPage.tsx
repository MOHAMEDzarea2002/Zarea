import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { changeUserRole, fetchUsers } from '../features/users/usersThunk';
import { clearUsersActionError } from '../features/users/usersSlice';
import type { Role } from '../types/types';

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { items, status, error, actionError } = useAppSelector((s) => s.users);
  const me = useAppSelector((s) => s.auth.user);

  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [items, search]);

  const handleRoleChange = (id: string, role: Role) => {
    dispatch(clearUsersActionError());
    dispatch(changeUserRole({ id, role }));
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted">{items.length} users</p>
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="w-64 rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </header>

      {actionError && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-status-cancelled">
          {actionError}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-canvas text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {status === 'loading' && items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  Loading...
                </td>
              </tr>
            )}

            {status === 'failed' && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-status-cancelled">
                  {error}
                </td>
              </tr>
            )}

            {status === 'succeeded' && visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No users found.
                </td>
              </tr>
            )}

            {visible.map((user) => {
              const isMe = user._id === me?._id;
              return (
                <tr
                  key={user._id}
                  className="border-b border-border last:border-0 hover:bg-canvas/60"
                >
                  <td className="px-4 py-3 font-medium">
                    {user.name}
                    {isMe && <span className="ms-2 text-xs text-muted">(you)</span>}
                  </td>
                  <td className="px-4 py-3 text-muted">{user.email}</td>
                  <td className="px-4 py-3 text-muted">{user.phone || '—'}</td>
                  <td className="px-4 py-3 text-muted">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      aria-label={`Role for ${user.name}`}
                      value={user.role}
                      disabled={isMe}
                      onChange={(e) => handleRoleChange(user._id, e.target.value as Role)}
                      className="rounded-lg border border-border bg-surface px-2 py-1 text-sm focus:border-brand focus:outline-none disabled:opacity-60"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
