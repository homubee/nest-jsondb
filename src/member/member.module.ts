import { Module } from "@nestjs/common";
import { MemberController } from "./member.controller";
import { MemberService } from "./member.service";
import { PostModule } from "src/post/post.module";

@Module({
  imports: [PostModule],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
