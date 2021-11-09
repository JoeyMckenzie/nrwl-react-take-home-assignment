import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import TicketList from './TicketList';
import { useTicketsStore, useUsersStore } from '../lib/hooks';
import { MemoryRouter } from 'react-router-dom';
import { TicketsState } from '../lib/hooks/use-ticket-store';
import { UsersState } from '../lib/hooks/use-users-store';

// create a customRender that wraps the UI in a memory Router
const renderWithRouter = (ui: ReactElement) => {
  return render(ui, { wrapper: MemoryRouter });
};

let ticketsState: TicketsState;
let usersState: UsersState;

const setDefaultState = () =>
  useTicketsStore.setState({
    availableTickets: [
      {
        id: 0,
        description: 'Mock unassigned ticket',
        completed: false,
      },
      {
        id: 1,
        description: 'Mock completed assigned ticket',
        completed: true,
        assigneeId: 1,
      },
    ],
  });

useUsersStore.setState({
  availableUsers: [
    {
      id: 1,
      name: 'Mock user',
    },
  ],
});

beforeEach(() => {
  ticketsState = useTicketsStore.getState();
  usersState = useUsersStore.getState();
});

afterEach(() => {
  useTicketsStore.destroy();
  useUsersStore.destroy();
});

test('renders ticket headers', () => {
  // Arrange
  const { getByText } = renderWithRouter(<TicketList />);

  // Act
  const header = getByText(/Tickets/i);

  // Assert
  expect(header).toBeInTheDocument();
});

test('renders available tickets, if found', () => {
  // Arrange
  setDefaultState();
  const { getByTestId } = renderWithRouter(<TicketList />);

  // Act
  const ticketListItems = getByTestId('ticket-list-items');

  // Assert
  expect(ticketListItems).toBeInTheDocument();
});

test('renders the loading indicator, if no tickets are found', () => {
  // Arrange
  useUsersStore.setState({
    availableUsers: [],
  });

  useTicketsStore.setState({
    availableTickets: [],
  });

  const { getByTestId } = renderWithRouter(<TicketList />);

  // Act
  const spanLoader = getByTestId('loading-indicator');

  // Assert
  expect(spanLoader).toBeInTheDocument();
});
