import { apoiosApi } from '../features/apoios/api/apoiosApi';
import type { Form } from '../types';
import type { GetFormsParams } from '../features/apoios/types/apoios.types';

export type { GetFormsParams, Form };

/**
 * @deprecated Use `apoiosApi` from `features/apoios` directly.
 */
export const formsService = {
  getForms: apoiosApi.getForms,
  getFormById: apoiosApi.getFormById,
  createForm: apoiosApi.createForm,
  updateForm: apoiosApi.updateForm,
  updateStatus: apoiosApi.updateStatus,
  deleteForm: apoiosApi.deleteForm,
};
