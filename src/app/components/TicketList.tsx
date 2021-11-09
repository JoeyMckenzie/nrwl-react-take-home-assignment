import { useEffect, VFC } from 'react';
import { useTicketsStore } from '../lib/hooks';

const TicketList: VFC = () => {
  const { loading, availableTickets, loadTickets } = useTicketsStore();

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  return (
    <div className="app">
      <h2>Tickets</h2>
      <p>
        <strong>Loading</strong>: {loading.toString()}
      </p>
      {availableTickets ? (
        <ul>
          {availableTickets.map((t) => (
            <li key={t.id}>
              Ticket: {t.id}, {t.description}
            </li>
          ))}
        </ul>
      ) : (
        <span>...</span>
      )}
    </div>
  );
};

export default TicketList;
