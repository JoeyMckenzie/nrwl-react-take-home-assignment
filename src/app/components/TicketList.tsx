import { useEffect, useMemo, VFC } from 'react';
import { useTicketsStore, useUsersStore } from '../lib/hooks';
import TicketListItem from './TicketListItem';

const TicketList: VFC = () => {
  const { loadingTickets, availableTickets, loadTickets } = useTicketsStore();
  const { loadingUsers, loadUsers } = useUsersStore();

  useEffect(() => {
    if (availableTickets.length > 0) {
      return;
    }

    const ticketsSubscription = loadTickets().subscribe(() =>
      console.log('tickets loaded'),
    );
    const usersSubscription = loadUsers().subscribe(() =>
      console.log('users loaded'),
    );

    return () => {
      ticketsSubscription.unsubscribe();
      usersSubscription.unsubscribe();
    };
  }, [availableTickets, loadTickets, loadUsers]);

  const isLoading = useMemo(
    () => (loadingTickets || loadingUsers).toString(),
    [loadingUsers, loadingTickets],
  );

  return (
    <div className="app">
      <h2>Tickets</h2>
      <p>
        <strong>Loading</strong>: {isLoading}
      </p>
      {availableTickets ? (
        <ul>
          {availableTickets.map((t) => (
            <TicketListItem ticket={t} key={t.id} />
          ))}
        </ul>
      ) : (
        <span>...</span>
      )}
    </div>
  );
};

export default TicketList;
