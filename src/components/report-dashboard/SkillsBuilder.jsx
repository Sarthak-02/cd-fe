import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import Button from "../../ui-components/Button";

const CATEGORIES = [
  { value: "academic", label: "Academic", pill: "bg-blue-100 text-blue-700" },
  { value: "social_emotional", label: "Social & Emotional", pill: "bg-purple-100 text-purple-700" },
  { value: "physical", label: "Physical", pill: "bg-green-100 text-green-700" },
  { value: "creative", label: "Creative", pill: "bg-orange-100 text-orange-700" },
];

const PRESET_GROUPS = {
  academic: [
    { icon: "📖", label: "Reading & Comprehension", category: "academic" },
    { icon: "✏️", label: "Writing", category: "academic" },
    { icon: "🔢", label: "Number Sense & Math", category: "academic" },
    { icon: "🔬", label: "Science Curiosity", category: "academic" },
    { icon: "🌍", label: "Environmental Awareness", category: "academic" },
  ],
  social_emotional: [
    { icon: "👂", label: "Listening & Following Instructions", category: "social_emotional" },
    { icon: "🤝", label: "Teamwork & Cooperation", category: "social_emotional" },
    { icon: "💬", label: "Communication Skills", category: "social_emotional" },
    { icon: "😊", label: "Self-Expression & Confidence", category: "social_emotional" },
    { icon: "💡", label: "Problem Solving", category: "social_emotional" },
  ],
  physical: [
    { icon: "🏃", label: "Gross Motor Skills", category: "physical" },
    { icon: "✂️", label: "Fine Motor Skills", category: "physical" },
    { icon: "🧘", label: "Focus & Attention", category: "physical" },
  ],
  creative: [
    { icon: "🎨", label: "Art & Creativity", category: "creative" },
    { icon: "🎵", label: "Music & Rhythm", category: "creative" },
    { icon: "🎭", label: "Drama & Role Play", category: "creative" },
  ],
};

const EMPTY_SKILL = { icon: "⭐", label: "", category: "academic" };

export default function SkillsBuilder({ skills, onChange }) {
  const [newSkill, setNewSkill] = useState(EMPTY_SKILL);

  function addSkill() {
    if (!newSkill.label.trim()) return;
    onChange([...skills, { id: `skill_${Date.now()}`, ...newSkill }]);
    setNewSkill(EMPTY_SKILL);
  }

  function removeSkill(id) {
    onChange(skills.filter((s) => s.id !== id));
  }

  function updateSkill(id, field, value) {
    onChange(skills.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  function addPresetGroup(groupKey) {
    const existing = new Set(skills.map((s) => s.label));
    const toAdd = PRESET_GROUPS[groupKey]
      .filter((p) => !existing.has(p.label))
      .map((p) => ({ id: `skill_${Date.now()}_${Math.random().toString(36).slice(2)}`, ...p }));
    if (toAdd.length > 0) onChange([...skills, ...toAdd]);
  }

  const cat = (value) => CATEGORIES.find((c) => c.value === value);

  return (
    <div className="space-y-4">
      {/* Preset quick-add */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Quick-add preset skill groups:</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(PRESET_GROUPS).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => addPresetGroup(key)}
              className={`text-xs px-3 py-1.5 rounded-full border-0 transition hover:opacity-80 font-medium ${cat(key)?.pill}`}
            >
              + {cat(key)?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Existing skills list */}
      {skills.length > 0 && (
        <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center gap-2 bg-gray-50 rounded-xl px-2 py-1.5 group"
            >
              <GripVertical size={14} className="text-gray-300 flex-shrink-0" />
              <input
                type="text"
                value={skill.icon}
                onChange={(e) => updateSkill(skill.id, "icon", e.target.value)}
                className="w-10 h-9 text-center text-xl bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 flex-shrink-0"
              />
              <input
                type="text"
                value={skill.label}
                onChange={(e) => updateSkill(skill.id, "label", e.target.value)}
                placeholder="Skill name"
                className="flex-1 h-9 text-sm bg-white border border-gray-200 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-blue-400 min-w-0"
              />
              <select
                value={skill.category}
                onChange={(e) => updateSkill(skill.id, "category", e.target.value)}
                className="h-9 text-xs bg-white border border-gray-200 rounded-xl px-2 focus:outline-none focus:ring-1 focus:ring-blue-400 flex-shrink-0"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <span className={`hidden md:inline-block text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${cat(skill.category)?.pill}`}>
                {cat(skill.category)?.label}
              </span>
              <button
                type="button"
                onClick={() => removeSkill(skill.id)}
                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition flex-shrink-0"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {skills.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-6 border border-dashed border-gray-200 rounded-xl">
          No skills added yet. Use presets above or add a custom skill below.
        </p>
      )}

      {/* Add new skill row */}
      <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-2 py-2 border border-dashed border-blue-300">
        <input
          type="text"
          value={newSkill.icon}
          onChange={(e) => setNewSkill((p) => ({ ...p, icon: e.target.value }))}
          className="w-10 h-9 text-center text-xl bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 flex-shrink-0"
          placeholder="📚"
        />
        <input
          type="text"
          value={newSkill.label}
          onChange={(e) => setNewSkill((p) => ({ ...p, label: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && addSkill()}
          placeholder="Type a skill name and press Enter..."
          className="flex-1 h-9 text-sm bg-white border border-gray-200 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-blue-400 min-w-0"
        />
        <select
          value={newSkill.category}
          onChange={(e) => setNewSkill((p) => ({ ...p, category: e.target.value }))}
          className="h-9 text-xs bg-white border border-gray-200 rounded-xl px-2 focus:outline-none focus:ring-1 focus:ring-blue-400 flex-shrink-0"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <Button size="sm" icon={Plus} onClick={addSkill} className="flex-shrink-0">
          Add
        </Button>
      </div>
    </div>
  );
}
