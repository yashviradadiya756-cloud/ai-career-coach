import React from "react";
import "./Pricing.css";

function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "/month",
      description:
        "Perfect for students who want to explore AI-powered career guidance.",
      features: [
        "AI Career Assessment",
        "Basic Resume Analysis",
        "Career Suggestions",
        "1 Question Quiz",
        "First visit free of cost",
      ],
      isPopular: false,
      buttonText: "Get Started",
      buttonStyle: "btn-outline-primary",
    },
    {
      name: "Pro",
      price: "₹299",
      period: "/month",
      description:
        "Best for students preparing for internships and placements.",
      features: [
        "Everything in free,plus:",
        "Overall + per-question scores",
        "Specific strengths & weaknesses",
        "Personalised next-steps plan",
        "Saved to your account forever",
      ],
      isPopular: true,
      buttonText: "Start Pro",
      buttonStyle: "btn-primary",
    },
    
  ];

  return (
    <section id="pricing" className="pricing-section">
      <div className="container">
        {/* Heading */}
        <div className="pricing-header">
            <h2>Choose Your Perfect Plan</h2>
            <p>
              Unlock AI-powered career guidance, resume analysis,
              interview preparation, and personalized learning roadmaps.
            </p>
        </div>
          
        {/* Cards */}
        <div className="pricing-row">
          {plans.map((plan, index) => (
            <div
              className={`pricing-card ${
                plan.isPopular ? "popular-card" : ""
              }`}
              key={index}
            >
              {plan.isPopular && (
                <div className="popular-badge">
                  ⭐ Most Popular
                </div>
              )}

              <h3>{plan.name}</h3>

              <p className="plan-description">
                {plan.description}
              </p>

              <div className="price">
                <span>{plan.price}</span>
                <small>{plan.period}</small>
              </div>

              <ul className="feature-list">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <span className="check">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`btn ${plan.buttonStyle} pricing-btn`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
       
      </div>
    </section>
  );
}

export default Pricing;