import { useState } from "react";
import CampusLocationMap from "../../utils/map/CampusMap";

export default function CampusLocation({ formData, setFormData }) {
  const [location, setLocation] = useState({
    lat: formData?.campus_latitude,
    lng: formData?.campus_longitude,
  });

  const [radius, setRadius] = useState(100);
  function handleConfirmLocation() {
    setFormData((prev) => ({
      ...prev,
      campus_latitude: location.lat,
      campus_longitude: location.lng,
      campus_radius: radius,
      campus_show_map: false,
    }));
  }
  return (
    <>
      <div className="space-y-4 border-t pt-6">
        <div>
          <h3 className="text-lg font-semibold">Confirm Campus Location</h3>
          <p className="text-sm text-gray-500">
            Adjust the marker and radius to match the campus boundary.
          </p>
        </div>

        <CampusLocationMap
          location={location}
          radius={radius}
          onLocationChange={({ lat, lng }) =>
            setLocation({ ...formData, lat, lng })
          }
        />

        <div>
          <label className="text-sm font-medium">Campus Radius</label>
          <input
            type="range"
            min={50}
            max={500}
            step={10}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-sm text-gray-500">{radius} meters</p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded border"
            onClick={() =>
              setFormData((prev) => ({ ...prev, campus_show_map: false }))
            }
          >
            Back
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleConfirmLocation}
          >
            Confirm & Save
          </button>
        </div>
      </div>
    </>
  );
}
