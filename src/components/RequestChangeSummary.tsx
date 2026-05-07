type DiffSection = {
  added: any[];
  removed: any[];
  changed: any[];
};

type Props = {
  diff: {
    headers: DiffSection;
    body: DiffSection;
    cookies: DiffSection;

    responseHeaders: DiffSection;
    responseCookies: DiffSection;
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
  const cookies = count(diff.cookies);

  const responseHeaders = count(diff.responseHeaders);
  const responseCookies = count(diff.responseCookies);

  const total =
    headers.added +
    headers.removed +
    headers.changed +

    body.added +
    body.removed +
    body.changed +

    cookies.added +
    cookies.removed +
    cookies.changed +

    responseHeaders.added +
    responseHeaders.removed +
    responseHeaders.changed +

    responseCookies.added +
    responseCookies.removed +
    responseCookies.changed;

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
      <h3 style={{ marginTop: 0 }}>
        Change Summary
      </h3>

      {total === 0 ? (
        <p style={{ color: "#64748b" }}>
          No changes detected in this request
        </p>
      ) : (
        <ul style={{ color: "#e2e8f0" }}>
          {/* HEADERS */}
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

          {/* COOKIES */}
          {cookies.changed > 0 && (
            <li>
              {cookies.changed} cookie change(s)
            </li>
          )}

          {cookies.added > 0 && (
            <li>
              {cookies.added} cookie(s) added
            </li>
          )}

          {cookies.removed > 0 && (
            <li>
              {cookies.removed} cookie(s) removed
            </li>
          )}

          {/* BODY */}
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

          {/* RESPONSE HEADERS */}
          {responseHeaders.changed > 0 && (
            <li>
              {responseHeaders.changed} response header change(s)
            </li>
          )}

          {responseHeaders.added > 0 && (
            <li>
              {responseHeaders.added} response header(s) added
            </li>
          )}

          {responseHeaders.removed > 0 && (
            <li>
              {responseHeaders.removed} response header(s) removed
            </li>
          )}

          {/* RESPONSE COOKIES */}
          {responseCookies.changed > 0 && (
            <li>
              {responseCookies.changed} response cookie change(s)
            </li>
          )}

          {responseCookies.added > 0 && (
            <li>
              {responseCookies.added} response cookie(s) added
            </li>
          )}

          {responseCookies.removed > 0 && (
            <li>
              {responseCookies.removed} response cookie(s) removed
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default RequestChangeSummary;