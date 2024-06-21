import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { IsEmail, Length, Matches } from 'class-validator';
import { Position } from './Position';

@Entity('user')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(2, 60)
    name: string;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column({ unique: true })
    @Matches(/^\+380\d{9}$/)
    phone: string;

    @Column()
    position_id: number;

    @Column()
    photo: string;

    @ManyToOne(() => Position, position => position.users)
    @JoinColumn({ name: 'position_id' })
    position: Position;

}