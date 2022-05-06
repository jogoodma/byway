import type { ActionFunction, LoaderFunction } from "remix";
import { Form, useActionData, useLoaderData } from "remix";
import { getItem } from "~/pico/store.server";
import type { BywayStoreItem } from "~/pico/store.server";
import Comments from "~/components/Comments";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const itemEci = url.searchParams.get("itemEci");
  const type = url.searchParams.get("type");
  console.log(itemEci, type);
  const item = await getItem(itemEci);
  return {
    item,
    type,
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const item = JSON.parse(String(formData.get("item")) ?? "{}");
  const type = formData.get("type");
  return null;
};

const NewRequestsRoute = () => {
  const { item, type = "wanted" } = useLoaderData();

  const reqType = type === "for_sale" ? "For sale" : "Wanted";

  return (
    <section className="m-10 p-10 bg-white rounded-lg w-5/6">
      <h1 className="text-slate-600 text-4xl mb-4">
        New Request for: {item?.name}
      </h1>
      <Form method="post">
        <input type="hidden" name="item" value={JSON.stringify(item)} />
        <input type="hidden" name="type" value={type} />
        <div className="flex flex-col text-2xl w-full border-2 rounded-lg p-3 mb-10 gap-8">
          <div className="flex flex-row flex-wrap">
            <p className="text-xl w-1/3">
              <label htmlFor="type">Request Type</label>
            </p>
            <p className="text-black">{reqType}</p>
          </div>
          <div className="flex flex-row flex-wrap">
            <p className="text-xl w-1/3">Name</p>
            <p className="text-black">{item?.name}</p>
          </div>
          <div className="flex flex-row flex-wrap">
            <p className="text-xl w-1/3">Description</p>
            <p className="text-black">{item?.description}</p>
          </div>
          <div className="flex flex-row flex-wrap">
            <p className="text-xl w-1/3">
              <label htmlFor="price">Asking price</label>
            </p>
            <div className="form-control">
              <label className="input-group" data-theme="light">
                <span>$</span>
                <input
                  id="price"
                  name="price"
                  type="text"
                  placeholder="0.01"
                  className="input input-bordered"
                  pattern="^[\d,\.]+$"
                />
                <span>USD</span>
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary max-w-xs">
            Submit
          </button>
        </div>
      </Form>
    </section>
  );
};

export default NewRequestsRoute;
