export default async (payload, context) => {
  const key = await context.read("OPENAI_API_KEY");

  return ({
    url: "https://api.openai.com/v1/chat/completions",
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      ...payload,
      model: "gpt-5-nano",
    })
  })
}
