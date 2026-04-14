import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('census')
export class Census {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  idDocument: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  propertyType: string; // Residential, Commercial, Industrial

  @Column()
  estrato: number; // 1 to 6

  @Column()
  status: string; // Active, Inactive, Pending

  @Column()
  department: string;

  @Column()
  municipality: string;

  @CreateDateColumn()
  createdAt: Date;
}
