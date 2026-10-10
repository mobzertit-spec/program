/** Old links used hash routes (…/#/lessons/x). Turn them into clean paths before the router starts. */
if (window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', import.meta.env.BASE_URL + window.location.hash.slice(2))
}

export {}
