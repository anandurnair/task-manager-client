import React, { useState, useEffect } from 'react';

const AddEditTaskModal = ({ isOpen, closeModal, saveTask, taskToEdit }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTaskName(taskToEdit.title);
      setTaskDescription(taskToEdit.description);
    } else {
      setTaskName('');
      setTaskDescription('');
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveTask({ taskName, taskDescription });
    closeModal();
    setTaskName('');
    setTaskDescription('');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
          <h2 className="text-2xl font-bold mb-4">
            {taskToEdit ? 'Edit Task' : 'Add New Task'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Task Name</label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Task Description</label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
                rows="4"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {taskToEdit ? 'Save Changes' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddEditTaskModal;
