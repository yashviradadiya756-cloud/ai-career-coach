import React, { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  BookOpen,
  X,
  Save,
  Loader2,
  Search,
  Copy,
  Check,
  ExternalLink,
  Layers,
  LayoutGrid,
  List,
  Clock,
  Globe,
  Tag,
  Download,
  RefreshCw,
  CopyPlus,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Video,
  Code,
  GraduationCap,
  Sparkles,
} from "lucide-react";

import {
  getAdminCourses,
  createAdminCourse,
  updateAdminCourse,
  deleteAdminCourse,
} from "../../api/adminApi";

import "../styles/adminLearning.css";

const initialForm = {
  title: "",
  type: "Video Course",
  description: "",
  url: "",
  provider: "",
  duration: "",
  level: "Beginner",
  skills: [],
  category: "Web Development",
};

const courseTypes = [
  "All",
  "Video Course",
  "Article",
  "Documentation",
  "Project",
  "Certification",
  "Practice",
  "Book",
];

const levels = ["All", "Beginner", "Intermediate", "Advanced"];

const defaultCategories = [
  "All",
  "Web Development",
  "Frontend",
  "Backend",
  "Full Stack",
  "AI / Machine Learning",
  "Data Science",
  "DevOps & Cloud",
  "Mobile App Development",
  "System Design",
  "Interview Prep",
];

export default function AdminLearning() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // View & Filter States
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeSkillFilter, setActiveSkillFilter] = useState("");

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [skillInput, setSkillInput] = useState("");

  // Toast System
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [copiedId, setCopiedId] = useState(null);

  const showNotification = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3500);
  };

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await getAdminCourses();

      const data =
        response?.courses ||
        response?.data?.courses ||
        response?.data ||
        [];

      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Admin courses error:", error);
      showNotification("Failed to load courses from server", "error");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Modals
  const openCreateModal = () => {
    setEditingCourse(null);
    setForm(initialForm);
    setSkillInput("");
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setForm({
      title: course.title || "",
      type: course.type || "Video Course",
      description: course.description || "",
      url: course.url || "",
      provider: course.provider || "",
      duration: course.duration || "",
      level: course.level || "Beginner",
      skills: Array.isArray(course.skills)
        ? course.skills
        : typeof course.skills === "string"
        ? course.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      category: course.category || "Web Development",
    });
    setSkillInput("");
    setShowModal(true);
  };

  const handleDuplicate = (course) => {
    setEditingCourse(null);
    setForm({
      title: `${course.title || "Course"} (Copy)`,
      type: course.type || "Video Course",
      description: course.description || "",
      url: course.url || "",
      provider: course.provider || "",
      duration: course.duration || "",
      level: course.level || "Beginner",
      skills: Array.isArray(course.skills) ? [...course.skills] : [],
      category: course.category || "Web Development",
    });
    setSkillInput("");
    setShowModal(true);
    showNotification("Course cloned into form! Review and save.", "info");
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    setEditingCourse(null);
    setForm(initialForm);
    setSkillInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      showNotification("Course title is required", "error");
      return;
    }
    if (!form.url.trim()) {
      showNotification("Valid course URL is required", "error");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        type: form.type,
        description: form.description.trim(),
        url: form.url.trim(),
        provider: form.provider.trim() || "Online Resource",
        duration: form.duration.trim() || "Self-Paced",
        level: form.level,
        category: form.category.trim() || "General",
        skills: form.skills,
      };

      if (editingCourse?._id) {
        await updateAdminCourse(editingCourse._id, payload);
        showNotification("Course updated successfully!");
      } else {
        await createAdminCourse(payload);
        showNotification("New course published successfully! Users can now see it.");
      }

      closeModal();
      await loadCourses();
    } catch (error) {
      console.error("Save course error:", error);
      showNotification(
        error?.response?.data?.message || "Failed to save course",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (course) => {
    if (!course?._id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.title}"? This will remove it from all user dashboards.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(course._id);
      await deleteAdminCourse(course._id);
      setCourses((prev) => prev.filter((item) => item._id !== course._id));
      showNotification("Course removed successfully.");
    } catch (error) {
      console.error("Delete course error:", error);
      showNotification(
        error?.response?.data?.message || "Failed to delete course",
        "error"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyLink = (course) => {
    if (!course?.url) return;
    navigator.clipboard.writeText(course.url);
    setCopiedId(course._id);
    showNotification("Course link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    if (courses.length === 0) {
      showNotification("No courses to export", "error");
      return;
    }

    const headers = ["Title", "Type", "Category", "Level", "Provider", "Duration", "URL", "Skills"];
    const rows = courses.map((c) => [
      `"${(c.title || "").replace(/"/g, '""')}"`,
      `"${c.type || ""}"`,
      `"${c.category || ""}"`,
      `"${c.level || ""}"`,
      `"${c.provider || ""}"`,
      `"${c.duration || ""}"`,
      `"${c.url || ""}"`,
      `"${(Array.isArray(c.skills) ? c.skills.join(", ") : c.skills || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `careerpilot_courses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("Courses exported to CSV!");
  };

  // Filtered List
  const filteredCourses = useMemo(() => {
    const q = search.toLowerCase().trim();

    return courses.filter((course) => {
      const matchesSearch =
        !q ||
        course.title?.toLowerCase().includes(q) ||
        course.provider?.toLowerCase().includes(q) ||
        course.category?.toLowerCase().includes(q) ||
        course.description?.toLowerCase().includes(q) ||
        (Array.isArray(course.skills) &&
          course.skills.some((s) => s.toLowerCase().includes(q)));

      const matchesType =
        selectedType === "All" || course.type === selectedType;

      const matchesLevel =
        selectedLevel === "All" || course.level === selectedLevel;

      const matchesCategory =
        selectedCategory === "All" ||
        course.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSkill =
        !activeSkillFilter ||
        (Array.isArray(course.skills) &&
          course.skills.some(
            (s) => s.toLowerCase() === activeSkillFilter.toLowerCase()
          ));

      return matchesSearch && matchesType && matchesLevel && matchesCategory && matchesSkill;
    });
  }, [courses, search, selectedType, selectedLevel, selectedCategory, activeSkillFilter]);

  const uniqueCategories = useMemo(() => {
    const set = new Set(courses.map((c) => c.category).filter(Boolean));
    defaultCategories.forEach((cat) => {
      if (cat !== "All") set.add(cat);
    });
    return ["All", ...Array.from(set)];
  }, [courses]);

  const getTypeIcon = (type) => {
    switch (type) {
      case "Video Course":
        return <Video size={14} />;
      case "Project":
      case "Practice":
        return <Code size={14} />;
      case "Certification":
        return <GraduationCap size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  return (
    <div className="admin-learning-page">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`admin-toast-box ${toast.type}`}>
          {toast.type === "error" ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="admin-learning-container">
        {/* Top Header */}
        <div className="admin-learning-header">
          <div className="admin-learning-title-section">
            <div className="admin-learning-icon">
              <BookOpen size={24} />
            </div>
            <div>
              <div className="title-row">
                <h1 className="admin-learning-title">Course Management</h1>
                <span className="badge-live-sync">Live User Sync</span>
              </div>
              <p className="admin-learning-subtitle">
                Publish, edit, and organize courses. Updates reflect instantaneously across the user portal.
              </p>
            </div>
          </div>

          <div className="header-actions-group">
            <button
              onClick={handleExportCSV}
              className="action-btn-secondary"
              title="Download CSV report"
            >
              <Download size={16} />
              <span>Export</span>
            </button>

            <button
              onClick={loadCourses}
              className="action-btn-secondary"
              title="Reload courses"
            >
              <RefreshCw size={16} className={loading ? "spin" : ""} />
            </button>

            <button onClick={openCreateModal} className="add-course-btn">
              <Plus size={18} />
              <span>Add New Course</span>
            </button>
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="learning-stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper blue">
              <BookOpen size={20} />
            </div>
            <div>
              <span className="stat-label">Total Catalog</span>
              <strong className="stat-number">{courses.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper purple">
              <Layers size={20} />
            </div>
            <div>
              <span className="stat-label">Categories</span>
              <strong className="stat-number">{uniqueCategories.length - 1}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper amber">
              <Filter size={20} />
            </div>
            <div>
              <span className="stat-label">Showing Filtered</span>
              <strong className="stat-number">{filteredCourses.length}</strong>
            </div>
          </div>
        </div>

        {/* Search, Tabs, & Filters */}
        <div className="learning-filter-card">
          <div className="filter-top-bar">
            <div className="learning-search-box">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search courses by title, topic, skill, or provider..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="clear-btn" onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="view-mode-toggles">
              <button
                className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid Cards"
              >
                <LayoutGrid size={17} />
              </button>
              <button
                className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="Table List"
              >
                <List size={17} />
              </button>
            </div>
          </div>

          {/* Quick Filter Pill Rows */}
          <div className="filter-options-row">
            {/* Category Dropdown */}
            <div className="select-wrapper">
              <label>Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {uniqueCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div className="select-wrapper">
              <label>Level:</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Types Scroll */}
            <div className="types-pill-scroll">
              {courseTypes.map((type) => (
                <button
                  key={type}
                  className={`type-pill ${selectedType === type ? "active" : ""}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type !== "All" && getTypeIcon(type)}
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Active Skill Filter Indicator */}
          {activeSkillFilter && (
            <div className="active-skill-bar">
              <span>Filtering by skill: <strong>{activeSkillFilter}</strong></span>
              <button onClick={() => setActiveSkillFilter("")}>
                <X size={13} /> Clear skill filter
              </button>
            </div>
          )}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="learning-empty-state">
            <Loader2 size={36} className="spin text-indigo" />
            <p>Fetching learning catalogue...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="learning-empty-state">
            <div className="empty-icon-circle">
              <BookOpen size={36} />
            </div>
            <h3>No matching courses found</h3>
            <p>
              {search || selectedType !== "All" || selectedCategory !== "All" || activeSkillFilter
                ? "Try clearing your filters or search keywords."
                : "No learning materials published yet. Start creating one!"}
            </p>
            <button onClick={openCreateModal} className="add-course-btn mt-4">
              <Plus size={16} /> Add First Course
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* GRID VIEW */
          <div className="courses-grid-layout">
            {filteredCourses.map((course) => (
              <div key={course._id} className="course-card-grid">
                <div className="card-header-bar">
                  <span className="badge-category">{course.category || "General"}</span>
                  <span className={`badge-level ${course.level?.toLowerCase()}`}>
                    {course.level || "Beginner"}
                  </span>
                </div>

                <div className="card-body">
                  <div className="type-indicator">
                    {getTypeIcon(course.type)}
                    <span>{course.type || "Course"}</span>
                  </div>

                  <h3 className="course-title-text" title={course.title}>
                    {course.title}
                  </h3>

                  <p className="course-desc-text">
                    {course.description || "No description provided for this resource."}
                  </p>

                  <div className="course-meta-tags">
                    {course.provider && (
                      <span className="meta-pill">
                        <Globe size={13} /> {course.provider}
                      </span>
                    )}
                    {course.duration && (
                      <span className="meta-pill">
                        <Clock size={13} /> {course.duration}
                      </span>
                    )}
                  </div>

                  {Array.isArray(course.skills) && course.skills.length > 0 && (
                    <div className="skill-chips-row">
                      {course.skills.map((skill, idx) => (
                        <button
                          key={`${skill}-${idx}`}
                          className={`skill-tag ${activeSkillFilter === skill ? "highlighted" : ""}`}
                          onClick={() => setActiveSkillFilter(skill === activeSkillFilter ? "" : skill)}
                          title={`Filter by ${skill}`}
                        >
                          <Tag size={10} />
                          {skill}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="card-actions-bar">
                  <div className="left-link">
                    {course.url ? (
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="visit-link-btn"
                      >
                        <ExternalLink size={14} /> Open
                      </a>
                    ) : (
                      <span className="no-link">No link</span>
                    )}
                  </div>

                  <div className="action-buttons-group">
                    <button
                      className="icon-action-btn"
                      onClick={() => handleCopyLink(course)}
                      title="Copy URL"
                    >
                      {copiedId === course._id ? (
                        <Check size={15} className="text-green" />
                      ) : (
                        <Copy size={15} />
                      )}
                    </button>

                    <button
                      className="icon-action-btn"
                      onClick={() => handleDuplicate(course)}
                      title="Duplicate / Clone"
                    >
                      <CopyPlus size={15} />
                    </button>

                    <button
                      className="icon-action-btn"
                      onClick={() => openEditModal(course)}
                      title="Edit Course"
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      className="icon-action-btn danger"
                      onClick={() => handleDelete(course)}
                      disabled={deletingId === course._id}
                      title="Delete Course"
                    >
                      {deletingId === course._id ? (
                        <Loader2 size={15} className="spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* TABLE LIST VIEW */
          <div className="course-table-container">
            <table className="course-table">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Level</th>
                  <th>Provider</th>
                  <th>Duration</th>
                  <th>Skills</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course._id}>
                    <td>
                      <div className="table-title-box">
                        <strong>{course.title}</strong>
                        {course.description && (
                          <span className="table-desc">{course.description}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="badge-category">{course.category || "General"}</span>
                    </td>
                    <td>
                      <span className="table-type-pill">
                        {getTypeIcon(course.type)} {course.type}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-level ${course.level?.toLowerCase()}`}>
                        {course.level}
                      </span>
                    </td>
                    <td>{course.provider || "—"}</td>
                    <td>{course.duration || "—"}</td>
                    <td>
                      <div className="table-skills">
                        {Array.isArray(course.skills) &&
                          course.skills.slice(0, 3).map((s, i) => (
                            <span key={i} className="skill-tag">
                              {s}
                            </span>
                          ))}
                        {course.skills?.length > 3 && (
                          <span className="skill-tag-more">+{course.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="table-action-btns">
                        {course.url && (
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="table-btn"
                            title="Open Link"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                        <button
                          onClick={() => handleCopyLink(course)}
                          className="table-btn"
                          title="Copy Link"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => handleDuplicate(course)}
                          className="table-btn"
                          title="Clone"
                        >
                          <CopyPlus size={14} />
                        </button>
                        <button
                          onClick={() => openEditModal(course)}
                          className="table-btn"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(course)}
                          className="table-btn danger"
                          disabled={deletingId === course._id}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL WITH LIVE PREVIEW */}
      {showModal && (
        <div className="learning-modal-overlay">
          <div className="learning-modal-box">
            {/* Modal Header */}
            <div className="learning-modal-header">
              <div className="modal-title-wrap">
                <h2>{editingCourse ? "Edit Learning Resource" : "Create Learning Resource"}</h2>
                <p>Changes will immediately reflect on the user learning dashboard.</p>
              </div>
              <button onClick={closeModal} className="modal-close-btn" disabled={saving}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body & Live Preview */}
            <div className="modal-grid-body">
              {/* Form Column */}
              <form onSubmit={handleSubmit} className="modal-form-side">
                {/* Title */}
                <div className="form-item">
                  <label>
                    Course / Resource Title <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Master Full-Stack Web Development"
                    required
                  />
                </div>

                {/* Category & Type */}
                <div className="form-row-2">
                  <div className="form-item">
                    <label>Category / Domain</label>
                    <input
                      type="text"
                      name="category"
                      value={form.category}
                      onChange={handleInputChange}
                      placeholder="e.g. Web Development"
                      list="category-suggestions"
                    />
                    <datalist id="category-suggestions">
                      {defaultCategories
                        .filter((c) => c !== "All")
                        .map((c) => (
                          <option key={c} value={c} />
                        ))}
                    </datalist>
                  </div>

                  <div className="form-item">
                    <label>Resource Type</label>
                    <select name="type" value={form.type} onChange={handleInputChange}>
                      {courseTypes
                        .filter((t) => t !== "All")
                        .map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Level & Duration */}
                <div className="form-row-2">
                  <div className="form-item">
                    <label>Difficulty Level</label>
                    <select name="level" value={form.level} onChange={handleInputChange}>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </div>

                  <div className="form-item">
                    <label>Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={form.duration}
                      onChange={handleInputChange}
                      placeholder="e.g. 12 Hours, 4 Weeks"
                    />
                  </div>
                </div>

                {/* Provider & URL */}
                <div className="form-row-2">
                  <div className="form-item">
                    <label>Provider / Platform</label>
                    <input
                      type="text"
                      name="provider"
                      value={form.provider}
                      onChange={handleInputChange}
                      placeholder="e.g. Coursera, YouTube, Udemy"
                    />
                  </div>

                  <div className="form-item">
                    <label>
                      Resource URL / Link <span className="req">*</span>
                    </label>
                    <input
                      type="url"
                      name="url"
                      value={form.url}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      required
                    />
                  </div>
                </div>

                {/* Skills Tag Input */}
                <div className="form-item">
                  <label>Covered Skills / Tags</label>
                  <div className="tag-input-container">
                    <div className="chips-list">
                      {form.skills.map((skill, index) => (
                        <span key={index} className="removable-chip">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="input-with-add">
                      <input
                        type="text"
                        placeholder="Type skill & press Enter or Add..."
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillKeyDown}
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="btn-add-tag"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="form-item">
                  <label>Description & Objectives</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Briefly explain what students or users will gain from this course..."
                  />
                </div>

                {/* Modal Footer Buttons */}
                <div className="modal-buttons-row">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="modal-cancel-btn"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="modal-submit-btn"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="spin" size={16} />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>{editingCourse ? "Update Course" : "Publish Course"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Live Preview Column */}
              <div className="modal-preview-side">
                <div className="preview-sticky">
                  <div className="preview-label">
                    <Sparkles size={14} />
                    <span>Live Student Preview</span>
                  </div>

                  <div className="course-card-grid preview-card">
                    <div className="card-header-bar">
                      <span className="badge-category">
                        {form.category || "Web Development"}
                      </span>
                      <span className={`badge-level ${form.level?.toLowerCase()}`}>
                        {form.level || "Beginner"}
                      </span>
                    </div>

                    <div className="card-body">
                      <div className="type-indicator">
                        {getTypeIcon(form.type)}
                        <span>{form.type || "Course"}</span>
                      </div>

                      <h3 className="course-title-text">
                        {form.title || "Course Title Preview"}
                      </h3>

                      <p className="course-desc-text">
                        {form.description ||
                          "Description will appear here as you type in the form."}
                      </p>

                      <div className="course-meta-tags">
                        <span className="meta-pill">
                          <Globe size={13} /> {form.provider || "Platform"}
                        </span>
                        <span className="meta-pill">
                          <Clock size={13} /> {form.duration || "Duration"}
                        </span>
                      </div>

                      {form.skills.length > 0 && (
                        <div className="skill-chips-row">
                          {form.skills.map((s, i) => (
                            <span key={i} className="skill-tag">
                              <Tag size={10} /> {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="card-actions-bar">
                      <span className="preview-badge-status">
                        <Check size={13} /> Ready for user portal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}