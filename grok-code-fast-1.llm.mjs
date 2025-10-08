export default async (payload, context) => {
  const key = await context.read("GROK_API_KEY");

  return ({
    url: "https://api.x.ai/v1/chat/completions",
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      ...payload,
      model: "grok-code-fast-1",
    })
  })
}
