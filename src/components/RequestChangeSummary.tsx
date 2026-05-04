type DiffSection = {
  added: any[];
  removed: any[];
  changed: any[];
};

type Props = {
  diff: {
    headers: DiffSection;
    body: DiffSection;
    responseHeaders: DiffSection;
  };
};

function count(section: DiffSection) {
  return {
    added: section.added?.length || 0,
    removed: section.removed?.length || 0,
    changed: section.changed?.length || 0,
  };
}

function RequestChangeSummary({ diff }: Props) {
  const headers = count(diff.headers);
  const body = count(diff.body);
  const response = count(diff.responseHeaders);

  const total =
    headers.added +
    headers.removed +
    headers.changed +
    body.added +
    body.removed +
    body.changed +
    response.added +
    response.removed +
    response.changed;

  return (
    <div
      style={{
        marginBottom: 20,
        padding: 15,
        background: "#0f172a",
        border: "1px solid #334155",
        borderRadius: 10,
      }}
    >
      <h3 style={{ marginTop: 0 }}>Change Summary</h3>

      {total === 0 ? (
        <p style={{ color: "#64748b" }}>
          No changes detected in this request
        </p>
      ) : (
        <ul style={{ color: "#e2e8f0" }}>
          {headers.changed > 0 && (
            <li>
              {headers.changed} header change(s)
            </li>
          )}
          {headers.added > 0 && (
            <li>
              {headers.added} header(s) added
            </li>
          )}
          {headers.removed > 0 && (
            <li>
              {headers.removed} header(s) removed
            </li>
          )}

          {body.changed > 0 && (
            <li>
              {body.changed} body field change(s)
            </li>
          )}
          {body.added > 0 && (
            <li>
              {body.added} body field(s) added
            </li>
          )}
          {body.removed > 0 && (
            <li>
              {body.removed} body field(s) removed
            </li>
          )}

          {response.changed > 0 && (
            <li>
              {response.changed} response header change(s)
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default RequestChangeSummary;