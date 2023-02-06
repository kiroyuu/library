import { useState } from "react";
import { useQuery, useApolloClient, useSubscription } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from "./components/queries";

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

  if (!token) {
    return (
      <div className="bg-blue-100 h-screen">
        <div className="bg-blue-100 p-4 flex items-center">
          <div className="pr-3">
            <h2 className="text-xl font-bold">Library</h2>
          </div>
          <div className="flex-1">
            <button
              onClick={() => setPage("authors")}
              className="mr-2 text-slate-800 hover:text-slate-500"
            >
              authors
            </button>
            <button
              onClick={() => setPage("books")}
              className="mr-2 text-slate-800 hover:text-slate-500"
            >
              books
            </button>
          </div>
          <div className="">
            <button
              onClick={() => setPage("login")}
              className="mr-2 text-slate-800 hover:text-slate-500"
            >
              login
            </button>
          </div>
        </div>
        <Authors show={page === "authors"} authors={authors.data.allAuthors} />
        <Books show={page === "books"} books={books.data.allBooks} />
        <Login show={page === "login"} setToken={setToken} setError={notify} />
      </div>
    );
  }

  return (
    <div>
      <div>
        <button type="button" onClick={() => setPage("authors")}>
          authors
        </button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("recommend")}>recommend</button>
        <button type="button" onClick={logout}>
          logout
        </button>
      </div>

      <Authors show={page === "authors"} authors={authors.data.allAuthors} />
      <Books show={page === "books"} books={books.data.allBooks} />
      <NewBook show={page === "add"} />
      <Login show={page === "login"} setToken={setToken} setError={notify} />
      <Recommend show={page === "recommend"} books={books.data.allBooks} />
    </div>
  );
};

export default App;
