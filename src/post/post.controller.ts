import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { ApiExtraModels, ApiOperation, ApiQuery, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { PostCreateRequestDTO, PostUpdateRequestDTO } from './dto/request/post.request.dto';
import { PostSearch } from './post.entity';
import { Pageable } from 'src/util/page';
import { SortType } from 'src/util/sort';

@Controller("/api/v1/posts")
@ApiTags("게시글 API")
export class PostController {
  constructor(private postService: PostService) {}

  @Get("/:id")
  @ApiOperation({ summary: "게시글 단건 조회 API", description: "게시글 단건을 조회한다." })
  getPost(@Param("id") id: string) {
    return this.postService.getPost(parseInt(id));
  }

  @Get()
  @ApiOperation({ summary: "게시글 복수건 조회 API (페이지네이션)", description: "게시글 복수건을 조회한다.\n\n page는 1부터 시작" })
  @ApiQuery({
    name: "title",
    required: false,
    description: "title"
  })
  @ApiExtraModels(Pageable)
  @ApiQuery({
    name: "pageable",
    required: true,
    style: "deepObject",
    explode: true,
    type: "object",
    schema: {
      $ref: getSchemaPath(Pageable)
    }
  })
  @ApiQuery({
    name: "sort",
    required: false,
    description: "sort",
    enum: SortType
  })
  getPosts(@Query() query) {
    const postSearch: PostSearch = {
      title: query.title
    }
    const pageable: Pageable = {
      page: parseInt(query.pageable.page),
      size: parseInt(query.pageable.size)
    }
    return this.postService.getPosts(postSearch, pageable, query.sort);
  }

  @Post()
  @ApiOperation({ summary: "게시글 생성 API", description: "게시글을 생성한다." })
  createPost(@Body() requestDTO: PostCreateRequestDTO) {
    return this.postService.createPost(requestDTO);
  }

  @Put("/:id")
  @ApiOperation({ summary: "게시글 정보 수정 API", description: "게시글 정보를 수정한다." })
  updatePost(@Param("id") id: string, @Body() requestDTO: PostUpdateRequestDTO) {
    return this.postService.updatePost(parseInt(id), requestDTO);
  }

  @Delete("/:id")
  @ApiOperation({ summary: "게시글 삭제 API", description: "게시글을 삭제한다. (연관된 데이터 모두 삭제)" })
  deletePost(@Param("id") id: string) {
    return this.postService.deletePost(parseInt(id));
  }
}
