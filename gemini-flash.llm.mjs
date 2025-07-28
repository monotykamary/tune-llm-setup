export default async (payload, context) => {
  const key = await context.read("GEMINI_KEY");

  return ({
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      ...payload,
      model: "gemini-2.5-flash",
    })
  })
}
