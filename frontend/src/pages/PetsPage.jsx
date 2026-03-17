import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import PetCard from '../components/pets/PetCard';
import PetFilters from '../components/pets/PetFilters';
import Pagination from '../components/common/Pagination';
import './PetsPage.css';

const defaultFilters = { search: '', species: '', breed: '', age: '', sort: 'createdAt', page: 1 };

const PetsPage = () => {
  const [pets, setPets] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1, limit: 12 });
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { status: 'available', limit: 12, ...filters };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const { data } = await api.get('/pets', { params });
      setPets(data.data.pets);
      setPagination(data.data.pagination);
    } catch {
      setError('Failed to load pets. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchPets(); }, [fetchPets]);

  const handlePageChange = (page) => {
    setFilters((f) => ({ ...f, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page pets-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Find Your Pet 🐾</h1>
          <p className="page-subtitle">
            {pagination.total > 0 ? `${pagination.total} adorable pets waiting for their forever home` : 'Browse our available pets'}
          </p>
        </div>

        <PetFilters
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(defaultFilters)}
        />

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="spinner" />
        ) : pets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No pets found</h3>
            <p>Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <>
            <div className="pets-grid">
              {pets.map((pet) => <PetCard key={pet.id} pet={pet} />)}
            </div>
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
};

export default PetsPage;
