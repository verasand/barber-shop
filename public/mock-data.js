/**
 * Conjunto de datos de ejemplo para el prototipo de la app de barbería.
 *
 * La idea es poder centralizar un set representativo de citas que cubra
 * los diferentes estados y pantallas del prototipo sin tener que tocar
 * el código principal de index.html cada vez que queramos iterar.
 */

const MINUTE_IN_MS = 60 * 1000;

export const DEFAULT_EXAMPLE_SEED_GROUP = "prototype-base-seed-v1";

const buildSchedule = (dayOffset, hour, minute = 0) => ({
  dayOffset,
  hour,
  minute,
});

const BASE_EXAMPLE_APPOINTMENTS = [
  {
    exampleId: "base-juan-perez",
    seedGroup: DEFAULT_EXAMPLE_SEED_GROUP,
    customerName: "Juan Pérez",
    phone: "+573001112233",
    service: "Corte de Hombre",
    price: 25,
    duration: 30,
    status: "completed",
    workerId: "barber_01",
    schedule: buildSchedule(0, 9, 0),
    timer: null,
  },
  {
    exampleId: "base-carlos-gomez",
    seedGroup: DEFAULT_EXAMPLE_SEED_GROUP,
    customerName: "Carlos Gómez",
    phone: "+573004445566",
    service: "Corte y Barba",
    price: 40,
    duration: 45,
    status: "paused",
    workerId: "barber_02",
    schedule: buildSchedule(0, 11, 0),
    timer: {
      elapsedMinutes: 15,
    },
  },
  {
    exampleId: "base-luis-martinez",
    seedGroup: DEFAULT_EXAMPLE_SEED_GROUP,
    customerName: "Luis Martínez",
    phone: "+573007778899",
    service: "Corte de Hombre",
    price: 25,
    duration: 30,
    status: "in-progress",
    workerId: "barber_01",
    schedule: buildSchedule(0, 14, 0),
    timer: {
      startedMinutesAgo: 5,
    },
  },
  {
    exampleId: "base-miguel-angel",
    seedGroup: DEFAULT_EXAMPLE_SEED_GROUP,
    customerName: "Miguel Ángel",
    phone: "+573001237890",
    service: "Corte de Niño",
    price: 20,
    duration: 30,
    status: "pending",
    workerId: "barber_01",
    schedule: buildSchedule(0, 16, 0),
    timer: null,
  },
  {
    exampleId: "base-andres-silva",
    seedGroup: DEFAULT_EXAMPLE_SEED_GROUP,
    customerName: "Andrés Silva",
    phone: "+573009998877",
    service: "Corte de Hombre",
    price: 25,
    duration: 30,
    status: "completed",
    workerId: "barber_01",
    schedule: buildSchedule(-1, 10, 0),
    timer: null,
  },
  {
    exampleId: "base-david-rojas",
    seedGroup: DEFAULT_EXAMPLE_SEED_GROUP,
    customerName: "David Rojas",
    phone: "+573006665544",
    service: "Barba",
    price: 15,
    duration: 20,
    status: "pending",
    workerId: "barber_02",
    schedule: buildSchedule(1, 15, 0),
    timer: null,
  },
];

const EXAMPLE_SETS = {
  base: BASE_EXAMPLE_APPOINTMENTS,
};

function createScheduledDate(referenceDate, schedule) {
  const result = new Date(referenceDate.getTime());
  result.setHours(schedule.hour ?? 0, schedule.minute ?? 0, 0, 0);
  result.setDate(result.getDate() + (schedule.dayOffset ?? 0));
  return result;
}

function computeTimerState(timerDefinition, scheduleDate, now) {
  if (!timerDefinition) {
    return {
      elapsedTime: 0,
      startTime: null,
    };
  }

  const elapsedTime = typeof timerDefinition.elapsedMinutes === "number"
    ? timerDefinition.elapsedMinutes * MINUTE_IN_MS
    : 0;

  let startTime = null;
  if (typeof timerDefinition.startedMinutesAgo === "number") {
    startTime = new Date(now.getTime());
    startTime.setMinutes(startTime.getMinutes() - timerDefinition.startedMinutesAgo);
  } else if (typeof timerDefinition.startOffsetMinutes === "number") {
    startTime = new Date(scheduleDate.getTime());
    startTime.setMinutes(startTime.getMinutes() + timerDefinition.startOffsetMinutes);
  } else if (timerDefinition.alignWithSchedule) {
    startTime = new Date(scheduleDate.getTime());
  }

  return {
    elapsedTime,
    startTime,
  };
}

export function buildExampleAppointments({
  setName = "base",
  referenceDate = new Date(),
} = {}) {
  const definitions = EXAMPLE_SETS[setName];

  if (!definitions) {
    throw new Error(`El set de ejemplos "${setName}" no existe.`);
  }

  const now = new Date(referenceDate.getTime());

  return definitions.map((definition) => {
    const scheduleDate = createScheduledDate(now, definition.schedule);
    const { elapsedTime, startTime } = computeTimerState(definition.timer, scheduleDate, now);

    const { schedule, timer, ...rest } = definition;

    return {
      ...rest,
      dateTime: scheduleDate,
      elapsedTime,
      startTime,
    };
  });
}
