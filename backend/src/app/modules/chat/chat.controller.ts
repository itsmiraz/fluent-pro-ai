import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ChatServices } from "./chat.services";

const chatWithOllama = catchAsync(async (req, res) => {
      const { history } = req.body;
        if (!history || !Array.isArray(history)) {
    return res.status(400).json({ message: 'Invalid history array' });
  }

  const result = await ChatServices.chatWithOllama({messages:history});

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: 'data',
  });
});

export const ChatControllers = {
    chatWithOllama
}