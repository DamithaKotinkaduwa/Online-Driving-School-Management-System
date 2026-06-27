import React from 'react';
import Card from '../../components/Card';

const AdminUsers = () => {
  return (
    <div>
      <Card>
        <h3>Manage Users</h3>
        <p className="text-muted" style={{marginTop: '8px'}}>List of all system users will appear here.</p>
      </Card>
    </div>
  );
};

export default AdminUsers;
