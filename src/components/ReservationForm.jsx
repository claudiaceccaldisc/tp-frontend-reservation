import { useState } from "react";
import { createReservation } from "../services/api";
import Loader from "./Loader";

function ReservationForm({ resource, slot, onSuccess }) {
  const [date, setDate] = useState("");
  const [state, setState] = useState("idle"); 
  // idle | loading | error | conflict

  const isFormValid = date && slot;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setState("loading");

    createReservation({
      resourceId: resource.id,
      date,
      slot,
    })
      .then((reservation) => {
        setState("idle");
        onSuccess(reservation);
      })
      .catch((err) => {
        if (err.status === 409) {
          setState("conflict");
        } else {
          setState("error");
        }
      });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>Réserver {resource.name}</h3>

      {/* Date */}
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Créneau */}
      <div className="form-group">
        <label>Créneau sélectionné</label>
        <div className="slot-selected">{slot}</div>
      </div>

      {/* Messages */}
      {state === "conflict" && (
        <p className="message error">
          Ce créneau n’est plus disponible.
        </p>
      )}

      {state === "error" && (
        <p className="message error">
          Impossible de créer la réservation.
        </p>
      )}

      {/* Bouton / Loader */}
      {state === "loading" ? (
        <Loader text="Réservation en cours…" />
      ) : (
        <button type="submit" disabled={!isFormValid}>
          Réserver
        </button>
      )}
    </form>
  );
}

export default ReservationForm;
