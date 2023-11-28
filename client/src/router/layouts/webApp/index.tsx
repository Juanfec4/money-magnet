import { FC } from "react";
import { Outlet } from "react-router-dom";

const WebAppLayout: FC = () => {
  return (
    <main className="grid grid-cols-12 bg-gray-900">
      <aside className=" col-start-1 col-end-3"></aside>
      <section className="col-start-3 col-end-11">
        <Outlet />
      </section>
    </main>
  );
};
export default WebAppLayout;
