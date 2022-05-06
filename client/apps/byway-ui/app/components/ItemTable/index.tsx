import { useMemo } from "react";
import { useTable } from "react-table";
import { Form, Link } from "remix";
import { Trash, Cash, Edit } from "tabler-icons-react";
import { BywayStoreItem } from "~/pico/store.server";

export type ItemTableProps = {
  items: BywayStoreItem[];
  storeEci: string;
};

const ItemTable = ({ items, storeEci }: ItemTableProps) => {
  const data = useMemo(() => items, [items]);
  console.log("data", data);
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Tags",
        accessor: "tags",
        Cell: ({ cell: { value } }: any) => {
          return value.map((tag: string) => (
            <span key={tag} className=" m-1 badge">
              {tag}
            </span>
          ));
        },
      },
      {
        Header: "Actions",
        accessor: "id",
        Cell: ({
          cell: {
            row: { original: item },
          },
        }: any) => {
          return (
            <div className="flex flex-row gap-2">
              <Link to={`/stores/${storeEci}/item/${item.publicEci}/edit`}>
                <div className="tooltip" data-tip="Edit">
                  <button
                    className="btn btn-circle btn-xs"
                    type="submit"
                    role="submit"
                    title="Edit"
                  >
                    <Edit size={20} />
                  </button>
                </div>
              </Link>
              <Form method="get" action="/requests/new">
                <input type="hidden" name="itemEci" value={item.publicEci} />
                <input type="hidden" name="type" value="for_sale" />
                <div className="tooltip" data-tip="Sell">
                  <button
                    className="btn btn-circle btn-xs"
                    type="submit"
                    role="submit"
                    title="Sell"
                  >
                    <Cash size={20} />
                  </button>
                </div>
              </Form>
              <Link to={`/stores/${storeEci}/item/${item.publicEci}/delete`}>
                <div className="tooltip" data-tip="Delete">
                  <button
                    className="btn btn-circle btn-xs"
                    type="submit"
                    role="submit"
                    title="Delete"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </Link>
            </div>
          );
        },
      },
    ],
    []
  );
  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="overflow-x-auto w-full">
      <table
        data-theme="light"
        className="table table-zebra w-full"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
