import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export const CHART_CONFIG_DEFAULTS = {
  bar_chart: { orientation: "vertical", group_by: "skill", show_values: true },
  pie_chart: { segment_by: "rating_level", show_labels: true, show_legend: true },
  radar_chart: { fill: true, show_values: false },
  line_chart: { x_axis: "term", smooth: true, show_points: true },
  progress_rings: { size: "medium", show_percentage: true, show_skill_name: true },
  table: { columns: ["skill", "score", "grade", "teacher_comment"], sort_by: "skill", rows_per_page: 10 },
  heatmap: { rows: "class", columns: "skill" },
  gauge: {
    thresholds: [
      { value: 40, label: "Needs Work", color: "#ef4444" },
      { value: 70, label: "On Track", color: "#f97316" },
      { value: 100, label: "Excellent", color: "#22c55e" },
    ],
  },
  scatter_plot: { color_by: "class" },
  histogram: { bins: 10 },
};

const TABLE_COLUMNS = [
  { value: "skill", label: "Skill Name" },
  { value: "score", label: "Score" },
  { value: "grade", label: "Grade" },
  { value: "rating", label: "Rating" },
  { value: "teacher_comment", label: "Teacher Comment" },
  { value: "self_rating", label: "Self Rating" },
  { value: "date", label: "Date" },
];

const TABLE_SORT_OPTIONS = [
  { value: "skill", label: "Skill Name" },
  { value: "score_asc", label: "Score (Low → High)" },
  { value: "score_desc", label: "Score (High → Low)" },
  { value: "grade", label: "Grade" },
  { value: "date_desc", label: "Most Recent" },
];

const CHART_LABELS = {
  bar_chart: { label: "Bar Chart", icon: "📊" },
  pie_chart: { label: "Pie Chart", icon: "🥧" },
  radar_chart: { label: "Radar Chart", icon: "🕸️" },
  line_chart: { label: "Line Chart", icon: "📈" },
  progress_rings: { label: "Progress Rings", icon: "🔵" },
  table: { label: "Score Table", icon: "📋" },
  heatmap: { label: "Heatmap", icon: "🟥" },
  gauge: { label: "Gauge", icon: "🎯" },
  scatter_plot: { label: "Scatter Plot", icon: "✦" },
  histogram: { label: "Histogram", icon: "🏛️" },
};

function ToggleButton({ options, value, onChange }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 text-xs rounded-lg border transition font-medium ${
            value === o.value
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function MiniToggle({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        onClick={() => onChange(!value)}
        className={`relative w-8 h-4 rounded-full transition-colors ${value ? "bg-blue-600" : "bg-gray-200"}`}
      >
        <div
          className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </div>
      <span className="text-xs text-gray-600">{label}</span>
    </label>
  );
}

function ConfigLabel({ children }) {
  return <p className="text-xs font-medium text-gray-500 mb-1.5">{children}</p>;
}

function ChartFields({ type, config, onChange }) {
  function set(key, val) {
    onChange({ ...config, [key]: val });
  }

  if (type === "table") {
    const columns = config.columns || [];
    return (
      <div className="space-y-4">
        <div>
          <ConfigLabel>Columns to show</ConfigLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TABLE_COLUMNS.map((col) => {
              const active = columns.includes(col.value);
              return (
                <button
                  key={col.value}
                  type="button"
                  onClick={() =>
                    set(
                      "columns",
                      active ? columns.filter((c) => c !== col.value) : [...columns, col.value]
                    )
                  }
                  className={`text-xs px-3 py-2 rounded-lg border text-left transition ${
                    active
                      ? "bg-blue-50 border-blue-400 text-blue-700"
                      : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {active ? "✓ " : ""}{col.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <ConfigLabel>Sort by</ConfigLabel>
            <select
              value={config.sort_by || "skill"}
              onChange={(e) => set("sort_by", e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TABLE_SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <ConfigLabel>Rows per page</ConfigLabel>
            <ToggleButton
              options={[5, 10, 20, 50].map((n) => ({ value: n, label: String(n) }))}
              value={config.rows_per_page || 10}
              onChange={(v) => set("rows_per_page", v)}
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === "bar_chart") {
    return (
      <div className="space-y-4">
        <div>
          <ConfigLabel>Orientation</ConfigLabel>
          <ToggleButton
            options={[{ value: "vertical", label: "Vertical" }, { value: "horizontal", label: "Horizontal" }]}
            value={config.orientation || "vertical"}
            onChange={(v) => set("orientation", v)}
          />
        </div>
        <div>
          <ConfigLabel>Group by</ConfigLabel>
          <ToggleButton
            options={[
              { value: "skill", label: "Skill" },
              { value: "class", label: "Class" },
              { value: "time_period", label: "Time Period" },
            ]}
            value={config.group_by || "skill"}
            onChange={(v) => set("group_by", v)}
          />
        </div>
        <MiniToggle label="Show values on bars" value={config.show_values ?? true} onChange={(v) => set("show_values", v)} />
      </div>
    );
  }

  if (type === "pie_chart") {
    return (
      <div className="space-y-4">
        <div>
          <ConfigLabel>Segment by</ConfigLabel>
          <ToggleButton
            options={[
              { value: "rating_level", label: "Rating Level" },
              { value: "skill", label: "Skill" },
              { value: "class", label: "Class" },
            ]}
            value={config.segment_by || "rating_level"}
            onChange={(v) => set("segment_by", v)}
          />
        </div>
        <div className="flex gap-6">
          <MiniToggle label="Show labels" value={config.show_labels ?? true} onChange={(v) => set("show_labels", v)} />
          <MiniToggle label="Show legend" value={config.show_legend ?? true} onChange={(v) => set("show_legend", v)} />
        </div>
      </div>
    );
  }

  if (type === "radar_chart") {
    return (
      <div className="flex gap-6">
        <MiniToggle label="Fill area" value={config.fill ?? true} onChange={(v) => set("fill", v)} />
        <MiniToggle label="Show values" value={config.show_values ?? false} onChange={(v) => set("show_values", v)} />
      </div>
    );
  }

  if (type === "line_chart") {
    return (
      <div className="space-y-4">
        <div>
          <ConfigLabel>X Axis (time period)</ConfigLabel>
          <ToggleButton
            options={[
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
              { value: "term", label: "Term" },
              { value: "year", label: "Year" },
            ]}
            value={config.x_axis || "term"}
            onChange={(v) => set("x_axis", v)}
          />
        </div>
        <div className="flex gap-6">
          <MiniToggle label="Smooth curve" value={config.smooth ?? true} onChange={(v) => set("smooth", v)} />
          <MiniToggle label="Show data points" value={config.show_points ?? true} onChange={(v) => set("show_points", v)} />
        </div>
      </div>
    );
  }

  if (type === "progress_rings") {
    return (
      <div className="space-y-4">
        <div>
          <ConfigLabel>Ring size</ConfigLabel>
          <ToggleButton
            options={[
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
            ]}
            value={config.size || "medium"}
            onChange={(v) => set("size", v)}
          />
        </div>
        <div className="flex gap-6">
          <MiniToggle label="Show percentage" value={config.show_percentage ?? true} onChange={(v) => set("show_percentage", v)} />
          <MiniToggle label="Show skill name" value={config.show_skill_name ?? true} onChange={(v) => set("show_skill_name", v)} />
        </div>
      </div>
    );
  }

  if (type === "heatmap") {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <ConfigLabel>Rows</ConfigLabel>
          <ToggleButton
            options={[{ value: "class", label: "Class" }, { value: "student", label: "Student" }]}
            value={config.rows || "class"}
            onChange={(v) => set("rows", v)}
          />
        </div>
        <div>
          <ConfigLabel>Columns</ConfigLabel>
          <ToggleButton
            options={[{ value: "skill", label: "Skill" }, { value: "time_period", label: "Time Period" }]}
            value={config.columns || "skill"}
            onChange={(v) => set("columns", v)}
          />
        </div>
      </div>
    );
  }

  if (type === "gauge") {
    const thresholds = config.thresholds || CHART_CONFIG_DEFAULTS.gauge.thresholds;
    return (
      <div className="space-y-2">
        <ConfigLabel>Performance thresholds</ConfigLabel>
        {thresholds.map((t, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="color"
              value={t.color}
              onChange={(e) => {
                const next = thresholds.map((th, j) => j === i ? { ...th, color: e.target.value } : th);
                set("thresholds", next);
              }}
              className="w-7 h-7 rounded border border-gray-200 cursor-pointer flex-shrink-0"
            />
            <input
              type="text"
              value={t.label}
              placeholder="Label"
              onChange={(e) => {
                const next = thresholds.map((th, j) => j === i ? { ...th, label: e.target.value } : th);
                set("thresholds", next);
              }}
              className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-400 flex-shrink-0">up to</span>
            <input
              type="number"
              value={t.value}
              onChange={(e) => {
                const next = thresholds.map((th, j) => j === i ? { ...th, value: Number(e.target.value) } : th);
                set("thresholds", next);
              }}
              className="w-16 text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
    );
  }

  if (type === "scatter_plot") {
    return (
      <div>
        <ConfigLabel>Color by</ConfigLabel>
        <ToggleButton
          options={[
            { value: "class", label: "Class" },
            { value: "rating_level", label: "Rating Level" },
          ]}
          value={config.color_by || "class"}
          onChange={(v) => set("color_by", v)}
        />
      </div>
    );
  }

  if (type === "histogram") {
    return (
      <div>
        <ConfigLabel>Number of bins</ConfigLabel>
        <ToggleButton
          options={[{ value: 5, label: "5" }, { value: 10, label: "10" }, { value: 20, label: "20" }]}
          value={config.bins || 10}
          onChange={(v) => set("bins", v)}
        />
      </div>
    );
  }

  return null;
}

export default function ChartConfigPanel({ charts, chartConfigs, onChange }) {
  const [openPanels, setOpenPanels] = useState({});

  if (charts.length === 0) return null;

  function togglePanel(type) {
    setOpenPanels((p) => ({ ...p, [type]: !p[type] }));
  }

  function updateConfig(type, config) {
    onChange({ ...chartConfigs, [type]: config });
  }

  return (
    <div className="space-y-2 mt-4">
      <p className="text-xs font-medium text-gray-500 mb-3">Configure selected charts</p>
      {charts.map((type) => {
        const meta = CHART_LABELS[type] || { label: type, icon: "📊" };
        const config = chartConfigs?.[type] || CHART_CONFIG_DEFAULTS[type] || {};
        const isOpen = !!openPanels[type];

        return (
          <div key={type} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => togglePanel(type)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition text-left"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span>{meta.icon}</span>
                {meta.label}
              </span>
              {isOpen ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
            </button>
            {isOpen && (
              <div className="p-4 bg-white">
                <ChartFields
                  type={type}
                  config={config}
                  onChange={(updated) => updateConfig(type, updated)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
