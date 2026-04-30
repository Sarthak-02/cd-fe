const SCALE_TYPES = [
  { value: "stars", label: "⭐ Stars", description: "Classic star rating" },
  { value: "numeric", label: "🔢 Numeric", description: "Custom number range" },
  { value: "descriptive", label: "📝 Descriptive", description: "Named levels" },
  { value: "emoji", label: "😊 Emoji", description: "Fun emoji scale" },
];

const POINT_OPTIONS = [3, 4, 5];

const DEFAULT_LABELS = {
  3: [
    { value: 1, label: "Needs Support", color: "#ef4444" },
    { value: 2, label: "Getting There", color: "#f97316" },
    { value: 3, label: "Got It!", color: "#22c55e" },
  ],
  4: [
    { value: 1, label: "Needs Support", color: "#ef4444" },
    { value: 2, label: "Developing", color: "#f97316" },
    { value: 3, label: "Proficient", color: "#22c55e" },
    { value: 4, label: "Exceeding", color: "#3b82f6" },
  ],
  5: [
    { value: 1, label: "Needs Support", color: "#ef4444" },
    { value: 2, label: "Developing", color: "#f97316" },
    { value: 3, label: "Proficient", color: "#22c55e" },
    { value: 4, label: "Exceeding", color: "#3b82f6" },
    { value: 5, label: "Outstanding", color: "#8b5cf6" },
  ],
};

const DEFAULT_EMOJIS = {
  3: ["😔", "🙂", "🌟"],
  4: ["😔", "🙂", "😄", "🌟"],
  5: ["😢", "😐", "🙂", "😊", "🌟"],
};

export default function RatingScaleBuilder({ ratingScale, onChange }) {
  function update(key, value) {
    onChange({ ...ratingScale, [key]: value });
  }

  function handleTypeChange(type) {
    const points = ratingScale.points || 5;
    onChange({ ...ratingScale, type, labels: DEFAULT_LABELS[points], emoji_set: DEFAULT_EMOJIS[points] });
  }

  function handlePointsChange(points) {
    onChange({
      ...ratingScale,
      points,
      labels: DEFAULT_LABELS[points],
      emoji_set: DEFAULT_EMOJIS[points],
    });
  }

  function updateLabel(idx, field, value) {
    const labels = [...(ratingScale.labels || [])];
    labels[idx] = { ...labels[idx], [field]: value };
    onChange({ ...ratingScale, labels });
  }

  function updateEmoji(idx, value) {
    const emoji_set = [...(ratingScale.emoji_set || [])];
    emoji_set[idx] = value;
    onChange({ ...ratingScale, emoji_set });
  }

  const points = ratingScale.points || 5;

  return (
    <div className="space-y-5">
      {/* Type selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SCALE_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => handleTypeChange(type.value)}
            className={`p-3 rounded-xl border text-left transition ${
              ratingScale.type === type.value
                ? "border-blue-500 bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="text-sm font-semibold text-gray-800">{type.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{type.description}</div>
          </button>
        ))}
      </div>

      {/* Level count (not for numeric) */}
      {ratingScale.type !== "numeric" && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Number of levels</p>
          <div className="flex gap-2">
            {POINT_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handlePointsChange(n)}
                className={`w-12 h-12 rounded-xl border text-sm font-bold transition ${
                  points === n
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stars preview */}
      {ratingScale.type === "stars" && (
        <div>
          <p className="text-xs text-gray-500 mb-2">Preview:</p>
          <div className="flex gap-1.5 text-3xl">
            {[...Array(points)].map((_, i) => (
              <span key={i}>⭐</span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Students will see {points} stars to select from.</p>
        </div>
      )}

      {/* Numeric range */}
      {ratingScale.type === "numeric" && (
        <div className="flex items-end gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Min value</label>
            <input
              type="number"
              value={ratingScale.numeric_min ?? 1}
              onChange={(e) => update("numeric_min", parseInt(e.target.value, 10))}
              min={0}
              max={98}
              className="w-20 h-10 text-center border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <span className="text-gray-300 text-2xl pb-1">—</span>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Max value</label>
            <input
              type="number"
              value={ratingScale.numeric_max ?? 10}
              onChange={(e) => update("numeric_max", parseInt(e.target.value, 10))}
              min={2}
              max={100}
              className="w-20 h-10 text-center border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <p className="text-sm text-gray-400 pb-1.5">
            Score range: {ratingScale.numeric_min ?? 1} – {ratingScale.numeric_max ?? 10}
          </p>
        </div>
      )}

      {/* Descriptive labels */}
      {ratingScale.type === "descriptive" && (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">Customize label and color for each level:</p>
          {(ratingScale.labels || []).map((item, idx) => (
            <div key={item.value} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm"
                style={{ backgroundColor: item.color }}
              >
                {item.value}
              </div>
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateLabel(idx, "label", e.target.value)}
                placeholder={`Level ${item.value}`}
                className="flex-1 h-9 text-sm border border-gray-200 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-blue-400 min-w-0"
              />
              <input
                type="color"
                value={item.color}
                onChange={(e) => updateLabel(idx, "color", e.target.value)}
                className="w-9 h-9 rounded-xl border border-gray-200 cursor-pointer p-1 flex-shrink-0"
                title="Pick label color"
              />
            </div>
          ))}
          {/* Color band preview */}
          <div className="flex gap-1 rounded-xl overflow-hidden h-3 mt-1">
            {(ratingScale.labels || []).map((item) => (
              <div key={item.value} className="flex-1" style={{ backgroundColor: item.color }} />
            ))}
          </div>
          <div className="flex gap-1">
            {(ratingScale.labels || []).map((item) => (
              <p key={item.value} className="flex-1 text-center text-xs text-gray-500 truncate">
                {item.label}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Emoji scale */}
      {ratingScale.type === "emoji" && (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">Edit emoji for each level (paste or type an emoji):</p>
          <div className="flex gap-3 flex-wrap">
            {(ratingScale.emoji_set || []).map((emoji, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => updateEmoji(idx, e.target.value)}
                  className="w-16 h-16 text-4xl text-center bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <span className="text-xs text-gray-400">Level {idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
