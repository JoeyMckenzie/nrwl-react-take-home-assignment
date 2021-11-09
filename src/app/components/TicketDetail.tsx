import { useEffect, useMemo, VFC } from 'react';
import { Redirect } from 'react-router';
import { Link, useParams } from 'react-router-dom';
import { mergeMap } from 'rxjs';
import { useTicketsStore, useUsersStore } from '../lib/hooks';

const TicketDetail: VFC = () => {
  const { id } = useParams();
  const { selectedTicket, loadTicket } = useTicketsStore();
  const { selectedUser, loadUser } = useUsersStore();

  useEffect(() => {
    const parsedId = Number.parseInt(id ?? '');

    if (isNaN(parsedId)) {
      <Redirect to="/" />;
    }

    const ticketSubscription = loadTicket(parsedId)
      .pipe(mergeMap(() => loadUser(selectedTicket?.assigneeId ?? -1)))
      .subscribe(
        () => `ticket ${parsedId} by user ${selectedTicket?.assigneeId} loaded`,
      );

    return ticketSubscription.unsubscribe();
  }, [id, loadTicket, loadUser, selectedTicket]);

  const selectedTicketDetail = useMemo(
    () =>
      selectedTicket ? (
        <>
          <h1>Ticket detail</h1>
          <strong>Title</strong>: {selectedTicket.description}
          <br />
          <strong>Assignee</strong>: {selectedUser?.name}
          <br />
          <label htmlFor="completed-checkbox">
            <strong>Completed</strong>
          </label>
          <input type="checkbox" checked={selectedTicket.completed} readOnly />
        </>
      ) : (
        <span>Loading...</span>
      ),
    [selectedTicket, selectedUser],
  );

  return (
    <>
      <Link to="/">Back</Link>
      <br />
      {selectedTicketDetail}
    </>
  );
};

export default TicketDetail;
