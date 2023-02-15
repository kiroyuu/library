import { useMutation } from "@apollo/client";
import { useState } from "react";
import { UPDATE_AUTHOR, ALL_AUTHORS } from "./queries";

const Authors = (props) => {
  const [name, setName] = useState(props.authors[0].name);
  const [born, setBorn] = useState(0);
  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  if (!props.show) {
    return null;
  }
  const authors = props.authors;

  const submit = (event) => {
    event.preventDefault();
    updateAuthor({ variables: { name, born } });

    setName(authors[0].name);
    setBorn(0);
  };

  return (
    <div className="bg-blue-100 ">
      <h2 className="text-3xl font-bold m-4 p-2 text-gray-700">Authors</h2>
      <div className="md:flex block">
        <table className="table-auto m-5">
          <thead>
            <tr>
              <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                author
              </th>
              <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                born
              </th>
              <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                books
              </th>
            </tr>
          </thead>
          <tbody>
            {authors.map((a) => (
              <tr key={a.name} className="bg-gray-100 border-b">
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {a.name}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {a.born ? a.born : "-"}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {a.bookCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-blue-200 rounded-2xl m-5 px-5 py-4">
          <h2 className="text-md font-medium text-gray-900 py-2 pb-4">
            Set birthyear
          </h2>
          <form onSubmit={submit}>
            <select
              onChange={({ target }) => setName(target.value)}
              className="p-1 rounded-md border border-gray-300"
            >
              {authors.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
            <div className="flex my-2">
              <p className="text-sm font-medium text-gray-900 py-2">born</p>
              <input
                type="number"
                value={born}
                onChange={({ target }) => setBorn(parseInt(target.value))}
                className="ml-2 border border-gray-300 rounded-md py-1 px-2"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              update author
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Authors;
