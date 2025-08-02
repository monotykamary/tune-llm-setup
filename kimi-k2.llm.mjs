export default async (payload, context) => {
  const key = await context.read("MOONSHOT_API_KEY");

  return ({
    url: "https://api.moonshot.ai/v1/chat/completions",
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      ...payload,
      model: "kimi-k2-0711-preview",
    })
  })
}
