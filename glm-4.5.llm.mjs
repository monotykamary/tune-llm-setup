export default async (payload, context) => {
  const key = await context.read("Z_API_KEY");

  return ({
    url: "https://api.z.ai/api/paas/v4/chat/completions",
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      ...payload,
      model: "glm-4.5",
    })
  })
}
