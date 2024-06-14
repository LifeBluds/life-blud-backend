const BASE_URL =
  process.env.NODE_ENV === "production"
    ? String(process.env.PROD_URL)
    : process.env.NODE_ENV === "staging"
      ? String(process.env.STAGING_URL)
      : process.env.NODE_ENV === "local"
        ? String(process.env.LOCAL_URL)
        : "";

const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? String(process.env.PROD_SERVER_URL)
    : process.env.NODE_ENV === "staging"
      ? String(process.env.STAGING_SERVER_URL)
      : process.env.NODE_ENV === "local"
        ? String(process.env.LOCAL_SERVER_URL)
        : "";

export { BASE_URL, SERVER_URL };
