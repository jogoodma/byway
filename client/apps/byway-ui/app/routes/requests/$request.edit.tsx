import { useParams } from "remix";

const RequestEditRoute = () => {
  const { request } = useParams();
  return (
    <div>
      <h1>Request Edit Route</h1>
      <p>{request}</p>
    </div>
  );
};

export default RequestEditRoute;
