import * as Yup from 'yup';

export let schema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  surname: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8).required('Password is required'),
  passwordConfirm: Yup.mixed().oneOf([Yup.ref('password'), null], 'Passwords must match')
});

export type User = Yup.InferType<typeof schema>;