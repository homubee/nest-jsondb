import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { MemberService } from "./member.service";
import { ApiExtraModels, ApiOperation, ApiQuery, ApiTags, getSchemaPath } from "@nestjs/swagger";
import { MemberRequestQueryDTO, MemberRegisterRequestDTO } from "./dto/request/member.request.dto";
import { MemberSearch } from "./member.entity";
import { Pageable } from "src/util/page";
import { OrderType } from "src/util/order";

@Controller("api/v1/members")
@ApiTags("회원 API")
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get(":id")
  @ApiOperation({ summary: "회원 단건 조회 API", description: "회원 단건을 조회한다." })
  getMember(@Param("id") id: number) {
    return this.memberService.getMember(id);
  }

  @Get()
  @ApiOperation({
    summary: "회원 복수건 조회 API (페이지네이션)",
    description: "회원 복수건을 조회한다.\n\n page는 1부터 시작",
  })
  @ApiExtraModels(MemberSearch, Pageable)
  @ApiQuery({
    name: "search",
    required: true,
    style: "deepObject",
    type: "object",
    schema: {
      $ref: getSchemaPath(MemberSearch),
    },
  })
  @ApiQuery({
    name: "pageable",
    required: true,
    style: "deepObject",
    type: "object",
    schema: {
      $ref: getSchemaPath(Pageable),
    },
  })
  @ApiQuery({
    name: "orderby",
    required: false,
    description: "orderby",
    enum: OrderType,
  })
  getMembers(@Query() queryDTO: MemberRequestQueryDTO) {
    return this.memberService.getMembers(queryDTO);
  }

  @Post()
  @ApiOperation({ summary: "회원 생성 API", description: "회원을 생성한다." })
  createMember(@Body() requestDTO: MemberRegisterRequestDTO) {
    return this.memberService.createMember(requestDTO);
  }

  @Put(":id")
  @ApiOperation({ summary: "회원 정보 수정 API", description: "회원 정보를 수정한다." })
  updateMember(@Param("id") id: number, @Body() requestDTO: MemberRegisterRequestDTO) {
    return this.memberService.updateMember(id, requestDTO);
  }

  @Delete(":id")
  @ApiOperation({ summary: "회원 삭제 API", description: "회원을 삭제한다. (연관된 데이터 모두 삭제)" })
  deleteMember(@Param("id") id: number) {
    return this.memberService.deleteMember(id);
  }
}
