import { useEffect, VFC } from 'react';
import { Redirect } from 'react-router';
import { Link, useParams } from 'react-router-dom';
import { mergeMap, take } from 'rxjs';
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

    loadTicket(parsedId)
      .pipe(
        take(1),
        mergeMap(() => loadUser(selectedTicket?.assigneeId ?? -1)),
      )
      .subscribe(() =>
        console.log(
          `ticket ${parsedId} by user ${selectedTicket?.assigneeId} loaded`,
        ),
      );
  }, [id, loadTicket, loadUser, selectedTicket]);

  return (
    <>
      <Link to="/">Back</Link>
      <br />
      {selectedTicket && selectedUser ? (
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
      )}
    </>
  );
};

export default TicketDetail;
