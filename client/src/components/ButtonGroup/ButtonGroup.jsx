import React from 'react';
import { useField } from 'formik';
import classNames from 'classnames';
import styles from './ButtonGroup.module.sass';

const ButtonGroup = ({ name, options }) => {
  const [field, , helpers] = useField(name);

  return (
    <div className={styles.buttonGroup}>
      {options.map((option, index) => (
        <button
          key={option.value}
          type='button'
          className={classNames(styles.button, {
            [styles.active]: field.value === option.value,
          })}
          onClick={() => helpers.setValue(option.value)}
        >
          {index === 0 && <div className={styles.recommended}>Recommended</div>}
          <span className={styles.label}>
            {option.label}
            {option.text}
          </span>
          <span className={styles.subLabel}>{option.subLabel}</span>
          {field.value === option.value && (
            <span className={styles.checkmark}>✔</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default ButtonGroup;
