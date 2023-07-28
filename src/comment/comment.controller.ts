import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CommentService } from "./comment.service";
import { CommentCreateRequestDTO, CommentUpdateRequestDTO } from "./dto/request/comment.request.dto";

@Controller("api/v1/comments")
@ApiTags("댓글 API")
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get(":id")
  @ApiOperation({ summary: "댓글 단건 조회 API", description: "댓글 단건을 조회한다." })
  getComment(@Param("id") id: number) {
    return this.commentService.getComment(id);
  }

  @Get()
  @ApiOperation({ summary: "댓글 복수건 조회 API", description: "댓글 복수건을 조회한다." })
  getComments() {
    return this.commentService.getComments();
  }

  @Post()
  @ApiOperation({ summary: "댓글 생성 API", description: "댓글을 생성한다." })
  createComment(@Body() requestDTO: CommentCreateRequestDTO) {
    return this.commentService.createComment(requestDTO);
  }

  @Put(":id")
  @ApiOperation({ summary: "댓글 정보 수정 API", description: "댓글 정보를 수정한다." })
  updateComment(@Param("id") id: number, @Body() requestDTO: CommentUpdateRequestDTO) {
    return this.commentService.updateComment(id, requestDTO);
  }

  @Delete(":id")
  @ApiOperation({ summary: "댓글 삭제 API", description: "댓글을 삭제한다. (연관된 데이터 모두 삭제)" })
  deleteComment(@Param("id") id: number) {
    return this.commentService.deleteComment(id);
  }
}
