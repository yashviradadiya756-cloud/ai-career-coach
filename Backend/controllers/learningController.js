const SkillGap = require("../models/SkillGap");
const Learning = require("../models/Learning");

const generateLearningRecommendations = require("../utils/geminiLearning");

// ============================================
// GENERATE LEARNING RECOMMENDATIONS
// ============================================

const generateLearningController = async (req, res) => {
try {
  console.log("🔥 NEW LEARNING CONTROLLER IS RUNNING 🔥");
console.log("USER ID:", req.user._id);
console.log("BODY:", req.body);
let { targetRole } = req.body;


console.log("================================");
console.log("LEARNING GENERATION REQUEST");
console.log("User ID:", req.user._id);
console.log("Requested Target Role:", targetRole);
console.log("================================");

// Find latest Skill Gap for logged-in user
// Do NOT filter by targetRole because targetRole
// can have different capitalization.
const skillGap = await SkillGap.findOne({
  user: req.user._id,
}).sort({ createdAt: -1 });

if (!skillGap) {
  return res.status(404).json({
    success: false,
    message: "Please complete Skill Gap Analysis first.",
  });
}

// Always use the target role saved in the Skill Gap.
// This prevents case-sensitive mismatch such as:
// "Full Stack Developer"
// vs
// "Full stack developer"
targetRole = skillGap.targetRole;

console.log("================================");
console.log("SKILL GAP FOUND");
console.log("Skill Gap ID:", skillGap._id);
console.log("Target Role:", targetRole);
console.log("Missing Skills:", skillGap.missingSkills);
console.log("================================");

// Make sure missingSkills exists
if (
  !Array.isArray(skillGap.missingSkills) ||
  skillGap.missingSkills.length === 0
) {
  return res.status(400).json({
    success: false,
    message: "No missing skills found in Skill Gap Analysis.",
  });
}

// Generate AI recommendations
const learningData = await generateLearningRecommendations(
  skillGap.missingSkills,
  targetRole
);

console.log("AI Learning Data:", learningData);

// Save in MongoDB
const learning = await Learning.create({
  user: req.user._id,
  skillGap: skillGap._id,
  targetRole,
  recommendations: learningData.recommendations,
});

console.log("Learning recommendations saved:", learning._id);

return res.status(201).json({
  success: true,
  message: "Learning Recommendations Generated Successfully",
  learning,
});


} catch (error) {
console.log("Learning Error:", error);


return res.status(500).json({
  success: false,
  message: error.message,
});
}
};

// ============================================
// GET LATEST LEARNING
// ============================================

const getLearningController = async (req, res) => {
try {
const learning = await Learning.findOne({
user: req.user._id,
})
.sort({ createdAt: -1 })
.populate("skillGap");


if (!learning) {
  return res.status(404).json({
    success: false,
    message: "No learning recommendations found.",
  });
}

return res.status(200).json({
  success: true,
  learning,
});


} catch (error) {
console.log("Get Learning Error:", error);


return res.status(500).json({
  success: false,
  message: error.message,
});


}
};

module.exports = {
generateLearningController,
getLearningController,
};
