import { Module } from "@nestjs/common";
import { BoardController } from "./board.controller";
import { BoardService } from "./board.service";
import { PostModule } from "src/post/post.module";

@Module({
  imports: [PostModule],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
