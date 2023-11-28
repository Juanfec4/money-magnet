import { FC, FormEvent, ReactNode } from "react";

//Define prop structure
interface FormContainerProps {
  title?: string;
  children?: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const FormContainer: FC<FormContainerProps> = ({
  title,
  children,
  onSubmit,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
      className="border-2 border-gray-500 rounded-md p-4"
    >
      {title ? <h3>{title}</h3> : null}
      <div className="flex flex-col p-2 gap-2 max-w-max mx-auto items-center sm:items-start">
        {children}
      </div>
    </form>
  );
};
export default FormContainer;
