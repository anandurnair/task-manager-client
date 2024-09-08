import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  const [draggedTask, setDraggedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Separate sort options for each status
  const [sortOptions, setSortOptions] = useState({
    pending: "latest",
    "in-progress": "latest",
    completed: "latest",
  });

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/getAllTasks`);
      setTasks(response.data.tasks);
    } catch (error) {
      toast.error("Error fetching tasks");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchTasks();
    }
  }, [navigate, fetchTasks]);

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = useCallback(async (status) => {
    if (!draggedTask) return;

    try {
      await axiosInstance.put(`/updateStatus/${draggedTask._id}`, { status });
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === draggedTask._id ? { ...t, status } : t
        )
      );
    } catch (error) {
      toast.error("Error updating task status");
    } finally {
      setDraggedTask(null);
    }
  }, [draggedTask]);

  const onDeleteTask = useCallback(async (id) => {
    try {
      await axiosInstance.delete(`/deleteTask/${id}`);
      toast.success("Task deleted successfully");
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      toast.error("Error deleting task");
    }
  }, []);

  const addOrEditTask = useCallback(
    async (task) => {
      try {
        if (taskToEdit) {
          await axiosInstance.put(`/updateTask/${taskToEdit._id}`, {
            title: task.taskName,
            description: task.taskDescription,
          });
          setTasks((prevTasks) =>
            prevTasks.map((t) =>
              t._id === taskToEdit._id
                ? { ...taskToEdit, title: task.taskName, description: task.taskDescription }
                : t
            )
          );
          setTaskToEdit(null);
        } else {
          await axiosInstance.post(`/addTask`, task);
          toast.success("Task added successfully");
          setTasks((prevTasks) => [...prevTasks, task]);
        }
        setIsModalOpen(false);
      } catch (error) {
        toast.error("Error saving task");
      }
    },
    [taskToEdit]
  );

  const handleEditTask = useCallback((task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to handle individual sort option change for each column
  const handleSortChange = (status, value) => {
    setSortOptions((prevSortOptions) => ({
      ...prevSortOptions,
      [status]: value,
    }));
  };

  // Memoize the filtered and sorted tasks based on status and sort option
  const getSortedTasks = (tasks, status, sortOption) => {
    let filteredTasks = tasks.filter((task) => task.status === status && task.title.toLowerCase().includes(searchQuery.toLowerCase()));

    if (sortOption === "ascending") {
      filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "descending") {
      filteredTasks.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOption === "latest") {
      filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "oldest") {
      filteredTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return filteredTasks;
  };

  return (
    <div className="w-full">
      <ToastContainer />
      <Navbar />
      <AddEditTaskModal
        isOpen={isModalOpen}
        closeModal={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        saveTask={addOrEditTask}
        taskToEdit={taskToEdit}
      />
      <div className="w-full h-full flex flex-col p-2 md:p-10 gap-4">
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-20 h-10 bg-blue-500 text-white font-semibold rounded"
          >
            Add task
          </button>
        </div>
        <div className="w-full h-16 border-2 flex gap-2 items-center p-6 border-gray-100 shadow-md rounded-lg">
          <p className="font-semibold text-sm hidden md:block">Search :</p>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="border-2 border-gray-200 w-full h-8 md:w-1/4 p-2 rounded"
          />
        </div>

        <div className="w-full h-full flex md:flex-row flex-col gap-4">
          {["pending", "in-progress", "completed"].map((status) => (
            <div
              key={status}
              className="md:w-1/3 w-full h-full border-2 p-3 border-gray-200 shadow-md rounded-lg"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(status)}
            >
              <div className="bg-blue-400 flex justify-between p-2 font-bold text-white rounded-sm">
                <h2>
                  {status.toUpperCase()} - {tasks.filter((task) => task.status === status).length}
                </h2>
                <div className="flex gap-3">
                  <select
                    className="text-black font-normal rounded text-sm"
                    value={sortOptions[status]}
                    onChange={(e) => handleSortChange(status, e.target.value)}
                  >
                    <option value="ascending">Ascending</option>
                    <option value="descending">Descending</option>
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>
              <div className="w-full h-lvh flex flex-col py-4 gap-3 overflow-y-scroll">
                {getSortedTasks(tasks, status, sortOptions[status]).map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className="cursor-pointer"
                  >
                    <TaskComponent
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={onDeleteTask}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
