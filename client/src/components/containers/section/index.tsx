import { FC, ReactNode } from "react";
import SearchBox, { SearchBoxProps } from "../../inputs/searchBox";

//Link type
type Link = {
  text: string;
  onClick: () => void;
};

//Define prop structure
interface SectionContainerProps {
  title?: string;
  titleLink?: Link;
  children?: ReactNode;
  sectionSearch?: SearchBoxProps;
}

const SectionContainer: FC<SectionContainerProps> = ({
  title,
  children,
  titleLink,
  sectionSearch,
}) => {
  return (
    <section className="flex flex-col space-y-8 my-16 p-6 text-gray-100 max-w-6xl mx-auto">
      {title ? (
        <div className="flex flex-col  items-center md:items-start space-y-4 lg:space-y-0 lg:flex-row lg:justify-between">
          <h1 className="text-3xl font-bold">
            {title}{" "}
            {titleLink ? (
              <span>
                {" | "}
                <a
                  onClick={titleLink.onClick}
                  className="text-lime-500 font-normal underline underline-offset-4 cursor-pointer"
                >
                  {titleLink.text}
                </a>
              </span>
            ) : null}
          </h1>
          {sectionSearch ? (
            <SearchBox
              value={sectionSearch.value}
              onChange={sectionSearch.onChange}
            />
          ) : null}
        </div>
      ) : null}
      <div>{children}</div>
    </section>
  );
};
export default SectionContainer;
