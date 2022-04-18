import { useState } from 'react';

export type InputProps = {
  name: string;
  defaultValue: string;
  placeholder?: string;
  type?: string;
  className?: string;
  error?: string;
};

const Input = (props: InputProps) => {
  return (
    <label>
      Name:{" "}
      <input
        type={props?.type ?? 'text'}
        defaultValue={props?.defaultValue ?? ""}
        name={props?.name ?? ""}
        aria-invalid={Boolean(props?.error) ?? undefined}
        aria-errormessage={
          props?.error
            ? "name-error"
            : undefined
        }
      />
    </label>
    {actionData?.fieldErrors?.name ? (
      <p
        className="form-validation-error"
        role="alert"
        id="name-error"
      >
        {actionData.fieldErrors.name}
      </p>
    ) : null}
  );
}

export default Input;