import { useModelsNBStore } from "../../stores/models-nb";

function ModelsNBBaseUrlInput() {
  const { baseUrlValue, setBaseUrl } = useModelsNBStore();

  return (
    <div className="w-full mb-4">
      <label className="flex gap-4 items-center">
        <span className="text-sm">Models NB Base URL:</span>
        <input
          type="text"
          className="bg-white rounded text-sm"
          value={baseUrlValue}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
      </label>
    </div>
  );
}

export default ModelsNBBaseUrlInput;
