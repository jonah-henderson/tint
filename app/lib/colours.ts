import { Colour } from "@prisma/client";

export const bgGradientFromColour: { [key in Colour]: string } = {
  "RED": "from-red-700 to-red-600",
  "ORANGE": "from-orange-700 to-orange-600",
  "YELLOW": "from-yellow-700 to-yellow-600",
  "GREEN": "from-green-700 to-green-600",
  "BLUE": "from-blue-700 to-blue-600",
  "PURPLE": "from-purple-700 to-purple-600",
}
