module.exports = {
    formatDate: function (date) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      return new Date(date).toLocaleString("en-US", options);
    },
  };