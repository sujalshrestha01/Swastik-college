import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listPlacementPartners,
  createPlacementPartner,
  updatePlacementPartner,
  deletePlacementPartner,
} from "../controllers/placementPartnersController.js";

const router = Router();

router.get("/", listPlacementPartners);
router.post("/", requireAuth, createPlacementPartner);
router.put("/:id", requireAuth, updatePlacementPartner);
router.delete("/:id", requireAuth, deletePlacementPartner);

export default router;
