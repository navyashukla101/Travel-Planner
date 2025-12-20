import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';

function TripForm() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (new Date(startDate) > new Date(endDate)) {
      setError('End date must be after start date');
      return;
    }

    try {
      const response = await API.post('/trips', {
        destination,
        startDate,
        endDate
      });
      navigate(`/trips/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create New Trip</h2>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              style={styles.input}
              placeholder="e.g., Paris, France"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.buttons}>
            <button type="submit" style={styles.submitBtn}>
              Create Trip
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: 'calc(100vh - 72px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    padding: '2rem'
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px'
  },
  title: {
    marginBottom: '1.5rem',
    color: '#1f2937'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem'
  },
  submitBtn: {
    flex: 1,
    backgroundColor: '#10b981',
    color: 'white',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#6b7280',
    color: 'white',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem'
  }
};

export default TripForm;
