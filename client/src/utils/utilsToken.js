const BASE_URL = import.meta.env.VITE_API_URL;

export const wrapperFetch = async (ruta, configMethod) => {
  const tokenAccess = localStorage.getItem("token");
  let configFinal = {
    ...configMethod,
  };
  configFinal.headers = configFinal.headers || {};

  if (tokenAccess) {
    configFinal.headers["x-auth-token"] = tokenAccess;
  }
  const res = await fetch(`${BASE_URL}/${ruta}`, configFinal);
  if (!res.ok) {
    throw new Error();
  }
  const data = await res.json();

  return data;
};
