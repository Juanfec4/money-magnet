import { FC } from "react";
import { Outlet } from "react-router-dom";

const WebAppLayout: FC = () => {
  return (
    <main className="grid grid-cols-12 bg-gray-900 min-h-screen">
      <aside className="col-start-1 col-end-3 hidden md:block "></aside>
      <section className=" col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 md:col-start-3 md:col-end-13 lg:col-start-3 lg:col-end-11 ">
        <Outlet />
      </section>
    </main>
  );
};
export default WebAppLayout;
