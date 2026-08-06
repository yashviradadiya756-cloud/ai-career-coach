const getAssessmentOverview = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Temporary/default values
    // Replace these with MongoDB assessment data
    // when the Assessment model is connected.

    const totalAssessments = 4;

    const completed = 0;

    const averageScore = 0;

    const rank = "Not Ranked";

    const tests = [
      {
        id: "technical",
        title: "Technical Skills",
        description: "Java, Python, React, Node.js",
        questions: 25,
        time: 30,
        color: "#2563eb",
      },
      {
        id: "aptitude",
        title: "Aptitude Test",
        description: "Logical & Quantitative",
        questions: 20,
        time: 20,
        color: "#16a34a",
      },
      {
        id: "communication",
        title: "Communication",
        description: "English & Soft Skills",
        questions: 15,
        time: 15,
        color: "#f59e0b",
      },
      {
        id: "personality",
        title: "Personality Test",
        description: "Career Behaviour Analysis",
        questions: 20,
        time: 20,
        color: "#dc2626",
      },
    ];

    const results = [];

    const recommendation =
      completed === 0
        ? "Start your first assessment to identify your strengths and areas for improvement."
        : "Continue taking assessments to improve your career readiness.";

    return res.status(200).json({
      success: true,

      user: {
        name: user.name,
        email: user.email,
      },

      summary: {
        totalAssessments,
        completed,
        averageScore,
        rank,
      },

      tests,

      results,

      recommendation,
    });
  } catch (error) {
    console.error("Assessment Overview Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load assessment dashboard",
    });
  }
};

module.exports = {
  getAssessmentOverview,
};