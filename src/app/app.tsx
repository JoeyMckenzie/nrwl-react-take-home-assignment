import './app.css';
import { VFC } from 'react';
import { Routes, Route } from 'react-router-dom';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';

const App: VFC = () => (
  <Routes>
    <Route path="/" element={<TicketList />} />
    <Route path="/tickets/:id" element={<TicketDetail />} />
  </Routes>
);

export default App;
