import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUserDetails, clearUserDetails } from '../../src/slices/userslices';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Project() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.userDetails?.user);
    const [projects, setProjects] = useState([]);
    const [fetched, setFetched] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [editProjectId, setEditProjectId] = useState('');
    const [editProjectName, setEditProjectName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteProjectId, setDeleteProjectId] = useState('');
    const modalRef = useRef(null);
    const triggerRef = useRef(null);
    const editModalRef = useRef(null);
    const editTriggerRef = useRef(null);
    const deleteModalRef = useRef(null);

    if (!userInfo) {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${serverUrl}/user`, {
                    withCredentials: true,
                });

                if (response.data?.status && response.data?.user) {
                    dispatch(addUserDetails(response.data.user));
                    setFetched(true);
                } else {
                    throw new Error(response.data.message);
                }
            } catch (error) {
                console.error("Error in fetchUserDetails:", error);
                toast.error("Session expired, please log in again");
                dispatch(clearUserDetails());
                localStorage.setItem('isAuthenticated', 'false');
                navigate('/login');
            }
        };

        if (!fetched) {
            fetchUserDetails();
        }
    }

    useEffect(() => {
        const fetchProjectsData = async () => {
            if (userInfo?._id) {
                try {
                    const response = await axios.get(`${serverUrl}/projects/${userInfo._id}`, {
                        withCredentials: true,
                    });
                    setProjects([...response.data.projects]);
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchProjectsData();
    }, [userInfo]);

    const handleCreateProject = (e) => {
        triggerRef.current = e.target;
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        triggerRef.current.focus();
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        editTriggerRef.current.focus();
    };

    const handleSendMessage = async () => {
        try {
            const userID = userInfo?._id;
            if (!userID) {
                toast.error("User not found");
                return;
            }

            const response = await axios.post(`${serverUrl}/projects`,
                { title: projectName, description, userID }, { withCredentials: true });

            // Fetch the updated list of projects
            const projectsResponse = await axios.get(`${serverUrl}/projects/${userID}`, {
                withCredentials: true,
            });
            setProjects([...projectsResponse.data.projects]);

            toast.success("Project created!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create project");
        }

        setProjectName('');
        setDescription('');
        setShowCreateModal(false);
        triggerRef.current.focus();
    };

    const handleUpdateProject = async () => {
        try {
            const response = await axios.put(`${serverUrl}/projects/${editProjectId}`,
                { title: editProjectName, description: editDescription }, { withCredentials: true });

            // Fetch the updated list of projects
            const projectsResponse = await axios.get(`${serverUrl}/projects/${userInfo._id}`, {
                withCredentials: true,
            });
            if (projectsResponse && projectsResponse.data && projectsResponse.data.projects) {
                setProjects([...projectsResponse.data.projects]);
            } else {
                setProjects([]); // If no projects left, set projects to an empty array
            }

            toast.success("Project updated!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update project");
        }

        setShowEditModal(false);
        editTriggerRef.current.focus();
    };

    const handleProjectNameChange = (e) => {
        setProjectName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleEditProjectNameChange = (e) => {
        setEditProjectName(e.target.value);
    };

    const handleEditDescriptionChange = (e) => {
        setEditDescription(e.target.value);
    };

    const handleDeleteProject = async () => {
        try {
            const response = await axios.delete(`${serverUrl}/projects/${deleteProjectId}`)
            // Fetch the updated list of projects
            const projectsResponse = await axios.get(`${serverUrl}/projects/${userInfo._id}`, {
                withCredentials: true,
            });
            // setProjects([...projectsResponse.data.projects]);
            if (projectsResponse && projectsResponse.data && projectsResponse.data.projects) {
                setProjects([...projectsResponse.data.projects]);
            } else {
                setProjects([]); // If no projects left, set projects to an empty array
            }
            toast.success("Project deleted!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete project");
        }
        setShowDeleteModal(false);
    }

    const handleEditProject = (prod) => {
        editTriggerRef.current = document.activeElement;
        setEditProjectId(prod._id);
        setEditProjectName(prod.title);
        setEditDescription(prod.description);
        setShowEditModal(true);
    };

    const handleShowDeleteModal = (prodID) => {
        setDeleteProjectId(prodID);
        setShowDeleteModal(true);
    }

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    }

    useEffect(() => {
        if (showCreateModal) {
            const inputField = modalRef.current.querySelector('input');
            inputField.focus();
        }
    }, [showCreateModal]);

    useEffect(() => {
        if (showEditModal) {
            const inputField = editModalRef.current.querySelector('input');
            inputField.focus();
        }
    }, [showEditModal]);

    return (
        <>
            <div className='btnSection'>
                <button type="button" className="createProjectBtn poppins-semibold" onClick={handleCreateProject} ref={triggerRef}><img src='/Add.png' className='w-5'/>Create New Project</button>
            </div>
            <div className='project mx-2 border rounded'>
                <table className="table">
                    <thead className='tableTitle'>
                        <tr>
                            <th className='text-white poppins-semibold' scope="col">#</th>
                            <th className='text-white poppins-semibold' scope="col">Project</th>
                            <th className='text-white poppins-semibold' scope="col">Description</th>
                            <th className='text-white poppins-semibold' scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            projects.map((prod, index) => (
                                <tr key={index} className='cursor-pointer hover:opacity-50' onClick={() => navigate(`/user/board/${prod._id}`)}>
                                    <th scope="row">{index + 1} </th>
                                    <td>{prod.title}</td>
                                    <td>{prod.description}</td>
                                    <td className='flex'>
                                        <div>
                                        <button type='button' className='mx-2' onClick={(e) => {
                                            e.stopPropagation();
                                            handleShowDeleteModal(prod._id);
                                        }}><img src="/delete.png" className='w-6 delete' alt="Delete btn" /></button>
                                        <button type='button' className='mx-2' onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditProject(prod);
                                        }}><img src="/Edit.png" className='w-6 hover:opacity-70' alt="Edit btn" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {showCreateModal && (
                <div className="modal fade show" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" style={{ display: 'block' }} ref={modalRef}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">New Project</h1>
                                <button type="button" className="btn-close" onClick={handleCloseCreateModal} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label for="project-name" className="col-form-label">Project Name:</label>
                                        <input type="text" className="form-control" id="project-name" value={projectName} onChange={handleProjectNameChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label for="description" className="col-form-label">Description:</label>
                                        <textarea className="form-control" id="description" value={description} onChange={handleDescriptionChange}></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseCreateModal}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleSendMessage}>Create Project</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showEditModal && (
                <div className="modal fade show" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" style={{ display: 'block' }} ref={editModalRef}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="editModalLabel">Edit Project</h1>
                                <button type="button" className="btn-close" onClick={handleCloseEditModal} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label for="edit-project-name" className="col-form-label">Project Name:</label>
                                        <input type="text" className="form-control" id="edit-project-name" value={editProjectName} onChange={handleEditProjectNameChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label for="edit-description" className="col-form-label">Description:</label>
                                        <textarea className="form-control" id="edit-description" value={editDescription} onChange={handleEditDescriptionChange}></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleUpdateProject}>Update Project</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteModal && (
                <div className="modal fade show" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" style={{ display: 'block' }} ref={deleteModalRef}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="deleteModalLabel">Delete Project</h1>
                                <button type="button" className="btn-close" onClick={handleCloseDeleteModal} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>When you delete this project, all your task details will be deleted. Are you sure you want to delete this project?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}>Close</button>
                                <button type="button" className="btn btn-danger" onClick={handleDeleteProject}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </>
    );
}