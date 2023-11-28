import { FC, ReactNode } from "react";

//Define prop structure
interface SectionContainerProps {
  title?: string;
  children?: ReactNode;
}

const SectionContainer: FC<SectionContainerProps> = ({ title, children }) => {
  return (
    <section className="flex flex-col space-y-4 p-6 text-gray-100 max-w-6xl mx-auto">
      {title ? <h1 className="text-3xl font-bold">{title}</h1> : null}
      {children}
    </section>
  );
};
export default SectionContainer;
