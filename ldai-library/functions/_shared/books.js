const decodeField = (field = {}) =>
  field.stringValue ??
  (field.integerValue === undefined ? undefined : Number(field.integerValue)) ??
  field.doubleValue ??
  field.booleanValue ??
  null

export const readBooks = async () => {
  const projectId = 'fit5032-lab7-ling-dai-36667145'
  const endpoint =
    `https://firestore.googleapis.com/v1/projects/${projectId}` +
    '/databases/(default)/documents/books?pageSize=100'
  const response = await fetch(endpoint)

  if (!response.ok) {
    throw new Error(`Firestore request failed with status ${response.status}`)
  }

  const payload = await response.json()
  return (payload.documents ?? []).map((document) => ({
    id: document.name.split('/').pop(),
    isbn: decodeField(document.fields?.isbn),
    name: decodeField(document.fields?.name),
  }))
}

export const jsonResponse = (body, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
