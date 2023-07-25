import { ApiProperty } from "@nestjs/swagger"

export class MemberRegisterRequestDTO {
  @ApiProperty()
  email: String

  @ApiProperty()
  password: String
}