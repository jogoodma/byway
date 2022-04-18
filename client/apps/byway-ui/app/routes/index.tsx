import {redirect} from "remix";
import type { LoaderFunction } from "remix";

export const loader: LoaderFunction = async ({ request}) => {
  throw redirect("/login")
};

export default function Index() {
  return (
    <main className="m-10 bg-white rounded-lg h-80">
      <h1>Landing page</h1>
    </main>
  );
}
