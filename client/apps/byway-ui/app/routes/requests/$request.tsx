import { useParams } from "remix";

const RequestRoute = () => {
  const { request } = useParams();
  return (
    <div>
      <h1>Request Route</h1>
      <p>{request}</p>
    </div>
  );
};

export default RequestRoute;
