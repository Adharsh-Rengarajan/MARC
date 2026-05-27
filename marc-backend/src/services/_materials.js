import { MATERIAL_KEYS } from "../models/project.js";
import { AppError } from "../utils/errors.js";

export const sanitizeMaterials = (input = {}) => {
  const out = {};
  for (const k of MATERIAL_KEYS) {
    const v = Number(input[k] || 0);
    if (Number.isNaN(v) || v < 0) {
      throw new AppError(422, "INVALID_MATERIAL", `Invalid value for ${k}`);
    }
    out[k] = v;
  }
  return out;
};

export const sanitizeUnitCost = (input = {}) => {
  const out = {};
  for (const k of MATERIAL_KEYS) {
    const v = Number(input[k] || 0);
    if (Number.isNaN(v) || v < 0) {
      throw new AppError(422, "INVALID_UNIT_COST", `Invalid unit cost for ${k}`);
    }
    out[k] = v;
  }
  return out;
};

export const sumMaterials = (a = {}, b = {}) => {
  const out = {};
  for (const k of MATERIAL_KEYS) {
    out[k] = (a[k] || 0) + (b[k] || 0);
  }
  return out;
};

export const subtractMaterials = (a = {}, b = {}) => {
  const out = {};
  for (const k of MATERIAL_KEYS) {
    out[k] = Math.max(0, (a[k] || 0) - (b[k] || 0));
  }
  return out;
};

export const computeCost = (materials, unitCost) => {
  let total = 0;
  for (const k of MATERIAL_KEYS) {
    total += (materials[k] || 0) * (unitCost[k] || 0);
  }
  return total;
};

export const validateWithinAllocation = (project, requestedMaterials) => {
  const violations = [];
  for (const k of MATERIAL_KEYS) {
    const cap = project.allocation?.[k] || 0;
    const inFlight = (project.requested?.[k] || 0) + (project.delivered?.[k] || 0);
    const want = requestedMaterials[k] || 0;
    if (want + inFlight > cap) {
      violations.push({
        material: k,
        requested: want,
        available: Math.max(0, cap - inFlight),
        allocation: cap,
      });
    }
  }
  if (violations.length) {
    throw new AppError(
      400,
      "ALLOCATION_EXCEEDED",
      `Request exceeds project allocation: ${violations.map((v) => `${v.material} (asked ${v.requested}, available ${v.available})`).join(", ")}`
    );
  }
};

export const validateWithinInventory = (project, usedMaterials) => {
  const violations = [];
  for (const k of MATERIAL_KEYS) {
    const onHand = Math.max(0, (project.delivered?.[k] || 0) - (project.consumed?.[k] || 0));
    const want = usedMaterials[k] || 0;
    if (want > onHand) {
      violations.push({ material: k, used: want, onHand });
    }
  }
  if (violations.length) {
    throw new AppError(
      400,
      "INSUFFICIENT_INVENTORY",
      `Usage exceeds inventory on site: ${violations.map((v) => `${v.material} (using ${v.used}, on hand ${v.onHand})`).join(", ")}`
    );
  }
};

export const validateWithinBudget = (project, additionalCost) => {
  const remaining = (project.budget || 0) - (project.spent || 0);
  if (additionalCost > remaining) {
    throw new AppError(
      400,
      "BUDGET_EXCEEDED",
      `Purchase cost $${additionalCost.toLocaleString()} exceeds remaining project budget $${remaining.toLocaleString()}`
    );
  }
};
