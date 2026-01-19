import { useEffect, useState } from "react";
import { getResources } from "../services/api";

function ResourcesList({ onSelectResource }) {
  const [state, setState] = useState("loading");
  const [resources, setResources] = useState([]);

  useEffect(() => {
    getResources()
      .then((data) => {
        if (!data || data.length === 0) {
          setState("empty");
        } else {
          setResources(data);
          setState("success");
        }
      })
      .catch(() => setState("error"));
  }, []);

  if (state === "loading")
    return <p className="message">Chargement en cours…</p>;

  if (state === "error")
    return (
      <p className="message">
        Impossible de charger les ressources. Veuillez réessayer plus tard.
      </p>
    );

  if (state === "empty")
    return <p className="message">Aucune ressource disponible.</p>;

  return (
    <ul>
      {resources.map((resource) => (
        <li key={resource.id} onClick={() => onSelectResource(resource)}>
          {resource.name}
        </li>
      ))}
    </ul>
  );
}

export default ResourcesList;
