import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./styles.css";

// ==========================
// Searchbar Component
// ==========================
const Searchbar = ({ onSubmit }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!query.trim()) return;
      onSubmit(query.trim());
      setQuery("");
    },
    [query, onSubmit]
  );

  return (
    <header className="searchbar">
      <form className="form" onSubmit={handleSubmit}>
        <button type="submit" className="button">
          <span className="button-label">Search</span>
        </button>
        <input
          className="input"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
    </header>
  );
};

// ==========================
// ImageGalleryItem Component
// ==========================
const ImageGalleryItem = React.memo(({ image, onClick }) => {
  return (
    <li className="gallery-item" onClick={() => onClick(image.largeImageURL)}>
      <img src={image.webformatURL} alt="img" />
    </li>
  );
});

// ==========================
// ImageGallery Component
// ==========================
const ImageGallery = React.memo(({ images, onImageClick }) => {
  return (
    <ul className="gallery">
      {images.map((img) => (
        <ImageGalleryItem key={img.id} image={img} onClick={onImageClick} />
      ))}
    </ul>
  );
});

// ==========================
// Loader Component
// ==========================
const Loader = () => <div className="loader">Loading...</div>;

// ==========================
// Button Component
// ==========================
const Button = React.memo(({ onClick }) => {
  return (
    <button className="load-more" onClick={onClick}>
      Load more
    </button>
  );
});

// ==========================
// Modal Component
// ==========================
const Modal = ({ largeImg, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <img src={largeImg} alt="big" />
      </div>
    </div>
  );
};

// ==========================
// Main App Component
// ==========================
const API_KEY = "YOUR_PIXABAY_KEY_HERE";
const PER_PAGE = 12;

export default function App() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [largeImage, setLargeImage] = useState(null);

  // ==========================
  // useCallback: стабільні колбеки
  // ==========================
  const handleSearch = useCallback((newQuery) => {
    setQuery(newQuery);
    setImages([]);
    setPage(1);
  }, []);

  const handleLoadMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const handleImageClick = useCallback((url) => {
    setLargeImage(url);
  }, []);

  // ==========================
  // useMemo: кешований URL запиту
  // ==========================
  const requestURL = useMemo(() => {
    if (!query) return null;
    return `https://pixabay.com/api/?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${PER_PAGE}`;
  }, [query, page]);

  const fetchImages = useCallback(async () => {
    if (!requestURL) return;
    setLoading(true);

    try {
      const res = await fetch(requestURL);
      const data = await res.json();
      setImages((prev) => [...prev, ...data.hits]);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  }, [requestURL]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="App">
      <Searchbar onSubmit={handleSearch} />

      {images.length > 0 && (
        <ImageGallery images={images} onImageClick={handleImageClick} />
      )}

      {loading && <Loader />}

      {images.length > 0 && !loading && <Button onClick={handleLoadMore} />}

      {largeImage && <Modal largeImg={largeImage} onClose={() => setLargeImage(null)} />}
    </div>
  );
}
