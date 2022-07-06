import React from 'react';
import { Field } from 'redux-form';
import ImagesS3UploadField from '../../../common/components/form/ImagesS3UploadField';

class ProductImagesSubForm extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <div>
              <Field
                name="images"
                component={ImagesS3UploadField}
              />
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default ProductImagesSubForm;
