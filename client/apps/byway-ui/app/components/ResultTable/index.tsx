import { useMemo } from "react";
import { useTable } from "react-table";
import { BywayMatches } from "~/pico/matcher.server";
import { Form } from "remix";

export type ResultTableProps = {
  matches: BywayMatches[];
};

const ResultTable = ({ matches }: ResultTableProps) => {
  const data = useMemo(() => matches, [matches]);
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
        Header: () => (<div className="text-right">Price</div>),
        accessor: "price",
        Cell: ({ cell: { value } }: any) => {
          return (
            <div className="text-right">
              {new Intl.NumberFormat("en-US", {
                currency: "USD",
                style: "currency",
                maximumFractionDigits: 2,
              }).format(value)}
            </div>
          );
        },
      },
      {
        Header: "",
        accessor: "id",
        Cell: ({
          cell: {
            row: { values: item },
          },
        }: any) => {
          return (
            <Form method="post" action="/requests/new" reloadDocument>
              <input
                type="hidden"
                name="request"
                value={JSON.stringify(item)}
              />
              <button className="btn btn-primary" type="submit" role="submit">
                Buy
              </button>
            </Form>
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

export default ResultTable;
