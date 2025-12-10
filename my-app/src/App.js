import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Searchbar from './components/Searchbar';
import ImageGallery from './components/ImageGallery';
import Button from './components/Button';
import Loader from './components/Loader';
import Modal from './components/Modal';
import './App.css';

const API_KEY = '53654899-cf708ca7bc97f05663599702a';

function App() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [largeImage, setLargeImage] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const requestUrl = useMemo(() => {
    if (!query) return null;

    return `https://pixabay.com/api/?q=${encodeURIComponent(
      query
    )}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;
  }, [query, page]);

  const fetchImages = useCallback(async () => {
    if (!requestUrl) return;

    try {
      setLoading(true);
      const response = await fetch(requestUrl);
      const data = await response.json();

      setImages(prev =>
        page === 1 ? data.hits || [] : [...prev, ...(data.hits || [])]
      );
      setHasMore((data.hits || []).length === 12);
    } catch (err) {
      console.error('Error fetching:', err);
    } finally {
      setLoading(false);
    }
  }, [requestUrl, page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleSearchSubmit = useCallback(word => {
    if (word === query) return; // Prevent re-fetch if same query
    setQuery(word);
    setImages([]);
    setPage(1);
    setHasMore(false);
  }, [query]);

  const loadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  const openModal = useCallback(url => {
    setLargeImage(url);
  }, []);

  const closeModal = useCallback(() => {
    setLargeImage(null);
  }, []);

  return (
    <>
      <Searchbar onSubmit={handleSearchSubmit} />

      {images.length > 0 && <ImageGallery images={images} onItemClick={openModal} />}

      {loading && <Loader />}

      {hasMore && !loading && (
        <Button onClick={loadMore} />
      )}

      {largeImage && (
        <Modal largeImageURL={largeImage} onClose={closeModal} />
      )}
    </>
  );
}

export default App;