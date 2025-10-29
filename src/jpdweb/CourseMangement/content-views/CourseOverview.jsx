// components/content-views/CourseOverview.jsx (updated)
import React from 'react';
import { Folder, FileText, Brain, Save } from 'lucide-react';
import { useCourse } from '../../contexts/CourseContext';
import { updateCourse } from '../../api/ApiConnect';

export const CourseOverview = () => {
  const { courseId, courseMetadata } = useCourse();

  const totalModules = (courseMetadata.chapters || []).reduce(
    (sum, chapter) => sum + (chapter.modules || []).length,
    0
  );

  const totalContentTypes = (courseMetadata.chapters || []).reduce(
    (sum, chapter) =>
      sum +
      (chapter.modules || []).reduce((mSum, module) => mSum + (module.contentTypes || []).length, 0),
    0
  );

  const handleSave = async () => {
    try {
      await updateCourse(courseId, courseMetadata);
      alert('Course saved successfully!');
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course');
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{courseMetadata.name}</h2>
          <p className="text-gray-600">Course Overview and Management</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Course
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={Folder}
          label="Chapters"
          value={courseMetadata.chapters?.length || 0}
          color="blue"
        />
        <StatCard icon={FileText} label="Modules" value={totalModules} color="green" />
        <StatCard icon={Brain} label="Content Types" value={totalContentTypes} color="purple" />
      </div>

      {/* Status */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Course Status</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            courseMetadata.public ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {courseMetadata.public ? 'Public' : 'Private'}
        </span>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      label: 'text-blue-600',
      value: 'text-blue-800',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      label: 'text-green-600',
      value: 'text-green-800',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: 'text-purple-600',
      label: 'text-purple-600',
      value: 'text-purple-800',
    },
  };

  const colors = colorMap[color];

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-4`}>
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-8 h-8 ${colors.icon}`} />
        <div>
          <p className={`text-sm ${colors.label} font-medium`}>{label}</p>
          <p className={`text-2xl font-bold ${colors.value}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};