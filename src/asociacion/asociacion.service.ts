import { Injectable } from '@nestjs/common';
import { CreateAsociacionDto } from './dto/create-asociacion.dto';
import { UpdateAsociacionDto } from './dto/update-asociacion.dto';

@Injectable()
export class AsociacionService {
  create(createAsociacionDto: CreateAsociacionDto) {
    return 'This action adds a new asociacion';
  }

  findAll() {
    return `This action returns all asociacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} asociacion`;
  }

  update(id: number, updateAsociacionDto: UpdateAsociacionDto) {
    return `This action updates a #${id} asociacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} asociacion`;
  }
}
