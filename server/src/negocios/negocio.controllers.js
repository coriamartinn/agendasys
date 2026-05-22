import { getAll, getById } from "./negocio.services.js";

//GET
export const buscarNegocios = async (req, res) => {
  try {
    const negocios = await getAll();

    res.status(200).send(negocios);
  } catch (e) {
    res.status(400).send("No se encontraron los negocios");
  }
};

//GET
export const buscarNegocio = async (req, res) => {
  try {
    const { business_id } = req.admin;
    const negocio = await getById(business_id);

    res.status(200).send(negocio);
  } catch (e) {
    res.status(400).send("No se encontraron los negocios");
  }
};
