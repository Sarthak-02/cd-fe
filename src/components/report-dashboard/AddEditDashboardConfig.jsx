import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import Button from "../../ui-components/Button";
import CheckBox from "../../ui-components/CheckBox";
import TextField from "../../ui-components/TextField";
import { useReportDashboardStore } from "../../store/report-dashboard.store";
import { MODE } from "../../utils/constants/globalConstants";
import SkillsBuilder from "./SkillsBuilder";
import RatingScaleBuilder from "./RatingScaleBuilder";
import JsonPreview from "./JsonPreview";

const SCHOOL_LEVELS = [
  { value: "kindergarten", label: "Kindergarten" },
  { value: "primary", label: "Primary" },
  { value: "middle", label: "Middle School" },
  { value: "secondary", label: "Secondary" },
  { value: "higher_secondary", label: "Higher Secondary" },
  { value: "graduation", label: "Graduation" },
  { value: "post_graduation", label: "Post Graduation" },
];

const EMPTY_CONFIG = {
  config_name: "",
  config_description: "",
  school_level: "primary",
  status: "draft",
  use_grades: false,
  enabled_classes: [],
  skills: [],
  rating_scale: {
    type: "stars",
    points: 5,
    labels: [
      { value: 1, label: "Needs Support", color: "#ef4444" },
      { value: 2, label: "Developing", color: "#f97316" },
      { value: 3, label: "Proficient", color: "#22c55e" },
      { value: 4, label: "Exceeding", color: "#3b82f6" },
      { value: 5, label: "Outstanding", color: "#8b5cf6" },
    ],
    emoji_set: ["😢", "😐", "🙂", "😊", "🌟"],
    numeric_min: 1,
    numeric_max: 10,
  },
  display: {
    layout: "grid",
    show_teacher_comments: true,
    charts: [],
  },
};

const CHART_TYPES = [
  { value: "bar_chart",      label: "Bar Chart",      icon: "📊", description: "Compare scores across skills side by side" },
  { value: "pie_chart",      label: "Pie Chart",      icon: "🥧", description: "Show distribution of rating levels" },
  { value: "radar_chart",    label: "Radar Chart",    icon: "🕸️", description: "Skill coverage overview in a spider web" },
  { value: "line_chart",     label: "Line Chart",     icon: "📈", description: "Track progress over time" },
  { value: "progress_rings", label: "Progress Rings", icon: "🔵", description: "Circular progress indicator per skill" },
  { value: "table",          label: "Score Table",    icon: "📋", description: "Detailed tabular breakdown of all scores" },
  { value: "heatmap",        label: "Heatmap",        icon: "🟥", description: "Performance grid across classes and skills" },
  { value: "gauge",          label: "Gauge",          icon: "🎯", description: "Single-value dial for overall performance" },
  { value: "scatter_plot",   label: "Scatter Plot",   icon: "✦",  description: "Correlation between two skills or metrics" },
  { value: "histogram",      label: "Histogram",      icon: "🏛️", description: "Frequency distribution of scores" },
];

const GROUP_BY_OPTIONS = [
  { value: "subjects", label: "Subjects", description: "Group data by subject areas" },
  { value: "exams",    label: "Exams",    description: "Group data by exam / assessment events" },
  { value: "skills",   label: "Skills",   description: "Group data by individual skills" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

function sid() {
  return `skill_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function makeCharts(types, groupBy) {
  return types.map((type) => ({
    type,
    group_by: [...groupBy],
    ...(type === "bar_chart" ? { orientation: "vertical" } : {}),
  }));
}

function makeLevelDefaults(level) {
  const map = {
    kindergarten: {
      use_grades: false,
      skills: [
        { skill_id: sid(), label: "Color Recognition", category: "creative", icon: "🎨" },
        { skill_id: sid(), label: "Shape Identification", category: "academic", icon: "🔷" },
        { skill_id: sid(), label: "Number Recognition", category: "academic", icon: "🔢" },
        { skill_id: sid(), label: "Social Play", category: "social_emotional", icon: "🤝" },
        { skill_id: sid(), label: "Fine Motor Skills", category: "physical", icon: "✂️" },
      ],
      rating_scale: {
        type: "emoji", points: 3,
        emoji_set: ["😢", "🙂", "🌟"],
        labels: [
          { value: 1, label: "Needs Help", color: "#ef4444" },
          { value: 2, label: "Getting There", color: "#f97316" },
          { value: 3, label: "Super!", color: "#22c55e" },
        ],
        numeric_min: 1, numeric_max: 10,
      },
      display: {
        layout: "grid", show_teacher_comments: true,
        charts: makeCharts(["progress_rings", "bar_chart"], ["skills"]),
      },
    },
    primary: {
      use_grades: false,
      skills: [
        { skill_id: sid(), label: "Reading & Comprehension", category: "academic", icon: "📖" },
        { skill_id: sid(), label: "Writing", category: "academic", icon: "✏️" },
        { skill_id: sid(), label: "Mathematics", category: "academic", icon: "🔢" },
        { skill_id: sid(), label: "Teamwork", category: "social_emotional", icon: "🤝" },
        { skill_id: sid(), label: "Physical Education", category: "physical", icon: "⚽" },
      ],
      rating_scale: {
        type: "stars", points: 5,
        labels: [
          { value: 1, label: "Needs Support", color: "#ef4444" },
          { value: 2, label: "Developing", color: "#f97316" },
          { value: 3, label: "Proficient", color: "#22c55e" },
          { value: 4, label: "Exceeding", color: "#3b82f6" },
          { value: 5, label: "Outstanding", color: "#8b5cf6" },
        ],
        emoji_set: ["😢", "😐", "🙂", "😊", "🌟"],
        numeric_min: 1, numeric_max: 10,
      },
      display: {
        layout: "grid", show_teacher_comments: true,
        charts: makeCharts(["bar_chart", "progress_rings", "pie_chart"], ["skills"]),
      },
    },
    middle: {
      use_grades: false,
      skills: [
        { skill_id: sid(), label: "Language Arts", category: "academic", icon: "📝" },
        { skill_id: sid(), label: "Mathematics", category: "academic", icon: "📐" },
        { skill_id: sid(), label: "Science", category: "academic", icon: "🔬" },
        { skill_id: sid(), label: "Social Studies", category: "academic", icon: "🌍" },
        { skill_id: sid(), label: "Critical Thinking", category: "academic", icon: "💡" },
        { skill_id: sid(), label: "Collaboration", category: "social_emotional", icon: "🤝" },
      ],
      rating_scale: {
        type: "descriptive", points: 4,
        labels: [
          { value: 1, label: "Needs Improvement", color: "#ef4444" },
          { value: 2, label: "Approaching", color: "#f97316" },
          { value: 3, label: "Meeting", color: "#22c55e" },
          { value: 4, label: "Exceeding", color: "#3b82f6" },
        ],
        emoji_set: ["😢", "😐", "🙂", "😊"],
        numeric_min: 1, numeric_max: 10,
      },
      display: {
        layout: "list", show_teacher_comments: true,
        charts: makeCharts(["bar_chart", "radar_chart", "line_chart", "table"], ["subjects"]),
      },
    },
    secondary: {
      use_grades: true,
      skills: [
        { skill_id: sid(), label: "Mathematics", category: "academic", icon: "📐" },
        { skill_id: sid(), label: "Science", category: "academic", icon: "🔬" },
        { skill_id: sid(), label: "English", category: "academic", icon: "📝" },
        { skill_id: sid(), label: "Social Sciences", category: "academic", icon: "🌍" },
        { skill_id: sid(), label: "Research Skills", category: "academic", icon: "🔍" },
        { skill_id: sid(), label: "Leadership", category: "social_emotional", icon: "👑" },
      ],
      rating_scale: {
        type: "numeric", points: 5,
        labels: [],
        emoji_set: [],
        numeric_min: 0, numeric_max: 100,
      },
      display: {
        layout: "list", show_teacher_comments: true,
        charts: makeCharts(["bar_chart", "radar_chart", "line_chart", "table", "scatter_plot"], ["exams"]),
      },
    },
    higher_secondary: {
      use_grades: true,
      skills: [
        { skill_id: sid(), label: "Core Subject Mastery", category: "academic", icon: "📚" },
        { skill_id: sid(), label: "Analytical Thinking", category: "academic", icon: "🧠" },
        { skill_id: sid(), label: "Research & Projects", category: "academic", icon: "🔍" },
        { skill_id: sid(), label: "Communication", category: "social_emotional", icon: "💬" },
        { skill_id: sid(), label: "Problem Solving", category: "academic", icon: "💡" },
      ],
      rating_scale: {
        type: "numeric", points: 5,
        labels: [],
        emoji_set: [],
        numeric_min: 0, numeric_max: 100,
      },
      display: {
        layout: "list", show_teacher_comments: true,
        charts: makeCharts(["bar_chart", "radar_chart", "line_chart", "table", "scatter_plot", "heatmap"], ["exams"]),
      },
    },
    graduation: {
      use_grades: true,
      skills: [
        { skill_id: sid(), label: "Domain Knowledge", category: "academic", icon: "🎓" },
        { skill_id: sid(), label: "Research & Analysis", category: "academic", icon: "🔬" },
        { skill_id: sid(), label: "Practical Application", category: "academic", icon: "⚙️" },
        { skill_id: sid(), label: "Communication", category: "social_emotional", icon: "💬" },
        { skill_id: sid(), label: "Teamwork & Leadership", category: "social_emotional", icon: "🤝" },
      ],
      rating_scale: {
        type: "descriptive", points: 5,
        labels: [
          { value: 1, label: "Unsatisfactory", color: "#ef4444" },
          { value: 2, label: "Satisfactory", color: "#f97316" },
          { value: 3, label: "Good", color: "#22c55e" },
          { value: 4, label: "Very Good", color: "#3b82f6" },
          { value: 5, label: "Excellent", color: "#8b5cf6" },
        ],
        emoji_set: ["😢", "😐", "🙂", "😊", "🌟"],
        numeric_min: 1, numeric_max: 10,
      },
      display: {
        layout: "list", show_teacher_comments: true,
        charts: makeCharts(["bar_chart", "radar_chart", "line_chart", "table", "gauge"], ["exams"]),
      },
    },
    post_graduation: {
      use_grades: true,
      skills: [
        { skill_id: sid(), label: "Advanced Research", category: "academic", icon: "🔬" },
        { skill_id: sid(), label: "Thesis / Dissertation", category: "academic", icon: "📜" },
        { skill_id: sid(), label: "Subject Expertise", category: "academic", icon: "🎓" },
        { skill_id: sid(), label: "Publication & Presentation", category: "academic", icon: "📊" },
        { skill_id: sid(), label: "Mentorship", category: "social_emotional", icon: "👨‍🏫" },
      ],
      rating_scale: {
        type: "descriptive", points: 4,
        labels: [
          { value: 1, label: "Insufficient", color: "#ef4444" },
          { value: 2, label: "Adequate", color: "#f97316" },
          { value: 3, label: "Competent", color: "#22c55e" },
          { value: 4, label: "Distinguished", color: "#8b5cf6" },
        ],
        emoji_set: ["😢", "😐", "🙂", "😊"],
        numeric_min: 1, numeric_max: 10,
      },
      display: {
        layout: "list", show_teacher_comments: true,
        charts: makeCharts(["radar_chart", "table", "scatter_plot", "histogram", "gauge"], ["exams"]),
      },
    },
  };
  return map[level] ?? map.primary;
}

export default function AddEditDashboardConfig({
  mode,
  selectedConfig,
  campus_id,
  campusClasses,
  handleAddEditModel,
}) {
  const [formData, setFormData] = useState(EMPTY_CONFIG);
  const [errors, setErrors] = useState({});
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [chartModal, setChartModal] = useState(null);

  const {
    configDetails,
    loadingConfigDetails,
    fetchConfigDetails,
    createConfig,
    updateConfig,
  } = useReportDashboardStore();

  useEffect(() => {
    if (mode === MODE.EDIT && selectedConfig) {
      fetchConfigDetails(selectedConfig);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selectedConfig]);

  useEffect(() => {
    if (mode === MODE.EDIT && configDetails) {
      setFormData({
        ...EMPTY_CONFIG,
        ...configDetails,
        rating_scale: { ...EMPTY_CONFIG.rating_scale, ...configDetails.rating_scale },
        display: { ...EMPTY_CONFIG.display, ...configDetails.display },
      });
    }
  }, [configDetails, mode]);

  function validate() {
    const errs = {};
    if (!formData.config_name.trim()) errs.config_name = "Config name is required";
    if (!formData.use_grades && formData.skills.length === 0) errs.skills = "Add at least one skill";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...formData, campus_id, updated_at: new Date().toISOString() };
      if (mode === MODE.CREATE) {
        payload.config_id = `config_${Date.now()}`;
        payload.created_at = new Date().toISOString();
        await createConfig(payload);
      } else {
        payload.config_id = selectedConfig;
        await updateConfig(payload);
      }
      handleAddEditModel(MODE.NONE);
    } catch {
      // error displayed via store
    } finally {
      setSaving(false);
    }
  }

  function toggleClass(class_id) {
    setFormData((prev) => ({
      ...prev,
      enabled_classes: prev.enabled_classes.includes(class_id)
        ? prev.enabled_classes.filter((id) => id !== class_id)
        : [...prev.enabled_classes, class_id],
    }));
  }

  function toggleAllClasses(checked) {
    setFormData((prev) => ({
      ...prev,
      enabled_classes: checked ? campusClasses.map((c) => c.class_id) : [],
    }));
  }

  function handleLevelChange(level) {
    const defaults = makeLevelDefaults(level);
    setFormData((p) => ({
      ...p,
      school_level: level,
      use_grades: defaults.use_grades,
      skills: defaults.skills,
      rating_scale: defaults.rating_scale,
      display: defaults.display,
    }));
    setErrors((p) => ({ ...p, skills: "" }));
  }

  function isChartActive(chartType) {
    return formData.display.charts.some((c) => c.type === chartType);
  }

  function getChartGroupBy(chartType) {
    return formData.display.charts.find((c) => c.type === chartType)?.group_by ?? [];
  }

  function handleChartClick(chartType) {
    if (!isChartActive(chartType)) {
      const newChart = { type: chartType, group_by: [] };
      if (chartType === "bar_chart") newChart.orientation = "vertical";
      setFormData((p) => ({
        ...p,
        display: {
          ...p.display,
          charts: [...p.display.charts, newChart],
        },
      }));
    }
    setChartModal(chartType);
  }

  function handleChartOptionChange(chartType, optionKey, optionValue) {
    setFormData((p) => ({
      ...p,
      display: {
        ...p.display,
        charts: p.display.charts.map((c) =>
          c.type === chartType ? { ...c, [optionKey]: optionValue } : c
        ),
      },
    }));
  }

  function handleRemoveChart(chartType) {
    setFormData((p) => ({
      ...p,
      display: {
        ...p.display,
        charts: p.display.charts.filter((c) => c.type !== chartType),
      },
    }));
    if (chartModal === chartType) setChartModal(null);
  }

  function handleChartGroupByToggle(chartType, groupByValue) {
    setFormData((p) => ({
      ...p,
      display: {
        ...p.display,
        charts: p.display.charts.map((c) =>
          c.type === chartType
            ? {
                ...c,
                group_by: c.group_by.includes(groupByValue)
                  ? c.group_by.filter((g) => g !== groupByValue)
                  : [...c.group_by, groupByValue],
              }
            : c
        ),
      },
    }));
  }

  const activeChartType = CHART_TYPES.find((c) => c.value === chartModal);

  const generatedJson = {
    config_id: mode === MODE.EDIT ? selectedConfig : "(generated on save)",
    config_name: formData.config_name,
    config_description: formData.config_description,
    campus_id,
    school_level: formData.school_level,
    status: formData.status,
    enabled_classes: formData.enabled_classes,
    skills: formData.skills,
    rating_scale: formData.rating_scale,
    display: formData.display,
    created_at: formData.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (loadingConfigDetails) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Loading config...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === MODE.CREATE ? "Create Dashboard Config" : "Edit Dashboard Config"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure how the student-facing dashboard renders for this campus
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleAddEditModel(MODE.NONE)}
          className="p-2 rounded-full hover:bg-gray-100 transition text-gray-500"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Section 1: Basic Info */}
        <ConfigSection title="Basic Information">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6">
              <FieldLabel label="Config Name" required />
              <TextField
                value={formData.config_name}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, config_name: e.target.value }));
                  setErrors((p) => ({ ...p, config_name: "" }));
                }}
                placeholder="e.g. Primary Grade 1–3 Dashboard"
                variant={errors.config_name ? "error" : "default"}
              />
              {errors.config_name && (
                <p className="text-red-500 text-xs mt-1">{errors.config_name}</p>
              )}
            </div>

            <div className="col-span-12">
              <FieldLabel label="School Level" required />
              <div className="flex flex-wrap gap-2 mt-1">
                {SCHOOL_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => handleLevelChange(level.value)}
                    className={`text-xs px-3 py-2 rounded-xl border transition font-medium ${
                      formData.school_level === level.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Switching level resets Skills, Rating Scale, and Display Settings to suggested defaults.
              </p>
            </div>

            <div className="col-span-12 md:col-span-6">
              <FieldLabel label="Status" />
              <div className="flex gap-1.5">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, status: s.value }))}
                    className={`flex-1 text-xs py-2 rounded-xl border transition font-medium ${
                      formData.status === s.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-12">
              <CheckBox
                checked={formData.use_grades}
                onChange={(val) => {
                  setFormData((p) => ({ ...p, use_grades: val }));
                  if (val) setErrors((p) => ({ ...p, skills: "" }));
                }}
                title="Show grades instead of skill ratings"
                description="Dashboard will display subject marks/grades. Skills and rating scale are not applicable."
              />
            </div>

            <div className="col-span-12">
              <FieldLabel label="Description (optional)" />
              <textarea
                value={formData.config_description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, config_description: e.target.value }))
                }
                placeholder="Describe what this dashboard configuration is for..."
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </ConfigSection>

        {/* Section 2: Skills */}
        {!formData.use_grades && (
          <ConfigSection
            title="Skills to Rate"
            description="Define which skills students will be assessed on"
          >
            {errors.skills && (
              <p className="text-red-500 text-sm mb-3">{errors.skills}</p>
            )}
            <SkillsBuilder
              skills={formData.skills}
              onChange={(skills) => {
                setFormData((p) => ({ ...p, skills }));
                setErrors((p) => ({ ...p, skills: "" }));
              }}
            />
          </ConfigSection>
        )}

        {/* Section 3: Rating Scale */}
        {!formData.use_grades && (
          <ConfigSection
            title="Rating Scale"
            description="How students will be scored on each skill"
          >
            <RatingScaleBuilder
              ratingScale={formData.rating_scale}
              onChange={(rating_scale) => setFormData((p) => ({ ...p, rating_scale }))}
            />
          </ConfigSection>
        )}

        {/* Section 4: Enabled Classes */}
        <ConfigSection
          title="Enabled Classes"
          description="Which classes will see this dashboard config"
        >
          {campusClasses.length === 0 ? (
            <p className="text-sm text-gray-400">
              No classes found for this campus. Create classes first, then come back to enable them here.
            </p>
          ) : (
            <>
              <div className="mb-4">
                <CheckBox
                  checked={
                    campusClasses.length > 0 &&
                    formData.enabled_classes.length === campusClasses.length
                  }
                  onChange={toggleAllClasses}
                  title="Enable for all classes"
                  description={`${formData.enabled_classes.length} of ${campusClasses.length} selected`}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {campusClasses.map((cls) => {
                  const enabled = formData.enabled_classes.includes(cls.class_id);
                  return (
                    <button
                      key={cls.class_id}
                      type="button"
                      onClick={() => toggleClass(cls.class_id)}
                      className={`p-3 rounded-xl border text-left transition ${
                        enabled
                          ? "bg-blue-50 border-blue-400 text-blue-700 shadow-sm"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-sm font-semibold">{cls.class_name}</div>
                      <div className="text-xs text-gray-400 mt-0.5 truncate">{cls.class_id}</div>
                      <div className={`text-xs mt-1 font-medium ${enabled ? "text-blue-500" : "text-gray-300"}`}>
                        {enabled ? "✓ Enabled" : "Disabled"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </ConfigSection>

        {/* Section 5: Display Settings */}
        <ConfigSection
          title="Display Settings"
          description="Customize the visual presentation for students"
        >
          <div className="space-y-6">
            {/* Layout */}
            <div>
              <FieldLabel label="Card Layout" />
              <div className="flex gap-3 mt-2">
                {["grid", "list"].map((layout) => (
                  <button
                    key={layout}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        display: { ...p.display, layout },
                      }))
                    }
                    className={`px-6 py-2 rounded-xl border text-sm capitalize transition font-medium ${
                      formData.display.layout === layout
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {layout}
                  </button>
                ))}
              </div>
            </div>

            {/* Visualizations */}
            <div>
              <FieldLabel label="Visualizations" />
              <p className="text-xs text-gray-400 mb-3">
                Select a chart to add it and configure how its data is grouped. {formData.display.charts.length} selected.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {CHART_TYPES.map((chart) => {
                  const active = isChartActive(chart.value);
                  const groupBy = getChartGroupBy(chart.value);
                  return (
                    <div key={chart.value} className="relative group">
                      <button
                        type="button"
                        title={chart.description}
                        onClick={() => handleChartClick(chart.value)}
                        className={`w-full flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition ${
                          active
                            ? "bg-blue-50 border-blue-400 text-blue-700 shadow-sm"
                            : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-xl">{chart.icon}</span>
                        <span className="text-xs font-medium leading-tight">{chart.label}</span>
                        {active && groupBy.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-1 mt-0.5">
                            {groupBy.map((g) => (
                              <span key={g} className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-semibold capitalize">
                                {g}
                              </span>
                            ))}
                            {chart.value === "bar_chart" && (() => {
                              const orientation = formData.display.charts.find((c) => c.type === "bar_chart")?.orientation ?? "vertical";
                              return (
                                <span className="text-[9px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full font-semibold capitalize">
                                  {orientation}
                                </span>
                              );
                            })()}
                          </div>
                        )}
                        {active && groupBy.length === 0 && (
                          <span className="text-[10px] text-amber-500 font-semibold">⚠ Configure</span>
                        )}
                      </button>
                      {active && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleRemoveChart(chart.value); }}
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gray-500 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          title="Remove chart"
                        >
                          <X size={9} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <CheckBox
                checked={formData.display.show_teacher_comments}
                onChange={(val) =>
                  setFormData((p) => ({
                    ...p,
                    display: { ...p.display, show_teacher_comments: val },
                  }))
                }
                title="Show Teacher Comments"
                description="Allow teachers to leave comments visible to students and parents"
              />
            </div>
          </div>
        </ConfigSection>

        {/* Section 6: JSON Preview */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowJsonPreview((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition"
          >
            <span>Preview Generated JSON</span>
            {showJsonPreview ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {showJsonPreview && (
            <div className="p-4">
              <p className="text-xs text-gray-400 mb-3">
                This JSON will be consumed by the student-facing application to render the dashboard.
              </p>
              <JsonPreview data={generatedJson} />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] p-3 flex justify-end gap-3 z-10">
        <Button variant="secondary" onClick={() => handleAddEditModel(MODE.NONE)}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving…" : mode === MODE.CREATE ? "Create Config" : "Save Changes"}
        </Button>
      </div>

      {/* Chart Group-By Modal */}
      {chartModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setChartModal(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-80 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">{activeChartType?.icon}</span>
                <h3 className="text-base font-semibold text-gray-900">{activeChartType?.label}</h3>
              </div>
              <button
                type="button"
                onClick={() => setChartModal(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 transition"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Select one or more ways to group data for this chart.
            </p>

            <div className="space-y-2">
              {GROUP_BY_OPTIONS.map((opt) => {
                const checked = getChartGroupBy(chartModal).includes(opt.value);
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      checked
                        ? "bg-blue-50 border-blue-400"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleChartGroupByToggle(chartModal, opt.value)}
                      className="w-4 h-4 rounded accent-blue-600 shrink-0"
                    />
                    <div>
                      <div className={`text-sm font-medium ${checked ? "text-blue-700" : "text-gray-700"}`}>
                        {opt.label}
                      </div>
                      <div className="text-xs text-gray-400">{opt.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Chart-specific options */}
            {chartModal === "bar_chart" && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Chart Options</p>
                <p className="text-sm font-medium text-gray-700 mb-2">Orientation</p>
                <div className="flex gap-2">
                  {[
                    { value: "vertical",   label: "Vertical",   icon: "📊" },
                    { value: "horizontal", label: "Horizontal", icon: "📉" },
                  ].map((opt) => {
                    const current = formData.display.charts.find((c) => c.type === "bar_chart")?.orientation ?? "vertical";
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleChartOptionChange("bar_chart", "orientation", opt.value)}
                        className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs transition font-medium ${
                          current === opt.value
                            ? "bg-purple-50 border-purple-400 text-purple-700"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-base">{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleRemoveChart(chartModal)}
                className="text-sm text-red-500 hover:text-red-600 font-medium transition"
              >
                Remove chart
              </button>
              <Button onClick={() => setChartModal(null)}>Done</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfigSection({ title, description, children }) {
  return (
    <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function FieldLabel({ label, required }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}
