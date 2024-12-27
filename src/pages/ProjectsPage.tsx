import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { ProjectList } from '../components/projects/ProjectList';
import { ProjectForm } from '../components/projects/ProjectForm';
import { Project, ProjectFormData } from '../types/project';
import { storage } from '../utils/storage';

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setProjects(storage.getProjects());
  }, []);

  const handleCreateProject = (formData: ProjectFormData) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      ...formData,
      images: [],
      files: [],
      assignedFundis: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.saveProject(newProject);
    setProjects([...projects, newProject]);
    setIsFormOpen(false);
  };

  const handleUpdateProject = (formData: ProjectFormData) => {
    if (!selectedProject) return;

    const updatedProject: Project = {
      ...selectedProject,
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    storage.updateProject(updatedProject);
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setSelectedProject(null);
    setIsFormOpen(false);
    setIsEditMode(false);
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      storage.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      setSelectedProject(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Management</h1>
        <button
          onClick={() => {
            setIsFormOpen(true);
            setIsEditMode(false);
            setSelectedProject(null);
          }}
          className="flex items-center px-4 py-2 bg-[#FF8001] text-white rounded-lg hover:bg-[#FF8001]/90"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Project
        </button>
      </div>

      {isFormOpen ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditMode ? 'Edit Project' : 'Create New Project'}
          </h2>
          <ProjectForm
            initialData={selectedProject || undefined}
            onSubmit={isEditMode ? handleUpdateProject : handleCreateProject}
            onCancel={() => {
              setIsFormOpen(false);
              setIsEditMode(false);
              setSelectedProject(null);
            }}
          />
        </div>
      ) : selectedProject ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold">{selectedProject.name}</h2>
              <p className="text-gray-600 mt-1">{selectedProject.description}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setIsFormOpen(true);
                  setIsEditMode(true);
                }}
                className="px-4 py-2 bg-[#FF8001] text-white rounded-lg hover:bg-[#FF8001]/90"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteProject(selectedProject.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-medium text-gray-700">Status</h3>
              <p>{selectedProject.status}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Priority</h3>
              <p>{selectedProject.priority}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Start Date</h3>
              <p>{new Date(selectedProject.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">End Date</h3>
              <p>{new Date(selectedProject.endDate).toLocaleDateString()}</p>
            </div>
          </div>

          <button
            onClick={() => setSelectedProject(null)}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Projects
          </button>
        </div>
      ) : (
        <ProjectList
          projects={projects}
          onProjectClick={setSelectedProject}
        />
      )}
    </div>
  );
}