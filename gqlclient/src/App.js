import { useState } from "react";
import { useQuery, useApolloClient, useSubscription } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from "./components/queries";
import Navbar from "./components/navbar";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import Recommend from "./components/Recommend";

const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("authors");
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData);
    },
  });

  const authors = useQuery(ALL_AUTHORS, {
    pollInterval: 2000,
  });
  const books = useQuery(ALL_BOOKS, {
    pollInterval: 2000,
  });

  if (authors.loading || books.loading) {
    return <div>loading...</div>;
  }

  const logout = (event) => {
    event.preventDefault();
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const notify = () => {
    console.log("notify");
  };

  return (
    <div className="bg-blue-100 h-screen">
      <div className="bg-blue-300 p-4 flex items-center justify-between">
        <Navbar page={page} setPage={setPage} logged={token} />
        <div className="">
          {!token ? (
            <button
              onClick={() => setPage("login")}
              className="mr-2 text-slate-800 hover:text-slate-500"
            >
              login
            </button>
          ) : (
            <button
              onClick={logout}
              className="mr-2 text-slate-800 hover:text-slate-500"
            >
              logout
            </button>
          )}
        </div>
      </div>
      <Authors show={page === "authors"} authors={authors.data.allAuthors} />
      <Books show={page === "books"} books={books.data.allBooks} />
      <Login show={page === "login"} setToken={setToken} setError={notify} />
      {token && (
        <>
          <NewBook show={page === "add"} />
          <Recommend show={page === "recommend"} />
        </>
      )}
    </div>
  );
};

export default App;
