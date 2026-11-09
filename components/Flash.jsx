// Bootstrap-style alert list used by pages that showed connect-flash messages.
const CLASS = { error: 'danger', success: 'success', warning: 'warning', info: 'info' };

export default function Flash({ messages, bs = 3, style }) {
  if (!messages) return null;
  const entries = Object.entries(messages).filter(([, v]) => v && v.length);
  if (!entries.length) return null;
  return (
    <div style={style}>
      {entries.map(([type, list]) =>
        (Array.isArray(list) ? list : [list]).map((msg, i) => (
          <div key={type + i} className={`alert alert-${CLASS[type] || 'info'}${bs === 5 ? ' alert-dismissible fade show' : ''}`} role="alert">
            {msg}
            {bs === 5 && <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" />}
          </div>
        ))
      )}
    </div>
  );
}
