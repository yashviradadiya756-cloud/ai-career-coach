const Achievement = require("../models/Achievement");
const Interview = require("../models/Interview");
const Learning = require("../models/Learning");

const PASSING_SCORE = 70;

// ============================================
// UPDATE ACHIEVEMENTS
// ============================================

const updateAchievementsController = async (req, res) => {
  try {
    const userId = req.user._id;

    const badges = [];

    // ========================================
    // INTERVIEW ACHIEVEMENT
    // ========================================

    const interview = await Interview.findOne({
      user: userId,
    }).sort({ createdAt: -1 });

    if (interview && interview.totalScore >= PASSING_SCORE) {
      badges.push({
        title: "Interview Champion",
        description: `Passed AI Mock Interview with ${interview.totalScore}% score`,
        icon: "🎤",
        earnedAt: interview.createdAt || new Date(),
      });
    }

    // ========================================
    // LEARNING ACHIEVEMENT
    // ========================================

    const learning = await Learning.findOne({
      user: userId,
    }).sort({ createdAt: -1 });

    if (
      learning &&
      learning.recommendations &&
      learning.recommendations.length > 0
    ) {
      const totalCourses = learning.recommendations.length;

      const completedCourses =
        learning.recommendations.filter(
          (course) => course.completed === true
        ).length;

      // Certificate only if ALL courses are completed
      if (
        totalCourses > 0 &&
        completedCourses === totalCourses
      ) {
        badges.push({
          title: "Learning Master",
          description: `Completed all ${totalCourses} recommended learning courses`,
          icon: "📚",
          earnedAt: learning.updatedAt || new Date(),
        });
      }
    }

    // ========================================
    // SAVE ONLY VALID ACHIEVEMENTS
    // ========================================

    const achievement =
      await Achievement.findOneAndUpdate(
        { user: userId },
        {
          user: userId,
          badges,
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

    res.status(200).json({
      success: true,
      message: "Achievements Updated Successfully",
      achievement,
    });
  } catch (error) {
    console.error("Achievement Update Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// GET ACHIEVEMENTS
// ============================================

const getAchievementsController = async (req, res) => {
  try {
    const achievement = await Achievement.findOne({
      user: req.user._id,
    });

    if (!achievement) {
      return res.status(200).json({
        success: true,
        achievement: {
          badges: [],
        },
      });
    }

    res.status(200).json({
      success: true,
      achievement,
    });
  } catch (error) {
    console.error("Get Achievement Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  updateAchievementsController,
  getAchievementsController,
};