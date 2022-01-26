export default () => {
  return new Promise(async (res, rej) => {
    try {
      const config = await import("../dev-config.js");
      res(config.default);
    } catch {
      try {
        const config = await import("../config.js");
        res(config.default);
      } catch {
        rej("No config file found.");
      }
    }
  });
};
