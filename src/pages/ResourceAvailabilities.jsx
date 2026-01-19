import { useEffect, useState } from "react";
import { getAvailabilities } from "../services/api";

function ResourceAvailabilities({ resource, onBack }) {
  const [state, setState] = useState("loading");
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    getAvailabilities(resource.id)
      .then((data) => {
        if (!data || data.length === 0) {
          setState("empty");
        } else {
          setSlots(data);
          setState("success");
        }
      })
      .catch(() => setState("error"));
  }, [resource.id]);

  return (
    <>
      <button onClick={onBack}>← Retour</button>
      <h2>Disponibilités – {resource.name}</h2>

      {state === "loading" && (
        <p className="message">Chargement des disponibilités…</p>
      )}

      {state === "error" && (
        <p className="message">
          Impossible de charger les disponibilités.
        </p>
      )}

      {state === "empty" && (
        <p className="message">
          Aucun créneau disponible pour cette ressource.
        </p>
      )}

      {state === "success" && (
        <ul>
          {slots.map((slot, index) => (
            <li key={index}>{slot}</li>
          ))}
        </ul>
      )}
    </>
  );
}

export default ResourceAvailabilities;
