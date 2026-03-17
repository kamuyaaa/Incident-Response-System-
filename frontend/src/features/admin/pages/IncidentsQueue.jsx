import { useMemo, useState } from "react";
import "./IncidentsQueue.css";

const mockIncidents = [
  {
    id: "INC-1001",
    type: "Medical Emergency",
    location: "TRM, Thika Road",
    description:
      "A person has collapsed near the entrance and is not responding.",
    priority: "High",
    status: "Unassigned",
    reportedAt: "3 mins ago",
  },
  {
    id: "INC-1002",
    type: "Fire & Rescue",
    location: "Eastleigh, Nairobi",
    description:
      "Smoke is coming from the upper floors of a residential building.",
    priority: "Critical",
    status: "Assigned",
    reportedAt: "8 mins ago",
  },
  {
    id: "INC-1003",
    type: "Road & Transport",
    location: "Muthaiga Roundabout",
    description:
      "Two vehicles collided and traffic is building up quickly.",
    priority: "Medium",
    status: "Unassigned",
    reportedAt: "12 mins ago",
  },
  {
    id: "INC-1004",
    type: "Crime & Safety",
    location: "CBD, Nairobi",
    description:
      "A robbery has just been reported at a small electronics shop.",
    priority: "High",
    status: "In Progress",
    reportedAt: "20 mins ago",
  },
  {
    id: "INC-1005",
    type: "Public Safety & Welfare",
    location: "Bus Park, Nairobi",
    description:
      "A child appears lost and several people are trying to help.",
    priority: "Low",
    status: "Resolved",
    reportedAt: "45 mins ago",
  },
];

export default function IncidentsQueue() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const filteredIncidents = useMemo(() => {
    return mockIncidents.filter((incident) => {
      const matchesSearch =
        incident.type.toLowerCase().includes(search.toLowerCase()) ||
        incident.location.toLowerCase().includes(search.toLowerCase()) ||
        incident.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || incident.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || incident.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [search, statusFilter, priorityFilter]);

  return (
    <div className="incidents-queue-page">
      <div className="incidents-queue-header">
        <div>
          <h1>Incidents Queue</h1>
          <p>Monitor, filter, and manage all reported incidents.</p>
        </div>
      </div>

      <div className="queue-toolbar">
        <input
          type="text"
          placeholder="Search by type, location, or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="queue-search"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="queue-select"
        >
          <option value="All">All Statuses</option>
          <option value="Unassigned">Unassigned</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="queue-select"
        >
          <option value="All">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="queue-stats">
        <div className="queue-stat-card">
          <span>Total</span>
          <strong>{filteredIncidents.length}</strong>
        </div>
        <div className="queue-stat-card">
          <span>Unassigned</span>
          <strong>
            {filteredIncidents.filter((i) => i.status === "Unassigned").length}
          </strong>
        </div>
        <div className="queue-stat-card">
          <span>High/Critical</span>
          <strong>
            {
              filteredIncidents.filter(
                (i) => i.priority === "High" || i.priority === "Critical"
              ).length
            }
          </strong>
        </div>
      </div>

      <div className="queue-list">
        {filteredIncidents.map((incident) => (
          <div key={incident.id} className="queue-card">
            <div className="queue-card-top">
              <div>
                <h3>{incident.type}</h3>
                <p>{incident.location}</p>
              </div>

              <div className="queue-badges">
                <span className={`priority-badge ${incident.priority.toLowerCase()}`}>
                  {incident.priority}
                </span>
                <span
                  className={`status-badge ${incident.status
                    .toLowerCase()
                    .replace(/\s/g, "-")}`}
                >
                  {incident.status}
                </span>
              </div>
            </div>

            <p className="queue-description">{incident.description}</p>

            <div className="queue-meta">
              <span>{incident.id}</span>
              <span>Reported: {incident.reportedAt}</span>
            </div>

            <div className="queue-actions">
              <button className="view-btn">View Details</button>
              <button className="assign-btn">
                {incident.status === "Unassigned" ? "Assign" : "Manage"}
              </button>
            </div>
          </div>
        ))}

        {filteredIncidents.length === 0 && (
          <div className="queue-empty">
            <p>No incidents match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
