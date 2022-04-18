import { redirect, json, useActionData } from 'remix'
import type { ActionFunction } from "remix";
import {
  registerUser
} from "~/pico/users.server";
import RegisterUser from "~/components/RegisterUser";
import { schema as userSchema, User } from "~/components/RegisterUser/RegisterUser.validation";

export const action: ActionFunction = async ({request}) => {
  const formData = await request.formData();
  const user: User = {
    firstName: formData.get('firstName') as string,
    surname: formData.get('surname') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    passwordConfirm: formData.get('passwordConfirm') as string,
  };
  const userErrors = {};
  await userSchema.validate(user).catch(e => {
    const field = e?.path ?? 'form'
    userErrors[field] = e?.errors.join(' ')
  });
  // console.log("Error", userErrors);
  // console.log("User", user);
  if (userErrors) {
    return json(userErrors);
  }
  //
  //
  //
  // //const resp = await registerUser({user})
  // console.log(user)
  return null;
}

const NewUserRoute = () => {
  const errors = useActionData();
  console.log(errors)

  return (
    <main className="m-10 p-10 bg-white rounded-lg">
      <h1 className="text-slate-600 text-4xl mb-4">Register New User</h1>
      <RegisterUser errors={errors}/>
    </main>
  );

}

export default NewUserRoute