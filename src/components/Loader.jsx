function Loader({ text = "Chargement…" }) {
  return (
    <div className="loader">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}

export default Loader;
