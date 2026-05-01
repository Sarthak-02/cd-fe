import PriceTierPermissionsConfig from "../components/priceTierPermissions/PriceTierPermissionsConfig";

export default function PriceTierPermissions() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Price Tier Permissions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure which features are available for each pricing tier.
        </p>
      </div>
      <PriceTierPermissionsConfig />
    </div>
  );
}
