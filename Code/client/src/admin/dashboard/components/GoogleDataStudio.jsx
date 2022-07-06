import React from 'react';
import './googledata.css';

const DataStudioReport = () => (
  <div className="google-data-studio">
    <iframe
      title="datastudio"
      src="https://datastudio.google.com/embed/reporting/1RYpivSNT26N42v44DUQRwbuCSNxjhyXQ/page/eiQUB"
      frameBorder="0"
      style={{
        border: 0,
      }}
      allowFullScreen
    />
  </div>
);

export default DataStudioReport;
