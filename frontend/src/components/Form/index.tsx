import { FC, FormEventHandler, ReactNode } from "react";

interface IFormProps {
  onSubmit?: FormEventHandler;
  className?: string;
  children: ReactNode;
}

const Form: FC<IFormProps> = ({
  className,
  onSubmit,
  children,
}): JSX.Element => {
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
    </form>
  );
};

export default Form;
