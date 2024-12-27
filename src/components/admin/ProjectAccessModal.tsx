import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Project } from '../../types/project';
import { AccessRequest, ProjectAccess } from '../../types/access';
import { accessStorage } from '../../utils/accessStorage';

interface ProjectAccessModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectAccessModal({ project, onClose }: ProjectAccessModalProps) {
  const [pendingRequests] = useState<AccessRequest[]>(
    accessStorage.getAccessRequests().filter(r => 
      r.status === 'pending' && 
      r.selectedProjects.includes(project.id)
    )
  );

  const handleApprove = (request: AccessRequest) => {
    accessStorage.updateAccessRequest(request.id, 'approved');
    const access = accessStorage.getProjectAccess(project.id) || {
      projectId: project.id,
      userIds: [],
      roles: {},
    };
    
    access.userIds.push(request.userId);
    access.roles[request.userId] = request.role;
    accessStorage.updateProjectAccess(project.id, access);
  };

  const handleReject = (request: AccessRequest) => {
    accessStorage.updateAccessRequest(request.id, 'rejected');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Manage Access - {project.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Pending Access Requests</h3>
            {pendingRequests.length === 0 ? (
              <p className="text-gray-500">No pending requests</p>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{request.name}</p>
                      <p className="text-sm text-gray-500">{request.email}</p>
                      <p className="text-sm text-gray-500">Role: {request.role}</p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleApprove(request)}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request)}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}