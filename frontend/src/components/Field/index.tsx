import { FC, ForwardRefExoticComponent, RefAttributes } from "react";
import { Control, FieldValues, FormState } from "react-hook-form";
import { ICheckboxProps } from "@src/components/Checkbox";

interface IField {
  label?: string;
  labelEl?: React.ReactNode;
  labelClassName?: string;
  name: string;
  component:
    | ForwardRefExoticComponent<RefAttributes<HTMLInputElement>>
    | ForwardRefExoticComponent<RefAttributes<HTMLTextAreaElement>>
    | ForwardRefExoticComponent<
        ICheckboxProps & RefAttributes<HTMLInputElement>
      >
    | React.FC;
  control: Control<FieldValues>;
  formState: FormState<FieldValues>;
  [x: string]: any;
}

const Field: FC<IField> = (props) => {
  const {
    label,
    labelEl,
    name,
    control,
    formState,
    component: Component,
    labelClassName,
    ...rest
  } = props;
  const { errors } = formState;

  const error = errors[name]?.message as string;

  return (
    <>
      {label && (
        <label className={`block text-black ${labelClassName}`} htmlFor={name}>
          {label}
        </label>
      )}
      {labelEl && labelEl}
      {<Component {...control.register(name)} {...rest} />}
      <p className="text-pmdRed">{error}</p>
    </>
  );
};

export default Field;
