// src/components/ImageGallery.jsx
import React from 'react';
import ImageGalleryItem from './ImageGalleryItem';

function ImageGallery({ images, onItemClick }) {
  return (
    <ul className="gallery">
      {images.map(({ id, webformatURL, largeImageURL }) => (
        <ImageGalleryItem
          key={id}
          src={webformatURL}
          largeSrc={largeImageURL}
          onClick={() => onItemClick(largeImageURL)}
        />
      ))}
    </ul>
  );
}

export default ImageGallery;