import { useState, useEffect } from "react";

function App() {
  const [tables, setTables] = useState([]);
  const [selected, setSelected] = useState(null);
  const [rows, setRows] = useState([]);

  const [search, setSearch] = useState("");
const [searchResults, setSearchResults] = useState([]);

const handleSearch = () => {
  if (!search.trim()) return;
  fetch(`/search?name=${encodeURIComponent(search)}`)
    .then(res => res.json())
    .then(setSearchResults);
};
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
  // Fetch list of tables
  useEffect(() => {
    fetch("/tables")
      .then(res => res.json())
      .then(setTables);
  }, []);

  // Fetch table data when selected changes
  useEffect(() => {
    if (!selected) return;
    fetch(`/table/${selected}`)
      .then(res => res.json())
      .then(setRows);
  }, [selected]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Nature Navigator DB Explorer</h1>

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
    </div>
  );
  {searchResults.length > 0 && (
    <>
      <h2 className="text-xl font-semibold mb-2">
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
}

export default App;
