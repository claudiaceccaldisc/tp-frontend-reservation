// Simule un délai réseau
const fakeDelay = (response, shouldFail = false, status = 500) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject({ status });
      } else {
        resolve(response);
      }
    }, 800);
  });

/*DONNÉES MOCKÉES */

let resources = [
  { id: 1, name: "Salle A" },
  { id: 2, name: "Salle B" },
];

let availabilities = {
  1: ["09:00 - 10:00", "10:00 - 11:00"],
  2: [],
};

let reservations = [];

/*API — RESSOURCES*/

// GET /resources
export function getResources() {
  return fakeDelay(resources);
}

// GET /resources/{id}/availabilities
export function getAvailabilities(resourceId) {
  return fakeDelay(availabilities[resourceId] || []);
}

/* API — RÉSERVATIONS*/

// POST /reservations
export function createReservation({ resourceId, date, slot }) {
  // validation simple
  if (!resourceId || !date || !slot) {
    return fakeDelay(null, true, 400);
  }

  // conflit : créneau déjà réservé
  const conflict = reservations.find(
    (r) =>
      r.resourceId === resourceId &&
      r.date === date &&
      r.slot === slot
  );

  if (conflict) {
    return fakeDelay(null, true, 409);
  }

  const newReservation = {
    id: Date.now(),
    resourceId,
    date,
    slot,
  };

  reservations.push(newReservation);

  return fakeDelay(newReservation, false, 201);
}

// GET /resources/{id}/reservations
export function getReservationsByResource(resourceId) {
  const data = reservations.filter((r) => r.resourceId === resourceId);
  return fakeDelay(data);
}

// GET /reservations/{id}
export function getReservationById(id) {
  const reservation = reservations.find((r) => r.id === id);

  if (!reservation) {
    return fakeDelay(null, true, 404);
  }

  return fakeDelay(reservation);
}

// DELETE /reservations/{id}
export function cancelReservation(id) {
  const index = reservations.findIndex((r) => r.id === id);

  if (index === -1) {
    return fakeDelay(null, true, 404);
  }

  reservations.splice(index, 1);
  return fakeDelay(null, false, 204);
}
