import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventsController.js";

const router = Router();

router.get("/", listEvents);
router.post("/", requireAuth, createEvent);
router.put("/:id", requireAuth, updateEvent);
router.delete("/:id", requireAuth, deleteEvent);

export default router;
