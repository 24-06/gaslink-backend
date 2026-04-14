import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Census } from './census.entity';
import { CreateCensusDto } from './dto/create-census.dto';
import { UpdateCensusDto } from './dto/update-census.dto';

@Injectable()
export class CensusService {
  constructor(
    @InjectRepository(Census)
    private censusRepository: Repository<Census>,
  ) {}

  findAll(filters?: {
    department?: string;
    municipality?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<Census[]> {
    const query = this.censusRepository
      .createQueryBuilder('census')
      .orderBy('census.createdAt', 'DESC');

    if (filters?.department)
      query.andWhere('census.department = :dep', { dep: filters.department });
    if (filters?.municipality)
      query.andWhere('census.municipality = :mun', { mun: filters.municipality });
    if (filters?.search) {
      query.andWhere(
        '(census.fullName LIKE :q OR census.idDocument LIKE :q OR census.address LIKE :q)',
        { q: `%${filters.search}%` },
      );
    }

    const limit = filters?.limit || 50;
    const page = filters?.page || 1;
    query.skip((page - 1) * limit).take(limit);

    return query.getMany();
  }

  async countAll(filters?: {
    department?: string;
    municipality?: string;
    search?: string;
  }): Promise<number> {
    const query = this.censusRepository.createQueryBuilder('census');
    if (filters?.department)
      query.andWhere('census.department = :dep', { dep: filters.department });
    if (filters?.municipality)
      query.andWhere('census.municipality = :mun', { mun: filters.municipality });
    if (filters?.search) {
      query.andWhere(
        '(census.fullName LIKE :q OR census.idDocument LIKE :q OR census.address LIKE :q)',
        { q: `%${filters.search}%` },
      );
    }
    return query.getCount();
  }

  async findOne(id: number): Promise<Census> {
    const record = await this.censusRepository.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`Registro #${id} no encontrado`);
    return record;
  }

  async findByDocument(idDocument: string): Promise<Census | null> {
    return this.censusRepository.findOne({ where: { idDocument } });
  }

  create(dto: CreateCensusDto): Promise<Census> {
    const census = this.censusRepository.create(dto);
    return this.censusRepository.save(census);
  }

  async update(id: number, dto: UpdateCensusDto): Promise<Census> {
    const existing = await this.findOne(id);
    Object.assign(existing, dto);
    return this.censusRepository.save(existing);
  }

  async remove(id: number): Promise<void> {
    const existing = await this.findOne(id);
    await this.censusRepository.remove(existing);
  }

  async getStats() {
    const total = await this.censusRepository.count();
    const byDept = await this.censusRepository
      .createQueryBuilder('c')
      .select('c.department', 'department')
      .addSelect('COUNT(*)', 'count')
      .groupBy('c.department')
      .orderBy('count', 'DESC')
      .getRawMany();
    const byStatus = await this.censusRepository
      .createQueryBuilder('c')
      .select('c.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('c.status')
      .getRawMany();
    const byPropertyType = await this.censusRepository
      .createQueryBuilder('c')
      .select('c.propertyType', 'propertyType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('c.propertyType')
      .getRawMany();
    return { total, byDept, byStatus, byPropertyType };
  }

  async exportAll(): Promise<Census[]> {
    return this.censusRepository.find({ order: { createdAt: 'DESC' } });
  }
}