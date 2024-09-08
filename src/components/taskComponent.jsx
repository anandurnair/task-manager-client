import React, { useState } from "react";
import ViewTaskModal from "./modals/viewTask"; // Import the new modal

const TaskComponent = ({ task, onEdit, onDelete }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleViewTask = () => {
    setIsViewModalOpen(true);
  };

  return (
    <div className="w-full min-h-40 p-3 bg-blue-100 rounded-md flex flex-col justify-between">
      <div>
        <h1 className="font-bold text-lg text-gray-900">{task?.title}</h1>
        <p className="text-gray-700 text-base">{task?.description}</p>
      </div>

      <div className="flex flex-col gap-2">
        <div>
          <p className="text-gray-500">Created at : {task?.createdAt}</p>
        </div>
        <div className="w-full flex gap-2 justify-end">
          <button
            className="bg-red-500 text-white px-4 rounded-md"
            onClick={() => onDelete(task._id)}
          >
            Delete
          </button>
          <button
            className="bg-blue-400 text-white px-4 rounded-md"
            onClick={() => onEdit(task)}
          >
            Edit
          </button>

          <button
            className="bg-blue-500 text-white px-4 rounded-md"
            onClick={handleViewTask}
          >
            View details
          </button>
        </div>
      </div>

      {/* View Task Modal */}
      <ViewTaskModal
        isOpen={isViewModalOpen}
        closeModal={() => setIsViewModalOpen(false)}
        task={task}
      />
    </div>
  );
};

export default TaskComponent;
