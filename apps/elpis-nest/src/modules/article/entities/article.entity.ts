/* eslint-disable */
import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  VersionColumn,
} from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';

export class Article extends BaseEntity {}
