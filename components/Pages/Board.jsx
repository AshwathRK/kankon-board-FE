import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { toast, ToastContainer } from 'react-toastify';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Board() {
    const { id } = useParams();
    const [responseStatus, setResponseStatus] = useState([]);
    const [status, setStatus] = useState([]);
    const [responseTask, setResponseTask] = useState([]);
    const [task, setTasks] = useState([]);
    const [dragging, setDragging] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showCreateStatusModal, setShowCreateStatusModal] = useState(false);
    const [showEditStatusModal, setShowEditStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('');
    const [taskId, setTaskId] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [newStatusDescription, setNewStatusDescription] = useState('');
    const [editStatusId, setEditStatusId] = useState('');
    const [editStatusValue, setEditStatusValue] = useState('');
    const [editStatusDescription, setEditStatusDescription] = useState('');
    const [showDropdown, setShowDropdown] = useState(null);
    const [showDeleteStatusModal, setShowDeleteStatusModal] = useState(false);
    const [statusToDelete, setStatusToDelete] = useState(null);

    const fetchTasks = async () => {
        if (id) {
            try {
                const response = await axios.get(`${serverUrl}/alltask/${id}`, {
                    withCredentials: true,
                });
                setResponseTask(response.data.allTasks);
            } catch (error) {
                console.error(error);
                // toast.error('Failed to fetch tasks');
            }
        }
    };

    useEffect(() => {
        const fetchStatusData = async () => {
            if (id) {
                try {
                    const response = await axios.get(`${serverUrl}/status/${id}`, {
                        withCredentials: true,
                    });

                    setResponseStatus(response.data.getStatus);
                } catch (error) {
                    console.error(error);
                    toast.error('Failed to fetch status');
                }
            }
        };
        fetchStatusData();
        fetchTasks();
    }, [id]);

    useEffect(() => {
        if (responseStatus.length > 0) {
            const statusData = responseStatus.map((value) => ({ status: value.status, id: value._id }));
            setStatus(statusData);
        }
    }, [responseStatus]);

    useEffect(() => {
        if (responseTask.length > 0) {
            setTasks(responseTask);
        }
    }, [responseTask]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('.dropdown')) {
                setShowDropdown(null);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showDropdown]);

    const handleDragStart = (event, task) => {
        setDragging(task);
        event.dataTransfer.setData('task', JSON.stringify(task));
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = async (event, status) => {
        event.preventDefault();
        const droppedTask = JSON.parse(event.dataTransfer.getData('task'));
        if (droppedTask) {
            const updatedTasks = task.map((t) => {
                if (t._id === droppedTask._id) {
                    return { ...t, status: status.status };
                }
                return t;
            });
            setTasks(updatedTasks);

            setLoading(true);
            try {
                await axios.patch(`${serverUrl}/tasks/${droppedTask._id}`, { status: status.status }, {
                    withCredentials: true,
                });
                toast.success('Task updated successfully');
            } catch (error) {
                console.error(error);
                const revertedTasks = task.map((t) => {
                    if (t._id === droppedTask._id) {
                        return { ...t, status: droppedTask.status };
                    }
                    return t;
                });
                setTasks(revertedTasks);
                toast.error('Failed to update task');
            } finally {
                setLoading(false);
                setDragging(null);
            }
        }
    };

    const handleShowModal = (status) => {
        setSelectedStatus(status.status);
        setIsEdit(false);
        setShowModal(true);
    };

    const handleEditModal = (task) => {
        setTaskId(task._id);
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(new Date(task.dueDate).toISOString().split('T')[0]);
        setPriority(task.priority);
        setSelectedStatus(task.status);
        setIsEdit(true);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTitle('');
        setDescription('');
        setDueDate('');
        setPriority('');
        setTaskId('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isEdit) {
            try {
                await axios.patch(`${serverUrl}/tasks/${taskId}`, {
                    title,
                    description,
                    status: selectedStatus,
                    dueDate,
                    priority,
                }, {
                    withCredentials: true,
                });
                handleCloseModal();
                fetchTasks();
                toast.success('Task updated successfully');
            } catch (error) {
                console.error(error);
                toast.error('Failed to update task');
            }
        } else {
            try {
                await axios.post(`${serverUrl}/createTask`, {
                    title,
                    description,
                    status: selectedStatus,
                    projectId: id,
                    dueDate,
                    priority,
                }, {
                    withCredentials: true,
                });
                handleCloseModal();
                fetchTasks();
                toast.success('Task created successfully');
            } catch (error) {
                console.error(error);
                toast.error('Failed to create task');
            }
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${serverUrl}/tasks/${taskId}`, {
                withCredentials: true,
            });
            handleCloseModal();
            fetchTasks();
            toast.success('Task deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete task');
        }
    };

    const handleCreateStatusSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${serverUrl}/status`, {
                status: newStatus,
                description: newStatusDescription,
                projectId: id,
            }, {
                withCredentials: true,
            });
            setShowCreateStatusModal(false);
            setNewStatus('');
            setNewStatusDescription('');
            const getStatusResponse = await axios.get(`${serverUrl}/status/${id}`, {
                withCredentials: true,
            });
            setResponseStatus(getStatusResponse.data.getStatus);
            toast.success('Status created successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create status');
        }
    };

    const handleEditStatus = (status) => {
        setEditStatusId(status.id);
        setEditStatusValue(status.status);
        setEditStatusDescription('');
        setShowEditStatusModal(true);
        setShowDropdown(null);
    };

    const handleEditStatusSubmit = async (event) => {
        debugger
        event.preventDefault();
        console.log(editStatusId, editStatusValue, editStatusDescription, id)
        try {
            await axios.patch(`${serverUrl}/status/${editStatusId}`, {
                status: editStatusValue,
                description: editStatusDescription,
                projectId: id,
            }, {
                withCredentials: true,
            });
            setShowEditStatusModal(false);
            const response = await axios.get(`${serverUrl}/status/${id}`, {
                withCredentials: true,
            });
            setResponseStatus(response.data.getStatus);
            toast.success('Status updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update status');
        }
    };

    const handleDeleteStatusModal = (status) => {
        setStatusToDelete(status);
        setShowDeleteStatusModal(true);
        setShowDropdown(null);
    };

    const handleConfirmDeleteStatus = async () => {
        try {
            await axios.delete(`${serverUrl}/status/${statusToDelete.id}`, {
                withCredentials: true,
            });
            const response = await axios.get(`${serverUrl}/status/${id}`, {
                withCredentials: true,
            });
            setResponseStatus(response.data.getStatus);
            if (response.data.getStatus.length === 0) {
                window.location.reload();
            }
            toast.success('Status deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete status');
        }
        setShowDeleteStatusModal(false);
        setStatusToDelete(null);
    };

    const handleDropdownToggle = (id) => {
        setShowDropdown(showDropdown === id ? null : id);
    };

    return (
        <>
            <ToastContainer />
            <div className='boardMenus flex justify-end items-center'>
                <button type='button' className='createProjectBtn poppins-semibold' onClick={() => setShowCreateStatusModal(true)}>Add New Column</button>
            </div>
            <div className='flex overflow-x-auto flex-nowrap mx-6 board'>
                {
                    status.map((value, index) => (
                        <div key={index} className={`${value.status} boxModel my-scrollbar rounded m-1 flex flex-col overflow-y-auto flex-nowrap`} onDragOver={handleDragOver} onDrop={(event) => handleDrop(event, value)}>
                            <div className='boardTitle px-3 sticky top-0 z-10'>
                                <h4>{value.status}</h4>
                                <div className="relative dropdown flex justify-between w-15 ">
                                    <img src="/Add.png" className='w-5 cardIcons add' alt="add-card" onClick={() => handleShowModal(value)} />
                                    <img src="/dots.png" className='w-5 cardIcons add' alt="add-card" onClick={() => handleDropdownToggle(value.id)} />
                                    {showDropdown === value.id && (
                                        <ul className="absolute bg-white shadow-md p-2 right-0 top-0 z-10">
                                            <li><button className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100" onClick={() => handleEditStatus(value)}>Edit</button></li>
                                            <li><button className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100" onClick={() => handleDeleteStatusModal(value)}>Delete</button></li>
                                        </ul>
                                    )}
                                </div>
                            </div>
                            {
                                task.filter(task => task.status === value.status).map((task, index) => (
                                    <div
                                        className='card cursor-grab active:cursor-grabbing m-0.5 flex justify-start items-center p-2'
                                        key={index}
                                        draggable={true}
                                        onDragStart={(event) => handleDragStart(event, task)}
                                        style={{ minHeight: '7rem', overflow: 'hidden' }}
                                        onClick={() => handleEditModal(task)}
                                    >
                                        <div className='flex flex-col w-100'>
                                            <div className='flex justify-between w-100'>
                                                <h5 className="truncate font-bold">{task.title}</h5>
                                                <p className="text-sm">Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                                            </div>
                                            <p className="text-sm truncate">{task.description}</p>
                                            <div className='flex justify-between w-100'>
                                                <p className="text-sm">Priority: {task.priority}</p>
                                                <p className="text-sm">Project ID: {task.projectId}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Edit Task' : 'Add Task'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={title} onChange={(event) => setTitle(event.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Control type="text" value={selectedStatus} disabled />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="dueDate">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="priority">
                            <Form.Label>Priority</Form.Label>
                            <Form.Select value={priority} onChange={(event) => setPriority(event.target.value)}>
                                <option value="">Select Priority</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </Form.Select>
                        </Form.Group>
                        {isEdit && (
                            <Button variant="danger" onClick={handleDelete} className="me-2">
                                Delete Task
                            </Button>
                        )}
                        <Button variant="primary" type="submit">
                            {isEdit ? 'Update Task' : 'Add Task'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showCreateStatusModal} onHide={() => setShowCreateStatusModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Column</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateStatusSubmit}>
                        <Form.Group className="mb-3" controlId="newStatus">
                            <Form.Label>Column Title</Form.Label>
                            <Form.Control type="text" value={newStatus} onChange={(event) => setNewStatus(event.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="newStatusDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={newStatusDescription} onChange={(event) => setNewStatusDescription(event.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Create Column
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showEditStatusModal} onHide={() => setShowEditStatusModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Column</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditStatusSubmit}>
                        <Form.Group className="mb-3" controlId="editStatusValue">
                            <Form.Label>Column Title</Form.Label>
                            <Form.Control type="text" value={editStatusValue} onChange={(event) => setEditStatusValue(event.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editStatusDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={editStatusDescription} onChange={(event) => setEditStatusDescription(event.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Update Column
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={showDeleteStatusModal} onHide={() => setShowDeleteStatusModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>When you delete this status, all your tasks with this status will be affected. Are you sure you want to delete this status?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteStatusModal(false)}>Close</Button>
                    <Button variant="danger" onClick={handleConfirmDeleteStatus}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}