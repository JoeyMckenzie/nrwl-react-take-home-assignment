import { useEffect, VFC } from 'react';
import { mergeMap, take } from 'rxjs';
import { useTicketsStore, useUsersStore } from '../lib/hooks';
import TicketListItems from './TicketListItems';

const TicketList: VFC = () => {
  const { loadingTickets, availableTickets, loadTickets } = useTicketsStore();
  const { availableUsers, loadingUsers, loadUsers } = useUsersStore();

  useEffect(() => {
    if (availableTickets.length > 0) {
      return;
    }

    loadTickets()
      .pipe(
        take(1),
        mergeMap(() => loadUsers()),
      )
      .subscribe(() => 'tickets and users loaded');
  }, [loadTickets, loadUsers, availableTickets]);

  return (
    <div className="ticket-list">
      <h2>Tickets</h2>
      <p>
        <strong>Loading</strong>: {(loadingTickets || loadingUsers).toString()}
      </p>
      {availableTickets.length > 0 && availableUsers.length > 0 ? (
        <div data-testid="ticket-list-items">
          <TicketListItems />
        </div>
      ) : (
        <span data-testid="loading-indicator">...</span>
      )}
    </div>
  );
};

export default TicketList;
