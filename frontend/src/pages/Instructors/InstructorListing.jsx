import React, { useState } from 'react';
import Card from '../../components/Card';
import './InstructorListing.css';

const INSTRUCTORS = [
  {
    id: 1, name: 'Sarah Johnson', email: 'sarah@drive.com',
    specialty: 'Road Driving', rating: 4.9, reviews: 82,
    experience: '7 years', licenseTypes: ['Car (Class C)', 'Motorcycle (Class M)'],
    available: true, bio: 'Patient and thorough instructor with a calm teaching style. Specialises in nervous beginners.',
    avatar: 'S', color: '#4F46E5',
  },
  {
    id: 2, name: 'Mike Torres', email: 'mike@drive.com',
    specialty: 'Theory & Practical', rating: 4.7, reviews: 65,
    experience: '5 years', licenseTypes: ['Car (Class C)', 'Commercial (Class A)'],
    available: true, bio: 'Former defensive-driving trainer. Great at highways and complex manoeuvres.',
    avatar: 'M', color: '#10B981',
  },
  {
    id: 3, name: 'Linda Park', email: 'linda@drive.com',
    specialty: 'Motorcycle', rating: 4.8, reviews: 43,
    experience: '9 years', licenseTypes: ['Motorcycle (Class M)'],
    available: false, bio: 'Expert motorcyclist and safety advocate. Known for structured, confidence-building lessons.',
    avatar: 'L', color: '#F59E0B',
  },
  {
    id: 4, name: 'Carlos Rivera', email: 'carlos@drive.com',
    specialty: 'Commercial Vehicles', rating: 4.6, reviews: 31,
    experience: '12 years', licenseTypes: ['Commercial (Class A)', 'Car (Class C)'],
    available: true, bio: 'Former long-haul trucker with extensive big-rig and fleet experience.',
    avatar: 'C', color: '#8B5CF6',
  },
  {
    id: 5, name: 'Priya Nair', email: 'priya@drive.com',
    specialty: 'Road Driving', rating: 4.9, reviews: 97,
    experience: '6 years', licenseTypes: ['Car (Class C)'],
    available: true, bio: 'Top-rated instructor; 97 five-star reviews. Expert at parallel parking and reverse manoeuvres.',
    avatar: 'P', color: '#F43F5E',
  },
  {
    id: 6, name: 'James White', email: 'james@drive.com',
    specialty: 'Theory & Mock Tests', rating: 4.5, reviews: 58,
    experience: '4 years', licenseTypes: ['Car (Class C)', 'Motorcycle (Class M)'],
    available: false, bio: 'Specialises in theory prep and mock exams. Students pass first-try 88% of the time.',
    avatar: 'J', color: '#0EA5E9',
  },
];

const FILTERS = ['All', 'Car (Class C)', 'Motorcycle (Class M)', 'Commercial (Class A)'];

function Stars({ rating }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(n => (
        <span key={n} style={{ color: n <= Math.round(rating) ? '#F59E0B' : '#E2E8F0' }}>★</span>
      ))}
    </span>
  );
}

export default function InstructorListing() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [booked, setBooked] = useState(null);

  const shown = INSTRUCTORS.filter(ins => {
    const matchFilter = filter === 'All' || ins.licenseTypes.includes(filter);
    const matchSearch = ins.name.toLowerCase().includes(search.toLowerCase()) ||
                        ins.specialty.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="instructors-page">
      {/* Filters */}
      <div className="instructors-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="🔍  Search by name or specialty…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filter-tabs">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >{f}</button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="instructors-grid">
        {shown.map(ins => (
          <div className="instructor-card" key={ins.id}>
            <div className="ins-header" style={{ background: ins.color }}>
              <div className="ins-avatar">{ins.avatar}</div>
              <div className={`ins-avail ${ins.available ? 'avail-yes' : 'avail-no'}`}>
                {ins.available ? '● Available' : '● Unavailable'}
              </div>
            </div>
            <div className="ins-body">
              <h4 className="ins-name">{ins.name}</h4>
              <div className="ins-specialty">{ins.specialty}</div>
              <div className="ins-rating">
                <Stars rating={ins.rating} />
                <span className="rating-num">{ins.rating}</span>
                <span className="review-cnt">({ins.reviews} reviews)</span>
              </div>
              <p className="ins-bio">{ins.bio}</p>
              <div className="ins-tags">
                {ins.licenseTypes.map(lt => (
                  <span className="tag" key={lt}>{lt}</span>
                ))}
              </div>
              <div className="ins-meta">
                <span>🕒 {ins.experience}</span>
              </div>
              <button
                className="book-btn"
                disabled={!ins.available}
                onClick={() => setBooked(ins.name)}
              >
                {ins.available ? 'Book a Lesson' : 'Not Available'}
              </button>
            </div>
          </div>
        ))}
        {shown.length === 0 && (
          <div className="no-results">No instructors match your search.</div>
        )}
      </div>

      {/* Toast */}
      {booked && (
        <div className="booking-toast" onAnimationEnd={() => setTimeout(() => setBooked(null), 2500)}>
          ✅ Booking request sent to <strong>{booked}</strong>!
        </div>
      )}
    </div>
  );
}
