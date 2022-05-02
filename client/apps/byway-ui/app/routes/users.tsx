import { Link, Outlet } from "remix";
import { Divider } from "@mantine/core";
import { faker } from "@faker-js/faker";

const UsersLayout = () => {
  return (
    <main className="m-10 p-10 bg-white rounded-lg">
      <section>
        <h1 className="text-slate-600 text-4xl mb-4">Users</h1>
        <Divider />
        <div className="mt-10 flex flex-wrap justify-center gap-10 md:gap-20">
          <Outlet />
        </div>
      </section>
    </main>
  );
};

export default UsersLayout;
