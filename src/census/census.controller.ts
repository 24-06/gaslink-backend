import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards, ParseIntPipe, Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CensusService } from './census.service';
import { CreateCensusDto } from './dto/create-census.dto';
import { UpdateCensusDto } from './dto/update-census.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('census')
@UseGuards(JwtAuthGuard)
export class CensusController {
  constructor(private readonly censusService: CensusService) {}

  @Get()
  findAll(
    @Query('department') department?: string,
    @Query('municipality') municipality?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.censusService.findAll({
      department,
      municipality,
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 50,
    });
  }

  @Get('stats')
  getStats() {
    return this.censusService.getStats();
  }

  @Get('export/csv')
  async exportCsv(@Res() res: Response) {
    const records = await this.censusService.exportAll();
    const headers = [
      'ID', 'Nombre', 'Documento', 'Dirección', 'Teléfono', 'Email',
      'Tipo Propiedad', 'Estrato', 'Estado', 'Departamento', 'Municipio', 'Fecha',
    ];
    const rows = records.map((r) => [
      r.id, r.fullName, r.idDocument, r.address, r.phone, r.email,
      r.propertyType, r.estrato, r.status, r.department, r.municipality,
      new Date(r.createdAt).toISOString(),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="censo_gaslink_${Date.now()}.csv"`);
    res.send('\uFEFF' + csv); // BOM para Excel
  }

  @Get('check/:idDocument')
  findByDocument(@Param('idDocument') idDocument: string) {
    return this.censusService.findByDocument(idDocument);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.censusService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCensusDto) {
    return this.censusService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCensusDto) {
    return this.censusService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.censusService.remove(id);
  }
}