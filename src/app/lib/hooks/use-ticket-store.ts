import {
  catchError,
  EMPTY,
  finalize,
  map,
  Observable,
  Subscription,
  take,
  timeout,
} from 'rxjs';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { Ticket } from '..';
import { BackendService } from '../../../backend';
import { API_TOLERANCE } from '../constants';

interface TicketsState {
  availableTickets: Ticket[];
  filteredTickets: Ticket[];
  loading: boolean;
  selectedTicket?: Ticket | null;
  loadTickets: () => Subscription;
}

export const useTicketsStore = create<TicketsState>(
  devtools((set) => ({
    availableTickets: [],
    filteredTickets: [],
    loading: false,
    loadTickets: () => {
      set({ loading: true });

      return new BackendService()
        .tickets()
        .pipe(
          take(1),
          catchError((error) => {
            console.error(error);
            return EMPTY;
          }),
          finalize(() => {
            console.log('finalizing');
            set({ loading: false });
          }),
        )
        .subscribe((tickets) => set({ availableTickets: tickets }));
    },
  })),
);
