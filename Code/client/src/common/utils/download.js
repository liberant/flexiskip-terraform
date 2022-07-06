const downloadFile = (blob, filename) => {
  const blobURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = blobURL;
  tempLink.setAttribute('download', filename);
  tempLink.setAttribute('target', '_blank');
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(blobURL);
};

export default downloadFile;
