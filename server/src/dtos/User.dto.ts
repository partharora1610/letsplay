import { Prisma } from "@prisma/client"

const UserDto = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
})

export default UserDto
