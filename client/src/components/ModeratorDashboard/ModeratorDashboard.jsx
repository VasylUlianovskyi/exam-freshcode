import React, { useEffect, useState } from 'react';
import {
  getPendingOffers,
  approveOffer,
  rejectOffer,
} from '../../api/rest/restController';
import styles from './ModeratorDashboard.module.sass';

const ModeratorDashboard = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetchPendingOffers();
  }, [refresh]);

  const fetchPendingOffers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getPendingOffers({ limit: 10, offset: 0 });
      setOffers(response.data.offers);
    } catch (err) {
      setError('Failed to fetch pending offers.');
      console.error('Error fetching pending offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async offerId => {
    try {
      await approveOffer(offerId);
      setRefresh(!refresh);
    } catch (err) {
      console.error('Error approving offer:', err);
    }
  };

  const handleReject = async offerId => {
    try {
      await rejectOffer(offerId);
      setRefresh(!refresh);
    } catch (err) {
      console.error('Error rejecting offer:', err);
    }
  };

  if (loading) {
    return <div className={styles.moderatorDashboard}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.moderatorDashboard}>{error}</div>;
  }

  return (
    <div className={styles.moderatorDashboard}>
      <h1 className={styles.title}>Moderator Dashboard</h1>
      {offers.length === 0 ? (
        <p className={styles.noOffers}>No pending offers at the moment.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Contest ID</th>
              <th>Text</th>
              <th>File Name</th>
              <th>Status</th>
              <th>Is Approved</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(offer => (
              <tr key={offer.id}>
                <td>{offer.id}</td>
                <td>{offer.userId}</td>
                <td>{offer.contestId}</td>
                <td>{offer.text || 'N/A'}</td>
                <td>{offer.fileName || 'N/A'}</td>
                <td>{offer.status}</td>
                <td>
                  {offer.isApproved === null
                    ? 'Pending'
                    : offer.isApproved
                    ? 'Approved'
                    : 'Rejected'}
                </td>
                <td>
                  <button
                    className={styles.approveBtn}
                    onClick={() => handleApprove(offer.id)}
                  >
                    Approve
                  </button>
                  <button
                    className={styles.rejectBtn}
                    onClick={() => handleReject(offer.id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ModeratorDashboard;
