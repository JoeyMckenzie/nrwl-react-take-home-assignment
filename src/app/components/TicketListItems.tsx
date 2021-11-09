import { VFC } from 'react';
import { Link } from 'react-router-dom';
import { useTicketsStore } from '../lib/hooks';

const TicketListItems: VFC = () => {
  const { availableTickets } = useTicketsStore();

  return (
    <ul>
      {availableTickets.map((ticket) => (
        <li key={ticket.id}>
          Ticket: {ticket.id},{' '}
          <Link to={`/tickets/${ticket.id}`}>{ticket.description}</Link>
        </li>
      ))}
    </ul>
  );
};

export default TicketListItems;
