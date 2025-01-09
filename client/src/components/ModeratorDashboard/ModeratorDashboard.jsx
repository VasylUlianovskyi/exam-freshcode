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

  const handleApprove = async (offerId, index) => {
    try {
      await approveOffer(offerId);
      setOffers(prevOffers =>
        prevOffers.map(offer =>
          offer.id === offerId ? { ...offer, isApproved: true } : offer
        )
      );
    } catch (err) {
      console.error('Error approving offer:', err);
    }
  };

  const handleReject = async (offerId, index) => {
    try {
      await rejectOffer(offerId);
      setOffers(prevOffers =>
        prevOffers.map(offer =>
          offer.id === offerId ? { ...offer, isApproved: false } : offer
        )
      );
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
              <th>№</th>
              <th>Offer</th>
              <th>Title</th>
              <th>Type of Name</th>
              <th>Industry</th>
              <th className={styles.actionCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(offer => (
              <tr key={offer.id}>
                <td>{offer.id}</td>
                <td>{offer.text || 'N/A'}</td>
                {offer.Contest?.title && <td>{offer.Contest.title}</td>}
                <td>
                  {offer.Contest?.typeOfName
                    ? offer.Contest.typeOfName
                    : 'Not specified '}
                </td>

                <td>
                  {offer.Contest?.industry ? offer.Contest.industry : 'N/A'}
                </td>
                <td className={styles.actionCell}>
                  {offer.isApproved === null && (
                    <>
                      <button
                        className={styles.approveBtn}
                        onClick={() => handleApprove(offer.id)}
                        disabled={offer.isApproved === true}
                      >
                        {offer.isApproved === true ? 'Approved' : 'Approve'}
                      </button>
                      <button
                        className={styles.rejectBtn}
                        onClick={() => handleReject(offer.id)}
                        disabled={offer.isApproved === false}
                      >
                        {offer.isApproved === false ? 'Rejected' : 'Reject'}
                      </button>
                    </>
                  )}
                  {offer.isApproved === true && (
                    <button
                      className={`${styles.approveBtn} ${styles.centered}`}
                      disabled
                    >
                      Approved
                    </button>
                  )}
                  {offer.isApproved === false && (
                    <button
                      className={`${styles.rejectBtn} ${styles.centered}`}
                      disabled
                    >
                      Rejected
                    </button>
                  )}
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
