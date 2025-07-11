import { Router } from "express";
import { ChatControllers } from "./chat.controller";

const router = Router()

router.post('/',ChatControllers.chatWithOllama)

export const ChatRoutes = router