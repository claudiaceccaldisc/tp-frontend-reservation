import { useEffect, useState } from "react";
import {
  getAvailabilities,
  cancelReservation,
} from "../services/api";
import ReservationForm from "../components/ReservationForm";
import Loader from "../components/Loader";

function ResourceAvailabilities({ resource, onBack }) {
  const [state, setState] = useState("loading");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [cancelState, setCancelState] = useState("idle"); 
  // idle | loading | success | error

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

  /* ---------- ANNULATION ---------- */
  const handleCancel = () => {
    setCancelState("loading");

    cancelReservation(reservation.id)
      .then(() => {
        setCancelState("success");
        setReservation(null);
        setSelectedSlot(null);
      })
      .catch(() => {
        setCancelState("error");
      });
  };

  /* ---------- ÉTATS ---------- */

  if (state === "loading") {
    return <Loader text="Chargement des disponibilités…" />;
  }

  if (state === "error") {
    return (
      <p className="message error">
        Impossible de charger les disponibilités.
      </p>
    );
  }

  if (state === "empty") {
    return (
      <>
        <button className="back" onClick={onBack}>← Retour</button>
        <p className="message">
          Aucun créneau disponible pour cette ressource.
        </p>
      </>
    );
  }

  /* ---------- SUCCÈS ---------- */
  return (
    <>
      <button className="back" onClick={onBack}>← Retour</button>
      <h2>Disponibilités – {resource.name}</h2>

      {/* LISTE DES CRÉNEAUX */}
      {!selectedSlot && !reservation && (
        <ul>
          {slots.map((slot, index) => (
            <li key={index} onClick={() => setSelectedSlot(slot)}>
              {slot}
            </li>
          ))}
        </ul>
      )}

      {/* FORMULAIRE */}
      {selectedSlot && !reservation && (
        <ReservationForm
          resource={resource}
          slot={selectedSlot}
          onSuccess={(res) => setReservation(res)}
        />
      )}

      {/* CONFIRMATION + ANNULATION */}
      {reservation && (
        <>
          <p className="message success">
            Réservation effectuée avec succès.
          </p>

          {cancelState === "error" && (
            <p className="message error">
              Impossible d’annuler la réservation.
            </p>
          )}

          {cancelState === "success" && (
            <p className="message success">
              Réservation annulée avec succès.
            </p>
          )}

          <button
            onClick={handleCancel}
            disabled={cancelState === "loading"}
          >
            {cancelState === "loading"
              ? "Annulation en cours…"
              : "Annuler la réservation"}
          </button>
        </>
      )}
    </>
  );
}

export default ResourceAvailabilities;
