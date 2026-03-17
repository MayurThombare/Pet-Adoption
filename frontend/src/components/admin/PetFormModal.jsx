import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const EMPTY = {
  name: '', species: 'dog', breed: '', age: '', ageUnit: 'years',
  gender: 'unknown', size: 'medium', color: '', description: '',
  status: 'available', photoUrl: '', vaccinated: false, neutered: false, healthNotes: ''
};

const PetFormModal = ({ pet, onClose, onSaved }) => {
  const [form, setForm] = useState(pet ? {
    name: pet.name, species: pet.species, breed: pet.breed || '',
    age: pet.age, ageUnit: pet.ageUnit, gender: pet.gender, size: pet.size,
    color: pet.color || '', description: pet.description || '', status: pet.status,
    photoUrl: pet.photoUrl || '', vaccinated: pet.vaccinated, neutered: pet.neutered,
    healthNotes: pet.healthNotes || ''
  } : { ...EMPTY });
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let payload;
      if (photoFile) {
        payload = new FormData();
        Object.entries(form).forEach(([k, v]) => payload.append(k, v));
        payload.append('photo', photoFile);
      } else {
        payload = form;
      }
      const config = photoFile ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
      if (pet) {
        await api.put(`/pets/${pet.id}`, payload, config);
      } else {
        await api.post('/pets', payload, config);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <h2 className="modal-title">{pet ? 'Edit Pet' : 'Add New Pet'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input type="text" name="name" className="form-control" value={form.name} onChange={handle} required />
              </div>
              <div className="form-group">
                <label className="form-label">Species *</label>
                <select name="species" className="form-control" value={form.species} onChange={handle}>
                  {['dog','cat','bird','rabbit','hamster','fish','reptile','other'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Breed</label>
                <input type="text" name="breed" className="form-control" value={form.breed} onChange={handle} placeholder="e.g. Golden Retriever" />
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <input type="text" name="color" className="form-control" value={form.color} onChange={handle} placeholder="e.g. Golden" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Age *</label>
                <input type="number" name="age" className="form-control" value={form.age} onChange={handle} min="0" step="0.1" required />
              </div>
              <div className="form-group">
                <label className="form-label">Age Unit</label>
                <select name="ageUnit" className="form-control" value={form.ageUnit} onChange={handle}>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select name="gender" className="form-control" value={form.gender} onChange={handle}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Size</label>
                <select name="size" className="form-control" value={form.size} onChange={handle}>
                  {['small','medium','large','extra-large'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select name="status" className="form-control" value={form.status} onChange={handle}>
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="adopted">Adopted</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Photo URL</label>
              <input type="url" name="photoUrl" className="form-control" value={form.photoUrl} onChange={handle} placeholder="https://…" />
            </div>

            <div className="form-group">
              <label className="form-label">Upload Photo</label>
              <input type="file" accept="image/*" className="form-control" onChange={(e) => setPhotoFile(e.target.files[0])} />
              {photoFile && <span style={{ fontSize: '0.8rem', color: 'var(--bark-muted)' }}>Selected: {photoFile.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-control" value={form.description} onChange={handle} rows={3} />
            </div>

            <div className="form-group">
              <label className="form-label">Health Notes</label>
              <textarea name="healthNotes" className="form-control" value={form.healthNotes} onChange={handle} rows={2} />
            </div>

            <div style={{ display: 'flex', gap: 20 }}>
              <label className="checkbox-row">
                <input type="checkbox" name="vaccinated" checked={form.vaccinated} onChange={handle} />
                <span>Vaccinated</span>
              </label>
              <label className="checkbox-row">
                <input type="checkbox" name="neutered" checked={form.neutered} onChange={handle} />
                <span>Neutered/Spayed</span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : pet ? 'Update Pet' : 'Add Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetFormModal;
