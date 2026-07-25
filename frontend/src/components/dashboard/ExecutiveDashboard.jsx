import React, { useState } from 'react';

function ExecutiveDashboard({ activeOrders = [], onSwitchTab }) {
  const [timeRange, setTimeRange] = useState('Today');

  // Mock KPI metrics
  const metrics = [
    { title: "Today's Gross Sales", value: "$3,842.50", change: "+14.2%", trend: "up", icon: "💰" },
    { title: "Average Ticket Time", value: "11m 45s", change: "-1m 30s", trend: "up", icon: "⏱️" },
    { title: "Active Live Orders", value: activeOrders.length || "6", change: "In Kitchen", trend: "neutral", icon: "🥗" },
    { title: "Table Occupancy", value: "78%", change: "14/18 Tables", trend: "up", icon: "🪑" },
  ];

  const recentActivities = [
    { time: "2 mins ago", text: "Table #04 placed an order for 2x Mediterranean Grain Bowl", type: "order" },
    { time: "5 mins ago", text: "Kitchen marked Order #FB-1842 as Ready for Pickup", type: "kitchen" },
    { time: "12 mins ago", text: "Inventory Alert: Organic Avocado stock below 15%", type: "warning" },
    { time: "18 mins ago", text: "New 5-Star AI Concierge rating submitted", type: "review" },
  ];

  const topSellingBowls = [
    { name: "Crispy Tofu Harvest Bowl", sales: 84, revenue: "$1,251.60", percentage: "34%" },
    { name: "Avocado & Wild Salmon Bowl", sales: 62, revenue: "$1,109.80", percentage: "28%" },
    { name: "Spicy Fiesta Quinoa Bowl", sales: 48, revenue: "$696.00", percentage: "18%" },
    { name: "Truffle Mushroom Warm Grain", sales: 35, revenue: "$556.50", percentage: "14%" }
  ];

  return (
    <div className="executive-dashboard-container">
      {/* Header Banner */}
      <div className="dashboard-header-row">
        <div>
          <h1 className="dashboard-page-title">Executive Operations Overview</h1>
          <p className="dashboard-page-sub">Real-time performance analytics for Fresh Bowl Kitchen & Dining</p>
        </div>

        <div className="time-filter-pills">
          {['Today', 'This Week', 'This Month'].map(range => (
            <button 
              key={range} 
              className={`filter-pill ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-cards-grid">
        {metrics.map((kpi, idx) => (
          <div key={idx} className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">{kpi.title}</span>
              <span className="kpi-icon">{kpi.icon}</span>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className={`kpi-change ${kpi.trend}`}>
              <span>{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics & Insights Section */}
      <div className="dashboard-grid-2col">
        {/* Sales & Kitchen Speed Chart Simulation */}
        <div className="dash-card">
          <div className="card-header-flex">
            <h3>Hourly Order Volume & Ticket Velocity</h3>
            <span className="live-pulse">🟢 LIVE</span>
          </div>

          <div className="hourly-chart-container">
            {[
              { hour: '11 AM', height: '40%', orders: 12 },
              { hour: '12 PM', height: '85%', orders: 38 },
              { hour: '1 PM', height: '95%', orders: 44 },
              { hour: '2 PM', height: '60%', orders: 24 },
              { hour: '3 PM', height: '30%', orders: 10 },
              { hour: '4 PM', height: '25%', orders: 8 },
              { hour: '5 PM', height: '55%', orders: 22 },
              { hour: '6 PM', height: '90%', orders: 40 },
              { hour: '7 PM', height: '75%', orders: 31 },
            ].map((bar, i) => (
              <div key={i} className="chart-bar-group">
                <div className="chart-bar-fill" style={{ height: bar.height }}>
                  <span className="bar-tooltip">{bar.orders} orders</span>
                </div>
                <span className="bar-label">{bar.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Bowls Performance */}
        <div className="dash-card">
          <div className="card-header-flex">
            <h3>Top Performing Fresh Bowls</h3>
            <span className="badge-pill">Today</span>
          </div>

          <div className="top-bowls-list">
            {topSellingBowls.map((item, index) => (
              <div key={index} className="bowl-perf-item">
                <div className="bowl-perf-info">
                  <span className="bowl-rank">#{index + 1}</span>
                  <div>
                    <div className="bowl-name">{item.name}</div>
                    <div className="bowl-count">{item.sales} orders served</div>
                  </div>
                </div>

                <div className="bowl-perf-stats">
                  <span className="bowl-revenue">{item.revenue}</span>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: item.percentage }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Actions & Live Stream */}
      <div className="dashboard-grid-2col bottom-row">
        {/* Live Activity Log */}
        <div className="dash-card">
          <div className="card-header-flex">
            <h3>Live Kitchen & Operations Feed</h3>
            <button className="text-link-btn" onClick={() => onSwitchTab('kds')}>Open KDS Screen →</button>
          </div>

          <div className="activity-feed">
            {recentActivities.map((act, i) => (
              <div key={i} className={`activity-item type-${act.type}`}>
                <span className="activity-time">{act.time}</span>
                <span className="activity-text">{act.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Manager Actions */}
        <div className="dash-card quick-actions-card">
          <h3>Quick Kitchen Controls</h3>
          <div className="quick-actions-grid">
            <button className="action-tile" onClick={() => onSwitchTab('kds')}>
              <span className="tile-icon">🍳</span>
              <span className="tile-title">Kitchen Display System</span>
              <span className="tile-desc">Manage active order tickets</span>
            </button>

            <button className="action-tile" onClick={() => onSwitchTab('inventory')}>
              <span className="tile-icon">📦</span>
              <span className="tile-title">Ingredient Stock</span>
              <span className="tile-desc">Update availability & stock</span>
            </button>

            <button className="action-tile" onClick={() => onSwitchTab('tables')}>
              <span className="tile-icon">🪑</span>
              <span className="tile-title">Dine-in Floorplan</span>
              <span className="tile-desc">Assign & clear tables</span>
            </button>

            <button className="action-tile highlight" onClick={() => alert('Daily Kitchen Summary Report exported!')}>
              <span className="tile-icon">📄</span>
              <span className="tile-title">Export EOD Report</span>
              <span className="tile-desc">Download financial metrics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExecutiveDashboard;
