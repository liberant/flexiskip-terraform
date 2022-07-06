import React from 'react';
import PropTypes from 'prop-types';
import ImageGallery from '../../../../common/components/ImageGallery';

const ReportImages = ({ dispute }) => {
  const images = dispute.images.map(item => ({ original: item, thumbnail: item }));
  return (
    <div className="w-panel w-form">
      <div className="w-title">
        <h2>Report Images</h2>
      </div>

      {(dispute.images.length === 0) ?
        (<p><em>There is no images in this report.</em></p>) :
        <ImageGallery items={images} />
      }
    </div>
  );
};

ReportImages.propTypes = {
  dispute: PropTypes.object.isRequired,
};

export default ReportImages;
