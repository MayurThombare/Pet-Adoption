import { Link } from 'react-router-dom';
import './PetCard.css';

const PetCard = ({ pet }) => {
  const fallbackImg = `https://placehold.co/400x280/fdf6ec/6b4c3b?text=${encodeURIComponent(pet.name)}`;

  return (
    <Link to={`/pets/${pet.id}`} className="pet-card card">
      <div className="pet-card-img-wrap">
        <img
          src={pet.photoUrl || fallbackImg}
          alt={pet.name}
          className="pet-card-img"
          onError={(e) => { e.target.src = fallbackImg; }}
        />
        <span className={`badge badge-${pet.status} pet-card-status`}>{pet.status}</span>
        {pet.vaccinated && <span className="pet-card-vax" title="Vaccinated">💉</span>}
      </div>
      <div className="pet-card-body">
        <div className="pet-card-top">
          <h3 className="pet-card-name">{pet.name}</h3>
          <span className="pet-card-species">{speciesEmoji(pet.species)}</span>
        </div>
        <p className="pet-card-breed">{pet.breed || pet.species}</p>
        <div className="pet-card-meta">
          <span>{pet.age} {pet.ageUnit}</span>
          <span className="dot">·</span>
          <span style={{ textTransform: 'capitalize' }}>{pet.gender}</span>
          <span className="dot">·</span>
          <span style={{ textTransform: 'capitalize' }}>{pet.size}</span>
        </div>
        {pet.description && (
          <p className="pet-card-desc">{pet.description.slice(0, 80)}{pet.description.length > 80 ? '…' : ''}</p>
        )}
      </div>
    </Link>
  );
};

const speciesEmoji = (s) => ({ dog:'🐕', cat:'🐈', bird:'🦜', rabbit:'🐇', hamster:'🐹', fish:'🐟', reptile:'🦎', other:'🐾' }[s] || '🐾');

export default PetCard;
