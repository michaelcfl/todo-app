import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './module/item/item.module';
import { UserModule } from './module/user/user.module';
import * as defaultOption from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return Object.assign(
          {},
          { ...defaultOption[0].options, synchronize: true }, // synchronize should be false for production
        );
      },
    }),
    UserModule,
    ItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
