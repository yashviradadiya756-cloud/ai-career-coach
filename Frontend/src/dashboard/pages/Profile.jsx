import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../api/userApi";

export default function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    careerGoal: "",
    skills: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();

      const user = res.data.user;

      setFormData({
        name: user.name || "",
        email: user.email || "",
        careerGoal: user.careerGoal || "",
        skills: user.skills ? user.skills.join(", ") : "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProfile({
        name: formData.name,
        careerGoal: formData.careerGoal,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      });

      alert("Profile Updated Successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Update Failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>My Profile</h2>

      <form onSubmit={handleSubmit}>
        <br />

        <label>Name</label>
        <br />
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <br />
        <br />

        <label>Email</label>
        <br />
        <input value={formData.email} disabled />

        <br />
        <br />

        <label>Career Goal</label>
        <br />
        <input
          name="careerGoal"
          value={formData.careerGoal}
          onChange={handleChange}
        />

        <br />
        <br />

        <label>Skills</label>
        <br />
        <input
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="React, Node.js, MongoDB"
        />

        <br />
        <br />

        <button type="submit">
          Update Profile
        </button>
      </form>
    </div>
  );
}