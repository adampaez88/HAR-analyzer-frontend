import type { MissingRequest } from "../types";

export default function MissingRequestsTable({
  data,
}: {
  data: MissingRequest[];
}) {
  return (
    <div>
      <h2>Missing Requests</h2>

      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>File1</th>
            <th>File2</th>
            <th>Diff</th>
          </tr>
        </thead>

        <tbody>
          {data.map((r) => (
            <tr key={r.key}>
              <td>{r.key}</td>
              <td>{r.file1Count}</td>
              <td>{r.file2Count}</td>
              <td>{r.difference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}