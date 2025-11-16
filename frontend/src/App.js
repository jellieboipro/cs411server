import { useState, useEffect } from "react";

function App() {
  const [tables, setTables] = useState([]);
  const [selected, setSelected] = useState(null);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  //fetch list of tables
  useEffect(() => {
    fetch("/tables")
      .then((res) => res.json())
      .then(setTables);
  }, []);

  //fetch data when a table is selected
  useEffect(() => {
    if (!selected) return;
    fetch(`/table/${selected}`)
      .then((res) => res.json())
      .then(setRows);
  }, [selected]);

  // search
  const handleSearch = () => {
    if (!search.trim()) return;
    setSelected(null);
    fetch(`/search?name=${encodeURIComponent(search)}`)
      .then((res) => res.json())
      .then(setSearchResults);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Nature Navigator DB Explorer</h1>

      {/* search bar */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Common Name..."
          className="border px-2 py-1 rounded mr-2"
        />
        <button
          onClick={handleSearch}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Search
        </button>
      </div>

      {/* table selector buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {tables.map((t) => (
          <button
            key={t}
            onClick={() => setSelected(t)}
            className={`px-3 py-1 rounded ${
              selected === t ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* selected table contents */}
      {selected && (
        <>
          <h2 className="text-xl font-semibold mb-2">{selected}</h2>
          <table className="min-w-full border border-gray-400 text-sm">
            <thead>
              {rows[0] && (
                <tr>
                  {Object.keys(rows[0]).map((col) => (
                    <th key={col} className="border px-2 py-1 bg-gray-100">
                      {col}
                    </th>
                  ))}
                </tr>
              )}
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  {Object.values(r).map((val, j) => (
                    <td key={j} className="border px-2 py-1">
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* search results table */}
      {searchResults.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-2">
            Results for "{search}"
          </h2>
          <table className="min-w-full border border-gray-400 text-sm">
            <thead>
              <tr>
                {Object.keys(searchResults[0]).map((col) => (
                  <th key={col} className="border px-2 py-1 bg-gray-100">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {searchResults.map((r, i) => (
                <tr key={i}>
                  {Object.values(r).map((val, j) => (
                    <td key={j} className="border px-2 py-1">
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
