import React from 'react';
import classNames from 'classnames';
import styles from './ButtonGroup.module.sass';

const ButtonOption = ({ option, isActive, onClick, showRecommended }) => {
  return (
    <button
      type='button'
      className={classNames(styles.button, { [styles.active]: isActive })}
      onClick={() => onClick(option.value)}
    >
      {showRecommended && <div className={styles.recommended}>Recommended</div>}
      <div className={styles.labelWrapper}>
        <span className={styles.label}>{option.label}</span>
        {isActive && <span className={styles.checkmark}>✔</span>}
      </div>
      {option.subLabel && (
        <span className={styles.subLabel}>{option.subLabel}</span>
      )}
    </button>
  );
};

export default ButtonOption;
