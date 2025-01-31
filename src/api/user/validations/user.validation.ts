import * as yup from 'yup';

export const userCreateSchema = yup.object().shape({
  firstName: yup
    .string()
    .strict(true)
    .trim()
    .min(3, 'first name must be at least 3 characters')
    .max(50, 'first name must be at most 50 characters'),

  lastName: yup
    .string()
    .strict(true)
    .trim()
    .min(3, 'Last name must be at least 3 characters')
    .max(50, 'Last name must be at most 50 characters'),

  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  emailVerified: yup.boolean().typeError('Invalid email verification status'),
  authExternalId: yup.string().required('authExternalId is required'),
});

export type UserCreateType = yup.InferType<typeof userCreateSchema>;

export const userUpdateSchema = yup.object().shape({
  firstName: yup
    .string()
    .strict(true)
    .trim()
    .min(3, 'first name must be at least 3 characters')
    .max(50, 'first name must be at most 50 characters')
    .optional(),
  lastName: yup
    .string()
    .strict(true)
    .trim()
    .min(3, 'Last name must be at least 3 characters')
    .max(50, 'Last name must be at most 50 characters')
    .optional(),
  jobTitle: yup
    .string()
    .strict(true)
    .trim()
    .max(100, 'Job title must be at most 100 characters')
    .optional(),
  phoneNumber: yup
    .string()
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
      'Invalid phone number format',
    )
    .optional(),
});

export type UserUpdateType = yup.InferType<typeof userUpdateSchema>;
