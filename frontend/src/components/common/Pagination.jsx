const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages } = pagination;
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button className="pagination-btn" onClick={() => onPageChange(1)} disabled={page === 1}>«</button>
      <button className="pagination-btn" onClick={() => onPageChange(page - 1)} disabled={page === 1}>‹</button>
      {pages[0] > 1 && <><button className="pagination-btn" onClick={() => onPageChange(1)}>1</button><span style={{padding:'0 4px',color:'var(--bark-muted)'}}>…</span></>}
      {pages.map(p => (
        <button key={p} className={`pagination-btn ${p === page ? 'active' : ''}`} onClick={() => onPageChange(p)}>{p}</button>
      ))}
      {pages[pages.length - 1] < totalPages && <><span style={{padding:'0 4px',color:'var(--bark-muted)'}}>…</span><button className="pagination-btn" onClick={() => onPageChange(totalPages)}>{totalPages}</button></>}
      <button className="pagination-btn" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>›</button>
      <button className="pagination-btn" onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>»</button>
    </div>
  );
};

export default Pagination;
