import React from 'react';
import styles from './Error.module.sass';

const Error = props => {
  const getMessage = () => {
    const { status, data } = props;
    switch (status) {
      case 404:
        return data;
      case 400:
        return 'Check the input data';
      case 401:
        return 'Wrong email or password';

      case 409:
        return data;
      case 403:
        return 'Bank decline transaction';
      case 406:
        return data;
      default:
        return 'Server Error';
    }
  };

  const { clearError } = props;
  return (
    <div className={styles.errorContainer}>
      {getMessage()?.message ||
        getMessage()?.error ||
        JSON.stringify(getMessage())}
      <i className='far fa-times-circle' onClick={() => clearError()} />
    </div>
  );
};

export default Error;
