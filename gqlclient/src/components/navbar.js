const NavItem = (props) => {
  const { name, active, setPage } = props;

  return (
    <button
      onClick={() => setPage(name)}
      className={`mr-2 text-slate-800 hover:text-slate-500 ${
        active ? "border-b-2" : ""
      } border-black hover:border-slate-500`}
    >
      {name}
    </button>
  );
};

const Navbar = (props) => {
  const { page, setPage } = props;

  return (
    <div className="flex items-center">
      <div className="pr-3">
        <h2 className="text-xl font-bold">Library</h2>
      </div>
      <div className="flex-1">
        <NavItem name="authors" active={page === "authors"} setPage={setPage} />
        <NavItem name="books" active={page === "books"} setPage={setPage} />
      </div>
    </div>
  );
};

export default Navbar;
