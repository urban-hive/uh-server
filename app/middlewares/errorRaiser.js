module.exports = async (ctx, next) => {
  try {
    return await next();
  } catch (e) {
    return ctx.app.emit('error', e, ctx);
  }
};
