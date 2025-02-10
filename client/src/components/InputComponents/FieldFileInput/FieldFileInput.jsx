import React from 'react';
import { Field } from 'formik';

const FieldFileInput = ({ classes, ...rest }) => {
  const { fileUploadContainer, labelClass, fileNameClass, fileInput } = classes;

  return (
    <Field name={rest.name}>
      {({ field, form }) => {
        const handleFileChange = event => {
          const file = event.currentTarget.files[0];
          form.setFieldValue(rest.name, file || null);
        };

        return (
          <div className={fileUploadContainer}>
            <label htmlFor='fileInput' className={labelClass}>
              Choose file
            </label>
            <span id='fileNameContainer' className={fileNameClass}>
              {field.value ? field.value.name : 'No file chosen'}
            </span>
            <input
              type='file'
              className={fileInput}
              id='fileInput'
              onChange={handleFileChange}
            />
          </div>
        );
      }}
    </Field>
  );
};

export default FieldFileInput;
