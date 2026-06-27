import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/Card';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="grid-cols-2">
      <Card>
        <h3>Welcome, {user.name}!</h3>
        <p className="text-muted" style={{marginTop: '8px'}}>Role: {user.role}</p>
      </Card>
      <Card>
        <h3>Quick Stats</h3>
        <p className="text-muted" style={{marginTop: '8px'}}>Overview coming soon...</p>
      </Card>
    </div>
  );
};

export default Dashboard;
