import React, { useState, useEffect } from "react";

const TaskForm = ({
  onSubmit,
  onCancel,
  initialData = null,
  isEditing = false,
  className = "",
  showCharacterCount = false,
  allowAttachments = false,
  maxFileSize = 5120, // 5MB default
  allowedTypes = ['.txt', '.pdf', '.doc', '.docx', '.jpg', '.png'],
  ...props
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    assignee: '',
    tags: []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [attachments, setAttachments] = useState([]);

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'medium',
        status: initialData.status || 'pending',
        dueDate: initialData.dueDate || '',
        assignee: initialData.assignee || '',
        tags: initialData.tags || []
      });
    }
  }, [initialData]);

  // Run file validation whenever attachments change
  useEffect(() => {
    if (allowAttachments && attachments.length > 0) {
      validateFiles();
    }
  }, [attachments, allowAttachments]);

  // Validation functions
  const validateForm = () => {
    const newErrors = {};
    
    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'title must be less than 100 characters';
    }
    
    // Description validation - always check regardless of title
    if (formData.description.length > 1000) {
      newErrors.description = 'description must be less than 1000 characters';
    }
    
    // Email validation - always check if assignee has any value
    if (formData.assignee && formData.assignee.trim() && !isValidEmail(formData.assignee)) {
      newErrors.assignee = 'please enter a valid email address';
    }
    
    // Due date validation - always check if due date has any value
    if (formData.dueDate && formData.dueDate.trim()) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      if (selectedDate < today) {
        newErrors.dueDate = 'due date cannot be in the past';
      }
    }
    
    // File validation - always check if attachments exist
    if (allowAttachments && attachments.length > 0) {
      attachments.forEach(file => {
        if (file.size > maxFileSize * 1024) {
          newErrors.attachments = 'file size exceeds limit';
        }
        
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(fileExtension)) {
          newErrors.attachments = 'file type not allowed';
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Always validate on submit
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        attachments: allowAttachments ? attachments : undefined
      };
      
      await onSubmit(submitData);
      
      // Reset form if not editing
      if (!isEditing) {
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          status: 'pending',
          dueDate: '',
          assignee: '',
          tags: []
        });
        setAttachments([]);
        setErrors({});
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Only clear error when user starts typing, not during form submission
    // This allows validation errors to be displayed on form submission
    if (errors[field] && !isSubmitting) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle tag management
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle tag input change - parse all tags
  const handleTagInputChange = (value) => {
    setTagInput(value);
    
    // Parse all tags from the input
    const allTags = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);
    
    // Update form data with all tags
    setFormData(prev => ({
      ...prev,
      tags: allTags
    }));
  };

  // Handle tag input blur - parse any remaining text as a tag
  const handleTagInputBlur = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // Handle file attachments
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      setAttachments(prev => {
        const newAttachments = [...prev, file];
        // Clear any previous file errors
        setErrors(prevErrors => ({ ...prevErrors, attachments: '' }));
        return newAttachments;
      });
    });
  };

  // Validate files
  const validateFiles = () => {
    
    if (!allowAttachments || attachments.length === 0) {
      return;
    }
    
    const newErrors = { ...errors };
    let hasFileErrors = false;
    
    attachments.forEach(file => {
      
      if (file.size > maxFileSize * 1024) {
        newErrors.attachments = 'file size exceeds limit';
        hasFileErrors = true;
      }
      
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        newErrors.attachments = 'file type not allowed';
        hasFileErrors = true;
      }
    });
    
    if (!hasFileErrors) {
      delete newErrors.attachments;
    }
    
    setErrors(newErrors);
  };

  const handleRemoveAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form reset
  const handleReset = () => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'medium',
        status: initialData.status || 'pending',
        dueDate: initialData.dueDate || '',
        assignee: initialData.assignee || '',
        tags: initialData.tags || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: '',
        assignee: '',
        tags: []
      });
    }
    setAttachments([]);
    setErrors({});
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && onCancel) {
      onCancel();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`grid gap-4 sm:gap-6 ${className}`}
      onKeyDown={handleKeyDown}
      role="form"
      {...props}
    >
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </h2>
      </div>

      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter task title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        {showCharacterCount && (
          <p className="mt-1 text-sm text-gray-500">
            {formData.title.length}/100
          </p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter task description"
          rows={4}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        {showCharacterCount && (
          <p className="mt-1 text-sm text-gray-500">
            {formData.description.length}/1000
          </p>
        )}
      </div>

      {/* Priority and Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Priority Field */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Status Field */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Due Date and Assignee Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Due Date Field */}
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.dueDate ? 'border-red-500' : 'border-gray-300'
            }`}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
        </div>

        {/* Assignee Field */}
        <div>
          <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
            Assignee
          </label>
          <input
            id="assignee"
            type="email"
            value={formData.assignee}
            onChange={(e) => handleInputChange('assignee', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.assignee ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter assignee email"
          />
          {errors.assignee && <p className="mt-1 text-sm text-red-600">{errors.assignee}</p>}
        </div>
      </div>

      {/* Tags Field */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <div className="flex gap-2">
          <input
            id="tags"
            type="text"
            value={tagInput}
            onChange={(e) => handleTagInputChange(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            onBlur={handleTagInputBlur}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter tags separated by commas"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Add
          </button>
        </div>
        
        {/* Display existing tags */}
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                  aria-label={`Remove tag ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* File Attachments */}
      {allowAttachments && (
        <div>
          <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-1">
            Attachments
          </label>
          <input
            id="attachments"
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept={allowedTypes.join(',')}
          />
          {errors.attachments && <p className="mt-1 text-sm text-red-600">{errors.attachments}</p>}
          
          {/* Display attached files */}
          {attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(index)}
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Remove file ${file.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
              {isEditing ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            isEditing ? 'Update Task' : 'Create Task'
          )}
        </button>
        
        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Reset
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;