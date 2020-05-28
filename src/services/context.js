let context, callback, required_contexts;

window.addEventListener("message", ({ data }) => {
  context = data;
  if (callback) getContexts();
});

function getContexts() {
  const result = {};
  for (let ctx_name of required_contexts) {
    if (context.hasOwnProperty(ctx_name)) {
      result[ctx_name] = context[ctx_name];
    } else throw new Error(`Can't find context: ${ctx_name}`);
  }
}

export default function getContext(contexts, cb) {
  required_contexts = contexts;
  callback = cb;

  if (context) getContexts();
}
