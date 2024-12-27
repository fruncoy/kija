import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut } from 'lucide-react';
import { Project } from '../types/project';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/storage';

export function ProjectSelectionPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const allProjects = storage.getProjects();
    const filteredProjects = user?.role === 'admin' 
      ? allProjects 
      : allProjects.filter(project => 
          project.assignedFundis.some(fundi => fundi.id === user?.id)
        );
    setProjects(filteredProjects);
  }, [user]);

  const handleDeleteProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      storage.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  const handleEditProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    navigate(`/projects/edit/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
              <p className="mt-1 text-sm text-gray-500">Select a project to continue</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 text-gray-700 hover:text-red-600"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {user?.role === 'admin' && (
              <div
                onClick={() => navigate('/projects/new')}
                className="flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 cursor-pointer hover:border-[#FF8001] hover:bg-gray-100 transition-colors"
              >
                <div className="text-center">
                  <Plus className="h-8 w-8 mx-auto text-gray-400" />
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Add New Project
                  </span>
                </div>
              </div>
            )}

            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/dashboard/${project.id}`)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow relative group"
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleEditProject(e, project.id)}
                    className="p-1 text-gray-500 hover:text-[#FF8001] mr-1"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteProject(e, project.id)}
                    className="p-1 text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full
                    ${project.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      project.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {project.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(project.startDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}