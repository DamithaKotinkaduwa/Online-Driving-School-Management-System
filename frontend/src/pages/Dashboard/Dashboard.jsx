import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/Card';
import './Dashboard.css';

// ── Sample data ──────────────────────────────────────────────────────────────
const ADMIN_STATS = [
  { label: 'Total Students',   value: '128', icon: '🎓', trend: '+12%',  color: '#4F46E5' },
  { label: 'Instructors',      value: '14',  icon: '👨‍🏫', trend: '+2',    color: '#10B981' },
  { label: 'Bookings Today',   value: '37',  icon: '📅', trend: '+8%',   color: '#F59E0B' },
  { label: 'Revenue (Month)',  value: '$9.4k', icon: '💰', trend: '+15%', color: '#F43F5E' },
];

const STUDENT_STATS = [
  { label: 'Lessons Completed', value: '8',   icon: '✅', trend: '2 this week', color: '#10B981' },
  { label: 'Hours Driven',      value: '14h', icon: '🚗', trend: '6h remaining', color: '#4F46E5' },
  { label: 'Quiz Score',        value: '82%', icon: '📝', trend: 'B+ grade',     color: '#F59E0B' },
  { label: 'Next Lesson',       value: 'Fri', icon: '📅', trend: '10:00 AM',     color: '#8B5CF6' },
];

const INSTRUCTOR_STATS = [
  { label: 'Students Assigned', value: '12',  icon: '🎓', trend: '3 new', color: '#4F46E5' },
  { label: 'Lessons Today',     value: '5',   icon: '📅', trend: 'Next at 2pm', color: '#10B981' },
  { label: 'Hours Taught',      value: '68h', icon: '🕒', trend: 'This month', color: '#F59E0B' },
  { label: 'Avg Rating',        value: '4.8', icon: '⭐', trend: '24 reviews',  color: '#F43F5E' },
];

const RECENT_BOOKINGS = [
  { student: 'Alice Kim',     date: 'Jun 27, 10:00 AM', type: 'Road Lesson',   status: 'confirmed' },
  { student: 'Bob Smith',     date: 'Jun 27, 02:00 PM', type: 'Theory',        status: 'pending'   },
  { student: 'Carol Davis',   date: 'Jun 28, 09:00 AM', type: 'Road Lesson',   status: 'confirmed' },
  { student: 'David Lee',     date: 'Jun 28, 11:30 AM', type: 'Mock Test',     status: 'confirmed' },
  { student: 'Emma Wilson',   date: 'Jun 29, 03:00 PM', type: 'Road Lesson',   status: 'cancelled' },
];

const STUDENT_SCHEDULE = [
  { date: 'Jun 27', time: '10:00 AM', type: 'Road Lesson',  instructor: 'Sarah Johnson', status: 'upcoming'  },
  { date: 'Jun 29', time: '02:00 PM', type: 'Theory',       instructor: 'Mike Torres',   status: 'upcoming'  },
  { date: 'Jul 02', time: '09:00 AM', type: 'Mock Test',    instructor: 'Sarah Johnson', status: 'upcoming'  },
];

const statusColors = {
  confirmed: { bg: '#D1FAE5', text: '#065F46' },
  pending:   { bg: '#FEF3C7', text: '#92400E' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B' },
  upcoming:  { bg: '#EDE9FE', text: '#4C1D95' },
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const isAdmin      = user?.role === 'Admin';
  const isInstructor = user?.role === 'Instructor';
  const isStudent    = user?.role === 'Student';

  const stats = isAdmin ? ADMIN_STATS : isInstructor ? INSTRUCTOR_STATS : STUDENT_STATS;

  return (
    <div className="dashboard">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div>
          <h2 className="welcome-title">Good morning, {user?.name?.split(' ')[0]}! 👋</h2>
          <p className="welcome-sub">Here's what's happening at DriveMaster today.</p>
        </div>
        {isStudent && (
          <div className="progress-ring-wrap">
            <svg viewBox="0 0 80 80" className="progress-ring">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#EEF2FF" strokeWidth="8"/>
              <circle cx="40" cy="40" r="34" fill="none" stroke="#4F46E5" strokeWidth="8"
                strokeDasharray="213.6" strokeDashoffset="55" strokeLinecap="round"
                transform="rotate(-90 40 40)"/>
            </svg>
            <div className="progress-label">
              <span className="progress-pct">74%</span>
              <span className="progress-txt">Course</span>
            </div>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        {stats.map(s => (
          <div className="stat-card" key={s.label} style={{ borderTop: `4px solid ${s.color}` }}>
            <div className="stat-icon" style={{ background: s.color + '20', color: s.color }}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-trend">{s.trend}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tables */}
      {(isAdmin || isInstructor) && (
        <Card className="table-card">
          <div className="table-header">
            <h3>Recent Bookings</h3>
            <span className="badge">{RECENT_BOOKINGS.length} total</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_BOOKINGS.map((b, i) => {
                const sc = statusColors[b.status] || statusColors.pending;
                return (
                  <tr key={i}>
                    <td><span className="avatar-sm">{b.student[0]}</span>{b.student}</td>
                    <td>{b.date}</td>
                    <td>{b.type}</td>
                    <td>
                      <span className="status-badge" style={{ background: sc.bg, color: sc.text }}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {isStudent && (
        <Card className="table-card">
          <div className="table-header">
            <h3>Upcoming Schedule</h3>
            <span className="badge">{STUDENT_SCHEDULE.length} sessions</span>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Date</th><th>Time</th><th>Type</th><th>Instructor</th><th>Status</th></tr>
            </thead>
            <tbody>
              {STUDENT_SCHEDULE.map((s, i) => {
                const sc = statusColors[s.status] || statusColors.upcoming;
                return (
                  <tr key={i}>
                    <td>{s.date}</td>
                    <td>{s.time}</td>
                    <td>{s.type}</td>
                    <td>{s.instructor}</td>
                    <td>
                      <span className="status-badge" style={{ background: sc.bg, color: sc.text }}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
