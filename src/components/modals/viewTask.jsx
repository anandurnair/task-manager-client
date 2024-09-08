import React from 'react';

const ViewTaskModal = ({ isOpen, closeModal, task }) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">View Task</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Task Name</label>
          <p className="mt-1 p-2 border-b-2 border-gray-300  w-full">{task.title}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Task Description</label>
          <p className="mt-1 p-2 border-b-2 border-gray-300  w-full">{task.description}</p>
        </div>

        {task.dueDate && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <p className="mt-1 p-2 border border-gray-300 rounded w-full">{task.dueDate}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskModal;
