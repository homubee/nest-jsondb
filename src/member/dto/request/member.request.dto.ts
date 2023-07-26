import { ApiProperty } from "@nestjs/swagger"
import { MemberSearch } from "src/member/member.entity"
import { Pageable } from "src/util/page"
import { SortType } from "src/util/sort"

export class MemberRegisterRequestDTO {
  @ApiProperty()
  email: String

  @ApiProperty()
  password: String
}

export class MemberRequestQueryDTO {
  @ApiProperty()
  search?: MemberSearch

  @ApiProperty()
  sort?: SortType

  @ApiProperty()
  pageable: Pageable
}