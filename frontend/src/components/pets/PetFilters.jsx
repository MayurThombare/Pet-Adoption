import './PetFilters.css';

const PetFilters = ({ filters, onChange, onReset }) => {
  const handle = (e) => onChange({ ...filters, [e.target.name]: e.target.value, page: 1 });

  return (
    <div className="pet-filters">
      <div className="filters-row">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="form-control search-input"
            type="text"
            name="search"
            placeholder="Search by name or breed…"
            value={filters.search}
            onChange={handle}
          />
        </div>

        <select className="form-control filter-select" name="species" value={filters.species} onChange={handle}>
          <option value="">All Species</option>
          <option value="dog">🐕 Dog</option>
          <option value="cat">🐈 Cat</option>
          <option value="bird">🦜 Bird</option>
          <option value="rabbit">🐇 Rabbit</option>
          <option value="hamster">🐹 Hamster</option>
          <option value="fish">🐟 Fish</option>
          <option value="reptile">🦎 Reptile</option>
          <option value="other">🐾 Other</option>
        </select>

        <input
          className="form-control filter-select"
          type="text"
          name="breed"
          placeholder="Breed…"
          value={filters.breed}
          onChange={handle}
        />

        <select className="form-control filter-select" name="age" value={filters.age} onChange={handle}>
          <option value="">Any Age</option>
          <option value="0-1">Under 1 year</option>
          <option value="1-3">1–3 years</option>
          <option value="3-7">3–7 years</option>
          <option value="7-100">7+ years</option>
        </select>

        <select className="form-control filter-select" name="sort" value={filters.sort} onChange={handle}>
          <option value="createdAt">Newest first</option>
          <option value="name">Name A–Z</option>
          <option value="age">Age</option>
        </select>

        {(filters.search || filters.species || filters.breed || filters.age) && (
          <button className="btn btn-ghost btn-sm reset-btn" onClick={onReset}>✕ Reset</button>
        )}
      </div>
    </div>
  );
};

export default PetFilters;
