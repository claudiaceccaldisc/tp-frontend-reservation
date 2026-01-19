import { useState } from "react";
import ResourcesList from "./pages/ResourcesList";
import ResourceAvailabilities from "./pages/ResourceAvailabilities";

function App() {
  const [selectedResource, setSelectedResource] = useState(null);

  return (
    <div className="container">
      <h1>Réservation de ressources</h1>

      {!selectedResource && (
        <ResourcesList onSelectResource={setSelectedResource} />
      )}

      {selectedResource && (
        <ResourceAvailabilities
          resource={selectedResource}
          onBack={() => setSelectedResource(null)}
        />
      )}
    </div>
  );
}

export default App;
