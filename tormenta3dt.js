Hooks.once("init", () => {
  CONFIG.T3DT = {
    attributes: ["forca", "habilidade", "resistencia", "armadura", "poderFogo", "resistenciaEspiritual"],
    resources: { pv: "PV", pm: "PM", disposicao: "Disposição" }
  };
  console.log("Tormenta 3D&T | Sistema inicializado para Foundry v13");
});

Hooks.once("ready", () => {
  console.log("Tormenta 3D&T | MVP carregado");
});

Hooks.on("createActor", async (actor) => {
  if (actor.type !== "character" && actor.type !== "npc") return;
  const system = actor.system ?? {};
  const attrs = system.attributes ?? {};
  const get = (key) => Number(attrs[key]?.value ?? 0);
  const updates = {
    "system.resources.pv.max": Math.max(1, get("resistencia") * 5),
    "system.resources.pm.max": Math.max(0, get("resistenciaEspiritual") * 5),
    "system.resources.disposicao.max": Math.max(1, 6 + get("resistencia")),
    "system.resources.carga.max": Math.max(0, 5 + get("forca"))
  };
  await actor.update(updates);
});

Hooks.on("updateActor", async (actor, changes) => {
  if (!changes.system?.attributes) return;
  const attrs = actor.system.attributes ?? {};
  const get = (key) => Number(attrs[key]?.value ?? 0);
  await actor.update({
    "system.resources.pv.max": Math.max(1, get("resistencia") * 5),
    "system.resources.pm.max": Math.max(0, get("resistenciaEspiritual") * 5),
    "system.resources.disposicao.max": Math.max(1, 6 + get("resistencia")),
    "system.resources.carga.max": Math.max(0, 5 + get("forca"))
  }, { recursive: false });
});
