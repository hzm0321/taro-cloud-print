const resolve = (dir) => require("path").join(__dirname, dir);

module.exports = {
  resolve: {
    alias: {
      "@/components": resolve("client/src/components"),
    },
  },
};
