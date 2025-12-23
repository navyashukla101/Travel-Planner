import React from "react";

function ActivityTimeline({ day }) {
  if (!day.activities || day.activities.length === 0) {
    return (
      <div style={{ padding: "1rem", color: "#9ca3af" }}>
        No activities scheduled
      </div>
    );
  }

  // Filter activities with times
  const timedActivities = day.activities.filter(
    (a) => a.startTime && a.endTime
  );
  if (timedActivities.length === 0) {
    return (
      <div style={{ padding: "1rem", color: "#9ca3af" }}>
        No timed activities scheduled
      </div>
    );
  }

  // Find day start and end times
  const times = timedActivities.map((a) => [
    new Date(a.startTime).getHours() * 60 + new Date(a.startTime).getMinutes(),
    new Date(a.endTime).getHours() * 60 + new Date(a.endTime).getMinutes(),
  ]);
  const dayStart = Math.min(...times.map((t) => t[0]));
  const dayEnd = Math.max(...times.map((t) => t[1]));

  // Calculate timeline height
  const totalMinutes = dayEnd - dayStart;
  const pxPerMinute = totalMinutes > 0 ? 400 / totalMinutes : 400 / 1440;

  // Helper: format time
  const formatTime = (date) => {
    const d = new Date(date);
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  };

  // Helper: minutes since day start
  const minutesSinceDayStart = (date) => {
    const d = new Date(date);
    return d.getHours() * 60 + d.getMinutes() - dayStart;
  };

  return (
    <div style={styles.timelineContainer}>
      <div style={styles.timelineLabel}>Timeline</div>
      <div style={styles.timelineWrapper}>
        <div style={styles.timelineGutter}>
          {Array.from({ length: Math.ceil(totalMinutes / 60) + 1 }).map(
            (_, i) => (
              <div key={i} style={styles.timeLabel}>
                {String(Math.floor(dayStart / 60) + i).padStart(2, "0")}:00
              </div>
            )
          )}
        </div>
        <div
          style={{
            ...styles.timelineTrack,
            height: `${totalMinutes * pxPerMinute}px`,
          }}
        >
          {timedActivities.map((act) => {
            const start = minutesSinceDayStart(act.startTime);
            const duration =
              new Date(act.endTime).getHours() * 60 +
              new Date(act.endTime).getMinutes() -
              (new Date(act.startTime).getHours() * 60 +
                new Date(act.startTime).getMinutes());

            return (
              <div
                key={act._id}
                style={{
                  ...styles.activityBlock,
                  top: `${start * pxPerMinute}px`,
                  height: `${duration * pxPerMinute}px`,
                  background: act.optional ? "#fef3c7" : "#dbeafe",
                  borderLeft: act.completed
                    ? "4px solid #10b981"
                    : "4px solid #3b82f6",
                }}
                title={act.title}
              >
                <div style={styles.blockTitle}>{act.title}</div>
                <div style={styles.blockTime}>
                  {formatTime(act.startTime)} - {formatTime(act.endTime)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  timelineContainer: {
    marginTop: "1rem",
    padding: "1rem",
    backgroundColor: "#f3f4f6",
    borderRadius: "4px",
  },
  timelineLabel: {
    fontWeight: "bold",
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
    color: "#374151",
  },
  timelineWrapper: {
    display: "flex",
    gap: "0.5rem",
  },
  timelineGutter: {
    width: "60px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    fontSize: "0.75rem",
    color: "#9ca3af",
    paddingTop: "0.25rem",
  },
  timeLabel: {
    height: "60px",
    display: "flex",
    alignItems: "flex-start",
    lineHeight: "1",
  },
  timelineTrack: {
    flex: 1,
    position: "relative",
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    minHeight: "200px",
  },
  activityBlock: {
    position: "absolute",
    left: "0",
    right: "0",
    padding: "0.5rem",
    margin: "2px",
    borderRadius: "4px",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  blockTitle: {
    fontWeight: "bold",
    fontSize: "0.75rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  blockTime: {
    fontSize: "0.65rem",
    color: "#666",
    marginTop: "2px",
  },
};

export default ActivityTimeline;
