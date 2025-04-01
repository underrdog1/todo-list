import React from "react";

export const Task = (props) => {
  return (
    <div className="task">
      <span>{props.taskName}</span>

      <div className="task-buttons">
        <button
          className={`complete-btn ${props.completed ? "completed" : ""}`}
          onClick={() => props.completeTask(props.id)}
        >
          {props.completed ? "Completed" : "Complete"}
        </button>

        <button
          className="delete-btn"
          onClick={() => props.deleteTask(props.id)}
        >
          X
        </button>
      </div>
    </div>
  );
};