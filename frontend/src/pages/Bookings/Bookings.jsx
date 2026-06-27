import React, { useState } from 'react';
import Card from '../../components/Card';
import './Bookings.css';

const SLOTS = [
  { id: 1,  date: 'Mon Jun 30', time: '08:00 AM', instructor: 'Sarah Johnson',  type: 'Road Lesson',          available: true  },
  { id: 2,  date: 'Mon Jun 30', time: '10:00 AM', instructor: 'Mike Torres',    type: 'Theory',               available: true  },
  { id: 3,  date: 'Mon Jun 30', time: '02:00 PM', instructor: 'Sarah Johnson',  type: 'Mock Test',            available: false },
  { id: 4,  date: 'Tue Jul 01', time: '09:00 AM', instructor: 'Priya Nair',     type: 'Road Lesson',          available: true  },
  { id: 5,  date: 'Tue Jul 01', time: '11:00 AM', instructor: 'Carlos Rivera',  type: 'Commercial Practical', available: true  },
  { id: 6,  date: 'Tue Jul 01', time: '03:00 PM', instructor: 'Mike Torres',    type: 'Theory',               available: false },
  { id: 7,  date: 'Wed Jul 02', time: '08:30 AM', instructor: 'Linda Park',     type: 'Motorcycle Lesson',    available: true  },
  { id: 8,  date: 'Wed Jul 02', time: '01:00 PM', instructor: 'Priya Nair',     type: 'Road Lesson',          available: true  },
  { id: 9,  date: 'Thu Jul 03', time: '10:00 AM', instructor: 'James White',    type: 'Mock Test',            available: true  },
  { id: 10, date: 'Thu Jul 03', time: '02:30 PM', instructor: 'Sarah Johnson',  type: 'Road Lesson',          available: true  },
];

const MY_BOOKINGS_INIT = [
  { id: 'b1', date: 'Fri Jun 27', time: '10:00 AM', instructor: 'Sarah Johnson', type: 'Road Lesson', status: 'confirmed' },
  { id: 'b2', date: 'Sun Jun 29', time: '02:00 PM', instructor: 'Mike Torres',   type: 'Theory',      status: 'pending'   },
];

const TYPE_COLORS = {
  'Road Lesson':          '#EEF2FF|#4F46E5',
  'Theory':               '#D1FAE5|#065F46',
  'Mock Test':            '#FEF3C7|#92400E',
  'Motorcycle Lesson':    '#FDF4FF|#7E22CE',
  'Commercial Practical': '#FFF7ED|#92400E',
};

function typeBadge(type) {
  const [bg, text] = (TYPE_COLORS[type] || '#F1F5F9|#475569').split('|');
  return <span className="type-badge" style={{ background: bg, color: text }}>{type}</span>;
}

export default function Bookings() {
  const [slots, setSlots]               = useState(SLOTS);
  const [myBookings, setMyBookings]     = useState(MY_BOOKINGS_INIT);
  const [tab, setTab]                   = useState('available');
  const [confirmed, setConfirmed]       = useState(null);

  const book = (slot) => {
    if (!slot.available) return;
    const newBooking = {
      id: 'b' + Date.now(),
      date: slot.date, time: slot.time,
      instructor: slot.instructor, type: slot.type,
      status: 'pending',
    };
    setMyBookings(prev => [newBooking, ...prev]);
    setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, available: false } : s));
    setConfirmed(slot);
    setTimeout(() => setConfirmed(null), 3000);
  };

  const cancel = (id) => {
    setMyBookings(prev => prev.map(b =>
      b.id === id ? { ...b, status: 'cancelled' } : b
    ));
  };

  const STATUS_STYLE = {
    confirmed: { bg: '#D1FAE5', text: '#065F46' },
    pending:   { bg: '#FEF3C7', text: '#92400E' },
    cancelled: { bg: '#FEE2E2', text: '#991B1B' },
  };

  return (
    <div className="bookings-page">
      {/* Tabs */}
      <div className="booking-tabs">
        <button className={`btab ${tab === 'available' ? 'active' : ''}`} onClick={() => setTab('available')}>
          Available Slots <span className="cnt">{slots.filter(s=>s.available).length}</span>
        </button>
        <button className={`btab ${tab === 'mine' ? 'active' : ''}`} onClick={() => setTab('mine')}>
          My Bookings <span className="cnt">{myBookings.length}</span>
        </button>
      </div>

      {/* Available Slots */}
      {tab === 'available' && (
        <div className="slots-grid">
          {slots.map(slot => (
            <div className={`slot-card ${!slot.available ? 'slot-taken' : ''}`} key={slot.id}>
              <div className="slot-date">{slot.date}</div>
              <div className="slot-time">{slot.time}</div>
              <div className="slot-ins">👤 {slot.instructor}</div>
              <div className="slot-type">{typeBadge(slot.type)}</div>
              <button
                className="slot-btn"
                disabled={!slot.available}
                onClick={() => book(slot)}
              >
                {slot.available ? 'Book Now' : 'Booked'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* My Bookings */}
      {tab === 'mine' && (
        <Card className="my-bookings-card">
          {myBookings.length === 0 ? (
            <p style={{ textAlign:'center', color:'#94A3B8', padding:'40px' }}>No bookings yet.</p>
          ) : (
            <table className="bk-table">
              <thead>
                <tr><th>Date</th><th>Time</th><th>Type</th><th>Instructor</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {myBookings.map(b => {
                  const sc = STATUS_STYLE[b.status] || STATUS_STYLE.pending;
                  return (
                    <tr key={b.id}>
                      <td>{b.date}</td>
                      <td>{b.time}</td>
                      <td>{typeBadge(b.type)}</td>
                      <td>{b.instructor}</td>
                      <td>
                        <span className="status-badge" style={{ background: sc.bg, color: sc.text }}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        {b.status !== 'cancelled' && (
                          <button className="cancel-btn" onClick={() => cancel(b.id)}>Cancel</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>
      )}

      {/* Confirmation toast */}
      {confirmed && (
        <div className="booking-toast">
          ✅ Booked <strong>{confirmed.type}</strong> on {confirmed.date} at {confirmed.time}!
        </div>
      )}
    </div>
  );
}
