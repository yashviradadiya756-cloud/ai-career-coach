require("dotenv").config();

const generateLearningRecommendations =
  require("./utils/geminiLearning");

async function test() {
  try {
    const missingSkills = [
      "Express.js",
      "TypeScript",
      "Git & GitHub",
      "RESTful APIs",
      "State Management (Redux / Context API)",
      "Data Structures & Algorithms (DSA)",
      "Authentication & Security (JWT, OAuth)",
      "Testing (Jest, Cypress)",
      "DevOps & Deployment (Docker, Vercel, AWS/Render)"
    ];

    const targetRole = "Full stack developer";

    const result =
      await generateLearningRecommendations(
        missingSkills,
        targetRole
      );

    console.log(
      "===== FINAL RESULT ====="
    );

    console.log(
      JSON.stringify(result, null, 2)
    );

  } catch (error) {
    console.error(
      "TEST FAILED:",
      error
    );
  }
}

test();