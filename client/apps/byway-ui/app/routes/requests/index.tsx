const RequestsIndexRoute = () => {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full" data-theme="winter">
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Item / Service</th>
            <th>Status</th>
            <th>Request to</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Initiated on</th>
            <th>Initiated by</th>
            <th>Updated on</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <td>Trek Bike</td>
            <td className="text-orange-500">Waiting</td>
            <td>Buy</td>
            <td>1</td>
            <td>$800.00</td>
            <td>4/08/2022</td>
            <td>John Doe</td>
            <td>4/10/2022</td>
            <th>
              <button className="btn btn-ghost btn-xs">details</button>
            </th>
          </tr>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <td>Morel mushrooms</td>
            <td className="text-green-500">Active</td>
            <td>Sell</td>
            <td>2 lb</td>
            <td>$110.00</td>
            <td>4/20/2022</td>
            <td>me</td>
            <td>4/21/2022</td>
            <th>
              <button className="btn btn-ghost btn-xs">details</button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RequestsIndexRoute;
