import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Unique(['email'])
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @CreateDateColumn({
    name: 'created_at',
    default: `now()`,
    nullable: true,
  })
  createdAt: string;

  @UpdateDateColumn({
    name: 'updated_at',
    default: `now()`,
    nullable: true,
  })
  updatedAt: string;

  @Column({
    name: 'email_verified_at',
    default: null,
    nullable: true,
  })
  emailVerifiedAt: string;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
