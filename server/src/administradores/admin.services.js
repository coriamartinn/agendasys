import { Admin } from "./admin.entity.js";

// POST ADM
export const createAdmin = async (buildAdm) => {
  return await Admin.create(buildAdm);
};

// Login
export const checkPassHash = async (pass) => {
  return await Admin.findOne({
    where: { pass },
  });
};

// checkeo email existente
export const checkEmailExistente = async (email) => {
  return await Admin.findOne({
    where: { email },
  });
};
