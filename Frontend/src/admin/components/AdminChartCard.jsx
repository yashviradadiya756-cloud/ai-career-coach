import React from "react";

const AdminChartCard = ({
  title,
  subtitle,
  data,
}) => {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="admin-chart-card">
      <div className="admin-chart-header">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>

        <select className="admin-chart-select">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
        </select>
      </div>

      <div className="admin-chart">
        {data.map((item, index) => {
          const height =
            (item.value / maxValue) * 100;

          return (
            <div
              className="admin-chart-column"
              key={index}
            >
              <div className="admin-chart-value">
                {item.value}
              </div>

              <div className="admin-chart-bar-wrapper">
                <div
                  className="admin-chart-bar"
                  style={{
                    height: `${height}%`,
                  }}
                ></div>
              </div>

              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminChartCard;