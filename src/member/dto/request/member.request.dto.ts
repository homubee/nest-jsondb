import { ApiProperty } from "@nestjs/swagger";
import { MemberSearch } from "src/member/member.entity";
import { Pageable } from "src/util/page";
import { OrderType } from "src/util/order";

export class MemberRegisterRequestDTO {
  @ApiProperty()
  email: String;

  @ApiProperty()
  password: String;
}

export class MemberRequestQueryDTO {
  @ApiProperty()
  search?: MemberSearch;

  @ApiProperty()
  orderby?: OrderType;

  @ApiProperty()
  pageable: Pageable;
}
