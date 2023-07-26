import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BoardService } from './board.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BoardRequestDTO } from './dto/request/board.request.dto';

@Controller("api/v1/boards")
@ApiTags("게시판 API")
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get(":id")
  @ApiOperation({ summary: "게시판 단건 조회 API", description: "게시판 단건을 조회한다." })
  getBoard(@Param("id") id: number) {
    return this.boardService.getBoard(id);
  }

  @Get()
  @ApiOperation({ summary: "게시판 복수건 조회 API", description: "게시판 복수건을 조회한다." })
  getBoards() {
    return this.boardService.getBoards();
  }

  @Post()
  @ApiOperation({ summary: "게시판 생성 API", description: "게시판을 생성한다." })
  createBoard(@Body() requestDTO: BoardRequestDTO) {
    return this.boardService.createBoard(requestDTO);
  }

  @Put(":id")
  @ApiOperation({ summary: "게시판 정보 수정 API", description: "게시판 정보를 수정한다." })
  updateBoard(@Param("id") id: number, @Body() requestDTO: BoardRequestDTO) {
    return this.boardService.updateBoard(id, requestDTO);
  }

  @Delete(":id")
  @ApiOperation({ summary: "게시판 삭제 API", description: "게시판을 삭제한다. (연관된 데이터 모두 삭제)" })
  deleteBoard(@Param("id") id: number) {
    return this.boardService.deleteBoard(id);
  }
}
