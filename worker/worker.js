export default {
  async fetch(request) {
    return new Response("Paige's Corner Online", {
      headers: { "content-type": "text/plain" },
    })
  },
}
