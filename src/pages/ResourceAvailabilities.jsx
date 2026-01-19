import { useEffect, useState } from "react";
import { getAvailabilities } from "../services/api";
import ReservationForm from "../components/ReservationForm";

function ResourceAvailabilities({ resource, onBack }) {
  const [state, setState] = useState("loading");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reservationDone, setReservationDone] = useState(false);

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

  if (reservationDone) {
    return (
      <>
        <p className="message success">
          Réservation effectuée avec succès.
        </p>
        <button onClick={onBack}>Retour aux ressources</button>
      </>
    );
  }

  return (
    <>
      <button onClick={onBack}>← Retour</button>
      <h2>Disponibilités – {resource.name}</h2>

      {state === "loading" && (
        <p className="message">Chargement des disponibilités…</p>
      )}

      {state === "error" && (
        <p className="message error">
          Impossible de charger les disponibilités.
        </p>
      )}

      {state === "empty" && (
        <p className="message">
          Aucun créneau disponible pour cette ressource.
        </p>
      )}

      {state === "success" && !selectedSlot && (
        <ul>
          {slots.map((slot, index) => (
            <li key={index} onClick={() => setSelectedSlot(slot)}>
              {slot}
            </li>
          ))}
        </ul>
      )}

      {selectedSlot && (
        <ReservationForm
          resource={resource}
          slot={selectedSlot}
          onSuccess={() => setReservationDone(true)}
        />
      )}
    </>
  );
}

export default ResourceAvailabilities;
