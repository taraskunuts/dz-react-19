// src/components/ImageGalleryItem.jsx
import React from 'react';

function ImageGalleryItem({ src, onClick }) {
  return (
    <li className="gallery-item" onClick={onClick}>
      <img src={src} alt="" />
    </li>
  );
}

export default ImageGalleryItem;