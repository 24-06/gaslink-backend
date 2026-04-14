import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Census } from './census.entity';
import { CensusService } from './census.service';
import { CensusController } from './census.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Census])],
  providers: [CensusService],
  controllers: [CensusController],
  exports: [CensusService],
})
export class CensusModule {}
