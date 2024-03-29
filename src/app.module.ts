import { join } from 'path';

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver } from '@nestjs/apollo';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';
import { ListItemModule } from './list-item/list-item.module';

type OriginalError = {
  message?: string;
  error?: string;
  statusCode?: number;
};

type Extensions = {
  code: string;
  stacktrace: string[];
  status: number;
  originalError?: OriginalError;
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   // debug: false,
    //   playground: false,
    //   plugins: [ApolloServerPluginLandingPageLocalDefault()],
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   formatError: (error) => {
    //     const message = error.message;
    //     const extensions = error.extensions as Extensions;
    //     return {
    //       message,
    //       error: extensions?.originalError,
    //       // error: extensions?.originalError?.error,
    //       // statusCode: extensions?.originalError?.statusCode,
    //     };
    //   },
    // }),
    // Carga asincrona del playground y el esquema de graphql con lo cual se puede validar primero el token antes de cargar el esquema
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService],
      useFactory: async (/*jwtServices: JwtService*/) => ({
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        // context: ({ req }) => {
        //   const token = req.headers.authorization?.replace('Bearer ', '');
        //   jwtServices.verify(token);
        // },
        formatError: (error) => {
          const message = error.message;
          const extensions = error.extensions as Extensions;
          return {
            message,
            error: extensions?.originalError,
          };
        },
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ssl: process.env.STATE === 'prod' ? { rejectUnauthorized: false } : false,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    ItemsModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
    ListsModule,
    ListItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
