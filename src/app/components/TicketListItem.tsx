import { VFC } from 'react';
import { Ticket } from '../lib';
import { Link } from 'react-router-dom';

interface TicketListItemProps {
  ticket: Ticket;
}

const TicketListItem: VFC<TicketListItemProps> = ({ ticket }) => (
  <li key={ticket.id}>
    Ticket: {ticket.id},{' '}
    <Link to={`/tickets/${ticket.id}`}>{ticket.description}</Link>
  </li>
);

export default TicketListItem;
