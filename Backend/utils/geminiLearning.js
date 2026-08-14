const {
  generateContent,
} = require("../config/gemini");

// =====================================================
// GENERATE LEARNING RECOMMENDATIONS
// =====================================================

const generateLearningRecommendations = async (
  missingSkills,
  targetRole
) => {
  try {
    console.log("=================================");
    console.log("LEARNING AI STARTED");
    console.log("=================================");

    const skills = Array.isArray(
      missingSkills
    )
      ? missingSkills
          .map((skill) =>
            String(skill).trim()
          )
          .filter(Boolean)
      : [];

    const role = String(
      targetRole || ""
    ).trim();

    console.log("TARGET ROLE:", role);
    console.log("MISSING SKILLS:", skills);

    // =================================================
    // VALIDATION
    // =================================================

    if (!role) {
      throw new Error(
        "Target role is required."
      );
    }

    if (skills.length === 0) {
      throw new Error(
        "No missing skills available in Skill Gap Analysis."
      );
    }

    // =================================================
    // PROMPT
    // =================================================

    const prompt = `
You are an expert AI Career Coach.

Create a personalized learning plan for the candidate.

Target Role:
${role}

Missing Skills:
${skills.join(", ")}

For EVERY missing skill, create exactly ONE learning recommendation.

Return ONLY valid JSON.

Do NOT use markdown.
Do NOT use code fences.
Do NOT add explanations.

Required format:

{
  "recommendations": [
    {
      "skill": "SEO",
      "course": "SEO Fundamentals",
      "platform": "Google",
      "duration": "10 hours",
      "level": "Beginner",
      "url": "https://example.com"
    }
  ]
}

STRICT RULES:

1. recommendations MUST be an array.
2. Create exactly ONE recommendation for every missing skill.
3. skill MUST match the missing skill.
4. course MUST be relevant to the skill.
5. platform MUST be a real learning platform.
6. duration MUST be a simple text value.
7. level MUST be Beginner, Intermediate, or Advanced.
8. url MUST be a valid learning resource URL.
9. Return ONLY JSON.
`;

    console.log(
      "Calling Gemini for learning..."
    );

    const response =
      await generateContent(prompt);

    if (
      !response ||
      !response.text
    ) {
      throw new Error(
        "Gemini returned an empty learning response."
      );
    }

    let text =
      response.text.trim();

    console.log(
      "RAW LEARNING RESPONSE:"
    );

    console.log(text);

    // =================================================
    // CLEAN RESPONSE
    // =================================================

    text = text
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    // =================================================
    // EXTRACT JSON
    // =================================================

    const jsonMatch =
      text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error(
        "Gemini returned invalid JSON."
      );
    }

    let data;

    try {
      data = JSON.parse(
        jsonMatch[0]
      );
    } catch (error) {
      console.error(
        "LEARNING JSON PARSE ERROR"
      );

      console.error(text);

      throw new Error(
        "Gemini returned invalid JSON for learning recommendations."
      );
    }

    // =================================================
    // VALIDATE
    // =================================================

    if (
      !data ||
      !Array.isArray(
        data.recommendations
      )
    ) {
      throw new Error(
        "Invalid learning recommendation format."
      );
    }

    // =================================================
    // NORMALIZE
    // =================================================

    const recommendations =
      data.recommendations
        .filter(
          (item) =>
            item &&
            typeof item ===
              "object" &&
            !Array.isArray(item)
        )
        .map((item) => ({
          skill: String(
            item.skill || ""
          ).trim(),

          course: String(
            item.course || ""
          ).trim(),

          platform: String(
            item.platform || ""
          ).trim(),

          duration: String(
            item.duration || ""
          ).trim(),

          level: String(
            item.level || ""
          ).trim(),

          url: String(
            item.url || ""
          ).trim(),
        }))
        .filter(
          (item) =>
            item.skill &&
            item.course
        );

    console.log(
      "NORMALIZED LEARNING:"
    );

    console.log(
      JSON.stringify(
        recommendations,
        null,
        2
      )
    );

    if (
      recommendations.length === 0
    ) {
      throw new Error(
        "Gemini did not return any valid learning recommendations."
      );
    }

    return {
      recommendations,
    };
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "LEARNING AI ERROR"
    );

    console.error(
      error?.message || error
    );

    console.error(
      "================================="
    );

    throw error;
  }
};

module.exports =
  generateLearningRecommendations;