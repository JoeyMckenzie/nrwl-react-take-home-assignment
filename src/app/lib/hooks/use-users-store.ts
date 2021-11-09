import { catchError, EMPTY, finalize, map, Observable, take } from 'rxjs';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { User } from '..';
import { BackendService } from '../../../backend';

export interface UsersState {
  availableUsers: User[];
  selectedUser?: User | null;
  loadingUsers: boolean;
  loadUsers: () => Observable<void>;
  loadUser: (userId: number) => Observable<void>;
}

export const useUsersStore = create<UsersState>(
  devtools(
    (set, get) => ({
      availableUsers: [],
      loadingUsers: false,
      loadUsers: () => {
        set({ loadingUsers: true });

        return new BackendService().users().pipe(
          take(1),
          map((users) => set({ availableUsers: users })),
          catchError((error) => {
            console.error(error);
            return EMPTY;
          }),
          finalize(() => set({ loadingUsers: false })),
        );
      },
      loadUser: (userId) => {
        const existingUser = get().availableUsers.find((t) => t.id === userId);

        if (existingUser) {
          set({ selectedUser: existingUser });
          return EMPTY;
        }

        set({ loadingUsers: true });

        return new BackendService().user(userId).pipe(
          take(1),
          map((user) => set({ selectedUser: user })),
          catchError((error) => {
            console.error(error);
            return EMPTY;
          }),
          finalize(() => set({ loadingUsers: false })),
        );
      },
    }),
    {
      name: 'users',
      serialize: {
        options: true,
      },
    },
  ),
);
