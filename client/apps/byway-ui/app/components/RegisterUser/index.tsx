import {Form} from "remix";
import { TextInput } from "@mantine/core";

type RegisteruserProps = {
  errors: {
    [key: string]: string
  }
};

const RegisterUser = ({errors}: RegisteruserProps) => {
  return (
    <Form
      method="post"
      className="w-full max-w-lg">
      <div className="flex flex-col flex-wrap -mx-3 mb-6 gap-8">
        <div className="w-full px-3">
          <TextInput
            required
            name="firstName"
            label="First Name"
            placeholder="John"
            error={errors?.firstName}
          />
        </div>
        <div className="w-full px-3">
          <TextInput
            required
            name="surname"
            label="Last Name"
            placeholder="Smith"
            error={errors?.surname}
          />
        </div>
        <div className="w-full px-3">
          <TextInput
            required
            name="email"
            label="Email"
            type="email"
            placeholder="your.email@gmail.com"
            error={errors?.email}
          />
        </div>
        <div className="w-full px-3">
          <TextInput
            required
            name="password"
            label="Password"
            type="password"
            minLength={8}
            error={errors?.password}
          />
        </div>
        <div className="w-full px-3">
          <TextInput
            required
            name="passwordConfirm"
            label="Confirm Password"
            type="password"
            minLength={8}
            error={errors?.passwordConfirm}
          />
        </div>
        <button type="submit" role="submit" className="bg-blue-500 hover:bg-blue-700 self-end text-white py-2 px-4 mr-3 rounded focus:outline-none focus:shadow-outline">
          Register
        </button>
      </div>

    </Form>
  )
}

export default RegisterUser;