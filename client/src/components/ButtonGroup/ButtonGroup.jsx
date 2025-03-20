import React, { useCallback } from 'react';
import { useField } from 'formik';
import classNames from 'classnames';
import ButtonOption from './ButtonOption';
import styles from './ButtonGroup.module.sass';

const ButtonGroup = ({ name, options }) => {
  const [field, , helpers] = useField(name);

  const handleClick = useCallback(
    value => {
      helpers.setValue(value);
    },
    [helpers]
  );

  return (
    <div className={styles.buttonGroup}>
      {options.map((option, index) => (
        <ButtonOption
          key={option.value}
          option={option}
          isActive={field.value === option.value}
          onClick={handleClick}
          showRecommended={index === 0}
        />
      ))}
    </div>
  );
};

export default ButtonGroup;
