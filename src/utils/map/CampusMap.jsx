import {
    GoogleMap,
    Marker,
    Circle,
    Autocomplete,
  } from "@react-google-maps/api";
  import { useRef, useEffect, useCallback } from "react";
  
  const containerStyle = {
    width: "100%",
    height: "400px",
  };
  
  export default function CampusLocationMap({
    location,
    radius,
    onLocationChange,
  }) {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const circleRef = useRef(null);
    const autoCompleteRef = useRef(null);
  
    /* ---------------- LOAD ---------------- */
  
    const onMapLoad = (map) => {
      mapRef.current = map;
    };
  
    const onCircleLoad = (circle) => {
        circleRef.current = circle;
        circle.setCenter(location);
        circle.setRadius(radius);
      };
      
      const onMarkerLoad = (marker) => {
        markerRef.current = marker;
        marker.setPosition(location);
      };
      
      useEffect(() => {
        if (circleRef.current) {
          circleRef.current.setCenter(location);
          circleRef.current.setRadius(radius);
        }
      
        if (markerRef.current) {
          markerRef.current.setPosition(location);
        }
      }, [location.lat, location.lng, radius]);
      
  
    /* ---------------- HELPERS ---------------- */
  
    const updateLocation = useCallback(
      (lat, lng) => {
        onLocationChange({
          ...location,
          lat,
          lng,
        });
      },
      [location, onLocationChange]
    );
  
    /* ---------------- EVENTS ---------------- */
  
    const handleMarkerDragEnd = (e) => {
        console.log("value",e)
      if (!e.latLng) return;
      updateLocation(e.latLng.lat(), e.latLng.lng());
    };
  
    const handleMapClick = (e) => {
        console.log("value",e)
      if (!e.latLng) return;
      updateLocation(e.latLng.lat(), e.latLng.lng());
    };
  
    const onPlaceChanged = () => {
      const place = autoCompleteRef.current?.getPlace();
      if (!place?.geometry?.location) return;
  
      updateLocation(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
    };
  
    return (
      <div className="space-y-3">
        {/* Search */}
        <Autocomplete
          onLoad={(ref) => (autoCompleteRef.current = ref)}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type="text"
            placeholder="Search campus or landmark"
            className="w-full px-3 py-2 border rounded"
          />
        </Autocomplete>
  
        {/* Map */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location}
          zoom={17}
          onLoad={onMapLoad}
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            fullscreenControl: false,
          }}
        >
          {/* Marker (render once) */}
          <Marker
            onLoad={onMarkerLoad}
            draggable
            onDragEnd={handleMarkerDragEnd}
          />
  
          {/* Circle (render ONCE, never re-render) */}
          <Circle
            onLoad={onCircleLoad}
            options={{
              fillColor: "#2563eb",
              fillOpacity: 0.2,
              strokeColor: "#2563eb",
              strokeOpacity: 0.6,
              strokeWeight: 2,
              clickable: false,
            }}
          />
        </GoogleMap>
      </div>
    );
  }
  