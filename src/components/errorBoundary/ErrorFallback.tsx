const ErrorFallback = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>⚠️ Oops!</h1>
    <p>Something broke while loading the page.</p>
    <button onClick={() => window.location.reload()}>Reload</button>
  </div>
);

export default ErrorFallback;
