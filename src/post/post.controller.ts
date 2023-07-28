import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { PostService } from "./post.service";
import { ApiExtraModels, ApiOperation, ApiQuery, ApiTags, getSchemaPath } from "@nestjs/swagger";
import { PostCreateRequestDTO, PostRequestQueryDTO, PostUpdateRequestDTO } from "./dto/request/post.request.dto";
import { PostSearch } from "./post.entity";
import { Pageable } from "src/util/page";
import { OrderType } from "src/util/order";
import { CommentService } from "src/comment/comment.service";

@Controller("api/v1/posts")
@ApiTags("게시글 API")
export class PostController {
  constructor(private postService: PostService, private commentService: CommentService) {}

  @Get(":id")
  @ApiOperation({ summary: "게시글 단건 조회 API", description: "게시글 단건을 조회한다." })
  getPost(@Param("id") id: number) {
    return this.postService.getPost(id);
  }

  @Get()
  @ApiOperation({
    summary: "게시글 복수건 조회 API (페이지네이션)",
    description: "게시글 복수건을 조회한다.\n\n page는 1부터 시작",
  })
  @ApiExtraModels(PostSearch, Pageable)
  @ApiQuery({
    name: "search",
    required: true,
    style: "deepObject",
    type: "object",
    schema: {
      $ref: getSchemaPath(PostSearch),
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
  getPosts(@Query() requestDTO: PostRequestQueryDTO) {
    return this.postService.getPosts(requestDTO);
  }

  @Get(":postId/comments")
  @ApiOperation({ summary: "게시글 댓글 조회 API", description: "게시글의 댓글을 조회한다." })
  getPostComments(@Param("postId") postId: number) {
    return this.commentService.getCommentsByPostId(postId);
  }

  @Post()
  @ApiOperation({ summary: "게시글 생성 API", description: "게시글을 생성한다." })
  createPost(@Body() requestDTO: PostCreateRequestDTO) {
    return this.postService.createPost(requestDTO);
  }

  @Put(":id")
  @ApiOperation({ summary: "게시글 정보 수정 API", description: "게시글 정보를 수정한다." })
  updatePost(@Param("id") id: number, @Body() requestDTO: PostUpdateRequestDTO) {
    return this.postService.updatePost(id, requestDTO);
  }

  @Delete(":id")
  @ApiOperation({ summary: "게시글 삭제 API", description: "게시글을 삭제한다. (연관된 데이터 모두 삭제)" })
  deletePost(@Param("id") id: number) {
    return this.postService.deletePost(id);
  }
}
