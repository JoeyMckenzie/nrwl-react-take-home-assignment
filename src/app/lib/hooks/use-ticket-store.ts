import { catchError, EMPTY, finalize, map, Observable, take } from 'rxjs';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { Ticket } from '..';
import { BackendService } from '../../../backend';

interface TicketsState {
  availableTickets: Ticket[];
  filteredTickets: Ticket[];
  loadingTickets: boolean;
  selectedTicket?: Ticket | null;
  loadTickets: () => Observable<void>;
  loadTicket: (ticketId: number) => Observable<void>;
}

export const useTicketsStore = create<TicketsState>(
  devtools(
    (set, get) => ({
      availableTickets: [],
      filteredTickets: [],
      loadingTickets: false,
      loadTickets: () => {
        set({ loadingTickets: true });

        return new BackendService().tickets().pipe(
          take(1),
          map((tickets) => set({ availableTickets: tickets })),
          catchError((error) => {
            console.error(error);
            return EMPTY;
          }),
          finalize(() => set({ loadingTickets: false })),
        );
      },
      loadTicket: (ticketId) => {
        const existingTicket = get().availableTickets.find(
          (t) => t.id === ticketId,
        );

        if (existingTicket) {
          set({ selectedTicket: existingTicket });
          return EMPTY;
        }

        set({ loadingTickets: true });

        return new BackendService().ticket(ticketId).pipe(
          take(1),
          map((ticket) => set({ selectedTicket: ticket })),
          catchError((error) => {
            console.error(error);
            return EMPTY;
          }),
          finalize(() => set({ loadingTickets: false })),
        );
      },
    }),
    {
      name: 'tickets',
      serialize: {
        options: true,
      },
    },
  ),
);
