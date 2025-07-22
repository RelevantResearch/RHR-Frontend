import { ProjectFormData, UserAssignment } from '@/types/projects';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ProjectValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  fieldErrors: Record<string, string>;
}

export const validateProjectForm = (
  formData: ProjectFormData,
  userAssignments: UserAssignment[]
): ProjectValidationResult => {
  const errors: ValidationError[] = [];
  const fieldErrors: Record<string, string> = {};

  // Required field validations
  const requiredFields = [
    { field: 'name', label: 'Project Name' },
    { field: 'clientName', label: 'Client Name' },
    { field: 'description', label: 'Project Description' },
    { field: 'department', label: 'Department' },
    { field: 'budget', label: 'Budget' },
    { field: 'startDate', label: 'Start Date' },
    { field: 'deadline', label: 'Deadline' },
  ];

  requiredFields.forEach(({ field, label }) => {
    const value = formData[field as keyof ProjectFormData];
    if (!value || value.toString().trim() === '') {
      const error = { field, message: `${label} is required` };
      errors.push(error);
      fieldErrors[field] = error.message;
    }
  });

  // Budget validation
  if (formData.budget) {
    const budgetValue = parseFloat(formData.budget);
    if (isNaN(budgetValue) || budgetValue < 0) {
      const error = { field: 'budget', message: 'Budget must be a valid positive number' };
      errors.push(error);
      fieldErrors['budget'] = error.message;
    }
  }

  // Date validations
  if (formData.startDate && formData.endDate) {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (endDate < startDate) {
      const error = { field: 'endDate', message: 'End date must be after start date' };
      errors.push(error);
      fieldErrors['endDate'] = error.message;
    }
  }

  if (formData.startDate && formData.deadline) {
    const startDate = new Date(formData.startDate);
    const deadline = new Date(formData.deadline);

    if (deadline < startDate) {
      const error = { field: 'deadline', message: 'Deadline must be after start date' };
      errors.push(error);
      fieldErrors['deadline'] = error.message;
    }
  }

  // Team members validation
  if (userAssignments.length === 0) {
    const error = { field: 'userAssignments', message: 'At least one team member must be assigned' };
    errors.push(error);
    fieldErrors['userAssignments'] = error.message;
  }

  // Project name length validation
  if (formData.name && formData.name.length > 100) {
    const error = { field: 'name', message: 'Project name must be less than 100 characters' };
    errors.push(error);
    fieldErrors['name'] = error.message;
  }

  // Description length validation
  if (formData.description && formData.description.length > 1000) {
    const error = { field: 'description', message: 'Description must be less than 1000 characters' };
    errors.push(error);
    fieldErrors['description'] = error.message;
  }

  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors,
  };
};

// Validate individual field for real-time validation
export const validateField = (
  field: keyof ProjectFormData | 'userAssignments',
  value: string | UserAssignment[],
  formData?: ProjectFormData
): string => {
  switch (field) {
    case 'name':
      if (!value || value.toString().trim() === '') {
        return 'Project Name is required';
      }
      if (value.toString().length > 100) {
        return 'Project name must be less than 100 characters';
      }
      break;

    case 'clientName':
      if (!value || value.toString().trim() === '') {
        return 'Client Name is required';
      }
      break;

    case 'description':
      if (!value || value.toString().trim() === '') {
        return 'Project Description is required';
      }
      if (value.toString().length > 1000) {
        return 'Description must be less than 1000 characters';
      }
      break;

    case 'department':
      if (!value || value.toString().trim() === '') {
        return 'Department is required';
      }
      break;

    case 'budget':
      if (!value || value.toString().trim() === '') {
        return 'Budget is required';
      }
      const budgetValue = parseFloat(value.toString());
      if (isNaN(budgetValue) || budgetValue < 0) {
        return 'Budget must be a valid positive number';
      }
      break;

    case 'startDate':
      if (!value || value.toString().trim() === '') {
        return 'Start Date is required';
      }
      break;

    case 'deadline':
      if (!value || value.toString().trim() === '') {
        return 'Deadline is required';
      }
      if (formData?.startDate && value) {
        const startDate = new Date(formData.startDate);
        const deadline = new Date(value.toString());
        if (deadline < startDate) {
          return 'Deadline must be after start date';
        }
      }
      if (formData?.endDate && value) {
        const deadline = new Date(value.toString());
        const endDate = new Date(formData.endDate);
        if (deadline > endDate) {
          return 'Deadline must not be after the end date';
        }
      }
      break;


    case 'endDate':
      if (value && formData?.startDate) {
        const startDate = new Date(formData.startDate);
        const endDate = new Date(value.toString());
        if (endDate < startDate) {
          return 'End date must be after start date';
        }
      }
      break;

    case 'userAssignments':
      if (Array.isArray(value) && value.length === 0) {
        return 'At least one team member must be assigned';
      }
      break;
  }

  return '';
};