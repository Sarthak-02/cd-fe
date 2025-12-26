import { LoadScript } from "@react-google-maps/api";

const libraries = ["places"];

export function GoogleMapsProvider({
  children,
}) {
    // console.log("children",children,import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      {children}
    </LoadScript>
  );
}
