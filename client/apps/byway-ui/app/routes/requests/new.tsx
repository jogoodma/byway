import type { ActionFunction } from "remix";
import { useActionData } from "remix";
import Comments from "~/components/comments";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const itemRequest = String(form.get("request"));
  return JSON.parse(itemRequest);
};
const NewRequestsRoute = () => {
  const requestedItem = useActionData();

  return (
    <section className="m-10 p-10 bg-white rounded-lg w-5/6">
      <h1 className="text-slate-600 text-4xl mb-4">
        New Request for: {requestedItem?.name}
      </h1>
      <div className="flex flex-col text-2xl w-full border-2 rounded-lg p-3 mb-10">
        <div className="flex flex-row">
          <p className="text-xl w-1/3">Name</p>
          <p className="text-black">{requestedItem?.name}</p>
        </div>
        <div className="flex flex-row">
          <p className="text-xl w-1/3">Description</p>
          <p className="text-black">{requestedItem?.description}</p>
        </div>
        <div className="flex flex-row">
          <p className="text-xl w-1/3">Asking price</p>
          <p className="text-black">${requestedItem?.price}</p>
        </div>
      </div>
      <Comments />
    </section>
  );
};

export default NewRequestsRoute;
