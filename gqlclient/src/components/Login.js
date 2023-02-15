import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "./queries";

const Login = ({ show, setToken, setError }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("logged-user-token", token);
    }
  }, [result.data]); // eslint-disable-line

  if (!show) return null;

  const submit = async (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="bg-blue-200 p-3 w-2/3 rounded-2xl px-5 py-10 shadow-md">
        <h2 className="text-3xl font-medium p-2 text-gray-700 text-center">
          Login
        </h2>
        <form className="" onSubmit={submit}>
          <div className="p-3 flex justify-between">
            name
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              className="rounded left-0"
            />
          </div>
          <div className="p-3 flex justify-between">
            password
            <input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              type="password"
              className="rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
