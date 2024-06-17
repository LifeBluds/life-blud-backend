const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? String(process.env.PROD_SERVER_URL)
    : process.env.NODE_ENV === "local"
      ? String(process.env.LOCAL_SERVER_URL)
      : "";

export { SERVER_URL };
