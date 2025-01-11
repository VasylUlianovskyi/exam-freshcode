import React, { useEffect, useState } from 'react';
import {
  getAllOffers,
  approveOffer,
  rejectOffer,
} from '../../api/rest/restController';
import styles from './ModeratorDashboard.module.sass';
import { useLocation } from 'react-router-dom';

const ModeratorDashboard = () => {
  const location = useLocation();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(location.state?.filter || null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchOffers();
  }, [filter, page]);

  const fetchOffers = async () => {
    setLoading(true);
    setError('');
    const offset = (page - 1) * limit;

    try {
      const response = await getAllOffers({
        limit,
        offset,
        isApproved: filter,
      });

      setOffers(response.data.offers || []);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to fetch offers.');
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = status => {
    setFilter(status);
    setPage(1);
  };

  const handleApprove = async offerId => {
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

  const handleReject = async offerId => {
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
      <div className={styles.filters}>
        <button onClick={() => handleFilterChange(null)}>All</button>
        <button onClick={() => handleFilterChange('null')}>Pending</button>
        <button onClick={() => handleFilterChange('true')}>Approved</button>
        <button onClick={() => handleFilterChange('false')}>Rejected</button>
      </div>
      {!offers || offers.length === 0 ? (
        <p className={styles.noOffers}>No offers available.</p>
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
            {offers.map(offer => {
              console.log(offer);
              return (
                <tr key={offer.id}>
                  <td>{offer.id}</td>
                  <td>{offer.text || 'N/A'}</td>
                  <td>{offer.Contest?.title || 'N/A'}</td>
                  <td>
                    {offer.Contest?.typeOfName
                      ? offer.Contest.typeOfName
                      : 'Not specified'}
                  </td>
                  <td>{offer.Contest?.industry || 'N/A'}</td>
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
              );
            })}
          </tbody>
        </table>
      )}
      <div className={styles.pagination}>
        <button
          className={styles.paginationBtn}
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>{`Page ${page}`}</span>
        <button
          className={styles.paginationBtn}
          onClick={() =>
            setPage(prev => (prev * limit < total ? prev + 1 : prev))
          }
          disabled={page * limit >= total}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
