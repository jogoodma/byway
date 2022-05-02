import { Outlet, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const term = url.searchParams.get("term");
  return url?.searchParams.get("term") ?? null;
};
const SearchLayout = () => {
  const term = useLoaderData();
  return (
    <main className="m-10 p-10 bg-white rounded-lg">
      <section>
        <h1 className="text-slate-600 text-4xl mb-4">"{term}"</h1>
      </section>
      <hr />
      <div className="mt-4 flex flex-wrap justify-center">
        <Outlet />
      </div>
    </main>
  );
};

export default SearchLayout;
