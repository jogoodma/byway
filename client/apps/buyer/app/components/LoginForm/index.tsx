import React from "react";
import type { ActionFunction } from "remix";
import { useActionData, json } from "remix";
import { User } from "~/pico/users.server";

export interface LoginFormProps {
  user: User;
}

interface ActionData {
  formError?: string;
  fieldErrors?: {
    email: string | undefined;
    password: string | undefined;
  };
  fields?: {
    email: string;
    password: string;
  };
}

function validateEmail(email: unknown) {
  if (typeof email !== "string" || email.length < 3) {
    return `Emails must be at least 3 characters long`;
  }
}

const validatePassword = (password: unknown) => {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get("loginType") ?? "login";
  const email = form.get("email");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo") ?? "/";
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { email, password };
  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  switch (loginType) {
    case "login": {
      // login to get the user
      // if there's no user, return the fields and a formError
      // if there is a user, create their session and redirect to /jokes
      return badRequest({
        fields,
        formError: "Not implemented",
      });
    }
    case "register": {
      const userExists = false;

      if (userExists) {
        return badRequest({
          fields,
          formError: `User with email ${email} already exists`,
        });
      }
      // create the user
      // create their session and redirect to /jokes
      return badRequest({
        fields,
        formError: "Not implemented",
      });
    }
    default: {
      return badRequest({
        fields,
        formError: `Login type invalid`,
      });
    }
  }
};

const LoginForm: React.FC<LoginFormProps> = ({ user }) => {
  return <>hi</>;
};
