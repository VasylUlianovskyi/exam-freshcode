import React, { useState } from 'react';
import { useField, useFormikContext } from 'formik';
import classNames from 'classnames';

const ImageUpload = ({ name, classes }) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext(); // Додаємо доступ до `Formik`
  const { uploadContainer, inputContainer, imgStyle } = classes;
  const [preview, setPreview] = useState(null);

  const onChange = e => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const imageType = /image.*/;

    if (!file.type.match(imageType)) {
      e.target.value = '';
      setFieldValue(name, null); // Скидаємо значення у Formik
      return;
    }

    setFieldValue(name, file); // Оновлюємо значення у Formik

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className={uploadContainer}>
      <div className={inputContainer}>
        <span>Support only images (*.png, *.gif, *.jpeg)</span>
        <input
          id='fileInput'
          type='file'
          accept='.jpg, .png, .jpeg'
          onChange={onChange}
        />
        <label htmlFor='fileInput'>Choose file</label>
      </div>
      {preview && (
        <img
          src={preview}
          className={classNames({ [imgStyle]: !!preview })}
          alt='user'
        />
      )}
    </div>
  );
};

export default ImageUpload;
