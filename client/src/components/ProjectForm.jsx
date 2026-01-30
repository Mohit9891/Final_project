import React from "react";
import { Plus, Trash2, FolderGit2 } from "lucide-react";

const ProjectForm = ({ data, onChange }) => {
  const addProject = () => {
    const newProject = {
      name: "",
      type: "",
      description: "",
    };
    onChange([...data, newProject]);
  };

  const removeProject = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateProject = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Projects
          </h3>
          <p className="text-sm text-gray-500">
            Add your academic or personal projects
          </p>
        </div>

        <button
          onClick={addProject}
          type="button"
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
        >
          <Plus className="size-4" />
          Add Project
        </button>
      </div>

      {/* Empty State */}
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FolderGit2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No projects added yet</p>
          <p>Click "Add Project" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4 mt-4">
          {data.map((project, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <h4 className="font-medium">
                  Project #{index + 1}
                </h4>
                <button
                  onClick={() => removeProject(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* Inputs */}
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={project.name}
                  onChange={(e) =>
                    updateProject(index, "name", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border rounded-lg"
                />

                <input
                  type="text"
                  placeholder="Project Type (Web App, ML, Android, etc.)"
                  value={project.type}
                  onChange={(e) =>
                    updateProject(index, "type", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border rounded-lg"
                />

                <textarea
                  placeholder="Project Description"
                  value={project.description}
                  onChange={(e) =>
                    updateProject(index, "description", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border rounded-lg"
                  rows={4}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
