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
  Users,
  Target,
  Sparkles,
  Compass,
  FileText,
  Video,
  Code,
  GraduationCap,
} from "lucide-react";

import {
  getAdminCourses,
  createAdminCourse,
  updateAdminCourse,
  deleteAdminCourse,
  getAdminUserLearnings,
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
  category: "Development",
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
  "Development",
  "Programming",
  "Data & AI",
  "Database",
  "Cloud",
  "DevOps",
  "Cybersecurity",
  "Mobile",
  "Design",
  "Testing",
  "Career",
];

export default function AdminLearning() {
  const [activeTab, setActiveTab] = useState("courses"); // 'courses' | 'user-learnings'

  // Courses State
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // User Learning Insights State
  const [userLearnings, setUserLearnings] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userSearch, setUserSearch] = useState("");

  // View & Filter States
  const [viewMode, setViewMode] = useState("grid");
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
      setLoadingCourses(true);
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
      setLoadingCourses(false);
    }
  };

  const loadUserLearnings = async () => {
    try {
      setLoadingUsers(true);
      const response = await getAdminUserLearnings();
      const data =
        response?.learnings ||
        response?.data?.learnings ||
        response?.data ||
        [];
      setUserLearnings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("User learnings error:", error);
      setUserLearnings([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadCourses();
    loadUserLearnings();
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
      category: course.category || "Development",
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
      category: course.category || "Development",
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

    if (!form.title.trim() || !form.url.trim()) {
      showNotification("Course title and URL are required", "error");
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
        category: form.category.trim() || "Development",
        skills: form.skills,
        isPublished: true,
      };

      if (editingCourse?._id) {
        await updateAdminCourse(editingCourse._id, payload);
        showNotification("Course updated successfully!");
      } else {
        await createAdminCourse(payload);
        showNotification("New course published! Immediately visible in user dashboard.");
      }

      closeModal();
      await loadCourses();
    } catch (error) {
      console.error("Save course error:", error);
      showNotification("Failed to save course", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (course) => {
    if (!course?._id) return;
    if (!window.confirm(`Delete "${course.title}"? This will remove it from user dashboards.`)) return;

    try {
      setDeletingId(course._id);
      await deleteAdminCourse(course._id);
      setCourses((prev) => prev.filter((item) => item._id !== course._id));
      showNotification("Course deleted successfully.");
    } catch (error) {
      showNotification("Failed to delete course", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyLink = (course) => {
    if (!course?.url) return;
    navigator.clipboard.writeText(course.url);
    setCopiedId(course._id);
    showNotification("Course link copied!");
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

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    const q = search.toLowerCase().trim();

    return courses.filter((course) => {
      const matchesSearch =
        !q ||
        course.title?.toLowerCase().includes(q) ||
        course.provider?.toLowerCase().includes(q) ||
        course.category?.toLowerCase().includes(q) ||
        course.description?.toLowerCase().includes(q);

      const matchesType = selectedType === "All" || course.type === selectedType;
      const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
      const matchesCategory =
        selectedCategory === "All" ||
        course.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesType && matchesLevel && matchesCategory;
    });
  }, [courses, search, selectedType, selectedLevel, selectedCategory]);

  // Filtered Users Learning
  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase().trim();
    if (!q) return userLearnings;
    return userLearnings.filter(
      (u) =>
        u.user?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.targetRole?.toLowerCase().includes(q)
    );
  }, [userLearnings, userSearch]);

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
          {toast.type === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="admin-learning-container">
        {/* Header */}
        <div className="admin-learning-header">
          <div className="admin-learning-title-section">
            <div className="admin-learning-icon">
              <BookOpen size={24} />
            </div>
            <div>
              <div className="title-row">
                <h1 className="admin-learning-title">Course & Learning Management</h1>
                <span className="badge-live-sync">Live Platform Sync</span>
              </div>
              <p className="admin-learning-subtitle">
                Manage curated courses and track what roles and skills users are learning.
              </p>
            </div>
          </div>

          <div className="header-actions-group">
            {activeTab === "courses" && (
              <>
                <button onClick={handleExportCSV} className="action-btn-secondary" title="Export CSV">
                  <Download size={16} />
                  <span>Export</span>
                </button>
                <button onClick={openCreateModal} className="add-course-btn">
                  <Plus size={18} />
                  <span>Add New Course</span>
                </button>
              </>
            )}

            <button
              onClick={() => {
                loadCourses();
                loadUserLearnings();
              }}
              className="action-btn-secondary"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={loadingCourses || loadingUsers ? "spin" : ""} />
            </button>
          </div>
        </div>

        {/* Dynamic Metric Cards */}
<div className="learning-stats-grid">
  {/* Card 1 */}
  <div className="stat-card">
    <div className="stat-icon-wrapper">
      <BookOpen size={20} />
    </div>
    <div className="stat-info">
      <span className="stat-label">Total Courses</span>
      <strong className="stat-number">{courses.length}</strong>
    </div>
  </div>

  {/* Card 2 */}
  <div className="stat-card">
    <div className="stat-icon-wrapper">
      <Users size={20} />
    </div>
    <div className="stat-info">
      <span className="stat-label">User Learnings</span>
      <strong className="stat-number">{userLearnings.length}</strong>
    </div>
  </div>

  {/* Card 3 */}
  <div className="stat-card">
    <div className="stat-icon-wrapper">
      <GraduationCap size={20} />
    </div>
    <div className="stat-info">
      <span className="stat-label">Recommendations</span>
      <strong className="stat-number">
        {userLearnings.reduce((acc, curr) => acc + (curr.totalRecommendations || 0), 0)}
      </strong>
    </div>
  </div>

  {/* Card 4 */}
  <div className="stat-card">
    <div className="stat-icon-wrapper">
      <Layers size={20} />
    </div>
    <div className="stat-info">
      <span className="stat-label">Categories</span>
      <strong className="stat-number">{defaultCategories.length - 1}</strong>
    </div>
  </div>
</div>

        {/* Tab Navigation */}
        <div className="learning-tab-nav">
          <button
            className={`tab-item-btn ${activeTab === "courses" ? "active" : ""}`}
            onClick={() => setActiveTab("courses")}
          >
            <BookOpen size={17} />
            <span>Course Catalog ({courses.length})</span>
          </button>
          <button
            className={`tab-item-btn ${activeTab === "user-learnings" ? "active" : ""}`}
            onClick={() => setActiveTab("user-learnings")}
          >
            <Users size={17} />
            <span>User Learning Insights ({userLearnings.length})</span>
          </button>
        </div>

        {/* =========================================================
            TAB 1: COURSE CATALOG MANAGEMENT
        ========================================================= */}
        {activeTab === "courses" && (
          <>
            {/* Search & Filters */}
            <div className="learning-filter-card">
              <div className="filter-top-bar">
                <div className="learning-search-box">
                  <Search className="search-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Search courses by title, category, or provider..."
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
                  >
                    <LayoutGrid size={17} />
                  </button>
                  <button
                    className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
                    onClick={() => setViewMode("list")}
                  >
                    <List size={17} />
                  </button>
                </div>
              </div>

              <div className="filter-options-row">
                <div className="select-wrapper">
                  <label>Category:</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {defaultCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

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
            </div>

            {/* Courses Display */}
            {loadingCourses ? (
              <div className="learning-empty-state">
                <Loader2 size={36} className="spin text-indigo" />
                <p>Loading course catalogue...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="learning-empty-state">
                <BookOpen size={40} className="text-muted" />
                <h3>No courses found</h3>
                <p>Add your first course to populate the user dashboard.</p>
                <button onClick={openCreateModal} className="add-course-btn mt-4">
                  <Plus size={16} /> Add First Course
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="courses-grid-layout">
                {filteredCourses.map((course) => (
                  <div key={course._id} className="course-card-grid">
                    <div className="card-header-bar">
                      <span className="badge-category">{course.category || "Development"}</span>
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
                        {course.description || "Curated course resource."}
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
                            <span key={idx} className="skill-tag">
                              <Tag size={10} /> {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="card-actions-bar">
                      {course.url && (
                        <a
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="visit-link-btn"
                        >
                          <ExternalLink size={14} /> Open
                        </a>
                      )}

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
                          title="Clone Course"
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
              /* List Table View */
              <div className="course-table-container">
                <table className="course-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Level</th>
                      <th>Provider</th>
                      <th>Duration</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr key={course._id}>
                        <td>
                          <strong>{course.title}</strong>
                        </td>
                        <td>
                          <span className="badge-category">{course.category}</span>
                        </td>
                        <td>{course.type}</td>
                        <td>{course.level}</td>
                        <td>{course.provider || "—"}</td>
                        <td>{course.duration || "—"}</td>
                        <td className="text-right">
                          <div className="table-action-btns">
                            <button onClick={() => openEditModal(course)} className="table-btn">
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(course)}
                              className="table-btn danger"
                              disabled={deletingId === course._id}
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
          </>
        )}

        {/* =========================================================
            TAB 2: USER LEARNING INSIGHTS
        ========================================================= */}
        {activeTab === "user-learnings" && (
          <div className="user-insights-container">
            <div className="learning-filter-card">
              <div className="learning-search-box" style={{ maxWidth: "450px" }}>
                <Search className="search-icon" size={18} />
                <input
                  type="text"
                  placeholder="Search user name, email, or target role..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            {loadingUsers ? (
              <div className="learning-empty-state">
                <Loader2 size={36} className="spin text-indigo" />
                <p>Loading user learning records...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="learning-empty-state">
                <Users size={40} className="text-muted" />
                <h3>No user learning plans generated yet</h3>
                <p>When users complete Skill Gap Analysis and generate learning plans, they appear here.</p>
              </div>
            ) : (
              <div className="user-learnings-grid">
                {filteredUsers.map((u) => (
                  <div key={u._id} className="user-learning-card">
                    <div className="user-card-top">
                      <div className="user-avatar-badge">{u.initials}</div>
                      <div className="user-info-meta">
                        <h4 className="user-full-name">{u.user}</h4>
                        <span className="user-email-text">{u.email}</span>
                      </div>
                      <span className="user-date-tag">{u.date}</span>
                    </div>

                    <div className="target-role-banner">
                      <Compass size={16} />
                      <div>
                        <span className="banner-sub">Target Role</span>
                        <strong>{u.targetRole}</strong>
                      </div>
                    </div>

                    {u.missingSkills.length > 0 && (
                      <div className="missing-skills-section">
                        <label className="section-mini-label">Learning Gaps to Bridge:</label>
                        <div className="skill-chips-row">
                          {u.missingSkills.map((sk, i) => (
                            <span key={i} className="skill-tag user-skill">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="user-card-footer">
                      <span>🤖 {u.totalRecommendations} AI Recommended Courses</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="learning-modal-overlay">
          <div className="learning-modal-box">
            <div className="learning-modal-header">
              <div className="modal-title-wrap">
                <h2>{editingCourse ? "Edit Learning Resource" : "Create Learning Resource"}</h2>
                <p>Changes will immediately reflect on the user learning dashboard.</p>
              </div>
              <button onClick={closeModal} className="modal-close-btn" disabled={saving}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-grid-body">
              <form onSubmit={handleSubmit} className="modal-form-side">
                <div className="form-item">
                  <label>Course Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Full Stack Web Development"
                    required
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-item">
                    <label>Category</label>
                    <select name="category" value={form.category} onChange={handleInputChange}>
                      {defaultCategories
                        .filter((c) => c !== "All")
                        .map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                    </select>
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

                <div className="form-row-2">
                  <div className="form-item">
                    <label>Level</label>
                    <select name="level" value={form.level} onChange={handleInputChange}>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="form-item">
                    <label>Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={form.duration}
                      onChange={handleInputChange}
                      placeholder="e.g. 15 Hours"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-item">
                    <label>Provider</label>
                    <input
                      type="text"
                      name="provider"
                      value={form.provider}
                      onChange={handleInputChange}
                      placeholder="e.g. YouTube, Coursera"
                    />
                  </div>

                  <div className="form-item">
                    <label>Course URL *</label>
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

                <div className="form-item">
                  <label>Covered Skills / Tags</label>
                  <div className="tag-input-container">
                    <div className="chips-list">
                      {form.skills.map((skill, index) => (
                        <span key={index} className="removable-chip">
                          {skill}
                          <button type="button" onClick={() => handleRemoveSkill(skill)}>
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="input-with-add">
                      <input
                        type="text"
                        placeholder="Type skill & press Enter..."
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillKeyDown}
                      />
                      <button type="button" onClick={handleAddSkill} className="btn-add-tag">
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-item">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Brief description of the course..."
                  />
                </div>

                <div className="modal-buttons-row">
                  <button type="button" onClick={closeModal} disabled={saving} className="modal-cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="modal-submit-btn">
                    {saving ? (
                      <>
                        <Loader2 className="spin" size={16} /> Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} /> {editingCourse ? "Update Course" : "Publish Course"}
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Live Preview */}
              <div className="modal-preview-side">
                <div className="preview-sticky">
                  <div className="preview-label">
                    <Sparkles size={14} />
                    <span>Live Student Preview</span>
                  </div>

                  <div className="course-card-grid preview-card">
                    <div className="card-header-bar">
                      <span className="badge-category">{form.category || "Development"}</span>
                      <span className={`badge-level ${form.level?.toLowerCase()}`}>
                        {form.level || "Beginner"}
                      </span>
                    </div>

                    <div className="card-body">
                      <div className="type-indicator">
                        {getTypeIcon(form.type)}
                        <span>{form.type || "Course"}</span>
                      </div>

                      <h3 className="course-title-text">{form.title || "Course Title Preview"}</h3>
                      <p className="course-desc-text">
                        {form.description || "Description will appear here as you type."}
                      </p>

                      <div className="course-meta-tags">
                        <span className="meta-pill">
                          <Globe size={13} /> {form.provider || "Platform"}
                        </span>
                        <span className="meta-pill">
                          <Clock size={13} /> {form.duration || "Duration"}
                        </span>
                      </div>
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