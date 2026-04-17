export function GridToolbar() {
  return (
    <div className="toolbar">
      <button onClick={() => alert('Add new row')}>Add Row</button>
      <button onClick={() => alert('Edit row')}>Delete Row</button>
      <button onClick={() => alert('Importing data')}>Import</button>
      <button onClick={() => alert('Exporting data')}>Export</button>
    </div>
  )
}
