import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import TaskComponent from "../components/taskComponent";
import AddEditTaskModal from "../components/modals/addTask";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axiosinstance";
const Home = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get(`/getAllTasks`);
      console.log(response.data);

      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error.response.data);
      toast.success("Error fetching tasks", error.response.data);
    }
  };
  const onDeleteTask = async (id) => {
    try {
      const response = await axiosInstance.delete(`/deleteTask/${id}`);
      toast.success("Task deleted successfully");
      fetchTasks();
    } catch (error) {
      toast.error("Error deleting task");
      console.error("Error deleting task:", error);
    }
  }
  const addOrEditTask = async (task) => {
    try {
      if (taskToEdit) {
        // Edit existing task
        const response = await axiosInstance.put(
          `/updateTask/${taskToEdit._id}`,
          {title: task.taskName, description: task.taskDescription}
          
        );
        const updatedTasks = tasks.map((t) =>
          t._id === taskToEdit._id ? response.data : t
        );
        fetchTasks();
        setTasks(updatedTasks);
        setTaskToEdit(null); // Reset after editing
      } else {
        // Add new task
        const response = await axiosInstance.post(`/addTask`, task);

        toast.success("Task added successfully");
        setTasks([...tasks, response.data]);
        fetchTasks();
      }
      setIsModalOpen(false); // Close modal
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full h-screen ">
      <ToastContainer />
      <Navbar />
      <AddEditTaskModal
        isOpen={isModalOpen}
        closeModal={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        saveTask={addOrEditTask}
        taskToEdit={taskToEdit} // Pass task for editing
      />
      <div className="w-full h-screen flex flex-col p-10 gap-4">
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-20 h-10 bg-blue-500 text-white font-semibold rounded"
          >
            Add task
          </button>
        </div>

        <div className="w-full h-16 border-2 flex gap-2 items-center p-6 border-gray-100 shadow-md rounded-lg">
          <p className="font-semibold">Search :</p>
          <input
            type="text"
            placeholder="Search..."
            className="border-2 border-gray-200 w-full h-8 md:w-1/4 p-2 rounded"
          />
        </div>
        <div className="w-full flex gap-4 ">
          <div className="w-1/3 h-full border-2 p-3 border-gray-200 shadow-md rounded-lg">
            <div className="bg-blue-400 p-2 font-bold text-white rounded-sm">
              <h2>TODO</h2>
            </div>
            <div className="w-full h-96  flex flex-col py-4 gap-3 overflow-y-scroll">
              {tasks
                .filter((task) => task.status === "pending")
                .map((task) => (
                  <TaskComponent
                    key={task._id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
            </div>
          </div>

          <div className="w-1/3 h-full border-2 p-3 border-gray-200 shadow-md rounded-lg">
            <div className="bg-blue-400 p-2 font-bold text-white rounded-sm">
              <h2>IN PROGRESS</h2>
            </div>
            <div className="w-full h-full flex flex-col py-4 gap-3">
              {tasks
                .filter((task) => task.status === "in-progress")
                .map((task) => (
                  <TaskComponent
                    key={task._id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
            </div>
          </div>
          <div className="w-1/3 h-full border-2 p-3 border-gray-200 shadow-md rounded-lg">
            <div className="bg-blue-400 p-2 font-bold text-white rounded-sm">
              <h2>DONE</h2>
            </div>
            <div className="w-full h-full flex flex-col py-4 gap-3">
              {tasks
                .filter((task) => task.status === "completed")
                .map((task) => (
                  <TaskComponent
                    key={task._id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
