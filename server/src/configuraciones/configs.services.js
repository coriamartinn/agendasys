import { ConfigNegocio } from "./entities/configuracion_negocio.entity.js";
import { configDiasL } from "./entities/diasLaborales.entity.js";
import { configDiasB } from "./entities/diasBloqueados.entity.js";
import { checkTurnoOcupado } from "../turnos/turno.services.js";
import { HorariosEntity } from "./entities/horarios.entity.js";
// GET ALL
export const getAll = async (business_id) => {
  const config = await ConfigNegocio.findOne({
    where: { business_id },
  });

  const diasLaborales = await configDiasL.findAll({
    where: { business_id },
  });

  const diasBloqueados = await configDiasB.findAll({
    where: { business_id },
  });
  return {
    config,
    diasLaborales,
    diasBloqueados,
  };
};

export const obtenerConfigNegocio = async (business_id) => {
  return await ConfigNegocio.findOne({
    where: { business_id },
  });
};

// PUT
export const updateConfig = async (business_id, body) => {
  const { config, diasLaborales } = body;

  // UPDATE CONFIG
  let existing = await ConfigNegocio.findOne({
    where: { business_id },
  });

  if (!existing) {
    existing = await ConfigNegocio.create({
      business_id,

      hora_apertura: "08:00",

      hora_cierre: "20:00",

      buffer_entre_turnos: 10,

      duracion_turno_default: 60,

      anticipacion_max_dias: 30,
    });
  }
  await ConfigNegocio.update(
    {
      hora_apertura: config.hora_apertura,

      hora_cierre: config.hora_cierre,

      buffer_entre_turnos: config.buffer_entre_turnos,

      duracion_turno_default: config.duracion_turno_default,

      anticipacion_max_dias: config.anticipacion_max_dias,
    },
    {
      where: { business_id },
    },
  );

  // UPDATE DIAS LABORALES
  const diasExistentes = await configDiasL.findAll({
    where: { business_id },
  });

  if (diasExistentes.length === 0) {
    const diasDefault = [
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
      "domingo",
    ];

    for (const dia of diasDefault) {
      await configDiasL.create({
        business_id,
        dia_semana: dia,
        activo: dia !== "domingo",
      });
    }
  }
  for (const dia in diasLaborales) {
    await configDiasL.update(
      {
        activo: diasLaborales[dia],
      },
      {
        where: {
          business_id,
          dia_semana: dia,
        },
      },
    );
  }

  return {
    ok: true,
  };
};

// AGREGAR día bloqueado
export const addDiaBloqueado = async (business_id, { fecha, motivo }) => {
  const nuevo = await configDiasB.create({ business_id, fecha, motivo });
  return nuevo;
};

// ELIMINAR día bloqueado
export const deleteDiaBloqueado = async (business_id, id) => {
  const deleted = await configDiasB.destroy({
    where: { id, business_id },
  });
  if (!deleted) throw new Error("Día bloqueado no encontrado");
  return { ok: true };
};

export const getHorariosDisponibles = async (business_id, fecha) => {
  const bloqueado = await configDiasB.findOne({
    where: { business_id, fecha },
  });
  if (bloqueado) return [];

  const diasSemana = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
  ];
  const diaNombre = diasSemana[new Date(fecha + "T12:00:00").getDay()];
  const diaLaboral = await configDiasL.findOne({
    where: { business_id, dia_semana: diaNombre },
  });
  if (!diaLaboral || !diaLaboral.activo) return [];

  const horarios = await HorariosEntity.findAll({
    where: { business_id, activo: true },
  });

  const resultado = await Promise.all(
    horarios.map(async (h) => {
      const ocupado = await checkTurnoOcupado(fecha, h.hora, business_id);
      return { horario: h.hora, ocupado: !!ocupado };
    }),
  );

  return resultado;
};

export const getHorarios = async (business_id) => {
  return await HorariosEntity.findAll({
    where: { business_id },
    order: [["hora", "ASC"]],
  });
};

export const createHorario = async (business_id, hora) => {
  return await HorariosEntity.create({ business_id, hora });
};

export const updateHorario = async (id, business_id, activo) => {
  await HorariosEntity.update({ activo }, { where: { id, business_id } });
  return { ok: true };
};

export const deleteHorario = async (id, business_id) => {
  await HorariosEntity.destroy({ where: { id, business_id } });
  return { ok: true };
};
