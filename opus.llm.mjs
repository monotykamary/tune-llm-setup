export default async (payload, context) => {
  const key = await context.read("ANTHROPIC_KEY");

  return ({
    url: "https://api.anthropic.com/v1/chat/completions",
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      ...payload,
      model: "claude-opus-4-20250514",
    })
  })
}
